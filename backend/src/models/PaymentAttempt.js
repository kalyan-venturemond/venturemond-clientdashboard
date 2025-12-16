const mongoose = require('mongoose');

const PaymentAttemptSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },

    provider: String, // e.g., 'stripe', 'razorpay', 'upi', 'mock'
    providerPaymentId: String, // Transaction ID from the provider

    status: {
        type: String,
        enum: ['initiated', 'succeeded', 'failed', 'cancelled'],
        default: 'initiated'
    },

    amount: Number,
    currency: String,

    response: mongoose.Schema.Types.Mixed, // Store full provider response for debugging

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PaymentAttempt', PaymentAttemptSchema);
