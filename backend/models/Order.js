const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true },
  valueRs: { type: Number, required: true },
  routeId: { type: Number, required: true },
  deliveryTimestamp: { type: Date },
  assignedDriverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  simulationId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
