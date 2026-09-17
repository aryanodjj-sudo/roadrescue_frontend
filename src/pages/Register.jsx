import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaCarSide, FaTools, FaUserShield } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import PasswordInput from "../components/common/PasswordInput";
import {
  isNonEmpty,
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
} from "../utils/validators";
import { MIN_PASSWORD_LENGTH } from "../utils/constants";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isNonEmpty(formData.name)) {
      setError("Please enter your full name");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const newUser = await register({ ...formData, role });

      // FIXED: was navigating to "/" for new "user" accounts, inconsistent
      // with Login.jsx's redirect. Now matches it exactly.
      if (newUser.role === "mechanic") {
        navigate("/mechanic/dashboard");
      } else if (newUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
          Create your account
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          Join RoadRescue in seconds
        </p>

        {/* Role Toggle */}
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
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;