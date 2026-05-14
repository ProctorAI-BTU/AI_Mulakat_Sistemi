import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import InstructorDashboard from "./pages/InstructorDashboard.jsx";
import ExamRoom from "./pages/ExamRoom.jsx";
import ReportDetail from "./pages/ReportDetail.jsx";
import authService from "./services/auth.js";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
        const role = savedUser.role;
        if (role === "admin" || role === "instructor") {
          setPage("instructor-dashboard");
        } else {
          setPage("exam-room");
        }
      }
    }
  }, []);

  const handleNavigate = (target) => {
    // Güvenlik: Öğrenci admin sayfalarına erişemez
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const role = currentUser.role;

      // Öğrenci admin/instructor dashboard'a erişmeye çalışırsa engelle
      if (role === "student" && (target === "instructor-dashboard" || target === "admin-dashboard")) {
        console.warn("[Güvenlik] Öğrenci admin sayfasına erişemez!");
        target = "exam-room";
      }

      // Admin/instructor exam-room'a erişmeye çalışırsa engelle
      if ((role === "admin" || role === "instructor") && target === "exam-room") {
        target = "instructor-dashboard";
      }
    }

    setPage(target);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPage("login");
  };

  // sayfa yönlendirmesi
  switch (page) {
    case "login":
      return <Login onNavigate={handleNavigate} />;

    case "instructor-dashboard":
    case "admin-dashboard":
      return (
        <InstructorDashboard
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case "exam-room":
      return <ExamRoom onNavigate={handleNavigate} />;

    case "report":
      return <ReportDetail onNavigate={handleNavigate} />;

    default:
      return <Login onNavigate={handleNavigate} />;
  }
}
