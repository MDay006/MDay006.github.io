const mongoose = require('mongoose');
const Trip = require('../models/travlr');

const tripsList = async (req, res) => {
  try {
    const q = await Trip.find({}).exec(); 
    
    if (!q || q.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving trips", error: err.message });
  }
};

const tripsFindByCode = async (req, res) => {
  try {
    const q = await Trip.find({ code: req.params.tripCode }).exec(); 
    
    if (!q || q.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving trip", error: err.message });
  }
};

const tripsAddTrip = async (req, res) => {
  try {
     console.log("🔥 Add Trip Hit! Body:", req.body);
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const savedTrip = await newTrip.save();
    return res.status(201).json(savedTrip);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: "Trip code already exists" });
    }
    return res.status(500).json({ message: "Error creating trip", error: err.message });
  }
};

const tripsUpdateTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndUpdate( 
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    ).exec();

    if (!q) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json({ message: "Error updating trip", error: err.message });
  }
};

const tripsDeleteTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec(); 

    if (!q) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting trip", error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,  
  tripsUpdateTrip,
  tripsDeleteTrip
};