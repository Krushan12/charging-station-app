const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // Get user from token
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return next(new ErrorResponse('User not found', 401));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};