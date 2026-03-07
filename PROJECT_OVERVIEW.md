# Ascento School ERP - Project Overview

## 📋 Project Description

Ascento is a comprehensive School ERP (Enterprise Resource Planning) system designed to manage educational institutions efficiently. The system supports multiple educational domains including Vedic Math, Abacus, and traditional school curriculum (Class 1-12). It provides role-based access for administrators, teachers, students, and parents with dedicated portals for each user type.

## 🏗️ Architecture Overview

### Backend (Node.js/Express)
- **Framework**: Express.js with modular architecture
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-Based Access Control (RBAC)
- **File Storage**: Cloudinary integration for document/photo uploads
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, rate limiting
- **Scheduling**: Node-cron for automated reminders
- **Documentation**: Swagger API documentation

### Frontend (Flutter)
- **Framework**: Flutter for cross-platform mobile/desktop apps
- **State Management**: Basic state management with shared preferences
- **HTTP Client**: HTTP package for API communication
- **UI**: Material Design with Google Fonts
- **Internationalization**: Intl package support

## 🛠️ Technology Stack

### Backend Dependencies
- **express**: ^4.22.1 - Web framework
- **mongoose**: ^7.0.0 - MongoDB ODM
- **jsonwebtoken**: ^9.0.0 - JWT authentication
- **bcrypt**: ^6.0.0 - Password hashing
- **joi**: ^17.13.3 - Data validation
- **multer**: ^1.4.5-lts.2 - File uploads
- **cloudinary**: ^2.8.0 - Cloud storage
- **helmet**: ^6.0.1 - Security headers
- **cors**: ^2.8.5 - Cross-origin requests
- **express-rate-limit**: ^6.7.0 - Rate limiting
- **morgan**: ^1.10.0 - HTTP request logger
- **node-cron**: ^4.2.1 - Scheduled tasks
- **uuid**: ^9.0.0 - Unique identifiers

### Frontend Dependencies
- **flutter**: SDK ^3.9.2
- **http**: ^1.2.2 - HTTP client
- **shared_preferences**: ^2.5.3 - Local storage
- **intl**: ^0.20.2 - Internationalization
- **google_fonts**: ^6.3.0 - Custom fonts

## 📁 Project Structure

```
ascento/
├── ascento-backend/
│   ├── src/
│   │   ├── config/          # Database, constants, swagger config
│   │   ├── controllers/     # Request handlers for each module
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Helper utilities
│   │   ├── validations/     # Joi validation schemas
│   │   ├── validators/      # Custom validators
│   │   ├── scripts/         # Database seeding scripts
│   │   └── docs/            # API documentation
│   ├── server.js            # Application entry point
│   ├── package.json
│   └── README.md
├── ascento-frontend/
│   ├── lib/
│   │   ├── main.dart        # Flutter app entry point
│   │   └── src/             # App source code
│   ├── pubspec.yaml
│   ├── android/             # Android platform code
│   ├── ios/                 # iOS platform code
│   └── README.md
└── README.md
```

## 👥 User Roles & Permissions

### 1. Admin
- **Full Access**: Complete system administration
- **Capabilities**:
  - Manage teachers, students, parents
  - Create/manage classes, subjects, domains
  - Approve teacher applications
  - View all reports and analytics
  - System configuration

### 2. Teacher
- **Limited Access**: Assigned classes/students only
- **Capabilities**:
  - Manage assigned students' attendance
  - Create assignments and homework
  - Record marks and results
  - Conduct online classes
  - View student performance

### 3. Student
- **Personal Access**: Own data only
- **Capabilities**:
  - View attendance and marks
  - Access assignments and homework
  - View timetable and results
  - Participate in online classes

### 4. Parent
- **Child Access**: Own children's data only
- **Capabilities**:
  - Monitor child's attendance and performance
  - View assignments and homework
  - Access report cards
  - Communication with teachers

## 🎯 Key Features

### Core Modules
1. **Authentication & Authorization**
   - Multi-role login system
   - JWT token-based authentication
   - OTP-based parent login
   - Password and refresh token management

2. **Student Management**
   - Student enrollment and profiles
   - Class and section assignments
   - Domain-specific grouping (Vedic Math, Abacus, School)

3. **Teacher Management**
   - Teacher application system
   - Qualification and subject assignment
   - Class assignment and management

4. **Academic Management**
   - Subject and syllabus management
   - Assignment and homework tracking
   - Exam and result management
   - Mark entry and grading

5. **Attendance System**
   - Daily attendance tracking
   - Monthly attendance reports
   - Parent notifications

6. **Communication**
   - Parent-teacher communication
   - Notifications and announcements
   - Event management

7. **Content Management**
   - Study materials and resources
   - Online class scheduling
   - Digital content library

## 🔌 API Architecture

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
- **Bearer Token**: `Authorization: Bearer <access_token>`
- **Refresh Token**: Used to obtain new access tokens

