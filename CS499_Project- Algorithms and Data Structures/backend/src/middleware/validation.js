const validateRegistration = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }
  
  if (password.length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  next();
};

const validateItem = (req, res, next) => {
  const { name, quantity } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Item name is required' });
  }
  
  if (quantity === undefined || quantity === null || isNaN(quantity)) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }
  
  next();
};

module.exports = { validateRegistration, validateLogin, validateItem };