/* Hero: a wireframe "implied volatility" surface rendered with three.js.
 * Points near the mouse lift up and warm from gold to orange (eased in-out),
 * like the old bell curve. Desktop only (wider than 900px); smaller screens
 * keep the circle mark from js/logo.js. With prefers-reduced-motion the
 * surface is a still image. The HTML chips in [data-surface] follow points on it. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const host = document.querySelector("[data-surface]");
const desktop = window.matchMedia("(min-width: 901px)");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let started = false;

// Height of the surface at (x, z), both in [-1, 1]: mostly calm, with a
// faint smile and ripple. The mouse provides the peaks.
function height(x, z) {
  const ripple = 0.04 * Math.sin(5 * x + 1.2) * Math.cos(4 * z);
  const smile = 0.08 * x * x - 0.03 * z;
  return ripple + smile;
}

// Slow travelling swell, like a calm sea. x, z in surface units; time in ms.
function swell(x, z, time) {
  const s = time * 0.001;
  return 0.06 * Math.sin(1.6 * x + 0.9 * z - 0.7 * s)
       + 0.035 * Math.sin(-1.1 * x + 2.3 * z - 0.45 * s + 1.3)
       + 0.02 * Math.sin(3.1 * x + 2.7 * z - 1.1 * s + 2.1);
}

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function start() {
  if (started) return;
  started = true;

  const N = 44, SIZE = 1.6;
  const LIFT = 0.42;      // max upward push, in surface units
  const REACH = 180;      // falloff radius around the mouse, in CSS pixels
  const GOLD = new THREE.Color(0xc9a24d), ORANGE = new THREE.Color(0xe67828);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b162b, 3.2, 6.5);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 1.55, 3.6);
  camera.lookAt(0, 0.15, 0);

  // Grid points: rest position, plus each point's current/target hover amount.
  const P = N + 1;
  const rest = [], t = new Float32Array(P * P);
  for (let i = 0; i < P; i++) {
    for (let j = 0; j < P; j++) {
      const x = (i / N) * 2 - 1, z = (j / N) * 2 - 1;
      rest.push(new THREE.Vector3(x * SIZE, height(x, z), z * SIZE));
    }
  }
  const idx = (i, j) => i * P + j;

  // Grid lines along both axes as one LineSegments mesh with vertex colours.
  const pairs = [];
  for (let i = 0; i < P; i++) {
    for (let j = 0; j < N; j++) pairs.push(idx(i, j), idx(i, j + 1), idx(j, i), idx(j + 1, i));
  }
  const positions = new Float32Array(pairs.length * 3);
  const colors = new Float32Array(pairs.length * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, fog: true });
  const surface = new THREE.Group();
  surface.add(new THREE.LineSegments(geo, mat));
  surface.rotation.y = -0.35;
  scene.add(surface);

  const c = new THREE.Color();
  let now = 0;
  function writeGeometry() {
    for (let k = 0; k < pairs.length; k++) {
      const p = pairs[k], r = rest[p], e = easeInOut(t[p]);
      positions[k * 3] = r.x;
      positions[k * 3 + 1] = r.y + swell(r.x, r.z, now) + LIFT * e;
      positions[k * 3 + 2] = r.z;
      c.copy(GOLD).lerp(ORANGE, e);
      colors[k * 3] = c.r; colors[k * 3 + 1] = c.g; colors[k * 3 + 2] = c.b;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }
  writeGeometry();

  // Points the HTML chips follow (local surface coordinates).
  const local = (x, z, lift = 0) => new THREE.Vector3(x * SIZE, height(x, z) + lift, z * SIZE);
  const anchors = {
    ring: local(0.25, -0.05),
    sigma: local(0.25, -0.05, 0.32),
    t: local(-0.45, -0.55, 0.2),
    p: local(0.55, 0.75, 0.05),
  };
  const chips = [...host.querySelectorAll("[data-chip]")].map((el) => ({ el, a: anchors[el.dataset.chip] }));

  // Mouse position relative to the canvas, or null when away.
  let mouse = null;
  const hero = host.closest(".hero") || host;
  if (!reduced) {
    hero.addEventListener("pointermove", (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      kick();
    });
    hero.addEventListener("pointerleave", () => { mouse = null; kick(); });
  }

  let width = 1, h = 1;
  function resize() {
    const box = host.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width = box.width; h = box.height;
    renderer.setSize(width, h, false);
    camera.aspect = width / h;
    camera.updateProjectionMatrix();
    kick();
  }
  new ResizeObserver(resize).observe(host);

  const v = new THREE.Vector3(), w = new THREE.Vector3();
  const toScreen = (p) => {
    v.copy(p).applyMatrix4(surface.matrixWorld).project(camera);
    return [((v.x + 1) / 2) * width, ((1 - v.y) / 2) * h];
  };

  // Returns true while any point is still easing toward its target.
  function update() {
    let moving = false;
    for (let k = 0; k < rest.length; k++) {
      let goal = 0;
      if (mouse) {
        const [sx, sy] = toScreen(rest[k]);
        const d = Math.hypot(sx - mouse.x, sy - mouse.y);
        goal = Math.max(0, 1 - d / REACH);
      }
      t[k] += (goal - t[k]) * 0.12;
      if (Math.abs(goal - t[k]) > 0.002) moving = true; else t[k] = goal;
    }
    writeGeometry();
    return moving;
  }

  function render(time) {
    if (!reduced) surface.rotation.y = -0.35 + Math.sin(time * 0.00025) * 0.12;
    surface.updateMatrixWorld();
    renderer.render(scene, camera);
    for (const { el, a } of chips) {
      w.copy(a); w.y += swell(a.x, a.z, now);
      const [x, y] = toScreen(w);
      el.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  // Animate while the hero is on screen; with reduced motion, draw once per resize.
  let visible = true, raf = 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(host);
  function frame(time) {
    raf = 0;
    if (!reduced) now = time;
    surface.updateMatrixWorld();
    if (!reduced) update();
    render(time);
    if (visible && !reduced) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  resize();
  host.classList.add("is-ready");
}

if (host) {
  if (desktop.matches) start();
  else desktop.addEventListener("change", (e) => { if (e.matches) start(); });
}
