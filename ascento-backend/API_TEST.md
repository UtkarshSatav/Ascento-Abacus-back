# School ERP — API Test Guide

Quick API test guide with curl examples to exercise the main endpoints.

Prerequisites
- Node.js installed
- MongoDB running and `MONGO_URI` set in `.env`
- Install deps and start server:

```bash
npm install
npm run dev
```

Defaults
- Base URL: http://localhost:4000
- Seed an admin using `/api/auth/seed-admin` (only for initial setup)

1) Seed admin (one-time)

```bash
curl -X POST http://localhost:4000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin","email":"admin@example.com","password":"Secret123"}'
```

2) Login (Admin / Teacher / Student / Parent)

All roles use `/api/auth/login` with role + identifier + password.

Examples:

Admin login (email):

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"admin","identifier":"admin@example.com","password":"Secret123"}'
```

Teacher login (email):

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"teacher","identifier":"teacher@example.com","password":"TeacherPass"}'
```

Student login (rollNumber):

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"student","identifier":"ROLL123","password":"StudentPass"}'
```

Parent login (phone):

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"parent","identifier":"9999999999","password":"ParentPass"}'
```

Notes
- Responses include `accessToken` and `refreshToken`.
- Use the `accessToken` in the `Authorization` header: `Authorization: Bearer <ACCESS_TOKEN>`

3) Refresh token

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

4) Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

5) Students

- Create student (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/students \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"John Doe",
    "rollNumber":"ROLL123",
    "class":10,
    "section":"A",
    "stream":"normal",
    "password":"StudentPass",
    "phone":"8888888888"
  }'
```

Stream validation: `abacus` allowed for class >=3 (UKG allowed), `vedic` allowed for class >=11.

- List students:

```bash
curl "http://localhost:4000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- Get student:

```bash
curl http://localhost:4000/api/students/<STUDENT_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

6) Attendance

- Mark attendance (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/attendance \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"<STUDENT_ID>","date":"2026-03-02","status":"present","remarks":"On time"}'
```

- Fetch daily attendance:

```bash
curl "http://localhost:4000/api/attendance/daily?date=2026-03-02" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- Weekly summary:

```bash
curl "http://localhost:4000/api/attendance/weekly?studentId=<STUDENT_ID>&weekStart=2026-02-23" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- Monthly percentage:

```bash
curl "http://localhost:4000/api/attendance/monthly?studentId=<STUDENT_ID>&year=2026&month=3" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

7) Homework

- Create (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/homework \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Math HW","description":"Ch.1-3","class":5,"section":"A","dueDate":"2026-03-05"}'
```

- List by class/section:

```bash
curl "http://localhost:4000/api/homework?class=5&section=A" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

8) Exams

- Create exam (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/exams \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Midterm","class":10,"date":"2026-03-20","totalMarks":100}'
```

- Enter marks:

```bash
curl -X POST http://localhost:4000/api/exams/<EXAM_ID>/marks \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"marks":[{"studentId":"<STUDENT_ID>","obtained":78}]}'
```

- Fetch student result:

```bash
curl http://localhost:4000/api/exams/student/<STUDENT_ID>/result \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

9) Fees

- Add fee (admin):

```bash
curl -X POST http://localhost:4000/api/fees \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"<STUDENT_ID>","amount":5000,"dueDate":"2026-03-31"}'
```

- Mark paid:

```bash
curl -X POST http://localhost:4000/api/fees/<FEE_ID>/pay \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- Get status:

```bash
curl "http://localhost:4000/api/fees/status?studentId=<STUDENT_ID>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

10) Timetable

- Create/update (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/timetable \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"class":5,"section":"A","entries":[{"day":"Monday","period":1,"subject":"Math"}]}'
```

- Fetch for student:

```bash
curl "http://localhost:4000/api/timetable?class=5&section=A" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

11) Events

- Create event (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Annual Day","startDate":"2026-04-15","endDate":"2026-04-15","audience":"all"}'
```

- List upcoming:

```bash
curl http://localhost:4000/api/events \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

12) Enquiry

- Public form:

```bash
curl -X POST http://localhost:4000/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"Visitor","phone":"7777777777","message":"Admission query"}'
```

- Admin list:

```bash
curl http://localhost:4000/api/enquiry \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

13) Notifications

- Create (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/notifications \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Notice","body":"PTM tomorrow","targetRoles":["parent","student"]}'
```

- Fetch for user:

```bash
curl http://localhost:4000/api/notifications?class=5&section=A \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

14) Library

- Add book (admin/teacher):

```bash
curl -X POST http://localhost:4000/api/library/books \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Physics","author":"Author","isbn":"ISBN123","copies":3}'
```

- Issue book:

```bash
curl -X POST http://localhost:4000/api/library/issue \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"<BOOK_ID>","studentId":"<STUDENT_ID>","dueAt":"2026-04-01"}'
```

- Return book:

```bash
curl -X POST http://localhost:4000/api/library/return/<ISSUE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

15) Reports

- Student performance summary:

```bash
curl http://localhost:4000/api/reports/student/<STUDENT_ID>/summary \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Notes & troubleshooting
- All protected routes require `Authorization: Bearer <ACCESS_TOKEN>` header.
- Use `refresh` endpoint to obtain a new access token when expired.
- Pagination: use `page` and `limit` on list endpoints.
- Pay attention to HTTP response codes: 201 for created, 200 for OK, 401/403 for auth issues, 400/404 for validation/errors.

If you want, I can also add a Postman collection or a runnable test script (Node.js) for automated smoke tests.
