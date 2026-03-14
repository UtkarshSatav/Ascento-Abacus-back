'use strict';

const AppError = require('../../core/AppError');
const AcademicYear = require('../../models/AcademicYear.model');
const ClassModel = require('../../models/class.model');
const Section = require('../../models/Section.model');
const StudentEnrollment = require('../../models/StudentEnrollment.model');
const Subject = require('../../models/subject.model');
const Teacher = require('../../models/teacher.model');
const TeacherAssignment = require('../../models/TeacherAssignment.model');
const Timetable = require('../../models/Timetable.model');

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const timetablePopulate = [
  { path: 'classId', populate: { path: 'domainId' } },
  { path: 'sectionId', populate: { path: 'classId' } },
  { path: 'subjectId', populate: { path: 'classId' } },
  { path: 'teacherId', select: '-password' },
  { path: 'academicYearId', select: 'name startDate endDate status' },
];

const populateTimetableQuery = (query) => {
  timetablePopulate.forEach((populate) => {
    query.populate(populate);
  });
  return query;
};

const parseTimeToMinutes = (value, fieldName) => {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(value.trim())) {
    throw new AppError(`${fieldName} must be in HH:mm format.`, 400);
  }

  const [hour, minute] = value.trim().split(':').map(Number);
  return (hour * 60) + minute;
};

const normalizeDayOfWeek = (dayOfWeek) => {
  const normalized = String(dayOfWeek || '').trim().toLowerCase();
  if (!DAY_ORDER.includes(normalized)) {
    throw new AppError('dayOfWeek must be one of monday, tuesday, wednesday, thursday, friday, saturday, sunday.', 400);
  }

  return normalized;
};

const ensureReferenceIntegrity = async ({ classId, sectionId, subjectId, teacherId, academicYearId }) => {
  const [classItem, section, subject, teacher, academicYear] = await Promise.all([
    ClassModel.findById(classId),
    Section.findById(sectionId),
    Subject.findById(subjectId),
    Teacher.findById(teacherId).select('-password'),
    AcademicYear.findById(academicYearId),
  ]);

  if (!classItem) throw new AppError('Class not found.', 404);
  if (!section) throw new AppError('Section not found.', 404);
  if (!subject) throw new AppError('Subject not found.', 404);
  if (!teacher) throw new AppError('Teacher not found.', 404);
  if (!academicYear) throw new AppError('Academic year not found.', 404);

  if (String(section.classId) !== String(classItem._id)) {
    throw new AppError('Section does not belong to the provided class.', 400);
  }

  if (String(subject.classId) !== String(classItem._id)) {
    throw new AppError('Subject does not belong to the provided class.', 400);
  }

  if (String(teacher.domainId) !== String(classItem.domainId)) {
    throw new AppError('Teacher domain does not match the class domain.', 400);
  }
};

const ensureTeacherAssignment = async ({ teacherId, classId, sectionId, subjectId }) => {
  const assignment = await TeacherAssignment.findOne({
    teacherId,
    classId,
    sectionId,
    subjectId,
    status: 'active',
  });

  if (!assignment) {
    throw new AppError('Teacher must be assigned to this class, section, and subject.', 403);
  }
};

const ensureNoPeriodConflicts = async ({
  id,
  classId,
  sectionId,
  teacherId,
  academicYearId,
  dayOfWeek,
  periodNumber,
  status,
}) => {
  if (status !== 'active') {
    return;
  }

  const notCurrent = id ? { _id: { $ne: id } } : {};

  const [classConflict, teacherConflict] = await Promise.all([
    Timetable.findOne({
      classId,
      sectionId,
      academicYearId,
      dayOfWeek,
      periodNumber,
      status: 'active',
      ...notCurrent,
    }),
    Timetable.findOne({
      teacherId,
      academicYearId,
      dayOfWeek,
      periodNumber,
      status: 'active',
      ...notCurrent,
    }),
  ]);

  if (classConflict) {
    throw new AppError('Class already has a subject for this day and period.', 409);
  }

  if (teacherConflict) {
    throw new AppError('Teacher already has another class in this day and period.', 409);
  }
};

const buildTimetableGrid = (entries) => {
  const rows = new Map();

  DAY_ORDER.forEach((day) => {
    rows.set(day, []);
  });

  entries.forEach((entry) => {
    const day = entry.dayOfWeek;
    if (!rows.has(day)) {
      rows.set(day, []);
    }

    rows.get(day).push({
      id: entry._id,
      periodNumber: entry.periodNumber,
      startTime: entry.startTime,
      endTime: entry.endTime,
      status: entry.status,
      subject: entry.subjectId ? {
        id: entry.subjectId._id,
        name: entry.subjectId.name,
        code: entry.subjectId.code,
      } : null,
      teacher: entry.teacherId ? {
        id: entry.teacherId._id,
        name: entry.teacherId.name,
        email: entry.teacherId.email,
      } : null,
    });
  });

  return DAY_ORDER.map((day) => ({
    dayOfWeek: day,
    periods: (rows.get(day) || []).sort((a, b) => a.periodNumber - b.periodNumber),
  }));
};

const create = async (data, adminId) => {
  const dayOfWeek = normalizeDayOfWeek(data.dayOfWeek);
  const periodNumber = Number(data.periodNumber);
  const startMinutes = parseTimeToMinutes(data.startTime, 'startTime');
  const endMinutes = parseTimeToMinutes(data.endTime, 'endTime');

  if (!Number.isInteger(periodNumber) || periodNumber < 1) {
    throw new AppError('periodNumber must be an integer greater than or equal to 1.', 400);
  }

  if (endMinutes <= startMinutes) {
    throw new AppError('endTime must be greater than startTime.', 400);
  }

  const status = data.status || 'active';

  await Promise.all([
    ensureReferenceIntegrity(data),
    ensureTeacherAssignment(data),
    ensureNoPeriodConflicts({
      classId: data.classId,
      sectionId: data.sectionId,
      teacherId: data.teacherId,
      academicYearId: data.academicYearId,
      dayOfWeek,
      periodNumber,
      status,
    }),
  ]);

  const timetable = await Timetable.create({
    ...data,
    dayOfWeek,
    periodNumber,
    status,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return populateTimetableQuery(Timetable.findById(timetable._id));
};

const update = async (id, data, adminId) => {
  const existing = await Timetable.findById(id);
  if (!existing) {
    throw new AppError('Timetable entry not found.', 404);
  }

  const merged = {
    classId: data.classId || existing.classId,
    sectionId: data.sectionId || existing.sectionId,
    subjectId: data.subjectId || existing.subjectId,
    teacherId: data.teacherId || existing.teacherId,
    academicYearId: data.academicYearId || existing.academicYearId,
    dayOfWeek: data.dayOfWeek ? normalizeDayOfWeek(data.dayOfWeek) : existing.dayOfWeek,
    periodNumber: data.periodNumber !== undefined ? Number(data.periodNumber) : existing.periodNumber,
    startTime: data.startTime || existing.startTime,
    endTime: data.endTime || existing.endTime,
    status: data.status || existing.status,
  };

  if (!Number.isInteger(merged.periodNumber) || merged.periodNumber < 1) {
    throw new AppError('periodNumber must be an integer greater than or equal to 1.', 400);
  }

  const startMinutes = parseTimeToMinutes(merged.startTime, 'startTime');
  const endMinutes = parseTimeToMinutes(merged.endTime, 'endTime');
  if (endMinutes <= startMinutes) {
    throw new AppError('endTime must be greater than startTime.', 400);
  }

  await Promise.all([
    ensureReferenceIntegrity(merged),
    ensureTeacherAssignment(merged),
    ensureNoPeriodConflicts({ id, ...merged }),
  ]);

  await Timetable.findByIdAndUpdate(
    id,
    {
      ...data,
      dayOfWeek: merged.dayOfWeek,
      periodNumber: merged.periodNumber,
      updatedBy: adminId,
    },
    { new: true, runValidators: true },
  );

  return populateTimetableQuery(Timetable.findById(id));
};

const remove = async (id) => {
  const deleted = await Timetable.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Timetable entry not found.', 404);
  }
};

const listForClass = async (classId, { sectionId, academicYearId, status } = {}) => {
  const classItem = await ClassModel.findById(classId);
  if (!classItem) {
    throw new AppError('Class not found.', 404);
  }

  const filter = { classId };
  if (sectionId) filter.sectionId = sectionId;
  if (academicYearId) filter.academicYearId = academicYearId;
  if (status) filter.status = status;

  const entries = await populateTimetableQuery(
    Timetable.find(filter).sort({ dayOfWeek: 1, periodNumber: 1, startTime: 1, createdAt: -1 }),
  );

  return {
    entries,
    table: buildTimetableGrid(entries),
  };
};

const listForTeacher = async (teacherId, { academicYearId, status, dayOfWeek } = {}) => {
  const filter = { teacherId };
  if (academicYearId) filter.academicYearId = academicYearId;
  if (status) filter.status = status;
  if (dayOfWeek) filter.dayOfWeek = normalizeDayOfWeek(dayOfWeek);

  const entries = await populateTimetableQuery(
    Timetable.find(filter).sort({ dayOfWeek: 1, periodNumber: 1, startTime: 1, createdAt: -1 }),
  );

  return {
    entries,
    table: buildTimetableGrid(entries),
  };
};

const listForStudent = async (studentId, { academicYearId, status, dayOfWeek } = {}) => {
  const enrollment = await StudentEnrollment.findOne({ studentId, status: 'active' }).sort({ createdAt: -1 })
    || await StudentEnrollment.findOne({ studentId }).sort({ createdAt: -1 });

  if (!enrollment) {
    throw new AppError('No enrollment found for this student.', 404);
  }

  const filter = {
    classId: enrollment.classId,
    sectionId: enrollment.sectionId,
  };

  if (academicYearId) filter.academicYearId = academicYearId;
  if (status) filter.status = status;
  if (dayOfWeek) filter.dayOfWeek = normalizeDayOfWeek(dayOfWeek);

  const entries = await populateTimetableQuery(
    Timetable.find(filter).sort({ dayOfWeek: 1, periodNumber: 1, startTime: 1, createdAt: -1 }),
  );

  return {
    entries,
    table: buildTimetableGrid(entries),
  };
};

module.exports = {
  create,
  update,
  remove,
  listForClass,
  listForTeacher,
  listForStudent,
};