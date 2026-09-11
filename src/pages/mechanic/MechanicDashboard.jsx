import { useState, useEffect, useCallback } from "react";
import {
  FaTools,
  FaSignOutAlt,
  FaBolt,
  FaMapMarkerAlt,
  FaCarSide,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClipboardList,
  FaUserCircle,
  FaDirections,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useServiceRequests, REQUEST_STATUSES } from "../../context/ServiceRequestContext";
import Button from "../../components/common/Button";
import LiveTrackingMap from "../../components/map/LiveTrackingMap";
import api from "../../utils/api";
import { servicesData } from "../../data/servicesData";
import { formatPrice } from "../../utils/formatPrice";
import { formatDateTime } from "../../utils/formatDate";
const TABS = [
  { id: "incoming", label: "Incoming Requests" },
  { id: "active", label: "Active Job" },
  { id: "completed", label: "Completed Jobs" },
  { id: "profile", label: "Profile & Availability" },
];

function MechanicDashboard() {
  const { user, logout } = useAuth();
  const {
    getIncomingRequests,
    getActiveJobForMechanic,
    getCompletedJobsForMechanic,
    acceptRequest,
    dismissRequest,
    advanceStatus,
    cancelRequest,
  } = useServiceRequests();

  const [activeTab, setActiveTab] = useState("incoming");

  // Mechanic's own profile/availability — backed by GET /api/mechanics/me
  // and PUT /api/mechanics/profile, /api/mechanics/status.
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [saving, setSaving] = useState(false);
  const activeJob = getActiveJobForMechanic(user.id);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const { data } = await api.get("/mechanics/me");
      setProfile(data.mechanic);
    } catch (err) {
      setProfileError(err.message || "Couldn't load your profile.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  const socket = useSocket();

  // Mirrors this mechanic's own last-known position so the active job map
  // preview can plot it locally — purely a UI read of the same watcher
  // below, not a second location source.
  const [ownLocation, setOwnLocation] = useState(null);

  // Broadcasts the mechanic's live location to whoever is watching this
  // specific request (the customer's TrackService page), while there's an
  // active job. Stops automatically when the job ends or they go offline.
  useEffect(() => {
    if (!socket || !activeJob || !navigator.geolocation) return;

    socket.emit("request:join", activeJob.id);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        socket.emit("mechanic:location", {
          requestId: activeJob.id,
          ...coords,
        });
        setOwnLocation(coords);
      },
      () => {
        // Location denied/unavailable — customer just won't see live
        // position updates for this job, everything else keeps working.
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.emit("request:leave", activeJob.id);
      setOwnLocation(null);
    };
  }, [socket, activeJob]);

  const incoming = profile?.isOnline ? getIncomingRequests(user.id) : [];
  const completedJobs = getCompletedJobsForMechanic(user.id);

  const totalEarnings = completedJobs.reduce(
    (sum, r) => sum + (r.mechanic.pricePerVisit || 0),
    0
  );
  const reviewedJobs = completedJobs.filter((r) => r.review);
  const avgRating = reviewedJobs.length
    ? (
        reviewedJobs.reduce((sum, r) => sum + r.review.rating, 0) /
        reviewedJobs.length
      ).toFixed(1)
    : "—";

  const toggleOnline = async () => {
    if (!profile) return;
    setStatusError("");
    const nextOnline = !profile.isOnline;
    try {
      const { data } = await api.put("/mechanics/status", { isOnline: nextOnline });
      setProfile((prev) => ({ ...prev, isOnline: data.isOnline }));
    } catch (err) {
      setStatusError(err.message || "Couldn't update your availability.");
    }
  };

  // Persists a partial profile update to the backend, updating local state
  // only after the server confirms (so a failed save doesn't silently
  // desync the UI from what's actually stored).
  const saveProfileField = async (patch) => {
    setSaving(true);
    setProfileError("");
    try {
      const { data } = await api.put("/mechanics/profile", patch);
      setProfile(data.mechanic);
    } catch (err) {
      setProfileError(err.message || "Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = (requestId) => {
    acceptRequest(requestId, user);
    setActiveTab("active");
  };

  const handleDismiss = (requestId) => {
    dismissRequest(requestId, user.id);
  };

  const nextStatus = activeJob
    ? REQUEST_STATUSES[REQUEST_STATUSES.indexOf(activeJob.status) + 1]
    : null;

  const navigateUrl = activeJob?.customerLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeJob.customerLocation.lat},${activeJob.customerLocation.lng}`
    : null;

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-sm">
          <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            Couldn't load your mechanic profile
          </h3>
          <p className="text-slate-500 text-sm mb-5">{profileError}</p>
          <Button variant="primary" onClick={loadProfile}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold text-slate-900">
            Road<span className="text-primary-600">Rescue</span>{" "}
            <span className="text-slate-400 font-medium text-sm">
              · Mechanic
            </span>
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                profile.isOnline
                  ? "bg-green-50 text-green-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <FaBolt />
              {profile.isOnline ? "Online" : "Offline"}
            </button>
            <Button variant="outline" onClick={logout}>
              <FaSignOutAlt className="text-sm" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name} 🔧
          </h1>
          <p className="text-slate-500 mt-1">
            {profile.isOnline
              ? "You're online and visible for new requests."
              : "You're offline. Go online to start receiving requests."}
          </p>
          {profile.verification?.status !== "Approved" && (
            <p className="text-amber-600 text-sm mt-2 flex items-center gap-2">
              <FaExclamationTriangle />
              Your account verification is{" "}
              {profile.verification?.status?.toLowerCase() || "pending"}. You
              must be verified before you can go online.
            </p>
          )}
          {statusError && (
            <p className="text-red-600 text-sm mt-2">{statusError}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <FaClipboardList className="text-primary-600 mb-2" />
            <p className="text-xl font-bold text-slate-900">{incoming.length}</p>
            <p className="text-xs text-slate-500">Incoming</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <FaTools className="text-primary-600 mb-2" />
            <p className="text-xl font-bold text-slate-900">{activeJob ? 1 : 0}</p>
            <p className="text-xs text-slate-500">Active Job</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <FaMoneyBillWave className="text-primary-600 mb-2" />
            <p className="text-xl font-bold text-slate-900">
              {formatPrice(totalEarnings)}
            </p>
            <p className="text-xs text-slate-500">Total Earnings</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <FaStar className="text-amber-500 mb-2" />
            <p className="text-xl font-bold text-slate-900">{avgRating}</p>
            <p className="text-xs text-slate-500">Avg Rating</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.id === "incoming" && incoming.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {incoming.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* INCOMING TAB */}
        {activeTab === "incoming" && (
          <>
            {!profile.isOnline ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
                <FaBolt className="text-4xl text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-700 mb-1">
                  You're offline
                </h3>
                <p className="text-slate-500 text-sm mb-5">
                  Go online to start seeing incoming service requests.
                </p>
                <Button
                  variant="primary"
                  onClick={toggleOnline}
                  className="mx-auto"
                  disabled={profile.verification?.status !== "Approved"}
                >
                  Go Online
                </Button>
              </div>
            ) : incoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
                <FaClipboardList className="text-4xl text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-700 mb-1">
                  No incoming requests right now
                </h3>
                <p className="text-slate-500 text-sm">
                  New requests from nearby customers will show up here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {incoming.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">
                        {req.serviceTitle}
                      </h3>
                      <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium">
                        {req.status}
                      </span>
                    </div>
                    {req.vehicle && (
                      <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                        <FaCarSide /> {req.vehicle.label} · {req.vehicle.plateNumber}
                      </p>
                    )}
                    {req.description && (
                      <p className="text-sm text-slate-500 mb-3">
                        "{req.description}"
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mb-4">
                      Requested {formatDateTime(req.createdAt)}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1 justify-center"
                        onClick={() => handleAccept(req.id)}
                        disabled={!!activeJob}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDismiss(req.id)}
                      >
                        <FaTimes className="text-sm" />
                      </Button>
                    </div>
                    {activeJob && (
                      <p className="text-xs text-amber-600 mt-2">
                        Finish your active job before accepting a new one.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ACTIVE JOB TAB */}
        {activeTab === "active" && (
          <>
            {!activeJob ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
                <FaTools className="text-4xl text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-700 mb-1">
                  No active job
                </h3>
                <p className="text-slate-500 text-sm">
                  Accept a request from the Incoming tab to start a job.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeJob.serviceTitle}
                  </h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                    {activeJob.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-5">
                  {activeJob.vehicle && (
                    <p className="flex items-center gap-2">
                      <FaCarSide className="text-primary-600" />
                      {activeJob.vehicle.label} · {activeJob.vehicle.plateNumber}
                    </p>
                  )}
                  {activeJob.description && (
                    <p className="flex items-start gap-2">
                      <FaClipboardList className="text-primary-600 mt-0.5" />
                      {activeJob.description}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <FaClock className="text-primary-600" />
                    Requested {formatDateTime(activeJob.createdAt)}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-600" />
                    {activeJob.customerLocation
                      ? "Customer location shared"
                      : "Customer did not share a precise location"}
                  </p>
                </div>
                {activeJob.customerLocation && (
                  <div className="mb-5">
                    <LiveTrackingMap
                      customerLocation={activeJob.customerLocation}
                      mechanicLocation={ownLocation}
                      showRoute
                      heightClassName="h-56"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {navigateUrl && (
                    <a href={navigateUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline">
                        <FaDirections className="text-sm" /> Navigate
                      </Button>
                    </a>
                  )}
                  {nextStatus && (
                    <Button
                      variant="primary"
                      onClick={() => advanceStatus(activeJob.id, nextStatus)}
                    >
                      Mark as "{nextStatus}"
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => cancelRequest(activeJob.id)}
                  >
                    Cancel Job
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* COMPLETED TAB */}
        {activeTab === "completed" && (
          <>
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
                <FaCheckCircle className="text-4xl text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-700 mb-1">
                  No completed jobs yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Jobs you complete will show up here along with earnings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {job.serviceTitle}
                      </p>
                      <p className="text-xs text-slate-400">
                        Completed {formatDateTime(job.completedAt)}
                      </p>
                      {job.review && (
                        <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                          <FaStar /> {job.review.rating}/5
                          {job.review.comment && ` — "${job.review.comment}"`}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatPrice(job.mechanic.pricePerVisit)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
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
                        saveProfileField({ services: updatedServices });
                      }}
                      className={`text-sm px-3 py-1.5 rounded-full font-medium border transition-colors disabled:opacity-50 ${
                        selected
                          ? "bg-primary-600 text-white border-primary-600"
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
                      saveProfileField({ pricePerVisit: value });
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                      saveProfileField({ experienceYears: value });
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    saveProfileField({ serviceArea: e.target.value });
                  }
                }}
                placeholder="e.g. South Delhi, Gurgaon"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    saveProfileField({ bio: e.target.value });
                  }
                }}
                rows={3}
                placeholder="Years of experience, certifications, ID/verification details..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                onClick={toggleOnline}
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
        )}
      </main>
    </div>
  );
}

export default MechanicDashboard;