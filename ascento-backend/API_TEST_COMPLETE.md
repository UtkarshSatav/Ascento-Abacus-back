# School ERP — Complete API Documentation & Test Guide

Comprehensive API reference with curl examples for all endpoints.

## Prerequisites & Setup

```bash
# Install dependencies
npm install

# Set up environment variables (.env file)
PORT=4000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_ACCESS_SECRET=secret123
JWT_REFRESH_SECRET=refreshsecret123
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Start server
npm run dev
```

**Base URL:** `http://localhost:4000`

---

## 1. Authentication Module

### 1.1 Seed Admin (One-time Only)
**Endpoint:** `POST /api/auth/seed-admin`

```bash
curl -X POST http://localhost:4000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Principal Admin",
    "email": "admin@school.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "admin_id",
    "fullName": "Principal Admin",
    "email": "admin@school.com"
  }
}
```

### 1.2 Login (All Roles)
**Endpoint:** `POST /api/auth/login`

Supports: Admin (email), Teacher (email), Student (rollNumber), Parent (phone)

**Admin Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "identifier": "admin@school.com",
    "password": "Admin@123"
  }'
```

**Teacher Login (by email):**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "teacher",
    "identifier": "teacher@school.com",
    "password": "Teacher@123"
  }'
```

**Student Login (by roll number):**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "student",
    "identifier": "ROLL10A001",
    "password": "Student@123"
  }'
```

**Parent Login (by phone):**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "parent",
    "identifier": "9999999999",
    "password": "Parent@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "role": "student"
  }
}
```

### 1.3 Refresh Access Token
**Endpoint:** `POST /api/auth/refresh`

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

### 1.4 Logout
**Endpoint:** `POST /api/auth/logout`

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

---

## 2. Student Profile Management

### 2.1 Create Student Profile (Admin Only)
**Endpoint:** `POST /api/profiles/student/:studentId`

```bash
STUDENT_ID="student_object_id"
TOKEN="your_access_token"

curl -X POST http://localhost:4000/api/profiles/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "I love studying science and sports",
    "dateOfBirth": "2010-05-15",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "phone": "8888888888",
    "email": "student@example.com",
    "achievements": ["Science Fair Winner", "Sports Captain"],
    "hobbies": ["Cricket", "Reading", "Programming"],
    "parentContact": "9999999999",
    "emergencyContact": "9999999998"
  }'
```

### 2.2 Get My Profile (Student Only)
**Endpoint:** `GET /api/profiles/student/my-profile`

```bash
curl http://localhost:4000/api/profiles/student/my-profile \
  -H "Authorization: Bearer $TOKEN"
```

### 2.3 Get Any Student Profile
**Endpoint:** `GET /api/profiles/student/:studentId`

```bash
curl http://localhost:4000/api/profiles/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 2.4 View All Student Profiles (Admin/Teacher)
**Endpoint:** `GET /api/profiles/students/all`

```bash
curl http://localhost:4000/api/profiles/students/all \
  -H "Authorization: Bearer $TOKEN"
```

### 2.5 Update My Student Profile
**Endpoint:** `PUT /api/profiles/student/update`

```bash
curl -X PUT http://localhost:4000/api/profiles/student/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio",
    "achievements": ["New Achievement"],
    "hobbies": ["New Hobby"]
  }'
```

### 2.6 Delete Student Profile (Admin Only)
**Endpoint:** `DELETE /api/profiles/student/:studentId`

```bash
curl -X DELETE http://localhost:4000/api/profiles/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Teacher Profile Management

### 3.1 Create Teacher Profile (Admin Only)
**Endpoint:** `POST /api/profiles/teacher/:teacherId`

```bash
TEACHER_ID="teacher_object_id"

curl -X POST http://localhost:4000/api/profiles/teacher/$TEACHER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Experienced educator in Science",
    "dateOfBirth": "1985-03-20",
    "address": "456 Oak Avenue",
    "city": "Boston",
    "state": "MA",
    "postalCode": "02101",
    "phone": "7777777777",
    "email": "teacher@school.com",
    "qualifications": ["B.Sc Physics", "M.Ed"],
    "experience": 15,
    "specialization": ["Physics", "Chemistry"],
    "departments": ["Science", "Research"],
    "classes": [10, 11, 12],
    "emergencyContact": "7777777776"
  }'
```

