import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";

import AdminOverview from "./sections/AdminOverview";
import AdminCoupons from "./sections/AdminCoupons";
import AdminSubscriptions from "./sections/AdminSubscriptions";
import AdminUsers from "./sections/AdminUsers";
import AdminMechanics from "./sections/AdminMechanics";
import AdminVerification from "./sections/AdminVerification";
import AdminServiceRequests from "./sections/AdminServiceRequests";
import AdminServicesReviews from "./sections/AdminServicesReviews";
import AdminComplaintsDisputes from "./sections/AdminComplaintsDisputes";
import AdminReportsRevenue from "./sections/AdminReportsRevenue";
import AdminSettings from "./sections/AdminSettings";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { getAllRequests } = useServiceRequests();
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [openDisputes, setOpenDisputes] = useState(0);

  const allRequests = getAllRequests();

  // Small, cheap fetches just for the sidebar badge counts — each section
  // itself does its own full fetch when opened.
  useEffect(() => {
    api
      .get("/admin/reports")
      .then(({ data }) => setPendingVerifications(data.reports.pendingVerifications))
      .catch(() => {});

    api
      .get("/admin/complaints")
      .then(({ data }) => {
        const open = data.complaints.filter((c) => c.status !== "Resolved");
        setOpenComplaints(open.filter((c) => c.type === "Complaint").length);
        setOpenDisputes(open.filter((c) => c.type === "Dispute").length);
      })
      .catch(() => {});
  }, []);

  const badges = {
    verification: pendingVerifications,
    complaints: openComplaints,
    disputes: openDisputes,
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview onNavigate={setActiveSection} allRequests={allRequests} />;
      case "users":
        return <AdminUsers />;
      case "mechanics":
        return <AdminMechanics />;
      case "verification":
        return <AdminVerification />;
      case "requests":
        return <AdminServiceRequests allRequests={allRequests} />;
      case "services":
        return <AdminServicesReviews />;
      case "reviews":
        return <AdminServicesReviews />;
      case "coupons":
        return <AdminCoupons />;
      case "subscriptions":
        return <AdminSubscriptions />;
      case "complaints":
        return <AdminComplaintsDisputes filterType="Complaint" />;
      case "disputes":
        return <AdminComplaintsDisputes filterType="Dispute" />;
      case "reports":
        return <AdminReportsRevenue allRequests={allRequests} />;
      case "revenue":
        return <AdminReportsRevenue allRequests={allRequests} />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview onNavigate={setActiveSection} allRequests={allRequests} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        active={activeSection}
        onSelect={setActiveSection}
        badges={badges}
        user={user}
        onLogout={logout}
        isMobileNavOpen={isMobileNavOpen}
        onOpenMobile={() => setIsMobileNavOpen(true)}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <main className="flex-1 md:ml-64 pt-20 md:pt-10 p-6 md:p-10">
        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;