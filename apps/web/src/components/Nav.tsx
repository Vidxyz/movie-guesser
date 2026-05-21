"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS: { href: string; label: string; mobileIcon?: React.ReactNode }[] = [
  {
    href: "/how-to-play",
    label: "How to play",
    mobileIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  { href: "/stats",  label: "Stats" },
  { href: "/about",  label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-[var(--bg)]/90 backdrop-blur-md border-b border-white/8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {pathname !== "/" && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="text-white/40 hover:text-white/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded p-1 -ml-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
        )}
        <Link
          href="/"
          className="flex items-baseline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          aria-label="moviguessr — home"
        >
          <span className="text-[var(--accent)] font-bold text-xl tracking-tight">movi</span>
          <span className="text-white font-bold text-xl tracking-tight">guessr</span>
        </Link>
      </div>

      <nav className="flex items-center gap-1" aria-label="Site navigation">
        {LINKS.map(({ href, label, mobileIcon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              ${pathname === href
                ? "bg-[var(--accent-light)] text-[var(--accent-deep)]"
                : "text-white/50 hover:text-white hover:bg-white/8"
              }`}
          >
            {mobileIcon ? (
              <>
                <span className="sm:hidden">{mobileIcon}</span>
                <span className="hidden sm:inline">{label}</span>
              </>
            ) : label}
          </Link>
        ))}
        <Link
          href="/settings"
          className={`ml-1 p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
            ${pathname === "/settings"
              ? "bg-[var(--accent-light)] text-[var(--accent)]"
              : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          aria-label="Settings"
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </Link>
      </nav>
    </header>
  );
}
