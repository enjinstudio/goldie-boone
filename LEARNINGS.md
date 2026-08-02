# LEARNINGS — goldie-boone

History and gotchas. Read before any non-trivial change.

## What has worked

### Resolving facts from the streaming service, not the brief

Every track title, Spotify ID and duration came from the Spotify **embed**
payload (`open.spotify.com/embed/album/<id>`, `__NEXT_DATA__` script), then was
cross-checked against `~/socialmedia/tools/persona-catalog.md`. All ten matched.

This caught the single biggest error in the design handoff: it claimed
"one album, six singles" and presented PEACH SEASON, SUNDAY DRESS, MAMA KNEW,
THE WHOLE TOWN KNOWS, EIGHTEEN ACRES and GROW BACK GOLD as standalone singles.
They are tracks 2, 3, 4, 5, 9 and 10 of HOMEGROWN, and the brief silently
dropped DOING FINE, HEART ON THE LINE and STILL SETS TWO PLATES. Since one of
the page's stated jobs is "look credible to press and labels", a fabricated
discography was the exact own-goal to avoid.

Also worth knowing: the album page itself returns no JSON without JS, and the
oembed endpoint has no durations. The embed route is the one that works.

### Solving for a contrast value instead of picking one

The hero fills its display type with a photograph via `background-clip: text`.
Type filled with an image normally has no measurable contrast at all, which
makes it an accessibility gamble.

Instead the fill image was pre-darkened and the blend was **solved for**: sample
every pixel, compute luminance against the cream ground, and pick the lowest
blend that puts the *lightest* pixel over the floor. At 0.62 toward the warm
ink the worst pixel measures 3.64:1 against a 3:1 large-text floor, median
9.31:1, with 0.00% of pixels failing. Undarkened it measured 2.70:1 and failed.

The technique generalises: when an effect makes contrast unmeasurable in CSS,
move the guarantee into the asset and measure it there.

### Instancing and subsetting variable fonts

416KB → 128KB with every weight axis intact:

| | before | after | how |
|---|---|---|---|
| Bodoni Moda | 45KB | 22KB | `opsz` pinned 96, latin subset |
| Bodoni italic | 52KB | 26KB | same |
| Newsreader | 128KB | 48KB | `opsz` pinned 18, latin subset |
| Archivo | 34KB | 27KB | latin subset |

`fontTools.varLib.instancer` pins an axis, `fontTools.subset` cuts the glyph
set. Newsreader's latin subset is genuinely 128KB because it carries two axes.
Pin the axis you do not vary and it collapses.

**The didone detail that matters:** Bodoni Moda's `opsz` axis spans 6..96. Set
at display size using the *text* optical master, the thick/thin contrast
collapses and it stops looking like Bodoni. Pinning `opsz` to 96 is what makes
the big type read correctly, and it costs nothing.

### Verifying handles against the account list, not the artist name

Every profile URL in the handoff was `href="#"`. The real handles came from the
Blotato connected-account list. `youtube.com/@goldieboone` is a **404**; the
channel is `@GoldieBooneMusic`.

**Instagram and TikTok return HTTP 200 for handles that do not exist**, so a
status code is not evidence there. Only YouTube gives a usable signal.

## What has failed

### 2026-08-02 — a scrim strong enough for the type erased the photograph

First hero build stacked two gradients summing to 0.85-0.95 alpha across the
lower two thirds of the frame. Every contrast number passed. Rendered, the hero
was a flat dark rectangle: the photograph loaded fine (`complete: true`,
`naturalWidth: 1023`) and was completely invisible.

The failure is optimising one constraint in isolation. The type was legible and
the image was gone, on a section whose entire job is showing the image.

Tell: hiding the scrim in the DOM reveals the photo instantly. Fix was three
targeted mechanisms (a corner vignette, a shallow bottom seat, and a pool sized
to the small-text block only) instead of one blanket wash, taking the top 45% of
the frame to ≤0.03 alpha.

### 2026-08-02 — a span grid cannot tile a rectangle

The gallery was first built as a six-column grid with hand-placed tiles of
varying row and column spans. It was correct by construction (verified: no
overlaps, no interior holes) and Tolga's reaction was "insanely broken".

Varied spans cannot tile a rectangle exactly, so the block is ragged at its top
and bottom edges. Against a solid ground those notches do not read as
composition, they read as images that failed to load.

CSS multi-column cannot produce that failure: each column is an independent
stack, so there are no cells and nothing can be left empty. The tradeoff is that
visual order is not DOM order, which is acceptable **only** where order carries
no meaning (here: eleven photographs, no captions, no numbering).

