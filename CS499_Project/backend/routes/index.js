const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  if(req.user.role === 'admin'){
    const users = await User.find().select('username items');
    return res.json(users);
  } else {
    const user = await User.findById(req.user.id).select('username items');
    return res.json([user]);
  }
});

router.post('/', async (req, res) => {
  const { name, quantity } = req.body;
  if(!name) return res.status(400).json({ error: 'name required' });
  const user = await User.findById(req.user.id);
  user.items.push({ name, quantity });
  await user.save();
  res.status(201).json(user.items);
});

router.put('/:itemId', async (req, res) => {
  const { name, quantity } = req.body;
  const me = await User.findById(req.user.id);
  let item = me.items.id(req.params.itemId);
  if(item){
    item.name = name; item.quantity = quantity;
    await me.save();
    return res.json(item);
  }
  if(req.user.role === 'admin'){
    const users = await User.find();
    for(const u of users){
      const it = u.items.id(req.params.itemId);
      if(it){
        it.name = name; it.quantity = quantity;
        await u.save();
        return res.json(it);
      }
    }
  }
  return res.status(404).json({ error: 'Item not found' });
});

router.delete('/:userId/:itemId', async (req, res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  const target = await User.findById(req.params.userId);
  if(!target) return res.status(404).json({ error: 'User not found' });
  const item = target.items.id(req.params.itemId);
  if(!item) return res.status(404).json({ error: 'Item not found' });
  item.remove();
  await target.save();
  res.json({ message: 'deleted', items: target.items });
});

module.exports = router;

