const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  simulationId: { type: String, required: true, unique: true },
  inputs: { type: Object },
  results: { type: Object }, // store KPIs and breakdown
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Simulation", SimulationSchema);
