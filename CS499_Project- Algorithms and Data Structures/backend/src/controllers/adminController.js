const User = require('../models/user');
const Item = require('../models/item');

const getUsers = (req, res) => {
  try {
    const users = User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.update(id, req.body);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = User.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllItems = (req, res) => {
  try {
    const items = Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItemAsAdmin = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = Item.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getAllItems, deleteItemAsAdmin };