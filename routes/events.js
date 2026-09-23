const express = require('express');
const EventBooking = require('../models/EventBooking');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/events - request an event booking (public)
router.post('/', async (req, res) => {
  try {
    const event = await EventBooking.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/events - list all event bookings (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const events = await EventBooking.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/events/:id/status (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const event = await EventBooking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!event) return res.status(404).json({ error: 'Event booking not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
