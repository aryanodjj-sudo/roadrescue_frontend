import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import FindMechanic from "./pages/FindMechanic";
import BookingConfirmation from "./pages/BookingConfirmation";
import ServiceHistory from "./pages/ServiceHistory";
import MyReviews from "./pages/MyReviews";
import TrackService from "./pages/TrackService";
import Invoice from "./pages/Invoice";
import Notifications from "./pages/Notifications";
import Complaints from "./pages/Complaints";
import MechanicDashboard from "./pages/mechanic/MechanicDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AboutUs from "./pages/company/AboutUs";
import BecomePartner from "./pages/company/BecomePartner";
import Careers from "./pages/company/Careers";
import Contact from "./pages/company/Contact";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Subscription from "./pages/Subscription";
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-slate-600">
        404 — Page Not Found
      </h1>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/partner" element={<BecomePartner />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/vehicles" element={<ProtectedRoute allowedRoles={["user"]}><Vehicles /></ProtectedRoute>} />
      <Route path="/dashboard/vehicles/:id" element={<ProtectedRoute allowedRoles={["user"]}><VehicleDetails /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={["user"]}><Profile /></ProtectedRoute>} />
      <Route path="/dashboard/services" element={<ProtectedRoute allowedRoles={["user"]}><Services /></ProtectedRoute>} />
      <Route path="/dashboard/find-mechanic" element={<ProtectedRoute allowedRoles={["user"]}><FindMechanic /></ProtectedRoute>} />
      <Route path="/dashboard/booking" element={<ProtectedRoute allowedRoles={["user"]}><BookingConfirmation /></ProtectedRoute>} />
      <Route path="/dashboard/history" element={<ProtectedRoute allowedRoles={["user"]}><ServiceHistory /></ProtectedRoute>} />
      <Route path="/dashboard/reviews" element={<ProtectedRoute allowedRoles={["user"]}><MyReviews /></ProtectedRoute>} />
      <Route path="/dashboard/track/:id" element={<ProtectedRoute allowedRoles={["user"]}><TrackService /></ProtectedRoute>} />
      <Route path="/dashboard/invoice/:id" element={<ProtectedRoute allowedRoles={["user"]}><Invoice /></ProtectedRoute>} />
      <Route path="/dashboard/subscription" element={<ProtectedRoute allowedRoles={["user"]}><Subscription /></ProtectedRoute>} />
      <Route path="/dashboard/notifications" element={<ProtectedRoute allowedRoles={["user"]}><Notifications /></ProtectedRoute>} />
      <Route path="/dashboard/complaints" element={<ProtectedRoute allowedRoles={["user"]}><Complaints /></ProtectedRoute>} />

      <Route path="/mechanic/dashboard" element={<ProtectedRoute allowedRoles={["mechanic"]}><MechanicDashboard /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;