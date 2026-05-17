
// Proctoring Service — AI servislerine HTTP çağrılar
// Face Detection, Eye Tracking, Audio Analysis, Risk Scoring
// Tüm istekler Vite proxy üzerinden gider (/ai/face, /ai/eye, /ai/audio, /ai/risk)

const proctoringService = {

  // ──────────────────────────────────────────────
  // Face Detection — Yüz tespiti
  // POST /ai/face/detect → face-detection-service:8091
  // ──────────────────────────────────────────────
  async detectFace(sessionId, imageBase64) {
    try {
      const res = await fetch('/ai/face/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          image_base64: imageBase64,
        }),
      });
      if (!res.ok) throw new Error('Face detection hatası');
      return await res.json();
    } catch (err) {
      console.warn('[Proctoring] Face detection erişilemedi:', err.message);
      return null;
    }
  },

  // ──────────────────────────────────────────────
  // Eye Tracking — Göz takibi
  // POST /ai/eye/track → eye-tracking-service:8092
  // ──────────────────────────────────────────────
  async trackGaze(sessionId, imageBase64) {
    try {
      const res = await fetch('/ai/eye/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          image_base64: imageBase64,
        }),
      });
      if (!res.ok) throw new Error('Eye tracking hatası');
      return await res.json();
    } catch (err) {
      console.warn('[Proctoring] Eye tracking erişilemedi:', err.message);
      return null;
    }
  },

  // ──────────────────────────────────────────────
  // Audio Analysis — Ses analizi
  // POST /ai/audio/analyze → audio-analysis-service:8093
  // ──────────────────────────────────────────────
  async analyzeAudio(sessionId, audioBase64, sampleRate = 16000) {
    try {
      const res = await fetch('/ai/audio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          audio_base64: audioBase64,
          sample_rate: sampleRate,
        }),
      });
      if (!res.ok) throw new Error('Audio analysis hatası');
      return await res.json();
    } catch (err) {
      console.warn('[Proctoring] Audio analysis erişilemedi:', err.message);
      return null;
    }
  },

  // ──────────────────────────────────────────────
  // Risk Scoring — Risk skoru hesaplama
  // POST /ai/risk/analyze → risk-scoring-service:8094
  // ──────────────────────────────────────────────
  async sendEvent(sessionId, eventType, payload = {}) {
    try {
      const res = await fetch('/ai/risk/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          event_type: eventType,
          payload,
        }),
      });
      if (!res.ok) throw new Error('Risk scoring hatası');
      return await res.json();
    } catch (err) {
      console.warn('[Proctoring] Risk scoring erişilemedi:', err.message);
      return null;
    }
  },

  // Risk skorunu getir
  async getRiskScore(sessionId) {
    try {
      const res = await fetch(`/ai/risk/score/${sessionId}`);
      if (!res.ok) throw new Error('Risk score getirme hatası');
      return await res.json();
    } catch (err) {
      console.warn('[Proctoring] Risk score erişilemedi:', err.message);
      return { risk_score: 0, risk_level: 'low', reasons: [], event_counts: {} };
    }
  },

  // ──────────────────────────────────────────────
  // Health Check — Tüm AI servislerinin durumu
  // ──────────────────────────────────────────────
  async checkHealth() {
    const services = [
      { name: 'face-detection', url: '/ai/face/health' },
      { name: 'eye-tracking', url: '/ai/eye/health' },
      { name: 'audio-analysis', url: '/ai/audio/health' },
      { name: 'risk-scoring', url: '/ai/risk/health' },
    ];

    const results = await Promise.allSettled(
      services.map(async (svc) => {
        const res = await fetch(svc.url);
        const data = await res.json();
        return { ...svc, status: data.status, online: true };
      })
    );

    return results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      return { ...services[i], status: 'offline', online: false };
    });
  },
};

export default proctoringService;
