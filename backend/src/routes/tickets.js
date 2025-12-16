// backend/src/routes/tickets.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTicket, listMyTickets } = require('../controllers/tickets');

// @route   POST api/tickets
// @desc    Create a new ticket
// @access  Private
router.post('/', auth, createTicket);

// @route   GET api/tickets
// @desc    Get current user's tickets
// @access  Private
router.get('/', auth, listMyTickets);

module.exports = router;