### Response Format
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... } | [...],
  "error": "Error details" // only on failure
}
```

### Key API Endpoints

#### Authentication APIs
- `POST /auth/admin/login` - Admin login
- `POST /auth/teacher/login` - Teacher login
- `POST /auth/student/login` - Student login
- `POST /auth/parent/request-otp` - Parent OTP request
- `POST /auth/parent/login` - Parent login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile

#### Teacher Application APIs
- `POST /teacher/apply` - Submit teacher application
- `GET /admin/teacher-applications` - Get all applications
- `POST /admin/approve-teacher/:id` - Approve application
- `POST /admin/reject-teacher/:id` - Reject application

#### Admin Panel APIs
- `POST /admin/create-teacher` - Create teacher account
- `GET /admin/teachers` - Get all teachers
- `POST /admin/create-student` - Create student account
- `GET /admin/students` - Get all students
- `POST /admin/create-class` - Create class
- `GET /admin/classes` - Get all classes

#### Student Management APIs
- `GET /student/profile` - Get student profile
- `GET /student/attendance` - Get attendance records
- `GET /student/marks` - Get marks and results
- `GET /student/assignments` - Get assignments
- `GET /student/homework` - Get homework

#### Teacher Portal APIs
- `GET /teacher/students` - Get assigned students
- `POST /teacher/attendance` - Mark attendance
- `POST /teacher/assignment` - Create assignment
- `POST /teacher/marks` - Enter marks
- `GET /teacher/classes` - Get assigned classes

#### Parent Portal APIs
- `GET /parent/children` - Get children information
- `GET /parent/child/:id/attendance` - Get child's attendance
- `GET /parent/child/:id/marks` - Get child's marks
- `GET /parent/child/:id/assignments` - Get child's assignments

## 🗄️ Database Schema Overview

### Core Collections
- **users**: Authentication data for all roles
- **admins**: Admin user profiles
- **teachers**: Teacher profiles and assignments
- **students**: Student profiles and academic data
- **parents**: Parent profiles and child relationships
- **classes**: Class definitions with subjects
- **subjects**: Subject definitions
- **domains**: Educational domains (Vedic Math, Abacus, etc.)
- **attendance**: Daily attendance records
- **assignments**: Homework and assignment data
- **marks**: Exam marks and grades
- **results**: Final results and report cards
- **events**: School events and announcements
- **notifications**: System notifications
- **otp**: OTP storage for parent login
- **refresh_tokens**: JWT refresh tokens

### Key Relationships
- Students belong to Classes and Domains
- Teachers are assigned to Classes and Subjects
- Parents are linked to their Children (Students)
- Attendance, Marks, Assignments link to Students and Teachers

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB >= 4.4
- Flutter SDK >= 3.9.2
- Git

### Backend Setup
```bash
cd ascento-backend
npm install
cp .env.example .env  # Configure environment variables
npm run seed          # Seed initial data
npm run dev           # Start development server
```

### Frontend Setup
```bash
cd ascento-frontend
flutter pub get
flutter run            # Run on connected device/emulator
```

### Environment Variables
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/school_erp
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📊 Data Flow

1. **Authentication Flow**:
   - User logs in → JWT tokens generated → Stored in client
   - API requests include Bearer token → Server validates → Access granted

2. **Teacher Application Flow**:
   - Public application → Admin review → Approval/Rejection → Account creation

3. **Academic Data Flow**:
   - Teacher creates assignment → Students access → Submit work → Teacher reviews

4. **Attendance Flow**:
   - Teacher marks attendance → Stored in database → Parents notified → Reports generated

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Joi schemas prevent malformed data
- **Role-Based Access**: Granular permissions per role

## 📈 Scalability Considerations

- **Modular Architecture**: Easy to add new features
- **Database Indexing**: Optimized queries
- **File Storage**: Cloudinary for scalable media storage
- **Rate Limiting**: Prevents system overload
- **Logging**: Morgan for request monitoring
- **Scheduled Jobs**: Node-cron for automated tasks

## 🧪 Testing & Quality

- **API Testing**: Postman collection available
- **Validation**: Comprehensive input validation
- **Error Handling**: Centralized error middleware
- **Logging**: Request/response logging
- **Documentation**: Swagger API docs

## 🔄 Development Workflow

1. **Feature Development**:
   - Create API endpoints in controllers
   - Define routes in route files
   - Add validation schemas
   - Update models if needed
   - Test with Postman

2. **Database Changes**:
   - Update Mongoose schemas
   - Run seed scripts for test data
   - Update API documentation

3. **Frontend Integration**:
   - Implement API calls in Flutter
   - Handle authentication state
   - Update UI based on user role

## 📞 Support & Maintenance

- **API Documentation**: Available in `/docs` folder
- **Postman Collection**: Pre-configured API tests
- **Error Logs**: Centralized logging system
- **Backup**: Regular database backups recommended
- **Updates**: Modular design allows easy feature additions

## 🎯 Future Enhancements

- Real-time notifications with WebSocket
- Mobile app push notifications
- Advanced analytics and reporting
- Integration with third-party educational tools
- Multi-language support
- Offline capability for mobile app

---

This document provides a comprehensive overview of the Ascento School ERP system. For detailed API specifications, refer to `ALL_APIS.md`. For setup instructions, see individual README files in backend and frontend directories.