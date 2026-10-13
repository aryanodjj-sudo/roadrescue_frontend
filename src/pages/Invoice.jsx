import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { FaFileInvoice, FaPrint, FaCrown, FaTag, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import RecipientLocationBadge from "../components/service/RecipientLocationBadge";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

function Invoice() {
  const { id } = useParams();
  const { getRequestById } = useServiceRequests();
  const { user } = useAuth();
  const toast = useToast();
  const request = getRequestById(id);

  const [payment, setPayment] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [paying, setPaying] = useState(false);

  const loadPayment = useCallback(async () => {
    setLoadingPayment(true);
    try {
      const { data } = await api.get(`/payments/${id}`);
      setPayment(data.payment);
    } catch {
      setPayment(null);
    } finally {
      setLoadingPayment(false);
    }
  }, [id]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  if (!request || request.status !== "Completed") {
    return <Navigate to="/dashboard/history" replace />;
  }

  const originalPrice = request.originalPrice ?? request.mechanic.pricePerVisit;
  const discountAmount = request.discountAmount || 0;
  const serviceFee = request.mechanic.pricePerVisit;
  const platformFee = Math.round(serviceFee * 0.05);
  const total = serviceFee + platformFee;

  const handlePayNow = async () => {
    if (!window.Razorpay) {
      toast.error("Payment system is still loading — please try again in a moment.");
      return;
    }

    setPaying(true);
    try {
      const { data: order } = await api.post(`/payments/${id}/create-order`);

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "RoadRescue",
        description: `${request.serviceTitle} — ${request.mechanic.name}`,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            const { data } = await api.post(`/payments/${id}/verify`, response);
            setPayment(data.payment);
            toast.success("Payment successful!");
          } catch (err) {
            toast.error(err.message || "Payment verification failed. Contact support if money was deducted.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      razorpay.open();
    } catch (err) {
      toast.error(err.message || "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  const isPaid = payment?.status === "paid";

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4">
        <RecipientLocationBadge request={request} />

        <div className="bg-white rounded-2xl border border-slate-100 p-8 print:border-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaFileInvoice className="text-primary-600 text-xl" />
              <h1 className="text-xl font-bold text-slate-900">Invoice</h1>
            </div>
            <Button variant="outline" onClick={() => window.print()}>
              <FaPrint className="text-sm" /> Print
            </Button>
          </div>

          <div className="text-sm text-slate-500 mb-6">
            <p>Request ID: {request.id}</p>
            <p>Date: {new Date(request.completedAt).toLocaleString()}</p>
          </div>

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

          {request.viaSubscription ? (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-4 flex items-center gap-3 mb-6">
              <FaCrown className="text-amber-300 text-lg shrink-0" />
              <p className="text-sm">This service was fully covered by your RoadRescue subscription.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service charge</span>
                  <span>₹{originalPrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-xs" />
                      Discount {request.couponCode ? `(${request.couponCode})` : ""}
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform fee (5%)</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                  <span>{isPaid ? "Total Paid" : "Amount Due"}</span>
                  <span>₹{payment?.total ?? total}</span>
                </div>
              </div>

              {loadingPayment ? (
                <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
              ) : isPaid ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 text-green-600 font-semibold rounded-xl py-3 print:hidden">
                  <FaCheckCircle /> Paid on {new Date(payment.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full justify-center py-3 print:hidden"
                  onClick={handlePayNow}
                  disabled={paying}
                >
                  <FaCreditCard className="text-sm" />
                  {paying ? "Processing..." : `Pay ₹${total} Now`}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Invoice;