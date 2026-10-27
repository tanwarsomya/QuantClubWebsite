/* =========================================================
   visuals.js — the four team animations, drawn on <canvas>
   Loaded before main.js, which mounts and plays them.

   Each visual is a function (ctx, width, height, fit) that
   sets up its state and returns a draw() function rendering
   one frame. To add a team, write a new function here and add
   it to the object returned at the bottom, keyed by the same
   name used in the page's data-team attribute.
   ========================================================= */
window.TeamVisuals = (() => {
  // ---------- Colours (RGB triples, matching css/base.css) ----------
  const C = {
    ink: "22,19,15",       // --ink
    ember: "184,77,28",    // --ember   (Research)
    crimson: "184,50,42",  // --crimson (Risk)
    teal: "29,122,97",     // --teal    (Development)
    gold: "217,164,65",    // --gold    (Marketing, highlights)
  };

  // ---------- Helpers ----------
  // Box–Muller standard normal
  const randn = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // Where a visual sits on its canvas: above the text in a home-page column,
  // or centred when the canvas has data-fit="center" (team page hero)
  const area = (w, h, fit) => fit === "center"
    ? { cx: w / 2, cy: h / 2, r: Math.min(w, h) * 0.32 }
    : { cx: w / 2, cy: h * 0.42, r: Math.min(w * 0.4, h * 0.25) };

  // ---------- Team visuals ----------
  // Each takes (ctx, width, height, fit) and returns a draw() that renders one frame.

  // RESEARCH: Monte Carlo price paths fanning out from a common origin
  function research(ctx, w, h, fit) {
    const { cx, cy, r } = area(w, h, fit);
    const steps = 120, n = 34;
    let paths = [];
    const reset = () => {
      paths = Array.from({ length: n }, () => {
        const pts = [0];
        for (let i = 1; i < steps; i++) pts.push(pts[i - 1] + randn() * 0.11);
        return { pts, hue: Math.random() };
      });
    };
    reset();
    let t = steps * 0.6; // start partly drawn so the first frame isn't empty
    return () => {
      ctx.clearRect(0, 0, w, h);
      const x0 = cx - r, x1 = cx + r;
      const shown = Math.min(steps, Math.floor(t));
      ctx.lineWidth = 1;
      for (const p of paths) {
        ctx.beginPath();
        for (let i = 0; i < shown; i++) {
          const x = x0 + (i / (steps - 1)) * (x1 - x0);
          const y = cy - p.pts[i] * r * 0.55;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const a = 0.35 + p.hue * 0.5;
        ctx.strokeStyle = p.hue > 0.5 ? `rgba(${C.ember},${a})` : `rgba(${C.crimson},${a})`;
        ctx.stroke();
      }
      // Origin glow
      ctx.fillStyle = `rgb(${C.ember})`;
      ctx.beginPath(); ctx.arc(x0, cy, 2.5, 0, Math.PI * 2); ctx.fill();
      t += 0.8;
      if (t > steps + 90) { t = 0; reset(); }
    };
  }

  // RISK: a return distribution building up, with the VaR tail highlighted
  function risk(ctx, w, h, fit) {
    const { cx, cy, r } = area(w, h, fit);
    const bins = 48, counts = new Array(bins).fill(0);
    const lo = -3.2, hi = 3.2, varCut = -1.645;
    let total = 0, ripple = 0;
    return () => {
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < 14; k++) {
        const z = randn();
        const b = Math.floor(((z - lo) / (hi - lo)) * bins);
        if (b >= 0 && b < bins) { counts[b]++; total++; }
      }
      if (total > 9000) { counts.fill(0); total = 0; }
      const max = Math.max(...counts, 1);
      const x0 = cx - r * 1.05, bw = (r * 2.1) / bins, base = cy + r * 0.55;
      for (let i = 0; i < bins; i++) {
        const z = lo + ((i + 0.5) / bins) * (hi - lo);
        const bh = (counts[i] / max) * r * 1.2;
        const tail = z < varCut;
        ctx.fillStyle = tail ? `rgba(${C.crimson},0.85)` : `rgba(${C.gold},0.5)`;
        ctx.fillRect(x0 + i * bw + 1, base - bh, bw - 2, bh);
      }
      // VaR line
      const vx = x0 + ((varCut - lo) / (hi - lo)) * r * 2.1;
      ctx.strokeStyle = `rgba(${C.ink},0.6)`;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(vx, base - r * 1.35); ctx.lineTo(vx, base + 6); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${C.ink},0.7)`;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("VaR 95%", vx + 6, base - r * 1.28);
      // Limit ring pulsing outward
      ripple = (ripple + 0.6) % 60;
      ctx.strokeStyle = `rgba(${C.crimson},${0.5 * (1 - ripple / 60)})`;
      ctx.beginPath(); ctx.arc(vx, base, ripple, Math.PI, 0); ctx.stroke();
      ctx.strokeStyle = `rgba(${C.ink},0.18)`;
      ctx.beginPath(); ctx.moveTo(x0, base + 0.5); ctx.lineTo(x0 + r * 2.1, base + 0.5); ctx.stroke();
    };
  }

  // DEVELOPMENT: a grid of glyphs forming a "Q", flickering like a terminal
  function development(ctx, w, h, fit) {
    const { cx, cy, r } = area(w, h, fit);
    const glyphs = "01{}<>=+*/#$%λΣ∂";
    const cell = 11, cols = Math.floor((r * 2.2) / cell), rows = cols;
    const ox = cx - (cols * cell) / 2, oy = cy - (rows * cell) / 2;
    const inQ = (u, v) => {
      const d = Math.hypot(u, v);
      const ring = d > 0.62 && d < 0.95;
      const tail = u > 0.25 && u < 1 && Math.abs(v - u) < 0.14;
      return ring || tail;
    };
    const cells = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const u = (i / (cols - 1)) * 2 - 1, v = (j / (rows - 1)) * 2 - 1;
      cells.push({ i, j, on: inQ(u, v), ch: glyphs[(Math.random() * glyphs.length) | 0], a: Math.random() });
    }
    let scan = 0;
    return () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${cell - 2}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      scan = (scan + 0.35) % (rows + 12);
      for (const c of cells) {
        if (Math.random() < 0.02) c.ch = glyphs[(Math.random() * glyphs.length) | 0];
        const near = Math.max(0, 1 - Math.abs(c.j - scan) / 4);
        const alpha = c.on ? 0.55 + 0.45 * near : 0.06 + 0.25 * near * c.a;
        ctx.fillStyle = c.on ? `rgba(${C.teal},${alpha})` : `rgba(${C.ink},${alpha})`;
        ctx.fillText(c.ch, ox + c.i * cell + cell / 2, oy + c.j * cell + cell / 2);
      }
    };
  }

  // MARKETING: signal broadcast — rays and expanding waves from a point
  function marketing(ctx, w, h, fit) {
    const { cx, cy, r } = area(w, h, fit);
    const rays = 28;
    let t = 0;
    return () => {
      ctx.clearRect(0, 0, w, h);
      const L = Math.hypot(w, h);
      for (let i = 0; i < rays; i++) {
        const ang = (i / rays) * Math.PI * 2 + t * 0.002;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.03 + i * 1.7);
        ctx.strokeStyle = `rgba(${C.gold},${0.2 + 0.5 * pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * L, cy + Math.sin(ang) * L);
        ctx.stroke();
      }
      for (let k = 0; k < 4; k++) {
        const rr = ((t * 0.6 + k * r * 0.5) % (r * 2));
        ctx.strokeStyle = `rgba(${C.ember},${0.55 * (1 - rr / (r * 2))})`;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      g.addColorStop(0, `rgba(${C.gold},1)`);
      g.addColorStop(1, `rgba(${C.gold},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
      t++;
    };
  }

  // Keys must match the data-team attributes in the HTML
  return { research, risk, development, marketing };
})();
