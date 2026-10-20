/**
 * AdminProducts — Full product management:
 *   • Create (with image, duplicate check)
 *   • View  (read-only modal with full details)
 *   • Edit  (full form modal, image optional)
 *   • Delete single (custom confirm modal)
 *   • Delete all   (custom confirm modal, calls DELETE /products/all)
 */
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Package, ImagePlus, Plus, Trash2, Pencil, Eye,
  AlertTriangle, AlertCircle, Search, X, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../lib/api';
import { imageUrl } from '../../components/ProductCard';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

const EMPTY = { name: '', brandId: '', categoryId: '', price: '', stock: '0', description: '' };

/* ── small helper: image upload label ───────────────────────────────────────── */
function ImageUploadArea({ image, preview, onChange, optional = false }) {
  return (
    <label className="block cursor-pointer">
      <div className={`rounded-xl border-2 border-dashed p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30 ${image ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-300'}`}>
        {preview
          ? <img src={preview} alt="Preview" className="mx-auto mb-2 h-24 rounded-lg object-contain" />
          : <ImagePlus className="mx-auto mb-2 text-slate-300" size={28} />}
        <p className="text-sm font-semibold text-slate-700">{image ? image.name : `Choose image${optional ? ' (optional)' : ' *'}`}</p>
        <p className="mt-0.5 text-xs text-slate-400">JPEG, PNG, WEBP, GIF · Max 5 MB</p>
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onChange} />
    </label>
  );
}

export default function AdminProducts() {
  const qc = useQueryClient();
  const formRef = useRef(null);

  /* ── Form state (for Create & Update) ─────────────────────── */
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

  const [editingProduct, setEditingProduct] = useState(null);

  /* ── View / Delete state ─────────────────────────────────── */
  const [viewProduct, setViewProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const [search, setSearch] = useState('');

  /* ── Queries ───────────────────────────────────────────────── */
  const productsQ = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => (await api.get('/products?includeInactive=true')).data.data,
  });
  const brandsQ = useQuery({ queryKey: ['brands'], queryFn: async () => (await api.get('/brands')).data.data });
  const categoriesQ = useQuery({ queryKey: ['categories'], queryFn: async () => (await api.get('/categories')).data.data });

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return (productsQ.data || []).filter(
      (p) => `${p.name} ${p.brand?.name || ''} ${p.category?.name || ''}`.toLowerCase().includes(s)
    );
  }, [productsQ.data, search]);

  /* ── Mutations ─────────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: () => {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (image) body.append('image', image);
      return api.post('/products', body);
    },
    onSuccess: () => {
      toast.success('Product created!');
      setForm(EMPTY);
      setImage(null);
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id }) => {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (image) body.append('image', image);
      return api.put(`/products/${id}`, body);
    },
    onSuccess: () => {
      toast.success('Product updated!');
      setEditingProduct(null);
      setForm(EMPTY);
      setImage(null);
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted.');
      if (editingProduct?.id === deletingProduct?.id) {
        setEditingProduct(null);
        setForm(EMPTY);
        setImage(null);
      }
      setDeletingProduct(null);
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => { toast.error(getErrorMessage(err)); setDeletingProduct(null); },
  });

  const deleteAllMut = useMutation({
    mutationFn: () => api.delete('/products/all'),
    onSuccess: (res) => {
      toast.success(res.data.message || 'All products deleted.');
      setEditingProduct(null);
      setForm(EMPTY);
      setImage(null);
      setConfirmDeleteAll(false);
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => { toast.error(getErrorMessage(err)); setConfirmDeleteAll(false); },
  });

  /* ── Handlers ──────────────────────────────────────────────── */
  const updateField = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setImage(null);
    setForm({
      name: product.name || '',
      brandId: product.brandId || product.brand?.id || '',
      categoryId: product.categoryId || product.category?.id || '',
      price: product.price ?? '',
      stock: product.stock ?? '0',
      description: product.description || '',
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm(EMPTY);
    setImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();

    if (editingProduct) {
      const dup = (productsQ.data || []).some(
        (p) => p.id !== editingProduct.id && p.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (dup) return toast.error(`Product "${trimmedName}" already exists.`);
      if (image && image.size > 5 * 1024 * 1024) return toast.error('Image must be ≤ 5 MB.');
      updateMut.mutate({ id: editingProduct.id });
    } else {
      if (!image) return toast.error('Please choose a product image.');
      if (image.size > 5 * 1024 * 1024) return toast.error('Image must be ≤ 5 MB.');
      const dup = (productsQ.data || []).some((p) => p.name.toLowerCase() === trimmedName.toLowerCase());
      if (dup) return toast.error(`Product "${trimmedName}" already exists.`);
      createMut.mutate();
    }
  };

  const BrandCatSelects = ({ f, onChange, brands, categories }) => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Brand <span className="text-rose-500">*</span></label>
        <select name="brandId" required value={f.brandId} onChange={onChange}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
          <option value="">Select brand</option>
          {(brands || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700">Category <span className="text-rose-500">*</span></label>
        <select name="categoryId" required value={f.categoryId} onChange={onChange}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
          <option value="">Select category</option>
          {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-500">Catalogue</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Products</h1>

      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* ── Add / Edit form (reused on page) ─────────────── */}
        <div ref={formRef} className={`h-fit rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${editingProduct ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          }`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`rounded-xl p-2.5 transition ${editingProduct ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                }`}>
                {editingProduct ? <Pencil size={18} /> : <Package size={18} />}
              </span>
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingProduct ? `Editing: ${editingProduct.name}` : 'Fields marked * are required.'}
                </p>
              </div>
            </div>

            {editingProduct && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                title="Cancel update and add a new product"
              >
                <Plus size={13} /> New Product
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Product Name <span className="text-rose-500">*</span></label>
              <input name="name" required minLength={2} maxLength={180} value={form.name} onChange={updateField}
                placeholder="Enter product name…"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
            </div>
            <BrandCatSelects f={form} onChange={updateField} brands={brandsQ.data} categories={categoriesQ.data} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Price (₹) <span className="text-rose-500">*</span></label>
                <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={updateField}
                  placeholder="0.00" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Stock <span className="text-rose-500">*</span></label>
                <input name="stock" type="number" min="0" step="1" required value={form.stock} onChange={updateField}
                  placeholder="0" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Description <span className="text-rose-500">*</span></label>
              <textarea name="description" required minLength={2} rows={3} value={form.description} onChange={updateField}
                placeholder="Describe the product…"
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
            </div>

            {/* Current image preview when editing and no new image chosen yet */}
            {editingProduct?.imagePath && !image && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-1.5 text-xs font-semibold text-slate-500">Current product image</p>
                <div className="flex items-center gap-3">
                  <img src={imageUrl(editingProduct.imagePath)} alt="" className="h-16 w-16 rounded-lg object-contain bg-white border border-slate-200" />
                  <p className="text-xs text-slate-400">Upload a new image below to replace it, or leave empty to keep current.</p>
                </div>
              </div>
            )}

            <ImageUploadArea
              image={image}
              preview={preview}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              optional={Boolean(editingProduct)}
            />

            {editingProduct ? (
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMut.isPending}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                >
                  <Check size={16} />
                  {updateMut.isPending ? 'Updating…' : 'Update  Product'}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={createMut.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus size={16} />
                {createMut.isPending ? 'Saving product…' : 'Create Product'}
              </button>
            )}
          </form>
        </div>

        {/* ── Product list ─────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-slate-900">All Products</h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {productsQ.data?.length || 0} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-400" />
              </label>
              {(productsQ.data?.length || 0) > 0 && (
                <button onClick={() => setConfirmDeleteAll(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100">
                  <AlertTriangle size={13} /> Delete All
                </button>
              )}
            </div>
          </div>

          {productsQ.isPending ? <Loading label="Loading products…" /> :
            productsQ.isError ? (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle size={16} />{getErrorMessage(productsQ.error)}
                <button onClick={() => productsQ.refetch()} className="ml-2 font-bold underline">Retry</button>
              </div>
            ) : !filtered.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                {search ? 'No products match your search.' : 'No products yet. Add your first product using the form.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="pb-3 pr-4 text-left font-semibold">Product</th>
                      <th className="pb-3 pr-3 text-left font-semibold">Brand</th>
                      <th className="pb-3 pr-3 text-left font-semibold">Price</th>
                      <th className="pb-3 pr-3 text-left font-semibold">Stock</th>
                      <th className="pb-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((p) => {
                      const isSelected = editingProduct?.id === p.id;
                      return (
                        <tr
                          key={p.id}
                          className={`transition ${isSelected
                              ? 'bg-amber-50/70 ring-1 ring-inset ring-amber-300'
                              : 'hover:bg-slate-50/60'
                            }`}
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                {p.imagePath
                                  ? <img src={imageUrl(p.imagePath)} alt={p.name} className="h-full w-full object-cover" />
                                  : <div className="flex h-full w-full items-center justify-center text-slate-300"><Package size={18} /></div>}
                              </div>
                              <div>
                                <p className="max-w-[160px] truncate font-semibold text-slate-800">{p.name}</p>
                                <p className="text-xs text-slate-400">{p.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-3 text-slate-600">{p.brand?.name || '—'}</td>
                          <td className="py-3 pr-3 font-semibold text-slate-800">₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td className="py-3 pr-3">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${Number(p.stock) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                              {Number(p.stock) > 0 ? p.stock : 'Out'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setViewProduct(p)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="View">
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={() => handleStartEdit(p)}
                                className={`rounded-lg p-2 transition ${isSelected
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-indigo-500 hover:bg-indigo-50'
                                  }`}
                                aria-label="Edit"
                                title="Edit in form"
                              >
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => setDeletingProduct(p)}
                                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="Delete">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      {/* ── View Product Modal ─────────────────────────── */}
      <Modal open={!!viewProduct} onClose={() => setViewProduct(null)} title="Product Details" size="lg">
        {viewProduct && (
          <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
            <div className="overflow-hidden rounded-xl bg-slate-100">
              {viewProduct.imagePath
                ? <img src={imageUrl(viewProduct.imagePath)} alt={viewProduct.name} className="h-full w-full object-cover" />
                : <div className="flex h-40 items-center justify-center text-slate-300"><Package size={40} /></div>}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</p>
                <p className="mt-0.5 text-lg font-black text-slate-900">{viewProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Brand</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">{viewProduct.brand?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">{viewProduct.category?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price</p>
                  <p className="mt-0.5 text-sm font-black text-indigo-700">₹{Number(viewProduct.price).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stock</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${Number(viewProduct.stock) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                    {Number(viewProduct.stock) > 0 ? `${viewProduct.stock} units` : 'Out of stock'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">SKU</p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">{viewProduct.sku}</p>
              </div>
            </div>
            {viewProduct.description && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{viewProduct.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Delete single Confirm Modal ───────────────── */}
      <ConfirmModal
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deleteMut.mutate(deletingProduct.id)}
        title="Delete Product?"
        message={`"${deletingProduct?.name}" will be permanently deleted including its image. This cannot be undone.`}
        confirmLabel="Delete Product"
        loading={deleteMut.isPending}
      />

      {/* ── Delete All Confirm Modal ──────────────────── */}
      <ConfirmModal
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={() => deleteAllMut.mutate()}
        title="Delete ALL Products?"
        message={`All ${productsQ.data?.length || 0} products and their images will be permanently removed. This CANNOT be undone.`}
        confirmLabel="Yes, Delete All"
        variant="warning"
        loading={deleteAllMut.isPending}
      />
    </div>
  );
}
