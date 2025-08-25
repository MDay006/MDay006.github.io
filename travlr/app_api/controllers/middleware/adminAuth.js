// middleware/adminAuth.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Your JWT authentication logic
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  // Your admin check logic
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Make sure both are exported
module.exports = {
  authenticateJWT,
  requireAdmin
};