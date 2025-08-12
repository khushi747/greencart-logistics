const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getDashboardData);

module.exports = router;
