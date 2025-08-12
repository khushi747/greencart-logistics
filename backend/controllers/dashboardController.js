const express = require("express");
const Driver = require("../models/Driver");
const Order = require("../models/Order");
const Route = require("../models/Route");

// GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const orders = await Order.find({});
    const routes = await Route.find({});

    // Map routes by route_id
    const routeMap = {};
    routes.forEach((route) => {
      routeMap[route.route_id] = route;
    });

    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    const fuelCostMap = { Base: 0, TrafficSurcharge: 0 }; // Initialize fuel cost categories

    for (const order of orders) {
      const route = routeMap[order.route_id];

      if (!route) {
        console.warn(`No route found for order ${order._id}`);
        continue;
      }

      // Calculate delivery time in minutes
      const deliveryTimeMs = new Date(order.delivery_time).getTime();
      const orderCreationTimeMs = new Date(order.createdAt).getTime();
      const deliveryTimeMin = deliveryTimeMs / (60 * 1000);
      const orderCreationTimeMin = orderCreationTimeMs / (60 * 1000);
      const baseRouteTime = route.base_time_min; // in minutes
      const orderValue = order.value_rs || 0;

      // Check if delivered on time (deliveryTime <= baseRouteTime + 10 mins)
      const isOnTime =
        deliveryTimeMin - orderCreationTimeMin <= baseRouteTime + 10;

      if (isOnTime) {
        onTimeDeliveries++;
      } else {
        lateDeliveries++;
      }

      // Penalty and bonus
      let penalty = 0;
      let bonus = 0;

      if (!isOnTime) {
        penalty += 50;
      }

      if (orderValue > 1000 && isOnTime) {
        bonus += orderValue * 0.1;
      }

      // Fuel cost calculation
      let fuelCost = 0;
      if (route.distance_km) {
        const baseFuelCost = route.distance_km * 5; // ₹5/km
        fuelCost += baseFuelCost;
        fuelCostMap.Base += baseFuelCost; // Aggregate base fuel cost
        if (route.traffic_level === "High") {
          const surcharge = route.distance_km * 2; // ₹2/km
          fuelCost += surcharge;
          fuelCostMap.TrafficSurcharge += surcharge; // Aggregate traffic surcharge
        }
      }

      const orderProfit = orderValue + bonus - penalty - fuelCost;
      totalProfit += orderProfit;
    }

    const totalDeliveries = onTimeDeliveries + lateDeliveries;
    const efficiencyScore =
      totalDeliveries > 0
        ? Math.round((onTimeDeliveries / totalDeliveries) * 100)
        : 0;

    const deliveryStats = [
      { name: "On-time", value: onTimeDeliveries },
      { name: "Late", value: lateDeliveries },
    ];

    // Convert fuelCostMap to fuelCostBreakdown array
    const fuelCostBreakdown = Object.entries(fuelCostMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    res.json({
      totalProfit,
      efficiencyScore,
      deliveryStats,
      fuelCostBreakdown,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

module.exports = {
  getDashboardData,
};
