import { Link } from 'react-router-dom';
import { ArrowRight, PackageOpen, Sparkles } from 'lucide-react';
import StockBadge from './StockBadge';

export function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiBase.replace(/\/api\/?$/, '')}${path}`;
}

export default function ProductCard({ product, viewMode = 'grid' }) {
  const isOutOfStock = Number(product.stock) <= 0;
  const priceFormatted = Number(product.price).toLocaleString('en-IN');

  if (viewMode === 'list') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/80 hover:shadow-card-hover"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {product.imagePath ? (
              <img
                src={imageUrl(product.imagePath)}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                <PackageOpen size={32} />
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Sold Out</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {product.brand?.name || 'Brand'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-500">
                {product.category?.name || 'General'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-1 text-xs sm:text-sm text-slate-500">
                {product.description}
              </p>
            )}
            <div className="mt-2.5 sm:hidden">
              <StockBadge stock={product.stock} />
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2">
          <div className="hidden sm:block">
            <StockBadge stock={product.stock} />
          </div>
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</span>
            <p className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              ₹{priceFormatted}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all group-hover:bg-indigo-600">
            View Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300/80 hover:shadow-card-hover"
    >
      <div>
        {/* Product image container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
          {product.imagePath ? (
            <img
              src={imageUrl(product.imagePath)}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
              <PackageOpen size={42} strokeWidth={1.5} />
              <span className="mt-2 text-xs font-medium text-slate-400">No image available</span>
            </div>
          )}

          {/* Floating Pill Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 shadow-xs backdrop-blur-md border border-white/60 truncate max-w-[50%]">
              {product.brand?.name || 'Brand'}
            </span>
            <StockBadge stock={product.stock} className="backdrop-blur-md" />
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
              <span className="rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg border border-white/10">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="p-4 sm:p-5">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>{product.category?.name || 'General'}</span>
            {product.sku && (
              <>
                <span>•</span>
                <span className="font-mono text-slate-400 truncate">{product.sku}</span>
              </>
            )}
          </div>

          <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-lg">
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</span>
          <p className="text-lg font-extrabold tracking-tight text-slate-900">
            ₹{priceFormatted}
          </p>
        </div>

        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs transition-all duration-200 group-hover:bg-indigo-600 group-hover:scale-105">
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
