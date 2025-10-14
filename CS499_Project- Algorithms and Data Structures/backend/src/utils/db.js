class InMemoryDatabase {
  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.userIdCounter = 1;
    this.itemIdCounter = 1;
    this.initializeDefaults();
  }

  initializeDefaults() {
    const bcrypt = require('bcrypt');
    const config = require('../config/config');
    
    const adminUser = {
      id: this.userIdCounter++,
      username: 'admin',
      password: bcrypt.hashSync('admin123', config.bcryptRounds),
      role: 'admin',
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);
  }

  // User operations
  createUser(userData) {
    const user = { ...userData, id: this.userIdCounter++, createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getUserByUsername(username) {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  // Item operations
  createItem(itemData) {
    const item = { ...itemData, id: this.itemIdCounter++, createdAt: new Date() };
    this.items.set(item.id, item);
    return item;
  }

  getItemById(id) {
    return this.items.get(id);
  }

  getAllItems() {
    return Array.from(this.items.values());
  }

  getItemsByUserId(userId) {
    return Array.from(this.items.values()).filter(item => item.userId === userId);
  }

  updateItem(id, updates) {
    const item = this.items.get(id);
    if (!item) return null;
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  deleteItem(id) {
    return this.items.delete(id);
  }
}

module.exports = new InMemoryDatabase();