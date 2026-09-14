import { useState, useEffect } from "react";
import { FaSave, FaUserShield, FaUsers, FaTools, FaClipboardList, FaHeadset, FaShieldAlt } from "react-icons/fa";
import Button from "../../../components/common/Button";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";

function AdminSettings() {
  const { user } = useAuth();

  // Local-only mock settings. Will be persisted via a real backend
  // settings endpoint once Phase 10/11 is implemented.
  const [settings, setSettings] = useState({
    platformName: "RoadRescue",
    supportEmail: "support@roadrescue.example",
    commissionPercent: 12,
    autoApproveMechanics: false,
  });
  const [saved, setSaved] = useState(false);

  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    api
      .get("/admin/reports")
      .then(({ data }) => setSnapshot(data.reports))
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const initials = (user?.name || "A")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Mock — not persisted to a backend yet
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Platform-level configuration for the admin panel.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 space-y-5 h-fit">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => handleChange("platformName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Platform Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.commissionPercent}
              onChange={(e) => handleChange("commissionPercent", Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50">
            <span className="text-sm font-medium text-slate-700">
              Auto-approve new mechanics
            </span>
            <button
              type="button"
              onClick={() => handleChange("autoApproveMechanics", !settings.autoApproveMechanics)}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                settings.autoApproveMechanics ? "bg-primary-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoApproveMechanics ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">
              <FaSave className="text-sm" /> Save Settings
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Saved (locally, this session).</span>
            )}
          </div>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              <FaUserShield className="text-xs" /> Administrator
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Platform Snapshot</h3>
            {snapshot ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2"><FaUsers className="text-slate-400" /> Users</span>
                  <span className="font-semibold text-slate-900">{snapshot.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2"><FaTools className="text-slate-400" /> Mechanics</span>
                  <span className="font-semibold text-slate-900">{snapshot.totalMechanics}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2"><FaClipboardList className="text-slate-400" /> Active Requests</span>
                  <span className="font-semibold text-slate-900">{snapshot.activeRequests}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Loading...</p>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-primary-400" />
              <h3 className="font-semibold">Need platform-level help?</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Reach the engineering team for anything beyond what this panel covers.
            </p>
            <a
              href="mailto:engineering@roadrescue.example"
              className="text-sm font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1.5"
            >
              <FaHeadset className="text-xs" /> engineering@roadrescue.example
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;