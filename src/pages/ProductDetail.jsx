import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, PackageCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import Loading from '../components/Loading';
import { imageUrl } from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isPending, isError, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data.data,
  });

  if (isPending) return <Loading label="Loading product details..." />;
  if (isError) return <div className="rounded-2xl bg-white p-8 text-center"><p className="font-semibold text-rose-700">{error.userMessage || 'Product could not be loaded.'}</p><button onClick={() => refetch()} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white">Try again</button></div>;

  return (
    <div className="mx-auto">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-700"><ArrowLeft size={16}/> Back to catalogue</Link>
      <div className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2 p-6">
        <div className="min-h-72 bg-slate-100 rounded-xl"><img src={imageUrl(product.imagePath)} alt={product.name} className="h-full max-h-[600px] w-full rounded-xl object-cover"/></div>
        <div className="p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600">{product.brand?.name} · {product.category?.name}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${Number(product.stock) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}><PackageCheck size={16}/>{Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
          <h2 className="mt-8 font-bold">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description}</p>
          <p className="mt-6 text-xs text-slate-400">SKU: {product.sku}</p>
        </div>
      </div>
    </div>
  );
}
