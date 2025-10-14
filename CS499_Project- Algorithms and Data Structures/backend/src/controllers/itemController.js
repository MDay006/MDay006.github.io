const Item = require('../models/item');

const getItems = (req, res) => {
  try {
    const items = Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = (req, res) => {
  try {
    const { name, quantity } = req.body;
    const item = Item.create({
      name,
      quantity: parseInt(quantity),
      userId: req.user.id,
      username: req.user.username
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (!Item.canUserModify(item, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedItem = Item.update(id, {
      name: req.body.name || item.name,
      quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : item.quantity
    });
    
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (!Item.canUserModify(item, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    Item.delete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserItems = (req, res) => {
  try {
    const items = Item.findByUserId(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem, getUserItems };