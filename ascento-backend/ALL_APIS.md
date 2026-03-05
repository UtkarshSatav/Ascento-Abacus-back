# School ERP Backend (Production-Ready)

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- RBAC Authorization
- Joi Validation
- Cloudinary Upload Support
- node-cron Reminder Jobs
- Swagger Documentation
- dotenv Environment Config

## Scalable Project Structure

```text
src/
  controllers/
  routes/
  models/
  middlewares/
  services/
  utils/
  config/
  validators/
  docs/
server.js
```

## Roles and Access
- Admin: Full access
- Teacher: Assigned classes/students only
- Student: Own data only
- Parent: Own child data only

## Supported Domains
- Vedic Math
- Abacus
- Generic School (Class 1 to Class 12)

Students are mapped to:
- domain
- class
- section

## Authentication APIs

### `POST /auth/admin/login`
- Body: `email`, `password`
- Response: `accessToken`, `refreshToken`, `user`
- Errors: `401`

### `POST /auth/teacher/login`
- Body: `email`, `password`
- Response: JWT tokens + user
- Errors: `401`

### `POST /auth/student/login`
- Body: `identifier` (username/roll), `password`
- Response: JWT tokens + user
- Errors: `401`

### `POST /auth/parent/request-otp`
- Body: `phone` or `email`
- Response: OTP generation acknowledgement
- Errors: `404`

### `POST /auth/parent/login`
- Body: `phone` or `email`, plus `password` or `otp`
- Response: JWT tokens + user
- Errors: `401`

### `POST /auth/refresh`
- Body: `refreshToken`
- Response: new `accessToken`

### `GET /auth/me`
- Auth required
- Response: current user profile

## Teacher Application APIs

### `POST /teacher/apply`
- Public API
- Body: `fullName`, `email`, `phone`, `qualification`, `experience`, `subjects`, `domainId`, `resume/resumeBase64`, `profilePhoto/profilePhotoBase64`
- Stores into `teacherApplications`

### `GET /admin/teacher-applications`
- Admin only
- Query: `status`, `search`, `page`, `limit`

### `POST /admin/approve-teacher/:id`
- Admin only
- Approves application and auto-creates teacher account
- Returns generated teacher credentials

### `POST /admin/reject-teacher/:id`
- Admin only
- Body: `remark`

## Admin Panel APIs

### Core Create APIs
- `POST /admin/create-teacher`
- `POST /admin/create-student`
- `POST /admin/create-class`
- `POST /admin/create-subject`
- `POST /admin/assign-teacher`

### Dashboard and Analytics
- `GET /admin/dashboard`
- `GET /admin/analytics`

`/admin/dashboard` response includes:
- `totalStudents`
- `totalTeachers`
- `totalClasses`
- `attendanceToday`
- `upcomingClasses`
- `recentActivities`

### Export APIs
- `GET /admin/export/students`
- `GET /admin/export/report-card/:studentId`

## Student Management APIs
- `POST /students` (Admin)
- `GET /students`
- `GET /students/:id`
- `PUT /students/:id`
- `GET /students/:id/progress`

Student create payload supports:
- `fullName`, `dateOfBirth`, `gender`
- `domainId`, `classId`, `className`, `section`, `rollNumber`
- `parentName`, `parentPhone`, `parentEmail`
- `address`, `admissionDate`, `previousSchool`, `previousMarks`
- `profilePhoto`, `profilePhotoBase64`, `documents`, `documentUploads`

Student creation behavior:
- student credentials auto-generated
- parent linked/created automatically

## Teacher Panel APIs
- `GET /teacher/classes`
- `GET /teacher/students`
- `POST /teacher/attendance`
- `POST /teacher/marks`
- `POST /teacher/add-marks`
- `POST /teacher/assignment`
- `POST /teacher/announcement`
- `POST /teacher/publish-content`
- `POST /teacher/schedule-class`

## Content Publishing APIs

### `POST /teacher/publish-content`
Content types:
- `notes`
- `pdf`
- `video`
- `assignment`
- `announcement`

Fields:
- `title`, `description`, `contentType`
- `domainId`, `classId`, `subjectId`
- `file` or `fileBase64`
- `videoLink`

### `GET /student/content`
- Student sees only own domain/class content

## Online Class Scheduling APIs

### `POST /teacher/schedule-class`
Fields:
- `title`, `description`
- `domainId`, `classId`, `subjectId`
- `date`, `startTime`, `endTime`
- `meetingLink`

### Upcoming Class APIs
- `GET /student/upcoming-classes`
- `GET /parent/upcoming-classes`

## Reminder System
- Background job: `node-cron` (every minute)
- Reminder triggers:
  - 30 minutes before class
  - 10 minutes before class
- Delivery channels:
  - push notification
  - email notification
- Stored in `notifications` collection

## Attendance and Results

### Attendance
- `POST /teacher/attendance`
- `GET /attendance/class/:id`
- `GET /attendance/student/:id`
- Status: `present`, `absent`, `late`

### Exam and Marks
- `POST /exams`
- `GET /exams`
- `POST /teacher/add-marks` (alias of teacher marks API)
- `POST /marks`
- `GET /marks/student/:id`
- `GET /marks/exam/:id`

Exam types:
- `UNIT_TEST`
- `MID_TERM`
- `FINAL_EXAM`

### Student Result APIs
- `GET /student/results`
- `GET /results/student/:id`
- `POST /results/student/:id/generate`
- `GET /results/student/:id/report-card`

Result payload includes:
- subject-wise marks
- total marks
- percentage
- grade

## Parent Portal APIs
- `GET /parent/student`
- `GET /parent/attendance`
- `GET /parent/results`
- `GET /parent/upcoming-classes`
- `GET /parent/report-card`

## Domain/Class/Subject APIs
- `POST /domains`, `GET /domains`
- `POST /classes`, `GET /classes`, `POST /classes/:id/assign-teacher`
- `POST /subjects`, `GET /subjects`, `POST /subjects/:id/assign-teacher`

## Database Models Implemented
- User
- Student
- Teacher
- Parent
- TeacherApplication
- Domain
- Class
- Subject
- Attendance
- Exam
- Marks
- Result
- Content
- Assignment
- OnlineClass
- Notification

## Production Features Included
- Pagination/filtering/search
- Cloudinary file upload support
- Joi request validation
- Rate limiting + Helmet
- Centralized error handler
- Logging
- JWT + RBAC auth

## API Testing Assets
- Postman collection: `docs/School_ERP.postman_collection.json`
- Seed script: `npm run seed`

Seed coverage:
- 1 admin
- 5 teachers
- 50 students
- 10+ classes (Generic + domain classes)
- Subjects

## Swagger Docs
- `GET /docs`
- `GET /docs.json`
