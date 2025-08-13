import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <nav className="flex space-x-4">
        {user ? (
          <>
            <div className="flex items-center justify-center">
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </div>

            <nav className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Management ▼
              </button>

              {showDropdown && (
                <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
                  <li>
                    <Link
                      to="/management/drivers"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Drivers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/routes"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Routes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/management/orders"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Orders
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
            <Link
              to="/simulation"
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded flex items-center justify-center"
            >
              Run Simulation
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </nav>

      {user && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 px-3 pb-3 py-2 rounded"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
