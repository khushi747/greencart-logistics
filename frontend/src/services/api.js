import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const fetchDashboardData = async () => {
  const response = await api.get("/dashboard");
  console.log("Dashboard data fetched:", response.data);
  return response.data; // Expect this to include profit, efficiency, fuelCost, etc.
};

export const runSimulation = async (simulationData) => {
  const response = await api.post("/simulation/run", simulationData);
  return response.data;
};

export const fetchDrivers = async () => {
  const res = await api.get("/drivers"); // your backend endpoint
  return res.data;
};

export const fetchRoutes = async () => {
  const res = await api.get("/routes");
  return res.data;
};

export const fetchOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};
