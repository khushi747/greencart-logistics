const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  route_id: { type: Number, required: true, unique: true },
  distance_km: { type: Number, required: true },
  traffic_level: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  base_time_min: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Route", RouteSchema);
