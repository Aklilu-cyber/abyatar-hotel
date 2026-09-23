const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },
  total: { type: Number, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  deliveryInstructions: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
