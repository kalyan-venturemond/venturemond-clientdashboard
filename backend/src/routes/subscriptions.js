const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptions');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, subscriptionsController.listSubscriptions);

module.exports = router;
