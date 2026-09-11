import { useState } from "react";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDate } from "../../../utils/formatDate";

const STATUS_FILTERS = ["All", "Pending", "Accepted", "On The Way", "Arrived", "In Progress", "Completed", "Cancelled"];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-blue-50 text-blue-600",
  "In Progress": "bg-purple-50 text-purple-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

function AdminServiceRequests({ allRequests }) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered =
    statusFilter === "All"
      ? allRequests
      : allRequests.filter((r) => r.status === statusFilter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Service Requests</h1>
      <p className="text-slate-500 text-sm mb-6">
        Live data from the shared request table — {allRequests.length} total request
        {allRequests.length === 1 ? "" : "s"} across the platform.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">
            {allRequests.length === 0
              ? "No service requests have been created yet. Create one from the customer dashboard to see it here."
              : "No requests match this filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Request ID</th>
                <th className="text-left px-5 py-3 font-medium">Service</th>
                <th className="text-left px-5 py-3 font-medium">Mechanic</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-5 py-4 text-slate-900 font-medium">{r.serviceTitle}</td>
                  <td className="px-5 py-4 text-slate-500">{r.mechanic?.name || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || "bg-slate-100 text-slate-600"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {r.mechanic?.pricePerVisit ? formatPrice(r.mechanic.pricePerVisit) : "—"}
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

export default AdminServiceRequests;