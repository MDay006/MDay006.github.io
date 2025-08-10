const express = require('express');
const router = express.Router();

const tripsController = require("../controllers/trips");



router
    .route('/trips')
    .get(tripsController.tripsList) // Get Method routes triplist
    .post(tripsController.tripsAddTrip); // Post Method Adds a Trip 

 // GET Method routes tripsFindByCode - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // Get Method routes triplist
    .put(tripsController.tripsUpdateTrip);
module.exports = router;