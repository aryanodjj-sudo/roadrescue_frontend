import { mockComplaints, mockDisputes } from "../../../data/adminMockData";

const STATUS_STYLES = {
  Open: "bg-red-50 text-red-500",
  "Under Review": "bg-amber-50 text-amber-600",
  Escalated: "bg-red-50 text-red-500",
  Resolved: "bg-green-50 text-green-600",
};

function StatusPill({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function AdminComplaintsDisputes() {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Complaints & Disputes</h1>
        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Mock data
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Placeholder queues until real complaint/dispute APIs exist (Phase 10/11).
      </p>

      <h2 className="font-semibold text-slate-900 mb-3">Complaints</h2>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto mb-10">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Raised By</th>
              <th className="text-left px-5 py-3 font-medium">Against</th>
              <th className="text-left px-5 py-3 font-medium">Subject</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockComplaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-slate-900 font-medium">{c.raisedBy}</td>
                <td className="px-5 py-4 text-slate-500">{c.against}</td>
                <td className="px-5 py-4 text-slate-500">{c.subject}</td>
                <td className="px-5 py-4 text-slate-500">{c.date}</td>
                <td className="px-5 py-4"><StatusPill status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-semibold text-slate-900 mb-3">Disputes</h2>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Request ID</th>
              <th className="text-left px-5 py-3 font-medium">Raised By</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockDisputes.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{d.requestId}</td>
                <td className="px-5 py-4 text-slate-900 font-medium">{d.raisedBy}</td>
                <td className="px-5 py-4 text-slate-500">{d.type}</td>
                <td className="px-5 py-4 text-slate-500">{d.description}</td>
                <td className="px-5 py-4"><StatusPill status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminComplaintsDisputes;