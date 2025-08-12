const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, default: 0 },
  past_week_hours: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Driver", DriverSchema);
