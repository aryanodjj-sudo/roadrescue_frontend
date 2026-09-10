function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-12`}>
      {eyebrow && (
        <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export default SectionHeading;