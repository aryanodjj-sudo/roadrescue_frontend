import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaMapMarkerAlt, FaClock, FaTools, FaExclamationCircle } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { servicesData } from "../data/servicesData";
import { useServiceRequests } from "../context/ServiceRequestContext";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createRequest } = useServiceRequests();
  const { mechanic, serviceType, vehicle, description, customerLocation } = location.state || {};

  const service = servicesData.find((s) => s.id === serviceType);
  const createdRequestRef = useRef(null);
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState(mechanic ? "creating" : "missing");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mechanic || hasStartedRef.current) return;
    hasStartedRef.current = true;

    createRequest({ vehicle, serviceType, description, mechanic, customerLocation })
      .then((req) => {
        createdRequestRef.current = req;
        setStatus("done");
      })
      .catch((err) => {
        setError(err.message || "Could not create the request. Please try again.");
        setStatus("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mechanic) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaTools className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">No request in progress</h3>
          <p className="text-slate-500 text-sm mb-5">
            Select a service and a mechanic first to see a confirmation here.
          </p>
          <Button variant="primary" onClick={() => navigate("/dashboard/services")}>
            Get Assistance
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "creating") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (status === "error") {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl border border-dashed border-red-200 p-14 text-center max-w-lg mx-auto">
          <FaExclamationCircle className="text-4xl text-red-400 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">Could not send this request</h3>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <Button variant="primary" onClick={() => navigate("/dashboard/find-mechanic")}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const requestId = createdRequestRef.current?.id;

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto text-center bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-5">
          <FaCheckCircle className="text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Request sent!</h1>
        <p className="text-slate-500 mb-8">
          {mechanic.name} has been notified. Track live status from your service history.
        </p>

        <div className="text-left bg-slate-50 rounded-xl p-5 space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm">
            <FaTools className="text-primary-600" />
            <span className="text-slate-700 font-medium">{service?.title || "Service"}</span>
          </div>
          {vehicle && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-700">🚗 {vehicle.make} {vehicle.model} · {vehicle.plateNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <FaMapMarkerAlt className="text-primary-600" />
            <span className="text-slate-700">{mechanic.name} · {mechanic.distanceKm} km away</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FaClock className="text-primary-600" />
            <span className="text-slate-700">Estimated arrival: {mechanic.etaMinutes} min</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">Back to Dashboard</Button>
          </Link>
          {requestId && (
            <Link to={`/dashboard/track/${requestId}`}>
              <Button variant="primary" className="w-full sm:w-auto">Track This Request</Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BookingConfirmation;