# STATE — goldie-boone — 2026-08-02 13:35 AEST

## Where we are

One-page artist site for Goldie Boone, built from scratch this session and
**live in production**: https://goldie-boone.vercel.app (repo
https://github.com/enjinstudio/goldie-boone, Vercel project
`spockthegreatbots-projects/goldie-boone`, push to `main` auto-deploys).
Build, `tsc` and `eslint` all green at `84a847c`; working tree clean and pushed.

The design concept is **"the sleeve"**: the page is a record sleeve read front
to back (front cover, spine, the record, lyric band, back cover, inner sleeve,
about, footer). It replaces the `Goldie Boone Site v4.dc.html` handoff, whose
layout Tolga rejected as flat. That bundle's design tokens, measured contrast
work and accessibility floor were kept; its layout, its catalogue section and
several of its factual claims were not.

## Next 3 actions

1. **Register `goldieboonemusic.com`, add it in Vercel, then set
   `NEXT_PUBLIC_SITE_URL=https://goldieboonemusic.com`** in the project's env.
   `lib/site-url.ts` resolves that var first, so canonical, `og:url`, sitemap,
   robots and every schema.org `@id` all follow with no code change. Until then
   the site correctly self-canonicalises to the vercel.app alias.
2. **Run Lighthouse mobile against the live URL.** JS is 188KB gzipped against
   the spec's 60KB budget (framework baseline, zero client components), so the
   number needs a real-world reading before deciding whether it matters. Vada
   scored 99 on a comparable baseline. Command: `npx lighthouse
   https://goldie-boone.vercel.app --preset=desktop` then again without the
   preset for mobile.
3. **Decide what `/how-these-songs-are-made` is.** It is linked in the footer
   at equal weight (a legal requirement, never style it more quietly) and it
   currently 404s. Either build the route or point `goldie.provenanceHref` in
   `content/artist.ts` at a real destination.

## Open risks / blockers

- **`/how-these-songs-are-made` 404s.** A real 404 on a legally required
  disclosure link. Highest-priority open item.
- **No custom domain.** `goldieboonemusic.com` is not registered. Not blocking,
  the site self-canonicalises, but the entity does not consolidate onto a brand
  domain until it exists.
- **JS budget fails**: 188KB vs the handoff's 60KB. Not fixable by writing
  better components; it is the Next 16 App Router + React 19 floor. Needs a
  decision, not a fix.
- **Well Water has no store URLs and no public tracklist.** `content/releases.ts`
  has `spotifyAlbumId: null`, `appleMusicUrl: null` and `tracks: []` on purpose.
  When the URLs land, fill those three fields and the release section swaps
  itself from countdown to store buttons with no other edit.
- **The countdown depends on `export const revalidate = 3600` in `app/page.tsx`.**
  Remove it and the page freezes at its build date and never flips to "Out now"
  on 7 August. Do not "optimise" it away.
- **Hero title and portrait width are coupled.** Title is 17.5vw, portrait 34%,
  and the slack between them is ~1.6% of viewport width. At 18.5vw they collide
  at 900px. Neither value moves without redoing the measurement (documented in
  the `h1` comment in `components/front-cover.tsx`).

## Don't redo

- **The catalogue is verified.** All 10 HOMEGROWN tracks, their Spotify IDs and
  their durations were resolved live from the Spotify embed payload on
  2026-08-02 and cross-checked against `~/socialmedia/tools/persona-catalog.md`.
  All 10 matched. Do not re-resolve.
- **Every profile and store URL was verified live** (200) on 2026-08-02, and the
  handles came from the Blotato connected-account list, not guessed. Note
  `youtube.com/@goldieboone` is a **404**; the channel is `@GoldieBooneMusic`.
  Instagram and TikTok return 200 for handles that do not exist, so status codes
  alone are not evidence there.
- **The die-cut contrast is measured, not estimated.** `hero-fill.jpg` is blended
  0.62 toward the ink: lightest pixel 3.64:1 against cream (3:1 floor for large
  text), median 9.31:1, 0.00% of pixels below the floor. Independently re-sampled
  and confirmed. Do not lighten that file.
- **Build, tsc and eslint were green at `84a847c`**, and the deployed alias was
  verified serving 200, indexable (no `x-robots-tag`), AVIF from the optimizer,
  warm TTFB ~82ms, correct canonical and a complete JSON-LD graph.
- **The gallery layout question is settled.** A span grid was tried and rejected
  (varied spans cannot tile a rectangle, so it leaves ragged notches that read as
  broken images). It is now CSS multi-column masonry, no arches. Tolga rejected
  the arches explicitly.
- **Reference-site research is done** (7 sites, source-inspected). Findings are
  folded into `DESIGN-SPEC.md` and `LEARNINGS.md`. Do not re-run it.
