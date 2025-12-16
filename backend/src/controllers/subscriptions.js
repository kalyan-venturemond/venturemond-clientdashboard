const Subscription = require('../models/Subscription');

exports.listSubscriptions = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const subscriptions = await Subscription.find({ userId }).sort({ startDate: -1 });
        res.json(subscriptions);
    } catch (err) {
        console.error('listSubscriptions error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
