const express = require('express');
const { getUsers, getUser, updateRole, toggleActive } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// bu dosyadaki tüm route'lar: önce JWT doğrula, sonra admin mi kontrol et
router.use(protect);
router.use(authorize('admin'));

// GET /api/users
router.get('/', getUsers);

// GET /api/users/:id
router.get('/:id', getUser);

// PUT /api/users/:id/role
router.put('/:id/role', updateRole);

// PUT /api/users/:id/active  (hesap aktif/pasif)
router.put('/:id/active', toggleActive);

module.exports = router;
