const express = require('express');
const router = express.Router();
const adminController = require("../controllers/admin")
const { authenticateJWT, requireAdmin } = require('../middleware/adminAuth');

// Debugging imports
//console.log('authenticateJWT:', authenticateJWT);
//console.log('requireAdmin:', requireAdmin);
//console.log('typeof authenticateJWT:', typeof authenticateJWT);
//console.log('typeof requireAdmin:', typeof requireAdmin);

router.use(authenticateJWT, requireAdmin);

router.get("/trips", adminController.listTrips);
router.post("/trips", adminController.addTrip);
router.put("/trips/:tripCode", adminController.updateTrip);
router.delete("/trips/:tripCode", adminController.deleteTrip);

router.get("/users", adminController.listUsers);
router.post("/users", adminController.addUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;


