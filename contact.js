const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/contact - submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/contact - list all messages (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
