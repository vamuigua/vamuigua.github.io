/**
 * Pixel world renderer: "Dusk at the Highlands Camp".
 *
 * Everything is drawn in code on a low-resolution canvas (≈320×180 logical
 * pixels) and scaled up with `image-rendering: pixelated`. Static layers are
 * pre-rendered once per resize; each frame only blits them and draws the
 * animated bits (fire, sparks, fireflies, stars, avatar, slime), at 12 fps.
 * The loop pauses when offscreen or when the tab is hidden, and renders a
 * single still frame under prefers-reduced-motion.
 */

type RGB = [number, number, number];

const PAL = {
  sky: ['#080a17', '#0b0e1f', '#101328', '#151733', '#1c1b3e', '#261f48', '#33244f', '#452a56', '#5b3158', '#7a3c57', '#9c4b52'],
  starA: '#ffffff',
  starB: '#cfc6ff',
  starC: '#ffd9a0',
  moon: '#f6ecc8',
  moonShade: '#d9c894',
  far: '#2a2553',
  farRim: '#463f82',
  mid: '#1d1a3e',
  midRim: '#2f2a5d',
  forest: '#120f2b',
  forestRim: '#1b1840',
  ground: '#141127',
  groundTop: '#1f1b3a',
  grass: '#2a2550',
  logA: '#5a3424',
  logB: '#3a2018',
  logTop: '#7b4a30',
  tentL: '#7a4a5e',
  tentLd: '#5e3a52',
  tentR: '#3b2f63',
  tentRd: '#2e2550',
  tentDoor: '#0f0a1c',
  tentPole: '#9d7a8c',
  post: '#4a2f22',
  board: '#7a5034',
  boardDark: '#56351f',
  boardInk: '#f1d39a',
  firefly: '#e9ff9c',
  firefly2: '#ffd36b',
  spark: '#ffcf70',
};

const FLAME: string[] = ['#fff6d5', '#ffe08a', '#ffb547', '#ff8a3a', '#ff5a2a', '#c8322a'];

/* 16×20 avatar, front view, sitting with a laptop. */
const HERO = [
  '.....hhhhhh.....',
  '....hhHHhhhh....',
  '....hhhhhhhh....',
  '....hsssssssh...',
  '....ssessess....',
  '....dssssssd....',
  '....dsbmmbsd....',
  '.....dbbbbd.....',
  '......dssd......',
  '...WwwwwwwwwW...',
  '..Wwwwwwwwwwww..',
  '..WwwwwwwwwwwW..',
  '..sWLLLLLLLLWs..',
  '..swLllggllLws..',
  '...sLllllllLs...',
  '..jjLLLLLLLLjj..',
  '..jjjjjjjjjjjj..',
  '..Jjj......jjJ..',
  '..Jjj......jjJ..',
  '..kkkk....kkkk..',
];
// fix row 3 to exactly 16 wide (hair framing the face)
HERO[3] = '....hssssssh....';

const HERO_PAL: Record<string, string> = {
  h: '#17110f',
  H: '#30251f',
  s: '#8b5a3c',
  d: '#6b4029',
  e: '#140c09',
  b: '#2a1c16',
  m: '#4e2a1c',
  w: '#ecebf5',
  W: '#b9b6cf',
  j: '#2f3a63',
  J: '#232c4d',
  k: '#1a1424',
  L: '#8d95bd',
  l: '#656c95',
  g: '#9ff3d9',
};

const SLIME = ['...ooo...', '.ooaaaoo.', 'oaAaaaaao', 'oaaeaeaao', 'oaaaaaaao', '.ooooooo.'];
const SLIME_SQUASH = ['.........', '..ooooo..', '.oaAaaaao.', 'oaaeaeaaao', 'ooooooooooo'];
const SLIME_PAL: Record<string, string> = { o: '#1c4f43', a: '#5ee6b0', A: '#d2ffee', e: '#0b1f1a' };

/* ------------------------------------------------------------------------ */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER4[(y & 3) * 4 + (x & 3)];

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  pal: Record<string, string>,
  x: number,
  y: number,
  overrides?: Record<string, string>,
) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === '.') continue;
      ctx.fillStyle = (overrides && overrides[ch]) || pal[ch];
      ctx.fillRect(x + c, y + r, 1, 1);
    }
  }
}

