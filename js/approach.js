/* "Our Approach": a bell-curve histogram in the centre, with thin lines
 * running from the curve to the rule above each text block. */
(function () {
  const host = document.querySelector("[data-bell]");
  const links = document.querySelector(".approach-links");
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
      fill: "#c9a24d", opacity: (0.35 + 0.65 * density(xToSd(x + step / 2))).toFixed(2),
    }));
  }
  let d = "";
  for (let px = 10; px <= W - 10; px += 4) d += (d ? "L" : "M") + px + " " + yAt(px).toFixed(1);
  svg.appendChild(el("path", { d, fill: "none", stroke: "#f6f2e9", "stroke-width": 1.5 }));
  svg.appendChild(el("line", { x1: 0, x2: W, y1: BASE, y2: BASE, stroke: "rgba(182,191,204,.4)" }));
  host.appendChild(svg);

  // Where each line leaves the curve (svg x), and which end of the article rule it reaches.
  const anchors = [
    { sel: ".ap-why", x: 205, side: "right" },
    { sel: ".ap-what", x: 120, side: "right" },
    { sel: ".ap-how", x: 410, side: "left" },
  ];

  function drawLinks() {
    if (!links) return;
    links.replaceChildren();
    if (getComputedStyle(links).display === "none") return;
    const box = links.getBoundingClientRect();
    const b = svg.getBoundingClientRect();
    const sx = b.width / W, sy = b.height / H;
    anchors.forEach(({ sel, x, side }) => {
      const a = document.querySelector(sel);
      if (!a) return;
      const r = a.getBoundingClientRect();
      const x1 = b.left - box.left + x * sx, y1 = b.top - box.top + yAt(x) * sy;
      const x2 = (side === "right" ? r.right : r.left) - box.left, y2 = r.top - box.top;
      links.appendChild(el("line", { x1, y1, x2, y2, stroke: "rgba(182,191,204,.45)", "stroke-width": 1 }));
      links.appendChild(el("circle", { cx: x1, cy: y1, r: 3, fill: "#c9a24d" }));
    });
  }
  drawLinks();
  window.addEventListener("resize", drawLinks);
  if (document.fonts) document.fonts.ready.then(drawLinks);
})();
