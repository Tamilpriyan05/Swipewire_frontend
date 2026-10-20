/**
 * AdminDashboard — stats overview with product/stock/user analytics cards.
 */
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Tag,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import api from '../../lib/api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import StockBadge from '../../components/StockBadge';
import EmptyState from '../../components/EmptyState';

export default function AdminDashboard() {
  const productsQ = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => (await api.get('/products?includeInactive=true')).data.data,
  });
  const brandsQ = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await api.get('/brands')).data.data,
  });
  const categoriesQ = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  const products = productsQ.data || [];
  const inStock = products.filter((p) => Number(p.stock) > 0).length;
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;
  const totalStock = products.reduce((s, p) => s + Number(p.stock), 0);

  const loading = productsQ.isPending || brandsQ.isPending || categoriesQ.isPending;

  return (
    <div>
      <PageHeader badge="Overview" title="Dashboard" />

      {loading ? (
        <Loading label="Loading dashboard..." />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Package}
              label="Total Products"
              value={products.length}
              sub={`${totalStock} units in inventory`}
              accent="indigo"
            />
            <StatCard
              icon={Tag}
              label="Brands"
              value={brandsQ.data?.length ?? 0}
              sub="Unique brands catalogued"
              accent="emerald"
            />
            <StatCard
              icon={Layers}
              label="Categories"
              value={categoriesQ.data?.length ?? 0}
              sub="Product categories"
              accent="amber"
            />
            <StatCard
              icon={TrendingUp}
              label="In Stock"
              value={inStock}
              sub={`${outOfStock} product(s) out of stock`}
              accent="rose"
            />
          </div>

          {/* Stock breakdown */}
          <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Low / out of stock products */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <h2 className="font-bold text-slate-900">Stock Alerts</h2>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                  {products.filter((p) => Number(p.stock) <= 5).length} items
                </span>
              </div>
              {products.filter((p) => Number(p.stock) <= 5).length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <CheckCircle size={16} /> All products well stocked!
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {products
                    .filter((p) => Number(p.stock) <= 5)
                    .sort((a, b) => Number(a.stock) - Number(b.stock))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                          <p className="truncate text-xs text-slate-400">
                            {p.brand?.name || 'No brand'} · {p.sku}
                          </p>
                        </div>
                        <StockBadge
                          stock={p.stock}
                          suffix="left"
                          outLabel="Out"
                          className="shrink-0"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Product by brand breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-500" />
                <h2 className="font-bold text-slate-900">Products by Brand</h2>
              </div>
              {(brandsQ.data || []).length === 0 ? (
                <EmptyState message="No brands yet." />
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {(brandsQ.data || []).map((brand) => {
                    const count = products.filter((p) => p.brand?.name === brand.name).length;
                    const pct = products.length ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div key={brand.id}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{brand.name}</span>
                          <span className="text-slate-400">
                            {count} product{count !== 1 ? 's' : ''} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent products table */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Products</h2>
              <span className="text-xs font-semibold text-slate-400">{products.length} total</span>
            </div>
            {products.length === 0 ? (
              <EmptyState message="No products yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="pb-3 pr-4 text-left font-semibold">Product</th>
                      <th className="pb-3 pr-4 text-left font-semibold">Brand</th>
                      <th className="pb-3 pr-4 text-left font-semibold">Category</th>
                      <th className="pb-3 pr-4 text-left font-semibold">Price</th>
                      <th className="pb-3 text-left font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.slice(0, 8).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="max-w-[180px] truncate font-semibold text-slate-800">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-400">{p.sku}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{p.brand?.name || '—'}</td>
                        <td className="py-3 pr-4 text-slate-600">{p.category?.name || '—'}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-800">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <StockBadge stock={p.stock} suffix="in stock" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
