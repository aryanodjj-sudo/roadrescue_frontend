import { Link } from "react-router-dom";
import { FaHistory, FaMapMarkerAlt, FaFileInvoice } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useServiceRequests } from "../context/ServiceRequestContext";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-blue-50 text-blue-600",
  "On The Way": "bg-blue-50 text-blue-600",
  Arrived: "bg-indigo-50 text-indigo-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

function ServiceHistory() {
  const { requests } = useServiceRequests();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Service History</h1>
        <p className="text-slate-500 mt-1">
          A record of all your past and ongoing roadside assistance requests.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaHistory className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            No service requests yet
          </h3>
          <p className="text-slate-500 text-sm">
            Once you request roadside assistance, it will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={req.mechanic.image}
                  alt={req.mechanic.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {req.serviceTitle}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" /> {req.mechanic.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[req.status]}`}
                >
                  {req.status}
                </span>
                {req.status === "Completed" ? (
                  <Link
                    to={`/dashboard/invoice/${req.id}`}
                    className="text-sm font-semibold text-primary-600 flex items-center gap-1"
                  >
                    <FaFileInvoice /> Invoice
                  </Link>
                ) : req.status !== "Cancelled" ? (
                  <Link
                    to={`/dashboard/track/${req.id}`}
                    className="text-sm font-semibold text-primary-600"
                  >
                    Track
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ServiceHistory;