/** Ridge line via layered value noise. Returns heights (px above baseline) per x. */
function ridge(width: number, rand: () => number, amp: number, roughness: number, octaves = 4): number[] {
  const out = new Array(width).fill(0);
  let a = amp;
  let freq = 1 / 60;
  for (let o = 0; o < octaves; o++) {
    const pts = Math.ceil(width * freq) + 2;
    const knots = Array.from({ length: pts }, () => rand());
    for (let x = 0; x < width; x++) {
      const t = x * freq;
      const i = Math.floor(t);
      const f = t - i;
      const s = f * f * (3 - 2 * f);
      out[x] += (knots[i] * (1 - s) + knots[i + 1] * s) * a;
    }
    a *= roughness;
    freq *= 2.1;
  }
  return out.map((v) => Math.round(v));
}

/* ------------------------------------------------------------------------ */

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface SceneOptions {
  seed?: number;
  /** Where the camp sits horizontally (0–1). */
  campX?: number;
  /** Where the camp sits on narrow screens. */
  campXNarrow?: number;
  interactive?: boolean;
  onSlime?: () => void;
}

export class PixelScene {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: Required<Omit<SceneOptions, 'onSlime'>> & Pick<SceneOptions, 'onSlime'>;
  private W = 320;
  private H = 180;
  private M = 6; // parallax margin
  private layers: { canvas: HTMLCanvasElement; depth: number }[] = [];
  private groundY = 150;
  private campX = 200;
  private stars: { x: number; y: number; c: string; tw: number; ph: number }[] = [];
  private flies: { x: number; y: number; ax: number; ay: number; sp: number; ph: number }[] = [];
  private sparks: Spark[] = [];
  private meteors: Meteor[] = [];
  private nextMeteor = 4;
  private shower = 0;
  private t = 0;
  private last = 0;
  private acc = 0;
  private raf = 0;
  private running = false;
  private visible = true;
  private reduced: boolean;
  private px = 0; // pointer parallax, eased
  private pxTarget = 0;
  private slimeHop = -1;
  private slimeHeart = -1;
  private blinkAt = 2;
  private ro?: ResizeObserver;
  private io?: IntersectionObserver;

