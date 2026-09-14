import { FaUserCircle, FaBolt } from "react-icons/fa";
import { servicesData } from "../../../data/servicesData";

function MechanicProfile({
  user,
  profile,
  profileError,
  saving,
  onSaveField,
  onToggleOnline,
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Profile &amp; Availability
        </h1>
        <p className="text-slate-500 mt-1">
          Keep your service details up to date so customers know what to expect.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center">
            <FaUserCircle className="text-3xl" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        {profileError && (
          <p className="text-red-600 text-sm mb-4">{profileError}</p>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Services Offered
          </label>
          <div className="flex flex-wrap gap-2">
            {servicesData.map((s) => {
              const selected = profile.services.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    const updatedServices = selected
                      ? profile.services.filter((id) => id !== s.id)
                      : [...profile.services, s.id];
                    onSaveField({ services: updatedServices });
                  }}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium border transition-colors disabled:opacity-50 ${
                    selected
                      ? "bg-accent-600 text-white border-accent-600"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price Per Visit (₹)
            </label>
            <input
              type="number"
              defaultValue={profile.pricePerVisit}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value !== profile.pricePerVisit) {
                  onSaveField({ pricePerVisit: value });
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              defaultValue={profile.experienceYears}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value !== profile.experienceYears) {
                  onSaveField({ experienceYears: value });
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Service Area
          </label>
          <input
            type="text"
            defaultValue={profile.serviceArea}
            onBlur={(e) => {
              if (e.target.value !== profile.serviceArea) {
                onSaveField({ serviceArea: e.target.value });
              }
            }}
            placeholder="e.g. South Delhi, Gurgaon"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bio / Verification Notes
          </label>
          <textarea
            defaultValue={profile.bio}
            onBlur={(e) => {
              if (e.target.value !== profile.bio) {
                onSaveField({ bio: e.target.value });
              }
            }}
            rows={3}
            placeholder="Years of experience, certifications, ID/verification details..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Verification status:{" "}
            <span className="font-medium text-slate-600">
              {profile.verification?.status || "Pending"}
            </span>
            . Document upload is a future enhancement — the backend model
            doesn't yet support file storage.
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50">
          <span className="text-sm font-medium text-slate-700">
            Availability
          </span>
          <button
            onClick={onToggleOnline}
            disabled={profile.verification?.status !== "Approved"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50 ${
              profile.isOnline
                ? "bg-green-50 text-green-600"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <FaBolt /> {profile.isOnline ? "Online" : "Offline"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MechanicProfile;