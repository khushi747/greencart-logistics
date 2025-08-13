import axios from "axios";

const api = axios.create({
  baseURL: "https://greencart-backend-tg6w.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
export const createDriver = async (driverData) => {
  const res = await api.post("/drivers", driverData);
  return res.data;
};
export const deleteDriver = async (driverId) => {
  const res = await api.delete(`/drivers/${driverId}`);
  return res.data;
};
export const updateDriver = async (id, data) => {
  const res = await api.put(`/drivers/${id}`, data);
  return res.data;
};
export const fetchRoutes = async () => {
  const res = await api.get("/routes");
  return res.data;
};
export const createRoute = async (routeData) => {
  const res = await api.post("/routes", routeData);
  return res.data;
};
export const deleteRoute = async (routeId) => {
  const res = await api.delete(`/routes/${routeId}`);
  return res.data;
};
export const updateRoute = async (id, data) => {
  const res = await api.put(`/routes/${id}`, data);
  return res.data;
};
export const fetchOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};
export const updateOrder = async (id, data) => {
  const res = await api.put(`/orders/${id}`, data);
  return res.data;
};
export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};
