const express = require("express");
const router = express.Router();
const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getRoutes);
router.get("/:id", protect, getRouteById);
router.post("/", protect, createRoute);
router.put("/:id", protect, updateRoute);
router.delete("/:id", protect, deleteRoute);

module.exports = router;