### 3.2 Get My Profile (Teacher Only)
**Endpoint:** `GET /api/profiles/teacher/my-profile`

```bash
curl http://localhost:4000/api/profiles/teacher/my-profile \
  -H "Authorization: Bearer $TOKEN"
```

### 3.3 Get Teacher Profile by ID
**Endpoint:** `GET /api/profiles/teacher/:teacherId`

```bash
curl http://localhost:4000/api/profiles/teacher/$TEACHER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 3.4 View All Teacher Profiles (Admin)
**Endpoint:** `GET /api/profiles/teachers/all`

```bash
curl http://localhost:4000/api/profiles/teachers/all \
  -H "Authorization: Bearer $TOKEN"
```

### 3.5 Update My Teacher Profile
**Endpoint:** `PUT /api/profiles/teacher/update`

```bash
curl -X PUT http://localhost:4000/api/profiles/teacher/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated profile bio",
    "experience": 16,
    "qualifications": ["B.Sc Physics", "M.Ed", "Ph.D"]
  }'
```

### 3.6 Delete Teacher Profile (Admin Only)
**Endpoint:** `DELETE /api/profiles/teacher/:teacherId`

```bash
curl -X DELETE http://localhost:4000/api/profiles/teacher/$TEACHER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Teacher Bulk Data Upload (Student Data Management)

### 4.1 Upload/Create Student Data by Teacher
**Endpoint:** `POST /api/profiles/bulk-data/student/:studentId`

Teachers can upload marks, attendance, feedback for students

```bash
curl -X POST http://localhost:4000/api/profiles/bulk-data/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "marks": 95,
    "attendance": 100,
    "feedback": "Excellent performance in all tests",
    "assignmentStatus": "submitted",
    "performanceRating": 5
  }'
```

### 4.2 Get Student Data (by Teacher)
**Endpoint:** `GET /api/profiles/bulk-data/student/:studentId`

```bash
curl http://localhost:4000/api/profiles/bulk-data/student/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4.3 Get All My Students' Data (Teacher)
**Endpoint:** `GET /api/profiles/bulk-data/my-students`

```bash
curl http://localhost:4000/api/profiles/bulk-data/my-students \
  -H "Authorization: Bearer $TOKEN"
```

### 4.4 Update Student Data
**Endpoint:** `PUT /api/profiles/bulk-data/:dataId`

```bash
DATA_ID="data_object_id"

curl -X PUT http://localhost:4000/api/profiles/bulk-data/$DATA_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marks": 98,
    "feedback": "Outstanding work!",
    "performanceRating": 5
  }'
```

### 4.5 Delete Student Data
**Endpoint:** `DELETE /api/profiles/bulk-data/:dataId`

```bash
curl -X DELETE http://localhost:4000/api/profiles/bulk-data/$DATA_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Social Features (Posts, Likes, Comments)

### 5.1 Create Post (Any Authenticated User)
**Endpoint:** `POST /api/social/posts`

```bash
curl -X POST http://localhost:4000/api/social/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Exciting Science Project",
    "content": "We completed our chemistry experiment today. Results were amazing!",
    "attachments": ["photo1.jpg", "report.pdf"],
    "visibility": "public"
  }'
```

**Visibility Options:** `public`, `private`, `class`

### 5.2 List All Posts
**Endpoint:** `GET /api/social/posts`

```bash
# Get all public posts
curl http://localhost:4000/api/social/posts \
  -H "Authorization: Bearer $TOKEN"

# Filter by visibility
curl "http://localhost:4000/api/social/posts?visibility=public" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.3 View Single Post
**Endpoint:** `GET /api/social/posts/:postId`

```bash
POST_ID="post_object_id"

curl http://localhost:4000/api/social/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 5.4 Update Post (Own Posts Only)
**Endpoint:** `PUT /api/social/posts/:postId`

```bash
curl -X PUT http://localhost:4000/api/social/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content here",
    "visibility": "private"
  }'
```

