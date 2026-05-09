import React from "react";

export default function SubmitButton({ onNavigate }) {
  return (
    <button 
      className="btn-exam btn-exam--submit" 
      onClick={() => onNavigate("instructor-dashboard")}
    >
      Sınavı Bitir
    </button>
  );
}