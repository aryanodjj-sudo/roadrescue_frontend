import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar, FaShieldAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/service/ServiceCard";
import { servicesData } from "../data/servicesData";
import { howItWorksData } from "../data/howItWorksData";
import { mockMechanics } from "../data/mockMechanics";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } = useAuth();

  // If logged in, CTAs go straight into the app; otherwise they go to login first.
  const assistancePath = isAuthenticated ? "/dashboard/services" : "/login";
  const findMechanicPath = isAuthenticated ? "/dashboard/find-mechanic" : "/login";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight"
          >
            Vehicle trouble?
            <br />
            <span className="text-primary-600">Help is one tap away.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg text-slate-500 max-w-xl mx-auto"
          >
            RoadRescue connects you with verified nearby mechanics and towing
            partners in minutes — anytime, anywhere your vehicle breaks down.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={assistancePath}>
              <Button variant="primary" className="text-base px-8 py-4">
                Get Assistance
              </Button>
            </Link>
            <Link to={findMechanicPath}>
              <Button variant="outline" className="text-base px-8 py-4">
                Find a Mechanic
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <SectionHeading
          eyebrow="What We Offer"
          title="Every service you need, on demand"
          subtitle="From a dead battery to a full breakdown, RoadRescue has you covered."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>

      {/* NEARBY MECHANICS (mock preview) */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Nearby Right Now"
            title="Trusted mechanics near you"
            subtitle="Preview of nearby partners — live data will connect once location is enabled."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {mockMechanics.map((mech) => (
              <div
                key={mech.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={mech.image}
                    alt={mech.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">{mech.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      <FaStar /> {mech.rating}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {mech.distanceKm} km away
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {mech.etaMinutes} min ETA
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mech.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <SectionHeading
          eyebrow="Simple Process"
          title="How RoadRescue works"
          subtitle="From breakdown to back-on-the-road, in four simple steps."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksData.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-extrabold text-primary-100">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY ROADRESCUE / TRUST & SAFETY */}
      <section id="why-us" className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Why RoadRescue"
            title="Built for trust, speed, and safety"
            subtitle="Every mechanic is verified. Every request is tracked. Every payment is secure."
            center={true}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <FaShieldAlt className="text-4xl text-primary-400 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Verified Partners</h4>
              <p className="text-slate-400 text-sm">
                Every mechanic goes through identity and skill verification before joining.
              </p>
            </div>
            <div className="text-center">
              <FaClock className="text-4xl text-primary-400 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Fast Response</h4>
              <p className="text-slate-400 text-sm">
                Average mechanic arrival time under 15 minutes in most areas.
              </p>
            </div>
            <div className="text-center">
              <FaStar className="text-4xl text-primary-400 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Rated & Reviewed</h4>
              <p className="text-slate-400 text-sm">
                Transparent ratings help you choose the right partner every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-center text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stranded on the road? Don't wait.
          </h2>
          <p className="text-primary-50 mb-8">
            Get connected to a verified mechanic near you in minutes.
          </p>
          <Link to={assistancePath}>
            <Button variant="accent" className="text-base px-8 py-4">
              Get Assistance Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;