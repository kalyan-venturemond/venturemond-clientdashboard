const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        usd: { type: Number, default: 0 },
        inr: { type: Number, default: 0 },
        period: { type: String, default: 'one-time' } // e.g., 'monthly', 'yearly', 'one-time'
    },
    features: [{
        type: String
    }],
    badge: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['studio', 'plan', 'addon'],
        default: 'studio'
    },
    tier: {
        type: String, // e.g. "Tier 1", "Tier 2"
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
