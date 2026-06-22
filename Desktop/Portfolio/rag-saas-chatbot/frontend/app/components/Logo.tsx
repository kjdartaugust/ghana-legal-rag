function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none">
      <line x1="14" y1="4" x2="14" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="8" x2="23" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 8 L2 16 Q5 20 8 16 L5 8Z" fill="currentColor" opacity="0.85" />
      <path d="M23 8 L20 16 Q23 20 26 16 L23 8Z" fill="currentColor" opacity="0.85" />
      <line x1="10" y1="24" x2="18" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const sizeMap = {
  sm: { wrap: "gap-1.5", icon: "w-5 h-5", text: "text-base"    },
  md: { wrap: "gap-2",   icon: "w-6 h-6", text: "text-xl"      },
  lg: { wrap: "gap-2.5", icon: "w-8 h-8", text: "text-2xl"     },
};

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = sizeMap[size];
  return (
    <div className={`flex items-center ${s.wrap} select-none`}>
      <ScalesIcon className={`${s.icon} text-[#071e4a]`} />
      <span className={`font-bold tracking-tight ${s.text}`}>
        <span className="text-[#071e4a]">Ghana</span>
        <span className="text-[#071e4a]">Law</span>
        <span className="text-amber-500"> AI</span>
      </span>
    </div>
  );
}
