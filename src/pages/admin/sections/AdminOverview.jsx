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
} from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import api from "../../../utils/api";
import { mockRevenueByMonth } from "../../../data/adminMockData";

function AdminOverview() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const maxRevenue = Math.max(...mockRevenueByMonth.map((m) => m.revenue));

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
            value={`₹${reports.totalRevenue.toLocaleString("en-IN")}`}
            tone="accent"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
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
                title={`₹${m.revenue.toLocaleString("en-IN")}`}
              />
              <span className="text-xs text-slate-500">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
