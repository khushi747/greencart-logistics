const Driver = require("../models/Driver");

// Get all drivers - GET /api/drivers
const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get single driver by ID - GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new driver - POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const { name, currentShiftHours, pastWeekHours, isActive } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const driver = await Driver.create({
      name,
      currentShiftHours,
      pastWeekHours,
      isActive,
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update driver - PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete driver - DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    await driver.deleteOne();
    res.json({ message: "Driver removed" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
