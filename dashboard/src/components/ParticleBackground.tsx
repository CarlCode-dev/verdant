"use client";

import { useEffect, useRef } from "react";

type Cell = {
  wx: number;
  wz: number;
  energy: number;
  lift: number;
  downUntil: number;
  sx: number;
  sy: number;
  sc: number;
  visible: boolean;
};

type Ripple = { x: number; z: number; t0: number };

const D = 300;
const MIN_SCALE = 0.16;
const FULL_SCALE = 0.4;
const GAP = 0.9;
const RIPPLE_MS = 70;
const RIPPLE_RANGE = 8;
const LIFT_MAX = 34;
const HOVER_R = 130;

const PALETTES = {
  dark: { line: "78,166,116", glow: "192,230,185", fail: "226,75,74", lineA: 0.16 },
  light: { line: "36,122,74", glow: "16,92,56", fail: "205,58,58", lineA: 0.2 },
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

const depthFade = (sc: number) =>
  clamp((sc - MIN_SCALE) / (FULL_SCALE - MIN_SCALE), 0, 1);

export default function PodGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let size = 40;
    let hexW = 70;
    let rows = 0;
    let horizon = 0;
    let camH = 0;
    let cells: Cell[] = [];
    let grid: Cell[][] = [];
    const ripples: Ripple[] = [];
    let raf = 0;
    let last = performance.now();
    let nextFail = last + 1200;
    let px = -9999;
    let py = -9999;
    let camX = 0;
    let camY = 0;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      size = clamp(w / 26, 30, 56);
      hexW = Math.sqrt(3) * size;
      const rowH = size * 1.5;
      const zMax = D * (1 / MIN_SCALE - 1);
      rows = Math.ceil(zMax / rowH) + 1;
      const cols = Math.ceil((w * 1.9) / hexW) + 2;
      horizon = h * 0.3;
      camH = (h - horizon) * 1.04;

      cells = [];
      grid = [];
      for (let r = 0; r < rows; r++) {
        const line: Cell[] = [];
        for (let c = 0; c < cols; c++) {
          const cell: Cell = {
            wx: (c - cols / 2) * hexW + ((r % 2) * hexW) / 2,
            wz: (r - 1) * rowH,
            energy: 0,
            lift: 0,
            downUntil: 0,
            sx: 0,
            sy: 0,
            sc: 1,
            visible: false,
          };
          line.push(cell);
          cells.push(cell);
        }
        grid.push(line);
      }
      ripples.length = 0;
    };

    const hexPath = (c: Cell, y: number, hy: number) => {
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        const vx = c.wx + Math.cos(a) * size * GAP;
        const vz = c.wz + Math.sin(a) * size * GAP;
        const sc = D / (vz + D);
        const sx = w / 2 + (vx - camX) * sc;
        const sy = hy + (camH - y) * sc;
        if (k === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
    };

    const kill = (cell: Cell, now: number) => {
      if (cell.downUntil) return;
      cell.downUntil = now + 900 + Math.random() * 500;
      cell.energy = 0;
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const ts = dt / 16.67;
      const hover = !reduced && finePointer && px > -9000;
      const pal =
        document.documentElement.dataset.theme === "light"
          ? PALETTES.light
          : PALETTES.dark;

      camX += ((hover ? (px - w / 2) * 0.25 : 0) - camX) * 0.05 * ts;
      camY += ((hover ? (py - h / 2) * 0.04 : 0) - camY) * 0.05 * ts;
      const hy = horizon + camY;

      // a random pod fails every few seconds
      if (!reduced && now > nextFail) {
        const r = 2 + Math.floor(Math.random() * 8);
        const line = grid[r];
        const c = Math.floor(line.length * (0.2 + Math.random() * 0.6));
        kill(line[c], now);
        nextFail = now + 2200 + Math.random() * 2800;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].t0 > RIPPLE_RANGE * RIPPLE_MS + 400) {
          ripples.splice(i, 1);
        }
      }

      const decay = Math.exp(-dt / 380);

      // update every pod: heal, project, ripple glow, hover lift
      for (const c of cells) {
        if (c.downUntil && now >= c.downUntil) {
          c.downUntil = 0;
          c.energy = 1;
          ripples.push({ x: c.wx, z: c.wz, t0: now });
        }

        const sc = D / (c.wz + D);
        const sx = w / 2 + (c.wx - camX) * sc;
        const sy = hy + camH * sc;
        c.sc = sc;
        c.sx = sx;
        c.sy = sy;
        const edge = hexW * sc * 2;
        c.visible = sx > -edge && sx < w + edge && sy < h + edge;
        if (!c.visible) {
          c.energy = 0;
          c.lift = 0;
          continue;
        }

        c.energy *= decay;
        if (c.energy < 0.01) c.energy = 0;

        for (const rp of ripples) {
          const dist = Math.hypot(c.wx - rp.x, c.wz - rp.z) / hexW;
          if (dist > RIPPLE_RANGE) continue;
          const radius = (now - rp.t0) / RIPPLE_MS;
          if (Math.abs(dist - radius) < 0.8) {
            c.energy = Math.max(c.energy, 0.75 * (1 - dist / RIPPLE_RANGE));
          }
        }

        let target = 0;
        if (hover) {
          const d = Math.hypot(sx - px, sy - py);
          if (d < HOVER_R) target = LIFT_MAX * Math.pow(1 - d / HOVER_R, 1.5);
        }
        c.lift += (target - c.lift) * 0.15 * ts;
        if (target === 0 && c.lift < 0.2) c.lift = 0;
      }

      ctx.clearRect(0, 0, w, h);

      // idle pods: one batched stroke per row (cheap)
      const active: Cell[] = [];
      for (const line of grid) {
        const fade = depthFade(D / (line[0].wz + D));
        if (fade <= 0.01) continue;
        ctx.beginPath();
        let any = false;
        for (const c of line) {
          if (!c.visible) continue;
          if (c.energy > 0 || c.lift > 0 || c.downUntil) {
            active.push(c);
            continue;
          }
          hexPath(c, 0, hy);
          any = true;
        }
        if (any) {
          ctx.strokeStyle = `rgba(${pal.line},${pal.lineA * fade})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // active pods: failing, healing, or lifted by the cursor
      for (const c of active) {
        const fade = depthFade(c.sc);
        ctx.beginPath();
        hexPath(c, c.lift, hy);
        if (c.downUntil) {
          const blink = 0.65 + 0.35 * Math.sin(now / 80);
          ctx.fillStyle = `rgba(${pal.fail},${0.1 * fade * blink})`;
          ctx.strokeStyle = `rgba(${pal.fail},${0.5 * fade * blink})`;
        } else {
          const e = Math.max(c.energy, (c.lift / LIFT_MAX) * 0.5);
          ctx.fillStyle = `rgba(${pal.line},${(0.04 + 0.22 * e) * fade})`;
          ctx.strokeStyle = `rgba(${pal.glow},${(0.18 + 0.45 * e) * fade})`;
        }
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
    };
    const onDown = (e: PointerEvent) => {
      let best: Cell | null = null;
      let bestD = Infinity;
      for (const c of cells) {
        if (!c.visible || c.downUntil) continue;
        const d = Math.hypot(c.sx - e.clientX, c.sy - e.clientY);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (best && bestD < size * best.sc * 1.2) kill(best, performance.now());
    };
    const onResize = () => {
      setup();
      if (reduced) frame(performance.now());
    };

    // redraw once when the theme flips (only needed in reduced-motion mode)
    const themeWatcher = new MutationObserver(() => {
      if (reduced) frame(performance.now());
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    setup();
    window.addEventListener("resize", onResize);
    if (reduced) {
      frame(performance.now());
    } else {
      if (finePointer) window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerdown", onDown);
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeWatcher.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}