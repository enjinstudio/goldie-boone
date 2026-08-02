@AGENTS.md

# goldie-boone

One-page artist site for Goldie Boone. Live: https://goldie-boone.vercel.app
(GitHub `enjinstudio/goldie-boone`, Vercel
`spockthegreatbots-projects/goldie-boone`, push to `main` auto-deploys).

**Read `STATE.md` first**, then `LEARNINGS.md` before any non-trivial change,
then `DESIGN-SPEC.md` for the concept, hard rules, budget and accessibility
floor.

## Read order for anything factual about her

1. `content/releases.ts` and `content/artist.ts` in this repo. Everything there
   was resolved from the live service, not from a brief. Never hardcode a
   track, URL or date in a component.
2. `~/socialmedia/tools/persona-catalog.md` is the cross-project source of
   truth for what she has actually released.
3. `~/socialmedia/brand/goldie.md` is the art-direction canon (palette, the
   pinned identity block, photographic treatment, voice).

## Hard rules, never violate

- **No em dashes anywhere.** Code, comments, copy, commit messages.
- **Never the words "AI" or "generated"** in any visible copy, label, alt text
  or link. Disclosure is structural: it is the `How these songs are made` link,
  worded exactly that way, and it must never be styled more quietly than the
  links beside it. That is a legal requirement.
- **No engagement bait.** No "comment X and I'll send you Y", no "tag a friend",
  no newsletter capture. This cost her sister account its FB recommendation
  eligibility.
- **Never invent a song, lyric, date or biographical fact.** Only the ten tracks
  in `content/releases.ts` exist. Exactly one lyric is cleared: Peach Season,
  "The sweetest things go soft the fastest".
- **Never imply she is a real, verifiable private person.**
- Titles are UPPERCASE only where reproducing album art (the sleeve tracklist).
  Sentence case in all prose.
- Photo sepia stays at or below 0.14. Her honey-blonde must never be pushed
  toward copper; that guard exists in her image-generation negative prompt.
- No parallax, cursor effects, scroll-jacking, hover tilt, or JS animation
  libraries. Default to server components.

## Two things that will break if you "tidy" them

- **`export const revalidate = 3600` in `app/page.tsx`** is the only reason the
  release countdown works. Remove it and the page freezes at its build date and
  never flips to "Out now" on 7 August.
- **`hero-fill.jpg` is deliberately darkened** (0.62 toward the ink). That is
  what makes the die-cut title clear the contrast floor. Do not lighten it or
  swap it for the undarkened photograph.
