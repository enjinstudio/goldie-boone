# Goldie Boone site, build spec

One page. Next.js 16 App Router, React 19, Tailwind v4, TypeScript. Static
output with `revalidate = 3600`. Deployed on Vercel.

## The concept: The Sleeve

The page **is** a record sleeve, read front to back. Front cover, spine, the
record, back cover, inner sleeve. Every section looks different from the one
above it because it is a different part of a physical object.

This replaces an earlier design (v4, in the handoff bundle) that was a
competent but flat centred-column layout. Its tokens, contrast measurements and
accessibility work are kept. Its layout is not. What was wrong with it:

- It shrank the photography to obey a "portraits used sparingly" rule that its
  own asset pack could not satisfy. All 14 photographs are portraits of her.
- Nothing ever reached the edge of the viewport. Every section was
  `max-width: 1160px`, centred, identical padding.
- Display type peaked at 6.6rem inside a half-width column, so Bodoni's whole
  reason for existing (extreme thick/thin contrast at scale) never showed up.
- No texture on a design concept whose entire premise is a printed paper object.
- Zero overlap between any two elements.

## Section order

| # | Sleeve part | Component | Ground |
|---|---|---|---|
| 1 | Sticky header | `site-header.tsx` | cream, 94% + blur |
| 2 | Side rail (desktop only) | `side-rail.tsx` | ink |
| 3 | **Front cover** | `front-cover.tsx` | full-bleed photo |
| 4 | **Spine** | `marquee.tsx` | ink |
| 5 | **The record** | `the-record.tsx` | wheat |
| 6 | **Lyric band** | `lyric-band.tsx` | full-bleed photo |
| 7 | **Back cover**, Well Water tracklist | `tracklist-section.tsx` | cream |
| 8 | **Back catalogue**, Homegrown tracklist | `tracklist-section.tsx` | ink |
| 9 | **Inner sleeve** | `inner-sleeve.tsx` | wheat |
| 10 | About | `about.tsx` | cream |
| 11 | Footer | `site-footer.tsx` | ink |

Sections 7 and 8 are the SAME component with different props: `variant`
(`full` carries the cover art, a big title and labelled Side A / Side B;
`compact` drops the art, shrinks the title and runs one unlabelled two-column
list) and `ground` (which selects a colour theme, including the inverted
cream-on-ink set). The back cover owns `#music`, because the header nav's
"Music" link must land on the current record, not the back catalogue.

Section 8 is ink rather than wheat only because section 9 is already wheat and
no two adjacent sections may share a ground. Measured on the ink set: title and
track titles 12.1:1, gold eyebrow 9.32:1, muted numerals and durations 5.59:1,
every one past its WCAG AA floor. The compact list runs two columns from 850px
up, not one: a single column measured 1191px tall against the full-weight
section's 1126px, so the subordinate block was the taller of the two.

## Hard rules, never violate

1. **No em dashes.** Anywhere. Not in copy, comments, or commit messages.
   Commas, colons, parentheses or sentence breaks.
2. **Never the words "AI" or "generated"** in visible copy, alt text, labels or
   link text. Disclosure is structural: it is the `How these songs are made`
   link, worded exactly that way, styled at exactly the same weight and colour
   as the links beside it. That is a legal requirement, not a preference.
3. **No engagement bait.** No "comment X and I'll send you Y", no "tag a
   friend", no "drop a heart", no "share this", no newsletter capture. This
   already cost this artist's sister account its recommendation eligibility.
4. **Never invent a song title, lyric, date or biographical fact.** Only the
   ten tracks in `content/releases.ts` exist. Exactly one lyric is cleared for
   use: Peach Season, "The sweetest things go soft the fastest".
5. **Never imply she is a real, verifiable private person.**
6. **No parallax, no cursor effects, no scroll-jacking, no hover tilt, no
   scroll snap that fights touch.** No JS animation libraries.
7. Titles are UPPERCASE only where reproducing album art (the tracklist).
   Sentence case in all prose.

## Accessibility floor

- Body copy never below 17px. Micro-labels never below `0.62rem`.
- Tap targets never below 44px in both axes.
- `:focus-visible` on every interactive element. It is set globally in
  `globals.css`. Never override it, never set `outline: none`.
