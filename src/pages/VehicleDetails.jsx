import { useParams, Navigate, Link } from "react-router-dom";
import { FaCarSide, FaArrowLeft } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useVehicles } from "../context/VehicleContext";
import { useServiceRequests } from "../context/ServiceRequestContext";

function VehicleDetails() {
  const { id } = useParams();
  const { vehicles } = useVehicles();
  const { requests } = useServiceRequests();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return <Navigate to="/dashboard/vehicles" replace />;
  }

  const vehicleRequests = requests.filter((r) => r.vehicle?.id === vehicle.id);

  return (
    <DashboardLayout>
      <Link
        to="/dashboard/vehicles"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 mb-6"
      >
        <FaArrowLeft /> Back to Vehicles
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-8 max-w-xl mb-8">
        <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
          <FaCarSide className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-slate-500 mb-4">{vehicle.year}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Type</p>
            <p className="font-medium text-slate-900">{vehicle.type}</p>
          </div>
          <div>
            <p className="text-slate-400">Plate Number</p>
            <p className="font-medium text-slate-900">
              {vehicle.plateNumber}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Added On</p>
            <p className="font-medium text-slate-900">
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-slate-900 mb-4">
        Service History for this Vehicle
      </h2>
      {vehicleRequests.length === 0 ? (
        <p className="text-sm text-slate-500">
          No service requests for this vehicle yet.
        </p>
      ) : (
        <div className="space-y-3">
          {vehicleRequests.map((r) => (
            <Link
              key={r.id}
              to={
                r.status === "Completed"
                  ? `/dashboard/invoice/${r.id}`
                  : `/dashboard/track/${r.id}`
              }
              className="block bg-white rounded-xl border border-slate-100 px-5 py-4 hover:border-primary-200 transition-colors"
            >
              <p className="font-medium text-slate-900">{r.serviceTitle}</p>
              <p className="text-xs text-slate-400 mt-1">
                {r.status} · {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default VehicleDetails;