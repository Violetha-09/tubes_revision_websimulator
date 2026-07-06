const jwt = require('jsonwebtoken');
const env = require('../config/env');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const cookieToken = req.cookies ? req.cookies.token : null;
    
    let token = cookieToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
            errors: []
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
            errors: []
        });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Requires ${role} role.`,
                errors: []
            });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};
