import React from "react";

export default function QuestionCard() {
  return (
    <div className="question-card">
      <p className="question-text">Aşağıdaki integrali çözünüz: ∫x² dx</p>
      <div className="options-list">
        {["A) x³/3 + C", "B) x³ + C", "C) 2x + C", "D) x²/2 + C"].map((opt, i) => (
          <label key={i} className="option-item">
            <input type="radio" name="q1" className="option-radio" />
            <span className="option-text">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}