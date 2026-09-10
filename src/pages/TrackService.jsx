import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaStar, FaLocationArrow } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import LiveTrackingMap from "../components/map/LiveTrackingMap";
import {
  useServiceRequests,
  REQUEST_STATUSES,
} from "../context/ServiceRequestContext";
import { useSocket } from "../context/SocketContext";
import { calculateDistance, estimateETA } from "../utils/calculateDistance";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Track Service</h1>
        <p className="text-slate-500 mt-1">
          {request.serviceTitle} · {request.mechanic.name}
        </p>
      </div>

      {!isCancelled && request.customerLocation && (
        <div className="mb-6 max-w-2xl">
          <LiveTrackingMap
            customerLocation={request.customerLocation}
            mechanicLocation={!isCompleted ? mechanicLocation : null}
            showRoute={!isCompleted}
            heightClassName="h-72 sm:h-96"
          />
        </div>
      )}

      {mechanicLocation && !isCompleted && !isCancelled && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6 max-w-2xl flex items-center gap-4">
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

      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 max-w-2xl">
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
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
                  </li>
                );
              }
            )}
          </ol>
        )}
      </div>

      {!isCancelled && !isCompleted && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {request.status === "Pending" && (
            <p className="text-sm text-slate-500">
              Waiting for a mechanic to accept your request...
            </p>
          )}
          {canCancel && (
            <Button variant="outline" onClick={() => cancelRequest(request.id)}>
              Cancel Request
            </Button>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              Service completed
            </h3>
            <Link
              to={`/dashboard/invoice/${request.id}`}
              className="text-sm font-semibold text-primary-600"
            >
              View Invoice
            </Link>
          </div>

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
                    <button
                      type="button"
                      key={n}
                      onClick={() => setRating(n)}
                    >
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
    </DashboardLayout>
  );
}

export default TrackService;