import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaSave, FaShieldAlt, FaIdBadge } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await updateUser({ name: formData.name, phone: formData.phone });
      setSaved(true);
    } catch (err) {
      setError(err.message || "Could not update your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROFILE SUMMARY CARD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white h-fit">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl font-bold mb-4 ring-4 ring-white/10">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-sm text-slate-400 mb-4">{user?.email}</p>

          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3.5 py-2.5 text-sm mb-2">
            <FaIdBadge className="text-primary-400" />
            <span className="capitalize">{user?.role} Account</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3.5 py-2.5 text-sm">
            <FaShieldAlt className="text-primary-400" />
            <span>Verified Account</span>
          </div>
        </div>

        {/* EDIT FORM CARD */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="font-semibold text-slate-900 mb-6">Personal Information</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {saved && (
              <p className="text-sm text-green-600 font-medium">Profile updated successfully.</p>
            )}

            <Button type="submit" variant="primary" className="mt-2" disabled={isSubmitting}>
              <FaSave className="text-sm" /> {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;