# Team Icebreaker

A standalone Galaga-style mini-game for team planning days. One person plays for 30 seconds — shoot 8 invaders to **WIN**, miss the target and it's **MISSION FAILED**. Either way, a random ice-breaker question drops at the end.

- 60 ice-breaker questions, no repeats until the pool exhausts
- 30-second timer, kill goal of 8
- Keyboard: `←` / `→` (or `A` / `D`) to move, `SPACE` to fire
- Touch buttons appear on phones / tablets
- **Single self-contained `index.html`** — no build step, no dependencies, ~27 KB

## Run locally

Just open the file:

```bash
open index.html
```

Or serve any way you like (e.g. `python3 -m http.server`).

## Deploy

The whole app is one HTML file, so any static host works.

- **Vercel** — connected to GitHub `main`, auto-deploys at https://team-icebreaker.vercel.app
- **Misha web drop** — same `index.html` published as a Misha web drop

## Tweak

All game tuning lives at the top of the `<script>` block in `index.html`:

| Constant | Default | Effect |
|---|---|---|
| `ROUND_MS` | `30000` | Length of a turn (ms) |
| `KILL_GOAL` | `8` | Invaders to shoot for a WIN |
| `FIRE_COOLDOWN` | `220` | ms between shots |
| `SHIP_SPEED` | `380` | Ship px/s |
| `BULLET_SPEED` | `720` | Bullet px/s |

Add / change ice-breaker questions in the `QUESTIONS` array further down in the same script.
