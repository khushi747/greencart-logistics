const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  routeId: { type: Number, required: true, unique: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  baseTimeMin: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Route", RouteSchema);
