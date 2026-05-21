"use client";

interface SpeedTier {
  maxProgress: number;
  bonus: number;
  label: string;
  color: string;
  barColor: string;
}

const TIERS: SpeedTier[] = [
  { maxProgress: 0.20, bonus: 500, label: "+500", color: "text-emerald-600", barColor: "bg-emerald-500" },
  { maxProgress: 0.50, bonus: 200, label: "+200", color: "text-amber-600",   barColor: "bg-amber-400"   },
  { maxProgress: 0.80, bonus: 50,  label: "+50",  color: "text-orange-500",  barColor: "bg-orange-400"  },
  { maxProgress: 1.00, bonus: 0,   label: "—",    color: "text-[#94a3b8]",   barColor: "bg-[#e4e7ed]"   },
];

const SEGMENTS = 10;

function getTier(progress: number): SpeedTier {
  return TIERS.find((t) => progress < t.maxProgress) ?? TIERS[TIERS.length - 1];
}

function formatRemaining(progress: number, timerSeconds: number): string {
  const remainingSec = Math.max(0, timerSeconds * (1 - progress));
  const s = Math.floor(remainingSec);
  const tenths = Math.floor((remainingSec % 1) * 10);
  return `${s}.${tenths}s`;
}

interface BlurTimerProps {
  progress: number;
  timerSeconds: number;
  stopped: boolean;
}

export default function BlurTimer({ progress, timerSeconds, stopped }: BlurTimerProps) {
  const tier = getTier(progress);
  const filledSegments = Math.round((1 - progress) * SEGMENTS);

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <span className={`text-sm font-bold tabular-nums min-w-[40px] font-mono ${stopped ? "text-[#94a3b8]" : tier.color}`}>
        {stopped ? "—" : formatRemaining(progress, timerSeconds)}
      </span>

      <div className="flex items-center gap-0.5 flex-1" aria-hidden="true" title="Time remaining">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-75 ${
              i < filledSegments ? tier.barColor : "bg-[#e4e7ed]"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-1 min-w-[56px] justify-end">
        <span className={`text-xs font-bold ${tier.color}`}>{tier.label}</span>
        {tier.bonus > 0 && (
          <span className="text-[10px] text-[#94a3b8] font-medium">speed</span>
        )}
      </div>
    </div>
  );
}
