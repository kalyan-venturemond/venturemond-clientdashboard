const mongoose = require('mongoose');

// Schema for individual items in an order
const OrderItemSchema = new mongoose.Schema({
    id: String,       // Service/Product ID
    title: String,
    price: Number,
    currency: { type: String, default: 'INR' },
    quantity: { type: Number, default: 1 },
    period: { type: String, default: 'one-time' } // e.g., 'monthly', 'one-time'
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional to support cases where user might be passed in body or not strictly enforced yet
    },

    items: [OrderItemSchema], // List of items belonging to this order

    subtotal: {
        type: Number,
        required: true
    },

    tax: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'INR'
    },

    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'cancelled'],
        default: 'pending'
    },

    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed, // flexible field for clientRequestId, billingDetails, etc.
        default: {}
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
