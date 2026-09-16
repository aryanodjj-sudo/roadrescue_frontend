import {
  FaWrench,
  FaCarSide,
  FaClipboardList,
  FaClock,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";
import Button from "../../../components/common/Button";
import LiveTrackingMap from "../../../components/map/LiveTrackingMap";
import RecipientLocationBadge from "../../../components/service/RecipientLocationBadge";
import ServiceDetailsBadge from "../../../components/service/ServiceDetailsBadge";
import { formatDateTime } from "../../../utils/formatDate";

function MechanicActiveJob({
  activeJob,
  ownLocation,
  navigateUrl,
  nextStatus,
  onAdvanceStatus,
  onCancel,
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Active Job</h1>
        <p className="text-slate-500 mt-1">
          Track and update the job you're currently working on.
        </p>
      </div>

      {!activeJob ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaWrench className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">
            No active job
          </h3>
          <p className="text-slate-500 text-sm">
            Accept a request from Incoming Requests to start a job.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {activeJob.serviceTitle}
            </h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {activeJob.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600 mb-4">
            {activeJob.vehicle && (
              <p className="flex items-center gap-2">
                <FaCarSide className="text-accent-600" />
                {activeJob.vehicle.label} · {activeJob.vehicle.plateNumber}
              </p>
            )}
            {activeJob.description && (
              <p className="flex items-start gap-2">
                <FaClipboardList className="text-accent-600 mt-0.5" />
                {activeJob.description}
              </p>
            )}
            <p className="flex items-center gap-2">
              <FaClock className="text-accent-600" />
              Requested {formatDateTime(activeJob.createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-accent-600" />
              {activeJob.customerLocation
                ? "Customer location shared"
                : "Customer did not share a precise location"}
            </p>
          </div>

          <div className="mb-5">
            <RecipientLocationBadge request={activeJob} />
            <ServiceDetailsBadge request={activeJob} />
          </div>

          {activeJob.customerLocation && (
            <div className="mb-5">
              <LiveTrackingMap
                customerLocation={activeJob.customerLocation}
                mechanicLocation={ownLocation}
                showRoute
                heightClassName="h-56"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {navigateUrl && (
              <a href={navigateUrl} target="_blank" rel="noreferrer">
                <Button variant="outline">
                  <FaDirections className="text-sm" /> Navigate
                </Button>
              </a>
            )}
            {nextStatus && (
              <Button
                variant="primary"
                onClick={() => onAdvanceStatus(activeJob.id, nextStatus)}
              >
                Mark as "{nextStatus}"
              </Button>
            )}
            <Button variant="outline" onClick={() => onCancel(activeJob.id)}>
              Cancel Job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MechanicActiveJob;