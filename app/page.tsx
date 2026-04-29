"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./icebreaker.css";

// ===== Questions =====
const QUESTIONS: string[] = [
  "If you could instantly master one completely useless skill, what would it be?",
  "What's the most unhinged thing currently in your fridge?",
  "If your life had a theme song that played when you walked into rooms, what would it be?",
  "What's a small, petty hill you'd die on?",
  "If you had to eat one meal for the rest of your life, what would it be?",
  "What's the weirdest thing you believed as a kid?",
  "What's your go-to karaoke song (even if you'd never actually sing it)?",
  "If you were a kitchen utensil, which one and why?",
  "What's the last thing you Googled?",
  "What's a movie or show you'll defend even though it's objectively bad?",
  "What's something you've done that you're surprisingly proud of?",
  "What did your younger self think you'd be doing right now?",
  "What's a hobby you've always wanted to pick up but haven't?",
  "What's the best piece of advice you've ever received?",
  "Where's a place you've travelled that exceeded expectations?",
  "What's something you're learning or trying to get better at right now?",
  "What's a book, podcast, or show that's stuck with you?",
  "What's your favourite way to spend a Sunday?",
  "What's something you've changed your mind about in the last few years?",
  "Who in your life shaped how you work the most?",
  "What's something you do at work that energises you, even on bad days?",
  "What's a small workplace ritual or habit you swear by?",
  "If you could swap jobs with anyone for a week, who and why?",
  "What's a skill you'd like to borrow from someone else on the team?",
  "You get to add one new public holiday \u2014 what's it for?",
  "If you could time travel for 24 hours, when and where?",
  "You can have dinner with three people, dead or alive \u2014 who?",
  "If you had to teach a class on something tomorrow, what would it be?",
  "What superpower would you choose, and what's the catch you'd accept?",
  "You win the lottery on Monday \u2014 what's your Tuesday look like?",
  "If you could instantly be fluent in any language, which one?",
  "What's a small invention that would make your life noticeably better?",
  "If you opened a caf\u00e9/shop/business tomorrow, what would it be?",
  "You can erase one song from existence forever \u2014 which one?",
  "What's something you used to find hard that now feels easy?",
  "What's a moment recently where you felt genuinely proud of yourself?",
  "What does a \u201Cgood day\u201D look like for you?",
  "What's something you've been thinking about a lot lately?",
  "What's a tradition (family, cultural, made-up) that matters to you?",
  "What's a compliment you've gotten that really stuck?",
  "What's something you wish more people knew about you?",
  "What's the kindest thing someone's done for you at work?",
  "What are you most looking forward to in the next few months?",
  "If this year had a one-word theme so far, what would yours be?",
  "What's a belief or value you hold now that you didn't five years ago?",
  "When do you feel most like yourself?",
  "What's something you're slowly making peace with?",
  "What's a question you've been sitting with lately?",
  "Who's someone you think about often who doesn't know it?",
  "What's a version of yourself you've outgrown?",
  "What's something that used to scare you that you've made friends with?",
  "What's a quiet win from this year that no one really noticed?",
  "What's something you'd tell yourself five years ago, knowing they probably wouldn't listen?",
  "What's a relationship in your life you'd like to invest more in?",
  "What's something you want to be true of you in ten years?",
  "What's a season of life you didn't realise was special until it ended?",
  "What's something you're holding loosely right now?",
  "What does success look like for you outside of work?",
  "What's a fear you've noticed shaping your decisions?",
  "What's something small that consistently brings you back to yourself?",
];

// ===== Game constants =====
const STAGE_W = 760;
const STAGE_H = 540;
const SHIP_Y = 480;
const SHIP_HALF_W = 18;
const SHIP_SPEED = 380; // px/s
const BULLET_SPEED = 720; // px/s
const FIRE_COOLDOWN = 220; // ms
const MAX_BULLETS = 6;
const ROUND_MS = 30000;
const KILL_GOAL = 8;
const HIT_RADIUS_X = 22;
const HIT_RADIUS_Y = 18;
const INVADER_HALF_W = 16;
const HUES = ["#ff6080", "#80c0ff", "#ffc040", "#a080ff", "#80e0c0", "#ff80c0"];

