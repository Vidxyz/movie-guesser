import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = { title: "moviguessr — About" };

export default function AboutPage() {
  return (
    <div className="min-h-[100svh] bg-[var(--bg)]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8" aria-label="About">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">About</h1>
          <p className="text-white/30 text-sm">A movie guessing game built for fun.</p>
        </div>

        <section className="bg-white/4 rounded-xl border border-white/8 p-5 space-y-3 text-sm text-white/60 leading-relaxed">
          <p>
            <span className="font-bold text-[var(--accent)]">movi</span>
            <span className="font-bold text-white">guessr</span>{" "}
            shows you a heavily blurred movie still and challenges you to identify it from four options before the timer runs out.
          </p>
          <p>
            The blur gradually fades as time passes — guess early to earn speed bonuses, build streaks for multipliers, and choose a harder difficulty to earn more points per round.
          </p>
          <p>
            All your stats and settings are stored locally in your browser. Nothing is sent to a server.
          </p>
        </section>

        <div className="text-center">
          <Link
            href="/play"
            className="inline-block px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-dark)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            style={{ boxShadow: "0 0 16px var(--accent-glow)" }}
          >
            Start playing →
          </Link>
        </div>

        <div className="border-t border-white/8" />

        <section aria-labelledby="built-by-heading">
          <h2 id="built-by-heading" className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
            Built by
          </h2>
          <a
            href="https://vidxyz.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <div className="w-9 h-9 rounded-full bg-[var(--accent-light)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-deep)] font-bold text-sm shrink-0">
              V
            </div>
            <span className="text-sm text-white/50">vidxyz.github.io</span>
            <svg className="ml-1 h-3.5 w-3.5 text-white/20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </section>
      </main>
    </div>
  );
}
