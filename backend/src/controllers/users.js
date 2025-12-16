const User = require('../models/User');

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
    try {
        const {
            companyName,
            companySize,
            phone,
            address,
            website,
            industry,
            timezone
        } = req.body.profile || req.body; // Allow passing inside profile object or flat, handling both for flexibility

        // Build profile object
        const profileFields = {};
        if (companyName) profileFields.companyName = companyName;
        if (companySize) profileFields.companySize = companySize;
        if (phone) profileFields.phone = phone;
        if (address) profileFields.address = address;
        if (website) profileFields.website = website;
        if (industry) profileFields.industry = industry;
        if (timezone) profileFields.timezone = timezone;

        // Find and update
        // We use $set to only update specific fields in the profile subdoc if we wanted granular updates,
        // but here we can just update the profile object properties.
        // Using dot notation for nested update to avoid overwriting if we had other profile fields (safe approach)

        let updateOps = {};
        for (const [key, value] of Object.entries(profileFields)) {
            updateOps[`profile.${key}`] = value;
        }

        const userId = req.user ? req.user.id || req.user._id : null;
        if (!userId) {
            console.error("updateMe: No User ID found in request", req.user);
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateOps },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            console.error("updateMe: User not found with ID", userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ user });

    } catch (err) {
        console.error("updateMe Error:", err);
        console.error("Req Body:", req.body);
        console.error("User ID:", req.user?.id);
        res.status(500).send('Server Error');
    }
};
