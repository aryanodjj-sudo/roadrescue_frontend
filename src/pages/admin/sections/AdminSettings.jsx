import { useState } from "react";
import { FaSave } from "react-icons/fa";
import Button from "../../../components/common/Button";

function AdminSettings() {
  // Local-only mock settings. Will be persisted via a real backend
  // settings endpoint once Phase 10/11 is implemented.
  const [settings, setSettings] = useState({
    platformName: "RoadRescue",
    supportEmail: "support@roadrescue.example",
    commissionPercent: 12,
    autoApproveMechanics: false,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

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

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl space-y-5">
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
    </div>
  );
}

export default AdminSettings;