const TeamMember = require('../models/TeamMember');

exports.listMembers = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const members = await TeamMember.find({ userId }).sort({ createdAt: -1 });
        res.json(members);
    } catch (err) {
        console.error('listMembers error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.addMember = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        // Check if already invited
        const existing = await TeamMember.findOne({ userId, email });
        if (existing) {
            return res.status(400).json({ msg: 'Member already invited' });
        }

        const newMember = new TeamMember({
            userId,
            email,
            role: role || 'Viewer',
            status: 'pending'
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (err) {
        console.error('addMember error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
