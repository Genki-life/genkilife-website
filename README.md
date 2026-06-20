# Genki website

A static, zero-build marketing site for **genkilife.ai**.
Plain HTML/CSS/JS — no framework, no bundler, no Node required.
Deploys to Vercel / Cloudflare Pages by dropping this folder in.

## Structure

```
genki-site/
├── index.html          # Homepage
├── rituals.html        # Rituals second page (for media / sharing)
├── assets/
│   ├── styles.css      # All shared styles (incl. responsive)
│   ├── nav.js          # Injects shared header + footer (SINGLE source).
│   │                   #   Also: Rituals mega menu, mobile menu, sticky pill.
│   │                   #   Edit nav/footer/Rituals tool list HERE only.
│   ├── nova.js         # Homepage "Nova" light canvas animation
│   └── main.js         # Scroll reveals + waitlist count-up
└── README.md
```

**Single source of truth:** the header, footer, and the Rituals tool list
live only in `assets/nav.js` (the `RITUALS` array + `headerHtml()`/`footerHtml()`).
Change them once → every page updates. Each page just has two placeholders:
`<div id="site-nav-root"></div>` and `<div id="site-footer-root"></div>`.

## Local preview

Open with a tiny local server (needed so the shared assets + JS injection work;
opening the file directly with `file://` also works for most things but a server
is cleaner):

```bash
cd genki-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

- **Vercel:** import the repo (or drag this folder into the dashboard). No build
  command, output dir = project root. `genkilife.ai` → add as a domain.
- **Cloudflare Pages:** same — framework preset "None", build command empty,
  output directory `/`.

## Before launch — TODO

1. **Fonts:** preview uses system fallback. For production swap to the brand
   pairing (e.g. Inter Tight) via Google Fonts `<link>` + update `--sans`.
2. **Hero headline** "Becoming, gently." is a placeholder — 3 candidates still
   undecided. Pick one.
3. **App screenshots:** the homepage no longer uses a phone mock (Nova light
   instead). If you want real app shots elsewhere, add a section.
4. **Waitlist forms:** wrap each `.signup` in
   `<form action="https://formspree.io/f/XXXX" method="POST">` and give the
   input `name="email"`. (Two signup blocks: hero + final CTA.)
5. **Waitlist count:** `.num[data-target]` shows a demo number (18,643) with a
   count-up animation. Replace with the **real** subscriber count from your
   waitlist service; `data-placeholder="{{waitlist_count}}"` marks the spot.
   Do NOT ship a hard-coded fake number. Suggest hiding the pill until ≥ ~200.
6. **Silhouettes** in the Bond band are placeholder illustrations. Keep them as
   illustrations until you have real, consented user photos.
7. **Privacy Policy / Terms:** footer links are `#` placeholders. App Store
   review requires a reachable Privacy Policy page (HealthKit). Create these.
8. **Rituals tools:** names (Breathe/Stretch/…) are placeholders. Only Breathe
   is marked `Live`; everything else `Soon`. Keep all tools NON-MEDICAL
   (general wellness) — see the disclaimer lines, they are compliance guardrails.

## Notes on design choices (so future edits don't "fix" them by mistake)

- This site intentionally uses pure white / near-black / flat background and
  black buttons (the "Plan A / Cal AI" direction the team chose), with brand
  purple `#534AB7` only as a small accent. This deviates from the app's design
  system (which says never-pure-white, never-pure-black, glass cards) — it is a
  deliberate, team-approved choice.
- All motion respects `prefers-reduced-motion`.

## Working with Claude — version sync rules

Git is the **single source of truth**. Claude cannot watch the repo or auto-sync;
Claude's own workspace is temporary and resets. So we align like this:

1. **Before asking Claude to edit:** push your local changes to GitHub first.
2. **When asking:** send Claude the **raw link** of the file(s) to change
   (open the file on GitHub → "Raw" → copy the `raw.githubusercontent.com/...` URL).
   Claude fetches that exact latest version and edits from it.
3. **After:** Claude returns the new content; you overwrite, `commit`, and `push`.
4. **GitHub always wins.** Never treat "Claude's copy" as the truth.
5. **Files you hand-maintain** (e.g. the `RITUALS` array in `assets/nav.js`):
   tell Claude "this file is yours" — Claude will give targeted snippets only,
   never overwrite the whole file, so your manual edits aren't clobbered.

Keep commits small and frequent with clear messages — if an edit ever collides,
`git diff` shows exactly what changed, and Git handles the merge, not memory.
