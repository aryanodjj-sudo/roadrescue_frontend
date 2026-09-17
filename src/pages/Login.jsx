import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaCarSide, FaTools, FaUserShield } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import PasswordInput from "../components/common/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();   
  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo;   
  const openService = location.state?.openService; 
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loggedInUser = await login({ ...formData, role });

      // Redirect based on role
      if (loggedInUser.role === "mechanic") {
        navigate("/mechanic/dashboard");
      } else if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
          state: openService ? { openService } : undefined,
        });
      } else {
        navigate("/dashboard"); // FIXED: was navigating to "/" before
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <Link to="/" className="block text-center mb-6">
          <span className="text-2xl font-extrabold text-slate-900">
            Road<span className="text-primary-600">Rescue</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Welcome back
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          Log in to continue to your account
        </p>

        <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              role === "user"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <FaCarSide /> <span className="whitespace-nowrap">Vehicle Owner</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("mechanic")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              role === "mechanic"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <FaTools /> <span className="whitespace-nowrap">Mechanic</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              role === "admin"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <FaUserShield /> <span className="whitespace-nowrap">Admin</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-semibold">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;