- Contrast clears WCAG AA **with margin**. `--gold-text` and `--ink-55` are
  tuned per-background; if you put them on a new ground, re-measure.
- Semantic landmarks. `aria-label` on each distinct `<nav>`. Decorative layers
  (scrims, washes, star glyphs, the vinyl, rules, the marquee) are `aria-hidden`.
- No information carried by colour alone.

## Performance budget, treated as pass or fail

| Metric | Ceiling |
|---|---|
| LCP on throttled 4G | 2.0s |
| Total JS, gzipped | 60KB |
| Above-the-fold payload | 400KB |
| CLS | 0.05 |

Practical consequences:

- **Default to server components.** Only add `'use client'` if there is no
  other way, and say why in a comment.
- The front cover photo is the LCP element: `priority`, correct `sizes`, and an
  explicit aspect ratio.
- Every image needs explicit dimensions or `aspect-ratio` so CLS stays at zero.
- **`loading="lazy"` is not a deferral strategy.** Chrome's lazy threshold is
  generous on throttled connections and fetches below-fold images anyway. On a
  sister project this produced 17 image requests and 411KB on first paint for a
  17KB LCP element, scoring LCP 10.6s. If something genuinely must not load
  until approached, mount it with an IntersectionObserver, one per SECTION and
  not one per image.
- No third-party embeds in v1. A Spotify iframe is 662KB of JavaScript.

## Available CSS utilities (already in `globals.css`)

`.grain` (put on `<body>`), `.photo-treated`, `.photo-wash`, `.arch`,
`.eyebrow`, `.micro`, `.display`, `.marquee-track`, `.reel-scroller`,
`[data-rise]` for scroll reveal.

Colour tokens are Tailwind v4 theme colours: `bg-cream`, `text-ink-70`,
`border-gold-rule`, etc. See the `@theme` block.

## Typography

- Display: Bodoni Moda via `--font-display`. **opsz is baked in at 96**, so do
  not set `font-variation-settings` for it. Tracking tightens as size grows.
- Body: Newsreader via `--font-body`, 18px / 1.62.
- Micro-labels: Archivo via `--font-micro`, uppercase, tracked.
- The only glyph in use is `✦` (U+2726), set as text, always `aria-hidden`.
- **Fluid sizing uses per-property `clamp()`.** Never set a viewport-relative
  root `font-size`: it silently overrides the reader's own browser text-size
  setting, which matters a lot for a 40 to 65 audience on Android.

## Voice

Warm, plainspoken, small-town, contractions, the occasional "y'all". Sentence
case for interface copy. Never salesy, never snarky, never boastful, never an
exclamation stack. Good: "Have a listen", "The whole record", "Come sit a
while". Wrong: "Stream now!!", "Don't miss out".

## Data

Everything comes from `content/`. Never hardcode a track, a URL or a date in a
component.

- `content/releases.ts`: `homegrown` (10 real tracks, real Spotify IDs, real
  durations, real Apple Music URL) and `wellWater` (unreleased, **both store
  URLs are null and `tracks` is empty on purpose**).
- `content/artist.ts`: verified profile URLs and the provenance link.
- `lib/release-state.ts`: `getReleaseState(release)` returns `isOut`,
  `daysRemaining`, `hasStoreLinks`, `countdownLabel`.
- `lib/duration.ts`: `formatDuration`, `toIsoDuration`, `totalRuntime`.

**Apple Music always comes first** in any list of stores, and is always the
visually stronger option. That is the primary conversion target.

## Images

In `/public/images`. Filenames describe what is actually in each frame, which
is **not** always what the old handoff's asset table claimed. Trust the
filename.

`porch-sunset` (hero, 1237x2200), `well-water-cover` (16:9),
`homegrown-cover` (real 640x640 album art), `homegrown-barn`, `peach-orchard`,
`porch-steps-white`, `kitchen-coffee`, `main-street-dusk`,
`porch-rail-pasture`, `meadow-wildflowers`, `guitar-lamp`, `mic-porch`,
`clapboard-wall`, `county-fair-dusk`, `porch-rail-square`.

Every one is a portrait of her. Do not write alt text pretending otherwise.
