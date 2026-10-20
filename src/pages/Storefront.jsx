import { useQuery } from '@tanstack/react-query';
import { Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import api from '../lib/api';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

export default function Storefront() {
  const [search, setSearch] = useState('');
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data.data,
  });
  const products = useMemo(() => (data || []).filter((p) =>
    `${p.name} ${p.brand?.name || ''} ${p.category?.name || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  return (
    <div>
      <section className="mb-9 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold"><Sparkles size={14}/> Curated products</div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Find your next<br/><span className="text-indigo-300">favourite thing.</span></h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">Explore the catalogue, compare products, and view the details before you decide.</p>
        </div>
      </section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600">The catalogue</p><h2 className="mt-1 text-2xl font-bold">Browse products</h2></div>
        <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:max-w-xs">
          <Search size={18} className="text-slate-400"/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-transparent text-sm outline-none"/>
        </label>
      </div>
      {isPending ? <Loading label="Loading products..." /> : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"><p className="font-semibold text-rose-800">Could not load products</p><p className="mt-1 text-sm text-rose-700">{error.userMessage || error.message}</p><button onClick={() => refetch()} className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white">Try again</button></div>
      ) : products.length ? (
        <><p className="mb-4 text-sm text-slate-500">{products.length} product{products.length === 1 ? '' : 's'} {isFetching ? '· Updating…' : ''}</p><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p}/>)}</div></>
      ) : (
        <EmptyState message={search ? "No products match your search. Try another query." : "No products available in the catalogue yet."} className="bg-white" />
      )}
    </div>
  );
}