// ===== Types =====
type Bullet = { id: number; x: number; y: number };
type Invader = { id: number; x: number; y: number; vx: number; vy: number; hue: string };
type FX = { id: number; kind: "boom" | "spark"; x: number; y: number; vx: number; vy: number; hue: string; born: number };
type Phase = "title" | "playing" | "won" | "lost";

// ===== Sprites =====
function ShipSprite({ size = 38 }: { size?: number }) {
  const px = size / 14;
  return (
    <svg width={14 * px} height={14 * px} viewBox="0 0 14 14" shapeRendering="crispEdges">
      <rect x="6" y="0" width="2" height="2" fill="#ffffff" />
      <rect x="5" y="2" width="4" height="2" fill="#ffe040" />
      <rect x="4" y="4" width="6" height="2" fill="#ffe040" />
      <rect x="3" y="6" width="8" height="2" fill="#ffc830" />
      <rect x="0" y="8" width="14" height="2" fill="#ffc830" />
      <rect x="0" y="10" width="14" height="2" fill="#ff5040" />
      <rect x="2" y="12" width="2" height="2" fill="#ff8830" />
      <rect x="6" y="12" width="2" height="2" fill="#ff8830" />
      <rect x="10" y="12" width="2" height="2" fill="#ff8830" />
    </svg>
  );
}

function InvaderSprite({ size = 30, hue = "#ff6080" }: { size?: number; hue?: string }) {
  const px = size / 12;
  return (
    <svg width={12 * px} height={12 * px} viewBox="0 0 12 12" shapeRendering="crispEdges">
      <rect x="2" y="0" width="2" height="2" fill={hue} />
      <rect x="8" y="0" width="2" height="2" fill={hue} />
      <rect x="2" y="2" width="8" height="2" fill={hue} />
      <rect x="0" y="4" width="12" height="2" fill={hue} />
      <rect x="2" y="4" width="2" height="2" fill="#ffffff" />
      <rect x="8" y="4" width="2" height="2" fill="#ffffff" />
      <rect x="0" y="6" width="2" height="2" fill={hue} />
      <rect x="4" y="6" width="4" height="2" fill={hue} />
      <rect x="10" y="6" width="2" height="2" fill={hue} />
      <rect x="2" y="8" width="2" height="2" fill={hue} />
      <rect x="8" y="8" width="2" height="2" fill={hue} />
      <rect x="0" y="10" width="2" height="2" fill={hue} />
      <rect x="10" y="10" width="2" height="2" fill={hue} />
    </svg>
  );
}

