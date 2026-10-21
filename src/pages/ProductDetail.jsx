import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Sparkles,
  Star,
  Info,
  Clock,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Loading from '../components/Loading';
import { imageUrl } from '../components/ProductCard';
import StockBadge from '../components/StockBadge';

export default function ProductDetail() {
  const { id } = useParams();
  const [copiedSku, setCopiedSku] = useState(false);

  const { data: product, isPending, isError, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data.data,
  });

  const copySkuToClipboard = () => {
    if (!product?.sku) return;
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    toast.success(`SKU ${product.sku} copied to clipboard!`);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleInquiry = () => {
    toast.success(`Inquiry logged for "${product?.name}". Contacting support!`, {
      icon: '✨',
    });
  };

  if (isPending) {
    return (
      <div className="py-20">
        <Loading label="Loading detailed product specifications..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-rose-200 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Info size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          {error?.userMessage || 'We could not locate the requested product in the active catalogue.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="w-full sm:w-auto rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;
  const isLowStock = inStock && Number(product.stock) <= 5;
  const priceFormatted = Number(product.price).toLocaleString('en-IN');

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb & Back Navigation ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 font-bold text-slate-700 shadow-2xs transition-all hover:border-indigo-300 hover:text-indigo-600"
          >
            <ArrowLeft size={14} /> Back to Catalogue
          </Link>

          <span className="hidden sm:inline text-slate-300">/</span>

          <span className="hidden sm:inline font-bold text-slate-400">
            {product.category?.name || 'General'}
          </span>

          <span className="hidden sm:inline text-slate-300">/</span>

          <span className="hidden sm:inline text-slate-700 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={shareProduct}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
        >
          <Share2 size={14} /> Share Product
        </button>
      </div>

      {/* ── Main Product Presentation Card ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Image Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/60">
              {product.imagePath ? (
                <img
                  src={imageUrl(product.imagePath)}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                  <PackageOpen size={64} strokeWidth={1.5} />
                  <span className="mt-2 text-xs font-medium text-slate-400">No Image Preview</span>
                </div>
              )}

              {/* Floating Genuine Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                  <Sparkles size={12} className="text-amber-400" /> Verified Item
                </span>
              </div>
            </div>

            {/* Quick SKU & Stock Footer below image */}
            <div className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-3 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">SKU Identifier:</span>
              <button
                onClick={copySkuToClipboard}
                title="Click to copy SKU"
                className="inline-flex items-center gap-1.5 font-mono font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>{product.sku || 'N/A'}</span>
                {copiedSku ? <Check size={14} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* Right Column: Product Information & Specifications (7 cols on lg) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Category & Brand Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                  {product.brand?.name || 'Brand'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {product.category?.name || 'General'}
                </span>
                <StockBadge stock={product.stock} />
              </div>

              {/* Product Title */}
              <h1 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating mockup */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                </div>
                <span className="font-bold text-slate-700">4.9</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium">Quality Guaranteed & Inspected</span>
              </div>

              {/* Price Banner */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-6 border border-slate-100">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Official Retail Price</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                    ₹{priceFormatted}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">All applicable taxes included</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                  <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className={inStock ? 'text-emerald-700' : 'text-rose-700'}>
                    {inStock ? `${product.stock} units currently ready for dispatch` : 'Currently out of inventory'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleInquiry}
                  disabled={!inStock}
                  className={`flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold shadow-md transition-all ${
                    inStock
                      ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={18} />
                  <span>{inStock ? 'Inquire / Order Now' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={copySkuToClipboard}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white py-3.5 px-5 text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300"
                >
                  <Copy size={16} />
                  <span>Copy SKU</span>
                </button>
              </div>

              {/* Value Propositions Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div className="flex items-start gap-2.5">
                  <Truck size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Express Delivery</p>
                    <p className="text-[11px] text-slate-500">Fast dispatch nationwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Genuine Guarantee</p>
                    <p className="text-[11px] text-slate-500">Direct manufacturer source</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <RotateCcw size={18} className="text-violet-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">7-Day Inspection</p>
                    <p className="text-[11px] text-slate-500">Quality satisfaction policy</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Real-Time Sync</p>
                    <p className="text-[11px] text-slate-500">Live inventory numbers</p>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Description</h3>
                <div className="mt-3 prose prose-slate text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {product.description || 'No detailed description provided for this catalogue item.'}
                </div>
              </div>
            </div>

            {/* Specifications Summary Table */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">Specifications</h3>
              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs">
                <div className="grid grid-cols-2 p-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Brand</span>
                  <span className="font-bold text-slate-900">{product.brand?.name || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Category</span>
                  <span className="font-bold text-slate-900">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">SKU Code</span>
                  <span className="font-mono font-bold text-slate-900">{product.sku || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Stock Availability</span>
                  <span className="font-bold text-slate-900">{product.stock} units</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-semibold text-slate-500">Catalogue Status</span>
                  <span className="font-bold text-emerald-600">Active & Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
