require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/user.model');
const Domain = require('../models/domain.model');
const ClassModel = require('../models/class.model');
const Subject = require('../models/subject.model');
const Teacher = require('../models/teacher.model');
const Student = require('../models/student.model');
const TeacherApplication = require('../models/teacherApplication.model');
const Parent = require('../models/parent.model');

const { hashPassword } = require('../utils/password');
const teacherService = require('../services/teacher.service');
const studentService = require('../services/student.service');
const teacherApplicationService = require('../services/teacherApplication.service');

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

function parseOptions(argv = process.argv.slice(2)) {
  const options = {
    teachers: 4,
    students: 12,
    applications: 10,
    reset: true
  };

  for (const rawArg of argv) {
    const arg = String(rawArg).trim();
    if (!arg) continue;

    if (arg.startsWith('--teachers=')) {
      options.teachers = parsePositiveInt(arg.split('=')[1], options.teachers);
      continue;
    }

    if (arg.startsWith('--students=')) {
      options.students = parsePositiveInt(arg.split('=')[1], options.students);
      continue;
    }

    if (arg.startsWith('--applications=')) {
      options.applications = parsePositiveInt(
        arg.split('=')[1],
        options.applications
      );
      continue;
    }

    if (arg === '--no-reset') {
      options.reset = false;
    }
  }

  return options;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.ADMIN_PASSWORD || 'admin@123';

  await User.deleteMany({ email: null });

  const existing = await User.findOne({ email, role: 'admin' });
  if (existing) {
    return { created: false, email, password: 'already_set' };
  }

  await User.create({
    fullName: 'Super Admin',
    email,
    password: await hashPassword(password),
    role: 'admin'
  });

  return { created: true, email, password };
}

async function seedDomainsAndClasses() {
  const domainPayload = [
    {
      name: 'Vedic Math',
      code: 'VEDIC_MATH',
      description: 'Vedic Math programs'
    },
    { name: 'Abacus', code: 'ABACUS', description: 'Abacus programs' },
    {
      name: 'Generic School',
      code: 'GENERIC_SCHOOL',
      description: 'Class 1-12 mainstream'
    }
  ];

  const domains = {};

  for (const payload of domainPayload) {
    let domain = await Domain.findOne({ code: payload.code });
    if (!domain) domain = await Domain.create(payload);
    domains[payload.code] = domain;
  }

  for (let cls = 1; cls <= 12; cls += 1) {
    await ClassModel.findOneAndUpdate(
      {
        domainId: domains.GENERIC_SCHOOL._id,
        className: `Class ${cls}`,
        section: 'A'
      },
      {
        domainId: domains.GENERIC_SCHOOL._id,
        className: `Class ${cls}`,
        standardNumber: cls,
        section: 'A'
      },
      { upsert: true, new: true }
    );
  }

  for (let level = 1; level <= 8; level += 1) {
    await ClassModel.findOneAndUpdate(
      {
        domainId: domains.ABACUS._id,
        className: `Level ${level}`,
        section: 'A'
      },
      {
        domainId: domains.ABACUS._id,
        className: `Level ${level}`,
        section: 'A'
      },
      { upsert: true, new: true }
    );
  }

  for (let level = 1; level <= 4; level += 1) {
    await ClassModel.findOneAndUpdate(
      {
        domainId: domains.VEDIC_MATH._id,
        className: `Level ${level}`,
        section: 'A'
      },
      {
        domainId: domains.VEDIC_MATH._id,
        className: `Level ${level}`,
        section: 'A'
      },
      { upsert: true, new: true }
    );
  }

  return domains;
}

async function seedSubjects(domains) {
  const genericClasses = await ClassModel.find({
    domainId: domains.GENERIC_SCHOOL._id
  }).sort({ standardNumber: 1 });

  const genericSubjects = [
    { name: 'Math', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'English', code: 'ENG' },
    { name: 'Social Science', code: 'SST' },
    { name: 'Computer', code: 'COMP' }
  ];

  for (const classDoc of genericClasses) {
    for (const subject of genericSubjects) {
      await Subject.findOneAndUpdate(
        { classId: classDoc._id, name: subject.name },
        {
          domainId: domains.GENERIC_SCHOOL._id,
          classId: classDoc._id,
          name: subject.name,
          code: subject.code
        },
        { upsert: true, new: true }
      );
    }
  }
}

function pickTeacherName(index) {
  const names = [
    'Amit Sharma',
    'Neha Verma',
    'Raj Mehta',
    'Pooja Iyer',
    'Karan Singh',
    'Riya Patel',
    'Sonal Gupta',
    'Arjun Nair',
    'Deepika Rao',
    'Vikram Das'
  ];

  return names[(index - 1) % names.length];
}

async function seedTeachers(domains, teacherCount) {
  const genericClasses = await ClassModel.find({
    domainId: domains.GENERIC_SCHOOL._id
  })
    .sort({ standardNumber: 1 })
    .limit(10);

  const created = [];
  const existing = [];

  for (let i = 1; i <= teacherCount; i += 1) {
    const email = `teacher${i}@schoolerp.com`;
    const phone = `90000000${String(i).padStart(2, '0')}`;

    const exists = await Teacher.findOne({ email });

    const classOne = genericClasses[(i * 2) % genericClasses.length];
    const classTwo = genericClasses[(i * 2 + 1) % genericClasses.length];

    if (exists) {
      existing.push(email);
      continue;
    }

    const newTeacher = await teacherService.createTeacher({
      name: pickTeacherName(i),
      email,
      phone,
      domainIds: [domains.GENERIC_SCHOOL._id],
      subjectIds: [],
      assignedClassIds: [classOne._id, classTwo._id],
      experience: 3 + (i % 6),
      qualification: 'B.Ed, M.A',
      password: 'Teacher@123'
    });

    created.push(newTeacher.credentials);
  }

  return { created, existing };
}

