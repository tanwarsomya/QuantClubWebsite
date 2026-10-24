# KTH Quantitative Investment Club — Website

The public website for the KTH Quantitative Investment Club. It introduces our four teams (Research, Risk, Development and Marketing), explains who we are and links to our application form.

I built it as a plain static site in HTML, CSS and vanilla JavaScript, with no framework, no build step and no dependencies. The visual style follows our recruitment posters: a black background, warm blurred colour and high-contrast serif type.

---

## Contents

- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [How it works](#how-it-works)
- [Making changes](#making-changes)
- [Design system](#design-system)
- [Deployment](#deployment)

---

## Project structure

```
├── index.html      Page content and structure
├── styles.css      Styling: colours, layout, responsive rules
├── script.js       Animated team visuals and scroll behaviour
├── teams/
│   ├── development.html   Development team page
│   ├── research.html      Research team page
│   ├── risk.html          Risk team page
│   └── marketing.html     Marketing team page
└── assets/
    └── logo.svg    Club logo, also used as the favicon
```

---

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5173
```

Then visit http://localhost:5173.

---

## How it works

### Page sections

| Section     | Selector            | Description                                                         |
| ----------- | ------------------- | ------------------------------------------------------------------- |
| Background  | `.aurora`, `.grain` | Blurred, slowly drifting colour blobs with a film-grain overlay     |
| Navigation  | `header.nav`        | Links, centred logo, Join button, social icons                      |
| Teams       | `#teams`            | Four full-height columns, each with its own animated canvas         |
| About       | `#about`            | Logo, wordmark and club description                                 |
| Recruitment | `#recruitment`      | Poster-style "Recruitment Open" section linking to the application form |
| Footer      | `#contact`          | Link columns and copyright                                          |

### Team animations

Each team column is an `<article class="team" data-team="...">` with a `<canvas>` inside. `script.js` looks up a drawing function by the `data-team` value:

| `data-team`   | Visual                                                          |
| ------------- | --------------------------------------------------------------- |
| `research`    | Monte Carlo price paths fanning out from a common origin        |
| `risk`        | A return distribution filling in, with the 95% VaR tail in red  |
| `development` | A grid of code glyphs forming a "Q", swept by a scan line       |
| `marketing`   | Broadcast rays and expanding rings from a glowing centre        |

Visuals mount on any element with a `data-team` attribute that contains a `<canvas class="team-canvas">`, so team pages reuse them. A canvas with `data-fit="center"` centres its visual instead of placing it above the column text.

Each function takes `(ctx, width, height, fit)` and returns a `draw()` function for one frame. On load, every canvas is run ahead `WARMUP_FRAMES` frames and left as a dimmed still image.

An animation plays only while its column is hovered, or while its apply link has keyboard focus. On touch screens, tapping a column plays it and pauses the others. The playing column gets an `is-playing` class, which brightens the canvas. A single `requestAnimationFrame` loop draws the playing columns and stops entirely when none are playing. Canvases are rebuilt on resize. Visitors with `prefers-reduced-motion` set only ever see the still frames.

---

## Making changes

### Links

All links are in `index.html`:

| Link             | Used in                                                      |
| ---------------- | ------------------------------------------------------------ |
| Application form | Nav "Join", each team's "apply to …" link, "Apply now"       |
| LinkedIn         | Nav icon, footer                                             |
| Instagram        | Footer                                                       |
| Email            | Nav icon, footer "Contact"                                   |

### Team content

Each team's name and description are the `<h2>` and `<p>` inside its `<article class="team">`.

### Team pages

Each team page lives in `teams/` and has these sections:

| Section           | Selector              | Description                                          |
| ----------------- | --------------------- | ---------------------------------------------------- |
| Hero              | `.tp-hero`            | Team name, summary, apply button and the team visual |
| What we do        | `.tp-focus`           | Description and focus-area cards                     |
| Members           | `.tp-members`         | One `.tp-member` card per person                     |
| Ongoing projects  | `.tp-projects`        | One `.tp-project` card per project                   |
| Finished projects | `.tp-projects`        | One `.tp-project` card per project                   |
| Call to action    | `.tp-cta`             | "Join" section linking to the application form       |

To add a member or project, copy an existing card and edit its text. Ongoing projects use `class="tp-status is-ongoing"`. The page's accent colour comes from `--accent` on `<body>`.

To create a page for another team:

1. Copy `teams/development.html` to `teams/<team>.html`.
2. Change the title, text, `--accent` on `<body>` and `data-team` on `.tp-visual`.
3. On `index.html`, link the team's `<h2>`, its "meet the team" link, its Recruitment list item and its footer entry to the new page. Do the same in the footer of each team page.

### Adding or removing a team

1. Add or remove an `<article class="team">` block in `index.html`.
2. Update `grid-template-columns: repeat(4, 1fr)` on `.teams` in `styles.css`.
3. For a new visual, add a drawing function to `makers` in `script.js`, keyed by the new `data-team` value.
4. Update the team lists in the Recruitment section and the footer.

### Logo

Replace `assets/logo.svg`. The logo is used in the nav, the About section and as the favicon. Light artwork on a transparent background suits the dark page best.

---

## Design system

Colours and fonts are defined as custom properties on `:root` in `styles.css`.

| Token       | Value     | Use                          |
| ----------- | --------- | ---------------------------- |
| `--bg`      | `#050505` | Background                   |
| `--ink`     | `#f4efe6` | Primary text, buttons        |
| `--muted`   | `#a7a19a` | Secondary text               |
| `--ember`   | `#ff7a3d` | Research accent              |
| `--crimson` | `#d9412b` | Risk accent                  |
| `--teal`    | `#3fae8f` | Development accent           |
| `--amber`   | `#e9b35a` | Marketing accent, highlights |

Typefaces, all from Google Fonts:

- **Cormorant Garamond:** headings
- **Inter:** body text
- **JetBrains Mono:** labels and links

The layout has four columns on desktop, two below 900px and one below 640px.

---

## Deployment

The site is hosted with GitHub Pages from the `main` branch. Every push to `main` updates the live site.
