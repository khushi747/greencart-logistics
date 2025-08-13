import React, { useEffect, useState } from "react";
import {
  fetchOrders,
  createOrder,
  deleteOrder,
  updateOrder,
} from "../../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null); // NEW: track editing order
  const [formData, setFormData] = useState({
    order_id: "",
    value_rs: "",
    route_id: "",
    delivery_time: "",
    assigned_driver_id: "",
    simulation_id: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

   const handleEdit = (order) => {
    setShowForm(true);
    setEditingOrderId(order._id);
    setFormData({
      order_id: order.order_id || "",
      value_rs: order.value_rs?.toString() || "",
      route_id: order.route_id || "",
      delivery_time: order.delivery_time
        ? new Date(order.delivery_time).toISOString().slice(0, 16)
        : "",
      assigned_driver_id: order.assigned_driver_id || "",
      simulation_id: order.simulation_id || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

     if (!formData.order_id || !formData.value_rs || !formData.route_id) {
      setFormError("Order ID, Value, and Route ID are required.");
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        orderId: formData.order_id,
        valueRs: Number(formData.value_rs),
        routeId: formData.route_id,
        deliveryTime: formData.delivery_time || null,
        assignedDriverId: formData.assigned_driver_id || null,
        simulationId: formData.simulation_id || null,
      };

      if (editingOrderId) {
         const updatedOrder = await updateOrder(editingOrderId, payload);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === editingOrderId ? updatedOrder : order
          )
        );
      } else {
         const newOrder = await createOrder(payload);
        setOrders((prev) => [...prev, newOrder]);
      }

      setShowForm(false);
      setEditingOrderId(null);
      setFormData({
        order_id: "",
        value_rs: "",
        route_id: "",
        delivery_time: "",
        assigned_driver_id: "",
        simulation_id: "",
      });
    } catch (error) {
      console.error(error);
      setFormError(
        editingOrderId
          ? "Failed to update order."
          : "Failed to create order. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => {
            setShowForm((show) => !show);
            if (showForm) {
              setEditingOrderId(null);
              setFormData({
                order_id: "",
                value_rs: "",
                route_id: "",
                delivery_time: "",
                assigned_driver_id: "",
                simulation_id: "",
              });
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm
            ? "Cancel"
            : editingOrderId
            ? "Edit Order"
            : "Create New Order"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-50 max-w-xl"
        >
          {/* form inputs (same as before) */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Order ID *</label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              disabled={!!editingOrderId} // optionally disable editing order ID during update
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Value (₹) *</label>
            <input
              type="number"
              name="value_rs"
              value={formData.value_rs}
              min="0"
              step="0.01"
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Route ID *</label>
            <input
              type="text"
              name="route_id"
              value={formData.route_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Delivery Time</label>
            <input
              type="datetime-local"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Assigned Driver ID
            </label>
            <input
              type="text"
              name="assigned_driver_id"
              value={formData.assigned_driver_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Simulation ID</label>
            <input
              type="text"
              name="simulation_id"
              value={formData.simulation_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {formError && (
            <p className="text-red-600 mb-3 font-semibold">{formError}</p>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {formLoading
              ? "Saving..."
              : editingOrderId
              ? "Update Order"
              : "Save Order"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Route ID</th>
              <th className="border border-gray-300 p-2">Value (₹)</th>
              <th className="border border-gray-300 p-2">Delivery Time</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 p-2">{order.order_id}</td>
                <td className="border border-gray-300 p-2">{order.route_id}</td>
                <td className="border border-gray-300 p-2">{order.value_rs}</td>
                <td className="border border-gray-300 p-2">
                  {order.delivery_time
                    ? new Date(order.delivery_time).toLocaleString()
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(order)}
                    title="Edit Order"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    &#9998; {/* Pencil emoji */}
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    title="Delete Order"
                    className="text-red-600 hover:text-red-800"
                  >
                    &#128465; {/* Trash bin emoji */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
