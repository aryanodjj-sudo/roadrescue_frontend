import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const MECHANIC_COLOR = "#2563eb"; // primary-600
const CUSTOMER_COLOR = "#0f172a"; // slate-900

// Free, no-key public OSRM demo server — fine for personal/low-traffic use.
// If it's ever unreachable the map still works, the route line just won't draw.
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

function isValidCoord(loc) {
  return (
    loc &&
    typeof loc.lat === "number" &&
    typeof loc.lng === "number" &&
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lng) &&
    Math.abs(loc.lat) <= 90 &&
    Math.abs(loc.lng) <= 180
  );
}

function circleMarker(map, position, color) {
  return L.circleMarker([position.lat, position.lng], {
    radius: 9,
    color: "#ffffff",
    weight: 2,
    fillColor: color,
    fillOpacity: 1,
  }).addTo(map);
}

/**
 * Live map with a customer marker and (optionally) a moving mechanic
 * marker, auto-fit bounds, and a driving route between them.
 *
 * Built on Leaflet + OpenStreetMap tiles — completely free, no API key,
 * no billing account. Purely a rendering layer on top of whatever
 * location props it's given; owns no location state itself.
 */
function LiveTrackingMap({
  customerLocation,
  mechanicLocation = null,
  showRoute = true,
  className = "",
  heightClassName = "h-80",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const mechanicMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");

  const hasCustomer = isValidCoord(customerLocation);
  const hasMechanic = isValidCoord(mechanicLocation);

  // Create the map instance once.
  useEffect(() => {
    if (!hasCustomer) {
      setStatus("error");
      setErrorMessage("Location isn't available for this request yet.");
      return;
    }
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([customerLocation.lat, customerLocation.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapRef.current = map;
      setStatus("ready");
    } catch {
      setStatus("error");
      setErrorMessage("Map failed to load. You can still track status and ETA below.");
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      customerMarkerRef.current = null;
      mechanicMarkerRef.current = null;
      routeLineRef.current = null;
    };
    // Only (re)initialize when we first get valid customer coordinates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomer]);

  // Keep markers, bounds, and the route in sync as locations change.
  useEffect(() => {
    if (status !== "ready" || !mapRef.current) return;
    const map = mapRef.current;

    if (hasCustomer) {
      if (!customerMarkerRef.current) {
        customerMarkerRef.current = circleMarker(map, customerLocation, CUSTOMER_COLOR);
      } else {
        customerMarkerRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
      }
    }

    if (hasMechanic) {
      if (!mechanicMarkerRef.current) {
        mechanicMarkerRef.current = circleMarker(map, mechanicLocation, MECHANIC_COLOR);
      } else {
        mechanicMarkerRef.current.setLatLng([mechanicLocation.lat, mechanicLocation.lng]);
      }
    } else if (mechanicMarkerRef.current) {
      mechanicMarkerRef.current.remove();
      mechanicMarkerRef.current = null;
    }

    if (hasCustomer && hasMechanic) {
      map.fitBounds(
        L.latLngBounds(
          [customerLocation.lat, customerLocation.lng],
          [mechanicLocation.lat, mechanicLocation.lng]
        ),
        { padding: [50, 50] }
      );
    } else if (hasCustomer) {
      map.setView([customerLocation.lat, customerLocation.lng], 14);
    }

    if (showRoute && hasCustomer && hasMechanic) {
      const url = `${OSRM_URL}/${mechanicLocation.lng},${mechanicLocation.lat};${customerLocation.lng},${customerLocation.lat}?overview=full&geometries=geojson`;

      fetch(url)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          const coords = data?.routes?.[0]?.geometry?.coordinates;
          if (!coords || !mapRef.current) return;
          const latLngs = coords.map(([lng, lat]) => [lat, lng]);

          if (routeLineRef.current) {
            routeLineRef.current.setLatLngs(latLngs);
          } else {
            routeLineRef.current = L.polyline(latLngs, {
              color: MECHANIC_COLOR,
              weight: 4,
            }).addTo(mapRef.current);
          }
        })
        .catch(() => {
          // Route is a nice-to-have; a failed lookup should never take
          // down the map — the markers and bounds already work fine.
        });
    } else if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
  }, [status, hasCustomer, hasMechanic, customerLocation, mechanicLocation, showRoute]);

  if (status === "error") {
    return (
      <div
        className={`${heightClassName} ${className} rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center px-6`}
      >
        <FaExclamationTriangle className="text-amber-500 text-xl mb-2" />
        <p className="text-sm text-slate-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${heightClassName} ${className}`}>
      {status === "loading" && (
        <div className="absolute inset-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center z-10">
          <FaSpinner className="animate-spin text-primary-600 text-xl" />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden border border-slate-100"
      />
    </div>
  );
}

export default LiveTrackingMap;