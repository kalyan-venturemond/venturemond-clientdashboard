const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Optional profile fields for onboarding
    profile: {
        companyName: String,
        companySize: String,
        phone: String,
        address: String,
        website: String,
        industry: String,
        timezone: String,
    },
});

module.exports = mongoose.model('User', UserSchema);
