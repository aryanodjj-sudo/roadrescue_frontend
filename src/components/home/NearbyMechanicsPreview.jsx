import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaLocationArrow, FaStar, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

// Public, login-free preview of the real nearby-mechanic search that
// powers the logged-in Find Mechanic page — placed right on the homepage
// so a first-time visitor can see live results near them before ever
// creating an account. Hits the same /mechanics/nearby endpoint.
function NearbyMechanicsPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState("idle"); // idle | loading | done | denied | error
  const [mechanics, setMechanics] = useState([]);

  const handleSearch = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data } = await api.get("/mechanics/nearby", {
            params: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              sortBy: "distance",
            },
          });
          setMechanics(data.mechanics.slice(0, 3));
          setStatus("done");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied")
    );
  };

  const handleViewAll = () => {
    navigate(user ? "/dashboard/find-mechanic" : "/login");
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
          Live Search
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Find mechanics near you right now
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-10">
          Allow location access and see real, verified mechanics ranked by
          distance from where you are — no sign-up needed to look.
        </p>

        {status === "idle" && (
          <Button variant="primary" onClick={handleSearch}>
            <FaLocationArrow /> Find Mechanics Near Me
          </Button>
        )}

        {status === "loading" && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {status === "denied" && (
          <p className="text-amber-600 font-medium">
            Location access denied. Enable location permission in your
            browser and try again.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 font-medium">
            Couldn't load nearby mechanics right now. Please try again in a
            moment.
          </p>
        )}

        {status === "done" && mechanics.length === 0 && (
          <p className="text-slate-500">
            No mechanics are online near you right now — check back shortly.
          </p>
        )}

        {status === "done" && mechanics.length > 0 && (
          <>
            <div className="grid sm:grid-cols-3 gap-5 mt-4 text-left">
              {mechanics.map((mechanic) => (
                <motion.div
                  key={mechanic.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 border-2 border-slate-100"
                >
                  <h3 className="font-semibold text-slate-900 truncate">
                    {mechanic.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                    <FaStar />
                    <span className="font-medium">{mechanic.rating}</span>
                    <span className="text-slate-400">
                      ({mechanic.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-3">
                    <FaMapMarkerAlt className="text-primary-600" />
                    {mechanic.distanceKm.toFixed(1)} km away · {mechanic.etaMinutes} min ETA
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="outline" className="mt-8" onClick={handleViewAll}>
              View All Nearby Mechanics <FaArrowRight />
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

export default NearbyMechanicsPreview;