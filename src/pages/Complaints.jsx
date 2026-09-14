import { FaClock, FaHeadset, FaShieldAlt } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ComplaintsPanel from "../components/complaints/ComplaintsPanel";

const TIPS = [
  {
    icon: FaClock,
    title: "Fast response",
    desc: "Our team reviews new complaints and disputes within 24 hours.",
  },
  {
    icon: FaShieldAlt,
    title: "Fair resolution",
    desc: "Every case is reviewed on its own merits before a decision is made.",
  },
  {
    icon: FaHeadset,
    title: "Stay updated",
    desc: "You'll get a notification the moment your status changes.",
  },
];

function Complaints() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Complaints &amp; Disputes
        </h1>

        <p className="mt-1 text-slate-500">
          Raise an issue with a service or mechanic — our admin team handles
          every case personally.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Complaints Panel */}
        <div className="lg:col-span-2">
          <ComplaintsPanel />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 self-start lg:sticky lg:top-6">
          {/* How It Works */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-900">
              How it works
            </h2>

            <div className="space-y-4">
              {TIPS.map((tip) => {
                const Icon = tip.icon;

                return (
                  <div key={tip.title} className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Icon className="text-sm" />
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {tip.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent Help */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <h3 className="mb-2 font-semibold">Need urgent help?</h3>

            <p className="mb-4 text-sm text-slate-300">
              For safety issues during an active job, contact support directly
              instead of waiting for a complaint review.
            </p>

            <a
              href="mailto:support@roadrescue.example"
              className="text-sm font-semibold text-primary-400 transition-colors hover:text-primary-300"
            >
              support@roadrescue.example
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Complaints;