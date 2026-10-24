# KTH Quantitative Investment Club — Website

The public website for the KTH Quantitative Investment Club. It introduces our four teams (Research, Risk, Development and Marketing), explains who we are and links to our application form.

I built it as a plain static site in HTML, CSS and vanilla JavaScript, with no framework, no build step and no dependencies. The visual style follows our recruitment posters: a black background, warm blurred colour and high-contrast serif type.

---

## Contents

- [Project structure](#project-structure)
- [Where to change things](#where-to-change-things)
- [Running locally](#running-locally)
- [How it works](#how-it-works)
- [Making changes](#making-changes)
- [Design system](#design-system)
- [Deployment](#deployment)

---

## Project structure

```
├── index.html               Home page
├── teams/                   One page per team
│   ├── research.html
│   ├── risk.html
│   ├── development.html
│   └── marketing.html
├── css/
│   ├── base.css             Colours, fonts, reset, background   (every page)
│   ├── components.css       Nav, buttons, visuals, footer       (every page)
│   ├── home.css             Team columns, About, Recruitment    (index.html only)
│   └── team-page.css        Team page layout                    (teams/*.html only)
├── js/
│   ├── visuals.js           The four team animations            (every page)
│   └── main.js              Nav, footer year, animation playback (every page)
└── assets/
    └── logo.svg             Club logo, also used as the favicon
```

Every page loads `base.css`, `components.css` and then its own stylesheet, followed by `visuals.js` and then `main.js`. The order matters: later files build on earlier ones.

---

## Where to change things

| I want to change…                          | Edit                                                   |
| ------------------------------------------ | ------------------------------------------------------ |
| A colour or font                           | `css/base.css` (the `:root` block)                     |
| Text on the home page                      | `index.html`                                           |
| A team's description, members or projects | `teams/<team>.html`                                    |
| A link in the nav or footer                | Every HTML page (see [Links](#links))                  |
| The nav, buttons or footer styling         | `css/components.css`                                   |
| The home page layout                       | `css/home.css`                                         |
| The team page layout                       | `css/team-page.css`                                    |
| How a team animation looks                 | `js/visuals.js`                                        |
| When animations play                       | `js/main.js`                                           |
| The logo                                   | `assets/logo.svg`                                      |

---

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5173
```

Then visit http://localhost:5173.

---

## How it works

### Home page (`index.html`)

| Section     | Selector            | Description                                                         |
| ----------- | ------------------- | ------------------------------------------------------------------- |
| Background  | `.aurora`, `.grain` | Blurred, slowly drifting colour blobs with a film-grain overlay     |
| Navigation  | `header.nav`        | Links, centred logo, Join button, social icons                      |
| Teams       | `#teams`            | Four full-height columns, each with its own animated canvas         |
| About       | `#about`            | Logo, wordmark and club description                                 |
| Recruitment | `#recruitment`      | Poster-style "Recruitment Open" section linking to the application form |
| Footer      | `#contact`          | Link columns and copyright                                          |

### Team pages (`teams/*.html`)

| Section           | Selector       | Description                                          |
| ----------------- | -------------- | ---------------------------------------------------- |
| Hero              | `.tp-hero`     | Team name, summary, apply button and the team visual |
| What we do        | `.tp-focus`    | Description and focus-area cards                     |
| Members           | `.tp-members`  | One `.tp-member` card per person                     |
| Ongoing projects  | `.tp-projects` | One `.tp-project` card per project                   |
| Finished projects | `.tp-projects` | One `.tp-project` card per project                   |
| Call to action    | `.tp-cta`      | "Join" section linking to the application form       |

Each team page sets its accent colour with `--accent` on `<body>`, which tints the labels, avatars and card borders.

### Team animations

`js/visuals.js` defines one drawing function per team and exposes them as `window.TeamVisuals`:

| `data-team`   | Visual                                                          |
| ------------- | --------------------------------------------------------------- |
| `research`    | Monte Carlo price paths fanning out from a common origin        |
| `risk`        | A return distribution filling in, with the 95% VaR tail in red  |
| `development` | A grid of code glyphs forming a "Q", swept by a scan line       |
| `marketing`   | Broadcast rays and expanding rings from a glowing centre        |

Each function takes `(ctx, width, height, fit)` and returns a `draw()` function for one frame. A canvas with `data-fit="center"` centres its visual (team page heroes). Otherwise the visual sits above the column text (home page).

`js/main.js` finds every element with a `data-team` attribute and a `<canvas class="team-canvas">` inside, runs its visual ahead `WARMUP_FRAMES` frames and leaves it as a dimmed still image. An animation plays only while its element is hovered, or while a link inside it has keyboard focus. On touch screens, tapping plays it and pauses the others. The playing element gets an `is-playing` class, which brightens the canvas. A single `requestAnimationFrame` loop draws whatever is playing and stops entirely when nothing is. Canvases are rebuilt on resize. Visitors with `prefers-reduced-motion` set only ever see the still frames.

---

## Making changes

### Links

The nav and footer are repeated in every HTML page, so a link change has to be made in all five files. Search the project for the old URL and replace it everywhere.

| Link             | Used in                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| Application form | Nav "Join", home "apply to …" links, "Apply now", team page buttons    |
| LinkedIn         | Nav icon, footer                                                       |
| Instagram        | Footer                                                                 |
| Email            | Nav icon, footer "Contact"                                             |

Pages in `teams/` sit one folder down, so their links to shared files start with `../` (for example `../css/base.css` and `../index.html#about`).

### Team content

On the home page, each team's name and summary are the `<h2>` and `<p>` inside its `<article class="team">`. Everything else about a team is on its page in `teams/`. To add a member or project there, copy an existing card and edit its text. Ongoing projects use `class="tp-status is-ongoing"`.

### Adding a team

1. Copy one of the pages in `teams/` to `teams/<team>.html`. Change its title, text, `--accent` on `<body>` and `data-team` on `.tp-visual`.
2. In `index.html`, add an `<article class="team" data-team="<team>">` column and add the team to the Recruitment list and footer.
3. Add the team to the footer of every team page.
4. In `css/home.css`, update `grid-template-columns: repeat(4, 1fr)` on `.teams`.
5. For a new animation, add a drawing function to `js/visuals.js` and to the object it returns, keyed by the new `data-team` value. Otherwise reuse an existing value.

To remove a team, undo the same steps.

### Logo

Replace `assets/logo.svg`. The logo is used in the nav, the About section and as the favicon. Light artwork on a transparent background suits the dark page best.

---

## Design system

Colours and fonts are defined as custom properties on `:root` in `css/base.css`.

| Token       | Value     | Use                          |
| ----------- | --------- | ---------------------------- |
| `--bg`      | `#050505` | Background                   |
| `--ink`     | `#f4efe6` | Primary text, buttons        |
| `--soft`    | `#d6d0c7` | Body paragraphs              |
| `--muted`   | `#a7a19a` | Secondary text               |
| `--ember`   | `#ff7a3d` | Research accent              |
| `--crimson` | `#d9412b` | Risk accent                  |
| `--teal`    | `#3fae8f` | Development accent           |
| `--amber`   | `#e9b35a` | Marketing accent, highlights |

Typefaces, all from Google Fonts:

- **Cormorant Garamond:** headings
- **Inter:** body text
- **JetBrains Mono:** labels and links

Layouts have breakpoints at 900px (tablet) and 640px (phone). Each CSS file keeps its own responsive rules at the bottom.

---

## Deployment

The site is hosted with GitHub Pages from the `main` branch. Every push to `main` updates the live site.
