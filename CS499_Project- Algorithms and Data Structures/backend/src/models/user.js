const bcrypt = require('bcrypt');
const database = require('../utils/db');
const config = require('../config/config');

class User {
  static async create(userData) {
    const existingUser = database.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, config.bcryptRounds);
    const user = database.createUser({
      username: userData.username,
      password: hashedPassword,
      role: userData.role || 'user'
    });

    return this.toSafeObject(user);
  }

  static async authenticate(username, password) {
    const user = database.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.toSafeObject(user);
  }

  static findById(id) {
    const user = database.getUserById(id);
    return user ? this.toSafeObject(user) : null;
  }

  static findAll() {
    return database.getAllUsers().map(user => this.toSafeObject(user));
  }

  static async update(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, config.bcryptRounds);
    }
    const user = database.updateUser(id, updates);
    return user ? this.toSafeObject(user) : null;
  }

  static delete(id) {
    return database.deleteUser(id);
  }

  static toSafeObject(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;