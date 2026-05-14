import React, { useState, useEffect, useCallback } from "react";
import ExamTimer from "../components/Exam/ExamTimer";
import QuestionCard from "../components/Exam/QuestionCard";
import SubmitButton from "../components/Exam/SubmitButton";
import StatusIndicator from "../components/Proctoring/StatusIndicator";
import useProctoring from "../hooks/useProctoring.js";
import examService from "../services/exam.js";
import "../styles/exam.css";
import "../styles/modal.css";

export default function ExamRoom({ onNavigate }) {
  const [showWarning, setShowWarning] = useState(false);
  const [proctoringStarted, setProctoringStarted] = useState(false);
  
  // Sınav State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // Session ID — exam-service gelince API'den alınacak, şimdilik geçici
  const [sessionId] = useState(() => `session_${Date.now()}`);

  // Proctoring hook — tüm AI entegrasyonu burada
  const proctoring = useProctoring(sessionId);

  // Risk seviyesi rengini belirle
  const getRiskClass = (level) => {
    if (level === "high" || level === "critical") return "risk-indicator--high";
    if (level === "medium") return "risk-indicator--medium";
    return "risk-indicator--low";
  };

  const getRiskLabel = (level) => {
    const labels = { low: "Düşük", medium: "Orta", high: "Yüksek", critical: "Kritik" };
    return labels[level] || "Düşük";
  };

  // Proctoring'i başlat
  const handleStartProctoring = useCallback(async () => {
    setLoading(true);
    try {
      // Örnek: examId "exam-1" olsun, sınavı başlat ve soruları çek
      try {
        await examService.startSession("exam-1");
      } catch (err) {
        console.warn("Sınav başlatma API hatası (iskelet olduğu için görmezden geliniyor):", err);
      }
      
      let fetchedQuestions = [];
      try {
        const questionsRes = await fetch('/api/exams/exam-1/questions').then(r => r.json());
        if (questionsRes.success && questionsRes.questions) {
           fetchedQuestions = questionsRes.questions;
        }
      } catch (err) {
        console.warn("Soruları çekme hatası (iskelet olduğu için görmezden geliniyor):", err);
      }

      if (fetchedQuestions.length === 0) {
        // Fallback sorular
        fetchedQuestions = [
          {
            _id: "q_mock1",
            text: "(Fallback) Aşağıdaki integrali çözünüz: ∫x² dx",
            options: ["A) x³/3 + C", "B) x³ + C", "C) 2x + C", "D) x²/2 + C"]
          },
          {
            _id: "q_mock2",
            text: "(Fallback) Hangi dilde 'print' komutu ekrana yazı yazdırmak için kullanılır?",
            options: ["A) Python", "B) HTML", "C) CSS", "D) SQL"]
          }
        ];
      }
      setQuestions(fetchedQuestions);
      
      await proctoring.startProctoring();
      proctoring.requestFullscreen();
      setProctoringStarted(true);
    } catch (err) {
      console.error("Sınav başlatılırken kritik hata:", err);
    } finally {
      setLoading(false);
    }
  }, [proctoring]);

  // Tab/Fullscreen ihlal uyarısı
  useEffect(() => {
    if (proctoringStarted && !proctoring.isFullscreen && !showWarning) {
      setShowWarning(true);
    }
  }, [proctoring.isFullscreen, proctoringStarted, showWarning]);

  // Sekme değişimi uyarısı
  useEffect(() => {
    if (proctoringStarted && !proctoring.isTabVisible) {
      setShowWarning(true);
    }
  }, [proctoring.isTabVisible, proctoringStarted]);

  // Maks ihlal kontrolü
  const maxViolations = 3;
  const totalViolations = proctoring.violationCount;

  useEffect(() => {
    if (totalViolations >= maxViolations) {
      proctoring.stopProctoring();
      // Öğrenci ihlalden atılırsa login'e at (instructor-dashboard öğrenciye yasaklı)
      alert("Maksimum kural ihlali sayısına ulaştınız. Sınavınız sonlandırıldı.");
      import("../services/auth.js").then((auth) => {
         auth.default.logout();
         onNavigate("login");
      });
    }
  }, [totalViolations, maxViolations, proctoring, onNavigate]);

  // Henüz proctoring başlamadıysa başlangıç ekranı göster
  if (!proctoringStarted) {
    return (
      <div className="exam-layout">
        <div className="exam-start-screen">
          <div className="exam-logo" style={{ fontSize: "2rem", marginBottom: "1rem" }}>AI</div>
          <h2 style={{ marginBottom: "0.5rem", color: "#e0e0e0" }}>Sınava Başlamadan Önce</h2>
          <p style={{ color: "#aaa", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            Sınav süresince kameranız açık olacak ve yapay zeka analizi çalışacaktır.<br />
            Lütfen kamera ve mikrofon erişimine izin verin.
          </p>
          <ul style={{ textAlign: "left", color: "#bbb", marginBottom: "1.5rem", lineHeight: "2" }}>
            <li> Kamera erişimi gereklidir</li>
            <li> Tam ekran modunda kalmanız gerekir</li>
            <li> Sekme değiştirmek ihlal sayılır</li>
            <li> Yapay zeka risk skoru hesaplayacaktır</li>
          </ul>
          <button className="btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1rem" }} onClick={handleStartProctoring} disabled={loading}>
            {loading ? "Yükleniyor..." : "Sınavı Başlat"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-layout">
      <header className="exam-header">
        <div className="exam-header-left">
          <div className="exam-logo">AI</div>
          <div className="exam-title-text">Sınav: Matematik Vize</div>
        </div>
        <ExamTimer time="00:42:13" />
      </header>

      <div className="exam-status-bar">
        {/* Kamera durumu — gerçek */}
        <StatusIndicator type="camera" status={proctoring.cameraActive ? "active" : "inactive"} />

        {/* Yüz algılama — AI'dan */}
        <StatusIndicator
          type="face"
          status={proctoring.faceResult?.face_detected ? "active" : "inactive"}
        />

        {/* Göz takibi — AI'dan */}
        <StatusIndicator
          type="gaze"
          status={proctoring.gazeResult?.gaze === "screen" ? "active" : "inactive"}
          detail={proctoring.gazeResult ? `Bakış: ${proctoring.gazeResult.gaze}` : undefined}
        />

        {/* Fullscreen durumu — gerçek */}
        <StatusIndicator type="fullscreen" status={proctoring.isFullscreen ? "active" : "inactive"} />

        {/* Risk skoru — AI'dan */}
        <div className={`status-indicator risk-indicator ${getRiskClass(proctoring.riskData.risk_level)}`}>
          Risk: {Math.round(proctoring.riskData.risk_score)} ({getRiskLabel(proctoring.riskData.risk_level)})
          {proctoring.isAnalyzing && <span className="analyzing-dot"> ●</span>}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: "220px", right: "20px", background: "rgba(0,0,0,0.8)", color: "#0f0", padding: "10px", borderRadius: "8px", fontSize: "11px", fontFamily: "monospace", zIndex: 1000, maxWidth: "300px", wordWrap: "break-word" }}>
        <strong>AI Debug Log:</strong><br/>
        Face: {JSON.stringify(proctoring.faceResult)}<br/>
        Gaze: {JSON.stringify(proctoring.gazeResult)}
      </div>
      {/* Canlı video elementi — Kullanıcı kendini görebilsin diye ekranın köşesine alındı */}
      <video
        ref={proctoring.videoRef}
        style={{ 
          position: "fixed", 
          bottom: "20px", 
          right: "20px", 
          width: "240px", 
          height: "180px", 
          borderRadius: "12px", 
          border: "3px solid rgba(255, 255, 255, 0.2)", 
          zIndex: 1000, 
          transform: "scaleX(-1)", // ayna efekti
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          objectFit: "cover"
        }}
        autoPlay
        muted
        playsInline
      />

      <main className="exam-main">
        {questions.length > 0 ? (
          <>
            <div className="question-counter">Soru {currentQuestionIndex + 1} / {questions.length}</div>
            <QuestionCard 
              question={questions[currentQuestionIndex]}
              selectedOption={answers[questions[currentQuestionIndex]._id]}
              onOptionSelect={(optIndex) => {
                setAnswers(prev => ({...prev, [questions[currentQuestionIndex]._id]: optIndex}));
              }}
            />
            <div className="exam-nav">
              <button 
                className="btn-exam btn-exam--prev" 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Önceki
              </button>
              <div className="exam-nav-right">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button 
                    className="btn-exam btn-exam--next"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  >
                    Sonraki
                  </button>
                ) : (
                  <SubmitButton onNavigate={async () => {
                     await examService.finishSession(sessionId);
                     onNavigate("instructor-dashboard");
                  }} />
                )}
              </div>
            </div>
          </>
        ) : (
           <div className="question-card" style={{ textAlign: "center", padding: "3rem" }}>
             Yükleniyor...
           </div>
        )}
      </main>

      {/* Uyarı Modalı — gerçek ihlal verisiyle */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-warn-icon">⚠️</span>
              <h3 className="modal-title">UYARI</h3>
            </div>
            <div className="modal-body">
              {!proctoring.isFullscreen && (
                <p className="modal-line">Tam ekran modundan çıkıldı. Lütfen yeniden tam ekran moduna dönünüz.</p>
              )}
              {!proctoring.isTabVisible && (
                <p className="modal-line">Başka bir sekmeye geçiş algılandı.</p>
              )}
              <p className="modal-violation">
                İhlal sayısı: {totalViolations} / {maxViolations}
              </p>
            </div>
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "0.65rem" }}
              onClick={() => {
                setShowWarning(false);
                proctoring.requestFullscreen();
              }}
            >
              Tam Ekrana Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
