const Project = require('../models/Project');

exports.listProjects = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('listProjects error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
};
