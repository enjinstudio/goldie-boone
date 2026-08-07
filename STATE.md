# STATE — goldie-boone — 2026-08-08 08:00 AEST

## Where we are

One-page artist site for Goldie Boone, **live on the custom domain**
https://goldieboonemusic.com (repo https://github.com/enjinstudio/goldie-boone,
Vercel `spockthegreatbots-projects/goldie-boone`, push to `main` auto-deploys).
Clean and pushed at `08bad09`, production `● Ready`.

**Well Water launched 2026-08-07 and the site now sells it.** This session:

- `content/releases.ts` filled: `spotifyAlbumId`, `appleMusicUrl` and all 10
  tracks. That was the whole switch, by design: the release section swaps itself
  from countdown to store buttons off those fields. "Out now" needed no code at
  all, `getReleaseState` derives it from the release date under the hourly
  revalidate.
- Front cover store buttons moved from HOMEGROWN to Well Water (its button TEXT
  said "Hear Homegrown on Apple Music" during the swap; visible label and
  accessible name both moved).
- `back-cover.tsx` became **`tracklist-section.tsx`**, parameterised by
  `release` / `variant` / `ground`. The page renders it twice: Well Water on
  cream, `variant="full"`, owning `#music`; Homegrown on ink, `variant="compact"`,
  at `#homegrown` as the back catalogue.
- The `trackCount` 10 fix, committed 2026-08-04 but never deployed, shipped with
  this. The live page reads "Ten, including the title song".

## Next 3 actions

1. **Run Lighthouse mobile against the live domain.** JS is ~188KB gzipped
   against the spec's 60KB budget (framework floor, zero client components), so
   it needs a real reading before deciding whether it matters. Vada scored 99 on
   a comparable baseline. `npx lighthouse https://goldieboonemusic.com` with and
   without `--preset=desktop`.
2. **Decide whether the ink back-catalogue section stays ink.** It was chosen
   because the inner sleeve below is already wheat and no two adjacent sections
   may share a ground. It works and it measures clean, but it is the first ink
   content section on the page and Tolga has not seen it on a real screen yet,
   only via measurements.
3. **Add Well Water's remaining store links if more land** (YouTube Music,
   Amazon). Only Spotify and Apple exist today, and each store button is gated
   on its own URL so absent ones render nothing.

## Open risks / blockers

- **JS budget fails**: ~188KB vs the handoff's 60KB. Not fixable by writing
  better components; it is the Next 16 App Router + React 19 floor. Needs a
  decision, not a fix.
- **Hero title and portrait width are coupled.** Title 17.5vw, portrait 34%,
  slack ~1.6% of viewport width. At 18.5vw they collide at 900px. Neither moves
  without redoing the measurement (documented in the `h1` comment in
  `components/front-cover.tsx`).
- **The countdown depended on `export const revalidate = 3600` in
  `app/page.tsx`.** It is spent now that the record is out, but the same
  revalidate is what keeps release state honest. Do not "optimise" it away.

## Don't redo

- **Both catalogues are verified.** HOMEGROWN's 10 tracks were resolved
  2026-08-02; Well Water's 10 titles, Spotify IDs and durations were resolved
  live from the Spotify embed payload 2026-08-07 (album
  `3VxCBHRQlpdjQTFZibaT3S`, confirmed 10 tracks with the title track at
  position 1) and cross-written to `~/socialmedia/tools/persona-catalog.md`.
  Do not re-resolve either.
- **The Apple URL is storefront-neutral ON PURPOSE**
  (`music.apple.com/album/well-water/6790127714`). Tolga supplied a `/us/` form;
  the `Release` type forbids it because it pins every visitor to one region.
  Do not "restore" the original.
- **Contrast on the new ink ground is MEASURED, not estimated.** All 18 text
  samples checked in-browser with alpha compositing against each element's own
  background: titles 12.1:1, gold eyebrow 9.32:1, muted numerals and durations
  5.59:1, all past their WCAG AA floor.
- **The compact variant runs two columns from 850px deliberately.** One column
  measured 1191px tall against the full section's 1126px, making the
  subordinate block the taller of the two. Multi-column, not grid, so numbering
  flows 1-5 down then 6-10 down rather than 1,2 across.
- **Verified green at `08bad09`**: tsc, eslint, build, `revalidate 1h` intact.
  390px: no overflow, both lists collapse to one column, every row past the 44px
  tap floor. 1440px: no overflow, zero wrapped track titles (a wrap collapses
  the leader rules), no duplicate element ids with two tracklists on one page.
  Live domain probed for new-content and stale-content markers after deploy.
- **The die-cut contrast is measured.** `hero-fill.jpg` is blended 0.62 toward
  the ink: lightest pixel 3.64:1 against cream, median 9.31:1. Do not lighten it.
- **The gallery layout question is settled**: CSS multi-column masonry, no
  arches, no span grid. Tolga rejected the arches explicitly.
- **Reference-site research is done** (7 sites, source-inspected), folded into
  `DESIGN-SPEC.md` and `LEARNINGS.md`. Do not re-run it.
