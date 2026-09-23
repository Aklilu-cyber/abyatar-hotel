const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Hot Drinks', 'Soft Drinks', 'Alcohol', 'Breakfast', 'Salads', 'Burgers', 'Pasta', 'Pizza', 'Main Dishes']
  },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
