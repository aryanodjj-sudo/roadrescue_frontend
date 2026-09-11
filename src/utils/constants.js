// Central place for small fixed values that were previously hardcoded
// inline in individual components (VehicleFormModal, FindMechanic, etc.).
// Pulling them here means changing one of these later doesn't require
// hunting through every file that used the same magic value.

export const APP_NAME = "RoadRescue";

export const CURRENCY_SYMBOL = "₹";

// Used by Register.jsx's password length check and can be reused by
// validators.js below instead of each place re-declaring "6".
export const MIN_PASSWORD_LENGTH = 6;

// Used by VehicleFormModal.jsx's vehicle type <select>.
export const VEHICLE_TYPES = ["Car", "Motorcycle", "SUV", "Truck", "Van"];

// Used by FindMechanic.jsx when geolocation is denied/unavailable.
export const FALLBACK_LOCATION = { lat: 28.6139, lng: 77.209 };

// Must stay in sync with backend/models/ServiceRequest.js REQUEST_STATUSES.
// Duplicated intentionally (frontend/backend are separate deployables),
// same reasoning as calculateDistance.js being mirrored on both sides.
export const REQUEST_STATUSES = [
  "Pending",
  "Accepted",
  "On The Way",
  "Arrived",
  "In Progress",
  "Completed",
  "Cancelled",
];

// Average city driving speed assumed by calculateDistance.js's
// estimateETA() — pulled out here so both the frontend and backend
// copies of that function can reference the same documented assumption.
export const AVERAGE_SPEED_KMH = 30;