export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-slate-500" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      {label}
    </div>
  );
}
