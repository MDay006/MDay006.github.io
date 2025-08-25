const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require('../models/user');

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);

function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const headers = authHeader.split(" ");
  if (headers.length < 2) {
    return res.sendStatus(401);
  }

  const token = headers[1]; 
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      console.log("JWT Validation Error:", err.message);
      return res.status(401).json({ message: "Token Validation Error" });
    }

    req.auth = verified; 
    next();
  });
}


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.post("/register", authController.register);
router.post("/login", authController.login);



router
  .route("/trips")
  .get(tripsController.tripsList)                   
  .post(authenticateJWT, tripsController.tripsAddTrip); 


router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)          
  .put(authenticateJWT, tripsController.tripsUpdateTrip)  
  .delete(authenticateJWT, tripsController.tripsDeleteTrip); 


  console.log("AuthController:", authController);

module.exports = router;
