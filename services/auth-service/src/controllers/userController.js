const createError = require('http-errors');
const userService = require('../services/userService');

// GET /api/users tüm kullanıcıları listele (sadece admin)
const getUsers = async (req, res) => {
  const { role } = req.query; // ?role=student gibi filtreleme
  const users = await userService.getAllUsers({ role });

  res.status(200).json({
    success: true,
    count: users.length,
    data: { users },
  });
};

// GET /api/users/:id — tek kullanıcı detayı (sadece admin)
const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

// PUT /api/users/:id/role rol değiştir (sadece admin)
const updateRole = async (req, res) => {
  const { role } = req.body;
  if (!role) throw createError(400, 'Rol alanı zorunludur');

  // sadece geçerli roller kabul edilir
  const validRoles = ['student', 'instructor', 'admin'];
  if (!validRoles.includes(role)) throw createError(400, 'Geçersiz rol değeri');

  // admin kendi rolünü değiştiremez (self-lockout koruması)
  if (req.params.id === req.user.id.toString()) {
    throw createError(403, 'Kendi rolünüzü değiştiremezsiniz');
  }

  const user = await userService.updateUserRole(req.params.id, role);

  res.status(200).json({
    success: true,
    message: `Kullanıcı rolü '${role}' olarak güncellendi`,
    data: { user },
  });
};

// PUT /api/users/:id/active — hesap aktif/pasif (admin)
const toggleActive = async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') throw createError(400, 'isActive alanı boolean olmalıdır');

  // admin kendini deaktif edemez
  if (req.params.id === req.user.id.toString()) {
    throw createError(403, 'Kendi hesabınızı deaktif edemezsiniz');
  }

  const user = await userService.toggleActive(req.params.id, isActive);

  res.status(200).json({
    success: true,
    message: isActive ? 'Hesap aktifleştirildi' : 'Hesap deaktif edildi',
    data: { user },
  });
};

module.exports = { getUsers, getUser, updateRole, toggleActive };
