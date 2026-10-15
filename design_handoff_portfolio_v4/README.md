# Handoff: Portfolio v4 — One-Page Aurora Redesign

## Overview
A full redesign of Viktor Blais's personal portfolio (the `Portfolio-website` Vite + React + Tailwind v4 repo). The site becomes a **single, non-scrolling desktop screen** with five sections — Home, About, Skills, Work, Contact — swapped in place by a glass tab bar with animated transitions. Visual language: Apple-style big, tight, bold system type; a soft animated aurora gradient filling the whole viewport; frosted-glass surfaces; a light theme (default) and a black dark theme with a twinkling, cursor-reactive starfield.

## About the Design Files
Everything in `prototype/` and `reference/` is a **design reference built in HTML** — a working prototype that shows the exact intended look and behavior. It is **not production code to paste in**. The task is to **recreate this design inside the existing codebase** (`Portfolio-website`: React 19 + Vite + Tailwind v4, components in `src/components/`, page in `src/pages/Home.jsx`, static files in `public/`) using its patterns: React function components + hooks, Tailwind classes (or a small CSS module where Tailwind is awkward, e.g. keyframes/canvas), `lucide-react` is available but this design uses no icons.

- `prototype/Portfolio v4 - One Page.dc.html` — open in a browser (keep `support.js` and `assets/` next to it) to see the live, final design. Defaults are already set to the chosen config (see "Final configuration").
- `reference/template.html` — the prototype's markup with every inline style (the source of truth for exact px values, colors, easing).
- `reference/logic.js` — the prototype's full behavior: state, timers, animation loop, canvas drawing. Port this logic into hooks.

The template uses `{{ name }}` holes filled from `renderVals()` in `logic.js`, `<sc-for list=… as=…>` = `.map()`, `<sc-if value=…>` = conditional render, `style-hover="…"` = `:hover` styles, `style-focus` = `:focus`, `ref="{{ x }}"` = React ref.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, shadows, timings and easings are final. Recreate pixel-for-pixel.

## Final configuration (locked by the user)
- Theme: **light by default**, with a toggle to dark.
- Dark-mode effect (`darkFx`): **"stars"** only. Do **not** build the rainbow cursor trail.
- Motion multiplier: **1**.
- Custom cursor ring: **off**. Do not build it (normal OS cursor).
- The large glowing dark-mode orb that followed the cursor is **removed**. Do not build it.

---

## Global layout
- Root: `position:fixed; inset:0; overflow:hidden` — the page never scrolls. `html, body { height:100%; overflow:hidden; margin:0 }`, `-webkit-font-smoothing:antialiased`.
- Font stack (everything): `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Geist', sans-serif`. Load Geist 400/500/600/700 from Google Fonts as the non-Apple fallback.
- Layers, bottom → top:
  1. **Aurora canvas** — full viewport, `pointer-events:none`.
  2. **Stars canvas** — full viewport, only draws in dark mode.
  3. **Ripple** element (section-change effect), z 40.
  4. **Sections** — five `position:absolute; inset:0` layers stacked; only the active one is visible/interactive.
  5. **Nav** (z 50), **section counter** (bottom-left) and **hint** (bottom-right), z 20.
- Theme is applied as CSS custom properties on the root and on `body` background; all surfaces read the vars. Root transitions `background .6s, color .6s`.

## Design tokens

### Colors
| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fbfbfd` | `#000000` |
| `--fg` | `#1d1d1f` | `#f5f5f7` |
| `--mut` (secondary text) | `#6e6e73` | `#86868b` |
| `--mut2` (body text) | `#424245` | `#a1a1a6` |
| `--glass` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.06)` |
| `--glass2` (hover / stronger glass) | `rgba(255,255,255,.8)` | `rgba(255,255,255,.12)` |
| `--gb` (glass border) | `rgba(255,255,255,.9)` | `rgba(255,255,255,.12)` |
| `--line` (hairlines) | `rgba(0,0,0,.08)` | `rgba(255,255,255,.1)` |
| `--acc` (links / primary) | `#0071e3` | `#2997ff` |
| `--card` | `#ffffff` | `#111113` |
| `--shadow` | `rgba(60,40,140,.22)` | `rgba(0,0,0,.8)` |

