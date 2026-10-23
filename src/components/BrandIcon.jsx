export default function BrandIcon({ className = 'h-5 w-5', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Modern NovaCart emblem: Sleek dynamic cart with energy spark */}
      <path d="M2.5 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.95-1.55l1.65-6.65H6.2" />
      <circle cx="10" cy="19.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
      <path d="M14 6l1.8 1.8 3.2-3.2" strokeWidth="2" />
    </svg>
  );
}
