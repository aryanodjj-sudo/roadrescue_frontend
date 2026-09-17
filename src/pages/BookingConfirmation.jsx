import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaTools,
  FaExclamationCircle,
  FaUserFriends,
  FaCrown,
  FaTag,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { servicesData, calculateFuelBill, TYRE_POSITIONS, TYRE_PROBLEMS } from "../data/servicesData";
import { useServiceRequests } from "../context/ServiceRequestContext";
import { useSubscription } from "../context/SubscriptionContext";
import api from "../utils/api";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createRequest } = useServiceRequests();
  const { isActive: hasActiveSubscription, subscription } = useSubscription();
  const {
    mechanic,
    serviceType,
    vehicle,
    description,
    customerLocation,
    bookingForSomeoneElse,
    recipient,
    address,
    serviceDetails,
  } = location.state || {};

  const service = servicesData.find((s) => s.id === serviceType);
  const isFuel = serviceType === "fuel" && !!serviceDetails;
  const isTyre = serviceType === "tyre" && !!serviceDetails;
  const fuelBill = isFuel ? calculateFuelBill(serviceDetails.fuelType, serviceDetails.litres) : null;
  const tyrePositionLabels = isTyre
  ? (serviceDetails.tyrePositions || [])
      .map((id) => TYRE_POSITIONS[serviceDetails.tyreVehicleType]?.find((p) => p.id === id)?.label)
      .filter(Boolean)
      .join(", ")
  : null;
