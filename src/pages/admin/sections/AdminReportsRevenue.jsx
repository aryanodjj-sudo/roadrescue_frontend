import { useState, useEffect, useCallback } from "react";
import StatCard from "../../../components/admin/StatCard";
import { FaMoneyBillWave, FaChartLine, FaClipboardCheck, FaPercentage } from "react-icons/fa";
import api from "../../../utils/api";
import { mockRevenueByMonth } from "../../../data/adminMockData";

function AdminReportsRevenue({ allRequests }) {
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
      setError(err.message || "Couldn't load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const completed = allRequests.filter((r) => r.status === "Completed");
  const cancelled = allRequests.filter((r) => r.status === "Cancelled");
  const completionRate = allRequests.length
    ? Math.round((completed.length / allRequests.length) * 100)
    : 0;

  const lastMonth = mockRevenueByMonth[mockRevenueByMonth.length - 1];
  const prevMonth = mockRevenueByMonth[mockRevenueByMonth.length - 2];
  const momChange = prevMonth
    ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Reports & Revenue</h1>
        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Monthly trend is mock
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Completion rate and totals below come from real service-request/payment
        data. There's no payment gateway yet, so collected revenue reflects
        payments actually marked paid — not the value of completed jobs.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaClipboardCheck} label="Completed Requests" value={completed.length} tone="green" />
        <StatCard icon={FaPercentage} label="Completion Rate" value={`${completionRate}%`} tone="primary" />
        <StatCard
          icon={FaMoneyBillWave}
          label="Collected Revenue"
          value={loading || !reports ? "…" : `₹${reports.totalRevenue.toLocaleString("en-IN")}`}
          tone="accent"
        />
        <StatCard
          icon={FaChartLine}
          label="Month-over-Month (mock trend)"
          value={`${momChange >= 0 ? "+" : ""}${momChange}%`}
          tone={momChange >= 0 ? "green" : "red"}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Month</th>
              <th className="text-left px-5 py-3 font-medium">Revenue (mock)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockRevenueByMonth.map((m) => (
              <tr key={m.month} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-slate-900 font-medium">{m.month}</td>
                <td className="px-5 py-4 text-slate-500">₹{m.revenue.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Cancelled requests so far: {cancelled.length}. A real monthly revenue
        breakdown would need a new backend aggregation endpoint — not built yet.
      </p>
    </div>
  );
}

export default AdminReportsRevenue;
