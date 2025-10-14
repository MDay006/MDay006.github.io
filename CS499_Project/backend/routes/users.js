const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/auth');

async function adminOnly(req, res, next){
  if(!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

router.use(authMiddleware, adminOnly);

router.get('/', async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({createdAt:-1});
  res.json(users);
});

router.put('/:id', async (req, res) => {
  try{
    const { role, password } = req.body;
    const update = {};
    if(role) update.role = role;
    if(password) update.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    if(!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  }catch(e){
    res.status(400).json({ error: 'Invalid id' });
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'deleted' });
  }catch(e){
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;