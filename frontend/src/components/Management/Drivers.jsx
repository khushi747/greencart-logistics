import React, { useEffect, useState } from "react";
import { fetchDrivers } from "../../services/api"; // create this API call

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrivers() {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Driver
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Shift Hours</th>
              <th className="border border-gray-300 p-2">Active</th>
              <th className="border border-gray-300 p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td className="border border-gray-300 p-2">{driver._id}</td>
                <td className="border border-gray-300 p-2">{driver.name}</td>
                <td className="border border-gray-300 p-2">
                  {driver.shift_hours}
                </td>
                <td className="border border-gray-300 p-2">
                  {driver.is_active ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(driver.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Drivers;
