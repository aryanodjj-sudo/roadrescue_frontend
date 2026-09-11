import { motion } from "framer-motion";
import { FaShieldAlt, FaClock, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/common/Footer";
import SectionHeading from "../../components/common/SectionHeading";

const values = [
  {
    icon: FaClock,
    title: "Speed",
    desc: "When you're stranded, every minute counts. We connect you to the nearest verified mechanic, fast.",
  },
  {
    icon: FaShieldAlt,
    title: "Trust",
    desc: "Every mechanic on our platform is verified before they can accept a single job.",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Coverage",
    desc: "From highways to city streets, our network keeps growing so help is always nearby.",
  },
  {
    icon: FaHeart,
    title: "Care",
    desc: "Roadside breakdowns are stressful. We built RoadRescue to make the experience calm and simple.",
  },
];

const stats = [
  { label: "Verified mechanics", value: "500+" },
  { label: "Requests completed", value: "20,000+" },
  { label: "Average response time", value: "18 min" },
  { label: "Cities covered", value: "35+" },
];

function AboutUs() {
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
            Help shouldn't be
            <br />
            <span className="text-primary-600">hard to find.</span>
          </motion.h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            RoadRescue was built on a simple idea: nobody should be stuck on
            the side of the road wondering who to call. We connect drivers
            with trusted, verified mechanics in minutes — with live tracking
            every step of the way.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Our Values"
          title="What drives us"
          subtitle="Four principles that shape every decision we make."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 rounded-2xl border border-slate-100 hover:border-primary-100 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <v.icon className="text-xl" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <SectionHeading
          eyebrow="Our Story"
          title="Built by people who've been stranded too"
          subtitle=""
        />
        <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mx-auto">
          RoadRescue started after our founders spent two hours stuck on a
          highway shoulder with no idea who to call or how far help was.
          That frustration became the blueprint for a platform that shows
          you exactly who's coming, where they are, and when they'll
          arrive — so nobody has to wait in the dark again.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;