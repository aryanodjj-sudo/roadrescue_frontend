import {
  FaClipboardList,
  FaWrench,
  FaMoneyBillWave,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCog,
  FaArrowRight,
  FaBullseye,
} from "react-icons/fa";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDateTime } from "../../../utils/formatDate";

const QUICK_ACTIONS = [
  { id: "incoming", label: "Incoming Requests", icon: FaClipboardList },
  { id: "active", label: "Active Job", icon: FaWrench },
  { id: "completed", label: "Completed Jobs", icon: FaCheckCircle },
  { id: "complaints", label: "Complaints & Disputes", icon: FaExclamationTriangle },
  { id: "profile", label: "Profile & Availability", icon: FaUserCog },
];

function MechanicOverview({
  profile,
  user,
  incoming,
  activeJob,
  completedJobs,
  totalEarnings,
  todayEarnings,
  weekEarnings,
  avgRating,
  reviewedJobs,
  statusError,
  onNavigate,
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user?.name} 🔧
        </h1>
        <p className="text-slate-500 mt-1">
          {profile.isOnline
            ? "You're online and visible for new requests."
            : "You're offline. Go online to start receiving requests."}
        </p>
        {statusError && (
          <p className="text-red-600 text-sm mt-2">{statusError}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaClipboardList className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{incoming.length}</p>
          <p className="text-xs text-slate-500">Incoming</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaWrench className="text-accent-600 mb-2" />
          <p className="text-xl font-bold text-slate-900">{activeJob ? 1 : 0}</p>
          <p className="text-xs text-slate-500">Active Job</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <FaMoneyBillWave className="text-accent-600 mb-2" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="group text-left bg-white rounded-2xl border border-slate-100 p-5 hover:border-accent-200 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-accent-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                    <action.icon />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {action.label}
                  </p>
                  {action.id === "incoming" && incoming.length > 0 && (
                    <p className="text-xs text-accent-600 font-medium mt-1">
                      {incoming.length} waiting
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 mb-4">Earnings</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Today</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatPrice(todayEarnings)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">This Week</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatPrice(weekEarnings)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">All Time</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatPrice(totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Jobs</h2>
              <button
                onClick={() => onNavigate("completed")}
                className="text-sm font-semibold text-accent-600 flex items-center gap-1"
              >
                View all <FaArrowRight className="text-xs" />
              </button>
            </div>
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm">
                  Completed jobs will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl border border-slate-100 px-5 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {job.serviceTitle}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(job.completedAt)}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatPrice(job.mechanic.pricePerVisit)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Your Rating</h2>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {avgRating}
              </span>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    className={
                      n <= Math.round(Number(avgRating) || 0)
                        ? "opacity-100"
                        : "opacity-20"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500">
              From {reviewedJobs.length} review
              {reviewedJobs.length === 1 ? "" : "s"}
            </p>
            <button
              onClick={() => onNavigate("reviews")}
              className="text-sm font-semibold text-accent-600 flex items-center gap-1 mt-4"
            >
              View all reviews <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <FaBullseye className="text-accent-400 text-2xl mb-3" />
            <h3 className="font-semibold mb-2">Boost Your Ranking</h3>
            <p className="text-sm text-slate-300 mb-4">
              Mechanics who stay online during peak hours and respond
              within 2 minutes appear higher in nearby search results.
            </p>
            <button
              onClick={() => onNavigate("profile")}
              className="text-sm font-semibold text-accent-400 flex items-center gap-1"
            >
              Update availability <FaArrowRight className="text-xs" />
            </button>
          </div>

          {profile.verification?.status !== "Approved" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <FaExclamationTriangle className="text-amber-500 text-xl mb-3" />
              <h3 className="font-semibold text-amber-800 mb-2">
                Verification {profile.verification?.status || "Pending"}
              </h3>
              <p className="text-sm text-amber-700">
                Complete your profile details to speed up approval and
                start receiving requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MechanicOverview;