// ===== Page =====
export default function IcebreakerPage() {
  const [phase, setPhase] = useState<Phase>("title");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [, forceTick] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const game = useRef({
    shipX: STAGE_W / 2,
    bullets: [] as Bullet[],
    invaders: [] as Invader[],
    fx: [] as FX[],
    score: 0,
    keys: {} as Record<string, boolean>,
    lastFire: 0,
    nextSpawn: 0,
    startT: 0,
    question: "",
    spawned: 0,
  });
  const idRef = useRef(0);
  const askedRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);

  // ===== Stage scaling =====
  useEffect(() => {
    const fit = () => {
      const w = stageRef.current?.clientWidth ?? STAGE_W;
      const scale = w / STAGE_W;
      if (innerRef.current) innerRef.current.style.transform = `scale(${scale})`;
    };
    fit();
    const obs = new ResizeObserver(fit);
    if (stageRef.current) obs.observe(stageRef.current);
    window.addEventListener("resize", fit);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // ===== Start a round =====
  const start = useCallback(() => {
    let pool = QUESTIONS.map((_, i) => i).filter((i) => !askedRef.current.has(i));
    if (pool.length === 0) {
      askedRef.current.clear();
      pool = QUESTIONS.map((_, i) => i);
    }
    const qIdx = pool[Math.floor(Math.random() * pool.length)];
    askedRef.current.add(qIdx);

    const g = game.current;
    g.shipX = STAGE_W / 2;
    g.bullets = [];
    g.invaders = [];
    g.fx = [];
    g.score = 0;
    g.keys = {};
    g.lastFire = 0;
    g.startT = performance.now();
    g.nextSpawn = g.startT + 400;
    g.question = QUESTIONS[qIdx];
    g.spawned = 0;
    setScore(0);
    setTimeLeft(ROUND_MS);
    setPhase("playing");
  }, []);

  // ===== Key listeners =====
  useEffect(() => {
    if (phase !== "playing") return;

    const captureKey = (e: KeyboardEvent) => {
      const k = e.key;
      return k === " " || k === "Spacebar" || k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown";
    };
    const onDown = (e: KeyboardEvent) => {
      if (captureKey(e)) e.preventDefault();
      const k = e.key.toLowerCase();
      game.current.keys[k] = true;
      if (e.key === " " || e.key === "Spacebar") game.current.keys["fire"] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      game.current.keys[k] = false;
      if (e.key === " " || e.key === "Spacebar") game.current.keys["fire"] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [phase]);

  // ===== Game loop =====
  useEffect(() => {
    if (phase !== "playing") return;

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = game.current;
      const elapsed = now - g.startT;
      const remaining = Math.max(0, ROUND_MS - elapsed);

      // Move ship
      const k = g.keys;
      const left = k["arrowleft"] || k["a"];
      const right = k["arrowright"] || k["d"];
      if (left) g.shipX -= SHIP_SPEED * dt;
      if (right) g.shipX += SHIP_SPEED * dt;
      g.shipX = Math.max(SHIP_HALF_W, Math.min(STAGE_W - SHIP_HALF_W, g.shipX));

      // Fire
      if (k["fire"] && now - g.lastFire > FIRE_COOLDOWN && g.bullets.length < MAX_BULLETS) {
        g.bullets.push({ id: ++idRef.current, x: g.shipX, y: SHIP_Y - 22 });
        g.lastFire = now;
      }

      // Bullets
      for (const b of g.bullets) b.y -= BULLET_SPEED * dt;
      g.bullets = g.bullets.filter((b) => b.y > -16);

      // Spawn invaders
      while (now > g.nextSpawn) {
        const ramp = Math.min(1, elapsed / ROUND_MS);
        const speed = 70 + ramp * 90 + Math.random() * 50;
        const x = 50 + Math.random() * (STAGE_W - 100);
        const vx = (Math.random() - 0.5) * 90;
        const hue = HUES[Math.floor(Math.random() * HUES.length)];
        g.invaders.push({ id: ++idRef.current, x, y: -20, vx, vy: speed, hue });
        const gap = 1500 - ramp * 700 + Math.random() * 280;
        g.nextSpawn = now + gap;
        g.spawned++;
      }

      // Update invaders
      for (const inv of g.invaders) {
        inv.x += inv.vx * dt;
        if (inv.x < INVADER_HALF_W) {
          inv.x = INVADER_HALF_W;
          inv.vx = -inv.vx;
        } else if (inv.x > STAGE_W - INVADER_HALF_W) {
          inv.x = STAGE_W - INVADER_HALF_W;
          inv.vx = -inv.vx;
        }
        inv.y += inv.vy * dt;
      }
      g.invaders = g.invaders.filter((inv) => inv.y < STAGE_H + 40);

      // Collisions
      const killedB = new Set<number>();
      const killedI = new Set<number>();
      let kills = 0;
      for (const b of g.bullets) {
        if (killedB.has(b.id)) continue;
        for (const inv of g.invaders) {
          if (killedI.has(inv.id)) continue;
          if (Math.abs(b.x - inv.x) < HIT_RADIUS_X && Math.abs(b.y - inv.y) < HIT_RADIUS_Y) {
            killedB.add(b.id);
            killedI.add(inv.id);
            g.fx.push({ id: ++idRef.current, kind: "boom", x: inv.x, y: inv.y, vx: 0, vy: 0, hue: inv.hue, born: now });
            for (let s = 0; s < 5; s++) {
              const ang = Math.random() * Math.PI * 2;
              const sp = 80 + Math.random() * 90;
              g.fx.push({
                id: ++idRef.current,
                kind: "spark",
                x: inv.x,
                y: inv.y,
                vx: Math.cos(ang) * sp,
                vy: Math.sin(ang) * sp,
                hue: inv.hue,
                born: now,
              });
            }
            kills++;
            break;
          }
        }
      }
      if (kills > 0) {
        g.bullets = g.bullets.filter((b) => !killedB.has(b.id));
        g.invaders = g.invaders.filter((inv) => !killedI.has(inv.id));
        g.score += kills;
        setScore(g.score);
      }

      // FX
      for (const f of g.fx) {
        if (f.kind === "spark") {
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.vx *= 0.92;
          f.vy *= 0.92;
        }
      }
      g.fx = g.fx.filter((f) => now - f.born < (f.kind === "boom" ? 500 : 600));

      setTimeLeft(remaining);
      forceTick((t) => (t + 1) & 0xffff);

      // End conditions
      if (g.score >= KILL_GOAL) {
        setPhase("won");
        return;
      }
      if (remaining <= 0) {
        setPhase("lost");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  // ===== Touch helpers =====
  const setKey = useCallback((key: string, down: boolean) => {
    game.current.keys[key] = down;
  }, []);

  const g = game.current;
  const seconds = (timeLeft / 1000).toFixed(1);
  const progressPct = Math.min(100, (score / KILL_GOAL) * 100);
  const isPlaying = phase === "playing";
  const isWin = phase === "won";
  const isLose = phase === "lost";
  const isEnd = isWin || isLose;

  return (
    <div style={{ padding: "28px 16px 40px", maxWidth: 880, margin: "0 auto" }}>
      <h1 className="ib-page-title">★ TEAM ICEBREAKER ★</h1>
      <div className="ib-page-tagline">SHOOT THE INVADERS · UNLOCK THE QUESTION</div>

      <div ref={stageRef} className={`ib-stage ${isLose ? "ib-shake" : ""}`}>
        <div
          ref={innerRef}
          className="ib-stage-inner"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transformOrigin: "top left",
          }}
        >
          <div className="ib-stars" />

          {isPlaying && (
            <>
              <div className="ib-hud">
                <span>KILLS {String(score).padStart(2, "0")} / {KILL_GOAL}</span>
                <span>TIME {seconds}s</span>
              </div>

              <div className="ib-actor ib-ship-rise" style={{ left: g.shipX, top: SHIP_Y, zIndex: 5 }}>
                <ShipSprite size={38} />
              </div>

              {g.bullets.map((b) => (
                <div key={b.id} className="ib-actor" style={{ left: b.x, top: b.y, zIndex: 4 }}>
                  <div className="ib-bullet" />
                </div>
              ))}

              {g.invaders.map((inv) => (
                <div key={inv.id} className="ib-actor" style={{ left: inv.x, top: inv.y, zIndex: 3 }}>
                  <InvaderSprite size={30} hue={inv.hue} />
                </div>
              ))}

              {g.fx.map((f) => (
                <div key={f.id} className="ib-actor" style={{ left: f.x, top: f.y, zIndex: 6 }}>
                  {f.kind === "boom" ? (
                    <div className="ib-explosion" />
                  ) : (
                    <div
                      className="ib-spark"
                      style={{
                        background: f.hue,
                        boxShadow: `0 0 6px ${f.hue}`,
                        opacity: Math.max(0, 1 - (performance.now() - f.born) / 600),
                      }}
                    />
                  )}
                </div>
              ))}

              <div className="ib-progress-track">
                <div className="ib-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </>
          )}

          {phase === "title" && (
            <div className="ib-overlay">
              <div className="ib-big-title">GALAGA</div>
              <div className="ib-press" style={{ fontSize: 22 }}>▸ PRESS LAUNCH TO PLAY ◂</div>
              <div className="ib-controls-hint">
                <kbd>←</kbd><kbd>→</kbd> MOVE &nbsp;·&nbsp; <kbd>SPACE</kbd> FIRE
              </div>
              <div style={{ fontSize: 16, letterSpacing: "0.16em", color: "#c8d8ff", opacity: 0.8 }}>
                {KILL_GOAL} KILLS IN 30s = WIN
              </div>
            </div>
          )}

          {isWin && (
            <div className="ib-end-overlay win">
              {/* Confetti */}
              {Array.from({ length: 30 }, (_, i) => {
                const left = Math.random() * STAGE_W;
                const delay = Math.random() * 0.6;
                const hue = HUES[i % HUES.length];
                return (
                  <span
                    key={i}
                    className="ib-confetti"
                    style={{
                      left,
                      background: hue,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
              <div className="ib-banner-big win">★ VICTORY ★</div>
              <div className="ib-end-stat">
                {score} KILLS · TARGET {KILL_GOAL} CLEARED
              </div>
              <div className="ib-question">
                <div className="ib-question-eyebrow">★ TODAY&rsquo;S QUESTION ★</div>
                <div className="ib-question-text">{g.question}</div>
              </div>
            </div>
          )}

          {isLose && (
            <div className="ib-end-overlay lose">
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className="ib-smoke"
                  style={{ left: 60 + i * 110, animationDelay: `${i * 0.1}s` }}
                />
              ))}
              <div className="ib-banner-big lose">MISSION FAILED</div>
              <div className="ib-end-stat">
                {score} KILLS · TARGET {KILL_GOAL} MISSED
              </div>
              <div className="ib-question">
                <div className="ib-question-eyebrow">★ HERE&rsquo;S YOUR QUESTION ANYWAY ★</div>
                <div className="ib-question-text">{g.question}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 18 }}>
        <button onClick={start} className="ib-btn">
          {phase === "title" ? "▸ INSERT COIN" : isEnd ? "▸ NEXT TURN" : "▸ RESTART"}
        </button>
      </div>

      <div className="ib-touch-row">
        <button
          className="ib-touch-btn"
          aria-label="Move left"
          disabled={!isPlaying}
          onTouchStart={(e) => { e.preventDefault(); setKey("arrowleft", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setKey("arrowleft", false); }}
          onMouseDown={() => setKey("arrowleft", true)}
          onMouseUp={() => setKey("arrowleft", false)}
          onMouseLeave={() => setKey("arrowleft", false)}
        >◀</button>
        <button
          className="ib-touch-btn fire"
          aria-label="Fire"
          disabled={!isPlaying}
          onTouchStart={(e) => { e.preventDefault(); setKey("fire", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setKey("fire", false); }}
          onMouseDown={() => setKey("fire", true)}
          onMouseUp={() => setKey("fire", false)}
          onMouseLeave={() => setKey("fire", false)}
        >FIRE</button>
        <button
          className="ib-touch-btn"
          aria-label="Move right"
          disabled={!isPlaying}
          onTouchStart={(e) => { e.preventDefault(); setKey("arrowright", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setKey("arrowright", false); }}
          onMouseDown={() => setKey("arrowright", true)}
          onMouseUp={() => setKey("arrowright", false)}
          onMouseLeave={() => setKey("arrowright", false)}
        >▶</button>
      </div>

      <div className="ib-meta">
        {QUESTIONS.length} QUESTIONS · 30 SECONDS · {KILL_GOAL} KILLS TO WIN
      </div>
    </div>
  );
}
