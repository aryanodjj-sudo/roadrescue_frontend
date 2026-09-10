import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";
import { mockComplaints, mockDisputes } from "../../data/adminMockData";

import AdminOverview from "./sections/AdminOverview";
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

  const allRequests = getAllRequests();

  // Small, cheap fetch just for the sidebar badge count — the Verification
  // section itself does its own full fetch when opened.
  useEffect(() => {
    api
      .get("/admin/reports")
      .then(({ data }) => setPendingVerifications(data.reports.pendingVerifications))
      .catch(() => {});
  }, []);

  const badges = {
    verification: pendingVerifications,
    complaints: mockComplaints.filter((c) => c.status !== "Resolved").length,
    disputes: mockDisputes.filter((d) => d.status !== "Resolved").length,
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
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
      case "complaints":
        return <AdminComplaintsDisputes />;
      case "disputes":
        return <AdminComplaintsDisputes />;
      case "reports":
        return <AdminReportsRevenue allRequests={allRequests} />;
      case "revenue":
        return <AdminReportsRevenue allRequests={allRequests} />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview allRequests={allRequests} />;
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