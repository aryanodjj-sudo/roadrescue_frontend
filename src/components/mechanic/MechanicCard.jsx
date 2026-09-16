import { FaStar, FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { formatPrice } from "../../utils/formatPrice";

// priceOverride: { label, value } — when set (e.g. Fuel Delivery), shows a
// flat delivery charge instead of the mechanic's own pricePerVisit, since
// for that service every mechanic charges the customer the same amount.
function MechanicCard({ mechanic, onSelect, priceOverride }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mechanic)}
      className="text-left bg-white rounded-2xl p-5 border-2 border-slate-100 hover:border-primary-600 transition-colors w-full"
    >
      <div className="flex items-start gap-4">
        <img
          src={mechanic.image}
          alt={mechanic.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">
              {mechanic.name}
            </h3>
            {mechanic.verified && (
              <FaCheckCircle className="text-primary-600 text-sm shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
            <FaStar />
            <span className="font-medium">{mechanic.rating}</span>
            <span className="text-slate-400">
              ({mechanic.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt /> {mechanic.distanceKm} km away
        </span>
        <span className="flex items-center gap-1">
          <FaClock /> {mechanic.etaMinutes} min ETA
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {mechanic.services.map((s) => (
          <span
            key={s}
            className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-medium capitalize"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400">
            {priceOverride ? priceOverride.label : "Estimated cost"}
          </p>
          <p className="font-bold text-slate-900">
            {priceOverride ? formatPrice(priceOverride.value) : formatPrice(mechanic.pricePerVisit)}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm">
          Select <FaArrowRight className="text-xs" />
        </span>
      </div>
    </button>
  );
}

export default MechanicCard;