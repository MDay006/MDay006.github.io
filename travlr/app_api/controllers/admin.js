const Trip = require("../models/travlr");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const listTrips = async (req, res) => {
  try {
    const { sortBy = 'start', order = 'asc' } = req.query;
    const sortOrder = order === 'desc' ? -1 : 1;
    
    let sortObj = {};
    sortObj[sortBy] = sortOrder;
    
    const trips = await Trip.find().sort(sortObj); 
    res.json(trips);
  } catch (err) {
    console.error("List trips error:", err);
    res.status(500).json({ message: "Error fetching trips", error: err.message });
  }
};

const addTrip = async (req, res) => {
  try {
    const existingTrip = await Trip.findOne({ code: req.body.code });
    if (existingTrip) {
      return res.status(400).json({ message: "Trip with this code already exists" });
    }
    
    const newTrip = new Trip(req.body);
    const savedTrip = await newTrip.save();
    
    console.log("Trip created successfully:", savedTrip._id);
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error("Add trip error:", err);
    res.status(400).json({ message: "Error adding trip", error: err.message });
  }
};

const updateTrip = async (req, res) => {
  try { 
    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    console.log("Trip updated successfully:", trip._id);
    res.json(trip);
  } catch (err) {
    console.error("Update trip error:", err);
    res.status(400).json({ message: "Error updating trip", error: err.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ code: req.params.tripCode });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    console.log("Trip deleted successfully:", trip._id);
    res.json({ message: "Trip deleted successfully", trip });
  } catch (err) {
    console.error("Delete trip error:", err);
    res.status(500).json({ message: "Error deleting trip", error: err.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const { sortBy = 'email', order = 'asc' } = req.query;
    const sortOrder = order === 'desc' ? -1 : 1;
    
    let sortObj = {};
    if (sortBy === 'name' || sortBy === 'username') {
      sortObj['username'] = sortOrder;
    } else {
      sortObj[sortBy] = sortOrder;
    }
    
    const users = await User.find().select('-password').sort(sortObj);
    res.json(users);
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

const addUser = async (req, res) => {
  try { 
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username: name }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    const newUser = new User({
      username: name,
      email,
      password, 
      role: role || 'user'
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    console.log("User created successfully:", savedUser._id);
    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Add user error:", err);
    res.status(400).json({ message: "Error adding user", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.name) {
      updateData.username = updateData.name;
      delete updateData.name;
    }

    if (updateData.password && updateData.password.trim()) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update fields
      Object.assign(user, updateData);
      await user.save(); // This triggers pre-save middleware
      
      // Return without password
      const userResponse = user.toObject();
      delete userResponse.password;
      
      console.log("User updated successfully:", user._id);
      return res.json(userResponse);
    } else {
      delete updateData.password;
      
      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log("User updated successfully:", user._id);
      res.json(user);
    }
  } catch (err) {
    console.error("Update user error:", err);
    res.status(400).json({ message: "Error updating user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("Deleting user:", req.params.id);
    
    const user = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User deleted successfully:", user._id);
    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

module.exports = {
  listTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  listUsers,
  addUser,
  updateUser,
  deleteUser,
};