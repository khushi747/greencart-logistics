import React from "react";

const EfficiencyScore = ({ score }) => {
  // Clamp score between 0 and 100
  const validScore = Math.min(Math.max(score, 0), 100);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Efficiency Score</h3>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-gray-300"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-green-500"
            strokeWidth="3"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            strokeDasharray={`${validScore}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text
            x="18"
            y="20.35"
            className="text-2xl font-bold text-green-600"
            textAnchor="middle"
          >
            {validScore}%
          </text>
        </svg>
      </div>
    </div>
  );
};

export default EfficiencyScore;
