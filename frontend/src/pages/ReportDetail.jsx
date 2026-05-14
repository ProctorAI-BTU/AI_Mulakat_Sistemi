import React from "react";
import "../styles/report.css";

export default function ReportDetail({ onNavigate }) {
  return (
    <div className="report-layout">
      {/* Üst Bar */}
      <nav className="report-navbar">
        <div className="report-nav-title">
          <span style={{background:'#4c3cdb', color:'#fff', padding:'4px 8px', borderRadius:'50%', marginRight:'10px', fontSize:'0.8rem'}}>AI</span>
          Risk Raporu
        </div>
        <button className="report-btn report-btn--view" onClick={() => onNavigate("admin-dashboard")}>
          Geri Dön
        </button>
      </nav>

      <main className="report-main">
        {/* Ana Rapor Kartı */}
        <div className="report-card">
          <div className="report-header-section">
            <h1 className="report-title">Risk Raporu - Oturum #S12345</h1>
            <div className="report-meta-row">
              <span>Öğrenci: <span className="report-meta-value">Ali Yılmaz</span></span>
              <span>Sınav: <span className="report-meta-value">Matematik Vize</span></span>
            </div>
            <div className="report-risk-row">
              Genel Risk Skoru: <span className="report-risk-badge risk--medium">68</span> <span className="report-risk-label">(Orta Risk)</span>
            </div>
          </div>

          <hr className="report-divider" />

          {/* İhlal Özeti */}
          <div className="report-section">
            <h3 className="report-section-title">İhlal Özeti</h3>
            <div className="violation-list" style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
              <div className="violation-row">
                <span>Tam ekran ihlali:</span>
                <span className="violation-count">1</span>
              </div>
              <div className="violation-row">
                <span>Sekme değişimi:</span>
                <span className="violation-count">2</span>
              </div>
              <div className="violation-row">
                <span>Şüpheli ses:</span>
                <span className="violation-count">1</span>
              </div>
              <div className="violation-row">
                <span>Bakış yönü kaybı:</span>
                <span className="violation-count">3</span>
              </div>
            </div>
          </div>

          <hr className="report-divider" />

          {/* Zaman Çizelgesi */}
          <div className="report-section">
            <h3 className="report-section-title">Zaman Çizelgesi</h3>
            <div className="timeline-list">
              <div className="timeline-item timeline-item--fullscreen">
                <span className="timeline-time">00:12:34</span>
                <span className="timeline-event">Tam ekran modundan çıkıldı (5 saniye)</span>
              </div>
              <div className="timeline-item timeline-item--tab">
                <span className="timeline-time">00:18:22</span>
                <span className="timeline-event">Sekme değişimi tespit edildi</span>
              </div>
              <div className="timeline-item timeline-item--gaze">
                <span className="timeline-time">00:25:11</span>
                <span className="timeline-event">Bakış yönü kaybı (8 saniye)</span>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="report-actions">
            <button className="report-btn report-btn--pdf">📄 PDF İndir</button>
            <button className="report-btn report-btn--json">⬇ JSON Dışa Aktar</button>
            <button className="report-btn report-btn--view">👁 Oturumu İncele</button>
          </div>
        </div>

        {/* Kurumsal Gömülü Widget Görünümü Kartı */}
        <div className="report-card widget-preview-card">
          <h3 className="report-section-title">Kurumsal Gömülü Widget Görünümü</h3>
          
          <div className="widget-preview">
            <div className="widget-header">
              <span className="widget-logo-placeholder">LOGO</span>
              <span className="widget-title">Gözetimli Sınav Modülü</span>
            </div>
            
            <div className="widget-status">
              <div className="widget-status-row">
                <div className="dot dot--green"></div> Kamera Durumu: Aktif
              </div>
              <div className="widget-status-row">
                <div className="dot dot--green"></div> Mikrofon Durumu: Aktif
              </div>
            </div>

            <p className="widget-info">Sınav İçeriği Kurumun Kendi Arayüzünde / İframe İçinde Gösterilir</p>
            <button className="widget-start-btn">Sınavı Başlat</button>
          </div>
          
          <p className="widget-description">
            Bu görünüm kurumun LMS veya İK sistemi içerisine gömülür. Kurum kendi tasarımını bozmadan proctoring katmanını kullanabilir.
          </p>
        </div>
      </main>
    </div>
  );
}