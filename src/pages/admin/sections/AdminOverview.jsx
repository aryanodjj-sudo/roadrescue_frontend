import { useState, useEffect, useCallback } from "react";
import {
  FaUsers,
  FaTools,
  FaUserCheck,
  FaHourglassHalf,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaConciergeBell,
  FaStar,
  FaExclamationTriangle,
  FaBalanceScale,
  FaFileAlt,
  FaTag,
  FaCrown,
  FaCog,
  FaArrowRight,
} from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import api from "../../../utils/api";
import { mockRevenueByMonth } from "../../../data/adminMockData";
import { formatCurrency, formatPrice } from "../../../utils/formatPrice";
import { formatDate } from "../../../utils/formatDate";

const NAV_CARDS = [
  { id: "users", label: "Users", icon: FaUsers },
  { id: "mechanics", label: "Mechanics", icon: FaTools },
  { id: "verification", label: "Verification", icon: FaUserCheck },
  { id: "requests", label: "Service Requests", icon: FaClipboardList },
  { id: "services", label: "Services", icon: FaConciergeBell },
  { id: "reviews", label: "Reviews", icon: FaStar },
  { id: "complaints", label: "Complaints", icon: FaExclamationTriangle },
  { id: "disputes", label: "Disputes", icon: FaBalanceScale },
  { id: "reports", label: "Reports", icon: FaFileAlt },
  { id: "revenue", label: "Revenue", icon: FaMoneyBillWave },
  { id: "coupons", label: "Coupons", icon: FaTag },
  { id: "subscriptions", label: "Subscriptions", icon: FaCrown },
  { id: "settings", label: "Settings", icon: FaCog },
];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-indigo-50 text-indigo-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

function AdminOverview({ onNavigate, allRequests = [] }) {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topMechanics, setTopMechanics] = useState([]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/reports");
      setReports(data.reports);
    } catch (err) {
      setError(err.message || "Couldn't load platform stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    api
      .get("/admin/mechanics")
      .then(({ data }) => {
        const sorted = [...data.mechanics]
          .filter((m) => m.reviewCount > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);
        setTopMechanics(sorted);
      })
      .catch(() => setTopMechanics([]));
  }, []);

  const maxRevenue = Math.max(...mockRevenueByMonth.map((m) => m.revenue));
  const recentRequests = [...allRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Live stats from the backend — revenue trend below is still mock (no
          monthly breakdown endpoint exists yet).
        </p>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading || !reports ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center mb-8">
          <p className="text-slate-500 text-sm">Loading stats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FaUsers} label="Total Users" value={reports.totalUsers} tone="primary" />
          <StatCard icon={FaTools} label="Total Mechanics" value={reports.totalMechanics} tone="primary" />
          <StatCard icon={FaUserCheck} label="Verified Mechanics" value={reports.verifiedMechanics} tone="green" />
          <StatCard icon={FaHourglassHalf} label="Pending Verifications" value={reports.pendingVerifications} tone="amber" />
          <StatCard icon={FaClipboardList} label="Active Requests" value={reports.activeRequests} tone="primary" />
          <StatCard icon={FaCheckCircle} label="Completed Requests" value={reports.completedRequests} tone="green" />
          <StatCard icon={FaTimesCircle} label="Cancelled Requests" value={reports.cancelledRequests} tone="red" />
          <StatCard
            icon={FaMoneyBillWave}
            label="Collected Revenue"
            value={formatCurrency(reports.totalRevenue)}
            tone="accent"
          />
        </div>
      )}

      {/* QUICK NAVIGATION */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Manage Platform</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {NAV_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate?.(card.id)}
              className="group text-left bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                <card.icon className="text-lg" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{card.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Revenue Trend</h2>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Mock data
            </span>
          </div>
          <div className="flex items-end gap-4 h-40">
            {mockRevenueByMonth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <div
                  className="w-full max-w-10 bg-primary-500 rounded-t-lg"
                  style={{ height: `${Math.max((m.revenue / maxRevenue) * 140, 8)}px` }}
                  title={formatCurrency(m.revenue)}
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>

          {/* RECENT ACTIVITY */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => onNavigate?.("requests")}
              className="text-sm font-semibold text-primary-600 flex items-center gap-1"
            >
              View all <FaArrowRight className="text-xs" />
            </button>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No service requests yet.</p>
          ) : (
            <div className="space-y-2">
              {recentRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{r.serviceTitle}</p>
                    <p className="text-xs text-slate-400">
                      {r.mechanic?.name || "Unassigned"} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || "bg-slate-100 text-slate-600"}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP MECHANICS LEADERBOARD */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Top Mechanics</h2>
          {topMechanics.length === 0 ? (
            <p className="text-sm text-slate-500">
              No rated mechanics yet — ratings appear once customers leave
              reviews.
            </p>
          ) : (
            <div className="space-y-4">
              {topMechanics.map((m, i) => (
                <div key={m._id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <img
                    src={`https://i.pravatar.cc/150?u=${m._id}`}
                    alt={m.user?.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {m.user?.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <FaStar /> {m.rating?.toFixed(1)} ({m.reviewCount})
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {formatPrice(m.pricePerVisit)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;