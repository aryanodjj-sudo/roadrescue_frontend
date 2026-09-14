import { FaBolt, FaClipboardList, FaCarSide, FaTimes } from "react-icons/fa";
import Button from "../../../components/common/Button";
import RecipientLocationBadge from "../../../components/service/RecipientLocationBadge";
import { formatDateTime } from "../../../utils/formatDate";

function MechanicIncomingRequests({
  profile,
  incoming,
  activeJob,
  onAccept,
  onDismiss,
  onToggleOnline,
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Incoming Requests</h1>
        <p className="text-slate-500 mt-1">
          New service requests from nearby customers.
        </p>
      </div>

      {!profile.isOnline ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaBolt className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            You're offline
          </h3>
          <p className="text-slate-500 text-sm mb-5">
            Go online to start seeing incoming service requests.
          </p>
          <Button
            variant="primary"
            onClick={onToggleOnline}
            className="mx-auto"
            disabled={profile.verification?.status !== "Approved"}
          >
            Go Online
          </Button>
        </div>
      ) : incoming.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaClipboardList className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            No incoming requests right now
          </h3>
          <p className="text-slate-500 text-sm">
            New requests from nearby customers will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {incoming.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  {req.serviceTitle}
                </h3>
                <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium">
                  {req.status}
                </span>
              </div>
              {req.vehicle && (
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <FaCarSide /> {req.vehicle.label} · {req.vehicle.plateNumber}
                </p>
              )}

              <RecipientLocationBadge request={req} />

              {req.description && (
                <p className="text-sm text-slate-500">"{req.description}"</p>
              )}
              <p className="text-xs text-slate-400">
                Requested {formatDateTime(req.createdAt)}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1 justify-center"
                  onClick={() => onAccept(req.id)}
                  disabled={!!activeJob}
                >
                  Accept
                </Button>
                <Button variant="outline" onClick={() => onDismiss(req.id)}>
                  <FaTimes className="text-sm" />
                </Button>
              </div>
              {activeJob && (
                <p className="text-xs text-amber-600">
                  Finish your active job before accepting a new one.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MechanicIncomingRequests;