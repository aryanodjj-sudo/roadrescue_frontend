import { FaGasPump } from "react-icons/fa";
import { PiTireLight } from "react-icons/pi";
import { TYRE_POSITIONS, TYRE_PROBLEMS } from "../../data/servicesData";

// Shown wherever a service request is displayed, so both the mechanic and
// the customer clearly see exactly what was ordered — which fuel/how much,
// or which tyre and what's wrong with it. Renders nothing for services
// that don't carry extra details.
function ServiceDetailsBadge({ request }) {
  const details = request?.serviceDetails;
  if (!details) return null;

  if (request.serviceType === "fuel" && details.fuelType && details.litres) {
    return (
      <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sm">
        <p className="flex items-center gap-2 font-semibold text-primary-700 capitalize">
          <FaGasPump /> {details.litres}L {details.fuelType}
        </p>
      </div>
    );
  }

  if (
  request.serviceType === "tyre" &&
  details.tyrePositions?.length > 0 &&
  details.tyreProblems?.length > 0
) {
  const positionLabels = details.tyrePositions
    .map((id) => TYRE_POSITIONS[details.tyreVehicleType]?.find((p) => p.id === id)?.label || id)
    .join(", ");
  const problemLabels = details.tyreProblems
    .map((id) => TYRE_PROBLEMS.find((p) => p.id === id)?.label || id)
    .join(", ");

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sm">
      <p className="flex items-center gap-2 font-semibold text-primary-700">
        <PiTireLight />
        {details.tyreVehicleType === "car" ? "Car" : "Bike"} · {positionLabels} tyre
        {details.tyrePositions.length > 1 ? "s" : ""}
      </p>
      <p className="text-primary-600 mt-1">{problemLabels}</p>
    </div>
  );
}

  return null;
}

export default ServiceDetailsBadge;