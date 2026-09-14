import { useState } from "react";
import { FaPlus, FaCarSide, FaTags } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import VehicleCard from "../components/vehicle/VehicleCard";
import VehicleFormModal from "../components/vehicle/VehicleFormModal";
import Button from "../components/common/Button";
import { useVehicles } from "../context/VehicleContext";

function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const openAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data);
    } else {
      await addVehicle(data);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this vehicle from your account?")) return;
    setDeleteError("");
    try {
      await deleteVehicle(id);
    } catch (err) {
      setDeleteError(err.message || "Could not delete this vehicle.");
    }
  };

  const typeCounts = vehicles.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <DashboardLayout>
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-2">
            Vehicle Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">My Vehicles</h1>
          <p className="text-slate-300 text-sm">
            Keep your vehicle details up to date for faster service requests.
          </p>
        </div>
        <Button variant="primary" onClick={openAddModal} className="relative z-10 shrink-0">
          <FaPlus className="text-sm" /> Add Vehicle
        </Button>
        <FaCarSide className="absolute -right-4 -bottom-6 text-[160px] text-white/5 rotate-6" />
      </div>

      {/* STATS */}
      {vehicles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <FaCarSide className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
            <p className="text-xs sm:text-sm text-slate-500">Total Vehicles</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <FaTags className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {Object.keys(typeCounts).length}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">Vehicle Types</p>
          </div>
          {topType && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400 mb-1">Most Common Type</p>
              <p className="text-lg font-bold text-slate-900">{topType[0]}</p>
              <p className="text-xs sm:text-sm text-slate-500">{topType[1]} vehicle{topType[1] === 1 ? "" : "s"}</p>
            </div>
          )}
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {deleteError}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaCarSide className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">No vehicles added yet</h3>
          <p className="text-slate-500 text-sm mb-5">
            Add a vehicle to start requesting roadside assistance.
          </p>
          <Button variant="primary" onClick={openAddModal} className="mx-auto">
            <FaPlus className="text-sm" /> Add Your First Vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={openEditModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingVehicle}
      />
    </DashboardLayout>
  );
}

export default Vehicles;