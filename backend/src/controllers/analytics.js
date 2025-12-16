const Order = require('../models/Order');
const Project = require('../models/Project');

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const totalOrders = await Order.countDocuments({ userId });
        const activeProjects = await Project.countDocuments({ userId, status: { $ne: 'completed' } }); // Count non-completed projects

        // Calculate Revenue (sum of paid orders)
        const paidOrders = await Order.find({ userId, status: 'paid' });
        const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        res.json({
            totalOrders,
            totalProjects: activeProjects,
            totalRevenue,
            // Mocking trend data for now as we don't have historical snapshots
            revenueGrowth: 12,
            ordersGrowth: 5
        });
    } catch (err) {
        console.error('getAnalytics error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
