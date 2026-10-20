/**
 * AdminBrands — Create, Edit, Delete brands.
 * • Duplicate name check (front-end + back-end 409)
 * • Custom confirm modal (no window.alert)
 * • Edit modal with inline form
 */
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag, Plus, Trash2, Pencil, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../lib/api';
import Loading from '../../components/Loading';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminBrands() {
  const qc = useQueryClient();
  const formRef = useRef(null);

  const [name, setName] = useState('');

  // Edit state (reuses the left-hand form)
  const [editingBrand, setEditingBrand] = useState(null);

  // Delete confirm state
  const [deletingBrand, setDeletingBrand] = useState(null);

  /* ── Queries ───────────────────────────────────────────────── */
  const brandsQ = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await api.get('/brands')).data.data,
  });

  /* ── Mutations ─────────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: (n) => api.post('/brands', { name: n }),
    onSuccess: (res) => {
      toast.success(`Brand "${res.data.data.name}" created!`);
      setName('');
      qc.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, name: n }) => api.put(`/brands/${id}`, { name: n }),
    onSuccess: (res) => {
      toast.success(`Brand updated to "${res.data.data.name}".`);
      setEditingBrand(null);
      setName('');
      qc.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/brands/${id}`),
    onSuccess: () => {
      toast.success('Brand deleted.');
      if (editingBrand?.id === deletingBrand?.id) {
        setEditingBrand(null);
        setName('');
      }
      setDeletingBrand(null);
      qc.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
      setDeletingBrand(null);
    },
  });

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleStartEdit = (brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error('Enter a brand name.');

    if (editingBrand) {
      const dup = (brandsQ.data || []).some(
        (b) => b.id !== editingBrand.id && b.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (dup) return toast.error(`Brand "${trimmed}" already exists.`);
      updateMut.mutate({ id: editingBrand.id, name: trimmed });
    } else {
      const dup = (brandsQ.data || []).some((b) => b.name.toLowerCase() === trimmed.toLowerCase());
      if (dup) return toast.error(`Brand "${trimmed}" already exists.`);
      createMut.mutate(trimmed);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-500">Catalogue</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Brands</h1>

      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* ── Add / Edit form (reused on page) ─────────────── */}
        <div ref={formRef} className={`h-fit rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${editingBrand ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          }`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`rounded-xl p-2.5 transition ${editingBrand ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                }`}>
                {editingBrand ? <Pencil size={18} /> : <Tag size={18} />}
              </span>
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingBrand ? 'Edit Brand' : 'Add Brand'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingBrand ? `Editing: ${editingBrand.name}` : 'Name must be unique.'}
                </p>
              </div>
            </div>

            {editingBrand && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                title="Cancel update and add a new brand"
              >
                <Plus size={13} /> New Brand
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple, Nike…"
                maxLength={100}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {editingBrand ? (
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="block rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMut.isPending || !name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                >
                  <Check size={16} />
                  {updateMut.isPending ? 'Updating…' : 'Update Brand'}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={createMut.isPending || !name.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus size={16} />
                {createMut.isPending ? 'Creating…' : 'Create Brand'}
              </button>
            )}
          </form>
        </div>

        {/* ── Brand list ──────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All Brands</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {brandsQ.data?.length || 0} total
            </span>
          </div>

          {brandsQ.isPending ? <Loading label="Loading brands…" /> :
            brandsQ.isError ? (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle size={16} />{getErrorMessage(brandsQ.error)}
              </div>
            ) : !brandsQ.data?.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                No brands yet. Add your first brand using the form.
              </div>
            ) : (
              <div className="space-y-2">
                {brandsQ.data.map((brand) => {
                  const isSelected = editingBrand?.id === brand.id;
                  return (
                    <div
                      key={brand.id}
                      className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition ${isSelected
                          ? 'border-amber-300 bg-amber-50/60 ring-2 ring-amber-200'
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-indigo-50/40'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-black transition ${isSelected
                            ? 'border-amber-300 bg-amber-100 text-amber-800'
                            : 'border-slate-200 bg-white text-indigo-600'
                          }`}>
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-800">{brand.name}</span>
                      </div>
                      <div className={`flex items-center gap-1 transition ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                          onClick={() => handleStartEdit(brand)}
                          className={`rounded-lg p-2 transition ${isSelected
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-indigo-500 hover:bg-indigo-50'
                            }`}
                          aria-label={`Edit ${brand.name}`}
                          title="Edit in form"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingBrand(brand)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                          aria-label={`Delete ${brand.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* ── Delete Confirm Modal ─────────────────────── */}
      <ConfirmModal
        open={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={() => deleteMut.mutate(deletingBrand.id)}
        title="Delete Brand?"
        message={`"${deletingBrand?.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Brand"
        loading={deleteMut.isPending}
      />
    </div>
  );
}
