import React from "react";

/**
 * StatusIndicator — Kamera, mikrofon, fullscreen durum göstergesi
 * Artık statik değil, gerçek proctoring durumunu gösteriyor
 */
export default function StatusIndicator({ type, status, detail }) {
  const isActive = status === "active";
  const dotColor = isActive ? "dot--green" : "dot--red";

  const labels = {
    camera: isActive ? "Kamera: Aktif" : "Kamera: Kapalı",
    mic: isActive ? "Mikrofon: Aktif" : "Mikrofon: Kapalı",
    fullscreen: isActive ? "Fullscreen: Açık" : "Fullscreen: Kapalı",
    face: isActive ? "Yüz: Algılandı" : "Yüz: Algılanmadı",
    gaze: detail || (isActive ? "Bakış: Ekranda" : "Bakış: Ekran Dışı"),
  };

  const label = labels[type] || type;

  return (
    <div className="status-indicator">
      <div className={`dot ${dotColor}`}></div> {label}
    </div>
  );
}