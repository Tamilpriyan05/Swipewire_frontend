export default function BrandIcon({ className = 'h-5 w-5', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Dynamic S wire path representing SwipeWire */}
      <path d="M18 5H10a3.5 3.5 0 0 0-3.5 3.5 3.5 3.5 0 0 0 3.5 3.5h4a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5H6" />
      <circle cx="18" cy="5" r="1.8" fill="currentColor" />
      <circle cx="6" cy="19" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
