import { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaTools,
  FaUserCheck,
  FaStar,
  FaWifi,
} from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import { formatPrice } from "../../../utils/formatPrice";
import api from "../../../utils/api";

const SERVICE_LABELS = {
  breakdown: "Breakdown Repair",
  towing: "Towing",
  battery: "Battery Jump-Start",
  tyre: "Flat Tyre Repair",
  fuel: "Fuel Delivery",
};

function VerificationPill({ status }) {
  const config = {
    Approved: { style: "bg-green-50 text-green-600", icon: FaCheckCircle, label: "Verified" },
    Pending: { style: "bg-amber-50 text-amber-600", icon: FaHourglassHalf, label: "Pending" },
    Rejected: { style: "bg-red-50 text-red-500", icon: FaTimesCircle, label: "Rejected" },
  }[status] || { style: "bg-slate-100 text-slate-500", icon: FaHourglassHalf, label: status };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.style}`}>
      <Icon className="text-xs" /> {config.label}
    </span>
  );
}

function AdminMechanics() {
  const [search, setSearch] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMechanics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/mechanics");
      setMechanics(data.mechanics);
    } catch (err) {
      setError(err.message || "Couldn't load mechanics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMechanics();
  }, [loadMechanics]);

  const filtered = mechanics.filter((m) =>
    (m.user?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const verifiedCount = mechanics.filter((m) => m.verification?.status === "Approved").length;
  const pendingCount = mechanics.filter((m) => m.verification?.status === "Pending").length;
  const onlineCount = mechanics.filter((m) => m.isOnline).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Mechanics</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        {loading ? "Loading..." : `${filtered.length} of ${mechanics.length} registered mechanics`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaTools} label="Total Mechanics" value={mechanics.length} tone="primary" />
        <StatCard icon={FaUserCheck} label="Verified" value={verifiedCount} tone="green" />
        <StatCard icon={FaHourglassHalf} label="Pending" value={pendingCount} tone="amber" />
        <StatCard icon={FaWifi} label="Online Now" value={onlineCount} tone="accent" />
      </div>

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mechanics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading mechanics...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-dashed border-red-200 p-14 text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={loadMechanics} className="text-sm font-semibold text-primary-600 hover:underline">
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">No mechanics match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <div key={m._id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/150?u=${m._id}`}
                    alt={m.user?.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{m.user?.name || "Unnamed"}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <FaStar /> {m.rating?.toFixed(1) || "New"}
                      {m.isOnline && (
                        <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <VerificationPill status={m.verification?.status} />
              </div>
              <p className="text-sm text-slate-500 mb-1">{m.serviceArea || "No service area set"}</p>
              <p className="text-sm text-slate-500 mb-3">
                {m.experienceYears} yrs experience · {m.user?.phone || "—"} · {formatPrice(m.pricePerVisit)}/visit
              </p>
              <div className="flex flex-wrap gap-2">
                {(m.services || []).map((s) => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {SERVICE_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMechanics;