import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserFriends, FaTools, FaChevronDown, FaGasPump, FaCheck } from "react-icons/fa";
import { PiTireLight } from "react-icons/pi";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import {
  servicesData,
  FUEL_PRICES,
  FUEL_FREE_DELIVERY_LITRES,
  calculateFuelBill,
  TYRE_POSITIONS,
  TYRE_PROBLEMS,
} from "../data/servicesData";
import { useVehicles } from "../context/VehicleContext";

function ToggleTwo({ leftLabel, rightLabel, value, leftValue, rightValue, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-xl p-1">
      {[
        [leftValue, leftLabel],
        [rightValue, rightLabel],
      ].map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
            value === val ? "bg-white text-primary-600 shadow-sm" : "text-slate-500"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicles } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || "");
  const [expandedService, setExpandedService] = useState(null);

  const [highlightService, setHighlightService] = useState(null);
  const cardRefs = useRef({});
  // --- Fields shared by every service (reset whenever a different
  // service card is expanded, via selectService() below) -------------
  const [description, setDescription] = useState("");
  const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
  const [recipient, setRecipient] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState({ line: "", landmark: "", city: "", pincode: "" });

  // --- Fuel Delivery specific fields -----------------------------------
  const [fuelType, setFuelType] = useState("petrol");
  const [fuelLitres, setFuelLitres] = useState("");

// --- Flat Tyre Repair specific fields ---------------------------------
// Multiple tyres can be affected, and each can have more than one
// problem, so both are kept as arrays instead of single values.
const [tyreVehicleType, setTyreVehicleType] = useState("car");
const [tyrePositions, setTyrePositions] = useState([]);
const [tyreProblems, setTyreProblems] = useState([]);

const [formError, setFormError] = useState("");

const resetServiceFields = () => {
  setFormError("");
  setDescription("");
  setBookingForSomeoneElse(false);
  setRecipient({ name: "", phone: "" });
  setAddress({ line: "", landmark: "", city: "", pincode: "" });
  setFuelType("petrol");
  setFuelLitres("");
  setTyreVehicleType("car");
  setTyrePositions([]);
  setTyreProblems([]);
};

const toggleTyrePosition = (id) => {
  setTyrePositions((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  );
};

const toggleTyreProblem = (id) => {
  setTyreProblems((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  );
};

  const selectService = (id) => {
    if (expandedService === id) {
      setExpandedService(null);
      return;
    }
    setExpandedService(id);
    resetServiceFields();
  };

  // Homepage se ya login ke baad jo service bheji gayi hai usko
  // auto-expand + scroll + highlight karta hai
  useEffect(() => {
    const targetId = location.state?.openService;
    if (!targetId || !servicesData.some((s) => s.id === targetId)) return;

    setExpandedService(targetId);
    resetServiceFields();
    setHighlightService(targetId);

    const scrollTimer = setTimeout(() => {
      cardRefs.current[targetId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);

    const highlightTimer = setTimeout(() => setHighlightService(null), 2200);

    navigate(location.pathname, { replace: true, state: {} });

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const recipientValid =
    !bookingForSomeoneElse ||
    (recipient.name.trim() && recipient.phone.trim() && address.line.trim());

  const fuelBill = calculateFuelBill(fuelType, fuelLitres);

  const handleContinue = (service) => {
    setFormError("");

    if (!selectedVehicle) {
      setFormError("Select a vehicle first.");
      return;
    }
    if (!recipientValid) {
      setFormError("Recipient name, phone and address line are required.");
      return;
    }

    let serviceDetails = null;

    if (service.id === "fuel") {
      const litresNum = Number(fuelLitres);
      if (!fuelType || !litresNum || litresNum <= 0) {
        setFormError("Select fuel type and enter how many litres you need.");
        return;
      }
      serviceDetails = { fuelType, litres: litresNum };
    }

    if (service.id === "tyre") {
  if (!tyreVehicleType || tyrePositions.length === 0 || tyreProblems.length === 0) {
    setFormError("Select at least one tyre and at least one problem.");
    return;
  }
  serviceDetails = { tyreVehicleType, tyrePositions, tyreProblems };
}

    const params = new URLSearchParams({ service: service.id, vehicle: selectedVehicle });
    navigate(`/dashboard/find-mechanic?${params.toString()}`, {
      state: {
        description,
        bookingForSomeoneElse,
        recipient: bookingForSomeoneElse ? recipient : undefined,
        address: bookingForSomeoneElse ? address : undefined,
        serviceDetails,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white mb-8">
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-semibold uppercase tracking-wide mb-2">
            Roadside Assistance
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Get Assistance</h1>
          <p className="text-primary-50 text-sm">
            Tap a service below to fill in the details and continue — no extra clicks.
          </p>
        </div>
        <FaTools className="absolute -right-6 -bottom-8 text-[180px] text-white/10 rotate-12" />
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-amber-50 text-amber-700 rounded-xl px-5 py-4 text-sm font-medium mb-8">
          You need to add a vehicle before requesting a service.{" "}
          <button
            onClick={() => navigate("/dashboard/vehicles")}
            className="underline font-semibold"
          >
            Add one now
          </button>
        </div>
      ) : (
        <div className="mb-8 max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Vehicle
          </label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} — {v.plateNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="block text-sm font-medium text-slate-700 mb-3">
        Select Service Type
      </label>

      <div className="space-y-4">
        {servicesData.map((service) => {
          const Icon = service.icon;
          const isExpanded = expandedService === service.id;

          const isHighlighted = highlightService === service.id;

          return (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[service.id] = el)}
              className={`bg-white rounded-2xl border-2 overflow-hidden transition-shadow duration-500 ${
                isExpanded ? "border-primary-600" : "border-slate-100 hover:border-primary-200"
              } ${
                isHighlighted
                  ? "ring-4 ring-primary-200 shadow-lg shadow-primary-100"
                  : "ring-0 ring-transparent"
              }`}
              style={{ transition: "box-shadow 0.5s ease, border-color 0.3s ease" }}
            >
              <button
                type="button"
                onClick={() => selectService(service.id)}
                className="w-full flex items-center gap-4 text-left p-5"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isExpanded ? "bg-primary-600" : "bg-primary-50"
                  }`}
                >
                  <Icon className={`text-lg ${isExpanded ? "text-white" : "text-primary-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{service.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{service.description}</p>
                </div>
                <FaChevronDown
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="expanded-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-5">
                  {/* --- Fuel Delivery fields --- */}
                  {service.id === "fuel" && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <FaGasPump className="text-primary-600" /> Fuel Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            Fuel Type
                          </label>
                          <ToggleTwo
                            value={fuelType}
                            onChange={setFuelType}
                            leftValue="petrol"
                            leftLabel={`Petrol (Rs.${FUEL_PRICES.petrol}/L)`}
                            rightValue="diesel"
                            rightLabel={`Diesel (Rs.${FUEL_PRICES.diesel}/L)`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            Litres Needed
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={fuelLitres}
                            onChange={(e) => setFuelLitres(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                          />
                          <p className="text-xs text-slate-400 mt-1.5">
                            Order {FUEL_FREE_DELIVERY_LITRES}L or more and delivery is free.
                          </p>
                        </div>
                      </div>

                      {Number(fuelLitres) > 0 && (
                        <div className="bg-white rounded-lg px-4 py-3 text-sm space-y-1.5 border border-slate-100">
                          <div className="flex justify-between text-slate-500">
                            <span>Fuel cost ({fuelLitres}L × Rs.{fuelBill.rate})</span>
                            <span>Rs.{fuelBill.fuelCost}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Delivery charge</span>
                            <span className={fuelBill.deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                              {fuelBill.deliveryCharge === 0 ? "FREE" : `Rs.${fuelBill.deliveryCharge}`}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                            <span>Estimated Total</span>
                            <span>Rs.{fuelBill.total}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

{/* --- Flat Tyre Repair fields --- */}
{service.id === "tyre" && (
  <div className="bg-slate-50 rounded-xl p-4 space-y-5">
    <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
      <PiTireLight className="text-primary-600" /> Tyre Details
    </p>

    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        Vehicle Type
      </label>
      <ToggleTwo
        value={tyreVehicleType}
        onChange={(v) => {
          setTyreVehicleType(v);
          setTyrePositions([]);
        }}
        leftValue="car"
        leftLabel="Car"
        rightValue="bike"
        rightLabel="Bike"
      />
    </div>

    {/* Which tyre(s) — multi-select, since more than one
        tyre can have an issue at the same time */}
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-slate-500">
          Which Tyre(s)?{" "}
          <span className="text-slate-400 font-normal">select all that apply</span>
        </label>
        {tyrePositions.length > 0 && (
          <span className="text-[11px] font-semibold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full shrink-0">
            {tyrePositions.length} selected
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TYRE_POSITIONS[tyreVehicleType].map((pos) => {
          const active = tyrePositions.includes(pos.id);
          return (
            <button
              key={pos.id}
              type="button"
              onClick={() => toggleTyrePosition(pos.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                active
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-200"
              }`}
            >
              <span
                className={`flex items-center justify-center w-4 h-4 rounded-[5px] border-2 shrink-0 transition-colors ${
                  active ? "bg-primary-600 border-primary-600" : "border-slate-300 bg-white"
                }`}
              >
                {active && <FaCheck className="text-[9px] text-white" />}
              </span>
              {pos.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* What's the problem — multi-select chips, since a
        tyre (or set of tyres) can have more than one issue */}
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-slate-500">
          What's the Problem?{" "}
          <span className="text-slate-400 font-normal">select all that apply</span>
        </label>
        {tyreProblems.length > 0 && (
          <span className="text-[11px] font-semibold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full shrink-0">
            {tyreProblems.length} selected
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {TYRE_PROBLEMS.map((p) => {
          const active = tyreProblems.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleTyreProblem(p.id)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                active
                  ? "border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary-200"
              }`}
            >
              {active && <FaCheck className="text-[10px]" />}
              {p.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Live summary so the user can double-check everything
        they picked before continuing */}
    {(tyrePositions.length > 0 || tyreProblems.length > 0) && (
      <div className="bg-white rounded-lg px-4 py-3 text-xs text-slate-500 border border-slate-100 leading-relaxed">
        <span className="font-semibold text-slate-600">Summary: </span>
        {tyreVehicleType === "car" ? "Car" : "Bike"}
        {tyrePositions.length > 0 && (
          <>
            {" · "}
            {tyrePositions
              .map((id) => TYRE_POSITIONS[tyreVehicleType].find((pos) => pos.id === id)?.label)
              .filter(Boolean)
              .join(", ")}{" "}
            tyre{tyrePositions.length > 1 ? "s" : ""}
          </>
        )}
        {tyreProblems.length > 0 && (
          <>
            {" · "}
            {tyreProblems
              .map((id) => TYRE_PROBLEMS.find((prob) => prob.id === id)?.label)
              .filter(Boolean)
              .join(", ")}
          </>
        )}
      </div>
    )}
  </div>
)}

                  {/* --- Book for yourself / someone else --- */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Who needs this service?
                    </label>
                    <ToggleTwo
                      value={bookingForSomeoneElse ? "someone" : "self"}
                      onChange={(v) => setBookingForSomeoneElse(v === "someone")}
                      leftValue="self"
                      leftLabel="Myself"
                      rightValue="someone"
                      rightLabel="Someone Else"
                    />

                    {bookingForSomeoneElse && (
                      <div className="mt-4 space-y-4 bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <FaUserFriends className="text-primary-600" /> Enter their details and
                          exact location so the mechanic can reach them directly.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                              Recipient Name
                            </label>
                            <input
                              type="text"
                              value={recipient.name}
                              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                              placeholder="e.g. Mom"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                              Recipient Phone
                            </label>
                            <input
                              type="tel"
                              value={recipient.phone}
                              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            Address Line
                          </label>
                          <input
                            type="text"
                            value={address.line}
                            onChange={(e) => setAddress({ ...address, line: e.target.value })}
                            placeholder="House / Flat no., Street, Area"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                              Landmark <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                              type="text"
                              value={address.landmark}
                              onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                              placeholder="Near..."
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">City</label>
                            <input
                              type="text"
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Pincode</label>
                            <input
                              type="text"
                              value={address.pincode}
                              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- Description --- */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Describe the problem{" "}
                      <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="e.g. Car won't start, makes a clicking sound when I turn the key..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {description.length}/500
                    </p>
                  </div>

                  {formError && (
                    <p className="text-sm text-red-500 font-medium">{formError}</p>
                  )}

                  <Button
                    variant="primary"
                    className="w-full justify-center py-3"
                    onClick={() => handleContinue(service)}
                  >
                    Continue
                  </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default Services;