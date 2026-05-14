import React from "react";
import authService from "../../services/auth.js";

/**
 * SubmitButton — Sınavı bitir butonu
 * Rol bazlı yönlendirme: öğrenci → login, eğitmen/admin → dashboard
 */
export default function SubmitButton({ onNavigate }) {
  const handleSubmit = () => {
    const role = authService.getUserRole();

    // Öğrenci sınavı bitirdiğinde login'e yönlendir (sonuç sayfası gelecek)
    // Admin/Eğitmen dashboard'a döner
    if (role === "admin" || role === "instructor") {
      onNavigate("instructor-dashboard");
    } else {
      // Öğrenci — exam-service gelince sonuç sayfasına yönlendirilecek
      authService.logout();
      onNavigate("login");
    }
  };

  return (
    <button className="btn-exam btn-exam--submit" onClick={handleSubmit}>
      Sınavı Bitir
    </button>
  );
}