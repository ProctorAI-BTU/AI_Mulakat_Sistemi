import React from "react";

export default function StatusIndicator({ type, status }) {
  const dotColor = status === "active" ? "dot--green" : "dot--red";
  
  let label = "";
  if (type === "camera") label = "Kamera: Aktif";
  if (type === "mic") label = "Mikrofon: Aktif";
  if (type === "fullscreen") label = "Fullscreen: Açık";

  return (
    <div className="status-indicator">
      <div className={`dot ${dotColor}`}></div> {label}
    </div>
  );
}