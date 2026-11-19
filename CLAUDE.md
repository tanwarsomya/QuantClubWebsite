# Working on this repo — redesign rules

Website redesign for the Stockholm Student Quantitative Fund (SSQF, KTH). One developer.

## The project
- Plain static site: HTML, CSS, vanilla JavaScript. No framework, no build step, no dependencies. Keep it that way.
- Run locally: `python -m http.server 5173`, then open http://localhost:5173.
- The redesign **replaces the old code completely**. Old files can be deleted and rewritten; the old structure (base/components/page CSS, `js/main.js`) is only inspiration.

## Design source
- The PR/design team's PDF ("SSQ Marketing (HEMSIDAN)") is the starting point. **Ignore page 5** (social media brainstorm).
- Palette: `#0b162b` navy, `#0f1e38` navy-2, `#C9A24D` gold, `#f6f2e9` cream, `#e7dccc` sand, `#b6bfcc` slate.
- Typography: Inter — bold for headings, regular for body.
- Logo: circle mark with gold wave lines + "SSQF / Stockholm Student Quantitative Fund" wordmark. Until the design team delivers PNGs, logos are drawn with JS (`js/logo.js`); swap for PNGs later.
- Content notes from the PDF: remove "Risk" (team becomes **Research & Trading**), add **Board**, add mission statement (Why / How / What), partners/company contacts high up right after the hero, key figures (members, strategies, founded, partners), "Where you can contribute" teams grid, Open positions vs Events, Our partners.

## Rules to keep
- Text contrast ≥ 4.5:1 against its background. Gold `#C9A24D` only passes on navy; on cream/sand use the darker `--gold-ink`.
- Responsive breakpoints at 900px and 640px.
- `prefers-reduced-motion`: still images only, no animation.
- Buttons/links to pages that don't exist yet may be non-functional (`href="#"`) until those pages are built.

## Git workflow (important)
- Work only on branch `landing-page` for this phase. Check with `git branch` first.
- **Never** commit to, merge into or push to `main` — every push to main goes live via GitHub Pages.
- Never commit directly to `redesign`. Flow: `landing-page` → PR into `redesign` → (when the whole redesign is done) `redesign` → `main`.
- **Only commit when the user explicitly says so.** Then use small, logical commits with clear imperative messages.
- Don't push until the user says so. On approval: push `landing-page` and open a PR with base `redesign` (not main).
- Don't commit the design document unless asked.

## How to work
- Implement step by step (no commits unless told) and tell the user what to check in the browser after each larger change.
- If something in the design is unclear or conflicts, make a sensible choice and flag it.
