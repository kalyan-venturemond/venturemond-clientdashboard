const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    planName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'past_due', 'trial'],
        default: 'active',
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    nextBillingDate: {
        type: Date,
    },
    billingPeriod: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
