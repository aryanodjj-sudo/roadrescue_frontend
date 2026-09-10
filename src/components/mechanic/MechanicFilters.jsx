const SORT_OPTIONS = [
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "price", label: "Lowest Price" },
];

function MechanicFilters({ sortBy, setSortBy, minRating, setMinRating }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        {[0, 4, 4.5].map((r) => (
          <button
            key={r}
            onClick={() => setMinRating(r)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              minRating === r
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
            }`}
          >
            {r === 0 ? "All Ratings" : `${r}+ ⭐`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MechanicFilters;