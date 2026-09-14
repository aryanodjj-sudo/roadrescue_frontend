import { useParams, Navigate, Link } from "react-router-dom";
import { FaCarSide, FaArrowLeft, FaHashtag, FaCalendarAlt, FaTag } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useVehicles } from "../context/VehicleContext";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { formatDate } from "../utils/formatDate";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-indigo-50 text-indigo-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

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

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-8">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
            <FaCarSide className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-slate-400">{vehicle.year}</p>
          </div>
        </div>
        <FaCarSide className="absolute -right-4 -bottom-6 text-[140px] text-white/5 rotate-6" />
      </div>

      {/* DETAIL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <FaTag className="text-primary-600" />
          </div>
          <p className="text-xs text-slate-400 mb-0.5">Type</p>
          <p className="font-semibold text-slate-900">{vehicle.type}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <FaHashtag className="text-primary-600" />
          </div>
          <p className="text-xs text-slate-400 mb-0.5">Plate Number</p>
          <p className="font-semibold text-slate-900">{vehicle.plateNumber}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <FaCalendarAlt className="text-primary-600" />
          </div>
          <p className="text-xs text-slate-400 mb-0.5">Added On</p>
          <p className="font-semibold text-slate-900">{formatDate(vehicle.createdAt)}</p>
        </div>
      </div>

      <h2 className="font-bold text-lg text-slate-900 mb-4">
        Service History for this Vehicle
      </h2>
      {vehicleRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">
            No service requests for this vehicle yet.
          </p>
        </div>
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
              className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-5 py-4 hover:border-primary-200 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-900">{r.serviceTitle}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(r.createdAt)}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || "bg-slate-100 text-slate-600"}`}>
                {r.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default VehicleDetails;