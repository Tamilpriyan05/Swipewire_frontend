/**
 * ConfirmModal — beautiful confirmation dialog. No browser alert().
 * Props:
 *   open      boolean
 *   onClose   () => void
 *   onConfirm () => void
 *   title     string
 *   message   string
 *   confirmLabel  string   (default 'Delete')
 *   variant   'danger' | 'warning'  (default 'danger')
 *   loading   boolean
 */
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  variant = 'danger',
  loading = false,
}) {
  const isDanger = variant === 'danger';

  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
          isDanger ? 'bg-rose-100' : 'bg-amber-100'
        }`}>
          {isDanger
            ? <Trash2 size={24} className="text-rose-600" />
            : <AlertTriangle size={24} className="text-amber-600" />
          }
        </div>

        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
