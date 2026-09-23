// Run once to populate rooms and menu items: node scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const MenuItem = require('../models/MenuItem');

const rooms = [
  { type: 'Single Room', price: 120, description: 'Cozy, modern, with a city view.', capacity: 1, amenities: ['Wi-Fi', 'TV', 'Desk'] },
  { type: 'Double Room', price: 190, description: 'Spacious, with a king bed and a luxury bath.', capacity: 2, amenities: ['Wi-Fi', 'TV', 'Mini bar'] },
  { type: 'Family Suite', price: 280, description: 'Two bedrooms, a living area, and a kitchenette.', capacity: 4, amenities: ['Wi-Fi', 'Kitchenette', 'Living room'] },
  { type: 'Executive Suite', price: 420, description: 'Panoramic views, a jacuzzi, and a private terrace.', capacity: 2, amenities: ['Jacuzzi', 'Terrace', 'Wi-Fi', 'Mini bar'] }
];

// Add the full menu list here in the same shape as MenuItem before running,
// or POST items individually to /api/menu once an admin is logged in.
const menu = [
  { name: 'Traditional Coffee', price: 120, category: 'Hot Drinks' },
  { name: 'Cappuccino', price: 150, category: 'Hot Drinks' },
  { name: 'Mixed Grill', price: 750, category: 'Main Dishes' }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const r of rooms) {
    await Room.findOneAndUpdate({ type: r.type }, r, { upsert: true });
  }
  for (const m of menu) {
    await MenuItem.findOneAndUpdate({ name: m.name }, m, { upsert: true });
  }
  console.log('Seed complete.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
