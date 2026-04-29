# Team Icebreaker

A standalone Galaga-style mini-game for team planning days. One person plays for 30 seconds — shoot 8 invaders to **WIN**, miss the target and it's **MISSION FAILED**. Either way, a random ice-breaker question drops at the end.

- 60 ice-breaker questions, no repeats until the pool is exhausted
- 30-second timer, kill goal of 8
- Keyboard: `←` / `→` (or `A` / `D`) to move, `SPACE` to fire
- Touch buttons appear on phones / tablets
- No backend, no DB — fully client-side, deploys anywhere

## Local dev

```bash
yarn install   # or: npm install
yarn dev       # http://localhost:3000
```

## Deploy to Vercel

The fastest way:

```bash
# 1. Push this folder to a new GitHub repo
git init
git add .
git commit -m "initial: team icebreaker"
gh repo create team-icebreaker --public --source=. --push
# (or use the GitHub UI to create the repo and push manually)

# 2. In Vercel:
#    - Click "Add New Project"
#    - Import the team-icebreaker repo
#    - Framework: Next.js (auto-detected)
#    - Click Deploy
```

Vercel will give you a public URL like `team-icebreaker.vercel.app` — share it with the team.

Alternative one-shot CLI deploy (no GitHub needed):

```bash
npx vercel
```

## Tweaking

All game tuning lives at the top of [`app/page.tsx`](app/page.tsx):

| Constant | Default | Effect |
|---|---|---|
| `ROUND_MS` | `30000` | Length of a turn (ms) |
| `KILL_GOAL` | `8` | Invaders to shoot for a WIN |
| `FIRE_COOLDOWN` | `220` | ms between shots |
| `SHIP_SPEED` | `380` | Ship px/s |
| `BULLET_SPEED` | `720` | Bullet px/s |

Add or change ice-breaker questions in the `QUESTIONS` array at the top of the same file.
