import { Inbox } from 'lucide-react';

export default function EmptyState({ message, icon: Icon = Inbox, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/70 p-10 sm:p-14 text-center backdrop-blur-xs ${className}`}
    >
      <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50/80 text-indigo-600 ring-8 ring-indigo-50/40">
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <p className="max-w-md text-sm font-medium text-slate-600 leading-relaxed">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
