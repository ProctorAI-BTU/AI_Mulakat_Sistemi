const createError = require('http-errors');
const User = require('../models/User');

// yeni kullanıcı oluştur (her zaman student olarak kaydeder idor önlemek için)
const createUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw createError(409, 'Bu e-posta adresi zaten kayıtlı');

  // role her zaman 'student' admin sadece updateUserRole ile değiştirebilir
  return User.create({ name, email, password, role: 'student' });
};

// email ve şifre ile giriş doğrulama
const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user) throw createError(401, 'Geçersiz e-posta veya şifre');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw createError(401, 'Geçersiz e-posta veya şifre');

  return user;
};

// id ile kullanıcı getir
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw createError(404, 'Kullanıcı bulunamadı');
  return user;
};

// tüm kullanıcıları listele (admin)
const getAllUsers = async (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  return User.find(query).sort({ createdAt: -1 }); //yeniden eskiye doğru sırala
};

// kullanıcı rolünü güncelle (admin)
const updateUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  if (!user) throw createError(404, 'Kullanıcı bulunamadı');
  return user;
};

// şifre değiştirme (kullanıcı kendi şifresini değiştirir)
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw createError(404, 'Kullanıcı bulunamadı');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw createError(401, 'Mevcut şifre yanlış');

  user.password = newPassword; // pre-save hook hashleyecek
  await user.save();
  return user;
};

// profil güncelleme (sadece isim)
const updateProfile = async (userId, updates) => {
  const allowed = {};
  if (updates.name) allowed.name = updates.name;

  const user = await User.findByIdAndUpdate(userId, allowed, { new: true, runValidators: true });
  if (!user) throw createError(404, 'Kullanıcı bulunamadı');
  return user;
};

// kullanıcı aktif/pasif değiştirme (admin)
const toggleActive = async (id, isActive) => {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) throw createError(404, 'Kullanıcı bulunamadı');
  return user;
};

module.exports = { createUser, authenticateUser, getUserById, getAllUsers, updateUserRole, changePassword, updateProfile, toggleActive };
