import React from "react";
import AlertFeed from "../components/Dashboard/AlertFeed";
import StudentGrid from "../components/Dashboard/StudentGrid";
import RiskCharts from "../components/Dashboard/RiskCharts";
import "../styles/dashboard.css";
import "../styles/admin.css";

export default function InstructorDashboard({ onNavigate, onLogout }) {
  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">AI</div>
          <span className="navbar-logo-text">Dashboard</span>
        </div>
        <div className="navbar-links">
          <button className="navbar-link navbar-link--active">Dashboard</button>
          <button className="navbar-link">Sınav Yönetimi</button>
          <button className="navbar-link" onClick={() => onNavigate("report")}>Raporlar</button>
        </div>
        <button className="btn-logout" onClick={onLogout}>Çıkış</button>
      </nav>

      <main className="dashboard-main">
        <AlertFeed />
        <RiskCharts />
        <StudentGrid onNavigate={onNavigate} />
      </main>
    </div>
  );
}