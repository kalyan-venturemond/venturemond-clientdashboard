const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'No user authenticated' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ msg: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { requireRole };
