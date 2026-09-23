require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// TEMPORARY: visit this URL once to create/reset your admin login, then remove this route.
app.get('/api/setup-admin', async (req, res) => {
  try {
    const { key, email, password } = req.query;
    if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY) {
      return res.status(403).send('Invalid or missing setup key.');
    }
    if (!email || !password) {
      return res.status(400).send('Add ?email=you@example.com&password=yourpassword to the URL.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), passwordHash },
      { upsert: true, new: true }
    );
    res.send('Admin account ready for ' + email + '. You can now log in at /admin.html. Please remove the setup-admin route from server.js now.');
  } catch (err) {
    res.status(500).send('Setup failed: ' + err.message);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);

// Serve the hotel website
app.use(express.static(path.join(__dirname, 'public')));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Abyatar API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
