import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import api from "../../utils/api";
import { SOCIAL_LINKS } from "../../data/socialLinks";

const contactDetails = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "support@roadrescue.example",
    href: "mailto:support@roadrescue.example",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Office",
    value: "Connaught Place, New Delhi, India",
    href: null,
  },
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("submitting");
    setError("");

    try {
      await api.post("/contact", {
        ...form,
        category: "general",
      });

      setStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight"
          >
            Get in <span className="text-primary-600">touch.</span>
          </motion.h1>

          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Questions, feedback, or just want to say hi, our team reads every
            message.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Contact Information */}
        <div className="md:col-span-2 space-y-8">
          {contactDetails.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Icon />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    {detail.label}
                  </p>

                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="font-medium text-slate-900 hover:text-primary-600 transition-colors"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-900">
                      {detail.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Social Links */}
          <div>
            <p className="text-sm text-slate-400 mb-3">
              Follow us
            </p>

            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RoadRescue on Facebook"
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
              >
                <FaFacebook />
              </a>

              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RoadRescue on Twitter"
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
              >
                <FaTwitter />
              </a>

              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RoadRescue on Instagram"
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
              >
                <FaInstagram />
              </a>

              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RoadRescue on LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          {status === "success" ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
              <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-3" />

              <h3 className="font-semibold text-slate-900 mb-1">
                Message sent
              </h3>

              <p className="text-sm text-slate-500">
                Thanks for reaching out. We will reply within 1-2 business
                days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
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
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Sending..."
                  : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;