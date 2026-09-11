import { useState, useEffect, useCallback } from "react";
import { FaPlus, FaExclamationTriangle, FaBalanceScale } from "react-icons/fa";
import Button from "../common/Button";
import api from "../../utils/api";
import { useServiceRequests } from "../../context/ServiceRequestContext";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Resolved: "bg-green-50 text-green-600",
};

function StatusPill({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

// Used on both the customer's /dashboard/complaints page and the
// mechanic dashboard's "Complaints" tab. Talks to POST /api/complaints
// and GET /api/complaints/mine — the backend infers the submitter's role
// from the JWT, so this component doesn't need to know which side it's on.
function ComplaintsPanel() {
  const { getAllRequests } = useServiceRequests();
  const relatedRequests = getAllRequests();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState("Complaint");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [serviceRequestId, setServiceRequestId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/complaints/mine");
      setComplaints(data.complaints);
    } catch (err) {
      setError(err.message || "Couldn't load your complaints.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const resetForm = () => {
    setType("Complaint");
    setSubject("");
    setDescription("");
    setServiceRequestId("");
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setSubmitError("Please fill in both the subject and description.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/complaints", {
        type,
        subject: subject.trim(),
        description: description.trim(),
        serviceRequestId: serviceRequestId || undefined,
      });
      resetForm();
      setFormOpen(false);
      await loadComplaints();
    } catch (err) {
      setSubmitError(err.message || "Couldn't submit this right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Complaints & Disputes</h1>
        <Button variant="primary" onClick={() => setFormOpen((v) => !v)}>
          <FaPlus className="text-sm" /> {formOpen ? "Cancel" : "Raise New"}
        </Button>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Raise a complaint about the platform or service, or a dispute tied to
        a specific request. An admin will review and update the status here.
      </p>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 max-w-xl space-y-4"
        >
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType("Complaint")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                type === "Complaint"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              <FaExclamationTriangle className="text-sm" /> Complaint
            </button>
            <button
              type="button"
              onClick={() => setType("Dispute")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                type === "Dispute"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              <FaBalanceScale className="text-sm" /> Dispute
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Request (optional)
            </label>
            <select
              value={serviceRequestId}
              onChange={(e) => setServiceRequestId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Not related to a specific request</option>
              {relatedRequests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.serviceTitle} · {new Date(r.createdAt).toLocaleDateString()} · {r.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain what happened..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

          <Button variant="primary" type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-dashed border-red-200 p-14 text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={loadComplaints} className="text-sm font-semibold text-primary-600 hover:underline">
            Try Again
          </button>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaExclamationTriangle className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">Nothing raised yet</h3>
          <p className="text-slate-500 text-sm">
            Complaints and disputes you submit will show up here with their status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  {c.type === "Dispute" ? (
                    <FaBalanceScale className="text-primary-600" />
                  ) : (
                    <FaExclamationTriangle className="text-primary-600" />
                  )}
                  <h3 className="font-semibold text-slate-900">{c.subject}</h3>
                </div>
                <StatusPill status={c.status} />
              </div>
              <p className="text-sm text-slate-500 mb-2">{c.description}</p>
              {c.serviceRequest && (
                <p className="text-xs text-slate-400 mb-1">
                  Related to: {c.serviceRequest.serviceType || "a service request"}
                </p>
              )}
              {c.adminNote && (
                <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 mt-2">
                  <span className="font-medium">Admin note:</span> {c.adminNote}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                {c.type} · Submitted {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintsPanel;