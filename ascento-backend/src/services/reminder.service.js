const cron = require('node-cron');
const OnlineClass = require('../models/onlineClass.model');
const Student = require('../models/student.model');
const Parent = require('../models/parent.model');
const Notification = require('../models/notification.model');
const logger = require('../utils/logger');

let reminderJobStarted = false;

async function queueReminderForOnlineClass(onlineClass, reminderMinutes) {
  const students = await Student.find({ classId: onlineClass.classId }).select(
    '_id userId parentId fullName'
  );

  for (const student of students) {
    const title = `Upcoming Class Reminder (${reminderMinutes} mins)`;
    const message = `${onlineClass.title} starts at ${onlineClass.startTime}. Link: ${onlineClass.meetingLink}`;

    for (const channel of ['push', 'email']) {
      await Notification.findOneAndUpdate(
        {
          userId: student.userId,
          onlineClassId: onlineClass._id,
          reminderMinutes,
          channel
        },
        {
          userId: student.userId,
          studentId: student._id,
          onlineClassId: onlineClass._id,
          type: 'CLASS_REMINDER',
          channel,
          title,
          message,
          reminderMinutes,
          status: 'queued'
        },
        { upsert: true, new: true }
      );
    }

    if (student.parentId) {
      const parent = await Parent.findById(student.parentId).select('userId');
      if (parent && parent.userId) {
        for (const channel of ['push', 'email']) {
          await Notification.findOneAndUpdate(
            {
              userId: parent.userId,
              onlineClassId: onlineClass._id,
              reminderMinutes,
              channel
            },
            {
              userId: parent.userId,
              studentId: student._id,
              onlineClassId: onlineClass._id,
              type: 'CLASS_REMINDER',
              channel,
              title,
              message,
              reminderMinutes,
              status: 'queued'
            },
            { upsert: true, new: true }
          );
        }
      }
    }
  }
}

async function queueClassReminders(reminderMinutes) {
  const now = new Date();
  const targetStart = new Date(now.getTime() + reminderMinutes * 60 * 1000);
  const targetEnd = new Date(targetStart.getTime() + 60 * 1000);

  const classes = await OnlineClass.find({
    isActive: true,
    startDateTime: { $gte: targetStart, $lt: targetEnd }
  });

  for (const onlineClass of classes) {
    await queueReminderForOnlineClass(onlineClass, reminderMinutes);
  }
}

async function dispatchQueuedNotifications() {
  const pending = await Notification.find({ status: 'queued' }).limit(200);

  for (const item of pending) {
    item.status = 'sent';
    item.sentAt = new Date();
    await item.save();

    logger.info(
      `[Reminder] ${item.channel.toUpperCase()} sent to user ${item.userId} for class ${item.onlineClassId}`
    );
  }
}

async function runReminderCycle() {
  await queueClassReminders(30);
  await queueClassReminders(10);
  await dispatchQueuedNotifications();
}

function startReminderJob() {
  if (reminderJobStarted) return;

  cron.schedule('* * * * *', async () => {
    try {
      await runReminderCycle();
    } catch (error) {
      logger.error('Reminder job failed', error);
    }
  });

  reminderJobStarted = true;
  logger.info('Reminder job started (runs every minute)');
}

module.exports = {
  startReminderJob,
  runReminderCycle
};
