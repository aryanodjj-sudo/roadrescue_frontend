import { Link } from "react-router-dom";
import { FaCarSide, FaTools, FaHistory, FaPlus } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../context/VehicleContext";
import { useServiceRequests } from "../context/ServiceRequestContext";

function Dashboard() {
  const { user } = useAuth();
  const { vehicles } = useVehicles();
  const { requests } = useServiceRequests();

  // FIXED: these were hardcoded to 0 even though ServiceRequestContext
  // already exposes everything needed to compute them for real.
  const activeRequestsCount = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Cancelled"
  ).length;
  const pastServicesCount = requests.filter(
    (r) => r.status === "Completed"
  ).length;

  const stats = [
    { label: "Vehicles", value: vehicles.length, icon: FaCarSide },
    { label: "Active Requests", value: activeRequestsCount, icon: FaTools },
    { label: "Past Services", value: pastServicesCount, icon: FaHistory },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's an overview of your RoadRescue account.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <stat.icon className="text-primary-600 text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Need roadside help?</h2>
          <p className="text-primary-50 text-sm">
            Select a service and get connected to a mechanic in minutes.
          </p>
        </div>
        <Link to="/dashboard/services">
          <Button variant="accent">Get Assistance</Button>
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">My Vehicles</h2>
          <Link
            to="/dashboard/vehicles"
            className="text-sm font-semibold text-primary-600"
          >
            View all
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
            <FaCarSide className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">
              You haven't added any vehicles yet.
            </p>
            <Link to="/dashboard/vehicles">
              <Button variant="outline">
                <FaPlus className="text-sm" /> Add Your First Vehicle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <p className="font-semibold text-slate-900">
                  {v.make} {v.model}
                </p>
                <p className="text-sm text-slate-400">
                  {v.year} • {v.plateNumber}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;