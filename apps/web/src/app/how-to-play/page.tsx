import Nav from "@/components/Nav";

export const metadata = { title: "moviguessr — How to Play" };

export default function HowToPlayPage() {
  return (
    <div className="min-h-[100svh] bg-[#f8f9fb]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8" aria-label="How to play">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">How to Play</h1>
          <p className="text-[#64748b] text-sm">Guess movies from blurred posters, earn points, build streaks.</p>
        </div>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-4">
            Each round
          </h2>
          <ol className="space-y-3 list-none">
            {[
              {
                n: "1",
                icon: "🎬",
                title: "Study the blurred poster",
                body: "A movie poster is shown with heavy blur applied. Try to recognise shapes, colours, and composition.",
              },
              {
                n: "2",
                icon: "⏳",
                title: "The poster reveals over time",
                body: "The blur slowly fades as the countdown ticks. Guess early while it's still blurry to earn the maximum speed bonus.",
              },
              {
                n: "3",
                icon: "🧠",
                title: "Make your guess",
                body: "Pick one of four options. You only get one guess — make it count. If time runs out, the poster fully reveals.",
              },
              {
                n: "4",
                icon: "🏆",
                title: "Score points",
                body: "Correct answers earn points based on how early you guessed, your current streak, and the difficulty setting.",
              },
            ].map(({ n, icon, title, body }) => (
              <li
                key={n}
                className="flex items-start gap-4 bg-white rounded-xl border border-[#e4e7ed] px-4 py-4 shadow-sm"
              >
                <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
                <div>
                  <p className="font-semibold text-[#0f172a] text-sm">
                    <span className="text-[var(--accent)] mr-1.5">{n}.</span>
                    {title}
                  </p>
                  <p className="text-[#64748b] text-xs mt-1 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="scoring-heading">
          <h2 id="scoring-heading" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-4">
            Scoring
          </h2>
          <div className="bg-white rounded-xl border border-[#e4e7ed] overflow-hidden shadow-sm">
            <table className="w-full text-sm" aria-label="Scoring breakdown">
              <thead>
                <tr className="bg-[#f8f9fb] border-b border-[#e4e7ed]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#64748b]">Component</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#64748b]">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f7]">
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Base (correct answer)</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#0f172a]">+1,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Speed bonus — first 20% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">+500</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Speed bonus — first 50% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-600">+200</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Speed bonus — first 80% of timer</td>
                  <td className="px-4 py-3 text-right font-semibold text-orange-500">+50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Streak ×1.5 (3–4 in a row)</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--accent)]">×1.5</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[#0f172a]">Streak ×2 (5+ in a row)</td>
                  <td className="px-4 py-3 text-right font-semibold text-[var(--accent)]">×2.0</td>
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
          <h2 id="difficulty-heading" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-4">
            Difficulty modes
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Easy",
                badge: "×0.75",
                badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
                desc: "45 seconds, lighter blur (8px). All three decoys are from different genres — the correct movie's genre is unique among the choices.",
              },
              {
                label: "Medium",
                badge: "×1.0",
                badgeColor: "text-amber-600 bg-amber-50 border-amber-200",
                desc: "30 seconds, moderate blur (16px). One decoy shares the same genre. You'll need to look more carefully.",
              },
              {
                label: "Hard",
                badge: "×1.5",
                badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
                desc: "Only 20 seconds, heavy blur (24px). All three decoys are from the same genre. Pure poster recognition skills required.",
              },
            ].map(({ label, badge, badgeColor, desc }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-[#e4e7ed] px-4 py-3.5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0f172a]">{label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {badge}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mt-3 text-center">
            Hard mode streaks are more impressive — and more rewarding.
          </p>
        </section>

      </main>
    </div>
  );
}
