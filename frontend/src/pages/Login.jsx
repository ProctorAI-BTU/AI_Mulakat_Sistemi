import React, { useState } from "react";
import authService from "../services/auth.js";
import "../styles/auth.css";

export default function Login({ onNavigate }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLoginView) {
        //LOGIN 
        const result = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          const role = result.data.user.role;
          //role'e göre yönlendirme
          if (role === "admin" || role === "instructor") {
            onNavigate("instructor-dashboard");
          } else {
            onNavigate("exam-room");
          }
        }
      } else {
        //REGISTER
        const result = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          setSuccessMsg("Kayıt başarılı! Giriş yapabilirsiniz.");
          setIsLoginView(true);
          setFormData({ ...formData, password: "" });
        }
      }
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Lütfen önce e-posta adresinizi girin");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(formData.email);
      setSuccessMsg("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
    } catch (err) {
      setError(err.message || "E-posta gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><span>AI</span></div>
        <h1 className="auth-title">
          {isLoginView ? "AI Destekli Online Sınav Sistemi" : "Kayıt Oluştur"}
        </h1>

        {error && <div className="auth-error">{error}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {!isLoginView && (
            <div className="form-group">
              <label>Rol</label>
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Öğrenci</option>
                <option value="instructor">Eğitmen</option>
              </select>
            </div>
          )}

          <div className="auth-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Yükleniyor..."
                : isLoginView
                ? "Giriş Yap"
                : "Hesap Oluştur"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError("");
                setSuccessMsg("");
              }}
            >
              {isLoginView ? "Kayıt Ol" : "Vazgeç"}
            </button>
          </div>

          {isLoginView && (
            <button
              type="button"
              className="auth-forgot"
              onClick={handleForgotPassword}
            >
              Yardım / Şifremi Unuttum
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