Fixed colors: status dot / success `#34c759`. Brand gradient (logo "AI", rotating word, NHL line, top JMIT bar): `#7c3aed → #2563eb → #0d9488` (logo also cycles `#a855f7`). Vektor ring gradient `#a78bfa → #5eead4`. Phone body `linear-gradient(145deg,#3a3a3c,#1c1c1e)`, phone screen `#0b0b0d`. Browser dots `#ff5f57 #febc2e #28c840`.

Aurora blob colors — light: `#b9a7ff #7fd3ff #ffc4a3 #9ff0d2 #f0a8ff`; dark: `#4b2fd6 #1747d1 #0a8f84 #7a2ad0 #c23b7d`.

### Glass surface recipe
`background: var(--glass); border: 1px solid var(--gb); backdrop-filter: blur(20–30px) saturate(1.5)` (+ `-webkit-` prefix). Large panels add `box-shadow: 0 40px 90px -50px var(--shadow)`; cards `0 20px 50px -30px var(--shadow)`; nav `0 10px 30px -14px var(--shadow)`.

### Type scale (all use the system stack)
- Home name: `clamp(64px, min(12vw,18vh), 168px)`, 700, line-height .95, letter-spacing -0.055em.
- Section H2s: Skills `clamp(48px,min(7vw,10vh),96px)`; Work `clamp(40px,min(5vw,7vh),68px)`; Contact `clamp(52px,min(7vw,10vh),104px)`. All 700, ls -0.05em to -0.055em, lh .95.
- Home rotating line: `clamp(26px,min(4.2vw,5.6vh),54px)`, 600, ls -0.035em, color `--mut`.
- About statement: `clamp(28px,min(4vw,5.6vh),54px)`, 600, lh 1.12, ls -0.035em.
- Card titles 26px/700/-0.03em; project names `clamp(24px,min(2.6vw,3.8vh),36px)`/700/-0.04em.
- Body 16–20px, lh 1.45–1.5, color `--mut2`. Small labels 12.5–14px `--mut`.
- Use `text-wrap: pretty` on paragraphs.

### Radii
Pills/buttons 999px · nav 999px · glass cards 26px · project stage 36px · contact form panel 32px · inputs 16px · browser window 16px · phone 48px outer / 39px screen · chat bubbles 22px with one 6px corner.

### Easing
Primary: `cubic-bezier(.2,.8,.2,1)`. Springy (pills, sliding indicators, bar re-rank): `cubic-bezier(.3,1.25,.4,1)`. Skill-pill pop-in: `cubic-bezier(.2,.9,.25,1.15)`. Bouncy (phone checks, notification): `cubic-bezier(.3,1.6,.5,1)` / `cubic-bezier(.3,1.3,.5,1)`.

---

## Chrome

### Nav (top, centered)
- `position:absolute; top:18px; left:0; right:0; margin:0 auto; width:fit-content; max-width:calc(100vw - 24px); white-space:nowrap`. Glass (`blur(24px) saturate(1.6)`), radius 999, padding `6px 6px 6px 20px`, gap 4, font 14px.
- **Logo** (button → Home): "viktor bl**AI**s", 17px/600/-0.02em, `white-space:nowrap`. The "AI" uses the brand gradient as clipped text (`background-size:300% 100%`) and its `background-position` scrolls continuously: `x = (t*14) % 300 %` (t in seconds) — a slow shimmer.
- **Tabs**: Home, About, Skills, Work, Contact. Buttons 500 weight, padding `9px 15px`, radius 999, color `--mut2`; active tab color `--bg`. A **sliding pill** (`background: var(--fg)`, radius 999) sits behind the active tab, absolutely positioned to that button's offsetLeft/width/height, `transition: transform .6s cubic-bezier(.3,1.25,.4,1), width .6s same`. Text color transitions .45s.
- **Theme toggle**: 36×36 circle, `1px solid var(--line)`, transparent, shows "☾" in light and "☀" in dark.

