

//Auth Service API — Frontend tarafı
//Register, Login, GetMe, ChangePassword, ForgotPassword işlemleri

import api from './api.js';

const authService = {
  //kayıt ol
  async register({ name, email, password }) {
    const data = await api.postPublic('/api/auth/register', { name, email, password });
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  // giriş yap
  async login({ email, password }) {
    const data = await api.postPublic('/api/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  // mevcut kullanıcıyı getir token ile getirme işlemi
  async getMe() {
    return api.get('/api/auth/me');
  },

  // şifre değiştir
  async changePassword({ currentPassword, newPassword }) {
    return api.put('/api/auth/change-password', { currentPassword, newPassword });
  },

  // profil güncelleme işlemi
  async updateProfile({ name }) {
    return api.put('/api/auth/update-profile', { name });
  },

  // şifremi unuttum
  async forgotPassword(email) {
    return api.postPublic('/api/auth/forgot-password', { email });
  },

  // çıkış yap
  logout() {
    api.clearAuth();
  },

  // mevcut kullanıcı bilgisini localStorage'dan okuma işlemi
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // oturum açık mı kontrolü
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // kullanıcı rolünü al
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },
};

export default authService;