### 5.5 Delete Post (Own Posts Only)
**Endpoint:** `DELETE /api/social/posts/:postId`

```bash
curl -X DELETE http://localhost:4000/api/social/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 5.6 Like/Unlike Post (Toggle)
**Endpoint:** `POST /api/social/posts/:postId/like`

```bash
# First request: Adds like
# Second request on same post: Removes like (toggle)
curl -X POST http://localhost:4000/api/social/posts/$POST_ID/like \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "liked": true,
  "data": {
    "likeCount": 5,
    "likes": ["user1_id", "user2_id", ...]
  }
}
```

### 5.7 Get Post Likes
**Endpoint:** `GET /api/social/posts/:postId/likes`

```bash
curl http://localhost:4000/api/social/posts/$POST_ID/likes \
  -H "Authorization: Bearer $TOKEN"
```

### 5.8 Add Comment to Post
**Endpoint:** `POST /api/social/posts/:postId/comment`

```bash
curl -X POST http://localhost:4000/api/social/posts/$POST_ID/comment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "That sounds amazing! Great job to the team."
  }'
```

### 5.9 Delete Comment (Own Comments Only)
**Endpoint:** `DELETE /api/social/posts/:postId/comment/:commentId`

```bash
COMMENT_ID="comment_id"

curl -X DELETE http://localhost:4000/api/social/posts/$POST_ID/comment/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Students Module

### 6.1 Create Student (Admin/Teacher)
**Endpoint:** `POST /api/students`

```bash
curl -X POST http://localhost:4000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Raj Kumar",
    "rollNumber": "ROLL10A001",
    "class": 10,
    "section": "A",
    "stream": "normal",
    "password": "Student@123",
    "phone": "8888888888"
  }'
```

### 6.2 Get All Students (Paginated)
**Endpoint:** `GET /api/students?page=1&limit=10`

```bash
curl "http://localhost:4000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 6.3 Get Single Student
**Endpoint:** `GET /api/students/:studentId`

```bash
curl http://localhost:4000/api/students/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Attendance Module

### 7.1 Mark Attendance
**Endpoint:** `POST /api/attendance`

```bash
curl -X POST http://localhost:4000/api/attendance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "date": "2026-03-02",
    "status": "present",
    "remarks": "On time"
  }'
```

**Status Options:** `present`, `absent`, `late`, `leave`

### 7.2 Get Daily Attendance
**Endpoint:** `GET /api/attendance/daily?date=YYYY-MM-DD`

```bash
curl "http://localhost:4000/api/attendance/daily?date=2026-03-02" \
  -H "Authorization: Bearer $TOKEN"
```

### 7.3 Get Weekly Summary
**Endpoint:** `GET /api/attendance/weekly?studentId=:id&weekStart=YYYY-MM-DD`

```bash
curl "http://localhost:4000/api/attendance/weekly?studentId=$STUDENT_ID&weekStart=2026-02-23" \
  -H "Authorization: Bearer $TOKEN"
```

### 7.4 Get Monthly Percentage
**Endpoint:** `GET /api/attendance/monthly?studentId=:id&year=YYYY&month=MM`

```bash
curl "http://localhost:4000/api/attendance/monthly?studentId=$STUDENT_ID&year=2026&month=3" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Homework Module

### 8.1 Create Homework (Teacher/Admin)
**Endpoint:** `POST /api/homework`

```bash
curl -X POST http://localhost:4000/api/homework \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mathematics Chapter 5",
    "description": "Solve all problems from page 50-60",
    "class": 10,
    "section": "A",
    "dueDate": "2026-03-05",
    "subject": "Mathematics"
  }'
```

### 8.2 Get Homework by Class/Section
**Endpoint:** `GET /api/homework?class=10&section=A`

```bash
curl "http://localhost:4000/api/homework?class=10&section=A" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 9. Exams Module

### 9.1 Create Exam (Teacher/Admin)
**Endpoint:** `POST /api/exams`

```bash
curl -X POST http://localhost:4000/api/exams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Midterm Examinations",
    "class": 10,
    "section": "A",
    "date": "2026-03-20",
    "totalMarks": 100,
    "subject": "Mathematics"
  }'
```

