import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { servicesData } from "../data/servicesData";
import { useVehicles } from "../context/VehicleContext";

function Services() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(
    vehicles[0]?.id || ""
  );
  const [description, setDescription] = useState("");

  const handleContinue = () => {
    const params = new URLSearchParams({
      service: selectedService,
      vehicle: selectedVehicle,
      description,
    });
    navigate(`/dashboard/find-mechanic?${params.toString()}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Get Assistance</h1>
        <p className="text-slate-500 mt-1">
          Choose a service and vehicle to request help.
        </p>
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
                <Icon
                  className={`text-lg ${
                    isSelected ? "text-white" : "text-primary-600"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {service.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* NEW: problem/breakdown description — required by spec, was missing */}
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

      <Button
        variant="primary"
        className="py-3 px-8"
        disabled={!selectedService || !selectedVehicle}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </DashboardLayout>
  );
}

export default Services;