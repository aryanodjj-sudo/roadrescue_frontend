import { FaUserFriends, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

// Shown wherever a service request is displayed, so both the requester and
// the mechanic clearly see this job is for someone else, and exactly
// who/where to go.
function RecipientLocationBadge({ request }) {
  if (!request?.bookingForSomeoneElse) return null;

  const addr = request.manualAddress || {};
  const addressLine = [addr.line, addr.landmark, addr.city, addr.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm space-y-1.5">
      <p className="flex items-center gap-2 font-semibold text-amber-700">
        <FaUserFriends /> Booked for someone else
      </p>
      {request.recipientName && <p className="text-slate-700">{request.recipientName}</p>}
      {request.recipientPhone && (
        <p className="flex items-center gap-2 text-slate-600">
          <FaPhone className="text-xs" /> {request.recipientPhone}
        </p>
      )}
      {addressLine && (
        <p className="flex items-start gap-2 text-slate-600">
          <FaMapMarkerAlt className="text-xs mt-0.5 shrink-0" /> {addressLine}
        </p>
      )}
    </div>
  );
}

export default RecipientLocationBadge;