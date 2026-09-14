import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaTools } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { servicesData } from "../data/servicesData";
import { useVehicles } from "../context/VehicleContext";

function Services() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || "");
  const [description, setDescription] = useState("");

  const [bookingForSomeoneElse, setBookingForSomeoneElse] = useState(false);
  const [recipient, setRecipient] = useState({ name: "", phone: "" });
  const [address, setAddress] = useState({ line: "", landmark: "", city: "", pincode: "" });

  const recipientValid =
    !bookingForSomeoneElse ||
    (recipient.name.trim() && recipient.phone.trim() && address.line.trim());

  const handleContinue = () => {
    const params = new URLSearchParams({
      service: selectedService,
      vehicle: selectedVehicle,
      description,
    });
    navigate(`/dashboard/find-mechanic?${params.toString()}`, {
      state: bookingForSomeoneElse ? { bookingForSomeoneElse, recipient, address } : undefined,
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
            Choose a service and vehicle — we'll match you with a nearby mechanic in minutes.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {servicesData.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`text-left bg-white rounded-2xl p-5 border-2 transition-colors ${
                isSelected
                  ? "border-primary-600 bg-primary-50"
                  : "border-slate-100 hover:border-primary-200"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? "bg-primary-600" : "bg-primary-50"
                }`}
              >
                <Icon className={`text-lg ${isSelected ? "text-white" : "text-primary-600"}`} />
              </div>
              <h3 className="font-semibold text-slate-900">{service.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{service.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mb-8 max-w-2xl">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Describe the problem{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="e.g. Car won't start, makes a clicking sound when I turn the key..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">
          {description.length}/500
        </p>
      </div>

      <div className="mb-8 max-w-2xl bg-white rounded-2xl border border-slate-100 p-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="flex items-center gap-2 font-medium text-slate-800">
            <FaUserFriends className="text-primary-600" />
            Requesting this for someone else?
          </span>
          <input
            type="checkbox"
            checked={bookingForSomeoneElse}
            onChange={(e) => setBookingForSomeoneElse(e.target.checked)}
            className="w-5 h-5 accent-primary-600"
          />
        </label>

        {bookingForSomeoneElse && (
          <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-400">
              Enter their details and exact location so the mechanic can reach them directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                  placeholder="e.g. Mom"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipient Phone
                </label>
                <input
                  type="tel"
                  value={recipient.phone}
                  onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address Line
              </label>
              <input
                type="text"
                value={address.line}
                onChange={(e) => setAddress({ ...address, line: e.target.value })}
                placeholder="House / Flat no., Street, Area"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Landmark <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="Near..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {!recipientValid && (
              <p className="text-xs text-red-500">
                Recipient name, phone and address line are required.
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        className="py-3 px-8"
        disabled={!selectedService || !selectedVehicle || !recipientValid}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </DashboardLayout>
  );
}

export default Services;