import { FaStar } from "react-icons/fa";
import { servicesData } from "../../../data/servicesData";
import { mockReviews } from "../../../data/adminMockData";

function AdminServicesReviews() {
  const avgRating = (
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
  ).toFixed(1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Services & Reviews</h1>
      <p className="text-slate-500 text-sm mb-6">
        Service catalog is read from the live app data; reviews below are{" "}
        <span className="font-medium text-amber-600">mock</span>.
      </p>

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
        <span className="text-sm text-slate-500 flex items-center gap-1.5">
          <FaStar className="text-amber-500" /> {avgRating} average
        </span>
      </div>
      <div className="space-y-3">
        {mockReviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-slate-900">{r.mechanicName}</p>
              <span className="flex items-center gap-1 text-amber-500 text-sm">
                <FaStar /> {r.rating}/5
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">"{r.comment}"</p>
            <p className="text-xs text-slate-400">
              {r.customerName} · {r.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminServicesReviews;