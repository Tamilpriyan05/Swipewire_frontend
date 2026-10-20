import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiBase.replace(/\/api\/?$/, '')}${path}`;
}

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imagePath ? <img src={imageUrl(product.imagePath)} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> :
          <div className="flex h-full items-center justify-center text-slate-400"><PackageOpen size={40} /></div>}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.brand?.name || 'Brand'}</span>
          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${Number(product.stock) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {Number(product.stock) > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <h3 className="line-clamp-1 font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 text-lg font-bold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
