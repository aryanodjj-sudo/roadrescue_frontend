import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaCarSide,
  FaUser,
  FaTools,
  FaHistory,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useServiceRequests();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: FaHome },
    { label: "My Vehicles", to: "/dashboard/vehicles", icon: FaCarSide },
    { label: "Get Service", to: "/dashboard/services", icon: FaTools },
    { label: "History", to: "/dashboard/history", icon: FaHistory },
    {
      label: "Notifications",
      to: "/dashboard/notifications",
      icon: FaBell,
      badge: unreadCount,
    },
    { label: "Profile", to: "/dashboard/profile", icon: FaUser },
  ];

  const NavList = ({ onNavigate }) => (
    <nav className="flex-1 px-3 py-6 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-50 text-primary-600"
                : "text-slate-600 hover:bg-slate-50"
            }`
          }
        >
          <span className="flex items-center gap-3">
            <item.icon className="text-lg" />
            {item.label}
          </span>
          {!!item.badge && (
            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const UserFooter = ({ onLogout }) => (
    <div className="px-3 py-4 border-t border-slate-100">
      <div className="flex items-center gap-3 px-4 py-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
      >
        <FaSignOutAlt /> Log Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-screen">
        <Link to="/" className="px-6 py-5 border-b border-slate-100">
          <span className="text-xl font-extrabold text-slate-900">
            Road<span className="text-primary-600">Rescue</span>
          </span>
        </Link>
        <NavList />
        <UserFooter onLogout={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 h-16 flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-extrabold text-slate-900">
          Road<span className="text-primary-600">Rescue</span>
        </Link>
        <button
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open menu"
          className="text-2xl text-slate-700 relative"
        >
          <FaBars />
          {!!unreadCount && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative bg-white w-72 max-w-[80%] h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <span className="text-xl font-extrabold text-slate-900">
                Road<span className="text-primary-600">Rescue</span>
              </span>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Close menu"
                className="text-xl text-slate-500"
              >
                <FaTimes />
              </button>
            </div>
            <NavList onNavigate={() => setIsMobileNavOpen(false)} />
            <UserFooter
              onLogout={() => {
                setIsMobileNavOpen(false);
                logout();
              }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-10 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;