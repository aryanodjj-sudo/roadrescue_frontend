import { FaStar, FaCommentDots, FaUser, FaCarSide, FaUserFriends } from "react-icons/fa";
import { formatDateTime } from "../../../utils/formatDate";

function Stars({ rating }) {
  return (
    <div className="flex text-amber-500 text-sm">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={n <= rating ? "opacity-100" : "opacity-20"} />
      ))}
    </div>
  );
}

function MechanicReviews({ reviewedJobs, avgRating }) {
  // Simple 5/4/3/2/1-star distribution so a mechanic can see the shape of
  // their feedback, not just the average.
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewedJobs.filter((r) => r.review.rating === star).length,
  }));
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="text-slate-500 mt-1">
          What customers are saying about your work.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
          <p className="text-4xl font-extrabold text-slate-900 mb-2">{avgRating}</p>
          <div className="flex justify-center mb-2">
            <Stars rating={Math.round(Number(avgRating) || 0)} />
          </div>
          <p className="text-sm text-slate-500">
            From {reviewedJobs.length} review{reviewedJobs.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 text-sm">
            Rating Distribution
          </h3>
          <div className="space-y-2">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-slate-500 font-medium">{d.star} star</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">All Reviews</h2>
        {reviewedJobs.length === 0 ? (
          <div className="text-center py-8">
            <FaCommentDots className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Reviews from completed jobs will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviewedJobs.map((job) => (
              <div key={job.id} className="py-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {job.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <FaUser className="text-slate-400" /> {job.customerName}
                    </p>
                  </div>
                  <Stars rating={job.review.rating} />
                </div>
                {job.review.comment && (
                  <p className="text-sm text-slate-600 mb-2">
                    "{job.review.comment}"
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  {job.vehicle && (
                    <span className="flex items-center gap-1.5">
                      <FaCarSide /> {job.vehicle.label}
                    </span>
                  )}
                  {job.bookingForSomeoneElse && job.recipientName && (
                    <span className="flex items-center gap-1.5">
                      <FaUserFriends /> Served {job.recipientName}
                    </span>
                  )}
                  <span className="ml-auto">{formatDateTime(job.review.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MechanicReviews;