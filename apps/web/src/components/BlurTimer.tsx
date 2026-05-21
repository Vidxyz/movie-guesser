"use client";

interface BlurTimerProps {
  progress: number;
  timerSeconds: number;
  stopped: boolean;
}

interface Tier {
  maxProgress: number;
  bonus: number;
  label: string;
  color: string;
  glow: string;
}

const TIERS: Tier[] = [
  { maxProgress: 0.20, bonus: 500, label: "+500", color: "#10b981", glow: "rgba(16,185,129,0.5)"  },
  { maxProgress: 0.50, bonus: 200, label: "+200", color: "#f59e0b", glow: "rgba(245,158,11,0.5)"  },
  { maxProgress: 0.80, bonus: 50,  label: "+50",  color: "#f97316", glow: "rgba(249,115,22,0.5)"  },
  { maxProgress: 1.00, bonus: 0,   label: "",     color: "#4b5563", glow: "rgba(75,85,99,0.3)"    },
];

function getTier(progress: number): Tier {
  return TIERS.find(t => progress < t.maxProgress) ?? TIERS[TIERS.length - 1];
}

function formatRemaining(progress: number, timerSeconds: number): string {
  const remaining = Math.max(0, timerSeconds * (1 - progress));
  const s = Math.floor(remaining);
  const tenths = Math.floor((remaining % 1) * 10);
  return `${s}.${tenths}s`;
}

export default function BlurTimer({ progress, timerSeconds, stopped }: BlurTimerProps) {
  const tier = getTier(progress);
  const barPct = Math.max(0, (1 - progress) * 100);

  return (
    <div className="flex items-center gap-3 px-1">
      <span className="tabular-nums text-xs font-mono min-w-[36px] text-white/50">
        {stopped ? "—" : formatRemaining(progress, timerSeconds)}
      </span>

      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{
            width: `${barPct}%`,
            background: tier.color,
            boxShadow: stopped ? "none" : `0 0 8px ${tier.glow}`,
          }}
        />
      </div>

      <div className="min-w-[40px] text-right">
        {!stopped && tier.bonus > 0 && (
          <span className="text-xs font-bold tabular-nums" style={{ color: tier.color }}>
            {tier.label}
          </span>
        )}
      </div>
    </div>
  );
}
