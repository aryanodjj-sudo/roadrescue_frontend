import { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { formatRelativeTime } from "../utils/formatDate";

function Notifications() {
  const { notifications, markNotificationsRead, loading } =
    useServiceRequests();

  // Only mark notifications read once the provider has actually finished
  // loading — otherwise this could fire against a stale/empty list on a
  // fast remount before refreshNotifications() resolves.
  useEffect(() => {
    if (!loading) {
      markNotificationsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">
          Updates about your service requests.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaBell className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            No notifications yet
          </h3>
          <p className="text-slate-500 text-sm">
            You'll see updates here as your requests progress.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border border-slate-100 px-5 py-4 flex items-start gap-3"
            >
              <FaBell className="text-primary-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-800">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notifications;