import { Inbox } from 'lucide-react';

export default function EmptyState({ message, icon: Icon = Inbox, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-dashed border-slate-300 p-8 sm:p-10 text-center text-sm text-slate-400 ${className}`}
    >
      <Icon size={28} className="mx-auto mb-2 text-slate-300" />
      <p>{message}</p>
    </div>
  );
}
