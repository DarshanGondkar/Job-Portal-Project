/*const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employer = require('../models/Employer');

exports.authMiddleware = (userType = 'user') => {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user;
            
            // Check the userType and fetch the appropriate model
            if (userType === 'employer') {
                user = await Employer.findById(decoded.id);
            } else {
                user = await User.findById(decoded.id);
            }

            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            
            req.user = user; // Attach the user or employer to req.user
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token', error });
        }
    };
};
*/