const Order = require("../models/Order");

// Get all orders  GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get single order by ID  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new order POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      valueRs,
      routeId,
      deliveryTimestamp,
      assignedDriverId,
      simulationId,
    } = req.body;

    if (!orderId || !valueRs || !routeId) {
      return res
        .status(400)
        .json({ error: "orderId, valueRs, and routeId are required" });
    }

    const order = await Order.create({
      orderId,
      valueRs,
      routeId,
      deliveryTimestamp,
      assignedDriverId,
      simulationId,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Update an order   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete an order  DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order removed" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
