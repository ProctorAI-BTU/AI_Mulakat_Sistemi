const API_BASE_URL = "/api";

const examService = {
  async startSession(examId) {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  async getQuestions(examId) {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/questions`);

    if (!response.ok) {
      throw new Error("Sorular alınamadı.");
    }

    return response.json();
  },

  async submitAnswer(sessionId, questionId, selectedOption) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        selectedOption,
      }),
    });

    if (!response.ok) {
      throw new Error("Cevap gönderilemedi.");
    }

    return response.json();
  },

  async finishSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },
};

export default examService;
