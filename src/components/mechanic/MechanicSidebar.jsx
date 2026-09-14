import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaWrench,
  FaCheckCircle,
  FaMoneyBillWave,
  FaStar,
  FaExclamationTriangle,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBolt,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";

// Grouped the same way AdminSidebar groups its sections — small uppercase
// labels so the list doesn't read as one long undifferentiated column —
// but reskinned with the accent (amber/orange) palette instead of the
// admin's primary blue, so the mechanic workspace reads as its own
// distinct "workshop" product rather than a re-skinned admin panel.
export const MECHANIC_SECTIONS = [
  { id: "overview", label: "Dashboard", icon: FaTachometerAlt, group: "Overview" },
  { id: "incoming", label: "Incoming Requests", icon: FaClipboardList, group: "Jobs" },
  { id: "active", label: "Active Job", icon: FaWrench, group: "Jobs" },
  { id: "completed", label: "Completed Jobs", icon: FaCheckCircle, group: "Jobs" },
  { id: "earnings", label: "Earnings", icon: FaMoneyBillWave, group: "Growth" },
  { id: "reviews", label: "Reviews", icon: FaStar, group: "Growth" },
  { id: "complaints", label: "Complaints & Disputes", icon: FaExclamationTriangle, group: "Support" },
  { id: "profile", label: "Profile & Availability", icon: FaUserCog, group: "Account" },
];

const GROUP_ORDER = ["Overview", "Jobs", "Growth", "Support", "Account"];

function MechanicNavList({ active, onSelect, badges = {} }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto">
      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            {group}
          </p>
          <div className="space-y-1">
            {MECHANIC_SECTIONS.filter((s) => s.group === group).map((item) => {
              const isActive = active === item.id;
              const badge = badges[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`group w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent-600 text-white shadow-sm shadow-accent-900/30"
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

// Prominent, always-visible online/offline switch — unlike Admin (which
// has no equivalent control), a mechanic's availability is the single
// most important toggle in this whole workspace, so it lives right under
// the logo on every section instead of being buried inside a settings tab.
function OnlineToggle({ profile, onToggle }) {
  const isApproved = profile?.verification?.status === "Approved";

  return (
    <div className="px-4 py-4 border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        disabled={!isApproved}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          profile?.isOnline
            ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/30"
            : "bg-white/5 text-slate-400 ring-1 ring-white/10"
        }`}
      >
        <FaBolt className={profile?.isOnline ? "animate-pulse" : ""} />
        {profile?.isOnline ? "You're Online" : "You're Offline"}
      </button>
      {!isApproved && (
        <p className="text-[11px] text-amber-500 text-center mt-2">
          Verification required to go online
        </p>
      )}
    </div>
  );
}

function MechanicFooter({ user, onLogout }) {
  return (
    <div className="px-3 py-4 border-t border-white/10">
      <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-semibold text-sm text-white shrink-0 ring-2 ring-white/10">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
            <FaTools className="text-[10px]" /> Mechanic
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
      <span className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center shrink-0">
        <FaWrench className="text-sm" />
      </span>
      <span>
        Road<span className="text-accent-400">Rescue</span>{" "}
        <span className="text-slate-500 font-medium text-xs align-middle">Mechanic</span>
      </span>
    </span>
  );
}

function MechanicSidebar({
  active,
  onSelect,
  badges,
  user,
  profile,
  onToggleOnline,
  onLogout,
  isMobileNavOpen,
  onCloseMobile,
  onOpenMobile,
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-950 to-slate-900 fixed h-screen">
        <Link to="/" className="px-5 py-5 border-b border-white/10">
          <Logo />
        </Link>
        <OnlineToggle profile={profile} onToggle={onToggleOnline} />
        <MechanicNavList active={active} onSelect={onSelect} badges={badges} />
        <MechanicFooter user={user} onLogout={onLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950 h-16 flex items-center justify-between px-4">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              profile?.isOnline ? "bg-green-400 animate-pulse" : "bg-slate-600"
            }`}
          />
          <button
            onClick={onOpenMobile}
            aria-label="Open menu"
            className="text-xl text-white w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-950/60"
            onClick={onCloseMobile}
          />
          <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 w-72 max-w-[80%] h-full flex flex-col">
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
            <OnlineToggle profile={profile} onToggle={onToggleOnline} />
            <MechanicNavList
              active={active}
              onSelect={(id) => {
                onSelect(id);
                onCloseMobile();
              }}
              badges={badges}
            />
            <MechanicFooter user={user} onLogout={onLogout} />
          </div>
        </div>
      )}

      {profile?.verification?.status !== "Approved" && (
        <div className="hidden md:block fixed top-0 left-64 right-0 z-10 bg-amber-50 border-b border-amber-200 px-6 py-2">
          <p className="text-xs text-amber-700 flex items-center gap-2">
            <FaShieldAlt /> Your account verification is{" "}
            {profile?.verification?.status?.toLowerCase() || "pending"}. You
            must be verified before you can go online.
          </p>
        </div>
      )}
    </>
  );
}

export default MechanicSidebar;