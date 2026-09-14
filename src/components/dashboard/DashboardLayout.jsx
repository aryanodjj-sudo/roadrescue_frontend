import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaCarSide,
  FaUser,
  FaTools,
  FaHistory,
  FaBell,
  FaExclamationTriangle,
  FaCrown,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCarCrash,
  FaStar,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";

// Declared at module scope (not inside DashboardLayout) so React keeps a
// stable component identity across re-renders instead of remounting the
// whole nav/footer subtree on every parent render.
function NavList({ navItems, onNavigate }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-600 text-white shadow-sm shadow-primary-900/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="flex items-center gap-3">
                <item.icon
                  className={`text-base ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                />
                {item.label}
              </span>
              {!!item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function UserFooter({ user, onLogout }) {
  return (
    <div className="px-3 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-semibold text-sm text-white shrink-0 ring-2 ring-white/10">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
      >
        <FaSignOutAlt /> Log Out
      </button>
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-extrabold text-white">
      <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
        <FaCarCrash className="text-sm" />
      </span>
      Road<span className="text-primary-400">Rescue</span>
    </span>
  );
}

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useServiceRequests();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: FaHome },
    { label: "My Vehicles", to: "/dashboard/vehicles", icon: FaCarSide },
    { label: "Get Service", to: "/dashboard/services", icon: FaTools },
    { label: "History", to: "/dashboard/history", icon: FaHistory },
    { label: "My Reviews", to: "/dashboard/reviews", icon: FaStar },
    {
      label: "Notifications",
      to: "/dashboard/notifications",
      icon: FaBell,
      badge: unreadCount,
    },
    { label: "Complaints", to: "/dashboard/complaints", icon: FaExclamationTriangle },
    { label: "Subscription", to: "/dashboard/subscription", icon: FaCrown },
    { label: "Profile", to: "/dashboard/profile", icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar — dark, matches Admin sidebar's design language */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 fixed h-screen">
        <Link to="/" className="px-5 py-5 border-b border-white/10">
          <Logo />
        </Link>
        <NavList navItems={navItems} />
        <UserFooter user={user} onLogout={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 h-16 flex items-center justify-between px-4">
        <Link to="/">
          <Logo />
        </Link>
        <button
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open menu"
          className="text-xl text-white relative w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"
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
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative bg-slate-900 w-72 max-w-[80%] h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <Logo />
              <button
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Close menu"
                className="text-xl text-slate-400 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>
            <NavList
              navItems={navItems}
              onNavigate={() => setIsMobileNavOpen(false)}
            />
            <UserFooter
              user={user}
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