const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, teamController.listMembers);
router.post('/', authMiddleware, teamController.addMember);

module.exports = router;
