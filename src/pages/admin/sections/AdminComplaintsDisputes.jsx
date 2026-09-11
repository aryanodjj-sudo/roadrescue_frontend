import { useState, useEffect, useCallback } from "react";
import { FaExclamationTriangle, FaBalanceScale } from "react-icons/fa";
import Button from "../../../components/common/Button";
import api from "../../../utils/api";
import { formatDateTime } from "../../../utils/formatDate";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Resolved: "bg-green-50 text-green-600",
};

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

function StatusPill({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

// filterType: "Complaint" | "Dispute" | undefined (undefined = show both,
// used if this section is ever rendered without a sidebar-driven filter).
function AdminComplaintsDisputes({ filterType }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [statusDraft, setStatusDraft] = useState("Pending");
  const [noteDraft, setNoteDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/complaints");
      setComplaints(data.complaints);
    } catch (err) {
      setError(err.message || "Couldn't load complaints/disputes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const openManage = (item) => {
    setSelected(item);
    setStatusDraft(item.status);
    setNoteDraft(item.adminNote || "");
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const { data } = await api.put(`/admin/complaints/${selected._id}/status`, {
        status: statusDraft,
        adminNote: noteDraft,
      });
      setComplaints((prev) => prev.map((c) => (c._id === selected._id ? data.complaint : c)));
      setSelected(null);
    } catch (err) {
      setSaveError(err.message || "Couldn't update status.");
    } finally {
      setSaving(false);
    }
  };

  const visible = filterType ? complaints.filter((c) => c.type === filterType) : complaints;
  const complaintsList = visible.filter((c) => c.type === "Complaint");
  const disputesList = visible.filter((c) => c.type === "Dispute");
  const showComplaints = !filterType || filterType === "Complaint";
  const showDisputes = !filterType || filterType === "Dispute";

  const renderTable = (rows, emptyLabel) => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
      {rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">{emptyLabel}</div>
      ) : (
        <table className="w-full text-sm min-w-[680px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Raised By</th>
              <th className="text-left px-5 py-3 font-medium">Related Request</th>
              <th className="text-left px-5 py-3 font-medium">Subject</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="text-slate-900 font-medium">{c.submittedBy?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{c.submittedByRole}</p>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {c.serviceRequest ? (
                    <>
                      <span className="capitalize">{c.serviceRequest.serviceType}</span>
                      <span className="text-xs text-slate-400"> · {c.serviceRequest.status}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-4 text-slate-700">{c.subject}</td>
                <td className="px-5 py-4 text-slate-500">{formatDateTime(c.createdAt)}</td>
                <td className="px-5 py-4"><StatusPill status={c.status} /></td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => openManage(c)}
                    className="text-sm font-semibold text-primary-600 hover:underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">
          {filterType === "Dispute" ? "Disputes" : filterType === "Complaint" ? "Complaints" : "Complaints & Disputes"}
        </h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Raised by users and mechanics from their dashboards. Update the status as you work through each one.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}{" "}
          <button onClick={loadComplaints} className="font-semibold underline">Try Again</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      ) : (
        <>
          {showComplaints && (
            <>
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-primary-600" /> Complaints
              </h2>
              <div className={showDisputes ? "mb-10" : ""}>
                {renderTable(complaintsList, "No complaints raised yet.")}
              </div>
            </>
          )}

          {showDisputes && (
            <>
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FaBalanceScale className="text-primary-600" /> Disputes
              </h2>
              {renderTable(disputesList, "No disputes raised yet.")}
            </>
          )}
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-1">
              {selected.type === "Dispute" ? (
                <FaBalanceScale className="text-primary-600" />
              ) : (
                <FaExclamationTriangle className="text-primary-600" />
              )}
              <h3 className="text-lg font-bold text-slate-900">{selected.subject}</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {selected.submittedBy?.name} ({selected.submittedByRole}) · {formatDateTime(selected.createdAt)}
            </p>

            <p className="text-sm text-slate-600 mb-4">{selected.description}</p>

            {selected.serviceRequest && (
              <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 mb-4">
                Related request: <span className="capitalize font-medium">{selected.serviceRequest.serviceType}</span>{" "}
                · {selected.serviceRequest.status}
                {selected.serviceRequest.mechanic?.user?.name && (
                  <> · Mechanic: {selected.serviceRequest.mechanic.user.name}</>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Note (optional)</label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                placeholder="Visible to the person who raised this"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {saveError && <p className="text-red-600 text-sm mb-3">{saveError}</p>}

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 justify-center" disabled={saving} onClick={handleSave}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" className="flex-1 justify-center" onClick={() => setSelected(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminComplaintsDisputes;