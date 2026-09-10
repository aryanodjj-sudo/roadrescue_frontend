import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { FaFileInvoice, FaPrint } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { useServiceRequests } from "../context/ServiceRequestContext";
import api from "../utils/api";

function Invoice() {
  const { id } = useParams();
  const { getRequestById } = useServiceRequests();
  const request = getRequestById(id);

  // FIXED: previously computed a fake "platform fee" locally instead of
  // reading the real Payment record the backend already creates when a
  // request is marked Completed (POST happens server-side, see
  // serviceRequestController.js). Now fetches GET /api/payments/:id so
  // the numbers shown always match what's actually stored in the DB.
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayment = useCallback(async () => {
    if (!request) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/payments/${request.id}`);
      setPayment(data.payment);
    } catch (err) {
      setError(err.message || "Couldn't load invoice details.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  if (!request || request.status !== "Completed") {
    return <Navigate to="/dashboard/history" replace />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 p-8 print:border-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaFileInvoice className="text-primary-600 text-xl" />
            <h1 className="text-xl font-bold text-slate-900">Invoice</h1>
          </div>
          <Button variant="outline" onClick={() => window.print()} disabled={!payment}>
            <FaPrint className="text-sm" /> Print
          </Button>
        </div>

        <div className="text-sm text-slate-500 mb-6">
          <p>Request ID: {request.id}</p>
          <p>Date: {new Date(request.completedAt).toLocaleString()}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button onClick={loadPayment} className="text-sm font-semibold text-primary-600 hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="border-t border-b border-slate-100 py-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-900">{request.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mechanic</span>
                <span className="font-medium text-slate-900">{request.mechanic.name}</span>
              </div>
              {request.vehicle && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle</span>
                  <span className="font-medium text-slate-900">
                    {request.vehicle.label} ({request.vehicle.plateNumber})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Service charge</span>
                <span>₹{payment.serviceCharge}</span>
              </div>
              {payment.additionalCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Additional charges</span>
                  <span>₹{payment.additionalCharges}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>₹{payment.total}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 pt-1">
                <span>Payment status</span>
                <span className="capitalize">{payment.status}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              No real payment gateway is integrated yet — this reflects the
              service charge recorded when the job was completed, not an
              actual online transaction.
            </p>
          </>
        )}

        <Link
          to="/dashboard/history"
          className="inline-block mt-6 text-sm font-semibold text-primary-600"
        >
          ← Back to History
        </Link>
      </div>
    </DashboardLayout>
  );
}

export default Invoice;