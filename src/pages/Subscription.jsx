import { useState } from "react";
import { FaCrown, FaCheckCircle, FaTimes, FaBolt, FaWallet, FaHeadset } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { useSubscription } from "../context/SubscriptionContext";

const PLAN_META = {
  monthly: {
    icon: "🗓️",
    tagline: "Flexible, cancel anytime",
    perks: ["Unlimited free roadside assistance", "No per-visit charges for any service type", "Priority mechanic matching"],
  },
  annual: {
    icon: "🏆",
    tagline: "Best value — 2 months free vs monthly",
    perks: ["Everything in Monthly", "Locked-in price for 12 months", "Dedicated priority support"],
    badge: "Best Value",
  },
};

const BENEFITS = [
  { icon: FaBolt, title: "Zero wait on pricing", desc: "No coupon-hunting — every visit is simply free while you're subscribed." },
  { icon: FaWallet, title: "Predictable spend", desc: "One flat fee instead of surprise per-visit charges through the year." },
  { icon: FaHeadset, title: "Priority support", desc: "Subscribers get matched to nearby mechanics first, every time." },
];

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes — cancelling stops future renewals immediately, but per-visit charges apply again right away." },
  { q: "What happens if I extend an active plan?", a: "The new duration is added on top of your remaining time, so you never lose paid days." },
  { q: "Is this a real payment?", a: "This is a demo — subscribing activates instantly without a real payment gateway." },
];

function Subscription() {
  const { subscription, plans, loading, isActive, subscribeToPlan, cancelMySubscription } = useSubscription();
  const [busyPlan, setBusyPlan] = useState(null);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSubscribe = async (planKey) => {
    setError("");
    setBusyPlan(planKey);
    try {
      await subscribeToPlan(planKey);
    } catch (err) {
      setError(err.message || "Could not activate subscription. Please try again.");
    } finally {
      setBusyPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel your active subscription? Services will start charging per visit again immediately.")) return;
    setIsCancelling(true);
    setError("");
    try {
      await cancelMySubscription();
    } catch (err) {
      setError(err.message || "Could not cancel subscription.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const totalDays = subscription?.plan === "annual" ? 365 : 30;
  const percentRemaining = isActive ? Math.min(100, Math.round((subscription.daysRemaining / totalDays) * 100)) : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FaCrown className="text-amber-400" /> RoadRescue Subscription
        </h1>
        <p className="text-slate-500 mt-1">
          Subscribe once and get every roadside service free for the duration of your plan.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      {isActive ? (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaCrown className="text-amber-300 text-xl" />
              <span className="font-semibold text-lg capitalize">{subscription.plan} Plan Active</span>
            </div>
            <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full">ACTIVE</span>
          </div>

          <p className="text-primary-50 text-sm mb-4">
            All your roadside assistance requests are free while this subscription is active.
          </p>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span>{subscription.daysRemaining} day{subscription.daysRemaining === 1 ? "" : "s"} remaining</span>
            <span className="text-primary-100">Ends {new Date(subscription.endDate).toLocaleDateString()}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${percentRemaining}%` }} />
          </div>

          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-sm font-semibold text-white/90 hover:text-white flex items-center gap-1.5"
          >
            <FaTimes className="text-xs" /> {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      ) : subscription && subscription.status !== "active" ? (
        <div className="bg-slate-100 rounded-2xl p-5 mb-8 text-sm text-slate-600">
          Your last subscription ({subscription.plan}) ended on {new Date(subscription.endDate).toLocaleDateString()}.
          Subscribe again below to bring back free servicing.
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Choose a plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {plans &&
              Object.entries(plans).map(([key, plan]) => {
                const meta = PLAN_META[key] || {};
                return (
                  <div key={key} className="relative bg-white rounded-2xl border-2 border-slate-100 p-6 flex flex-col hover:border-primary-200 transition-colors">
                    {meta.badge && (
                      <span className="absolute -top-3 left-6 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {meta.badge}
                      </span>
                    )}
                    <span className="text-3xl mb-3">{meta.icon}</span>
                    <h3 className="text-lg font-bold text-slate-900">{plan.label}</h3>
                    <p className="text-sm text-slate-400 mb-4">{meta.tagline}</p>

                    <div className="mb-5">
                      <span className="text-3xl font-extrabold text-slate-900">₹{plan.price}</span>
                      <span className="text-slate-400 text-sm"> / {key === "annual" ? "year" : "month"}</span>
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {(meta.perks || []).map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-slate-600">
                          <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" /> {perk}
                        </li>
                      ))}
                    </ul>

                    <Button variant="primary" className="w-full justify-center" disabled={busyPlan === key} onClick={() => handleSubscribe(key)}>
                      {busyPlan === key ? "Activating..." : isActive ? "Extend with this Plan" : `Subscribe ${plan.label}`}
                    </Button>
                  </div>
                );
              })}
          </div>
          <p className="text-xs text-slate-400">
            Demo payments only — subscribing here activates instantly without a real payment gateway. Extending
            while a plan is active adds the new duration on top of your remaining time.
          </p>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Why subscribe</h2>
            <div className="space-y-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <b.icon className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">FAQs</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{f.q}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Subscription;