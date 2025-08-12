const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number },
  delivery_time: { type: Date },
  simulation_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