function padNumber(num, digits) {
  return String(num).padStart(digits, '0');
}

async function seedStudents(domains, studentCount) {
  const classes = await ClassModel.find({
    domainId: domains.GENERIC_SCHOOL._id,
    standardNumber: { $gte: 1, $lte: 10 }
  }).sort({ standardNumber: 1 });

  const created = [];
  const existing = [];

  for (let i = 1; i <= studentCount; i += 1) {
    const rollNumber = `STD${1000 + i}`;
    const already = await Student.findOne({ rollNumber });

    if (already) {
      existing.push(rollNumber);
      continue;
    }

    const classDoc = classes[(i - 1) % classes.length];

    const student = await studentService.createStudent({
      fullName: `Student ${i}`,
      dateOfBirth: `201${(i % 9) + 1}-0${(i % 9) + 1}-10`,
      gender: i % 2 === 0 ? 'male' : 'female',
      domainId: domains.GENERIC_SCHOOL._id.toString(),
      classId: classDoc._id.toString(),
      className: classDoc.className,
      section: 'A',
      rollNumber,
      parentName: `Parent ${i}`,
      parentPhone: `91${padNumber(i, 8)}`,
      parentEmail: `parent${i}@example.com`,
      address: 'New Delhi',
      admissionDate: '2025-04-01',
      previousSchool: `Previous School ${i}`,
      previousMarks: [
        {
          examName: 'Previous Final',
          percentage: 70 + (i % 25),
          year: 2024
        }
      ],
      documents: []
    });

    created.push({
      rollNumber,
      studentCredentials: student.studentCredentials,
      parentCredentials: student.parentCredentials
    });
  }

  return { created, existing };
}

async function seedTeacherApplications(domains, applicationCount) {
  const created = [];
  const existing = [];

  const domainIds = [
    domains.GENERIC_SCHOOL._id,
    domains.ABACUS._id,
    domains.VEDIC_MATH._id
  ];

  for (let i = 1; i <= applicationCount; i += 1) {
    const email = `apply.teacher${i}@mail.com`;
    const phone = `88880000${String(i).padStart(2, '0')}`;

    const already = await TeacherApplication.findOne({
      $or: [{ email }, { phone }],
      status: { $in: ['pending', 'approved'] }
    });

    if (already) {
      existing.push(email);
      continue;
    }

    const application = await teacherApplicationService.applyTeacher({
      fullName: `Applicant Teacher ${i}`,
      email,
      phone,
      qualification: 'B.Sc, B.Ed',
      experience: 2 + (i % 8),
      subjects: ['Math', 'Science'],
      domainId: domainIds[(i - 1) % domainIds.length],
      currentOrganization: `School ${i}`,
      address: `Teacher Address ${i}`,
      coverLetter: `Application submitted by demo teacher ${i}`
    });

    created.push({
      id: application._id.toString(),
      email: application.email,
      phone: application.phone
    });
  }

  return { created, existing };
}

async function dropCollectionSafe(name) {
  try {
    await mongoose.connection.db.dropCollection(name);
    console.log(`Dropped collection: ${name}`);
  } catch (error) {
    console.log(`Collection ${name} does not exist or already dropped`);
  }
}

async function run() {
  const options = parseOptions();

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school_erp';
  await connectDB(mongoUri);

  if (options.reset) {
    console.log('Clearing existing data...');
    const collectionsToDrop = [
      'users',
      'domains',
      'classes',
      'subjects',
      'teachers',
      'students',
      'parents',
      'teacherApplications'
    ];

    for (const name of collectionsToDrop) {
      await dropCollectionSafe(name);
    }
  }

  const admin = await seedAdmin();
  const domains = await seedDomainsAndClasses();
  await seedSubjects(domains);

  const teachers = await seedTeachers(domains, options.teachers);
  const students = await seedStudents(domains, options.students);
  const applications = await seedTeacherApplications(domains, options.applications);

  console.log('\nSEED SUMMARY');
  console.log('Options:', options);
  console.log('Admin:', admin);
  console.log(
    'Teachers created:',
    teachers.created.length,
    'existing:',
    teachers.existing.length
  );
  console.log(
    'Students created:',
    students.created.length,
    'existing:',
    students.existing.length
  );
  console.log(
    'Teacher applications created:',
    applications.created.length,
    'existing:',
    applications.existing.length
  );

  if (teachers.created.length > 0) {
    console.log('\nDemo teacher credentials:');
    console.table(teachers.created);
  }

  if (students.created.length > 0) {
    console.log('\nDemo student credentials sample:');
    console.table(
      students.created.slice(0, Math.min(5, students.created.length)).map((item) => ({
        rollNumber: item.rollNumber,
        studentUsername: item.studentCredentials.username,
        studentPassword: item.studentCredentials.password,
        parentPhone: item.parentCredentials.phone,
        parentPassword: item.parentCredentials.password
      }))
    );
  }

  if (applications.created.length > 0) {
    console.log('\nPending teacher applications sample:');
    console.table(
      applications.created
        .slice(0, Math.min(10, applications.created.length))
        .map((item) => ({ id: item.id, email: item.email, phone: item.phone }))
    );
  }

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
