const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // Check if not token
    if (!token) {
        console.warn("Auth Middleware: No token found.");
        console.warn("Headers received:", JSON.stringify(req.headers, null, 2));
        console.warn("Auth Header value:", authHeader);
        return res.status(401).json({ msg: 'No token, auth denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
