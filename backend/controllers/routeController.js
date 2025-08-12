const Route = require("../models/Route");

// Get all routes - GET /api/routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

//  Get single route by ID - GET /api/routes/:id
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new route - POST /api/routes
const createRoute = async (req, res) => {
  try {
    const { routeId, distanceKm, trafficLevel, baseTimeMin, isActive } =
      req.body;

    if (!routeId || !distanceKm || !trafficLevel || !baseTimeMin) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const route = await Route.create({
      routeId,
      distanceKm,
      trafficLevel,
      baseTimeMin,
      isActive,
    });

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update a route -  PUT /api/routes/:id
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete a route - DELETE /api/routes/:id
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });

    await route.deleteOne();
    res.json({ message: "Route removed" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
