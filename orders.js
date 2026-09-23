const express = require('express');
const Order = require('../models/Order');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - place a delivery order (public)
router.post('/', async (req, res) => {
  try {
    const { items, customerName, phone, address, deliveryInstructions } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'Order must include at least one item' });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ items, total, customerName, phone, address, deliveryInstructions });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders - list all orders (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status - update order status (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
