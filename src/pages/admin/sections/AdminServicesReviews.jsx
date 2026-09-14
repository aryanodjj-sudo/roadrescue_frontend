import { useState, useEffect, useCallback } from "react";
import { FaStar, FaConciergeBell, FaComments } from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import { servicesData } from "../../../data/servicesData";
import { formatDate } from "../../../utils/formatDate";
import api from "../../../utils/api";

function AdminServicesReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/reviews");
      setReviews(data.reviews);
    } catch (err) {
      setError(err.message || "Couldn't load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Services & Reviews</h1>
      <p className="text-slate-500 text-sm mb-6">
        Live service catalog and real customer reviews from completed jobs.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaConciergeBell} label="Active Services" value={servicesData.length} tone="primary" />
        <StatCard icon={FaComments} label="Total Reviews" value={reviews.length} tone="primary" />
        <StatCard icon={FaStar} label="Average Rating" value={avgRating} tone="amber" />
        <StatCard icon={FaStar} label="5-Star Reviews" value={fiveStarCount} tone="green" />
      </div>

      <h2 className="font-semibold text-slate-900 mb-3">Service Catalog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {servicesData.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <s.icon className="text-lg" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
            <p className="text-sm text-slate-500">{s.description}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-900">Customer Reviews</h2>
        {reviews.length > 0 && (
          <span className="text-sm text-slate-500 flex items-center gap-1.5">
            <FaStar className="text-amber-500" /> {avgRating} average
          </span>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-dashed border-red-200 p-14 text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={loadReviews} className="text-sm font-semibold text-primary-600 hover:underline">
            Try Again
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">No reviews yet — they'll show up here once customers rate a completed service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-slate-900">{r.mechanic?.user?.name || "Mechanic"}</p>
                <span className="flex items-center gap-1 text-amber-500 text-sm">
                  <FaStar /> {r.rating}/5
                </span>
              </div>
              <p className="text-xs font-medium text-primary-600 mb-2">
                {servicesData.find((s) => s.id === r.serviceRequest?.serviceType)?.title ||
                  r.serviceRequest?.serviceType ||
                  "Service"}
              </p>
              <p className="text-sm text-slate-500 mb-1">
                {r.comment ? `"${r.comment}"` : <span className="italic text-slate-400">No comment left</span>}
              </p>
              <p className="text-xs text-slate-400">
                {r.user?.name || "Customer"} · {formatDate(r.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminServicesReviews;