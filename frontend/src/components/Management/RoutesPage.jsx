import React, { useEffect, useState } from "react";
import {
  fetchRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../services/api";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingRouteId, setEditingRouteId] = useState(null);

  const [formData, setFormData] = useState({
    routeId: "",
    distanceKm: "",
    trafficLevel: "",
    baseTimeMin: "",
    isActive: true,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (route) => {
    setShowForm(true);
    setEditingRouteId(route._id);
    setFormData({
      routeId: route.routeId || route.route_id || "",
      distanceKm: route.distanceKm ?? route.distance_km ?? "",
      trafficLevel: route.trafficLevel || route.traffic_level || "",
      baseTimeMin: route.baseTimeMin ?? route.base_time_min ?? "",
      isActive:
        route.isActive !== undefined
          ? route.isActive
          : route.is_active !== undefined
          ? route.is_active
          : true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    if (
      !formData.routeId ||
      !formData.distanceKm ||
      !formData.trafficLevel ||
      !formData.baseTimeMin
    ) {
      setFormError("Please fill in all required fields.");
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        routeId: formData.routeId,
        distanceKm: Number(formData.distanceKm),
        trafficLevel: formData.trafficLevel,
        baseTimeMin: Number(formData.baseTimeMin),
        isActive: formData.isActive,
      };

      if (editingRouteId) {
        const updatedRoute = await updateRoute(editingRouteId, payload);
        setRoutes((prev) =>
          prev.map((route) =>
            route._id === editingRouteId ? updatedRoute : route
          )
        );
      } else {
        const newRoute = await createRoute(payload);
        setRoutes((prev) => [...prev, newRoute]);
      }

      setShowForm(false);
      setEditingRouteId(null);
      setFormData({
        routeId: "",
        distanceKm: "",
        trafficLevel: "",
        baseTimeMin: "",
        isActive: true,
      });
    } catch (error) {
      console.error(error);
      setFormError(
        editingRouteId
          ? "Failed to update route. Please try again."
          : "Failed to create route. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      await deleteRoute(routeId);
      setRoutes((prev) => prev.filter((route) => route._id !== routeId));
    } catch (error) {
      console.error("Failed to delete route:", error);
      alert("Failed to delete route. Try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Routes</h1>
        <button
          onClick={() => {
            setShowForm((show) => !show);
            if (showForm) {
              setEditingRouteId(null);
              setFormData({
                routeId: "",
                distanceKm: "",
                trafficLevel: "",
                baseTimeMin: "",
                isActive: true,
              });
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm
            ? "Cancel"
            : editingRouteId
            ? "Edit Route"
            : "Create New Route"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-50 max-w-xl"
        >
          <div className="mb-3">
            <label className="block font-semibold mb-1">Route ID *</label>
            <input
              type="text"
              name="routeId"
              value={formData.routeId}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              disabled={false}
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Distance (km) *</label>
            <input
              type="number"
              name="distanceKm"
              value={formData.distanceKm}
              min="0"
              step="0.1"
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">Traffic Level *</label>
            <select
              name="trafficLevel"
              value={formData.trafficLevel}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select traffic level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Base Time (min) *
            </label>
            <input
              type="number"
              name="baseTimeMin"
              value={formData.baseTimeMin}
              min="0"
              step="1"
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded"
            />
            <label htmlFor="isActive" className="font-semibold">
              Active
            </label>
          </div>

          {formError && (
            <p className="text-red-600 mb-3 font-semibold">{formError}</p>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {formLoading
              ? "Saving..."
              : editingRouteId
              ? "Update Route"
              : "Save Route"}
          </button>
        </form>
      )}

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
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route._id}>
                <td className="border border-gray-300 p-2">
                  {route.routeId || route.route_id}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.distanceKm || route.distance_km}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.baseTimeMin || route.base_time_min}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.trafficLevel || route.traffic_level}
                </td>
                <td className="border border-gray-300 p-2">
                  {route.isActive !== undefined
                    ? route.isActive
                      ? "Yes"
                      : "No"
                    : route.is_active !== undefined
                    ? route.is_active
                      ? "Yes"
                      : "No"
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(route)}
                    title="Edit Route"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    &#9998; {/* Pencil emoji */}
                  </button>
                  <button
                    onClick={() => handleDelete(route._id)}
                    title="Delete Route"
                    className="text-red-600 hover:text-red-800"
                  >
                    &#128465; {/* Trash bin emoji */}
                  </button>
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
