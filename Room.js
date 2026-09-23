const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Single Room', 'Double Room', 'Family Suite', 'Executive Suite'],
    unique: true
  },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  capacity: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
