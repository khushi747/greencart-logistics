import React, { useEffect, useState } from "react";
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../services/api"; // Added updateDriver

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // NEW: track editing driver id
  const [editingDriverId, setEditingDriverId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    currentShiftHours: 0,
    pastWeekHours: Array(7).fill(0),
    isActive: true,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("pastWeekHours")) {
      const index = Number(name.slice(-1));
      const updatedHours = [...formData.pastWeekHours];
      updatedHours[index] = Number(value);
      setFormData((prev) => ({ ...prev, pastWeekHours: updatedHours }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // NEW: Populate form with selected driver data for editing
  const handleEdit = (driver) => {
    setShowForm(true);
    setEditingDriverId(driver._id);
    setFormData({
      name: driver.name || "",
      currentShiftHours: driver.currentShiftHours || driver.shift_hours || 0,
      pastWeekHours: driver.pastWeekHours || Array(7).fill(0),
      isActive:
        driver.isActive !== undefined
          ? driver.isActive
          : driver.is_active || true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (!formData.name.trim()) {
        setFormError("Name is required");
        setFormLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        currentShiftHours: Number(formData.currentShiftHours),
        pastWeekHours: formData.pastWeekHours.map(Number),
        isActive: formData.isActive,
      };

      if (editingDriverId) {
        // Update existing driver
        const updatedDriver = await updateDriver(editingDriverId, payload);
        setDrivers((prev) =>
          prev.map((driver) =>
            driver._id === editingDriverId ? updatedDriver : driver
          )
        );
      } else {
        // Create new driver
        const newDriver = await createDriver(payload);
        setDrivers((prev) => [...prev, newDriver]);
      }

      setShowForm(false);
      setEditingDriverId(null);
      setFormData({
        name: "",
        currentShiftHours: 0,
        pastWeekHours: Array(7).fill(0),
        isActive: true,
      });
    } catch (error) {
      console.error(error);
      setFormError(
        editingDriverId
          ? "Failed to update driver. Try again."
          : "Failed to create driver. Try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(driverId);
      setDrivers((prev) => prev.filter((driver) => driver._id !== driverId));
    } catch (error) {
      console.error("Failed to delete driver:", error);
      alert("Failed to delete driver. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <button
          onClick={() => {
            setShowForm((show) => !show);
            if (showForm) {
              setEditingDriverId(null);
              setFormData({
                name: "",
                currentShiftHours: 0,
                pastWeekHours: Array(7).fill(0),
                isActive: true,
              });
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {showForm
            ? "Cancel"
            : editingDriverId
            ? "Edit Driver"
            : "Create New Driver"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-50 max-w-xl"
        >
          <div className="mb-3">
            <label className="block font-semibold mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              disabled={false} // allow editing name on update
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Current Shift Hours
            </label>
            <input
              type="number"
              name="currentShiftHours"
              value={formData.currentShiftHours}
              min="0"
              max="24"
              step="0.1"
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1">
              Past Week Hours (7 days)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {formData.pastWeekHours.map((hour, idx) => (
                <input
                  key={idx}
                  type="number"
                  name={`pastWeekHours${idx}`}
                  value={hour}
                  min="0"
                  max="24"
                  step="0.1"
                  onChange={handleInputChange}
                  className="border p-1 rounded text-center"
                  title={`Day ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-3 flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              id="isActive"
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
              : editingDriverId
              ? "Update Driver"
              : "Save Driver"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading drivers...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Shift Hours</th>
              <th className="border border-gray-300 p-2">Active</th>
              <th className="border border-gray-300 p-2">Created At</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td className="border border-gray-300 p-2">{driver._id}</td>
                <td className="border border-gray-300 p-2">{driver.name}</td>
                <td className="border border-gray-300 p-2">
                  {driver.currentShiftHours || driver.shift_hours || 0}
                </td>
                <td className="border border-gray-300 p-2">
                  {driver.isActive !== undefined
                    ? driver.isActive
                      ? "Yes"
                      : "No"
                    : driver.is_active
                    ? "Yes"
                    : "No"}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(driver.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(driver)}
                    title="Edit Driver"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    &#9998; {/* Pencil emoji */}
                  </button>
                  <button
                    onClick={() => handleDelete(driver._id)}
                    title="Delete Driver"
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

export default Drivers;
