function swaggerSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'School ERP API',
      version: '3.0.0',
      description:
        'Production-ready School ERP backend with JWT auth, RBAC, domains, teacher applications, content publishing, online class scheduling, reminders, and parent/student portals.'
    },
    servers: [{ url: '/' }],
    tags: [
      { name: 'Auth' },
      { name: 'TeacherApplication' },
      { name: 'Admin' },
      { name: 'TeacherPortal' },
      { name: 'StudentPortal' },
      { name: 'ParentPortal' },
      { name: 'Domains' },
      { name: 'Classes' },
      { name: 'Subjects' },
      { name: 'Teachers' },
      { name: 'Students' },
      { name: 'Attendance' },
      { name: 'Exams' },
      { name: 'Marks' },
      { name: 'Results' },
      { name: 'Assignments' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation failed' },
            details: { type: 'array', items: { type: 'string' } }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },
        TeacherApplyRequest: {
          type: 'object',
          required: ['fullName', 'email', 'phone'],
          properties: {
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            qualification: { type: 'string' },
            experience: { type: 'number' },
            subjects: { type: 'array', items: { type: 'string' } },
            domainId: { type: 'string' },
            resumeBase64: { type: 'string' },
            profilePhotoBase64: { type: 'string' }
          }
        },
        ScheduleClassRequest: {
          type: 'object',
          required: ['title', 'domainId', 'classId', 'date', 'startTime', 'endTime', 'meetingLink'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            domainId: { type: 'string' },
            classId: { type: 'string' },
            subjectId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            startTime: { type: 'string', example: '10:30' },
            endTime: { type: 'string', example: '11:15' },
            meetingLink: { type: 'string', format: 'uri' }
          }
        }
      }
    },
    paths: {
      '/auth/admin/login': {
        post: {
          tags: ['Auth'],
          summary: 'Admin login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/teacher/login': {
        post: {
          tags: ['Auth'],
          summary: 'Teacher login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/student/login': {
        post: {
          tags: ['Auth'],
          summary: 'Student login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['identifier', 'password'],
                  properties: {
                    identifier: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/parent/request-otp': {
        post: {
          tags: ['Auth'],
          summary: 'Request parent OTP using phone or email',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    phone: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'OTP generated' },
            404: { description: 'Parent account not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/auth/parent/login': {
        post: {
          tags: ['Auth'],
          summary: 'Parent login with phone/email and password/OTP',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    phone: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    otp: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            401: { description: 'Invalid credentials/OTP', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/teacher/apply': {
        post: {
          tags: ['TeacherApplication'],
          summary: 'Teacher application form submission',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TeacherApplyRequest' }
              }
            }
          },
          responses: {
            201: { description: 'Application created' },
            409: { description: 'Duplicate application', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/admin/teacher-applications': {
        get: {
          tags: ['Admin'],
          summary: 'List teacher applications',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Application list' },
            403: { description: 'Forbidden' }
          }
        }
      },
      '/admin/approve-teacher/{id}': {
        post: {
          tags: ['Admin'],
          summary: 'Approve teacher application',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Application approved and teacher account created' },
            404: { description: 'Application not found' }
          }
        }
      },
      '/admin/reject-teacher/{id}': {
        post: {
          tags: ['Admin'],
          summary: 'Reject teacher application',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    remark: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Application rejected' },
            404: { description: 'Application not found' }
          }
        }
      },
      '/admin/create-teacher': {
        post: {
          tags: ['Admin'],
          summary: 'Create teacher',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Teacher created with credentials' },
            422: { description: 'Validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/admin/create-student': {
        post: {
          tags: ['Admin'],
          summary: 'Create student with auto credentials + parent linkage',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Student created' },
            422: { description: 'Validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
          }
        }
      },
      '/admin/create-class': {
        post: {
          tags: ['Admin'],
          summary: 'Create class',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Class created' }, 422: { description: 'Validation failed' } }
        }
      },
      '/admin/create-subject': {
        post: {
          tags: ['Admin'],
          summary: 'Create subject',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Subject created' }, 422: { description: 'Validation failed' } }
        }
      },
      '/admin/assign-teacher': {
        post: {
          tags: ['Admin'],
          summary: 'Assign teacher to class and/or subject',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Teacher assigned' }, 422: { description: 'Validation failed' } }
        }
      },
      '/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Admin dashboard metrics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dashboard payload (students/teachers/classes/attendance/upcoming/recent)' },
            403: { description: 'Forbidden' }
          }
        }
      },
      '/teacher/classes': {
        get: {
          tags: ['TeacherPortal'],
          summary: 'Get teacher assigned classes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Assigned classes' }, 403: { description: 'Forbidden' } }
        }
      },
      '/teacher/students': {
        get: {
          tags: ['TeacherPortal'],
          summary: 'Get students in assigned classes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Assigned students list' }, 403: { description: 'Forbidden' } }
        }
      },
      '/teacher/attendance': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Mark attendance (present/absent/late)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Attendance marked' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/marks': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Enter student marks',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Marks saved' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/add-marks': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Alias for marks entry API',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Marks saved' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/assignment': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Upload assignment',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Assignment created' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/announcement': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Publish announcement',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Announcement published' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/publish-content': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Publish learning content (notes/pdf/video/assignment/announcement)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Content published' }, 422: { description: 'Validation failed' } }
        }
      },
      '/teacher/schedule-class': {
        post: {
          tags: ['TeacherPortal'],
          summary: 'Schedule online class with external meeting link',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScheduleClassRequest' }
              }
            }
          },
          responses: {
            201: { description: 'Class scheduled' },
            422: { description: 'Validation failed' }
          }
        }
      },
      '/student/content': {
        get: {
          tags: ['StudentPortal'],
          summary: 'Get student content feed filtered by student domain/class',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Content list' }, 403: { description: 'Forbidden' } }
        }
      },
      '/student/upcoming-classes': {
        get: {
          tags: ['StudentPortal'],
          summary: 'Get upcoming online classes for logged-in student',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Upcoming classes' }, 403: { description: 'Forbidden' } }
        }
      },
      '/student/results': {
        get: {
          tags: ['StudentPortal'],
          summary: 'Get own results with subject marks, totals, percentage, grade',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Results list' }, 403: { description: 'Forbidden' } }
        }
      },
      '/parent/student': {
        get: {
          tags: ['ParentPortal'],
          summary: 'Get own child profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Student profile' }, 403: { description: 'Forbidden' } }
        }
      },
      '/parent/attendance': {
        get: {
          tags: ['ParentPortal'],
          summary: 'Get own child attendance',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Attendance list + summary' }, 403: { description: 'Forbidden' } }
        }
      },
      '/parent/results': {
        get: {
          tags: ['ParentPortal'],
          summary: 'Get own child results',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Results list' }, 403: { description: 'Forbidden' } }
        }
      },
      '/parent/upcoming-classes': {
        get: {
          tags: ['ParentPortal'],
          summary: 'Get upcoming online classes for child',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Upcoming class list' }, 403: { description: 'Forbidden' } }
        }
      },
      '/domains': {
        post: {
          tags: ['Domains'],
          summary: 'Create domain',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Domain created' }, 403: { description: 'Forbidden' } }
        },
        get: {
          tags: ['Domains'],
          summary: 'List domains',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Domain list' } }
        }
      },
      '/classes': {
        post: {
          tags: ['Classes'],
          summary: 'Create class',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Class created' }, 422: { description: 'Validation failed' } }
        },
        get: {
          tags: ['Classes'],
          summary: 'List classes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Class list' } }
        }
      },
      '/subjects': {
        post: {
          tags: ['Subjects'],
          summary: 'Create subject',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Subject created' }, 422: { description: 'Validation failed' } }
        },
        get: {
          tags: ['Subjects'],
          summary: 'List subjects',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Subject list' } }
        }
      },
      '/students': {
        post: {
          tags: ['Students'],
          summary: 'Create student (admin only)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Student created' }, 422: { description: 'Validation failed' } }
        },
        get: {
          tags: ['Students'],
          summary: 'List students',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Student list' } }
        }
      },
      '/marks': {
        post: {
          tags: ['Marks'],
          summary: 'Create/update marks record',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Marks saved' }, 422: { description: 'Validation failed' } }
        }
      },
      '/results/student/{id}': {
        get: {
          tags: ['Results'],
          summary: 'Get student result list',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Student results' }, 403: { description: 'Forbidden' } }
        }
      }
    }
  };
}

function swaggerHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>School ERP API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>html, body { margin: 0; padding: 0; }</style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/docs.json',
        dom_id: '#swagger-ui',
        persistAuthorization: true
      });
    </script>
  </body>
</html>`;
}

module.exports = {
  swaggerSpec,
  swaggerHtml
};
