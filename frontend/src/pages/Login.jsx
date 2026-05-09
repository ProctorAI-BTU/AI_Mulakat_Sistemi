import React, { useState } from "react";
import "../styles/auth.css";

export default function Login({ onNavigate }) {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><span>AI</span></div>
        <h1 className="auth-title">
          {isLoginView ? "AI Destekli Online Sınav Sistemi" : "Kayıt Oluştur"}
        </h1>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLoginView && (
            <div className="form-group">
              <label>Ad Soyad</label>
              <input type="text" className="form-input" placeholder="Ad Soyad" />
            </div>
          )}

          <div className="form-group">
            <label>E-posta</label>
            <input type="email" className="form-input" placeholder="ornek@email.com" />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          
          <div className="auth-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => onNavigate(isLoginView ? "instructor-dashboard" : "login")}
            >
              {isLoginView ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? "Kayıt Ol" : "Vazgeç"}
            </button>
          </div>
          
          {isLoginView && <button className="auth-forgot">Yardım / Şifremi Unuttum</button>}
        </form>
      </div>
    </div>
  );
}