import { useState } from "react";
import { FaPlus, FaCarSide } from "react-icons/fa";
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

  // Throws on failure so VehicleFormModal can show the error inline
  // and keep the modal open instead of closing on a failed save.
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Vehicles</h1>
          <p className="text-slate-500 mt-1">Manage the vehicles linked to your account.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <FaPlus className="text-sm" /> Add Vehicle
        </Button>
      </div>

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