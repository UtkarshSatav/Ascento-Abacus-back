# Student API Documentation

## Authentication
- **POST /api/auth/login**
  - Login with role: student
  - Body: `{ email, password, role: 'student' }`
- **GET /api/auth/me**
  - Returns authenticated student/parent profile

## Dashboard
- **GET /api/student/dashboard**
  - Returns summary for UI display:
    - Attendance % (daily/weekly/monthly)
    - Pending homework
    - Pending fees
    - Upcoming exams
    - Timetable for today/week
    - Meet links
  - Example response:
    ```json
    {
      "attendance": {"daily": 95, "weekly": 90, "monthly": 92},
      "pendingHomework": [{"title": "Math Assignment 1", "dueDate": "2026-03-18"}],
      "pendingFees": [{"month": "March 2026", "amount": 1200}],
      "timetable": [{"subject": "Math", "teacher": "Mr. Sharma", "start": "9:00", "end": "10:00"}],
      "upcomingExams": [{"subject": "Science", "date": "2026-03-20", "duration": "2h"}],
      "meetLinks": [{"subject": "English", "teacher": "Ms. Patel", "link": "https://meetlink.com"}]
    }
    ```

## Assignments
- **GET /api/student/homework**
  - List all assignments with status (pending/submitted)
- **GET /api/student/homework/:id**
  - Detailed assignment view

## Attendance
- **GET /api/student/attendance**
  - Returns daily/weekly/monthly attendance
  - Subject-wise summaries for charts

## Fees
- **GET /api/student/fees**
  - Returns pending and paid fees
  - Includes month, amount, status

## Timetable
- **GET /api/student/timetable**
  - Daily/weekly timetable structured for calendar view

## Exams
- **GET /api/student/exams**
  - Upcoming exams

## Meet Links
- **GET /api/student/meetLinks**
  - List meet links by subject/class

---

## Notes
- All endpoints require JWT authentication and session key
- Role-based access enforced for student/parent
- Responses are structured for frontend charts/tables
- Modular routes, no duplication with admin/teacher APIs
