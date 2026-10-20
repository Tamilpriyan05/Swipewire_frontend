import { forwardRef } from 'react';
import { Pencil, Plus } from 'lucide-react';

const FormCard = forwardRef(function FormCard(
  {
    isEditing = false,
    defaultIcon: DefaultIcon,
    editIcon: EditIcon = Pencil,
    title,
    editTitle,
    subtitle,
    editSubtitle,
    onCancelEdit,
    cancelLabel = 'New',
    children,
    className = '',
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`h-fit rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 ${
        isEditing ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
      } ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`shrink-0 rounded-xl p-2.5 transition ${
              isEditing ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            {isEditing ? <EditIcon size={18} /> : DefaultIcon ? <DefaultIcon size={18} /> : null}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-bold text-slate-900">
              {isEditing ? (editTitle || `Edit ${title}`) : (title || 'Add')}
            </h2>
            <p className="truncate text-xs text-slate-400">
              {isEditing ? editSubtitle : subtitle}
            </p>
          </div>
        </div>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            title="Cancel editing"
          >
            <Plus size={13} /> {cancelLabel}
          </button>
        )}
      </div>

      {children}
    </div>
  );
});

export default FormCard;