### 2026-08-02 — mixing two silhouettes in one grid

Second gallery version arched three of eleven frames. Rejected immediately:
"some has arc and it doesnt look good". Eleven frames in a grid have to agree
with each other. The arch motif still works on the hero and the About portrait,
where it is the only shape in the section and so reads as deliberate.

Rule: a motif used on *some* items in a set reads as inconsistency; the same
motif used as the *only* shape in a section reads as art direction.

### 2026-08-02 — a canonical pointing at a domain that does not exist

First production deploy shipped `rel=canonical`, `og:url`, the sitemap and every
schema.org `@id` pointing at `https://goldieboonemusic.com`, which is not
registered. A canonical aimed at a non-resolving domain tells search engines the
live page is a duplicate of nothing, which **suppresses** the URL that is
actually serving rather than consolidating it.

Fixed with `lib/site-url.ts`: `NEXT_PUBLIC_SITE_URL` → Vercel production alias →
localhost. Deliberately **not** `VERCEL_URL`, which is the per-deployment
hostname and changes every deploy, so canonicalising to it would point each
build at a different URL and split the entity.

### 2026-08-02 — Vercel gates new team projects behind SSO

A fresh Vercel project has `ssoProtection: all_except_custom_domains` on by
default. Every route 302s to `vercel.com/sso-api` **and the deployment serves
`x-robots-tag: noindex`**, which silently nullifies all SEO work.

Two things worth knowing:
- Disabling it is a per-project PATCH to `/v9/projects/<projectId>`, so it can
  be scoped to one project without touching the other 19 in the team.
- Vercel stamps `x-robots-tag: noindex` on **deployment URLs** regardless. Only
  the production alias (`<project>.vercel.app`) or a custom domain is
  indexable. Verify SEO headers against the alias, never the deployment URL.

### 2026-08-02 — Next 16 rejects a non-RGBA .ico

`app/favicon.ico` written by PIL from an RGB source fails the build outright:
`Format error decoding Ico: The PNG is not in RGBA format!`. Convert to RGBA
before saving.

### 2026-08-02 — headless Chrome clamps window width

A subagent checking mobile overflow found an apparent horizontal-overflow bug at
390px that did not exist: **headless Chrome on macOS silently clamps
`--window-size` to roughly 500px minimum**, so the screenshot was a 500px layout
cropped to a 390px image. Check narrow layouts inside an iframe with a live
`documentElement.scrollWidth` readout, not by window size.

### 2026-08-02 — the local port was not ours

`python3 -m http.server 8899` reported success while `localhost:8899` served a
completely unrelated Drupal site already bound there. Same class as the
port-3000 incident in vada-hollis. Check the port is free first, and verify what
is actually served rather than trusting the server log.

## Reference-site research, 2026-08-02

Seven sites were source-inspected (raw CSS/JS, not rendered summaries). Full
findings are in `DESIGN-SPEC.md`. The load-bearing conclusions:

- **All seven blow a 60KB JS budget by 3-5x.** capitaltworld is a Next.js artist
  site shipping 213KB behind a blocking preloader; xanvierallison force-loads 37
  images before revealing the page. Steal the visual moves, none of the machinery.
- **The highest craft-per-byte item is a grain overlay**: one element, one rule.
  Use inline SVG `feTurbulence` (a few hundred bytes), not the 105KB texture JPEG
  the reference ships. And `multiply` with light noise, not `screen` — their
  texture is a dark-field film-dust scan, which is why `screen` is right for them
  and wrong for a cream ground.
- **`font-size` in `vw` plus `white-space: nowrap`** is the actual mechanism
  behind headline type that feels art-directed at every viewport.
- **Do not use a viewport-relative root `font-size`** (utopia-orchestra's
  `html{font-size:.07813vw}`). It silently overrides the reader's browser
  text-size setting, which matters a great deal for a 40-65 audience on Android.
  Per-property `clamp()` gives the same fluidity without it.
- A first-pass WebFetch **hallucinated detail** on two of three sites in one
  batch. Claims survived only where they were checked against shipped source.

## Open issues

- `/how-these-songs-are-made` is linked at equal weight in the footer (a legal
  requirement) and 404s.
- JS is 188KB gzipped against the handoff's 60KB. Framework baseline, zero
  client components. Needs a decision, not a fix.
- `goldieboonemusic.com` is not registered.
- Vercel reports the install command as yarn/pnpm/npm/bun rather than pinning
  npm despite `package-lock.json` being present. Same drift noted in
  vada-hollis. Not currently causing a problem.
