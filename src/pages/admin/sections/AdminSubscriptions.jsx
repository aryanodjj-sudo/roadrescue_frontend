import { useState, useEffect, useCallback } from "react";
import { FaCrown, FaUsers, FaMoneyBillWave, FaCalendarAlt, FaCalendarWeek, FaBan } from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import { formatCurrency } from "../../../utils/formatPrice";
import api from "../../../utils/api";
import { formatDateTime } from "../../../utils/formatDate";

const STATUS_STYLES = {
  active: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
  expired: "bg-slate-100 text-slate-500",
};

function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/subscriptions/admin/all");
      setSubscriptions(data.subscriptions);
    } catch (err) {
      setError(err.message || "Couldn't load subscriptions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = subscriptions.filter((s) => s.status === "active" && new Date(s.endDate) >= new Date()).length;
  const monthlyCount = subscriptions.filter((s) => s.plan === "monthly").length;
  const annualCount = subscriptions.filter((s) => s.plan === "annual").length;
  const cancelledCount = subscriptions.filter((s) => s.status === "cancelled").length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Subscriptions</h1>
      <p className="text-slate-500 text-sm mb-6">All subscription purchases across the platform.</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon={FaCrown} label="Active Subscribers" value={activeCount} tone="amber" />
        <StatCard icon={FaCalendarWeek} label="Monthly Plans" value={monthlyCount} tone="primary" />
        <StatCard icon={FaCalendarAlt} label="Annual Plans" value={annualCount} tone="primary" />
        <StatCard icon={FaBan} label="Cancelled" value={cancelledCount} tone="red" />
        <StatCard icon={FaMoneyBillWave} label="Total Revenue" value={formatCurrency(totalRevenue)} tone="accent" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center text-sm text-slate-500">
          Loading...
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">No subscriptions purchased yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Start</th>
                <th className="text-left px-5 py-3 font-medium">End</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-slate-900 font-medium">{s.user?.name}</p>
                    <p className="text-xs text-slate-400">{s.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-700">{s.plan}</td>
                  <td className="px-5 py-4 text-slate-700">₹{s.price}</td>
                  <td className="px-5 py-4 text-slate-500">{formatDateTime(s.startDate)}</td>
                  <td className="px-5 py-4 text-slate-500">{formatDateTime(s.endDate)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[s.status] || "bg-slate-100 text-slate-500"}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminSubscriptions;