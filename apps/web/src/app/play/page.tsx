import Link from "next/link";
import Nav from "@/components/Nav";

const CLASSIC_TIERS = [
  { label: "Easy",   range: "Q1–5",   color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  { label: "Medium", range: "Q6–14",  color: "text-amber-400   bg-amber-500/15   border-amber-500/30" },
  { label: "Hard",   range: "Q15–20", color: "text-rose-400    bg-rose-500/15    border-rose-500/30" },
];

export default function PlayPage() {
  return (
    <div className="min-h-[100svh] bg-[var(--bg)] flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-xl mx-auto w-full gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Choose your mode</h1>
          <p className="text-white/40 text-sm">How do you want to play today?</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {/* Classic — primary card */}
          <Link
            href="/play/classic"
            className="group w-full rounded-2xl border-2 border-amber-500/40 bg-amber-500/8 hover:bg-amber-500/12 hover:border-amber-500/60 active:scale-[0.98] transition-all p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl" aria-hidden="true">🏆</span>
                  <span className="text-xl font-black text-amber-400">Classic</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wide">
                    Recommended
                  </span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  20 questions · escalating difficulty · win an Oscar!
                </p>
              </div>
              <span className="text-amber-500/40 group-hover:text-amber-400 transition-colors text-xl mt-0.5" aria-hidden="true">→</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {CLASSIC_TIERS.map(tier => (
                <span
                  key={tier.label}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${tier.color}`}
                >
                  {tier.label} · {tier.range}
                </span>
              ))}
            </div>
          </Link>

          {/* Infinite — secondary card */}
          <Link
            href="/play/infinite"
            className="group w-full rounded-2xl border border-white/10 bg-white/4 hover:bg-white/7 hover:border-white/20 active:scale-[0.98] transition-all p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl font-bold text-[var(--accent-deep)] leading-none" aria-hidden="true">∞</span>
                  <span className="text-xl font-black text-white">Infinite</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  No end · pick your difficulty · chase your best streak
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/50 transition-colors text-xl mt-0.5" aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