  constructor(canvas: HTMLCanvasElement, options: SceneOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D canvas unsupported');
    this.ctx = ctx;
    this.opts = {
      seed: 7,
      campX: 0.68,
      campXNarrow: 0.5,
      interactive: true,
      ...options,
    };
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);

    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        this.visible ? this.start() : this.stop();
      },
      { rootMargin: '100px' },
    );
    this.io.observe(canvas);

    document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.visible && this.start()));

    if (this.opts.interactive && !this.reduced && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener(
        'pointermove',
        (e) => {
          this.pxTarget = (e.clientX / window.innerWidth) * 2 - 1;
        },
        { passive: true },
      );
    }

    if (this.opts.interactive) {
      canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    this.render(0);
    this.start();
  }

  /** Celebrate: a short meteor shower (used by the Konami code easter egg). */
  meteorShower(seconds = 6) {
    this.shower = seconds;
    if (this.reduced) {
      // one still frame with a few meteors drawn
      for (let i = 0; i < 6; i++) this.spawnMeteor();
      this.render(0);
    }
  }

  destroy() {
    this.stop();
    this.ro?.disconnect();
    this.io?.disconnect();
  }

  /* ---------------------------------------------------------------- setup */

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const cw = Math.max(1, rect.width);
    const ch = Math.max(1, rect.height);
    const s = Math.max(2, Math.min(6, Math.round(Math.sqrt((cw * ch) / (320 * 180)))));
    const W = Math.max(120, Math.round(cw / s));
    const H = Math.max(100, Math.round(ch / s));
    if (W === this.W && H === this.H && this.layers.length) return;
    this.W = W;
    this.H = H;
    this.canvas.width = W;
    this.canvas.height = H;
    this.groundY = H - Math.max(22, Math.round(Math.min(H, 220) * 0.16));
    const narrow = W < 200;
    this.campX = Math.round(W * (narrow ? this.opts.campXNarrow : this.opts.campX));
    this.build();
    this.render(this.t);
  }

  private build() {
    const { W, H, M, groundY } = this;
    const rand = rng(this.opts.seed);
    const LW = W + M * 2;
    const mk = () => {
      const c = document.createElement('canvas');
      c.width = LW;
      c.height = H;
      return c;
    };

    /* Sky: dithered vertical bands */
    const sky = mk();
    {
      const g = sky.getContext('2d')!;
      const img = g.createImageData(LW, H);
      const bands = PAL.sky.map(hexToRgb);
      const horizon = groundY - 6;
      for (let y = 0; y < H; y++) {
        const t = Math.min(1, Math.max(0, y / horizon));
        const eased = Math.pow(t, 1.6) * (bands.length - 1);
        for (let x = 0; x < LW; x++) {
          const idx = Math.min(bands.length - 1, Math.floor(eased + bayer(x, y) - 0.5 + 0.5));
          const [r, gg, b] = bands[Math.max(0, idx)];
          const o = (y * LW + x) * 4;
          img.data[o] = r;
          img.data[o + 1] = gg;
          img.data[o + 2] = b;
          img.data[o + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);

      // static stars
      const count = Math.round((W * groundY) / 180);
      this.stars = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(rand() * LW);
        const y = Math.floor(Math.pow(rand(), 1.4) * groundY * 0.62);
        const r = rand();
        const c = r < 0.7 ? PAL.starA : r < 0.88 ? PAL.starB : PAL.starC;
        if (rand() < 0.22) {
          this.stars.push({ x, y, c, tw: 1.5 + rand() * 3, ph: rand() * 10 });
        } else {
          g.globalAlpha = 0.35 + rand() * 0.65;
          g.fillStyle = c;
          g.fillRect(x, y, 1, 1);
        }
      }
      g.globalAlpha = 1;

      // moon (crescent)
      const mx = Math.round(LW * (W < 200 ? 0.8 : 0.58));
      const my = Math.round(groundY * (W < 200 ? 0.12 : 0.16));
      const R = 7;
      for (let y = -R - 3; y <= R + 3; y++) {
        for (let x = -R - 3; x <= R + 3; x++) {
          const d = Math.hypot(x, y);
          if (d <= R) {
            const cut = Math.hypot(x + 3, y - 2) < R - 0.5;
            if (!cut) {
              g.fillStyle = d > R - 1.2 ? PAL.moonShade : PAL.moon;
              g.fillRect(mx + x, my + y, 1, 1);
            }
          } else if (d <= R + 3 && bayer(mx + x, my + y) < 0.22 * (1 - (d - R) / 3)) {
            g.fillStyle = '#5a5288';
            g.fillRect(mx + x, my + y, 1, 1);
          }
        }
      }
    }

    /* Far ridge */
    const far = mk();
    {
      const g = far.getContext('2d')!;
      const base = groundY - 18;
      const h = ridge(LW, rand, Math.min(46, H * 0.3), 0.42, 3);
      for (let x = 0; x < LW; x++) {
        const top = base - h[x];
        g.fillStyle = PAL.far;
        g.fillRect(x, top, 1, H - top);
        // moonlit rim on slopes facing the moon (right)
        if (x > 0 && h[x] > h[x - 1]) {
          g.fillStyle = PAL.farRim;
          g.fillRect(x, top, 1, 1);
        }
        // snow caps on the highest peaks
        if (h[x] > Math.min(46, H * 0.3) * 0.82) {
          g.fillStyle = '#6a63a6';
          g.fillRect(x, top, 1, 2);
        }
      }
    }

    /* Mid ridge */
    const mid = mk();
    {
      const g = mid.getContext('2d')!;
      const base = groundY - 6;
      const h = ridge(LW, rand, Math.min(26, H * 0.17), 0.45, 3);
      for (let x = 0; x < LW; x++) {
        const top = base - h[x];
        g.fillStyle = PAL.mid;
        g.fillRect(x, top, 1, H - top);
        if (x > 0 && h[x] > h[x - 1]) {
          g.fillStyle = PAL.midRim;
          g.fillRect(x, top, 1, 1);
        }
      }
    }

    /* Forest line (pines), leaving a clearing around the camp */
    const forest = mk();
    {
      const g = forest.getContext('2d')!;
      const base = groundY + 1;
      g.fillStyle = PAL.forest;
      g.fillRect(0, base - 3, LW, H);
      let x = -4;
      while (x < LW + 4) {
        const cx = x;
        const dCamp = Math.abs(cx - (this.campX + M));
        const clearing = dCamp < 34 ? 0.25 : 1;
        const hgt = Math.round((8 + rand() * 18) * (dCamp < 34 ? 0.5 : 1));
        if (rand() < clearing) this.pine(g, cx, base, hgt);
        x += 3 + Math.floor(rand() * 6);
      }
    }

    /* Ground + camp */
    const ground = mk();
    {
      const g = ground.getContext('2d')!;
      const cx = this.campX + M;
      g.fillStyle = PAL.ground;
      g.fillRect(0, groundY, LW, H - groundY);
      g.fillStyle = PAL.groundTop;
      g.fillRect(0, groundY, LW, 1);
      // grass tufts
      for (let x = 0; x < LW; x++) {
        if (rand() < 0.18) {
          g.fillStyle = PAL.grass;
          g.fillRect(x, groundY - 1, 1, 1);
          if (rand() < 0.4) g.fillRect(x, groundY - 2, 1, 1);
        }
        if (rand() < 0.05) {
          g.fillStyle = '#1a1631';
          g.fillRect(x, groundY + 3 + Math.floor(rand() * (H - groundY - 4)), 2, 1);
        }
      }
      // path towards the camp
      for (let y = groundY + 2; y < H; y++) {
        const w = 6 + (y - groundY) * 0.9;
        const pcx = cx - 6 + (y - groundY) * 0.4;
        for (let x = Math.round(pcx - w / 2); x < pcx + w / 2; x++) {
          if (bayer(x, y) < 0.5) {
            g.fillStyle = '#1c1830';
            g.fillRect(x, y, 1, 1);
          }
        }
      }

      // tent (right of fire)
      const tx = cx + 12;
      const th = 22;
      const tw = 32;
      for (let r = 0; r < th; r++) {
        const half = Math.round(((r + 1) / th) * (tw / 2));
        const y = groundY - th + r;
        const mid0 = tx + tw / 2;
        for (let x = mid0 - half; x < mid0 + half; x++) {
          const left = x < mid0;
          const edge = x === mid0 - half || x === mid0 + half - 1;
          g.fillStyle = left ? (edge ? PAL.tentLd : PAL.tentL) : edge ? PAL.tentRd : PAL.tentR;
          g.fillRect(x, y, 1, 1);
        }
        // door
        if (r > th - 11) {
          const dh = Math.round(((r - (th - 11)) / 11) * 5);
          g.fillStyle = PAL.tentDoor;
          g.fillRect(mid0 - dh, y, dh * 2, 1);
        }
      }
      g.fillStyle = PAL.tentPole;
      g.fillRect(tx + tw / 2 - 1, groundY - th - 2, 1, 3);
      // guy line + peg
      for (let i = 0; i < 8; i++) g.fillRect(tx + tw + i, groundY - 8 + i, 1, 1);

      // signpost (left side), if there is room
      if (this.W >= 200) {
        const sx = cx - 58;
        g.fillStyle = PAL.post;
        g.fillRect(sx + 6, groundY - 14, 2, 14);
        g.fillStyle = PAL.boardDark;
        g.fillRect(sx, groundY - 15, 15, 6);
        g.fillStyle = PAL.board;
        g.fillRect(sx + 1, groundY - 14, 13, 4);
        g.fillStyle = PAL.boardInk;
        // arrow pointing right (→ the journey continues)
        g.fillRect(sx + 3, groundY - 12, 7, 1);
        g.fillRect(sx + 9, groundY - 13, 1, 3);
        g.fillRect(sx + 10, groundY - 12, 1, 1);
      }

      // log seat for the avatar
      const lx = cx - 30;
      g.fillStyle = PAL.logB;
      g.fillRect(lx, groundY - 4, 20, 4);
      g.fillStyle = PAL.logA;
      g.fillRect(lx + 1, groundY - 4, 18, 3);
      g.fillStyle = PAL.logTop;
      g.fillRect(lx + 1, groundY - 4, 18, 1);
      g.fillStyle = '#2a1610';
      g.fillRect(lx + 19, groundY - 3, 1, 2);

      // fire pit stones
      const stones = [-5, -3, 3, 5];
      for (const s of stones) {
        g.fillStyle = '#3a3554';
        g.fillRect(cx + s - 1, groundY - 1, 2, 1);
      }
      g.fillStyle = '#4c4670';
      g.fillRect(cx - 6, groundY - 2, 2, 1);
      g.fillRect(cx + 5, groundY - 2, 2, 1);
      // crossed logs
      g.fillStyle = PAL.logA;
      for (let i = 0; i < 7; i++) {
        g.fillRect(cx - 4 + i, groundY - 2 - Math.floor(i / 3), 1, 1);
        g.fillRect(cx + 3 - i, groundY - 2 - Math.floor(i / 3), 1, 1);
      }
    }

    this.layers = [
      { canvas: sky, depth: 0.5 },
      { canvas: far, depth: 1.5 },
      { canvas: mid, depth: 2.5 },
      { canvas: forest, depth: 3.5 },
      { canvas: ground, depth: 4.5 },
    ];

    // fireflies
    const nFlies = Math.max(8, Math.round(W / 22));
    this.flies = Array.from({ length: nFlies }, () => ({
      x: rand() * W,
      y: groundY - 4 - rand() * 34,
      ax: 4 + rand() * 10,
      ay: 2 + rand() * 6,
      sp: 0.2 + rand() * 0.5,
      ph: rand() * 10,
    }));
  }

  private pine(g: CanvasRenderingContext2D, x: number, base: number, h: number) {
    const tiers = Math.max(2, Math.round(h / 6));
    g.fillStyle = PAL.forest;
    g.fillRect(x, base - 2, 1, 3);
    for (let t = 0; t < tiers; t++) {
      const tierTop = base - h + Math.round((t * h) / (tiers + 0.5));
      const tierH = Math.round(h / tiers) + 2;
      for (let r = 0; r < tierH; r++) {
        const half = Math.round(((r + 1) / tierH) * (2 + t * 1.3));
        g.fillStyle = PAL.forest;
        g.fillRect(x - half, tierTop + r, half * 2 + 1, 1);
        if (r === 0 || half > 0) {
          g.fillStyle = PAL.forestRim;
          g.fillRect(x + half, tierTop + r, 1, 1);
        }
      }
    }
  }

  /* -------------------------------------------------------------- loop */

  private start() {
    if (this.running || this.reduced) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.acc += dt;
      // ease pointer parallax every rAF for smoothness
      this.px += (this.pxTarget - this.px) * Math.min(1, dt * 3);
      const step = 1 / 12;
      if (this.acc >= step) {
        this.update(this.acc);
        this.acc = 0;
        this.render(this.t);
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private update(dt: number) {
    this.t += dt;
    const fireX = this.campX;
    // sparks
    if (Math.random() < 0.6) {
      this.sparks.push({
        x: fireX + (Math.random() * 4 - 2),
        y: this.groundY - 8,
        vx: (Math.random() - 0.5) * 6,
        vy: -(10 + Math.random() * 14),
        life: 0.8 + Math.random() * 0.9,
      });
    }
    for (const s of this.sparks) {
      s.x += s.vx * dt + Math.sin(this.t * 4 + s.y) * 0.15;
      s.y += s.vy * dt;
      s.life -= dt;
    }
    this.sparks = this.sparks.filter((s) => s.life > 0);

    // meteors
    this.nextMeteor -= dt;
    if (this.shower > 0) {
      this.shower -= dt;
      if (Math.random() < 0.5) this.spawnMeteor();
    } else if (this.nextMeteor <= 0) {
      this.spawnMeteor();
      this.nextMeteor = 6 + Math.random() * 9;
    }
    for (const m of this.meteors) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.life -= dt;
    }
    this.meteors = this.meteors.filter((m) => m.life > 0);

    if (this.slimeHop >= 0) {
      this.slimeHop += dt;
      if (this.slimeHop > 0.6) this.slimeHop = -1;
    }
    if (this.slimeHeart >= 0) {
      this.slimeHeart += dt;
      if (this.slimeHeart > 1.4) this.slimeHeart = -1;
    }
    if (this.t > this.blinkAt + 0.25) this.blinkAt = this.t + 2 + Math.random() * 3;
  }

  private spawnMeteor() {
    const sp = 90 + Math.random() * 60;
    this.meteors.push({
      x: Math.random() * this.W * 0.9,
      y: Math.random() * this.groundY * 0.35,
      vx: sp,
      vy: sp * 0.45,
      life: 0.5 + Math.random() * 0.4,
    });
  }

  /* ------------------------------------------------------------ render */

  private render(t: number) {
    const { ctx, W, H, M, groundY } = this;
    const cx = this.campX;
    const off = (depth: number) => -M + Math.round(this.px * depth);

    ctx.imageSmoothingEnabled = false;
    // sky + far layers
    for (let i = 0; i < 4; i++) ctx.drawImage(this.layers[i].canvas, off(this.layers[i].depth), 0);

    // twinkling stars (on the sky layer's offset)
    const so = off(this.layers[0].depth);
    for (const s of this.stars) {
      const a = 0.5 + 0.5 * Math.sin(t * s.tw + s.ph);
      ctx.globalAlpha = 0.25 + a * 0.75;
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x + so, s.y, 1, 1);
      if (a > 0.92) {
        ctx.globalAlpha = 0.35;
        ctx.fillRect(s.x + so - 1, s.y, 3, 1);
        ctx.fillRect(s.x + so, s.y - 1, 1, 3);
      }
    }
    ctx.globalAlpha = 1;

    // meteors (sky space)
    for (const m of this.meteors) {
      const len = 6;
      for (let i = 0; i < len; i++) {
        ctx.globalAlpha = (1 - i / len) * Math.min(1, m.life * 3);
        ctx.fillStyle = i === 0 ? '#ffffff' : '#bfb6ff';
        ctx.fillRect(Math.round(m.x - i * 2), Math.round(m.y - i * 0.9), 1, 1);
      }
    }
    ctx.globalAlpha = 1;

    // ground layer
    const go = off(this.layers[4].depth);
    ctx.drawImage(this.layers[4].canvas, go, 0);
    const gx = go + M; // ground-space x offset

    // firelight glow (warm, flickering), drawn additively
    const flick = Math.sin(t * 9) * 1.5 + Math.sin(t * 23) * 1;
    const R = 46 + flick;
    const grad = ctx.createRadialGradient(cx + gx, groundY - 6, 2, cx + gx, groundY - 6, R);
    grad.addColorStop(0, 'rgba(255,160,70,0.42)');
    grad.addColorStop(0.45, 'rgba(255,120,60,0.16)');
    grad.addColorStop(1, 'rgba(255,100,60,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad;
    ctx.fillRect(cx + gx - R, groundY - 6 - R, R * 2, R * 2);
    ctx.globalCompositeOperation = 'source-over';

    // avatar on the log
    const hx = cx + gx - 28;
    const hy = groundY - 22;
    const blink = t >= this.blinkAt && t < this.blinkAt + 0.18;
    const typing = Math.floor(t * 6) % 2 === 0;
    const rows = HERO.slice();
    if (blink) rows[4] = '....ssssssss....';
    if (!this.reduced && typing) {
      rows[13] = '..swLllggllLws..'.replace('..sw', '...s').replace('ws..', 's...');
    }
    drawSprite(ctx, rows, HERO_PAL, hx, hy);
    // laptop glow on the face/chin
    ctx.globalAlpha = 0.35 + 0.1 * Math.sin(t * 3);
    ctx.fillStyle = '#9ff3d9';
    ctx.fillRect(hx + 6, hy + 7, 4, 1);
    ctx.globalAlpha = 1;
    // firelight rim on the avatar's right side
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#ffb06a';
    ctx.fillRect(hx + 13, hy + 10, 1, 3);
    ctx.fillRect(hx + 11, hy + 5, 1, 2);
    ctx.globalAlpha = 1;

    // slime companion
    const sx = cx + gx - 44;
    let sy = groundY - 6;
    let sprite = SLIME;
    if (this.slimeHop >= 0) {
      const k = this.slimeHop / 0.6;
      sy -= Math.round(Math.sin(k * Math.PI) * 9);
    } else if (!this.reduced && Math.floor(t * 1.5) % 3 === 0) {
      sprite = SLIME_SQUASH;
      sy += 1;
    }
    drawSprite(ctx, sprite, SLIME_PAL, sx - (sprite === SLIME_SQUASH ? 1 : 0), sy);
    if (this.slimeHeart >= 0) {
      const hy2 = sy - 6 - Math.round(this.slimeHeart * 6);
      ctx.globalAlpha = Math.max(0, 1 - this.slimeHeart / 1.4);
      ctx.fillStyle = '#ff8aa3';
      ctx.fillRect(sx + 3, hy2, 1, 1);
      ctx.fillRect(sx + 5, hy2, 1, 1);
      ctx.fillRect(sx + 2, hy2 + 1, 5, 1);
      ctx.fillRect(sx + 3, hy2 + 2, 3, 1);
      ctx.fillRect(sx + 4, hy2 + 3, 1, 1);
      ctx.globalAlpha = 1;
    }

    // flames
    const fx = cx + gx;
    const fy = groundY - 3;
    for (let dx = -3; dx <= 3; dx++) {
      const base = 8 - Math.abs(dx) * 2;
      const n = Math.sin(t * 13 + dx * 1.7) * 1.4 + Math.sin(t * 7.3 + dx * 3.1) * 1.1;
      const h = Math.max(1, Math.round(base + n));
      for (let y = 0; y < h; y++) {
        const k = y / h;
        const ci = Math.min(FLAME.length - 1, Math.floor((1 - k) * 0.6 * FLAME.length + Math.abs(dx) * 0.7));
        ctx.fillStyle = FLAME[Math.max(0, FLAME.length - 1 - ci)];
        ctx.fillRect(fx + dx, fy - y, 1, 1);
      }
    }
    // hot core
    ctx.fillStyle = FLAME[0];
    ctx.fillRect(fx, fy - 1, 1, 2);

    // sparks
    for (const s of this.sparks) {
      ctx.globalAlpha = Math.min(1, s.life * 1.5);
      ctx.fillStyle = s.life > 0.6 ? PAL.spark : '#ff8a3a';
      ctx.fillRect(Math.round(s.x + gx), Math.round(s.y), 1, 1);
    }
    ctx.globalAlpha = 1;

    // fireflies
    for (const f of this.flies) {
      const x = Math.round(f.x + Math.sin(t * f.sp + f.ph) * f.ax + gx - M);
      const y = Math.round(f.y + Math.cos(t * f.sp * 1.3 + f.ph) * f.ay);
      const on = 0.5 + 0.5 * Math.sin(t * 2 + f.ph * 3);
      if (on < 0.25) continue;
      ctx.globalAlpha = on;
      ctx.fillStyle = f.ph > 5 ? PAL.firefly : PAL.firefly2;
      ctx.fillRect(x, y, 1, 1);
      if (on > 0.85) {
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x - 1, y, 3, 1);
        ctx.fillRect(x, y - 1, 1, 3);
      }
    }
    ctx.globalAlpha = 1;

    // subtle vignette at the bottom so overlaid text stays readable
    const vg = ctx.createLinearGradient(0, H * 0.55, 0, H);
    vg.addColorStop(0, 'rgba(6,7,14,0)');
    vg.addColorStop(1, 'rgba(6,7,14,0.45)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  private handleClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const lx = ((e.clientX - rect.left) / rect.width) * this.W;
    const ly = ((e.clientY - rect.top) / rect.height) * this.H;
    const gx = Math.round(this.px * this.layers[4].depth);
    const sx = this.campX + gx - 44;
    const sy = this.groundY - 6;
    if (lx >= sx - 3 && lx <= sx + 12 && ly >= sy - 10 && ly <= sy + 8) {
      this.slimeHop = 0;
      this.slimeHeart = 0;
      if (this.reduced) this.render(this.t);
      this.opts.onSlime?.();
    }
  }
}
