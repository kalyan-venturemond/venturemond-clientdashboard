const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMe, updateMe } = require('../controllers/users');

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getMe);

// @route   PATCH api/users/me
// @desc    Update user profile
// @access  Private
router.patch('/me', auth, updateMe);

module.exports = router;
