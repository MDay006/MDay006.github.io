const express = require('express');
const { getItems, createItem, updateItem, deleteItem, getUserItems } = require('../controllers/itemController');
const { authenticate } = require('../middleware/auth');
const { validateItem } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate); // All item routes require authentication

router.get('/', getItems);
router.get('/my-items', getUserItems);
router.post('/', validateItem, createItem);
router.put('/:id', validateItem, updateItem);
router.delete('/:id', deleteItem);

module.exports = router;