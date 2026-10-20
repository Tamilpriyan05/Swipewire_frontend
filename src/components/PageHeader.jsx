export default function PageHeader({ badge, title, subtitle, children, className = '' }) {
  return (
    <div className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        {badge && (
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-500">{badge}</p>
        )}
        <h1 className="mt-1 text-2xl font-black text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
