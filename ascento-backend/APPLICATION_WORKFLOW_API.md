# Application Workflow API

Base URL: `/{your-backend-host}`

This file is the single reference for the new public application flow and the admin approval flow.

## 1. Parent admission form

### Submit admission application
`POST /admission/apply`

Required for student application:

- student full name
- date of birth
- gender
- domain
- parent/guardian name
- parent/guardian phone

Optional but supported:

- profile photo
- document file upload
- previous school and previous marks
- medical notes
- blood group
- income/occupation
- academic year
- class preference

Accepted document examples:

- birth certificate
- Aadhaar/passport
- transfer certificate
- previous marksheet

```json
{
  "studentFullName": "Aarav Sharma",
  "dateOfBirth": "2016-05-12",
  "gender": "male",
  "academicYear": "2026-2027",
  "bloodGroup": "B+",
  "domainId": "67ca1234abcd1234abcd1234",
  "classId": "67ca1234abcd1234abcd9999",
  "parentName": "Neha Sharma",
  "guardianRelation": "mother",
  "parentPhone": "9876543210",
  "alternatePhone": "9876543211",
  "parentEmail": "neha@example.com",
  "occupation": "Business",
  "annualIncome": 750000,
  "address": "Jaipur, Rajasthan",
  "previousSchool": "Little Stars School",
  "previousMarks": [
    {
      "examName": "Final Exam",
      "percentage": 91,
      "year": 2025
    }
  ],
  "profilePhotoBase64": "data:image/jpeg;base64,...",
  "documentUploads": [
    {
      "name": "Birth Certificate",
      "base64": "data:application/pdf;base64,..."
    },
    {
      "name": "Previous Marksheet",
      "base64": "data:application/pdf;base64,..."
    }
  ],
  "medicalNotes": "No allergies",
  "note": "Need admission for new academic session"
}
```

For a first-time child or new admission, the form can be submitted even without previous school data, previous marks, profile photo, or documents.

Response:

```json
{
  "_id": "67ca9999abcd1234abcd1234",
  "applicationCode": "ADM483920",
  "studentFullName": "Aarav Sharma",
  "status": "pending"
}
```

## 2. Teacher apply form

### Submit teacher application
`POST /teacher/apply`

Required for teacher application:

- numeric `experience`
- qualification
- at least one subject
- CV/resume file

Optional but supported:

- profile photo
- specialization
- current organization
- address
- cover letter
- availability date
- salary expectation
- notice period

```json
{
  "fullName": "Pooja Mehta",
  "email": "pooja@example.com",
  "phone": "9988776655",
  "qualification": "M.Sc, B.Ed",
  "experience": 5,
  "subjects": ["Math", "Science"],
  "domainId": "67ca1234abcd1234abcd1234",
  "specialization": "Primary Mathematics",
  "currentOrganization": "Bright Future School",
  "address": "Ahmedabad, Gujarat",
  "coverLetter": "I have handled primary and middle school batches.",
  "noticePeriodDays": 30,
  "expectedSalary": 42000,
  "availabilityDate": "2026-04-15",
  "resumeBase64": "data:application/pdf;base64,...",
  "profilePhotoBase64": "data:image/jpeg;base64,..."
}
```

Response includes generated `applicationCode` and `pending` status.

## 3. Admin panel application listing

### List student applications
`GET /admin/student-applications?status=pending&search=aarav`

### List teacher applications
`GET /admin/teacher-applications?status=pending&search=pooja`

Both endpoints require:

```text
Authorization: Bearer {adminAccessToken}
```

The response includes:

- full application details
- uploaded file URLs
- review status
- created student/teacher reference after approval

This is what the admin portal should use to render the accept/reject screens.

## 4. Admin approval actions

### Approve student application
`POST /admin/approve-student/:applicationId`

```json
{
  "classId": "67ca1234abcd1234abcd9999",
  "rollNumber": "ROLL-1A-001",
  "admissionDate": "2026-04-01",
  "remark": "Approved for new session"
}
```

Response includes:

```json
{
  "application": {
    "status": "approved"
  },
  "student": {
    "studentCode": "STU482193",
    "rollNumber": "ROLL-1A-001"
  },
  "studentCredentials": {
    "studentId": "STU482193",
    "rollNumber": "ROLL-1A-001",
    "username": "sturoll1a001",
    "password": "generated-password"
  },
  "parentCredentials": {
    "phone": "9876543210",
    "password": "generated-password"
  }
}
```

Portal behavior:

- Admin clicks `Accept`
- Backend creates the actual student account and parent link
- Student login can immediately use `rollNumber + password`
- Parent login can use generated parent credentials
- Admin clicks `Reject` if application should not proceed
- Reject only updates application status and remark

### Reject student application
`POST /admin/reject-student/:applicationId`

```json
{
  "remark": "Seat not available"
}
```

### Approve teacher application
`POST /admin/approve-teacher/:applicationId`

Response includes:

```json
{
  "application": {
    "status": "approved"
  },
  "teacher": {
    "teacherCode": "TCH194825"
  },
  "credentials": {
    "teacherId": "TCH194825",
    "email": "pooja@example.com",
    "password": "generated-password"
  }
}
```

Portal behavior:

- Admin clicks `Accept`
- Backend creates the actual teacher account
- Teacher login can immediately use `email + password`
- Teacher ID is also stored for admin-side tracking/reference
- Admin clicks `Reject` if profile should not proceed
- Reject only updates application status and remark

### Reject teacher application
`POST /admin/reject-teacher/:applicationId`

```json
{
  "remark": "Profile does not match current vacancy"
}
```

## 5. Login after approval

### Teacher login
`POST /auth/teacher/login`

Main login for teacher panel:

```json
{
  "email": "pooja@example.com",
  "password": "generated-password"
}
```

Teacher ID is also supported if needed:

```json
{
  "identifier": "TCH194825",
  "password": "generated-password"
}
```

or

```json
{
  "email": "pooja@example.com",
  "password": "generated-password"
}
```

### Student login
`POST /auth/student/login`

Main login for student app:

```json
{
  "identifier": "ROLL-1A-001",
  "password": "generated-password"
}
```

Also supported as `identifier`:

- `studentId` like `STU482193`
- `rollNumber`
- generated `username`

## 6. Main admin panel flow

1. Website submits `POST /admission/apply` or `POST /teacher/apply`.
2. Admin panel fetches pending items from `GET /admin/student-applications` and `GET /admin/teacher-applications`.
3. Admin opens application details and clicks `Accept` or `Reject`.
4. On `Accept`, backend creates the real student/teacher account plus login credentials.
5. Student login uses `rollNumber + password`.
6. Teacher login uses `email + password`.
7. On `Reject`, backend only updates the application status and review remark.
