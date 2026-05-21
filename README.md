# moviguessr

Guess the movie from its blurred poster. The image gradually sharpens as the timer runs down — pick from four choices, guess early for speed bonuses, build streaks for multipliers.

## Stack

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Vercel |
| Backend API | Hono on Cloudflare Workers | Cloudflare |
| Movie posters | TMDB CDN (`image.tmdb.org`) | — |
| Movie data | Static curated list (~600 movies) | — |
| State | localStorage (streaks, score, history) | — |

## Project Structure

```
apps/web/         Next.js frontend
apps/worker/      Hono backend (Cloudflare Workers)
packages/shared/  Shared TypeScript types + movie list
scripts/          One-off tooling (seed-movies.mjs)
```

## Local Development

### 1. Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Wrangler CLI (`npm install -g wrangler`) — needed to run the worker locally
- A Cloudflare account (free) — only needed for `wrangler dev`

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

**`apps/web/.env.local`** (copy from the example):

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

```
NEXT_PUBLIC_API_URL=http://localhost:8787
```

No secrets are needed for the worker — movie data is static and poster images are served from TMDB's public CDN without authentication.

### 4. Start the dev servers

Run each in a separate terminal:

```bash
# Terminal 1 — backend (Cloudflare Worker on :8787)
pnpm --filter @moviguessr/worker dev

# Terminal 2 — frontend (Next.js on :3000)
pnpm --filter @moviguessr/web dev
```

Or start both at once from the repo root:

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How the Game Works

1. A random movie is selected from a pool of ~600 curated titles.
2. Its poster is shown heavily blurred and gradually clears as the timer counts down.
3. Pick from four multiple-choice options before time runs out.
4. Difficulty controls how blurry the poster starts and how tight the timer is:

| Difficulty | Timer | Initial blur | Decoys |
|---|---|---|---|
| Easy | 45 s | 8 px | All different genres |
| Medium | 30 s | 16 px | 1 same genre, 2 different |
| Hard | 20 s | 24 px | All same genre |

### Scoring

| Component | Points |
|---|---|
| Base (correct) | 1,000 |
| Speed < 20% of timer | +500 |
| Speed 20–50% of timer | +200 |
| Speed 50–80% of timer | +50 |
| Streak ≥ 3 | ×1.5 |
| Streak ≥ 5 | ×2.0 |
| Easy difficulty | ×0.75 |
| Medium difficulty | ×1.0 |
| Hard difficulty | ×1.5 |

Speed thresholds are progress-based (not absolute seconds) so a Hard round and an Easy round award speed bonuses at the same relative point in the countdown.

All scores and streaks are stored locally in `localStorage` under the key `moviguessr:stats`.

## Deployment

### Backend (Cloudflare Workers)

```bash
cd apps/worker
wrangler login       # first time only
wrangler deploy
```

Copy the deployed URL (e.g. `https://moviguessr-worker.<your-account>.workers.dev`).

### Frontend (Vercel)

1. Push the repo to GitHub.
2. Import the repo in the [Vercel dashboard](https://vercel.com/new).
3. Set the root directory to `apps/web`.
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://moviguessr-worker.<your-account>.workers.dev
   ```
5. Deploy. Vercel will auto-deploy on every push to `main`.

Or deploy from the CLI:

```bash
cd apps/web
vercel --prod
```

## CORS

The Cloudflare Worker allows requests from `http://localhost:3000` and `https://moviguessr.vercel.app`. If you use a custom domain, update the `cors` config in `apps/worker/src/index.ts`:

```ts
cors({
  origin: ["http://localhost:3000", "https://your-domain.com"],
  allowMethods: ["GET", "OPTIONS"],
})
```

## Updating the Movie List

The movie list lives at `packages/shared/src/movies.ts` and is compiled into the worker at deploy time. To regenerate it with fresh TMDB data:

1. Get a free API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Run the seed script:
   ```bash
   node scripts/seed-movies.mjs YOUR_TMDB_API_KEY > packages/shared/src/movies.ts
   ```
   The script fetches ~600 movies from TMDB's popular, top-rated, and genre-discover endpoints, deduplicates by ID, filters for `vote_count >= 500` and a valid poster, then writes a ready-to-use TypeScript file.
3. Redeploy the worker and frontend.

## Known Limitations

### Data

- **Static movie list** — the ~600-movie list is compiled at build time. New releases won't appear until the list is regenerated and the project is redeployed.
- **TMDB poster CDN** — posters are served from `image.tmdb.org` without authentication. TMDB's CDN has no formal SLA for this usage pattern; if they restrict unauthenticated access in the future, poster images would break.
- **No anti-cheat** — the correct answer is included in the API response. A player inspecting network traffic can see it before guessing. Scores are local-only with no competitive leaderboard, so this is intentional.
- **No deduplication between rounds** — the same movie can appear in consecutive rounds.

### Infrastructure

- **Cloudflare Workers free tier** — 100,000 requests/day. Each game round is 1 worker request.
- **No global leaderboard** — scores are purely local. A leaderboard would require a backend database and user accounts (not currently in scope).

### State

- **localStorage only** — streaks and scores are not synced across devices or browsers. Clearing browser data resets all progress.

## Cost at Early Stage

| Service | Free Tier |
|---|---|
| Vercel | 100 GB bandwidth, unlimited deploys |
| Cloudflare Workers | 100,000 requests/day |
| TMDB CDN | Free (public poster delivery) |
| TMDB API | Free (for seed script — read-only key) |
