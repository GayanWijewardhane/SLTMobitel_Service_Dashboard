const express = require('express');
const { auth } = require('../middleware/auth');
const {
  login,
  logout,
  getMe,
  changePassword
} = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

// @route   PUT /api/auth/change-password
router.put('/change-password', auth, changePassword);

module.exports = router;
