import { FaCarBattery, FaTruckPickup, FaTools, FaGasPump } from "react-icons/fa";
import { PiTireLight } from "react-icons/pi";

export const servicesData = [
  {
    id: "breakdown",
    title: "Breakdown Repair",
    description: "On-spot diagnosis and repair for engine, electrical, and mechanical breakdowns.",
    icon: FaTools,
  },
  {
    id: "towing",
    title: "Towing",
    description: "Fast, safe towing to the nearest garage or your preferred location.",
    icon: FaTruckPickup,
  },
  {
    id: "battery",
    title: "Battery Jump-Start",
    description: "Dead battery? Get an instant jump-start wherever you're stranded.",
    icon: FaCarBattery,
  },
  {
    id: "tyre",
    title: "Flat Tyre Repair",
    description: "Quick tyre repair or replacement, no need to wait for a garage.",
    icon: PiTireLight,
  },
  {
    id: "fuel",
    title: "Fuel Delivery",
    description: "Ran out of fuel? We deliver petrol or diesel straight to your location.",
    icon: FaGasPump,
  },
];

// --- Fuel Delivery pricing -------------------------------------------
// For fuel delivery, the bill is NOT the mechanic's own price — it's
// fuel cost (rate x litres) + a flat delivery charge, same for every
// mechanic. Keep these numbers in sync with the backend's
// utils/pricing.js, which is the authoritative source used to compute
// the actual charge on the server.
export const FUEL_PRICES = { petrol: 105, diesel: 100 }; // Rs per litre
export const FUEL_FREE_DELIVERY_LITRES = 5; // 5L or more => free delivery
export const FUEL_DELIVERY_CHARGE = 100; // Rs, flat, waived at/above the litres above

export function calculateFuelBill(fuelType, litres) {
  const rate = FUEL_PRICES[fuelType] || 0;
  const qty = Number(litres) || 0;
  const fuelCost = Math.round(rate * qty);
  const deliveryCharge = qty >= FUEL_FREE_DELIVERY_LITRES ? 0 : FUEL_DELIVERY_CHARGE;
  return { rate, fuelCost, deliveryCharge, total: fuelCost + deliveryCharge };
}

// --- Flat Tyre Repair options -----------------------------------------
export const TYRE_POSITIONS = {
  car: [
    { id: "front-left", label: "Front Left" },
    { id: "front-right", label: "Front Right" },
    { id: "back-left", label: "Back Left" },
    { id: "back-right", label: "Back Right" },
  ],
  bike: [
    { id: "front", label: "Front" },
    { id: "back", label: "Back" },
  ],
};

export const TYRE_PROBLEMS = [
  { id: "puncture", label: "Puncture" },
  { id: "air-fill", label: "Air Filling / Low Pressure" },
  { id: "burst", label: "Tyre Burst" },
  { id: "valve-issue", label: "Valve Issue / Leaking Air" },
  { id: "replacement", label: "Full Tyre Replacement" },
  { id: "alignment", label: "Alignment / Balancing Issue" },
];