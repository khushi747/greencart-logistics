// src/components/Charts/FuelCostChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#a7f3d0", "#bbf7d0"];

const FuelCostChart = ({ data }) => {
  return (
    <div className="flex justify-center items-center h-full overflow-hidden">
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#22c55e"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default FuelCostChart;
