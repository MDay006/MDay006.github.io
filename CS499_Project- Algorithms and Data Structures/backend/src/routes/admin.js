const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, getAllItems, deleteItemAsAdmin } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate, requireAdmin); // All admin routes require admin authentication

router.get('/users', getUsers);
router.post('/users', validateRegistration, createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/items', getAllItems);
router.delete('/items/:id', deleteItemAsAdmin);

module.exports = router;