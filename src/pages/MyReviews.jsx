import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaCommentDots,
  FaTools,
  FaUserCog,
  FaCarSide,
  FaUserFriends,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatTile from "../components/dashboard/StatTile";
import Button from "../components/common/Button";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { formatDate } from "../utils/formatDate";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
        >
          <FaStar
            className={`text-2xl transition-colors ${
              n <= value ? "text-amber-400" : "text-slate-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div className="flex text-amber-400 text-sm shrink-0">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={n <= rating ? "opacity-100" : "opacity-20"} />
      ))}
    </div>
  );
}

// One card per completed-but-unreviewed job, with its own local
// rating/comment/submitting state so submitting one doesn't disturb the
// others in the list.
function PendingReviewCard({ request, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(request.id, { rating, comment });
    } catch (err) {
      setError(err.message || "Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-slate-900">{request.serviceTitle}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <FaUserCog className="text-slate-400" /> {request.mechanic?.name || "Mechanic"}
          </p>
        </div>
        <span className="text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full shrink-0">
          Awaiting your review
        </span>
      </div>

      {request.vehicle && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
          <FaCarSide /> {request.vehicle.label} · {request.vehicle.plateNumber}
        </p>
      )}
      {request.bookingForSomeoneElse && request.recipientName && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
          <FaUserFriends /> Booked for {request.recipientName}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            Your rating
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="How was the service? (optional)"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button type="submit" variant="primary" className="py-2 px-5 text-sm" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

function ReviewedCard({ request }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">{request.serviceTitle}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <FaUserCog className="text-slate-400 shrink-0" />
            <span className="truncate">{request.mechanic?.name || "Mechanic"}</span>
          </p>
        </div>
        <StarRow rating={request.review.rating} />
      </div>

      <p className="text-sm text-slate-600 mb-3">
        {request.review.comment ? (
          `"${request.review.comment}"`
        ) : (
          <span className="italic text-slate-400">No written comment</span>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 border-t border-slate-100 pt-3">
        {request.vehicle && (
          <span className="flex items-center gap-1.5">
            <FaCarSide /> {request.vehicle.label}
          </span>
        )}
        {request.bookingForSomeoneElse && request.recipientName && (
          <span className="flex items-center gap-1.5">
            <FaUserFriends /> For {request.recipientName}
          </span>
        )}
        <span className="flex items-center gap-1.5 ml-auto">
          <FaCheckCircle className="text-green-500" /> Reviewed {formatDate(request.review.createdAt)}
        </span>
      </div>
    </div>
  );
}

function MyReviews() {
  const { requests, addReview } = useServiceRequests();

  const pendingReviews = requests.filter(
    (r) => r.status === "Completed" && !r.review
  );
  const reviewedRequests = requests
    .filter((r) => !!r.review)
    .sort((a, b) => new Date(b.review.createdAt) - new Date(a.review.createdAt));

  const totalReviews = reviewedRequests.length;
  const avgRatingGiven = totalReviews
    ? (
        reviewedRequests.reduce((sum, r) => sum + r.review.rating, 0) / totalReviews
      ).toFixed(1)
    : "—";
  const uniqueMechanics = new Set(
    reviewedRequests.map((r) => r.mechanic?.id).filter(Boolean)
  ).size;

  const handleSubmitReview = async (requestId, payload) => {
    await addReview(requestId, payload);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
        <p className="text-slate-500 mt-1">
          Rate the mechanics who've helped you, and keep track of every review you've left.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile icon={FaCommentDots} label="Reviews Given" value={totalReviews} tone="primary" />
        <StatTile icon={FaStar} label="Average Rating Given" value={avgRatingGiven} tone="amber" />
        <StatTile icon={FaUserCog} label="Mechanics Reviewed" value={uniqueMechanics} tone="green" />
        <StatTile icon={FaHourglassHalf} label="Pending Reviews" value={pendingReviews.length} tone="slate" />
      </div>

      {pendingReviews.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <FaHourglassHalf className="text-amber-500" /> Pending Reviews
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            You completed these jobs — let the mechanic (and other customers) know how it went.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingReviews.map((r) => (
              <PendingReviewCard key={r.id} request={r} onSubmit={handleSubmitReview} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 mb-1">Your Reviews</h2>
        <p className="text-sm text-slate-500 mb-4">
          Every review you've submitted, most recent first.
        </p>

        {reviewedRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
            <FaCommentDots className="text-4xl text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700 mb-1">
              You haven't reviewed anyone yet
            </h3>
            <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">
              Once a mechanic completes a job for you, you'll be able to rate them right here.
            </p>
            <Link to="/dashboard/history">
              <Button variant="primary">
                <FaTools className="text-sm" /> View Service History
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reviewedRequests.map((r) => (
              <ReviewedCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyReviews;