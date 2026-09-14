import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaLocationArrow, FaUserFriends } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import MechanicCard from "../components/mechanic/MechanicCard";
import MechanicFilters from "../components/mechanic/MechanicFilters";
import Button from "../components/common/Button";
import api from "../utils/api";
import { useVehicles } from "../context/VehicleContext";

// Same coordinates the backend seed script uses for its demo mechanics.
const FALLBACK_LOCATION = { lat: 28.6139, lng: 77.209 };

function FindMechanic() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { vehicles } = useVehicles();

  const serviceType = searchParams.get("service");
  const vehicleId = searchParams.get("vehicle");
  const description = searchParams.get("description") || "";
  const vehicle = vehicles.find((v) => v.id === vehicleId) || null;

  // Passed forward from Services.jsx when "booking for someone else" is on
  const { bookingForSomeoneElse, recipient, address } = location.state || {};

  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [sortBy, setSortBy] = useState("distance");
  const [minRating, setMinRating] = useState(0);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(false);
  const [error, setError] = useState("");

  const detectLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setUserLocation(FALLBACK_LOCATION);
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("granted");
      },
      () => {
        setUserLocation(FALLBACK_LOCATION);
        setLocationStatus("denied");
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // Fetch real nearby mechanics whenever location or filters change
  useEffect(() => {
    if (!userLocation) return;
    setIsLoadingMechanics(true);
    setError("");
    api
      .get("/mechanics/nearby", {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          service: serviceType || undefined,
          minRating: minRating || undefined,
          sortBy,
        },
      })
      .then(({ data }) => {
        setMechanics(
          data.mechanics.map((m) => ({
            ...m,
            image: `https://i.pravatar.cc/150?u=${m.id}`,
          }))
        );
      })
      .catch((err) => setError(err.message || "Could not load nearby mechanics."))
      .finally(() => setIsLoadingMechanics(false));
  }, [userLocation, serviceType, minRating, sortBy]);

  const handleContinue = () => {
    navigate("/dashboard/booking", {
      state: {
        mechanic: selectedMechanic,
        serviceType,
        vehicle,
        description,
        customerLocation: userLocation,
        bookingForSomeoneElse,
        recipient,
        address,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nearby Mechanics</h1>
        <p className="text-slate-500 mt-1">
          {serviceType
            ? `Showing mechanics available for "${serviceType}"`
            : "Compare mechanics near your location."}
        </p>
      </div>

      {bookingForSomeoneElse && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 mb-6 text-sm">
          <FaUserFriends className="text-amber-600 shrink-0" />
          <span className="text-amber-700">
            Booking for <span className="font-semibold">{recipient?.name}</span> at{" "}
            {address?.line}
            {address?.city ? `, ${address.city}` : ""}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-5 py-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <FaMapMarkerAlt className="text-primary-600" />
          {locationStatus === "loading" && <span className="text-slate-500">Detecting your location...</span>}
          {locationStatus === "granted" && <span className="text-slate-700 font-medium">Using your current location</span>}
          {locationStatus === "denied" && (
            <span className="text-amber-600 font-medium">
              Location access denied — showing results near a default area
            </span>
          )}
        </div>
        <button onClick={detectLocation} className="flex items-center gap-1.5 text-primary-600 text-sm font-semibold">
          <FaLocationArrow className="text-xs" /> Re-detect
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      {locationStatus === "loading" || isLoadingMechanics ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <MechanicFilters sortBy={sortBy} setSortBy={setSortBy} minRating={minRating} setMinRating={setMinRating} />

          {mechanics.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
              <p className="text-slate-500">No mechanics match your filters right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {mechanics.map((mechanic) => (
                <MechanicCard
                  key={mechanic.id}
                  mechanic={mechanic}
                  isSelected={selectedMechanic?.id === mechanic.id}
                  onSelect={setSelectedMechanic}
                />
              ))}
            </div>
          )}

          {selectedMechanic && (
            <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-sm text-slate-500">Selected mechanic</p>
                <p className="font-semibold text-slate-900">{selectedMechanic.name}</p>
              </div>
              <Button variant="primary" className="py-3 px-8" onClick={handleContinue}>
                Confirm Request
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default FindMechanic;