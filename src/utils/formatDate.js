// All functions guard against null/invalid input by returning "—" instead
// of throwing or rendering "Invalid Date" — several list pages (Service
// History, Notifications, Vehicle Details) render these directly against
// fields that can be null (e.g. completedAt before a job finishes).

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "6 Sept 2026" — matches AdminUsers.jsx / AdminVerification.jsx /
// VehicleDetails.jsx's current toLocaleDateString() calls, just
// consistent across all of them (some were en-US, some default locale).
export function formatDate(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "6 Sept 2026, 4:35 PM" — matches ServiceHistory.jsx / Invoice.jsx /
// Notifications.jsx / MechanicDashboard.jsx's current toLocaleString()
// calls, standardized to one consistent format.
export function formatDateTime(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// "3 minutes ago" / "2 hours ago" / "5 days ago" — not currently used
// anywhere, but Notifications.jsx and the mechanic's incoming-requests
// list are natural fits for this instead of a full date/time stamp.
export function formatRelativeTime(value) {
  const d = toDate(value);
  if (!d) return "—";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return formatDate(value);
}