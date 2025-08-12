import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
import Simulation from "./components/Simulation/Simulation";
import Header from "./components/UI/Header";
import Drivers from "./components/Management/Drivers";
import RoutesPage from "./components/Management/RoutesPage";
import Orders from "./components/Management/Orders";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/management/drivers" element={<Drivers />} />
          <Route path="/management/routes" element={<RoutesPage />} />
          <Route path="/management/orders" element={<Orders />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <PrivateRoute>
                <Simulation />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
