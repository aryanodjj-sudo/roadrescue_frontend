import { FaCheckCircle, FaStar } from "react-icons/fa";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDateTime } from "../../../utils/formatDate";

function MechanicCompletedJobs({ completedJobs }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Completed Jobs</h1>
        <p className="text-slate-500 mt-1">
          Every job you've finished, most recent first.
        </p>
      </div>

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
    </div>
  );
}

export default MechanicCompletedJobs;