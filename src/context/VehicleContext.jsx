import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const VehicleContext = createContext();

// Normalizes a Mongo document into the shape the rest of the app expects
// (an `id` field instead of `_id`) so VehicleCard/VehicleDetails/etc. never
// had to change.
function normalize(v) {
  return { ...v, id: v._id };
}

export function VehicleProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      setVehicles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get("/vehicles")
      .then(({ data }) => setVehicles(data.vehicles.map(normalize)))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const addVehicle = async (vehicleData) => {
    const { data } = await api.post("/vehicles", vehicleData);
    const newVehicle = normalize(data.vehicle);
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = async (id, vehicleData) => {
    const { data } = await api.put(`/vehicles/${id}`, vehicleData);
    const updated = normalize(data.vehicle);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
    return updated;
  };

  const deleteVehicle = async (id) => {
    await api.delete(`/vehicles/${id}`);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const value = { vehicles, loading, addVehicle, updateVehicle, deleteVehicle };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }
  return context;
}