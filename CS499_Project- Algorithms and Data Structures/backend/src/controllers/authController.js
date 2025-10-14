const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const me = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };