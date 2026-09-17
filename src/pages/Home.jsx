import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaChevronDown,
  FaCrown,
  FaTools,
  FaQuoteLeft,
  FaBolt,
} from "react-icons/fa";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import SectionHeading from "../components/common/SectionHeading";
import { servicesData } from "../data/servicesData";
import { howItWorksData } from "../data/howItWorksData";
import {
  heroStats,
  whyUsFeatures,
  testimonials,
  partnerBenefits,
  faqs,
} from "../data/homeContent";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../utils/getDashboardPath";

// Shared scroll-reveal animation so every section feels consistent.
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();   
  const [openFaq, setOpenFaq] = useState(0);

  // "Get Assistance" / "Find Mechanic" are vehicle-owner actions. If a
  // mechanic or admin is logged in, those /dashboard/* routes are
  // user-only and would bounce them back here — so send them to their
  // own dashboard instead, same as the navbar's Dashboard link does.
  const assistancePath = !isAuthenticated
    ? "/login"
    : user.role === "user"
    ? "/dashboard/services"
    : getDashboardPath(user.role);
  const findMechanicPath = !isAuthenticated
    ? "/login"
    : user.role === "user"
    ? "/dashboard/find-mechanic"
    : getDashboardPath(user.role);
  const subscriptionPath = !isAuthenticated
    ? "/login"
    : user.role === "user"
    ? "/dashboard/subscription"
    : getDashboardPath(user.role);
    // Service card click hone par decide karta hai kahan bhejna hai
  const handleServiceClick = (serviceId) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { redirectTo: "/dashboard/services", openService: serviceId },
      });
      return;
    }
    if (user.role !== "user") {
      navigate(getDashboardPath(user.role));
      return;
    }
    navigate("/dashboard/services", { state: { openService: serviceId } });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Decorative glows — purely visual, hidden from screen readers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-32 w-[28rem] h-[28rem] bg-primary-600/30 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 w-[24rem] h-[24rem] bg-accent-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Copy */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-primary-100 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                  <FaBolt className="text-accent-400" />
                  24/7 Roadside Assistance Across the City
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
              >
                Broken down?
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                  Help reaches you.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg"
              >
                RoadRescue connects you with verified mechanics and towing
                partners nearby — with live tracking, upfront pricing and help
                that arrives in minutes, not hours.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link to={assistancePath} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto text-base px-8 py-4 shadow-lg shadow-primary-600/30"
                  >
                    Get Assistance Now <FaArrowRight className="text-sm" />
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-base px-8 py-4 !text-white border-2 border-white/20 hover:!text-primary-200 hover:border-white/40"
                  >
                    <FaPlay className="text-xs" /> See How It Works
                  </Button>
                </a>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400"
              >
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" /> No booking fees
                </span>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" /> Verified partners
                </span>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" /> Pay after service
                </span>
              </motion.p>
            </motion.div>

            {/* Visual card — a mock "live request" preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative"
            >
              <div className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Live Request
                  </span>
                  <span className="flex items-center gap-1.5 bg-green-500/15 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    On The Way
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-lg shrink-0">
                    R
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">Rajesh Auto Works</p>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <FaStar /> 4.8
                      <span className="text-slate-400 ml-1">· 132 jobs</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[11px] text-slate-400 mb-0.5">Distance</p>
                    <p className="font-bold text-lg">2.4 km</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[11px] text-slate-400 mb-0.5">Arriving in</p>
                    <p className="font-bold text-lg">6 min</p>
                  </div>
                </div>

                {/* Status progress */}
                <div className="space-y-2.5">
                  {["Accepted", "On The Way", "Arrived"].map((s, i) => (
                    <div key={s} className="flex items-center gap-3 text-sm">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          i <= 1
                            ? "bg-primary-500 text-white"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {i <= 1 ? <FaCheckCircle /> : i + 1}
                      </span>
                      <span className={i <= 1 ? "text-white" : "text-slate-400"}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating price badge */}
              <div className="absolute -bottom-4 -left-2 sm:-left-5 bg-white text-slate-900 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-[11px] text-slate-500">Upfront price</p>
                <p className="font-extrabold text-lg">
                  ₹499 <span className="text-xs font-medium text-slate-400">fixed</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Trust stats bar */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-white/10 pt-10"
          >
            {heroStats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <p className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="What We Offer"
            title="Every roadside emergency, covered"
            subtitle="Five core services, one app. Pick what you need and a verified partner is on the way."
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {servicesData.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.id} variants={fadeUp}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleServiceClick(service.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleServiceClick(service.id);
                      }
                    }}
                    className="group block h-full bg-white rounded-2xl p-7 border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 group-hover:bg-primary-600 flex items-center justify-center mb-5 transition-colors duration-300">
                      <Icon className="text-2xl text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Request now <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Filler card that doubles as a secondary CTA */}
            <motion.div variants={fadeUp}>
              <div className="h-full bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-7 text-white flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Not sure what you need?
                  </h3>
                  <p className="text-primary-100 text-sm leading-relaxed">
                    Describe the problem in your own words and the nearest
                    mechanic will diagnose it on the spot.
                  </p>
                </div>
                <Link to={findMechanicPath} className="mt-6">
                  <Button
                    variant="accent"
                    className="w-full justify-center text-sm"
                  >
                    Find a Mechanic
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Simple Process"
            title="From breakdown to back on the road"
            subtitle="Four steps. No phone calls, no haggling, no waiting in the dark."
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {howItWorksData.map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} className="relative">
                <div className="bg-white rounded-2xl p-7 h-full border border-slate-100 hover:shadow-lg transition-shadow">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white font-extrabold text-lg mb-5">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connector arrow between steps (desktop only) */}
                {i < howItWorksData.length - 1 && (
                  <FaArrowRight
                    aria-hidden="true"
                    className="hidden lg:block absolute top-1/2 -right-3 text-slate-300 text-sm"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section id="why-us" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Why RoadRescue"
            title="Built for trust, speed and safety"
            subtitle="Everything we've built exists to make one of the worst moments of your day a little easier."
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyUsFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="flex gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                    <Icon className="text-xl text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ SUBSCRIPTION PROMO ============ */}
      <section className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 text-xs font-bold px-4 py-2 rounded-full mb-5">
                <FaCrown /> ROADRESCUE MEMBERSHIP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Pay once.
                <br />
                Every rescue is free.
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Subscribe monthly or annually and every breakdown, tow,
                jump-start, tyre repair and fuel delivery is fully covered — no
                per-visit charges, no surprises. Your dashboard always shows
                exactly how many days you have left.
              </p>
              <Link to={subscriptionPath}>
                <Button variant="accent" className="text-base px-8 py-4">
                  View Plans <FaArrowRight className="text-sm" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="grid gap-4">
              {[
                { label: "Monthly", price: "₹299", note: "Cancel anytime" },
                { label: "Annual", price: "₹2,999", note: "Best value — 2 months free", featured: true },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className={`rounded-2xl p-6 border ${
                    plan.featured
                      ? "bg-gradient-to-br from-primary-600 to-primary-700 border-primary-500 shadow-xl shadow-primary-900/40"
                      : "bg-white/[0.06] border-white/10"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-bold text-lg">{plan.label}</span>
                    <span className="text-2xl font-extrabold">{plan.price}</span>
                  </div>
                  <p
                    className={`text-sm ${
                      plan.featured ? "text-primary-100" : "text-slate-400"
                    }`}
                  >
                    {plan.note}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Real Stories"
            title="Trusted when it matters most"
            subtitle="What drivers say after RoadRescue got them moving again."
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-slate-100 flex flex-col"
              >
                <FaQuoteLeft className="text-2xl text-primary-200 mb-4" />
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="flex gap-0.5 mt-5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < t.rating ? "text-amber-400" : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PARTNER RECRUITMENT ============ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white grid lg:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-200 text-xs font-bold px-4 py-2 rounded-full mb-5">
                <FaTools /> FOR MECHANICS & TOWING PARTNERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Grow your garage with RoadRescue
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Join hundreds of verified partners earning more by serving
                customers already looking for help nearby. You stay in control
                of your pricing, services and schedule.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <ul className="space-y-3 mb-7">
                {partnerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm">
                    <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to={isAuthenticated ? getDashboardPath(user.role) : "/register"}>
                <Button
                  variant="primary"
                  className="w-full sm:w-auto justify-center text-base px-8 py-4"
                >
                  Become a Partner <FaArrowRight className="text-sm" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            eyebrow="Questions"
            title="Everything you might be wondering"
            subtitle="Still stuck? Reach out from the Contact page and we'll help."
          />

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <FaChevronDown
                      className={`text-slate-400 text-sm shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-slate-900 text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent_55%)]"
        />
        <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5"
            >
              Stranded right now?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-primary-100 text-base sm:text-lg mb-9 max-w-xl mx-auto"
            >
              Don't wait on the roadside. Get a verified mechanic heading your
              way in under a minute.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Link to={assistancePath} className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  className="w-full sm:w-auto text-base px-10 py-4 shadow-xl"
                >
                  Get Assistance Now
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-base px-10 py-4 !text-white border-2 border-white/30 hover:border-white/60"
                  >
                    Create Free Account
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;