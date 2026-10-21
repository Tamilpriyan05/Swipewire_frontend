import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Tag,
  Package,
  Layers,
  Check,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import api from '../lib/api';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

export default function Storefront() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Fetch all active products
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data.data,
  });

  const rawProducts = useMemo(() => data || [], [data]);

  // Extract unique categories and brands with counts
  const { categories, brands } = useMemo(() => {
    const catMap = new Map();
    const brandMap = new Map();

    rawProducts.forEach((p) => {
      const catName = p.category?.name || 'Other';
      catMap.set(catName, (catMap.get(catName) || 0) + 1);

      const brandName = p.brand?.name || 'Other';
      brandMap.set(brandName, (brandMap.get(brandName) || 0) + 1);
    });

    return {
      categories: Array.from(catMap.entries()).map(([name, count]) => ({ name, count })),
      brands: Array.from(brandMap.entries()).map(([name, count]) => ({ name, count })),
    };
  }, [rawProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        `${p.name} ${p.brand?.name || ''} ${p.category?.name || ''} ${p.description || ''} ${p.sku || ''}`
          .toLowerCase()
          .includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => (p.category?.name || 'Other') === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter((p) => (p.brand?.name || 'Other') === selectedBrand);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => Number(p.stock) > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stock':
        result.sort((a, b) => Number(b.stock) - Number(a.stock));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  }, [rawProducts, search, selectedCategory, selectedBrand, inStockOnly, sortBy]);

  const hasActiveFilters =
    Boolean(search) || selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly;

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSortBy('newest');
  };

  return (
    <div className="space-y-10">
   
      <section className="relative overflow-hidden rounded-3xl border border-indigo-950/60 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
       
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Discover Exceptional <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-indigo-100 bg-clip-text text-transparent">
              Products & Gear.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-indigo-100/90 sm:text-base">
            Explore authentic specifications, live inventory tracking, and verified merchant items. Designed for seamless browsing.
          </p>

         
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-indigo-900/60 pt-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
                <Package size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-white">{rawProducts.length}</p>
                <p className="text-[11px] text-indigo-300/80">Active Products</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
                <Layers size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-white">{categories.length}</p>
                <p className="text-[11px] text-indigo-300/80">Categories</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
                <Tag size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-white">{brands.length}</p>
                <p className="text-[11px] text-indigo-300/80">Top Brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Pill Filter Carousel ── */}
      {/* <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter by category</p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Show all categories
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'border border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {rawProducts.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'border border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section> */}

      {/* ── Search, Controls & Sorting Toolbar ── */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, brand, category, or SKU..."
              className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls: Brand selector, in-stock toggle, sorting & view mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Brand Dropdown */}
            {brands.length > 0 && (
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none transition-all hover:bg-white focus:border-indigo-500 focus:bg-white"
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name} ({b.count})
                    </option>
                  ))}
                </select>
                <ArrowUpDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            )}

            {/* In-stock toggle pill */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all shadow-2xs ${
                inStockOnly
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200/90 bg-slate-50/70 text-slate-700 hover:bg-white'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${inStockOnly ? 'bg-emerald-500' : 'bg-slate-300'}`}
              />
              <span>In Stock Only</span>
            </button>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200/90 bg-slate-50/70 py-2.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none transition-all hover:bg-white focus:border-indigo-500 focus:bg-white"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="stock">Highest Stock</option>
              </select>
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Grid vs List View Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200/90 bg-slate-100 p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Chips Bar */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Active Filters:</span>

            {search && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                <span>"{search}"</span>
                <button onClick={() => setSearch('')} className="hover:text-indigo-900">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-indigo-900">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('all')} className="hover:text-indigo-900">
                  <X size={12} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-950">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 ml-auto"
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>
        )}
      </section>

      {/* ── Products Display Area ── */}
      <section>
        {isPending ? (
          <div className="py-12">
            <Loading label="Fetching product inventory..." />
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-xs">
            <p className="text-base font-bold text-rose-800">Could not retrieve catalogue products</p>
            <p className="mt-1 text-sm text-rose-600">{error.userMessage || error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-800 transition-colors"
            >
              <RotateCcw size={14} /> Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing <span className="text-slate-900 font-extrabold">{filteredProducts.length}</span> of {rawProducts.length} items
                {isFetching && <span className="ml-2 text-indigo-600 font-normal">· Updating in background…</span>}
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} viewMode="list" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            message={
              hasActiveFilters
                ? 'No products match your active search or filters. Try adjusting your search query or reset filters.'
                : 'No products are currently available in the catalogue.'
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
                >
                  <RotateCcw size={14} /> Reset All Filters
                </button>
              ) : null
            }
          />
        )}
      </section>
    </div>
  );
}