### Section counter (bottom-left: left 28, bottom 22)
`01 ───── 05`: current number 12.5px/600 `--fg` tabular-nums; a 60×1px track (`--line`) with a `--fg` fill at `(index+1)*20%` width, `transition: width .8s primary`; then "05" in `--mut`. **Hidden when `innerHeight < 720`.**

### Hint (bottom-right: right 28, bottom 22)
"← → or scroll to move between sections", 12.5px `--mut`. **Hidden when `innerHeight < 720`.**

---

## Section transitions (the core interaction)
Triggered by: tab click, logo, in-page buttons, **← / → / ↑ / ↓ keys** (ignored while focus is in an input/textarea), and **mouse wheel** (|deltaY| ≥ 14, throttled to one change per 1100 ms; if the current section itself scrolls internally, the wheel only changes section when that inner scroll is at its top/bottom edge).

On change from `prev` → `next`:
1. **Ripple**: an 80×80 circle (`border:1.5px solid var(--fg)`, background `radial-gradient(circle, transparent 55%, rgba(160,140,255,.25) 100%)`) is placed centered on the clicked tab (or the target tab for key/wheel). Reset to `scale(.2) opacity .7` with no transition, force reflow, then animate to `scale(max(vw,vh)/26) opacity 0` over **1.3s** (`transform 1.3s primary, opacity 1.3s ease-out`).
2. **Section layers**: active = `opacity 1; transform none; filter none; pointer-events auto`. Inactive = `opacity 0; pointer-events none`; the section just left gets `translateX(±60px) scale(.94) blur(16px)`, other inactive ones `translateX(±30px) scale(.97) blur(10px)` — sign is `-` for sections left of the current one, `+` for those to the right. Transition `opacity .7s, transform 1s primary, filter .7s`.
3. **Staggered children**: every element marked `data-st` inside the incoming section is reset instantly to `opacity 0; translateY(34px); blur(10px)`, then animated to `none` with per-element delay `180ms + index*70ms` (`opacity .8s, transform 1s primary, filter .8s`). Incoming section's `scrollTop` resets to 0.
4. **Aurora surge**: a `surge` value is set to 1 and decays by ×0.965 per frame; it speeds the aurora's motion up to 6× and enlarges blobs slightly (see Aurora).
5. Entering **Home** replays the name letter-rise (set `risen=false` with transitions disabled, then `risen=true` 80ms later). Entering **Work** restarts the project timer. Entering **Skills** replays the skill pill pop-in.

All sections use `display:flex` with `safe center` alignment and `overflow:auto`, so on short/narrow screens content top-aligns and scrolls inside the section instead of being clipped. Bottom padding is 92px so content clears the counter.

---

## Screens

### 1. Home
Centered column, `padding:90px 24px 110px`, gap `clamp(14px,2.6vh,26px)`.
- **Glass bubbles** (light mode, 35% opacity in dark): 3 circles at (9%,18%) 110px, (85%,60%) 140px, (14%,72%) 60px. Background `radial-gradient(circle at 30% 28%, rgba(255,255,255,.95), rgba(255,255,255,.3) 22%, rgba(255,255,255,.06) 60%, rgba(255,255,255,.22) 100%)`, inset shadows `inset -8px -12px 30px rgba(120,100,255,.2), inset 6px 8px 18px rgba(255,255,255,.6)`, drop `0 30px 60px -20px var(--shadow)`, `backdrop-filter:blur(5px)`. Each drifts toward `(mouse − viewport center) × depth × 0.04` (depths 1.4, 0.9, 2.6) with lerp 0.05, plus a vertical bob `sin(t*0.8 + i*1.9) * 14px`.
- **Status pill** (data-st): "Open to internships · Fall 2026" — 14px/500, padding `7px 14px`, glass blur 12, 7px green dot `#34c759` pulsing (opacity 1→.25→1, 2s infinite).
- **Name** "Viktor Blais." — each character is its own span:
  - *Rise-in*: from `translateY(90px) opacity 0 blur(14px)` to rest, `1.2s primary`, delay `i*55ms`.
  - *Magnetic lift*: inner span per letter; with `f = max(0, 1 − dist(cursor, letter center)/180)`, target `translateY(−f²·18px) scale(1 + f·0.05)`, lerp 0.15 per frame.
