import React, { useEffect, useState } from "react"; 
import DeliveryChart from "../Charts/DeliveryChart";
import FuelCostChart from "../Charts/FuelCostChart";
import { fetchDashboardData } from "../../services/api";

const Dashboard = () => {
  // Initialize with default empty data to avoid undefined errors
  const [data, setData] = useState({
    totalProfit: 0,
    efficiencyScore: 0,
    deliveryStats: [],
    fuelCostBreakdown: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchDashboardData();
        setData(res);  // res is the dashboard data object, not { data: ... }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Total Profit</h2>
          <p className="text-2xl text-green-600">${data.totalProfit}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Efficiency Score</h2>
          <p className="text-2xl text-blue-600">{data.efficiencyScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">On-time vs Late Deliveries</h2>
          <DeliveryChart data={data.deliveryStats} />
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Fuel Cost Breakdown</h2>
          <FuelCostChart data={data.fuelCostBreakdown} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
