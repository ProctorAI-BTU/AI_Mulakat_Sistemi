import React from "react";

export default function AlertFeed() {
  return (
    <div className="stat-cards">
      <div className="stat-card">
        <div className="stat-number">3</div>
        <div className="stat-label">Bugünkü Aktif Sınavlar</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">48</div>
        <div className="stat-label">Aktif Oturumlar</div>
      </div>
      <div className="stat-card">
        <div className="stat-number stat-number--danger">4</div>
        <div className="stat-label">Kritik Alarm</div>
      </div>
    </div>
  );
}