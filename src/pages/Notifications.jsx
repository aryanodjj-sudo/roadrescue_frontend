import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
  FaTruck,
  FaChevronRight,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { formatRelativeTime } from "../utils/formatDate";

// Picks an icon + colour from the notification text so the list scans
// quickly — green for completed, red for cancelled, etc.
function getNotificationStyle(message = "") {
  const text = message.toLowerCase();
  if (text.includes("cancel")) {
    return { Icon: FaTimesCircle, color: "text-red-500", bg: "bg-red-50" };
  }
  if (text.includes("completed")) {
    return { Icon: FaCheckCircle, color: "text-green-600", bg: "bg-green-50" };
  }
  if (text.includes("accepted")) {
    return { Icon: FaCheckCircle, color: "text-blue-600", bg: "bg-blue-50" };
  }
  if (
    text.includes("on the way") ||
    text.includes("arrived") ||
    text.includes("in progress")
  ) {
    return { Icon: FaTruck, color: "text-indigo-600", bg: "bg-indigo-50" };
  }
  if (text.includes("request sent") || text.includes("waiting")) {
    return { Icon: FaTools, color: "text-amber-600", bg: "bg-amber-50" };
  }
  return { Icon: FaBell, color: "text-primary-600", bg: "bg-primary-50" };
}

function Notifications() {
  const { notifications, markNotificationsRead, loading, getRequestById } =
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
          Updates about your service requests. Tap any update to see the full
          service details.
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
          {notifications.map((n) => {
            const { Icon, color, bg } = getNotificationStyle(n.message);
            const request = n.serviceRequestId
              ? getRequestById(n.serviceRequestId)
              : null;

            // Completed requests open their invoice; anything else opens the
            // live tracking / detail page. Notifications with no linked
            // request (or one that no longer exists) render as plain rows.
            const linkTo = n.serviceRequestId
              ? request?.status === "Completed"
                ? `/dashboard/invoice/${n.serviceRequestId}`
                : `/dashboard/track/${n.serviceRequestId}`
              : null;

            const content = (
              <>
                <div
                  className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}
                >
                  <Icon />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800">{n.message}</p>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="text-xs text-slate-400">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                    {request && (
                      <>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {request.serviceTitle}
                        </span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          {request.mechanic?.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {linkTo && (
                  <FaChevronRight className="text-slate-300 text-xs shrink-0 self-center" />
                )}
              </>
            );

            const baseClass =
              "bg-white rounded-xl border px-5 py-4 flex items-start gap-3 " +
              (n.read ? "border-slate-100" : "border-primary-200 bg-primary-50/30");

            return linkTo ? (
              <Link
                key={n.id}
                to={linkTo}
                className={`${baseClass} hover:border-primary-300 hover:shadow-sm transition-all block`}
              >
                {content}
              </Link>
            ) : (
              <div key={n.id} className={baseClass}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notifications;