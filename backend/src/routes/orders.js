const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/orders');

// Middleware to protect routes if available
// We assume 'auth' middleware populates req.user
const auth = require('../middleware/auth');

// @route   POST api/orders/create
// @desc    Create a new order & invoice
// @access  Private
router.post('/create', auth, ordersCtrl.createOrder);

// @route   GET api/orders
// @desc    List orders for current user
// @access  Private
router.get('/', auth, ordersCtrl.listOrders);

// @route   POST api/orders
// @desc    Alias for create order
// @access  Private
router.post('/', auth, ordersCtrl.createOrder);

// @route   GET api/orders/:id
// @desc    Get order details
// @access  Private (or Public with ID)
router.get('/:id', auth, ordersCtrl.getOrder);

// @route   GET api/orders/user/:userId
// @desc    List orders for a specific user
// @access  Private
router.get('/user/:userId', auth, ordersCtrl.listOrdersForUser);

// Short-hand for "my orders" using auth token
router.get('/my/list', auth, ordersCtrl.listOrdersForUser);

// @route   POST api/orders/payment-attempt
// @desc    Record a payment attempt (webhook or frontend confirmation)
// @access  Private
router.post('/payment-attempt', auth, ordersCtrl.recordPaymentAttempt);

module.exports = router;
