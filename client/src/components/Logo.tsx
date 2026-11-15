export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="var(--action)" />
        <path
          d="M20 16v26h22"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="46" cy="22" r="5" fill="#fff" />
      </svg>
      <span className="title-1 text-ink">LingWay</span>
    </span>
  );
}
