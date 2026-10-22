# KTH Quantitative Investment Club — Website

The public website for the KTH Quantitative Investment Club. It presents our four teams (Research, Risk, Development, Marketing), tells visitors who we are, and links to our application form.

It is a plain static site: HTML, CSS and a little JavaScript. There is no framework, no build step and nothing to install.

---

## Contents

- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [How the page is built](#how-the-page-is-built)
- [Common edits](#common-edits)
- [Design system](#design-system)
- [Deploying](#deploying)
- [To do](#to-do)

---

## Project structure

```
Quant Club Website/
├── index.html      Page content and structure
├── styles.css      All styling (colours, layout, responsive rules)
├── script.js       Animated team visuals and small page behaviour
├── assets/
│   └── logo.svg    Club logo (also used as the browser tab icon)
└── README.md       This file
```

The `.claude/` folder is local tooling for previewing the site. It is not part of the website and should not be uploaded.

---

## Running it locally

**Quickest:** double-click `index.html` to open it in your browser.

**With a local server** (closer to how it behaves online, and lets you open it on your phone over the same Wi-Fi):

```bash
python -m http.server 5173
```

Run it from the project folder, then open http://localhost:5173. Stop it with `Ctrl+C`.

You need an internet connection for the Google Fonts to load. Without one the page falls back to system fonts.

---

## How the page is built

`index.html` is split into these sections, top to bottom:

| Section          | Element / id        | What it is                                                     |
| ---------------- | ------------------- | -------------------------------------------------------------- |
| Background       | `.aurora`, `.grain` | Blurred, slowly drifting colour blobs plus film grain, after our posters |
| Navigation       | `header.nav`        | Links, centred logo, Join button, LinkedIn and email icons    |
| Teams            | `#teams`            | Four full-height columns, one per team, each with an animated canvas |
| About            | `#about`            | Logo, wordmark and a short description of the club            |
| Recruitment      | `#recruitment`      | Poster-style "Recruitment Open" section with the Apply button |
| Footer           | `#contact`          | Link columns and copyright                                     |

### Team animations (`script.js`)

Each team column is an `<article class="team" data-team="...">` containing a `<canvas>`. The script reads the `data-team` value and runs the matching drawing function:

| `data-team`   | Function        | Visual                                                            |
| ------------- | --------------- | ----------------------------------------------------------------- |
| `research`    | `research()`    | Monte Carlo price paths fanning out from one starting point       |
| `risk`        | `risk()`        | A return distribution building up, with the 95% VaR tail in red   |
| `development` | `development()` | A grid of code characters that forms a "Q", with a scanning line  |
| `marketing`   | `marketing()`   | Broadcast rays and expanding rings from a glowing centre          |

Each function takes `(ctx, width, height)` and returns a `draw()` function that renders one frame. A single `requestAnimationFrame` loop calls `draw()` for every column that is currently on screen. Visitors who have reduced motion turned on in their system settings get a still image instead.

---

## Common edits

### Change a link

All links are in `index.html`. Search the file for the old URL and replace it.

| Link               | Where it appears                                              |
| ------------------ | ------------------------------------------------------------- |
| Application form   | Nav "Join" button, each team's "apply to …" link, "Apply now" button |
| LinkedIn           | Nav icon and footer                                           |
| Instagram          | Footer                                                        |
| Email              | Nav icon and footer "Contact"                                 |

### Edit a team's description

Find the team's `<article class="team" data-team="...">` in `index.html` and edit the `<h2>` (name) and `<p>` (description).

### Add or remove a team

1. Copy or delete an `<article class="team">` block in the Teams section of `index.html`.
2. In `styles.css`, change `grid-template-columns: repeat(4, 1fr)` under `.teams` to the new number of columns.
3. For a new team, give it a new `data-team` value and add a drawing function with the same name to `makers` in `script.js`. Reusing an existing value also works.
4. Update the team list in the Recruitment section and the footer.

### Replace the logo

Overwrite `assets/logo.svg` with the new logo, keeping the same filename. It is used in the nav, the About section and the browser tab. An SVG with a transparent background and light-coloured artwork works best on the dark page. If the logo is a PNG, save it as `assets/logo.png` and update the three `logo.svg` references in `index.html`.

---

## Design system

All colours and fonts are defined once at the top of `styles.css` under `:root`. Change them there and they update everywhere.

| Token        | Value     | Used for                              |
| ------------ | --------- | ------------------------------------- |
| `--bg`       | `#050505` | Page background                       |
| `--ink`      | `#f4efe6` | Main text, buttons                    |
| `--muted`    | `#a7a19a` | Secondary text                        |
| `--ember`    | `#ff7a3d` | Research accent                       |
| `--crimson`  | `#d9412b` | Risk accent                           |
| `--teal`     | `#3fae8f` | Development accent                    |
| `--amber`    | `#e9b35a` | Marketing accent, highlights          |

Fonts (from Google Fonts):

- **Cormorant Garamond:** headings, in capitals, to match the posters
- **Inter:** body text
- **JetBrains Mono:** small labels and links

The layout responds to screen size. It has four columns on desktop, two on tablets (under 900px) and one on phones (under 640px), where the nav links are hidden.

---

## Deploying

The site is static, so any static host works. Upload `index.html`, `styles.css`, `script.js` and the `assets/` folder.

**Netlify Drop (fastest):** drag the project folder onto https://app.netlify.com/drop. To update the site, drag the folder in again.

**GitHub Pages (recommended long-term):**

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**, choose **Deploy from a branch**, select `main`, then **Save**.
3. The site appears at `https://<username>.github.io/<repo-name>/` within a minute. Every push to `main` updates it.

A custom domain (for example `kthqif.se`) can be connected in either host's settings.

---

## To do

- [ ] Replace the placeholder logo with the official one
- [ ] Add the real Instagram link
- [ ] Add the real contact email (currently `contact@kthquant.se`)
- [ ] Add the GitHub link once the organisation exists
- [ ] Fill in or remove the Legal links (Notice, Privacy, Terms)
