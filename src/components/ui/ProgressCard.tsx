interface ProgressCardProps {
  label: string;
  value: string;
  percent: number;
  accent: string;
}

export default function ProgressCard({ label, value, percent, accent }: ProgressCardProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-card rounded-3xl border border-white/70 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-text/50">{label}</p>
          <h3 className="mt-3 text-2xl font-semibold text-text">{value}</h3>
        </div>
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#E3E0D4" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-text">
            {percent}%
          </div>
        </div>
      </div>
    </div>
  );
}
