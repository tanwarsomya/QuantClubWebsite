/* =========================================================
   main.js — page behaviour, loaded by every page after visuals.js
   - Darkens the nav once the page is scrolled
   - Fills in the footer year
   - Mounts a visual on every [data-team] element and plays it
     only while hovered, focused or tapped
   ========================================================= */
(() => {
  // ---------- Setup ----------
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Nav: darken on scroll ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mount a visual on each [data-team] element ----------
  const makers = window.TeamVisuals;
  const WARMUP_FRAMES = 160;
  const scenes = [];

  document.querySelectorAll("[data-team]").forEach((el) => {
    const canvas = el.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const scene = { el, canvas, ctx, draw: null, playing: false };
    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Free space above the column text, so the visual never sits behind it
      const copy = el.querySelector(".team-copy");
      const space = copy ? copy.getBoundingClientRect().top - canvas.getBoundingClientRect().top : height;
      scene.draw = makers[el.dataset.team](ctx, width, height, canvas.dataset.fit, space);
      // Run ahead so the still frame shows a fully formed visual
      for (let i = 0; i < WARMUP_FRAMES; i++) scene.draw();
    };
    scene.setup = setup;
    setup();
    scenes.push(scene);
  });

  // ---------- Animation loop ----------
  // Columns show a still frame and only animate while hovered (or tapped on touch screens).
  // The loop stops entirely when nothing is playing.
  let rafId = null;
  const loop = () => {
    const active = scenes.filter((s) => s.playing);
    active.forEach((s) => s.draw());
    rafId = active.length ? requestAnimationFrame(loop) : null;
  };
  const setPlaying = (scene, on) => {
    if (reduceMotion) return;
    scene.playing = on;
    scene.el.classList.toggle("is-playing", on);
    if (on && rafId === null) rafId = requestAnimationFrame(loop);
  };

  const canHover = window.matchMedia("(hover: hover)").matches;
  for (const s of scenes) {
    if (canHover) {
      s.el.addEventListener("mouseenter", () => setPlaying(s, true));
      s.el.addEventListener("mouseleave", () => setPlaying(s, false));
    } else {
      // Touch: tapping a column plays it and pauses the others
      s.el.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        const on = !s.playing;
        scenes.forEach((x) => setPlaying(x, x === s && on));
      });
    }
    // Keyboard users get the animation when tabbing to the apply link
    s.el.addEventListener("focusin", () => setPlaying(s, true));
    s.el.addEventListener("focusout", () => setPlaying(s, false));
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => scenes.forEach((s) => s.setup()), 150);
  });
})();
