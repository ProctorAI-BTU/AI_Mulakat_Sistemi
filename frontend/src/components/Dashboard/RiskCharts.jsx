import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/charts.css";

// Chart.js modullerini kayit et
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RiskCharts() {
  // ----- PASTA (DOUGHNUT) GRAFIK: Risk seviyesi dagilimi -----
  const doughnutData = {
    labels: ["Normal", "Orta Risk", "Yuksek Risk", "Kritik"],
    datasets: [
      {
        label: "Ogrenci Sayisi",
        data: [28, 12, 6, 2], // Mock veri, sonra API'den gelecek
        backgroundColor: [
          "#16a34a", // yesil - normal
          "#facc15", // sari - orta
          "#dc2626", // kirmizi - yuksek
          "#be123c", // koyu kirmizi - kritik
        ],
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          font: { size: 13, weight: "500" },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
      },
    },
  };

  // ----- BAR GRAFIK: Sinav bazli ortalama risk -----
  const barData = {
    labels: ["Matematik Vize", "Fizik Final", "Kimya Vize", "Biyoloji Quiz", "Tarih Vize"],
    datasets: [
      {
        label: "Ortalama Risk Skoru",
        data: [24, 78, 42, 18, 56], // Mock veri
        backgroundColor: [
          "#16a34a",
          "#dc2626",
          "#facc15",
          "#16a34a",
          "#facc15",
        ],
        borderRadius: 8,
        barThickness: 36,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `Risk: ${ctx.parsed.y} / 100`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          stepSize: 20,
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: {
          color: "#374151",
          font: { size: 12, weight: "500" },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3 className="chart-title">Risk Seviyesi Dagilimi</h3>
        <p className="chart-subtitle">Aktif oturumlardaki ogrenci dagilimi</p>
        <div className="chart-canvas chart-canvas--doughnut">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Sinav Bazli Ortalama Risk</h3>
        <p className="chart-subtitle">Aktif sinavlardaki risk skorlari</p>
        <div className="chart-canvas chart-canvas--bar">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}