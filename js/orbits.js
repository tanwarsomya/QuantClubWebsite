/* Teams section: planets travelling along the orbit rings (the rings themselves
 * spin slowly via CSS). Inner planets move faster. Static for reduced motion. */
(function () {
  const group = document.querySelector("[data-orbits]");
  if (!group) return;
  const NS = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STYLE = [
    { r: 5, fill: "#c9a24d" },
    { r: 3.5, fill: "#f6f2e9" },
    { r: 6, fill: "#c9a24d" },
    { r: 4, fill: "#b6bfcc" },
    { r: 4.5, fill: "#c9a24d" },
  ];

  const planets = [...group.querySelectorAll("ellipse")].map((ring, i) => {
    const rx = +ring.getAttribute("rx"), ry = +ring.getAttribute("ry");
    const cx = +ring.getAttribute("cx"), cy = +ring.getAttribute("cy");
    const dot = document.createElementNS(NS, "circle");
    const st = STYLE[i % STYLE.length];
    dot.setAttribute("r", st.r);
    dot.setAttribute("fill", st.fill);
    dot.setAttribute("class", "planet");
    group.appendChild(dot);
    // Angular speed falls off with orbit size (roughly Kepler-like).
    return { dot, rx, ry, cx, cy, phase: i * 2.1, speed: 0.00035 * Math.pow(180 / rx, 1.5) };
  });

  function place(time) {
    for (const p of planets) {
      const a = p.phase + time * p.speed;
      p.dot.setAttribute("cx", (p.cx + p.rx * Math.cos(a)).toFixed(1));
      p.dot.setAttribute("cy", (p.cy + p.ry * Math.sin(a)).toFixed(1));
    }
  }
  place(0);
  if (reduced) return;

  let visible = false, raf = 0;
  const loop = (t) => { place(t); raf = visible ? requestAnimationFrame(loop) : 0; };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(group.closest("section") || group);
})();
