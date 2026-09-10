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