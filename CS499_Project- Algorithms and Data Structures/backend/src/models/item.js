const database = require('../utils/db');

class Item {
  static create(itemData) {
    return database.createItem(itemData);
  }

  static findById(id) {
    return database.getItemById(id);
  }

  static findAll() {
    return database.getAllItems();
  }

  static findByUserId(userId) {
    return database.getItemsByUserId(userId);
  }

  static update(id, updates) {
    return database.updateItem(id, updates);
  }

  static delete(id) {
    return database.deleteItem(id);
  }

  static canUserModify(item, user) {
    return user.role === 'admin' || item.userId === user.id;
  }
}

module.exports = Item;