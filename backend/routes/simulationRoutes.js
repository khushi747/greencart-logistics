const express = require("express");
const router = express.Router();
const {
  runSimulation,
  getSimulationHistory,
  getSimulationDetails,
  deleteSimulation,
  getSimulationStats,
} = require("../controllers/simulationController");
const { protect } = require("../middlewares/authMiddleware");

// Validation middleware for simulation inputs
const validateSimulationInput = (req, res, next) => {
  const { availableDrivers, startTime, maxHoursPerDay } = req.body;

  const errors = [];

  // Check required fields
  if (!availableDrivers) errors.push("availableDrivers is required");
  if (!startTime) errors.push("startTime is required");
  if (!maxHoursPerDay) errors.push("maxHoursPerDay is required");

  // Validate data types and ranges
  if (
    availableDrivers &&
    (typeof availableDrivers !== "number" ||
      availableDrivers < 1 ||
      availableDrivers > 50)
  ) {
    errors.push("availableDrivers must be a number between 1 and 50");
  }

  if (
    maxHoursPerDay &&
    (typeof maxHoursPerDay !== "number" ||
      maxHoursPerDay < 1 ||
      maxHoursPerDay > 24)
  ) {
    errors.push("maxHoursPerDay must be a number between 1 and 24");
  }

  if (startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
    errors.push("startTime must be in HH:MM format (e.g., 09:30)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }

  next();
};

// Run delivery simulation  POST /api/simulation/run
router.post("/run", protect, validateSimulationInput, runSimulation);

// Get simulation history with pagination  GET /api/simulation/history
router.get("/history", protect, getSimulationHistory);

// Get simulation statistics for dashboard GET /api/simulation/stats
router.get("/stats", protect, getSimulationStats);

//  Get specific simulation details GET /api/simulation/:id
router.get("/:id", protect, getSimulationDetails);

// Delete a simulation DELETE /api/simulation/:id
router.delete("/:id", protect, deleteSimulation);

module.exports = router;
