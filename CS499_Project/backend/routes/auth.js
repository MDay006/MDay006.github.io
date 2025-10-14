const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 't415S3cr3tC0d3';

// register
router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const exists = await User.findOne({ username });
    if(exists) return res.status(400).json({ error: 'username taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash });
    await user.save();
    res.status(201).json({ message: 'registered' });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;