- **Orbiting skill tags** (behind the name and copy, z 1): ten pills — Python, PyTorch, React, TypeScript, AWS, C++, Supabase, Next.js, PostgreSQL, TensorFlow. Style 15px/500, padding `9px 16px`, radius 999, background `--glass2`, `1px solid var(--gb)`, **no backdrop-filter** (kept cheap for smoothness).
  - Ellipse centered on the name's bounding box. `rx = min(nameWidth/2 + 230, vw·0.48)`, `ry = nameHeight·0.55·b`, plane rotation `rot = a`.
  - Cursor control (subtle): `a → (mouseX/vw − .5)·2·0.16` rad (≈ ±9°), `b → 0.55 + (mouseY/vh − .5)·0.3`; no cursor: `a=-0.06, b=0.55`. Both lerp at 0.03/frame.
  - Angle advances `0.0035·motion·(1 + surge·4)` rad/frame; item i at `θ = angle + i·2π/10`. Position = rotate((cosθ·rx, sinθ·ry), rot). Depth `z = (sinθ+1)/2`: `scale = 0.72 + z·0.38`, `opacity = 0.28 + z·0.72`, z-index 2 when z>.5 else 0.
  - Entrance: opacity/scale multiplied by `ent = clamp((now − sectionStart − 500)/1400)`.
  - **Legibility guard**: if a pill's center falls inside the (padded 24px x / 12px y) bounding box of the name or any Home text block, its opacity eases (×0.12/frame lerp) toward 12%. Block rects are re-measured at most every 500 ms.
- **Rotating line** (data-st): "Building software that" + a word that cycles every **2.6s** through `learns. → ships. → scales. → predicts.` The words are stacked absolutely: current `translateY(0) opacity 1 blur(0)`, previous `translateY(-1em) opacity 0 blur(8px)`, others `translateY(1em)`; `.8s primary`. The container's width animates to the current word's width (`width .7s primary`). Word text uses the brand gradient clip.
- **Sub-line** (data-st): "Computer Science + Math at UBC, based in Vancouver." `clamp(16px,2.1vh,19px)` `--mut2`.
- **Actions** (data-st): primary pill button "See my work" (17px/500, padding `13px 26px`, `--acc` bg, white, hover `scale(1.04)` .3s) → Work; link "Download résumé ›" in `--acc` (downloads `/resume.pdf` as `Viktor_Blais_Resume.pdf`).

### 2. About
Column, `safe center`, horizontal padding `max(24px, (100vw − 1100px)/2)`, gap `clamp(24px,5vh,56px)`.
- **Statement** (word-by-word reveal): "I like problems that come with data attached. Most of my projects start as a question and end as software people actually use. A model in a notebook is a hypothesis. Shipped, it's a product." Each word is an inline-block span starting at opacity .18. On entering, `prog = clamp((now − sectionStart − 350)/2600)`; word i gets `a = clamp(prog·N·1.15 − i)` → `opacity .18 + .82a`, `translateY((1−a)·6px)`. Reset to .18 when leaving.
- **Three focus cards** (grid `repeat(auto-fit, minmax(min(100%,280px),1fr))`, gap 16). Glass, radius 26, padding 26. Content: small number (13px/500 `--mut`), title (26px/700), body (16px `--mut2`).
  1. 01 · AI & Machine Learning — "From data pipelines to deployed models. I study the architectures, then wire them into real products."
  2. 02 · Mobile apps — "Responsive, intuitive apps with clean UX that hold up on every device. One is live on the App Store."
  3. 03 · Cybersecurity — "Hands-on labs, web vulnerabilities, and writing code that's harder to break."
  - **3D tilt** on hover: `perspective(900px) rotateX(((y/h) − .5)·−8deg) rotateY(((x/w) − .5)·10deg)`, lerp 0.1, eases back to 0 when the cursor leaves.
