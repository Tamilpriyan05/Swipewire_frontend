/**
 * AdminCategories — Create, Edit, Delete, View categories.
 * • Duplicate name check (front-end + back-end 409)
 * • Custom confirm modal (no window.alert)
 * • Edit modal with name + description
 * • View modal showing category details
 */
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Trash2, Pencil, Eye, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../lib/api';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

const ACCENT = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
];

export default function AdminCategories() {
  const qc = useQueryClient();
  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);

  const [viewCat, setViewCat] = useState(null);
  const [deletingCat, setDeletingCat] = useState(null);

  /* ── Queries ───────────────────────────────────────────────── */
  const categoriesQ = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  /* ── Mutations ─────────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: (payload) => api.post('/categories', payload),
    onSuccess: (res) => {
      toast.success(`Category "${res.data.data.name}" created!`);
      setName('');
      setDescription('');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }) => api.put(`/categories/${id}`, payload),
    onSuccess: (res) => {
      toast.success(`Category updated to "${res.data.data.name}".`);
      setEditingCategory(null);
      setName('');
      setDescription('');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Category deleted.');
      if (editingCategory?.id === deletingCat?.id) {
        setEditingCategory(null);
        setName('');
        setDescription('');
      }
      setDeletingCat(null);
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => { toast.error(getErrorMessage(err)); setDeletingCat(null); },
  });

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleStartEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error('Enter a category name.');

    if (editingCategory) {
      const dup = (categoriesQ.data || []).some(
        (c) => c.id !== editingCategory.id && c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (dup) return toast.error(`Category "${trimmed}" already exists.`);
      updateMut.mutate({ id: editingCategory.id, name: trimmed, description: description.trim() });
    } else {
      const dup = (categoriesQ.data || []).some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
      if (dup) return toast.error(`Category "${trimmed}" already exists.`);
      createMut.mutate({ name: trimmed, description: description.trim() });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-500">Catalogue</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Categories</h1>

      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* ── Add / Edit form (reused on page) ─────────────── */}
        <div ref={formRef} className={`h-fit rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${editingCategory ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          }`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`rounded-xl p-2.5 transition ${editingCategory ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                }`}>
                {editingCategory ? <Pencil size={18} /> : <Layers size={18} />}
              </span>
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingCategory ? `Editing: ${editingCategory.name}` : 'Name must be unique.'}
                </p>
              </div>
            </div>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                title="Cancel update and add a new category"
              >
                <Plus size={13} /> New Category
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics, Clothing…"
                maxLength={100}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description…"
                rows={3}
                maxLength={500}
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {editingCategory ? (
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="block 
                  rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMut.isPending || !name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                >
                  <Check size={16} />
                  {updateMut.isPending ? 'Updating…' : 'Update Category'}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={createMut.isPending || !name.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus size={16} />
                {createMut.isPending ? 'Creating…' : 'Create Category'}
              </button>
            )}
          </form>
        </div>

        {/* ── Category grid ───────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All Categories</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {categoriesQ.data?.length || 0} total
            </span>
          </div>

          {categoriesQ.isPending ? <Loading label="Loading categories…" /> :
            categoriesQ.isError ? (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle size={16} />{getErrorMessage(categoriesQ.error)}
              </div>
            ) : !categoriesQ.data?.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                No categories yet. Add your first category using the form.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {categoriesQ.data.map((cat, i) => {
                  const isSelected = editingCategory?.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`group relative flex flex-col rounded-xl border p-4 transition ${isSelected
                          ? 'border-amber-300 bg-amber-50/60 ring-2 ring-amber-200'
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${ACCENT[i % ACCENT.length]}`}>
                            {cat.name.substring(0, 2).toUpperCase()}
                          </span>
                          <span className="font-semibold text-slate-800">{cat.name}</span>
                        </div>
                        <div className={`flex shrink-0 items-center gap-0.5 transition ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button onClick={() => setViewCat(cat)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200" aria-label="View">
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className={`rounded-lg p-1.5 transition ${isSelected
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-indigo-500 hover:bg-indigo-100'
                              }`}
                            aria-label="Edit"
                            title="Edit in form"
                          >
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeletingCat(cat)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-100" aria-label="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {cat.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-500">{cat.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* ── View Modal ─────────────────────────────────── */}
      <Modal open={!!viewCat} onClose={() => setViewCat(null)} title="Category Details" size="sm">
        {viewCat && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{viewCat.name}</p>
            </div>
            {viewCat.description ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-700">{viewCat.description}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided.</p>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">ID</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{viewCat.id}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ─────────────────────── */}
      <ConfirmModal
        open={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        onConfirm={() => deleteMut.mutate(deletingCat.id)}
        title="Delete Category?"
        message={`"${deletingCat?.name}" will be permanently removed. Products using this category cannot be deleted.`}
        confirmLabel="Delete Category"
        loading={deleteMut.isPending}
      />
    </div>
  );
}
