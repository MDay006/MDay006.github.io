const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 't415S3cr3tC0d3';

async function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id).select('-passwordHash');
    if(!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
