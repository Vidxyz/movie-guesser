/**
 * Filters movies.ts in-place:
 *  - Drops pre-1990 films unless they're in the KEEP_PRE_1990 set
 *  - Drops films in the REMOVE_IDS set (inappropriate / too niche / docs / music films)
 *  - Re-writes the header comment with the new count
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../packages/shared/src/movies.ts");

// Pre-1990 films that are extremely well-known – keep these
const KEEP_PRE_1990 = new Set([
  11,    // Star Wars (1977)
  238,   // The Godfather (1972)
  240,   // The Godfather Part II (1974)
  348,   // Alien (1979)
  694,   // The Shining (1980)
  85,    // Raiders of the Lost Ark (1981)
  78,    // Blade Runner (1982)
  601,   // E.T. the Extra-Terrestrial (1982)
  111,   // Scarface (1983)
  218,   // The Terminator (1984)
  105,   // Back to the Future (1985)
  744,   // Top Gun (1986)
  679,   // Aliens (1986)
  562,   // Die Hard (1988)
  1891,  // The Empire Strikes Back (1980)
  1892,  // Return of the Jedi (1983)
  578,   // Jaws (1975)
  106,   // Predator (1987)
  28,    // Apocalypse Now (1979)
  620,   // Ghostbusters (1984)
  429,   // The Good, the Bad and the Ugly (1966)
  8392,  // My Neighbor Totoro (1988)
  89,    // Indiana Jones and the Last Crusade (1989)
  87,    // Indiana Jones and the Temple of Doom (1984)
  268,   // Batman (1989)
  621,   // Grease (1978)
  2493,  // The Princess Bride (1987)
  165,   // Back to the Future Part II (1989)
  1924,  // Superman (1978)
  149,   // Akira (1988)
  16859, // Kiki's Delivery Service (1989)
  1368,  // First Blood (1982)
  9552,  // The Exorcist (1973)
  539,   // Psycho (1960)
  600,   // Full Metal Jacket (1987)
  377,   // A Nightmare on Elm Street (1984)
  948,   // Halloween (1978)
  103,   // Taxi Driver (1976)
  1366,  // Rocky (1976)
  9340,  // The Goonies (1985)
]);

// Remove all 2026 films (unreleased — no real scene backdrops exist)
const REMOVE_YEAR_2026 = true;

// Remove all documentaries (genre_ids includes 99) — not guessable from a still
const REMOVE_DOCUMENTARIES = true;

// Additional specific removals
const REMOVE_IDS = new Set([
  249397,  // Nymphomaniac: Vol. II
  258216,  // Nymphomaniac: Vol. I
  979,     // Irreversible
  11013,   // Secretary
  664413,  // 365 Days
  4588,    // Lust, Caution
  318256,  // Hot Girls Wanted (documentary about porn industry)
  184314,  // Young & Beautiful
  255709,  // Hope (Korean film – child abuse subject matter)
  11012,   // Damage
  345,     // Eyes Wide Shut
  216015,  // Fifty Shades of Grey
  337167,  // Fifty Shades Freed
  341174,  // Fifty Shades Darker
  537915,  // After
  744275,  // After We Fell
  1010581, // My Fault
  13192,   // Moonwalker
  13576,   // This Is It (MJ documentary)
  92060,   // Michael Jackson's Thriller (short film)
  1022256, // Selena Gomez: My Mind & Me (documentary)
  1430,    // Bowling for Columbine (documentary)
  339846,  // Baywatch
  // Concert films / TV specials / making-of docs
  1160164, // Taylor Swift | The Eras Tour
  740996,  // BLACKPINK: Light Up the Sky
  164558,  // One Direction: This Is Us
  653567,  // Miss Americana (Taylor Swift doc)
  472424,  // Gaga: Five Foot Two
  899082,  // Harry Potter 20th Anniversary: Return to Hogwarts
  1015606, // Obi-Wan Kenobi: A Jedi's Return
  691179,  // Friends: The Reunion
  689249,  // Money Heist: The Phenomenon
  // Jackass direct-to-video / filler
  14158,   // Jackass 2.5
  65851,   // Jackass 3.5
  // Behind-the-scenes featurettes
  503210,  // Return to Jurassic Park
  // KPop / very niche
  803796,  // KPop Demon Hunters
  335,     // Once Upon a Time in the West (1968 – too old/niche)
  311,     // Once Upon a Time in America (1984 – relatively obscure)
  346,     // Seven Samurai (1954)
  389,     // 12 Angry Men (1957)
  567,     // Rear Window (1954)
  185,     // A Clockwork Orange (1971)
  62,      // 2001: A Space Odyssey (1968)
  28,      // Apocalypse Now – keep actually (listed in KEEP), ignore duplicate
  12493,   // High and Low (1963 – very niche)
  14537,   // Harakiri (1962)
  37257,   // Witness for the Prosecution (1957)
  967,     // Spartacus (1960)
  665,     // Ben-Hur (1959)
  15121,   // The Sound of Music (1965)
  770,     // Gone with the Wind (1939)
  408,     // Snow White and the Seven Dwarfs (1938)
  1585,    // It's a Wonderful Life (1946)
  510,     // One Flew Over the Cuckoo's Nest (1975)
  1621,    // Trading Places (1983)
  957,     // Spaceballs (1987)
  1369,    // Rambo: First Blood Part II (1985)
  792,     // Platoon (1986) – borderline, remove to keep list tighter
  11216,   // Cinema Paradiso (1988)
]);

const raw = readFileSync(SRC, "utf8");

// Extract the array content between the first `[` and the final `];`
const arrStart = raw.indexOf("[");
const arrEnd   = raw.lastIndexOf("];");
const before   = raw.slice(0, arrStart + 1);   // everything up to and including `[`
const after    = raw.slice(arrEnd);             // `];` and anything after

const entries = raw.slice(arrStart + 1, arrEnd);

// Split on entry boundaries: each entry is `  { id: ..., ... },\n`
const lines = entries.split("\n").filter(l => l.trim().length > 0);

const kept = [];
let removed = 0;

for (const line of lines) {
  const idMatch    = line.match(/\bid:\s*(\d+)/);
  const yearMatch  = line.match(/\byear:\s*(\d{4})/);
  const genreMatch = line.match(/genre_ids:\s*\[([^\]]+)\]/);
  if (!idMatch || !yearMatch) { kept.push(line); continue; }

  const id     = parseInt(idMatch[1], 10);
  const year   = parseInt(yearMatch[1], 10);
  const genres = genreMatch ? genreMatch[1].split(",").map(x => parseInt(x.trim())) : [];

  if (REMOVE_IDS.has(id))                              { removed++; continue; }
  if (REMOVE_YEAR_2026 && year >= 2026)                { removed++; continue; }
  if (REMOVE_DOCUMENTARIES && genres.includes(99))     { removed++; continue; }
  if (year < 1990 && !KEEP_PRE_1990.has(id))          { removed++; continue; }

  kept.push(line);
}

// Rebuild file with updated header count
const totalKept = kept.length;
const newBefore = before.replace(
  /\/\/ Auto-generated.*\n/,
  `// Auto-generated by scripts/seed-movies.mjs — do not edit by hand\n// ${totalKept} movies · min vote_count: 500 · sorted by popularity desc\n`,
);

const newContent = newBefore + "\n" + kept.join("\n") + "\n" + after;
writeFileSync(SRC, newContent, "utf8");

console.log(`Done. Removed ${removed} movies. Kept ${totalKept}.`);
