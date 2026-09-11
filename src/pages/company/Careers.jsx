import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaHeart,
  FaRocket,
  FaUsers,
} from "react-icons/fa";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/common/Footer";
import SectionHeading from "../../components/common/SectionHeading";

const CAREERS_EMAIL = "careers@roadrescue.example";

const perks = [
  {
    icon: FaHeart,
    title: "Health coverage",
    desc: "Comprehensive medical benefits for you and your family.",
  },
  {
    icon: FaRocket,
    title: "Growth first",
    desc: "Learning budget and clear paths to grow your career.",
  },
  {
    icon: FaUsers,
    title: "Remote-friendly",
    desc: "Flexible, hybrid-friendly team spread across the country.",
  },
];

const openRoles = [
  {
    title: "Backend Engineer (Node.js)",
    location: "Remote / India",
    type: "Full-time",
    dept: "Engineering",
  },
  {
    title: "React Frontend Engineer",
    location: "Remote / India",
    type: "Full-time",
    dept: "Engineering",
  },
  {
    title: "Mechanic Operations Associate",
    location: "Delhi NCR",
    type: "Full-time",
    dept: "Operations",
  },
  {
    title: "Customer Support Specialist",
    location: "Remote",
    type: "Full-time",
    dept: "Support",
  },
];

function applyMailtoUrl(role) {
  const subject = encodeURIComponent(`Application: ${role.title}`);

  const body = encodeURIComponent(
    `Hi RoadRescue team,\n\nI would like to apply for the ${role.title} role (${role.location}).\n\nA bit about me:\n`
  );

  return `mailto:${CAREERS_EMAIL}?subject=${subject}&body=${body}`;
}

function Careers() {
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
            Build the future of{" "}
            <span className="text-primary-600">
              roadside assistance.
            </span>
          </motion.h1>

          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We are a small team solving a problem everyone eventually runs
            into. Come help us make breakdowns a lot less stressful.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <div
                key={perk.title}
                className="p-6 rounded-2xl border border-slate-100"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon className="text-xl" />
                </div>

                <h3 className="font-semibold text-slate-900 mb-2">
                  {perk.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Roles */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <SectionHeading
          eyebrow="Open Roles"
          title="Current openings"
          subtitle="Not the right fit yet? Email us anyway, we are always open to meeting good people."
        />

        <div className="space-y-4">
          {openRoles.map((role) => (
            <a
              key={role.title}
              href={applyMailtoUrl(role)}
              className="group flex items-center justify-between gap-4 p-6 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {role.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    {role.location}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <FaClock className="text-xs" />
                    {role.type}
                  </span>

                  <span className="text-primary-600 font-medium">
                    {role.dept}
                  </span>
                </div>
              </div>

              <FaArrowRight className="text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0" />
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Do not see the right role?{" "}
          <a
            href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
              "General application"
            )}`}
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            Send us your resume anyway
          </a>
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Careers;