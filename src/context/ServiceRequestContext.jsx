import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import { servicesData } from "../data/servicesData";

const ServiceRequestContext = createContext();

export const REQUEST_STATUSES = [
  "Pending",
  "Accepted",
  "On The Way",
  "Arrived",
  "In Progress",
  "Completed",
  "Cancelled",
];

function normalizeRequest(r) {
  const service = servicesData.find((s) => s.id === r.serviceType);
  return {
    id: r._id,
    userId: r.user?._id || r.user,
    customerName: r.user?.name || "Customer",
    customerPhone: r.user?.phone || "",
    vehicle: r.vehicle
      ? { id: r.vehicle._id, label: `${r.vehicle.make} ${r.vehicle.model}`, plateNumber: r.vehicle.plateNumber }
      : null,
    serviceType: r.serviceType,
    serviceTitle: service?.title || r.serviceType,
    description: r.description || "",
    mechanic: r.mechanic
      ? {
          id: r.mechanic._id,
          name: r.mechanic.user?.name || "Mechanic",
          image: `https://i.pravatar.cc/150?u=${r.mechanic._id}`,
          rating: r.mechanic.rating,
          pricePerVisit: r.pricePerVisit,
        }
      : null,
    mechanicId: r.acceptedBy || null,
    customerLocation: r.customerLocation || null,
    bookingForSomeoneElse: !!r.bookingForSomeoneElse,
    recipientName: r.recipientName || null,
    recipientPhone: r.recipientPhone || null,
    manualAddress: r.manualAddress || null,
    originalPrice: r.originalPrice ?? r.pricePerVisit,
    discountAmount: r.discountAmount || 0,
    couponCode: r.couponCode || null,
    viaSubscription: !!r.viaSubscription,
    status: r.status,
    statusHistory: r.statusHistory || [],
    review: r.review || null,
    createdAt: r.createdAt,
    completedAt: r.completedAt,
  };
}

export function ServiceRequestProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshRequests = useCallback(async () => {
    if (!isAuthenticated) {
      setRequests([]);
      return;
    }
    try {
      const { data } = await api.get("/service-requests");
      setRequests(data.requests.map(normalizeRequest));
    } catch {
      setRequests([]);
    }
  }, [isAuthenticated]);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const { data } = await api.get("/notifications");
      setNotifications(
        data.notifications.map((n) => ({ id: n._id, message: n.message, createdAt: n.createdAt, read: n.read }))
      );
    } catch {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    Promise.all([refreshRequests(), refreshNotifications()]).finally(() => setLoading(false));
  }, [user, refreshRequests, refreshNotifications]);

  const createRequest = async ({
    vehicle,
    serviceType,
    description,
    mechanic,
    customerLocation,
    bookingForSomeoneElse,
    recipient,
    address,
    couponCode,
  }) => {
    const { data } = await api.post("/service-requests", {
      vehicleId: vehicle.id,
      serviceType,
      description,
      mechanicId: mechanic.id,
      customerLocation,
      bookingForSomeoneElse: !!bookingForSomeoneElse,
      recipientName: bookingForSomeoneElse ? recipient?.name : undefined,
      recipientPhone: bookingForSomeoneElse ? recipient?.phone : undefined,
      manualAddress: bookingForSomeoneElse ? address : undefined,
      couponCode: couponCode || undefined,
    });
    await Promise.all([refreshRequests(), refreshNotifications()]);
    return normalizeRequest(data.request);
  };

  const cancelRequest = async (requestId) => {
    await api.put(`/service-requests/${requestId}/cancel`);
    await refreshRequests();
  };

  const acceptRequest = async (requestId) => {
    await api.put(`/service-requests/${requestId}/accept`);
    await Promise.all([refreshRequests(), refreshNotifications()]);
  };

  const advanceStatus = async (requestId, newStatus) => {
    await api.put(`/service-requests/${requestId}/status`, { status: newStatus });
    await Promise.all([refreshRequests(), refreshNotifications()]);
  };

  const dismissRequest = async (requestId) => {
    await api.put(`/service-requests/${requestId}/cancel`);
    await refreshRequests();
  };

  const addReview = async (requestId, { rating, comment }) => {
    await api.post("/reviews", { serviceRequestId: requestId, rating, comment });
    await refreshRequests();
  };

  const markNotificationsRead = async () => {
    await api.put("/notifications/read-all");
    await refreshNotifications();
  };

  const getRequestById = (id) => requests.find((r) => r.id === id);
  const getAllRequests = () => requests;
  const getIncomingRequests = () => requests.filter((r) => r.status === "Pending");
  const getActiveJobForMechanic = () =>
    requests.find((r) => !["Pending", "Completed", "Cancelled"].includes(r.status)) || null;
  const getCompletedJobsForMechanic = () => requests.filter((r) => r.status === "Completed");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    requests,
    notifications,
    unreadCount,
    loading,
    createRequest,
    advanceStatus,
    cancelRequest,
    acceptRequest,
    dismissRequest,
    addReview,
    markNotificationsRead,
    getRequestById,
    getAllRequests,
    getIncomingRequests,
    getActiveJobForMechanic,
    getCompletedJobsForMechanic,
  };

  return <ServiceRequestContext.Provider value={value}>{children}</ServiceRequestContext.Provider>;
}

export function useServiceRequests() {
  const context = useContext(ServiceRequestContext);
  if (!context) {
    throw new Error("useServiceRequests must be used within a ServiceRequestProvider");
  }
  return context;
}