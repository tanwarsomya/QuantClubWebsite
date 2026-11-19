/* Placeholder logos drawn as inline SVG until the design team delivers PNGs.
 *   <span data-logo></span>              mark + "SSQF" wordmark
 *   <span data-logo="mark"></span>       mark only
 *   <div data-hero-wave></div>           large hero circle with waves
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const GOLD = "#c9a24d";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // An S-shaped curve across the circle; `spread` fans the bundle out on the left.
  function wavePath(cx, cy, r, i, n, spread, phase) {
    const t = n > 1 ? i / (n - 1) - 0.5 : 0;
    const x0 = cx - r, x1 = cx + r;
    const pts = [];
    for (let s = 0; s <= 40; s++) {
      const u = s / 40;
      const x = x0 + (x1 - x0) * u;
      const fan = (1 - u) * spread * t * r;
      const y = cy + Math.sin((u - 0.5) * Math.PI + phase) * r * 0.32 * -1 + fan;
      pts.push((s ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2));
    }
    return pts.join("");
  }

  function mark(size) {
    const svg = el("svg", { viewBox: "0 0 100 100", class: "logo-mark", "aria-hidden": "true" });
    const clip = el("clipPath", { id: "lm-clip-" + Math.random().toString(36).slice(2) });
    clip.appendChild(el("circle", { cx: 50, cy: 50, r: 46 }));
    svg.appendChild(clip);
    const g = el("g", { "clip-path": "url(#" + clip.id + ")", fill: "none", stroke: GOLD, "stroke-width": 0.7 });
    for (let i = 0; i < 9; i++) g.appendChild(el("path", { d: wavePath(50, 54, 46, i, 9, 0.5, 0) }));
    svg.appendChild(g);
    svg.appendChild(el("circle", { cx: 50, cy: 50, r: 46, fill: "none", stroke: GOLD, "stroke-width": 2.5 }));
    return svg;
  }

  document.querySelectorAll("[data-logo]").forEach((host) => {
    host.classList.add("logo");
    host.appendChild(mark());
    if (host.dataset.logo !== "mark") {
      const word = document.createElement("span");
      word.className = "logo-word";
      word.innerHTML = "<strong>SSQF</strong><small>Stockholm Student<br>Quantitative Fund</small>";
      host.appendChild(word);
    }
  });

  // Hero: thin circle with a gold wave and faint companions, slowly breathing.
  document.querySelectorAll("[data-hero-wave]").forEach((host) => {
    const svg = el("svg", { viewBox: "0 0 400 400", "aria-hidden": "true" });
    svg.appendChild(el("circle", { cx: 200, cy: 200, r: 165, fill: "none", stroke: "rgba(182,191,204,.35)", "stroke-width": 1 }));
    const lines = [
      { k: -1.6, color: "rgba(182,191,204,.22)", w: 1 },
      { k: -0.8, color: "rgba(182,191,204,.3)", w: 1 },
      { k: 0, color: GOLD, w: 2 },
      { k: 0.8, color: "rgba(182,191,204,.3)", w: 1 },
    ].map((l) => {
      const p = el("path", { fill: "none", stroke: l.color, "stroke-width": l.w });
      svg.appendChild(p);
      return { ...l, p };
    });
    function draw(time) {
      const ph = time * 0.0004;
      lines.forEach((l) => {
        const pts = [];
        for (let s = 0; s <= 60; s++) {
          const u = s / 60;
          const x = 35 + 330 * u;
          const amp = 52 + l.k * 6 + Math.sin(ph + l.k) * 6;
          const y = 205 + l.k * 9 - Math.sin((u - 0.5) * Math.PI * 1.15 + Math.sin(ph) * 0.15) * amp;
          pts.push((s ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1));
        }
        l.p.setAttribute("d", pts.join(""));
      });
    }
    draw(0);
    host.appendChild(svg);
    if (!reduced) {
      const loop = (t) => { draw(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  });
})();
