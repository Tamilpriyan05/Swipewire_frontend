export default function StockBadge({ stock, suffix = '', outLabel = 'Out of Stock', className = '' }) {
  const num = Number(stock) || 0;
  const inStock = num > 0;
  const isLowStock = inStock && num <= 5;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-colors ${
        !inStock
          ? 'border border-rose-200/80 bg-rose-50/90 text-rose-700 shadow-xs'
          : isLowStock
          ? 'border border-amber-200/80 bg-amber-50/90 text-amber-700 shadow-xs'
          : 'border border-emerald-200/80 bg-emerald-50/90 text-emerald-700 shadow-xs'
      } ${className}`}
    >
      <span
        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
          !inStock
            ? 'bg-rose-500'
            : isLowStock
            ? 'bg-amber-500 animate-pulse'
            : 'bg-emerald-500'
        }`}
      />
      {inStock ? `${num}${suffix ? ` ${suffix}` : ''}` : outLabel}
    </span>
  );
}
