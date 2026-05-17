import React from "react";

export default function QuestionCard({ question, selectedOption, onOptionSelect }) {
  if (!question) return null;

  return (
    <div className="question-card">
      <p className="question-text">{question.text}</p>
      <div className="options-list">
        {question.options.map((opt, i) => (
          <label key={i} className="option-item">
            <input 
              type="radio" 
              name={`q_${question._id}`} 
              className="option-radio" 
              checked={selectedOption === i}
              onChange={() => onOptionSelect(i)}
            />
            <span className="option-text">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}