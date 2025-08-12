const mongoose = require("mongoose");
const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");
const Simulation = require("../models/Simulation");

/**
 * POST /api/simulation/run
 * Body: { availableDrivers, startTime, maxHoursPerDay }
 */
const runSimulation = async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      availableDrivers,
      startTime: simStartTime,
      maxHoursPerDay,
    } = req.body;

    console.log("Simulation request:", {
      availableDrivers,
      simStartTime,
      maxHoursPerDay,
    });

    // Input validation
    if (!availableDrivers || !simStartTime || !maxHoursPerDay) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["availableDrivers", "startTime", "maxHoursPerDay"],
      });
    }

    // Validate input ranges
    if (availableDrivers < 1 || availableDrivers > 50) {
      return res.status(400).json({
        error: "Available drivers must be between 1 and 50",
      });
    }

    if (maxHoursPerDay < 1 || maxHoursPerDay > 24) {
      return res.status(400).json({
        error: "Max hours per day must be between 1 and 24",
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(simStartTime)) {
      return res.status(400).json({
        error: "Start time must be in HH:MM format (e.g., 09:30)",
      });
    }

    // Fetch all data
    console.log("Fetching data from database...");
    const [orders, routes, drivers] = await Promise.all([
      Order.find({}),
      Route.find({ is_active: true }),
      Driver.find({ is_active: true }).limit(availableDrivers),
    ]);

    console.log(
      `Found: ${orders.length} orders, ${routes.length} routes, ${drivers.length} drivers`
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    if (routes.length === 0) {
      return res.status(404).json({ error: "No active routes found" });
    }

    // Initialize simulation drivers
    let simulationDrivers = Array.from(
      { length: availableDrivers },
      (_, i) => ({
        driverId: i + 1,
        assignedOrders: [],
        totalHours: 0,
        totalProfit: 0,
        isFatigued: drivers[i] ? checkDriverFatigue(drivers[i]) : false,
      })
    );

    console.log("Initialized drivers:", simulationDrivers.length);

    // Simulation variables
    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let fuelCostBreakdown = [];
    let totalFuelCost = 0;
    let totalBonuses = 0;
    let totalPenalties = 0;
    let totalDeliveryTime = 0;

    // Convert start time to minutes
    const [startHour, startMin] = simStartTime.split(":").map(Number);
    const startTimeMinutes = startHour * 60 + startMin;

    let currentDriverIndex = 0;

    console.log("Processing orders...");
    // Process each order
    for (let order of orders) {
      const route = routes.find((r) => r.route_id === order.route_id);
      if (!route) {
        console.warn(
          `Route ${order.route_id} not found for order ${order.order_id}`
        );
        continue;
      }

      // Get current driver
      const currentDriver = simulationDrivers[currentDriverIndex];

      // Calculate delivery time (apply company rules)
      let deliveryTimeMin = route.base_time_min;

      // Apply driver fatigue rule (Rule 2)
      if (currentDriver.isFatigued) {
        deliveryTimeMin = deliveryTimeMin / 0.7; // 30% slower
      }

      // Apply traffic multiplier (not in original rules, but reasonable)
      if (route.traffic_level === "High") {
        deliveryTimeMin *= 1.2; // 20% slower in high traffic
      }

      const deliveryHours = deliveryTimeMin / 60;

      // Check if driver can take this order
      if (currentDriver.totalHours + deliveryHours <= maxHoursPerDay) {
        // Assign order to driver
        currentDriver.assignedOrders.push(order.order_id);
        currentDriver.totalHours += deliveryHours;

        // Calculate if delivery is late (Rule 1: base_time + 10 minutes)
        const isLate = deliveryTimeMin > route.base_time_min + 10;

        // Calculate fuel cost (Rule 4)
        const baseFuelCost = route.distance_km * 5;
        const trafficSurcharge =
          route.traffic_level === "High" ? route.distance_km * 2 : 0;
        const totalRouteFuelCost = baseFuelCost + trafficSurcharge;

        // Calculate penalty (Rule 1)
        const penalty = isLate ? 50 : 0;

        // Calculate bonus (Rule 3)
        const bonus =
          order.value_rs > 1000 && !isLate ? order.value_rs * 0.1 : 0;

        // Calculate order profit (Rule 5)
        const orderProfit =
          order.value_rs + bonus - penalty - totalRouteFuelCost;

        // Update totals
        totalProfit += orderProfit;
        currentDriver.totalProfit += orderProfit;
        totalFuelCost += totalRouteFuelCost;
        totalBonuses += bonus;
        totalPenalties += penalty;
        totalDeliveryTime += deliveryTimeMin;

        // Update delivery counters
        if (isLate) {
          lateDeliveries++;
        } else {
          onTimeDeliveries++;
        }

        // Add to fuel cost breakdown
        fuelCostBreakdown.push({
          routeId: route.route_id,
          distance: route.distance_km,
          trafficLevel: route.traffic_level,
          baseCost: baseFuelCost,
          trafficSurcharge: trafficSurcharge,
          totalCost: totalRouteFuelCost,
        });
      }

      // Move to next driver (round-robin assignment)
      currentDriverIndex = (currentDriverIndex + 1) % availableDrivers;
    }

    console.log("Calculating KPIs...");
    // Calculate KPIs
    const totalDeliveries = onTimeDeliveries + lateDeliveries;
    const efficiencyScore =
      totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
    const averageDeliveryTime =
      totalDeliveries > 0 ? totalDeliveryTime / totalDeliveries : 0;
    const totalAvailableHours = availableDrivers * maxHoursPerDay;
    const totalUsedHours = simulationDrivers.reduce(
      (sum, driver) => sum + driver.totalHours,
      0
    );
    const utilizationRate = (totalUsedHours / totalAvailableHours) * 100;

    // Generate unique simulation ID
    const simulationId = `sim_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    // Prepare response data
    const simulationResults = {
      totalProfit: Math.round(totalProfit),
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      onTimeDeliveries,
      lateDeliveries,
      totalDeliveries,
      fuelCostBreakdown,
      driverAssignments: simulationDrivers.map((driver) => ({
        driverId: driver.driverId,
        assignedOrders: driver.assignedOrders,
        totalHours: Math.round(driver.totalHours * 100) / 100,
        totalProfit: Math.round(driver.totalProfit),
      })),
      performanceMetrics: {
        totalFuelCost: Math.round(totalFuelCost),
        totalBonuses: Math.round(totalBonuses),
        totalPenalties: Math.round(totalPenalties),
        averageDeliveryTime: Math.round(averageDeliveryTime),
        utilizationRate: Math.round(utilizationRate * 100) / 100,
      },
      simulationId,
    };

    console.log("Simulation completed successfully");

    // Save simulation to database (only if user is authenticated)
    if (req.user && req.user.id) {
      try {
        const simulation = new Simulation({
          simulationId,
          userId: new mongoose.Types.ObjectId(req.user.id),
          inputs: {
            availableDrivers,
            startTime: simStartTime,
            maxHoursPerDay,
            totalOrders: orders.length,
            totalRoutes: routes.length,
          },
          results: simulationResults,
          executionTime: Date.now() - startTime,
          status: "completed",
        });

        await simulation.save();
        console.log("Simulation saved to database");
      } catch (saveError) {
        console.error("Error saving simulation:", saveError);
        // Don't fail the API call if saving fails
      }
    }

    res.json(simulationResults);
  } catch (error) {
    console.error("Simulation error:", error);
    console.error("Error stack:", error.stack);

    // Save failed simulation (only if user is authenticated)
    if (req.user && req.user.id) {
      try {
        const failedSimulation = new Simulation({
          userId: new mongoose.Types.ObjectId(req.user.id),
          inputs: req.body,
          results: {},
          status: "failed",
          executionTime: Date.now() - startTime,
        });
        await failedSimulation.save();
      } catch (saveError) {
        console.error("Failed to save error simulation:", saveError);
      }
    }

    res.status(500).json({
      error: "Internal server error during simulation",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

/**
 * GET /api/simulation/history
 * Query params: page, limit
 */
const getSimulationHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's simulation history
    const simulations = await Simulation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .lean();

    const total = await Simulation.countDocuments({ userId: req.user.id });

    res.json({
      simulations: simulations.map((sim) => ({
        ...sim,
        formattedDate: new Date(sim.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get simulation history error:", error);
    res.status(500).json({
      error: "Failed to fetch simulation history",
    });
  }
};

/**
 * GET /api/simulation/:id
 * Get specific simulation details
 */
const getSimulationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = await Simulation.findOne({
      simulationId: id,
      userId: req.user.id,
    }).lean();

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    res.json(simulation);
  } catch (error) {
    console.error("Get simulation details error:", error);
    res.status(500).json({
      error: "Failed to fetch simulation details",
    });
  }
};

/**
 * DELETE /api/simulation/:id
 * Delete a simulation
 */
const deleteSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = await Simulation.findOneAndDelete({
      simulationId: id,
      userId: req.user.id,
    });

    if (!simulation) {
      return res.status(404).json({ error: "Simulation not found" });
    }

    res.json({ message: "Simulation deleted successfully" });
  } catch (error) {
    console.error("Delete simulation error:", error);
    res.status(500).json({
      error: "Failed to delete simulation",
    });
  }
};

/**
 * GET /api/simulation/stats
 * Get simulation statistics for dashboard
 */
const getSimulationStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Simulation.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalSimulations: { $sum: 1 },
          avgProfit: { $avg: "$results.totalProfit" },
          avgEfficiency: { $avg: "$results.efficiencyScore" },
          bestProfit: { $max: "$results.totalProfit" },
          worstEfficiency: { $min: "$results.efficiencyScore" },
        },
      },
    ]);

    const recentSimulations = await Simulation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "simulationId inputs.availableDrivers results.totalProfit results.efficiencyScore createdAt"
      )
      .lean();

    res.json({
      stats: stats[0] || {
        totalSimulations: 0,
        avgProfit: 0,
        avgEfficiency: 0,
        bestProfit: 0,
        worstEfficiency: 0,
      },
      recentSimulations,
    });
  } catch (error) {
    console.error("Get simulation stats error:", error);
    res.status(500).json({
      error: "Failed to fetch simulation statistics",
    });
  }
};

// Helper function to check driver fatigue (Rule 2)
const checkDriverFatigue = (driver) => {
  // Check if driver worked more than 8 hours in any of the past 7 days
  return driver.past_week_hours.some((hours) => hours > 8);
};

module.exports = {
  runSimulation,
  getSimulationHistory,
  getSimulationDetails,
  deleteSimulation,
  getSimulationStats,
};
