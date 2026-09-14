import { useState, useEffect, useCallback } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useServiceRequests, REQUEST_STATUSES } from "../../context/ServiceRequestContext";
import Button from "../../components/common/Button";
import ComplaintsPanel from "../../components/complaints/ComplaintsPanel";
import MechanicSidebar from "../../components/mechanic/MechanicSidebar";
import api from "../../utils/api";

import MechanicOverview from "./sections/MechanicOverview";
import MechanicIncomingRequests from "./sections/MechanicIncomingRequests";
import MechanicActiveJob from "./sections/MechanicActiveJob";
import MechanicCompletedJobs from "./sections/MechanicCompletedJobs";
import MechanicEarnings from "./sections/MechanicEarnings";
import MechanicReviews from "./sections/MechanicReviews";
import MechanicProfile from "./sections/MechanicProfile";

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

  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const todayEarnings = completedJobs
    .filter((r) => r.completedAt && new Date(r.completedAt) >= startOfToday)
    .reduce((sum, r) => sum + (r.mechanic.pricePerVisit || 0), 0);
  const weekEarnings = completedJobs
    .filter((r) => r.completedAt && new Date(r.completedAt) >= startOfWeek)
    .reduce((sum, r) => sum + (r.mechanic.pricePerVisit || 0), 0);

  const reviewedJobs = completedJobs.filter((r) => r.review);
  const avgRating = reviewedJobs.length
    ? (
        reviewedJobs.reduce((sum, r) => sum + r.review.rating, 0) /
        reviewedJobs.length
      ).toFixed(1)
    : "—";

  // Going online without a location means /mechanics/nearby will never
  // surface this mechanic to any user searching nearby — so grab a fresh
  // GPS fix and send it along in the same status update.
  const toggleOnline = async () => {
    if (!profile) return;
    setStatusError("");
    const nextOnline = !profile.isOnline;

    const applyStatusUpdate = async (location) => {
      try {
        const { data } = await api.put("/mechanics/status", {
          isOnline: nextOnline,
          ...(location ? { location } : {}),
        });
        setProfile((prev) => ({
          ...prev,
          isOnline: data.isOnline,
          ...(data.location ? { location: data.location } : {}),
        }));
        if (nextOnline && !location && !profile.location?.lat) {
          setStatusError(
            "You're online, but location access was denied — customers searching nearby won't see you until it's shared."
          );
        }
      } catch (err) {
        setStatusError(err.message || "Couldn't update your availability.");
      }
    };

    if (nextOnline && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          applyStatusUpdate({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => applyStatusUpdate(null)
      );
    } else {
      applyStatusUpdate(null);
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
    setActiveSection("active");
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
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
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

  const badges = { incoming: incoming.length };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <MechanicOverview
            profile={profile}
            user={user}
            incoming={incoming}
            activeJob={activeJob}
            completedJobs={completedJobs}
            totalEarnings={totalEarnings}
            todayEarnings={todayEarnings}
            weekEarnings={weekEarnings}
            avgRating={avgRating}
            reviewedJobs={reviewedJobs}
            statusError={statusError}
            onNavigate={setActiveSection}
          />
        );
      case "incoming":
        return (
          <MechanicIncomingRequests
            profile={profile}
            incoming={incoming}
            activeJob={activeJob}
            onAccept={handleAccept}
            onDismiss={handleDismiss}
            onToggleOnline={toggleOnline}
          />
        );
      case "active":
        return (
          <MechanicActiveJob
            activeJob={activeJob}
            ownLocation={ownLocation}
            navigateUrl={navigateUrl}
            nextStatus={nextStatus}
            onAdvanceStatus={advanceStatus}
            onCancel={cancelRequest}
          />
        );
      case "completed":
        return <MechanicCompletedJobs completedJobs={completedJobs} />;
      case "earnings":
        return (
          <MechanicEarnings
            completedJobs={completedJobs}
            todayEarnings={todayEarnings}
            weekEarnings={weekEarnings}
            totalEarnings={totalEarnings}
          />
        );
      case "reviews":
        return (
          <MechanicReviews reviewedJobs={reviewedJobs} avgRating={avgRating} />
        );
      case "complaints":
        return <ComplaintsPanel />;
      case "profile":
        return (
          <MechanicProfile
            user={user}
            profile={profile}
            profileError={profileError}
            saving={saving}
            onSaveField={saveProfileField}
            onToggleOnline={toggleOnline}
          />
        );
      default:
        return (
          <MechanicOverview
            profile={profile}
            user={user}
            incoming={incoming}
            activeJob={activeJob}
            completedJobs={completedJobs}
            totalEarnings={totalEarnings}
            todayEarnings={todayEarnings}
            weekEarnings={weekEarnings}
            avgRating={avgRating}
            reviewedJobs={reviewedJobs}
            statusError={statusError}
            onNavigate={setActiveSection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <MechanicSidebar
        active={activeSection}
        onSelect={setActiveSection}
        badges={badges}
        user={user}
        profile={profile}
        onToggleOnline={toggleOnline}
        onLogout={logout}
        isMobileNavOpen={isMobileNavOpen}
        onOpenMobile={() => setIsMobileNavOpen(true)}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <main
        className={`flex-1 md:ml-64 pt-20 md:pt-10 p-6 md:p-10 ${
          profile?.verification?.status !== "Approved" ? "md:pt-16" : ""
        }`}
      >
        {renderSection()}
      </main>
    </div>
  );
}

export default MechanicDashboard;