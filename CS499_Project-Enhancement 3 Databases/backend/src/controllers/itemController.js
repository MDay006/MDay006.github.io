const Item = require('../models/item');

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    
    // Check if item with same name already exists for this user
    const existingItem = await Item.findOne({ 
      name: name.trim(), 
      userId: req.user.id 
    });
    
    if (existingItem) {
      // Add to existing quantity
      existingItem.quantity += parseInt(quantity);
      await existingItem.save();
      return res.status(200).json(existingItem);
    }
    
    // Create new item if doesn't exist
    const item = await Item.create({
      name: name.trim(),
      quantity: parseInt(quantity),
      userId: req.user.id,
      username: req.user.username
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check ownership
    if (req.user.role !== 'admin' && item.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.body.name) item.name = req.body.name;
    if (req.body.quantity !== undefined) item.quantity = parseInt(req.body.quantity);
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (req.user.role !== 'admin' && item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem, getUserItems };