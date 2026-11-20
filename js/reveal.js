/* First-time scroll reveal. Elements matching TARGETS fade and rise in when they
 * first enter the viewport; siblings revealed together are staggered. The
 * pipeline in "Our approach" also gets .is-visible, which draws its line.
 * Keep TARGETS in sync with the .js-reveal rule in css/base.css. */
(function () {
  const root = document.documentElement;
  if (!root.classList.contains("js-reveal")) return;
  const TARGETS = ".hero-inner > *, .hero-bar, section .eyebrow, .section-title, .approach-title, .step, .figures-grid > div, .partner, .team-card, .teams-title, .list li, .partners .btn";
  const STAGGER = 0.09; // seconds between items revealed in the same batch

  const els = [...document.querySelectorAll(TARGETS), ...document.querySelectorAll("[data-pipeline]")];
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }

  const io = new IntersectionObserver((entries) => {
    const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    shown.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    shown.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", (i * STAGGER).toFixed(2) + "s");
      el.classList.add("is-visible");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  els.forEach((el) => io.observe(el));
})();