const tyreProblemLabels = isTyre
  ? (serviceDetails.tyreProblems || [])
      .map((id) => TYRE_PROBLEMS.find((p) => p.id === id)?.label)
      .filter(Boolean)
      .join(", ")
  : null;
  const [status, setStatus] = useState(mechanic ? "review" : "missing");
  const [error, setError] = useState("");
  const [createdRequest, setCreatedRequest] = useState(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

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

  const originalPrice = isFuel ? fuelBill.total : mechanic.pricePerVisit || 0;
  const discountAmount = hasActiveSubscription ? originalPrice : appliedCoupon?.discountAmount || 0;
  const finalPrice = hasActiveSubscription ? 0 : appliedCoupon?.finalAmount ?? originalPrice;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponInput.trim(),
        orderValue: originalPrice,
      });
      setAppliedCoupon({ code: data.coupon.code, discountAmount: data.discountAmount, finalAmount: data.finalAmount });
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || "Invalid coupon code");
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleConfirm = async () => {
    setStatus("creating");
    setError("");
    try {
      const req = await createRequest({
        vehicle,
        serviceType,
        description,
        mechanic,
        customerLocation,
        bookingForSomeoneElse,
        recipient,
        address,
        serviceDetails,
        couponCode: !hasActiveSubscription ? appliedCoupon?.code : undefined,
      });
      setCreatedRequest(req);
      setStatus("done");
    } catch (err) {
      setError(err.message || "Could not create the request. Please try again.");
      setStatus("error");
    }
  };

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
          <Button variant="primary" onClick={() => setStatus("review")}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "done") {
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
            {bookingForSomeoneElse ? (
              <div className="flex items-start gap-3 text-sm border-t border-slate-200 pt-3">
                <FaUserFriends className="text-primary-600 mt-0.5" />
                <div>
                  <p className="text-slate-700 font-medium">For {recipient?.name} ({recipient?.phone})</p>
                  <p className="text-slate-500">
                    {address?.line}
                    {address?.landmark ? `, near ${address.landmark}` : ""}
                    {address?.city ? `, ${address.city}` : ""}
                    {address?.pincode ? ` - ${address.pincode}` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkerAlt className="text-primary-600" />
                <span className="text-slate-700">{mechanic.name} · {mechanic.distanceKm} km away</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="text-primary-600" />
              <span className="text-slate-700">Estimated arrival: {mechanic.etaMinutes} min</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Amount charged</span>
              <span className="font-bold text-slate-900">
                {createdRequest?.viaSubscription ? "FREE (Subscription)" : `₹${createdRequest?.mechanic?.pricePerVisit ?? finalPrice}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">Back to Dashboard</Button>
            </Link>
            {createdRequest?.id && (
              <Link to={`/dashboard/track/${createdRequest.id}`}>
                <Button variant="primary" className="w-full sm:w-auto">Track This Request</Button>
              </Link>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // status === "review"
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Review Your Request</h1>
        <p className="text-slate-500 text-sm">Confirm the details before sending it to the mechanic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Job Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <FaTools className="text-primary-600" />
                <span className="text-slate-700 font-medium">{service?.title || "Service"}</span>
              </div>
              {vehicle && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-700">🚗 {vehicle.make} {vehicle.model} · {vehicle.plateNumber}</span>
                </div>
              )}
              {bookingForSomeoneElse ? (
                <div className="flex items-start gap-3 text-sm border-t border-slate-100 pt-4">
                  <FaUserFriends className="text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-slate-700 font-medium">For {recipient?.name} ({recipient?.phone})</p>
                    <p className="text-slate-500">
                      {address?.line}
                      {address?.landmark ? `, near ${address.landmark}` : ""}
                      {address?.city ? `, ${address.city}` : ""}
                      {address?.pincode ? ` - ${address.pincode}` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm">
                  <FaMapMarkerAlt className="text-primary-600" />
                  <span className="text-slate-700">{mechanic.name} · {mechanic.distanceKm} km away</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <FaClock className="text-primary-600" />
                <span className="text-slate-700">Estimated arrival: {mechanic.etaMinutes} min</span>
              </div>
              {isFuel && (
                <div className="text-sm border-t border-slate-100 pt-4">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5">
                    Fuel Order
                  </p>
                  <p className="text-slate-700 capitalize">
                    {serviceDetails.litres}L {serviceDetails.fuelType}
                  </p>
                </div>
              )}
              {isTyre && (
                <div className="text-sm border-t border-slate-100 pt-4">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5">
                    Tyre Details
                  </p>
                  <p className="text-slate-700">
  {serviceDetails.tyreVehicleType === "car" ? "Car" : "Bike"} · {tyrePositionLabels} tyre
  {(serviceDetails.tyrePositions?.length || 0) > 1 ? "s" : ""} · {tyreProblemLabels}
</p>
                </div>
              )}
              {description && (
                <div className="text-sm border-t border-slate-100 pt-4">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1.5">
                    Problem description
                  </p>
                  <p className="text-slate-600">{description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Mechanic</h3>
            <div className="flex items-center gap-4">
              <img
                src={mechanic.image || `https://i.pravatar.cc/150?u=${mechanic.id}`}
                alt={mechanic.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{mechanic.name}</p>
                <p className="text-sm text-slate-500">
                  {mechanic.distanceKm} km away · ETA {mechanic.etaMinutes} min
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Price Details</h3>

            {hasActiveSubscription ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-4 flex items-center gap-3">
                <FaCrown className="text-amber-300 text-xl shrink-0" />
                <div>
                  <p className="font-semibold">Covered by your {subscription?.plan} subscription</p>
                  <p className="text-primary-50 text-sm">This service is free — no charge will apply.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Have a coupon code?"
                      disabled={!!appliedCoupon}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50"
                    />
                  </div>
                  {appliedCoupon ? (
                    <Button variant="outline" onClick={removeCoupon}>Remove</Button>
                  ) : (
                    <Button variant="outline" disabled={isCheckingCoupon || !couponInput.trim()} onClick={handleApplyCoupon}>
                      {isCheckingCoupon ? "Checking..." : "Apply"}
                    </Button>
                  )}
                </div>
                {couponError && <p className="text-red-500 text-xs mb-3">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-green-600 text-xs font-medium mb-3">
                    "{appliedCoupon.code}" applied — you saved ₹{appliedCoupon.discountAmount}!
                  </p>
                )}
              </>
            )}

            <div className="space-y-2 text-sm border-t border-slate-100 pt-4 mt-4">
  {isFuel ? (
    <>
      <div className="flex justify-between text-slate-500">
        <span className="capitalize">
          {serviceDetails.fuelType} ({serviceDetails.litres}L × ₹{fuelBill.rate})
        </span>
        <span>₹{fuelBill.fuelCost}</span>
      </div>

      <div className="flex justify-between text-slate-500">
        <span>Delivery charge</span>
        <span
          className={
            fuelBill.deliveryCharge === 0
              ? "text-green-600 font-medium"
              : ""
          }
        >
          {fuelBill.deliveryCharge === 0
            ? "FREE"
            : `₹${fuelBill.deliveryCharge}`}
        </span>
      </div>
    </>
  ) : (
    <div className="flex justify-between text-slate-500">
      <span>Service charge</span>
      <span>₹{originalPrice}</span>
    </div>
  )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {hasActiveSubscription ? "(Subscription)" : appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>{finalPrice === 0 ? "FREE" : `₹${finalPrice}`}</span>
              </div>
            </div>
          </div>

          <Button variant="primary" className="w-full justify-center py-3" onClick={handleConfirm}>
            Confirm Request
          </Button>

          <p className="text-xs text-slate-400 text-center">
            You'll be notified the moment {mechanic.name} accepts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BookingConfirmation;