import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaMoneyBillWave, FaChartLine, FaUsers } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/common/Footer";
import SectionHeading from "../../components/common/SectionHeading";
import Button from "../../components/common/Button";
import api from "../../utils/api";

const benefits = [
  {
    icon: FaMoneyBillWave,
    title: "Steady extra income",
    desc: "Fill gaps in your schedule with jobs that come straight to your phone.",
  },
  {
    icon: FaChartLine,
    title: "Grow your customer base",
    desc: "Get discovered by drivers in your area who need help right now.",
  },
  {
    icon: FaUsers,
    title: "You're in control",
    desc: "Accept only the jobs you want, whenever you're available.",
  },
];

function BecomePartner() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: "partnership",
        subject: `Partner application — ${form.city || "location not given"}`,
        message: form.message,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", city: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight"
          >
            Grow your garage with{" "}
            <span className="text-primary-600">RoadRescue.</span>
          </motion.h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Join our network of verified mechanics and start receiving
            service requests from drivers near you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl border border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <b.icon className="text-xl" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <SectionHeading
          eyebrow="Apply Now"
          title="Tell us about your garage"
          subtitle="Our team reviews every application and reaches out within a few business days."
        />

        {status === "success" ? (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
            <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">
              Application received
            </h3>
            <p className="text-sm text-slate-500">
              Thanks for your interest — we'll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City / Service area
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tell us about your experience
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Years of experience, specialties, current garage/shop, etc."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default BecomePartner;