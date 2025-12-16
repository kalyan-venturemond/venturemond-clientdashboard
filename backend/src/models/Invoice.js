const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },

    issuedAt: {
        type: Date,
        default: Date.now
    },

    dueAt: Date, // Optional due date

    items: Array, // Snapshot of items at time of invoice

    subtotal: Number,
    tax: Number,
    total: Number,

    currency: {
        type: String,
        default: 'INR'
    },

    paid: {
        type: Boolean,
        default: false
    },

    paidAt: Date
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
