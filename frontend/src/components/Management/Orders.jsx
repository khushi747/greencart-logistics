import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../services/api";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Order
        </button>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 p-2">{order.order_id}</td>
                <td className="border border-gray-300 p-2">{order.route_id}</td>
                <td className="border border-gray-300 p-2">{order.value_rs}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.delivery_time).toLocaleString()}
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
