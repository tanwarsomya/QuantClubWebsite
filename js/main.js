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

/* "Read more >>" links: the arrows shuffle while hovered (or while their team
 * card is hovered). On leave, the current cycle finishes before stopping, so
 * quick mouse movements never make the arrows jump back. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".more").forEach((link) => {
    const arrow = link.querySelector(".more-arrow");
    if (!arrow) return;
    const trigger = link.closest(".team-card") || link;
    let stopping = false;
    const start = () => { stopping = false; link.classList.add("is-shuffling"); };
    const stop = () => { if (link.classList.contains("is-shuffling")) stopping = true; };
    trigger.addEventListener("pointerenter", start);
    trigger.addEventListener("pointerleave", stop);
    link.addEventListener("focus", start);
    link.addEventListener("blur", stop);
    arrow.addEventListener("animationiteration", () => {
      if (stopping) { link.classList.remove("is-shuffling"); stopping = false; }
    });
  });
})();
