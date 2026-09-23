const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
  eventType: { type: String, required: true, enum: ['Conference Hall', 'Wedding Garden', 'Boardroom'] },
  date: { type: Date, required: true },
  expectedGuests: { type: Number, required: true, min: 1 },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  requirements: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('EventBooking', eventBookingSchema);
