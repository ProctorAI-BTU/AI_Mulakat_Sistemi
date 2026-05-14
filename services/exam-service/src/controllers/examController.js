const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const timerService = require('../services/timerService');
const { isMongoConnected } = require('../config/db');

const memoryExams = [];

function createMemoryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

exports.serviceInfo = async (req, res) => {
  return res.json({
    success: true,
    service: 'exam-service',
    status: 'ok',
    database: isMongoConnected() ? 'mongodb' : 'memory-fallback',
    message: 'Exam Service iskeleti çalışıyor.',
  });
};

exports.createExam = async (req, res, next) => {
  try {
    const { title, description, duration, instructorId, status, startTime, endTime } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        message: 'title ve duration alanları zorunludur.',
      });
    }

    if (isMongoConnected()) {
      const exam = await Exam.create({
        title,
        description,
        duration,
        instructorId,
        status: status || 'draft',
        startTime,
        endTime,
      });

      return res.status(201).json({
        success: true,
        message: 'Sınav oluşturuldu.',
        exam,
      });
    }

    const exam = {
      _id: createMemoryId(),
      title,
      description: description || '',
      duration,
      instructorId: instructorId || null,
      status: status || 'draft',
      startTime: startTime || null,
      endTime: endTime || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryExams.push(exam);

    return res.status(201).json({
      success: true,
      message: 'Sınav memory modda oluşturuldu.',
      exam,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getExams = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      const exams = await Exam.find().sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: exams.length,
        exams,
      });
    }

    return res.json({
      success: true,
      count: memoryExams.length,
      exams: memoryExams,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const exam = await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Sınav bulunamadı.',
        });
      }

      const questions = await Question.find({ examId: id }).sort({ orderIndex: 1 });

      return res.json({
        success: true,
        exam,
        questions,
      });
    }

    const exam = memoryExams.find((item) => item._id === id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Sınav bulunamadı.',
      });
    }

    return res.json({
      success: true,
      exam,
      questions: [],
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const exam = await Exam.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Sınav bulunamadı.',
        });
      }

      return res.json({
        success: true,
        message: 'Sınav güncellendi.',
        exam,
      });
    }

    const examIndex = memoryExams.findIndex((item) => item._id === id);

    if (examIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sınav bulunamadı.',
      });
    }

    memoryExams[examIndex] = {
      ...memoryExams[examIndex],
      ...req.body,
      updatedAt: new Date(),
    };

    return res.json({
      success: true,
      message: 'Sınav memory modda güncellendi.',
      exam: memoryExams[examIndex],
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const exam = await Exam.findByIdAndDelete(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Sınav bulunamadı.',
        });
      }

      return res.json({
        success: true,
        message: 'Sınav silindi.',
      });
    }

    const examIndex = memoryExams.findIndex((item) => item._id === id);

    if (examIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sınav bulunamadı.',
      });
    }

    memoryExams.splice(examIndex, 1);

    return res.json({
      success: true,
      message: 'Sınav memory moddan silindi.',
    });
  } catch (error) {
    return next(error);
  }
};

exports.startExamSkeleton = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const sessionId = `${id}-${studentId || 'anonymous'}-${Date.now()}`;

    let duration = 30;

    if (isMongoConnected()) {
      const exam = await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Sınav bulunamadı.',
        });
      }

      duration = exam.duration;
    } else {
      const exam = memoryExams.find((item) => item._id === id);
      duration = exam?.duration || 30;
    }

    const timer = timerService.startTimer(sessionId, duration);

    return res.status(201).json({
      success: true,
      message: 'Sınav başlatma iskeleti çalıştı. Detay endpoint Mehmet/Koray görevinde geliştirilecek.',
      session: {
        sessionId,
        examId: id,
        studentId: studentId || null,
        startedAt: timer.startedAt,
        expiresAt: timer.expiresAt,
        remainingSeconds: timerService.getRemainingSeconds(sessionId),
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.endExamSkeleton = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      timerService.clearTimer(sessionId);
    }

    return res.json({
      success: true,
      message: 'Sınav bitirme iskeleti çalıştı. Cevap kaydetme ve puanlama diğer görevlerde tamamlanacak.',
    });
  } catch (error) {
    return next(error);
  }
};
