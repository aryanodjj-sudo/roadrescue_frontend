function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600",
    accent: "bg-accent-500/10 text-accent-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tones[tone]}`}>
        <Icon className="text-base" />
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export default StatCard;