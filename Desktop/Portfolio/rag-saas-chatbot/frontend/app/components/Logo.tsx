function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 7l3.5 7a3.5 3.5 0 0 1-7 0L5 7z" />
      <path d="M19 7l3.5 7a3.5 3.5 0 0 1-7 0L19 7z" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}

const sizes = {
  sm: { text: "text-base", icon: "w-4 h-4" },
  md: { text: "text-xl", icon: "w-6 h-6" },
  lg: { text: "text-3xl", icon: "w-9 h-9" },
};

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`flex items-center gap-2 font-bold ${sizes[size].text}`}>
      <ScalesIcon className={`${sizes[size].icon} text-blue-900`} />
      <span>
        <span className="text-blue-900">GhanaLaw</span>
        <span className="text-amber-500"> AI</span>
      </span>
    </div>
  );
}
