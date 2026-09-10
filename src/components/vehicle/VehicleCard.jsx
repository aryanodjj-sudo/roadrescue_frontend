import { Link } from "react-router-dom";
import { FaCarSide, FaEdit, FaTrash, FaChevronRight } from "react-icons/fa";

function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
          <FaCarSide className="text-xl text-primary-600" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(vehicle)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary-600 transition-colors"
            aria-label="Edit vehicle"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Delete vehicle"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-lg">
        {vehicle.make} {vehicle.model}
      </h3>
      <p className="text-sm text-slate-400 mb-4">{vehicle.year}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
          {vehicle.type}
        </span>
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
          {vehicle.plateNumber}
        </span>
      </div>

      <Link
        to={`/dashboard/vehicles/${vehicle.id}`}
        className="flex items-center justify-between text-sm font-semibold text-primary-600 pt-4 border-t border-slate-100"
      >
        View Details <FaChevronRight className="text-xs" />
      </Link>
    </div>
  );
}

export default VehicleCard;