- **Actions, centered**: "Get in touch" (pill, `--fg` bg / `--bg` text, padding `13px 24px`) → Contact; "Download résumé ›" link.

### 3. Skills
Centered column, gap `clamp(18px,3.4vh,34px)`.
- H2 "The toolkit."
- **Segmented control**: glass pill container (padding 5) with buttons All, Languages, Libraries, Tools, Cloud (15px/500, padding `10px 20px`). A `--fg` pill slides behind the active button (same spring as nav); active text color `--bg`.
- **Skill pills**, wrapped and centered (max-width 960, gap 10): `clamp(17px,min(2vw,2.6vh),26px)`/600/-0.025em, padding `12px 22px`, glass blur 18, hover `--glass2`.
  - Data — Languages: Python, C++, JavaScript, TypeScript, Java, SQL (Postgres), Assembly. Libraries: TensorFlow, Scikit-learn, HuggingFace, Pandas, NumPy, Matplotlib, Seaborn, React, Tailwind CSS. Tools: Git, GitHub, Jupyter, Selenium. Cloud: AWS, Render, Vercel. "All" = all 23 in that order.
  - **Switch animation**: on pick, all pills go out (`translateY(24px) scale(.9) opacity 0 blur(8px)`, delay `i*12ms`); after **380 ms** swap the list; on the next two frames set them in (`translateY(0) scale(1) opacity 1 blur(0)`, delay `i*35ms`). Transitions: `transform .7s cubic-bezier(.2,.9,.25,1.15)`, `opacity .5s`, `filter .5s`.
- Caption 14px `--mut`: "23 tools across 4 categories" or "N in {Category}".

### 4. Work
Two-column grid `repeat(auto-fit, minmax(min(100%,330px),1fr))`, gap `clamp(24px,3.5vw,44px)`, max content width 1240.

**Left — project list** (H2 "Things I've shipped." above). Each row: `border-top:1px solid var(--line)`, padding `clamp(12px,1.9vh,20px) 0`, click selects.
- Title (inactive `--mut`, active `--fg`, color .5s) + kind label on the right (13px `--mut`).
- Active row expands (CSS grid `grid-template-rows: 0fr → 1fr`, .7s primary). Its inner content fades/slides in (`opacity .6s .1s`, `translateY(-10px → 0) .7s .1s`): description (16px `--mut2`), tag pills (12.5px, padding `4px 10px`, glass), links (15.5px `--acc`, "label ›", open in new tab).
- A 2px progress bar under the active row fills linearly over **7000 ms**; at 100% the next project auto-selects (wraps). Clicking resets the timer. The timer only runs while Work is the active section.

Projects (verbatim copy):
1. **Vektor AI** · iOS & Android — "An AI habit coach built around identity. You decide who you're becoming and Vektor nudges you there. Personalized onboarding, multi-provider auth, and push notifications with configurable delivery windows." Tags: React Native, TypeScript, Expo, Supabase. Link: vektorai.app → https://www.vektorai.app/
2. **FolioPrep** · Web app — "A college-prep dashboard for high schoolers. Activities, awards, volunteer hours, test scores and essays, mapped to Common App, UC or Coalition. AI profile review flags strengths, gaps and next steps." Tags: React, AI, Web App. Link: folio-prep.com → https://folio-prep.com/ (no GitHub link — the repo URL is still a placeholder in the codebase).
3. **TaPRO** · AI agent — "An AI teaching assistant for university office hours. Assignments, course materials and conversation summaries live in Supabase, so answers come back fast and in context." Tags: Gemini API, Next.js, Node.js, Supabase. Links: Code → https://github.com/austinluk/ta_pro · Watch demo → https://www.youtube.com/watch?v=Qb1FNeKKBsg
4. **Job Market Tracker** · NLP — "Reads job postings and uses NLP to surface which skills are in demand right now. FastAPI backend, TypeScript dashboard, Postgres on AWS." Tags: NLP, FastAPI, Python, TypeScript, PostgreSQL, AWS. Link: Code → https://github.com/vblais12/job_m_tracker
5. **NHL Predictor** · ML pipeline — "Scraping, feature engineering and model training, all to answer one question before puck drop: who wins tonight?" Tags: Python, Scikit-learn, Pandas. Link: Code → https://github.com/vblais12/NHL_stats_predictor

