import React, { useState } from "react";
import { runSimulation } from "../../services/api";  
import DeliveryChart from "../Charts/DeliveryChart";  
import FuelCostChart from "../Charts/FuelCostChart";  
const Simulation = () => {
  const [formData, setFormData] = useState({
    availableDrivers: 1,
    startTime: "",
    maxHoursPerDay: 8,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "availableDrivers" || name === "maxHoursPerDay"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const simStartTime = formData.startTime
      ? formData.startTime.slice(11, 16) 
      : "";
    try {
      const payload = {
        availableDrivers: formData.availableDrivers,
        startTime: simStartTime,  
        maxHoursPerDay: formData.maxHoursPerDay,
      };

      const res = await runSimulation(payload);
      setResult(res);
    } catch (err) {
      setError("Failed to run simulation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Run Simulation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Available Drivers</label>
          <input
            type="number"
            name="availableDrivers"
            min="1"
            value={formData.availableDrivers}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Max Hours per Day</label>
          <input
            type="number"
            name="maxHoursPerDay"
            min="1"
            max="24"
            value={formData.maxHoursPerDay}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </form>

      {/* Display results */}
      {/* Show results */}
      {result && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold">Simulation Results</h2>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded text-center">
              <h3 className="font-bold">Total Profit</h3>
              <p className="text-2xl text-green-700">₹{result.totalProfit}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded text-center">
              <h3 className="font-bold">Efficiency Score</h3>
              <p className="text-2xl text-blue-700">
                {result.efficiencyScore}%
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
              <h3 className="font-bold">On-Time Deliveries</h3>
              <p className="text-xl">{result.onTimeDeliveries}</p>
            </div>
            <div className="bg-red-100 p-4 rounded text-center">
              <h3 className="font-bold">Late Deliveries</h3>
              <p className="text-xl">{result.lateDeliveries}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold mb-4">On-time vs Late Deliveries</h3>
              <DeliveryChart
                data={[
                  { name: "On-time", value: result.onTimeDeliveries },
                  { name: "Late", value: result.lateDeliveries },
                ]}
              />
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold mb-4">Fuel Cost Breakdown</h3>
              <FuelCostChart
                data={result.fuelCostBreakdown.map((fc) => ({
                  name: `Route ${fc.routeId}`,
                  value: fc.totalCost,
                }))}
              />
            </div>
          </div>

          {/* Driver Assignments */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Driver Assignments</h3>
            {result.driverAssignments.map((driver) => (
              <div key={driver.driverId} className="mb-4 p-4 border rounded">
                <h4 className="font-bold mb-2">Driver {driver.driverId}</h4>
                <p>Total Hours: {driver.totalHours.toFixed(2)}</p>
                <p>Total Profit: ₹{driver.totalProfit}</p>
                <p>Orders: {driver.assignedOrders.join(", ")}</p>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Total Fuel Cost: ₹{result.performanceMetrics.totalFuelCost}
              </li>
              <li>Total Bonuses: ₹{result.performanceMetrics.totalBonuses}</li>
              <li>
                Total Penalties: ₹{result.performanceMetrics.totalPenalties}
              </li>
              <li>
                Average Delivery Time:{" "}
                {result.performanceMetrics.averageDeliveryTime} mins
              </li>
              <li>
                Utilization Rate: {result.performanceMetrics.utilizationRate}%
              </li>
            </ul>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Simulation;
