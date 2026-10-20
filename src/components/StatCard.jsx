export default function StatCard({ icon: Icon, label, value, sub, accent = 'indigo', className = '' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900">
            {value ?? '—'}
          </p>
          {sub && <p className="mt-1 truncate text-xs text-slate-400">{sub}</p>}
        </div>
        <span
          className={`shrink-0 rounded-xl border p-2 sm:p-2.5 ${
            colors[accent] || colors.slate
          }`}
        >
          <Icon size={20} className="sm:h-[22px] sm:w-[22px]" />
        </span>
      </div>
    </div>
  );
}
