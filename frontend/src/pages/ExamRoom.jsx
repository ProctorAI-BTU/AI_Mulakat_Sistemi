import React, { useState } from "react";
import ExamTimer from "../components/Exam/ExamTimer";
import QuestionCard from "../components/Exam/QuestionCard";
import SubmitButton from "../components/Exam/SubmitButton";
import StatusIndicator from "../components/Proctoring/StatusIndicator";
import "../styles/exam.css";
import "../styles/modal.css";

export default function ExamRoom({ onNavigate }) {
  const [showWarning, setShowWarning] = useState(true); // Demo uyarı modalı

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
        <StatusIndicator type="camera" status="active" />
        <StatusIndicator type="mic" status="active" />
        <StatusIndicator type="fullscreen" status="active" />
        <div className="status-indicator risk-indicator risk-indicator--low">
          Risk: 24 (Düşük)
        </div>
      </div>

      <main className="exam-main">
        <div className="question-counter">Soru 1 / 2</div>
        <QuestionCard />
        
        <div className="exam-nav">
          <button className="btn-exam btn-exam--prev" disabled>Önceki</button>
          <div className="exam-nav-right">
            <button className="btn-exam btn-exam--next">Sonraki</button>
            <SubmitButton onNavigate={onNavigate} />
          </div>
        </div>
      </main>

      {/* Uyarı Modalı */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
               <span className="modal-warn-icon">⚠️</span>
               <h3 className="modal-title">UYARI</h3>
            </div>
            <div className="modal-body">
              <p className="modal-line">Tam ekran modundan çıkıldı.</p>
              <p className="modal-violation">İhlal sayısı: 2 / 3</p>
            </div>
            <button className="btn-primary" style={{width: '100%', padding: '0.65rem'}} onClick={() => setShowWarning(false)}>
              Tam Ekrana Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}