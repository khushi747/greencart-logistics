const express = require("express");
const router = express.Router();
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getDrivers);
router.get("/:id", protect, getDriverById);
router.post("/", protect, createDriver);
router.put("/:id", protect, updateDriver);
router.delete("/:id", protect, deleteDriver);

module.exports = router;
