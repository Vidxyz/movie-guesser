import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "moviguessr — Guess the Movie",
  description:
    "Can you identify a movie from its blurred poster? The poster slowly unblurs as the timer counts down. Pick from 4 options, guess fast, build streaks, earn points.",
  keywords: ["movies", "movie quiz", "film", "game", "poster", "guess", "cinema"],
  openGraph: {
    title: "moviguessr — Guess the Movie",
    description: "Identify movies from their blurring posters. A cinematic brain-teaser.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "moviguessr",
    description: "Guess the movie from its blurred poster.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
