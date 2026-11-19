/* "Our Approach": a bell-curve histogram in the centre, with thin lines
 * running from the curve to the rule above each text block. */
(function () {
  const host = document.querySelector("[data-bell]");
  if (!host) return;
  const NS = "http://www.w3.org/2000/svg";
  const W = 600, H = 400, BASE = 360, N = 31;
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const density = (x) => Math.exp(-0.5 * x * x); // x in standard deviations
  const xToSd = (px) => ((px - W / 2) / (W / 2)) * 3.2;
  const yAt = (px) => BASE - density(xToSd(px)) * 300;

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  const step = (W - 60) / N;
  for (let i = 0; i < N; i++) {
    const x = 30 + i * step;
    const h = BASE - yAt(x + step / 2);
    svg.appendChild(el("rect", {
      x: x + 1.5, y: BASE - h, width: step - 3, height: h,
      fill: "#c9a24d"
    }));
  }
  svg.appendChild(el("line", { x1: 0, x2: W, y1: BASE, y2: BASE, stroke: "rgba(182,191,204,.4)" }));
  host.appendChild(svg);
})();
