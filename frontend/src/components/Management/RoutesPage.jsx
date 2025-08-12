import React, { useEffect, useState } from "react";
import { fetchRoutes } from "../../services/api"; // make sure this API call exists

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const data = await fetchRoutes();
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Routes</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Route
        </button>
      </div>

      {loading ? (
        <p>Loading routes...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Route ID</th>
              <th className="border border-gray-300 p-2">Distance (km)</th>
              <th className="border border-gray-300 p-2">Base Time (min)</th>
              <th className="border border-gray-300 p-2">Traffic Level</th>
              <th className="border border-gray-300 p-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route._id}>
                <td className="border border-gray-300 p-2">{route.route_id}</td>
                
                <td className="border border-gray-300 p-2">
                  {route.distance_km}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.base_time_min}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.traffic_level}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.is_active ? "Yes" : "No"}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoutesPage;
