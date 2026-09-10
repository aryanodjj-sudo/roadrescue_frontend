import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaSignOutAlt } from "react-icons/fa";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Why RoadRescue", href: "#why-us" },
  ];

  const dashboardPath =
    user?.role === "mechanic"
      ? "/mechanic/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-slate-900">
          Road<span className="text-primary-600">Rescue</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-600 font-medium hover:text-primary-600 transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <FaSignOutAlt className="text-sm" /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl text-slate-700" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block text-slate-700 font-medium">
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="primary" className="w-full" onClick={handleLogout}>
                  <FaSignOutAlt className="text-sm" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;