const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret);
    
    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = parseInt(req.params.userId) || req.body.userId;
  if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireOwnershipOrAdmin };
