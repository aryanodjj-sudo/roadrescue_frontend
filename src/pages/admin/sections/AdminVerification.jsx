import { useState, useEffect, useCallback } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "../../../components/common/Button";
import api from "../../../utils/api";

const SERVICE_LABELS = {
  breakdown: "Breakdown Repair",
  towing: "Towing",
  battery: "Battery Jump-Start",
  tyre: "Flat Tyre Repair",
  fuel: "Fuel Delivery",
};

function AdminVerification() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [actioningId, setActioningId] = useState(null);

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

  const pending = mechanics.filter((m) => m.verification?.status === "Pending");

  const setVerification = async (id, status) => {
    setActioningId(id);
    setError("");
    try {
      const { data } = await api.put(`/admin/mechanics/${id}/verify`, { status });
      setMechanics((prev) => prev.map((m) => (m._id === id ? data.mechanic : m)));
      setSelected(null);
    } catch (err) {
      setError(err.message || "Couldn't update verification status.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Mechanic Verification</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        {loading
          ? "Loading..."
          : `${pending.length} pending verification${pending.length === 1 ? "" : "s"}`}
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading mechanics...</p>
        </div>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">No mechanics awaiting verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pending.map((m) => (
            <div key={m._id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900 mb-1">{m.user?.name}</h3>
              <p className="text-sm text-slate-500 mb-1">{m.serviceArea || "No service area set"}</p>
              <p className="text-sm text-slate-500 mb-1">
                {m.experienceYears} yrs experience · {m.user?.phone || "—"}
              </p>
              <p className="text-sm text-slate-500 mb-3">
                Registered {new Date(m.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  className="flex-1 justify-center"
                  disabled={actioningId === m._id}
                  onClick={() => setVerification(m._id, "Approved")}
                >
                  <FaCheck className="text-sm" /> Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 justify-center"
                  disabled={actioningId === m._id}
                  onClick={() => setVerification(m._id, "Rejected")}
                >
                  <FaTimes className="text-sm" /> Reject
                </Button>
                <Button variant="ghost" onClick={() => setSelected(m)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{selected.user?.name}</h3>
            <div className="space-y-1.5 text-sm text-slate-600 mb-5">
              <p>Email: {selected.user?.email}</p>
              <p>Phone: {selected.user?.phone || "—"}</p>
              <p>Service Area: {selected.serviceArea || "Not set"}</p>
              <p>Experience: {selected.experienceYears} years</p>
              <p>
                Services:{" "}
                {(selected.services || []).map((s) => SERVICE_LABELS[s] || s).join(", ") || "None listed"}
              </p>
              <p>Registered: {new Date(selected.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-slate-400">
                Document upload/verification isn't supported by the backend yet — this
                approval is based on the profile details above only.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1 justify-center"
                disabled={actioningId === selected._id}
                onClick={() => setVerification(selected._id, "Approved")}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 justify-center"
                disabled={actioningId === selected._id}
                onClick={() => setVerification(selected._id, "Rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVerification;
