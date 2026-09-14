import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCarSide,
  FaTools,
  FaHistory,
  FaPlus,
  FaBell,
  FaUser,
  FaExclamationTriangle,
  FaCrown,
  FaMapMarkerAlt,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaMobileAlt,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../context/VehicleContext";
import { useServiceRequests } from "../context/ServiceRequestContext";
import api from "../utils/api";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

const QUICK_ACTIONS = [
  { label: "Get Assistance", to: "/dashboard/services", icon: FaTools, tone: "primary" },
  { label: "Find a Mechanic", to: "/dashboard/find-mechanic", icon: FaMapMarkerAlt, tone: "primary" },
  { label: "My Vehicles", to: "/dashboard/vehicles", icon: FaCarSide, tone: "slate" },
  { label: "Service History", to: "/dashboard/history", icon: FaHistory, tone: "slate" },
  { label: "Notifications", to: "/dashboard/notifications", icon: FaBell, tone: "slate" },
  { label: "Complaints", to: "/dashboard/complaints", icon: FaExclamationTriangle, tone: "slate" },
  { label: "Subscription", to: "/dashboard/subscription", icon: FaCrown, tone: "amber" },
  { label: "Profile", to: "/dashboard/profile", icon: FaUser, tone: "slate" },
];

const TONE_STYLES = {
  primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white",
  slate: "bg-slate-100 text-slate-500 group-hover:bg-slate-800 group-hover:text-white",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
};

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-indigo-50 text-indigo-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

function Dashboard() {
  const { user } = useAuth();
  const { vehicles } = useVehicles();
  const { requests, unreadCount } = useServiceRequests();

  const [topMechanics, setTopMechanics] = useState([]);
  const [mechanicsLoading, setMechanicsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/mechanics")
      .then(({ data }) => {
        const sorted = [...data.mechanics]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        setTopMechanics(sorted);
      })
      .catch(() => setTopMechanics([]))
      .finally(() => setMechanicsLoading(false));
  }, []);

  const activeRequest = requests.find(
    (r) => r.status !== "Completed" && r.status !== "Cancelled"
  );
  const activeRequestsCount = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Cancelled"
  ).length;
  const pastServicesCount = requests.filter((r) => r.status === "Completed").length;
  const recentHistory = requests.slice(0, 3);

  const stats = [
    { label: "Vehicles", value: vehicles.length, icon: FaCarSide },
    { label: "Active Requests", value: activeRequestsCount, icon: FaTools },
    { label: "Completed Services", value: pastServicesCount, icon: FaHistory },
    { label: "Unread Alerts", value: unreadCount, icon: FaBell },
  ];

  return (
    <DashboardLayout>
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 sm:p-10 text-white mb-8">
        <div className="relative z-10 max-w-lg">
          <p className="text-primary-100 text-sm font-semibold uppercase tracking-wide mb-2">
            Welcome back
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-primary-50 mb-6">
            Vehicle trouble finds you when you least expect it. We're one tap
            away, day or night.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard/services">
              <Button variant="accent">
                <FaTools className="text-sm" /> Get Assistance
              </Button>
            </Link>
            <Link to="/dashboard/find-mechanic">
              <Button
                variant="outline"
                className="!border-white/40 !text-white hover:!border-white"
              >
                <FaMapMarkerAlt className="text-sm" /> Find a Mechanic
              </Button>
            </Link>
          </div>
        </div>
        <FaTools className="absolute -right-6 -bottom-8 text-[220px] text-white/10 rotate-12" />
      </div>

      {/* ACTIVE REQUEST TRACKER */}
      {activeRequest && (
        <Link
          to={`/dashboard/track/${activeRequest.id}`}
          className="block bg-white rounded-2xl border-2 border-primary-200 p-5 mb-8 hover:border-primary-400 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <FaClock className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {activeRequest.serviceTitle} in progress
                </p>
                <p className="text-sm text-slate-500">
                  {activeRequest.mechanic?.name || "Mechanic"} ·{" "}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[activeRequest.status]}`}
                  >
                    {activeRequest.status}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary-600 flex items-center gap-1 shrink-0">
              Track live <FaArrowRight className="text-xs" />
            </span>
          </div>
        </Link>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <stat.icon className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${TONE_STYLES[action.tone]}`}
              >
                <action.icon className="text-lg" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {action.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* MY VEHICLES */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">My Vehicles</h2>
            <Link to="/dashboard/vehicles" className="text-sm font-semibold text-primary-600">
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
                <Button variant="outline" className="mx-auto">
                  <FaPlus className="text-sm" /> Add Your First Vehicle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.slice(0, 4).map((v) => (
                <Link
                  key={v.id}
                  to={`/dashboard/vehicles/${v.id}`}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-primary-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                    <FaCarSide className="text-primary-600" />
                  </div>
                  <p className="font-semibold text-slate-900">
                    {v.make} {v.model}
                  </p>
                  <p className="text-sm text-slate-400">
                    {v.year} · {v.plateNumber}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* RECENT ACTIVITY */}
          <div className="flex items-center justify-between mb-4 mt-8">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link to="/dashboard/history" className="text-sm font-semibold text-primary-600">
              View all
            </Link>
          </div>
          {recentHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-slate-500 text-sm">
                Your service requests will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-slate-100 px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {r.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP RATED MECHANICS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Top Rated Near You</h2>
          </div>
          {mechanicsLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : topMechanics.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-slate-500 text-sm">
                No verified mechanics online right now.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topMechanics.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${m.id}`}
                    alt={m.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {m.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <FaStar /> {m.rating?.toFixed(1) || "New"}
                      <span className="text-slate-400">
                        ({m.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 shrink-0">
                    {formatPrice(m.pricePerVisit)}
                  </p>
                </div>
              ))}
              <Link
                to="/dashboard/find-mechanic"
                className="block text-center text-sm font-semibold text-primary-600 mt-2"
              >
                Browse all mechanics
              </Link>
            </div>
          )}

          {/* TRUST STRIP */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white mt-6">
            <h3 className="font-semibold mb-4">Why RoadRescue</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <FaShieldAlt className="text-primary-400 shrink-0" /> Every mechanic is verified
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-primary-400 shrink-0" /> Avg. arrival under 15 min
              </p>
              <p className="flex items-center gap-2">
                <FaCheckCircle className="text-primary-400 shrink-0" /> Transparent, upfront pricing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* APP PROMOTION */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 bg-white/10 text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <FaMobileAlt /> RoadRescue Mobile
          </span>
          <h3 className="text-2xl font-bold mb-3">
            Help in your pocket, wherever the road takes you.
          </h3>
          <p className="text-slate-300 text-sm mb-6">
            Track mechanics live, get instant alerts, and request help in one
            tap — all from your phone.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed opacity-80">
              <FaApple className="text-lg" /> App Store
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed opacity-80">
              <FaGooglePlay className="text-lg" /> Google Play
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Coming soon</p>
        </div>
        <FaMobileAlt className="relative z-10 text-[140px] text-white/10 md:text-white/20 shrink-0" />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;