export default function StockBadge({ stock, suffix = '', outLabel = 'Out', className = '' }) {
  const num = Number(stock) || 0;
  const inStock = num > 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
        inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      } ${className}`}
    >
      {inStock ? `${num}${suffix ? ` ${suffix}` : ''}` : outLabel}
    </span>
  );
}
