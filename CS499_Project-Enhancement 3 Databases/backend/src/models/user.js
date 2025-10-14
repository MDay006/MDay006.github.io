const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Static method to create user
userSchema.statics.createUser = async function(userData) {
  const existingUser = await this.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, config.bcryptRounds);
  const user = await this.create({
    username: userData.username,
    password: hashedPassword,
    role: userData.role || 'user'
  });

  return this.toSafeObject(user);
};

// Static method to authenticate
userSchema.statics.authenticate = async function(username, password) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return this.toSafeObject(user);
};

// Static method to find by ID
userSchema.statics.findByIdSafe = async function(id) {
  const user = await this.findById(id);
  return user ? this.toSafeObject(user) : null;
};

// Static method to get all users
userSchema.statics.findAllSafe = async function() {
  const users = await this.find();
  return users.map(user => this.toSafeObject(user));
};

// Static method to update user
userSchema.statics.updateUser = async function(id, updates) {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, config.bcryptRounds);
  }
  const user = await this.findByIdAndUpdate(id, updates, { new: true });
  return user ? this.toSafeObject(user) : null;
};

// Static method to delete user
userSchema.statics.deleteUser = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

// Remove password from user object
userSchema.statics.toSafeObject = function(user) {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, __v, ...safeUser } = userObj;
  safeUser.id = safeUser._id;
  delete safeUser._id;
  return safeUser;
};

module.exports = mongoose.model('User', userSchema);