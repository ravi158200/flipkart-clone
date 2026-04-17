const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raviraj_secret_key_7301');
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                next();
            } else {
                res.status(401).json({ message: 'Not authorized, user not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as Admin' });
    }
};

const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'retailer')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as Partner' });
    }
};

module.exports = { protect, admin, seller };
