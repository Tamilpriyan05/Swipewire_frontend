export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500" role="status" aria-live="polite">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute h-8 w-8 animate-ping rounded-full bg-indigo-500/20" />
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 border-r-indigo-600" />
      </div>
      <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">{label}</span>
    </div>
  );
}