**Right — demo stage**: glass panel, radius 36, `height: min(600px, 100vh − 210px); min-height: 400px; overflow:hidden`. Five demo layers stacked absolutely; the active one is `opacity 1, translateY 0, scale 1, blur 0`; the others `opacity 0, translateY(±40px) (− above / + below the active index), scale .94, blur(12px)`; `opacity .8s, transform .9s primary, filter .8s`.
- **Vektor — phone mock**: 250×520 phone (padding 10, radius 48, bezel shadow `0 0 0 1px #48484a, 0 50px 100px -30px rgba(80,90,200,.45)`), 88×26 dynamic island. **Scaled to fit**: `scale = min(1, (stageHeight − 50)/534)`. Tilts toward the cursor (`rotateY` up to ±16°, `rotateX` ±10°, lerp .06) and floats (`translateY(sin(t·1.1)·7px)`). Screen content (#0b0b0d, white text): "Tuesday" (13px #86868b), "I am someone who shows up." (23px/700); a 150px progress ring (r 67, stroke 13, track #1c1c1e, gradient stroke, dasharray 421) with the % centered (36px/700) and "of today"; three habit rows (Morning run, Read 20 pages, Deep work) with circular checks. A tick every **1.5 s** cycles phase 0–4: done = min(3, phase) habits checked (check fills `#5eead4`, scale .85→1, label greys to #86868b); ring = `18% + done·27.3%` (dashoffset transition 1.2s primary). On phase 4 a notification slides down from top −90 → 44px (`.7s cubic-bezier(.3,1.3,.5,1)`): app icon (`vektor.jpg`, 30px, radius 8) + "**Vektor** / You said you're a runner. Prove it tonight."
- **FolioPrep — browser window**: `--card` bg, radius 16, title bar 34px with traffic lights and centered "folio-prep.com". Viewport `height: min(360px, 100vh − 330px), min 240px` shows `folioprep.jpg` full-width, slowly panning vertically: `translateY(−(0.5 − 0.5·cos(t·0.4))·overflow)`. A 220px white sheen (`linear-gradient(100deg, transparent, rgba(255,255,255,.5), transparent)`) sweeps across: `translateX(((t·0.35) % 1.6)·1100 − 260 px)`.
- **TaPRO — chat**: header "CPSC 110 · Office hours" / "● TaPRO online" (green). Each time TaPRO becomes active, it replays: at 500 ms the student bubble appears (right, `--acc`, white): "Why does my recursion never hit the base case?"; at 1300 ms a typing indicator (3 dots, staggered pulse); at 2300 ms the answer streams in 2 chars every 24 ms (left, `--card` bubble with `0 0 0 1px var(--line)`): "Look at the call on line 12. You pass solve(n) instead of solve(n - 1), so n never shrinks. Trace n = 3 by hand and you'll see it."
- **Job Market Tracker — re-ranking bars**: title "In-demand skills" (24px/700) + "Week N" (starts 41, +1 per update). Six rows (Python 86, SQL 72, AWS 63, React 55, Docker 47, PyTorch 41). Every **2.4 s** each value random-walks by ±13 (clamped 18–95). Rows are absolutely positioned at `rank·52px` (`top .9s cubic-bezier(.3,1.25,.4,1)`); bar width = value % (`width .9s cubic-bezier(.3,1.2,.4,1)`); rank 1 bar uses the brand gradient, others `--mut`. Row grid: `90px | 1fr | 46px`, 15px.
- **NHL — live win-probability chart** (canvas, 240px tall): label "VAN vs EDM · Win probability", big readout "VAN NN%" (56px/700), period label ("Period 1/2/3" → "Final"). A 120-point random walk (start .5, steps ±.03 biased, jumps ±.12–.14 every 23 points, clamped .06–.94) draws progressively over 8 s, holds, regenerates at 11 s. Grid lines at 25/50/75% in `--line`; line 3px with the brand gradient left→right; area fill `rgba(37,99,235,.22) → 0` vertical; head dot 5px `#2563eb` plus a pulsing halo `12 + sin(t·4)·3` px at 25% alpha. Only drawn while visible.
- Below the grid nothing else; the old "More on GitHub" link isn't in this view.

### 5. Contact
Two-column grid `repeat(auto-fit, minmax(min(100%,400px),1fr))`, gap 56.
- Left (all data-st): H2 "Let's build<br>something."; paragraph "An internship, a collaboration, or just a question. I'll get back to you." (20px `--mut2`); a list of rows with hairline separators (16px, label on the left in `--mut`, value on the right; hover → `--acc` and `padding-left:8px`, .35s): Email viktor.blais.tech@gmail.com (mailto), Phone +1 (707) 364-6441 (tel), Location Vancouver, BC, Elsewhere GitHub › / LinkedIn › (https://github.com/vblais12, https://linkedin.com/in/viktor-blais-a957a2378).
- Right: glass panel (radius 32, padding `clamp(22px,3vw,32px)`) with the form — Name, Email (type email), Message (textarea, 5 rows) — all required; inputs 17px, padding `15px 18px`, radius 16, bg `--glass2`, `1px solid var(--line)`; focus → border `--acc` + `box-shadow: 0 0 0 4px rgba(0,113,227,.15)`. Submit: full-width pill "Send message" (`--acc`, white, 17px/500, padding 16, hover `scale(1.015)`).
- Submit behavior (same as the current site: no backend): show "Sending…" at 60% opacity for 1300 ms, then replace the form with a success state: 64px green circle with ✓, "Message sent." (34px/700), "Thanks for reaching out. I'll get back to you shortly.", and a "Send another ›" link that restores the form. (This replaces the old toast; the toast components can be removed if unused.)

---

## Backgrounds (canvas)

### Aurora (both themes)
- Rendered on a **low-resolution canvas (0.12× device pixels)** stretched to the viewport — the browser's upscaling gives the soft blur for free; do **not** use a CSS blur filter (too expensive).
- Each frame: fill `--bg`; then draw 5 radial gradients (composite `source-over` in light, `lighter` in dark). Base positions (normalized): (.22,.3) (.72,.25) (.55,.72) (.18,.78) (.88,.62), phase `i·1.7`.
- Motion clock `T += (1/60)·motion·(1 + surge·5)`. Section progress `p` eases toward `sectionIndex/4` (lerp .04). Blob i at `x = bx + sin(T·0.21 + ph + p·5)·0.16`, `y = by + cos(T·0.17 + ph·1.3 + p·6)·0.16`. Blob 0 instead follows the cursor (normalized, lerp .025).
- Radius `max(W,H)·(0.36 + 0.06·sin(t·0.5 + i) + surge·0.08)`. Color = palette[(i + sectionIndex) % 5] (so each section shifts the hues), center alpha `d0` (light) / `aa` (dark) → fully transparent at the edge. Canvas opacity 1 in light, 0.75 in dark.

### Stars (dark mode only, `darkFx = "stars"`)
- Full-resolution canvas (DPR capped at 2). 200 stars with random (x, y, depth z, twinkle phase).
- Star x shifts with section progress (`(x − p·z·0.25) mod 1`) and parallaxes `−(mouseX − W/2)·z·0.02`.
- Draw each: radius `0.5 + z·1.2 + n`, alpha `0.12 + z·0.5·tw + n·0.5`, where `tw = .45 + .55·sin(t·(1 + 2z) + phase)` and `n = max(0, 1 − dist(star, cursor)/170)` — stars near the cursor brighten and grow.
- **Constellation lines**: the 6 stars nearest the cursor (within 170px) get a line from the cursor (`rgba(200,215,255, .45·(1 − d/170))`, 1px) and a line chained to the previous-nearest star (alpha .18·(1 − d/170)).
- Clear the canvas when in light mode.

---

## State (suggested React shape)
- `theme: 'light' | 'dark'` (default light; the user may want it persisted to localStorage).
- `section: 0–4`, `prevSection`, plus a ref `sectionStart` (timestamp).
- Home: `risen` (bool), `rotIndex` (2.6s interval).
- Skills: `cat` (selected), `shownCat` (rendered list), `skIn` (bool).
- Work: `active` project 0–4, ref `activeStart`; `tick` (1.5s, Vektor phone); `taStep` 0–4 + `taChars` (chat); `jm` array + `week` (2.4s); NHL series in a ref.
- Contact: `sending`, `sent`.
- One `requestAnimationFrame` loop (a `useEffect` in the page component) drives everything continuous: aurora, stars, logo shimmer, Home orbit/magnetic letters/bubbles, About word reveal + card tilt, Work progress bar/phone tilt/FolioPrep pan/sheen/NHL chart. Write styles straight to refs inside the loop — don't `setState` per frame. Only run a section's loop work while that section is active.
- Global listeners: `mousemove` (store cursor in a ref), `keydown`, `wheel` (passive), `resize` (re-measure the sliding pills + rotating-word width; also re-measure after `document.fonts.ready`).

## Responsive notes
Desktop-first one-screen layout. Under ~720px tall the counter and hint hide and sections scroll internally (`safe center`). Under ~700px wide the Work and Contact grids stack. On touch devices there's no cursor: the orbit sits at its resting tilt, the parallax and magnetic effects stay idle, and tabs and buttons still work. Consider respecting `prefers-reduced-motion` (set motion to ~0.25, skip the ripple and stagger).

## Assets
- `prototype/assets/folioprep.jpg` → already in the repo at `public/projects/folioprep.jpg` (use `/projects/folioprep.jpg`).
- `prototype/assets/vektor.jpg` → already in the repo at `public/projects/vektor.jpg` (Vektor notification icon).
- `prototype/assets/resume.pdf` → already in the repo at `public/resume.pdf` (use `/resume.pdf`, `download="Viktor_Blais_Resume.pdf"`).
- No icon library is needed. Glyphs used: ☾ ☀ ✓ › ← →.
- Fonts: system SF stack plus Google Fonts **Geist** (400–700) as the fallback.

## Implementation map for `Portfolio-website`
- Replace `src/pages/Home.jsx` with a one-screen shell: aurora and stars canvases, nav, counter, hint, and the five section components.
- Rewrite `Navbar.jsx` (glass tabs with the sliding pill and theme toggle), `HeroSection.jsx`, `AboutSection.jsx`, `SkillsSection.jsx`, `ProjectsSection.jsx` (list + stage + 5 demo subcomponents), `ContactSection.jsx`. Remove `Footer.jsx` from the layout; the one-page design has no footer.
- Replace the old teal theme in `src/index.css` with the token variables above (light on `:root`, dark on `[data-theme="dark"]` or `.dark`), and set `html, body { height:100%; overflow:hidden }`. Drop `dot-grid`, `cosmic-button`, etc. if unused.
- Put canvas drawing in small hooks/utilities (`useAurora`, `useStars`, `useWinProbChart`) driven by the shared rAF loop.
- Remove the toast/toaster usage from Contact (inline success state instead).
- Also open in `TODO.txt`: add the JMIT live URL when it exists.

## Files in this bundle
- `README.md` — this document (self-sufficient spec).
- `prototype/Portfolio v4 - One Page.dc.html` + `prototype/support.js` + `prototype/assets/` — the live prototype; open it in a browser.
- `reference/template.html` — the exact markup and inline styles.
- `reference/logic.js` — the exact behavior and animation code to port.
