/* Nav toggle on small screens and footer year. Loaded by every page. */
(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* "Read more >>" links: while the link is hovered (or keyboard-focused), each
 * arrow shuffles on its own, the left one starting a moment after the right.
 * On leave, each arrow finishes its current cycle before stopping, so quick
 * mouse movements never make the arrows jump back. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const LAG = 110; // ms the left arrow trails the right one
  document.querySelectorAll(".more").forEach((link) => {
    const arrows = [...link.querySelectorAll(".more-arrow")].reverse(); // right first
    if (!arrows.length) return;
    const state = arrows.map(() => ({ stopping: false, timer: 0 }));
    function start() {
      arrows.forEach((a, i) => {
        const st = state[i];
        st.stopping = false;
        if (a.classList.contains("is-shuffling")) return;
        clearTimeout(st.timer);
        st.timer = setTimeout(() => a.classList.add("is-shuffling"), i * LAG);
      });
    }
    function stop() {
      arrows.forEach((a, i) => {
        clearTimeout(state[i].timer);
        if (a.classList.contains("is-shuffling")) state[i].stopping = true;
      });
    }
    arrows.forEach((a, i) =>
      a.addEventListener("animationiteration", () => {
        if (state[i].stopping) { a.classList.remove("is-shuffling"); state[i].stopping = false; }
      })
    );
    link.addEventListener("pointerenter", start);
    link.addEventListener("pointerleave", stop);
    link.addEventListener("focus", () => { if (link.matches(":focus-visible")) start(); });
    link.addEventListener("blur", stop);
  });
})();
