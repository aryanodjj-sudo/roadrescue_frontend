import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaLocationArrow,
  FaArrowLeft,
  FaFileInvoiceDollar,
  FaRoute,
  FaClock,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import LiveTrackingMap from "../components/map/LiveTrackingMap";
import RecipientLocationBadge from "../components/service/RecipientLocationBadge";
import {
  useServiceRequests,
  REQUEST_STATUSES,
} from "../context/ServiceRequestContext";
import { useSocket } from "../context/SocketContext";
import { calculateDistance, estimateETA } from "../utils/calculateDistance";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-indigo-50 text-indigo-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

function TrackService() {
  const { id } = useParams();
  const { getRequestById, cancelRequest, addReview } = useServiceRequests();
  const socket = useSocket();
  const request = getRequestById(id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const lastUpdateRef = useRef(null);

  // Live tracking: join this request's room and listen for the mechanic's
  // position while the job is active. Feeds both the map marker below and
  // the live distance/ETA readout.
  useEffect(() => {
    if (!socket || !request) return;

    socket.emit("request:join", request.id);

    const handleLocation = (payload) => {
      if (payload.requestId !== request.id) return;
      setMechanicLocation({ lat: payload.lat, lng: payload.lng });
      lastUpdateRef.current = payload.at;
    };

    socket.on("mechanic:location", handleLocation);

    return () => {
      socket.off("mechanic:location", handleLocation);
      socket.emit("request:leave", request.id);
    };
  }, [socket, request]);

  if (!request) {
    return <Navigate to="/dashboard/history" replace />;
  }

  const currentIndex = REQUEST_STATUSES.indexOf(request.status);
  const isCancelled = request.status === "Cancelled";
  const isCompleted = request.status === "Completed";
  // Customer can only cancel before a mechanic is actively on the job.
  const canCancel = !isCancelled && !isCompleted && request.status === "Pending";

  const liveDistanceKm =
    mechanicLocation && request.customerLocation
      ? calculateDistance(
          mechanicLocation.lat,
          mechanicLocation.lng,
          request.customerLocation.lat,
          request.customerLocation.lng
        )
      : null;
  const liveEtaMinutes = liveDistanceKm != null ? estimateETA(liveDistanceKm) : null;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    addReview(request.id, { rating, comment });
  };

  return (
    <DashboardLayout>
      <Link
        to="/dashboard/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
      >
        <FaArrowLeft className="text-xs" /> Back to history
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Track Service</h1>
          <p className="text-slate-500 mt-1">
            {request.serviceTitle} · Request #{request.id?.slice(-6)}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-4 py-2 rounded-full self-start sm:self-auto ${
            STATUS_STYLES[request.status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {!isCancelled && request.customerLocation && (
            <LiveTrackingMap
              customerLocation={request.customerLocation}
              mechanicLocation={!isCompleted ? mechanicLocation : null}
              showRoute={!isCompleted}
              heightClassName="h-72 sm:h-96"
            />
          )}

          {mechanicLocation && !isCompleted && !isCancelled && (
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
                <FaLocationArrow className="animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {request.mechanic.name} is on the move
                </p>
                <p className="text-sm text-slate-600">
                  {liveDistanceKm != null
                    ? `${liveDistanceKm} km away · ETA ${liveEtaMinutes} min`
                    : "Live location received"}
                </p>
              </div>
            </div>
          )}

          <RecipientLocationBadge request={request} />

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Request Status</h2>
            {isCancelled ? (
              <div className="flex items-center gap-3 text-red-500 font-semibold">
                <FaTimesCircle className="text-xl" /> This request was cancelled.
              </div>
            ) : (
              <ol className="space-y-4">
                {REQUEST_STATUSES.filter((s) => s !== "Cancelled").map(
                  (status, i) => {
                    const reached = i <= currentIndex;
                    return (
                      <li key={status} className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            reached
                              ? "bg-primary-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {reached ? <FaCheckCircle className="text-sm" /> : i + 1}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            reached ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {status}
                        </span>
                        {reached && i === currentIndex && (
                          <span className="text-xs text-primary-600 font-semibold ml-auto">
                            Current
                          </span>
                        )}
                      </li>
                    );
                  }
                )}
              </ol>
            )}
          </div>

          {isCompleted && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">
                Rate your experience
              </h2>

              {request.review ? (
                <p className="text-sm text-slate-500">
                  You already reviewed this service ({request.review.rating}/5).
                  Thanks for the feedback!
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rate {request.mechanic.name}
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button type="button" key={n} onClick={() => setRating(n)}>
                          <FaStar
                            className={`text-2xl ${
                              n <= rating ? "text-amber-400" : "text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="How was the service?"
                    />
                  </div>
                  <Button type="submit" variant="primary">
                    Submit Review
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6 lg:sticky lg:top-6 self-start">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              Your Mechanic
            </p>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={request.mechanic.image}
                alt={request.mechanic.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {request.mechanic.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <FaStar /> {request.mechanic.rating?.toFixed(1) || "New"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <FaRoute className="text-[10px]" /> Distance
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {liveDistanceKm != null ? `${liveDistanceKm} km` : "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <FaClock className="text-[10px]" /> ETA
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {liveEtaMinutes != null ? `${liveEtaMinutes} min` : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4">
              <span className="text-slate-500">Service charge</span>
              <span className="font-bold text-slate-900">
                {request.mechanic.pricePerVisit === 0
                  ? "FREE"
                  : `₹${request.mechanic.pricePerVisit}`}
              </span>
            </div>
          </div>

          {isCompleted && (
            <Link to={`/dashboard/invoice/${request.id}`}>
              <Button variant="outline" className="w-full justify-center">
                <FaFileInvoiceDollar className="text-sm" /> View Invoice
              </Button>
            </Link>
          )}

          {!isCancelled && !isCompleted && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              {request.status === "Pending" && (
                <p className="text-sm text-slate-500 mb-3">
                  Waiting for a mechanic to accept your request...
                </p>
              )}
              {canCancel && (
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => cancelRequest(request.id)}
                >
                  Cancel Request
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TrackService;