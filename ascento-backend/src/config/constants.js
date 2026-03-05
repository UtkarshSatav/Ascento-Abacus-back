const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

const DOMAIN_CODES = {
  VEDIC_MATH: 'VEDIC_MATH',
  ABACUS: 'ABACUS',
  GENERIC_SCHOOL: 'GENERIC_SCHOOL'
};

const EXAM_TYPES = {
  UNIT_TEST: 'UNIT_TEST',
  MID_TERM: 'MID_TERM',
  FINAL_EXAM: 'FINAL_EXAM'
};

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

const TEACHER_APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const CONTENT_TYPES = {
  NOTES: 'notes',
  PDF: 'pdf',
  VIDEO: 'video',
  ASSIGNMENT: 'assignment',
  ANNOUNCEMENT: 'announcement'
};

module.exports = {
  ROLES,
  DOMAIN_CODES,
  EXAM_TYPES,
  ATTENDANCE_STATUS,
  TEACHER_APPLICATION_STATUS,
  CONTENT_TYPES
};
