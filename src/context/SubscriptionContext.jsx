import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "user") {
      setSubscription(null);
      return;
    }
    try {
      const { data } = await api.get("/subscriptions/me");
      setSubscription(data.subscription);
    } catch {
      setSubscription(null);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    setLoading(true);
    const tasks = [refresh()];
    if (isAuthenticated && user?.role === "user") {
      tasks.push(
        api
          .get("/subscriptions/plans")
          .then(({ data }) => setPlans(data.plans))
          .catch(() => setPlans(null))
      );
    }
    Promise.all(tasks).finally(() => setLoading(false));
  }, [user, isAuthenticated, refresh]);

  const subscribeToPlan = async (plan) => {
    const { data } = await api.post("/subscriptions/subscribe", { plan });
    setSubscription(data.subscription);
    return data.subscription;
  };

  const cancelMySubscription = async () => {
    const { data } = await api.put("/subscriptions/cancel");
    setSubscription(data.subscription);
    return data.subscription;
  };

  const isActive = !!subscription?.isActive;

  const value = { subscription, plans, loading, isActive, refresh, subscribeToPlan, cancelMySubscription };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}