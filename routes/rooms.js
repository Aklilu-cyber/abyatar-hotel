const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/:id
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/rooms/availability?type=&checkIn=&checkOut=
router.get('/availability/check', async (req, res) => {
  try {
    const { type, checkIn, checkOut } = req.query;
    const overlapping = await Booking.find({
      roomType: type,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) }
    });
    // Adjust the room count per type if you keep multiple units of the same room type.
    const roomUnits = 5;
    res.json({ available: overlapping.length < roomUnits, bookedUnits: overlapping.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/rooms (admin only) - add a room type
router.post('/', requireAdmin, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
