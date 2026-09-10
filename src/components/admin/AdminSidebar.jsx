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
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Dashboard", icon: FaChartPie },
  { id: "users", label: "Users", icon: FaUsers },
  { id: "mechanics", label: "Mechanics", icon: FaTools },
  { id: "verification", label: "Verification", icon: FaUserCheck },
  { id: "requests", label: "Service Requests", icon: FaClipboardList },
  { id: "services", label: "Services", icon: FaConciergeBell },
  { id: "reviews", label: "Reviews", icon: FaStar },
  { id: "complaints", label: "Complaints", icon: FaExclamationTriangle },
  { id: "disputes", label: "Disputes", icon: FaBalanceScale },
  { id: "reports", label: "Reports", icon: FaFileAlt },
  { id: "revenue", label: "Revenue", icon: FaMoneyBillWave },
  { id: "settings", label: "Settings", icon: FaCog },
];

function AdminNavList({ active, onSelect, badges = {} }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {ADMIN_SECTIONS.map((item) => {
        const isActive = active === item.id;
        const badge = badges[item.id];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-50 text-primary-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="text-lg" />
              {item.label}
            </span>
            {!!badge && (
              <span className="bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function AdminFooter({ user, onLogout }) {
  return (
    <div className="px-3 py-4 border-t border-slate-100">
      <div className="flex items-center gap-3 px-4 py-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 truncate">Admin</p>
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
}

function AdminSidebar({ active, onSelect, badges, user, onLogout, isMobileNavOpen, onCloseMobile, onOpenMobile }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-screen">
        <Link to="/" className="px-6 py-5 border-b border-slate-100">
          <span className="text-xl font-extrabold text-slate-900">
            Road<span className="text-primary-600">Rescue</span>{" "}
            <span className="text-slate-400 font-medium text-sm">Admin</span>
          </span>
        </Link>
        <AdminNavList active={active} onSelect={onSelect} badges={badges} />
        <AdminFooter user={user} onLogout={onLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 h-16 flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-extrabold text-slate-900">
          Road<span className="text-primary-600">Rescue</span>
        </Link>
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="text-2xl text-slate-700"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={onCloseMobile}
          />
          <div className="relative bg-white w-72 max-w-[80%] h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <span className="text-xl font-extrabold text-slate-900">
                Road<span className="text-primary-600">Rescue</span>
              </span>
              <button
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="text-xl text-slate-500"
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