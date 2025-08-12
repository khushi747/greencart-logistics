import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 },
  pastWeekHours: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
    validate: [
      (arr) => arr.length === 7,
      "Past week hours must have 7 entries",
    ],
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Driver", DriverSchema);
