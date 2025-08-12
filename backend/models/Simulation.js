const mongoose = require("mongoose");

const SimulationSchema = new mongoose.Schema(
  {
    simulationId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Who ran the simulation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Input parameters
    inputs: {
      availableDrivers: { type: Number, required: true },
      startTime: { type: String, required: true }, // "09:30"
      maxHoursPerDay: { type: Number, required: true },
      totalOrders: { type: Number, required: true },
      totalRoutes: { type: Number, required: true },
    },

    // Calculated results/KPIs
    results: {
      totalProfit: { type: Number, required: true },
      efficiencyScore: { type: Number, required: true },
      onTimeDeliveries: { type: Number, required: true },
      lateDeliveries: { type: Number, required: true },
      totalDeliveries: { type: Number, required: true },

      // Detailed breakdowns
      fuelCostBreakdown: [
        {
          routeId: Number,
          distance: Number,
          trafficLevel: String,
          baseCost: Number,
          trafficSurcharge: Number,
          totalCost: Number,
        },
      ],

      // Driver assignments
      driverAssignments: [
        {
          driverId: Number,
          assignedOrders: [Number],
          totalHours: Number,
          totalProfit: Number,
        },
      ],

      // Performance metrics
      performanceMetrics: {
        totalFuelCost: Number,
        totalBonuses: Number,
        totalPenalties: Number,
        averageDeliveryTime: Number,
        utilizationRate: Number, // % of available driver hours used
      },
    },

    // Metadata
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },

    executionTime: {
      type: Number, // milliseconds taken to run simulation
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
SimulationSchema.index({ userId: 1, createdAt: -1 });
SimulationSchema.index({ simulationId: 1 });

// Virtual for formatted creation date
SimulationSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

module.exports = mongoose.model("Simulation", SimulationSchema);
