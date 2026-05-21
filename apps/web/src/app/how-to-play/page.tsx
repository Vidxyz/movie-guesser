import Nav from "@/components/Nav";

export const metadata = { title: "moviguessr — How to Play" };

export default function HowToPlayPage() {
  return (
    <div className="min-h-[100svh] bg-[var(--bg)]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8" aria-label="How to play">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">How to Play</h1>
          <p className="text-white/30 text-sm">Guess movies from blurred stills, earn points, build streaks.</p>
        </div>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
            Each round
          </h2>
          <ol className="space-y-2.5 list-none">
            {[
              { n: "1", icon: "🎬", title: "Study the blurred still",
                body: "A movie frame is shown with heavy blur. Try to recognise shapes, colours, and composition." },
              { n: "2", icon: "⏳", title: "The image reveals over time",
                body: "The blur fades as the countdown ticks. Guess early while it's still blurry to earn the maximum speed bonus." },
              { n: "3", icon: "🧠", title: "Make your guess",
                body: "Pick one of four options. You only get one guess — make it count. If time runs out, the image fully reveals." },
              { n: "4", icon: "🏆", title: "Score points",
                body: "Correct answers earn points based on how early you guessed, your streak, and the difficulty setting." },
            ].map(({ n, icon, title, body }) => (
              <li key={n} className="flex items-start gap-4 bg-white/4 rounded-xl border border-white/8 px-4 py-4">
                <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm">
                    <span className="text-[var(--accent)] mr-1.5">{n}.</span>
                    {title}
                  </p>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="scoring-heading">
          <h2 id="scoring-heading" className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
            Scoring
          </h2>
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <table className="w-full text-sm" aria-label="Scoring breakdown">
              <thead>
                <tr className="bg-white/4 border-b border-white/8">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-white/30">Component</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-white/30">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Base (correct answer)</td>
                  <td className="px-4 py-3 text-right font-semibold text-white">+1,000</td>
                </tr>
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Speed bonus — first 20% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-400">+500</td>
                </tr>
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Speed bonus — first 50% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-400">+200</td>
                </tr>
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Speed bonus — first 80% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-orange-400">+50</td>
                </tr>
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Streak ×1.5 (3–4 in a row)</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--accent-deep)]">×1.5</td>
                </tr>
                <tr className="bg-white/2">
                  <td className="px-4 py-3 text-white/70">Streak ×2 (5+ in a row)</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--accent-deep)]">×2.0</td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-2.5 bg-[var(--accent-light)] border-t border-[var(--accent-border)]">
              <p className="text-xs text-[var(--accent-deep)] font-medium">
                Total = (Base + Speed bonus) × Streak multiplier × Difficulty multiplier
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="difficulty-heading">
          <h2 id="difficulty-heading" className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
            Difficulty modes
          </h2>
          <div className="space-y-2.5">
            {[
              { label: "Easy",   badge: "×0.75", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
                desc: "45 seconds, lighter blur (8px). All three decoys are from different genres — the correct movie's genre is unique among the choices." },
              { label: "Medium", badge: "×1.0",  color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
                desc: "30 seconds, moderate blur (16px). One decoy shares the same genre. You'll need to look more carefully." },
              { label: "Hard",   badge: "×1.5",  color: "text-rose-400 bg-rose-500/15 border-rose-500/30",
                desc: "Only 20 seconds, heavy blur (24px). All three decoys are from the same genre. Pure recognition skills required." },
            ].map(({ label, badge, color, desc }) => (
              <div key={label} className="bg-white/4 rounded-xl border border-white/8 px-4 py-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-white">{label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{badge}</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/25 mt-3 text-center">
            Hard mode streaks are more impressive — and more rewarding.
          </p>
        </section>

      </main>
    </div>
  );
}
