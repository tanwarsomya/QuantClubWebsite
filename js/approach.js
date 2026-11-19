/* "Our Approach": a bell-curve histogram in the centre. Bars near the pointer
 * grow taller and warm from gold to orange (eased in-out). Static for
 * visitors with prefers-reduced-motion. */
(function () {
  const host = document.querySelector("[data-bell]");
  if (!host) return;
  const NS = "http://www.w3.org/2000/svg";
  const W = 600, H = 460, BASE = 450, N = 31;
  const GROW = 0.3;     // max extra height, as a share of the bar
  const REACH = 70;     // falloff radius in svg units
  const GOLD = [201, 162, 77], ORANGE = [230, 120, 40];
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const density = (x) => Math.exp(-0.5 * x * x); // x in standard deviations
  const xToSd = (px) => ((px - W / 2) / (W / 2)) * 3.2;
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  const step = (W - 60) / N;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const x = 30 + i * step;
    const h = density(xToSd(x + step / 2)) * 300;
    const rect = el("rect", { x: x + 1.5, width: step - 3 });
    svg.appendChild(rect);
    bars.push({ rect, cx: x + step / 2, h, t: 0, target: 0 });
  }
  svg.appendChild(el("line", { x1: 0, x2: W, y1: BASE, y2: BASE, stroke: "rgba(182,191,204,.4)" }));
  host.appendChild(svg);

  function render() {
    for (const b of bars) {
      const e = easeInOut(b.t);
      const h = b.h * (1 + GROW * e);
      b.rect.setAttribute("y", (BASE - h).toFixed(1));
      b.rect.setAttribute("height", h.toFixed(1));
      const c = GOLD.map((g, i) => Math.round(g + (ORANGE[i] - g) * e));
      b.rect.setAttribute("fill", `rgb(${c})`);
    }
  }
  render();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let raf = 0;
  function tick() {
    let moving = false;
    for (const b of bars) {
      b.t += (b.target - b.t) * 0.15;
      if (Math.abs(b.target - b.t) > 0.002) moving = true; else b.t = b.target;
    }
    render();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function setTargets(px) {
    for (const b of bars) {
      const d = px == null ? Infinity : Math.abs(px - b.cx);
      b.target = Math.max(0, 1 - d / REACH);
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  const area = host.closest("section") || host;
  area.addEventListener("pointermove", (ev) => {
    const r = svg.getBoundingClientRect();
    const px = ((ev.clientX - r.left) / r.width) * W;
    const near = ev.clientY > r.top - 80 && ev.clientY < r.bottom + 80;
    setTargets(near ? px : null);
  });
  area.addEventListener("pointerleave", () => setTargets(null));
})();