### 9.2 Enter Marks for Exam
**Endpoint:** `POST /api/exams/:examId/marks`

```bash
curl -X POST http://localhost:4000/api/exams/$EXAM_ID/marks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marks": [
      {"studentId": "'$STUDENT_ID_1'", "obtained": 85},
      {"studentId": "'$STUDENT_ID_2'", "obtained": 92}
    ]
  }'
```

### 9.3 Get Student Exam Results
**Endpoint:** `GET /api/exams/student/:studentId/result`

```bash
curl http://localhost:4000/api/exams/student/$STUDENT_ID/result \
  -H "Authorization: Bearer $TOKEN"
```

---

## 10. Fees Module

### 10.1 Add Fee (Admin)
**Endpoint:** `POST /api/fees`

```bash
curl -X POST http://localhost:4000/api/fees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "amount": 50000,
    "dueDate": "2026-03-31",
    "description": "Quarterly Fees"
  }'
```

### 10.2 Mark Fee as Paid
**Endpoint:** `POST /api/fees/:feeId/pay`

```bash
FEE_ID="fee_object_id"

curl -X POST http://localhost:4000/api/fees/$FEE_ID/pay \
  -H "Authorization: Bearer $TOKEN"
```

### 10.3 Get Fee Status
**Endpoint:** `GET /api/fees/status?studentId=:id`

```bash
curl "http://localhost:4000/api/fees/status?studentId=$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 11. Timetable Module

### 11.1 Create/Update Timetable (Teacher/Admin)
**Endpoint:** `POST /api/timetable`

```bash
curl -X POST http://localhost:4000/api/timetable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class": 10,
    "section": "A",
    "entries": [
      {"day": "Monday", "period": 1, "subject": "English", "teacher": "John"},
      {"day": "Monday", "period": 2, "subject": "Mathematics", "teacher": "Jane"},
      {"day": "Tuesday", "period": 1, "subject": "Science", "teacher": "Bob"}
    ]
  }'
```

### 11.2 Get Timetable
**Endpoint:** `GET /api/timetable?class=10&section=A`

```bash
curl "http://localhost:4000/api/timetable?class=10&section=A" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 12. Events Module

### 12.1 Create Event (Admin/Teacher)
**Endpoint:** `POST /api/events`

```bash
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Sports Day",
    "description": "Inter-house sports competition",
    "startDate": "2026-04-15",
    "endDate": "2026-04-15",
    "location": "School Ground",
    "audience": "all"
  }'
```

**Audience Options:** `students`, `teachers`, `parents`, `all`

### 12.2 List Events
**Endpoint:** `GET /api/events`

```bash
curl http://localhost:4000/api/events \
  -H "Authorization: Bearer $TOKEN"
```

---

## 13. Enquiry Module (Public)

### 13.1 Submit Enquiry (No Auth Required)
**Endpoint:** `POST /api/enquiry`

```bash
curl -X POST http://localhost:4000/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ramesh Kumar",
    "email": "parent@example.com",
    "phone": "9876543210",
    "message": "Interested in admission for class 5"
  }'
```

### 13.2 Get All Enquiries (Admin Only)
**Endpoint:** `GET /api/enquiry`

```bash
curl http://localhost:4000/api/enquiry \
  -H "Authorization: Bearer $TOKEN"
```

---

## 14. Notifications Module

### 14.1 Create Notification (Admin/Teacher)
**Endpoint:** `POST /api/notifications`

```bash
curl -X POST http://localhost:4000/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Parent-Teacher Meeting",
    "body": "PTM scheduled for March 10th, 2026",
    "targetRoles": ["parent", "teacher"]
  }'
```

### 14.2 Get Notifications
**Endpoint:** `GET /api/notifications?class=10&section=A`

```bash
curl "http://localhost:4000/api/notifications?class=10&section=A" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 15. Library Module

### 15.1 Add Book to Library
**Endpoint:** `POST /api/library/books`

```bash
curl -X POST http://localhost:4000/api/library/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Physics",
    "author": "Stephen Hawking",
    "isbn": "ISBN-978-0-123456",
    "copies": 5,
    "category": "Science"
  }'
