
// Exam Service API — Frontend tarafı
// Sınav listeleme, başlatma, cevap gönderme, sonuç görüntüleme
// Backend (exam-service :3002) gelince bu dosya otomatik çalışacak

import api from './api.js';

const examService = {

  // ──────────────────────────────────────────────
  // Sınav Listesi (Eğitmen & Öğrenci)
  // ──────────────────────────────────────────────
  async getExams() {
    return api.get('/api/exams');
  },

  async getExamById(examId) {
    return api.get(`/api/exams/${examId}`);
  },

  // ──────────────────────────────────────────────
  // Sınav Oluşturma (Eğitmen)
  // ──────────────────────────────────────────────
  async createExam(examData) {
    return api.post('/api/exams', examData);
  },

  async updateExam(examId, examData) {
    return api.put(`/api/exams/${examId}`, examData);
  },

  async deleteExam(examId) {
    return api.delete(`/api/exams/${examId}`);
  },

  // ──────────────────────────────────────────────
  // Sınav Oturumu (Öğrenci)
  // ──────────────────────────────────────────────
  async startSession(examId) {
    // Backend'de route: /api/exams/:id/start
    return api.post(`/api/exams/${examId}/start`, { studentId: "student-1" });
  },

  async getSession(sessionId) {
    return api.get(`/api/sessions/${sessionId}`); // Henüz backendde yok, mocklanabilir
  },

  async submitAnswer(sessionId, questionId, answer) {
    return api.post(`/api/sessions/${sessionId}/answer`, { questionId, answer }); // İleride eklenecek
  },

  async finishSession(examId, sessionId) {
    // Backend'de route: /api/exams/:id/end
    return api.post(`/api/exams/${examId}/end`, { sessionId });
  },

  // ──────────────────────────────────────────────
  // Sonuçlar
  // ──────────────────────────────────────────────
  async getSessionResults(sessionId) {
    return api.get(`/api/sessions/${sessionId}/results`);
  },

  async getExamSessions(examId) {
    return api.get(`/api/exams/${examId}/sessions`);
  },
};

export default examService;
