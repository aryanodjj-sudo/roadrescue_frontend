import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaTools,
  FaUserCheck,
  FaClipboardList,
  FaConciergeBell,
  FaStar,
  FaExclamationTriangle,
  FaBalanceScale,
  FaFileAlt,
  FaMoneyBillWave,
  FaTag,
  FaCrown,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

// Grouped so 14 sections don't read as one long undifferentiated list —
// each group gets a small uppercase label, same visual language as the
// user sidebar's dark theme (DashboardLayout.jsx).
export const ADMIN_SECTIONS = [
  { id: "overview", label: "Dashboard", icon: FaChartPie, group: "Overview" },
  { id: "users", label: "Users", icon: FaUsers, group: "Operations" },
  { id: "mechanics", label: "Mechanics", icon: FaTools, group: "Operations" },
  { id: "verification", label: "Verification", icon: FaUserCheck, group: "Operations" },
  { id: "requests", label: "Service Requests", icon: FaClipboardList, group: "Operations" },
  { id: "services", label: "Services", icon: FaConciergeBell, group: "Operations" },
  { id: "reviews", label: "Reviews", icon: FaStar, group: "Growth" },
  { id: "coupons", label: "Coupons", icon: FaTag, group: "Growth" },
  { id: "subscriptions", label: "Subscriptions", icon: FaCrown, group: "Growth" },
  { id: "complaints", label: "Complaints", icon: FaExclamationTriangle, group: "Support" },
  { id: "disputes", label: "Disputes", icon: FaBalanceScale, group: "Support" },
  { id: "reports", label: "Reports", icon: FaFileAlt, group: "Insights" },
  { id: "revenue", label: "Revenue", icon: FaMoneyBillWave, group: "Insights" },
  { id: "settings", label: "Settings", icon: FaCog, group: "System" },
];

const GROUP_ORDER = ["Overview", "Operations", "Growth", "Support", "Insights", "System"];

function AdminNavList({ active, onSelect, badges = {} }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto">
      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            {group}
          </p>
          <div className="space-y-1">
            {ADMIN_SECTIONS.filter((s) => s.group === group).map((item) => {
              const isActive = active === item.id;
              const badge = badges[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`group w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-900/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon
                      className={`text-base ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                    />
                    {item.label}
                  </span>
                  {!!badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function AdminFooter({ user, onLogout }) {
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
          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
            <FaShieldAlt className="text-[10px]" /> Admin
          </p>
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
        <FaShieldAlt className="text-sm" />
      </span>
      <span>
        Road<span className="text-primary-400">Rescue</span>{" "}
        <span className="text-slate-500 font-medium text-xs align-middle">Admin</span>
      </span>
    </span>
  );
}

function AdminSidebar({ active, onSelect, badges, user, onLogout, isMobileNavOpen, onCloseMobile, onOpenMobile }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 fixed h-screen">
        <Link to="/" className="px-5 py-5 border-b border-white/10">
          <Logo />
        </Link>
        <AdminNavList active={active} onSelect={onSelect} badges={badges} />
        <AdminFooter user={user} onLogout={onLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 h-16 flex items-center justify-between px-4">
        <Link to="/">
          <Logo />
        </Link>
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="text-xl text-white w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={onCloseMobile}
          />
          <div className="relative bg-slate-900 w-72 max-w-[80%] h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <Logo />
              <button
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="text-xl text-slate-400 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>
            <AdminNavList
              active={active}
              onSelect={(id) => {
                onSelect(id);
                onCloseMobile();
              }}
              badges={badges}
            />
            <AdminFooter user={user} onLogout={onLogout} />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;