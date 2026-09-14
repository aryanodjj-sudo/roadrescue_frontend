import { FaMoneyBillWave, FaCalendarDay, FaCalendarWeek, FaChartLine } from "react-icons/fa";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDateTime } from "../../../utils/formatDate";

function MechanicEarnings({ completedJobs, todayEarnings, weekEarnings, totalEarnings }) {
  const averagePerJob = completedJobs.length
    ? Math.round(totalEarnings / completedJobs.length)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>
        <p className="text-slate-500 mt-1">
          A breakdown of what you've earned on RoadRescue.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaCalendarDay className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{formatPrice(todayEarnings)}</p>
          <p className="text-xs text-slate-500">Today</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaCalendarWeek className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{formatPrice(weekEarnings)}</p>
          <p className="text-xs text-slate-500">This Week</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaMoneyBillWave className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{formatPrice(totalEarnings)}</p>
          <p className="text-xs text-slate-500">All Time</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaChartLine className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{formatPrice(averagePerJob)}</p>
          <p className="text-xs text-slate-500">Avg / Job</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Payout History</h2>
        {completedJobs.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            Completed jobs will show up here with their payout amount.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedJobs.map((job) => (
              <div
                key={job.id}
                className="py-3.5 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{job.serviceTitle}</p>
                  <p className="text-xs text-slate-400">
                    {formatDateTime(job.completedAt)}
                  </p>
                </div>
                <p className="font-semibold text-green-600">
                  + {formatPrice(job.mechanic.pricePerVisit)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4">
        No real payout/bank-transfer integration exists yet — these figures
        reflect completed jobs' recorded price per visit, not an actual
        settled transfer.
      </p>
    </div>
  );
}

export default MechanicEarnings;