```

### 15.2 Issue Book to Student
**Endpoint:** `POST /api/library/issue`

```bash
curl -X POST http://localhost:4000/api/library/issue \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "'$BOOK_ID'",
    "studentId": "'$STUDENT_ID'",
    "dueAt": "2026-04-01"
  }'
```

### 15.3 Return Book
**Endpoint:** `POST /api/library/return/:issueId`

```bash
ISSUE_ID="issue_object_id"

curl -X POST http://localhost:4000/api/library/return/$ISSUE_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 15.4 List Books
**Endpoint:** `GET /api/library/books`

```bash
curl http://localhost:4000/api/library/books \
  -H "Authorization: Bearer $TOKEN"
```

---

## 16. Reports Module

### 16.1 Get Student Performance Summary
**Endpoint:** `GET /api/reports/student/:studentId/summary`

```bash
curl http://localhost:4000/api/reports/student/$STUDENT_ID/summary \
  -H "Authorization: Bearer $TOKEN"
```

Returns: Exam results, attendance, assignments status, overall performance rating.

---

## Common Headers & Authentication

All protected endpoints require:

```
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

**Token Structure:**
- Access Token: Valid for 15 minutes
- Refresh Token: Valid for 7 days
- Include refresh token in request body for refresh endpoint
- Include access token in Authorization header for all other protected endpoints

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

**Common Status Codes:**
- `200` OK - Request successful
- `201` Created - Resource created
- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing/invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `500` Server Error - Internal error

---

## Testing Flow Example

1. **Seed Admin** (one-time)
```bash
curl -X POST http://localhost:4000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin","email":"admin@school.com","password":"Admin@123"}'
```

2. **Login as Admin**
```bash
RESPONSE=$(curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"admin","identifier":"admin@school.com","password":"Admin@123"}')
TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
```

3. **Create Student**
```bash
curl -X POST http://localhost:4000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","rollNumber":"ROLL001","class":10,"section":"A","password":"Student@123"}'
```

4. **Login as Student**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"student","identifier":"ROLL001","password":"Student@123"}'
```

5. **Create Profile**
```bash
curl -X POST http://localhost:4000/api/profiles/student/STUDENT_ID \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bio":"I love studying","achievements":["Prize Winner"]}'
```

6. **Create Post**
```bash
curl -X POST http://localhost:4000/api/social/posts \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Achievement","content":"Won the science competition!","visibility":"public"}'
```

7. **Like & Comment**
```bash
# Like
curl -X POST http://localhost:4000/api/social/posts/POST_ID/like \
  -H "Authorization: Bearer $TOKEN"

# Comment
curl -X POST http://localhost:4000/api/social/posts/POST_ID/comment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Congrats!"}'
```

---

## Tips & Best Practices

- **Save tokens** from login responses for subsequent requests
- **Check HTTP status codes** for request success/failure
- Always include **Authorization header** for protected endpoints
- Use **pagination** (page, limit) on list endpoints
- **Refresh token** before expiration (15 minutes) using the refresh endpoint
- Test **role-based access** - not all endpoints available for all user roles
- Use **visibility settings** in posts to control access (`public`, `private`, `class`)
- **Teacher can manage student data** - upload marks, attendance, feedback in bulk
- **Profile creation** is separate from user creation for flexibility
- Monitor **response times** and optimize queries with filters

---

## Summary of Key Features

✅ **Authentication** - Multi-role login (Admin, Teacher, Student, Parent)  
✅ **Profiles** - Full profile management for Students & Teachers  
✅ **Bulk Data** - Teachers can upload student performance data  
✅ **Social Feed** - Posts, likes, and comments system  
✅ **Attendance** - Track daily, weekly, monthly attendance  
✅ **Academics** - Homework, Exams, Results management  
✅ **Fees** - Fee tracking and payment status  
✅ **Events** - School events and announcements  
✅ **Library** - Book management and issuance  
✅ **Notifications** - System-wide notifications  
✅ **Reports** - Performance summaries and analytics  

---

Last Updated: March 2, 2026
