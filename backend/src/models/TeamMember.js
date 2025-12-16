const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
    userId: { // The workspace owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Viewer'],
        default: 'Viewer',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending',
    },
    invitedAt: {
        type: Date,
        default: Date.now,
    },
    lastActive: {
        type: Date,
    }
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
