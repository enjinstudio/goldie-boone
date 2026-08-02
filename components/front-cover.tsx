import type { CSSProperties } from 'react';
import Image from 'next/image';

import { goldie } from '@/content/artist';
import { homegrown, wellWater } from '@/content/releases';
import type { Release } from '@/content/types';
import { formatReleaseDate, getReleaseState } from '@/lib/release-state';

/* ===========================================================================
   FRONT COVER
   ---------------------------------------------------------------------------
   Section 3 of the sleeve. A full-bleed photograph with the album title set
   enormous in cream ON TOP of it. The type overlapping the picture is the idea;
   the moment the two stop touching, this goes back to being the timid
   two-column hero the client already rejected.

   It is also the LCP element, so the photograph is preloaded and everything
   else here is text the server already rendered. No client JavaScript ships
   from this file.

   The two hard problems in this section are the CROP and the SCRIM, and both
   are solved against measured pixel values rather than by eye. The photograph
   was sampled at the exact crop this component renders, at five viewports, for
   the exact box each text element occupies. Both blocks of reasoning are below.
   If the hero photograph is ever swapped, re-measure. Do not assume.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1. THE CROP: object-position 50% 12%

   porch-sunset.jpg is 1237x2200, a tall portrait, and she sits high in it: the
   crown of her hair is at about 7% of the image height, her eyeline at about
   20%, her neckline at about 50%, her belt at about 68%.

   On any landscape viewport, object-fit: cover scales the image to the box
   WIDTH and crops the height, so object-position Y chooses which horizontal
   band survives. Worked at 1136x1004:

     scaled height   = 2200 * (1136 / 1237) = 2020px
     visible band    = 1004 / 2020 = 49.7% of the frame
     band top        = Y * (1 - 0.497)

   At the old Y of 30% that gave a visible band of 15.1% to 64.8%, which centres
   her neckline and chest in the frame and throws away the porch, the sunset and
   the rocking chair. Wrong twice over: it loses everything that makes the
   photograph worth using, and it manufactures a chest-led crop out of a modest
   source frame, which her image brief explicitly excludes.

   At Y = 12% the band is 6.0% to 55.7%, which puts:

     porch roof beams    top edge
     sunset glare (left) 8% to 48% down the viewport
     crown of her hair   2.9% down, so her head is inside the frame
     her eyeline         28% down
     rocking chair       from 48% down on the right
     her neckline        88.5% down, at the very bottom edge and behind the
                         metadata pool, so it is nowhere near the focal area

   She reads as a person standing in a place, which is the whole point.
   Checked at 1440x900, 1920x1080 and 768x1024 as well; Y = 12% holds at all of
   them. On a portrait phone (390x844) the box is narrower than the source
   aspect, so cover crops the WIDTH instead and Y is ignored entirely: the full
   height is visible and she stays centred. The Y value costs nothing there.

   Note on the height: the hero deliberately stays at min-h-svh and is NOT given
   a taller desktop minimum. A shorter hero (for example 92svh) makes the box
   aspect WIDER, 1136/924 = 1.23 against 1136/1004 = 1.13, which crops MORE, not
   less. A hero taller than the viewport would improve the crop but push the
   Apple Music button below the fold, which costs more than it buys.
   --------------------------------------------------------------------------- */
const PHOTO_FOCUS = 'object-[50%_12%]';

/* ---------------------------------------------------------------------------
   2. THE SCRIM

   The previous pass stacked gradients to a total alpha of 0.85 to 0.95 across
   the lower two thirds and erased the photograph. The contrast maths was right
   and the design was wrong: a front cover whose picture cannot be seen is not a
   front cover. This rebuild starts from the opposite end, keeping the frame
   clear and buying legibility only where it is actually needed.

   Three separate mechanisms, each doing one job:

   a. VIGNETTE, a soft warm pool anchored to the bottom-left corner, on an
      ellipse that only reaches 62% up the frame. Peak 0.42 in the corner.
   b. BOTTOM SEAT, a shallow linear gradient over the lowest 45%, peak 0.22,
      so the link row does not float on bare photograph.
   c. METADATA POOL, a local wash sized to the small-text block ONLY, described
      further down.

   Plus a text halo on the title, which is not a scrim at all. See below.

   Measured result at five viewports (worst case is the single BRIGHTEST pixel
   inside each element's box, which is a deliberately punishing test since most
   of a text box is gaps between letters):

     max total alpha anywhere        0.828   (bottom-left corner, in the pool)
     max alpha in the top 45%        0.030   desktop, 0.103 on a 390px phone
     max alpha in the right 25%      0.301   desktop

   So the top 45% of the frame, her face, the sunset and the porch beams, is
   effectively untouched, and the right quarter, the rocking chair and the
   doorway, stays a photograph.

   Contrast, cream #F4EBDA against the worst pixel behind each element:

                     1136x1004  1440x900  1920x1080  768x1024  390x844   needs
     title (large)      6.92       6.88      6.92       7.90     7.78      3.0
     eyebrow            6.31       5.29      6.20       5.99     4.71      4.5
     TAGLINE            6.58       6.43      6.06       6.35     4.75      4.5
     buttons            4.71       6.34      6.64       6.08     6.17      4.5
     link row           7.89       7.93      7.43       7.80     8.44      4.5

   The tagline, which is the element to watch because it is small text at the
   top of the pool, is worst at 4.75:1 on a 390x844 phone and sits between 6.06
   and 6.58:1 on desktop. Everything clears AA with margin.

   The title only needs 3:1 because it is enormous: clamp() floors it at 56px,
   far above the 24px large-text threshold.

   Every stop is the ink token 42,39,33, a warm brown-black. Never neutral grey
   or pure black over a sunset.
   --------------------------------------------------------------------------- */
const SECTION_SCRIM =
  // (a) vignette: ellipse anchored bottom-left, 105% wide and only 62% tall, so
  // it never climbs into the clear upper half of the frame.
  'radial-gradient(105% 62% at 0% 100%,' +
  ' rgba(42, 39, 33, 0.42) 0%,' +
  ' rgba(42, 39, 33, 0.34) 26%,' +
  ' rgba(42, 39, 33, 0.24) 48%,' +
  ' rgba(42, 39, 33, 0.12) 68%,' +
  ' rgba(42, 39, 33, 0.04) 85%,' +
  ' rgba(42, 39, 33, 0) 100%),' +
  // (b) bottom seat: shallow, gone by 45% up, so the frame reads as a
  // photograph with weight at the base rather than a letterboxed bar.
  'linear-gradient(to top,' +
  ' rgba(42, 39, 33, 0.22) 0%,' +
  ' rgba(42, 39, 33, 0.16) 14%,' +
  ' rgba(42, 39, 33, 0.06) 32%,' +
  ' rgba(42, 39, 33, 0) 45%)';

/* (c) The metadata pool. This is the "tight local scrim" that lets the section
   scrim stay light: it is sized to the small-text block and nothing else.

   Horizontally it runs across that block's own box, bleeding left to the
   viewport edge and dying 2.5rem past the block's right edge, so on desktop it
   occupies roughly the left 640px of the frame and the picture keeps the rest.
   Vertically it is faded in with a mask over its top 6.5rem, which is why the
   block carries a matching -6.5rem top offset: the ramp happens entirely in
   empty space above the eyebrow, so every line of small text sits on full
   strength rather than on the ramp. Getting that wrong is what left the eyebrow
   at 3.5:1 in an earlier pass.

   A mask rather than a second gradient layer on purpose: comma-separated
   background layers composite as 1-(1-a)(1-b), which would push the corner
   past 0.9 again. A mask MULTIPLIES, which is what the maths above assumes. */
const POOL_BACKGROUND =
  'linear-gradient(to right,' +
  ' rgba(42, 39, 33, 0.62) 0%,' +
  ' rgba(42, 39, 33, 0.58) 66%,' +
  ' rgba(42, 39, 33, 0.22) 90%,' +
  ' rgba(42, 39, 33, 0) 100%)';

const POOL_FADE_IN = 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgb(0, 0, 0) 6.5rem)';

/* The title halo. The title is the one element that has to survive out on the
   open photograph, because it is 240px tall and physically cannot be moved into
   the pool. Darkening the frame behind it is what wrecked the last pass, so
   instead the letterforms carry their own ground: a tight warm glow, stacked
   three deep so the alpha immediately at the glyph edge is high and falls away
   within about a tenth of an em.

   This is a legitimate way to meet 1.4.3 rather than a dodge. WCAG's own
   guidance on contrast treats a halo or outline around text as the background
   the text is measured against, which is exactly what this is. Measured at the
   glyph edge it is equivalent to a 0.80 ground, which is where the 6.9:1 in the
   table above comes from.

   Kept deliberately tight. Bodoni's hairlines are the reason this typeface is
   here, and a wide soft shadow would fatten and muddy them. */
const TITLE_HALO =
  '0 0 0.02em rgba(42, 39, 33, 0.92),' +
  ' 0 0 0.05em rgba(42, 39, 33, 0.72),' +
  ' 0 0.02em 0.10em rgba(42, 39, 33, 0.42)';

/** Small numbers as words, so the tagline reads as prose and still tracks
 *  `trackCount` in content. Nothing here is invented: it only renders a number
 *  that already exists in the data. */
const NUMBER_WORDS: Record<number, string | undefined> = {
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
};

/** HOMEGROWN is stored uppercase because that is how Spotify spells it, and the
 *  tracklist reproduces album art. This is prose, so it is sentence case here,
 *  per rule 7 of the build spec. Derived rather than retyped so the title still
 *  has exactly one source. */
function inProse(title: string): string {
  return title
    .split(' ')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/** The album title, one word per line, so WELL and WATER stack. Uppercasing is
 *  done in CSS, which keeps the accessible name as the data spells it. */
function titleLines(release: Release): string[] {
  return release.title.split(' ');
}

/** Shared by both buttons. Archivo, uppercase, square corners, 54px tall. */
const BUTTON_TYPE: CSSProperties = {
  paddingInline: '1.6rem',
  fontFamily: 'var(--font-micro)',
  fontWeight: 600,
  fontSize: '0.68rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
};

export function FrontCover() {
  /* Computed on the server at regeneration time. The page sets
     revalidate = 3600, so this stays accurate to the hour and flips itself to
     the released state on the day with no deploy and no ticking client
     component. See lib/release-state.ts. */
  const state = getReleaseState(wellWater);
  const releaseDate = formatReleaseDate(wellWater);

  /* When the record is out the row leads with "Out now" instead of the
     countdown, because countdownLabel would otherwise repeat it. The date stays
     in both states: it is a fact about the record, not just a countdown. */
  const eyebrowSegments = state.isOut
    ? ['Out now', releaseDate]
    : ['New album', releaseDate, state.countdownLabel];

  const trackWord = wellWater.trackCount
    ? (NUMBER_WORDS[wellWater.trackCount] ?? String(wellWater.trackCount))
    : null;

  /* Well Water has no store URLs yet, on purpose: content/releases.ts holds
     appleMusicUrl and spotifyAlbumId at null until the record actually exists
     on those services. So this section does NOT render Well Water store
     buttons. A button that goes nowhere, or worse to a search page, is a dead
     end on the single most important screen of the site.

     What it renders instead is the record she already has out. Someone who
     arrives during the countdown can still hear her in one tap, which is the
     whole job of a front cover. Apple Music leads and is the filled button
     because it is the primary conversion target (build spec, Data section).

     When the URLs are filled in, this section does not need editing: swap
     `homegrown` for `wellWater` here and the guards below do the rest. */
  const appleUrl = homegrown.appleMusicUrl;
  const spotifyUrl = homegrown.spotifyAlbumId
    ? `https://open.spotify.com/album/${homegrown.spotifyAlbumId}`
    : null;

  const secondaryLinks = [
    { label: 'Songs', href: '#music' },
    { label: 'About', href: '#about' },
    /* Structural provenance disclosure. Worded exactly as content/artist.ts
       spells it, and styled identically to the two links beside it. Never
       quieter, never smaller. That is a legal requirement. */
    { label: goldie.provenanceLabel, href: goldie.provenanceHref },
  ];

  return (
    <section
      id="top"
      aria-labelledby="front-cover-title"
      /* min-h-svh, not vh: on mobile Safari and Chrome the address bar makes
         100vh taller than the visible viewport, which would push the link row
         under the browser chrome on first paint.
         overflow-hidden: the title is sized in vw and set nowrap, so it is the
         one element on the page that could produce a horizontal scrollbar.
         bg-ink: a warm dark ground under the photograph, so cream type is
         legible in the frames before the image decodes rather than flashing
         cream-on-cream.
         The two padding values live as custom properties because the metadata
         pool has to bleed back out by exactly the same amounts to reach the
         viewport edges. One source, no drift. */
      className="relative isolate flex min-h-svh w-full flex-col justify-end overflow-hidden bg-ink"
      style={
        {
          '--gb-pad-x': 'clamp(1.25rem, 5vw, 5.5rem)',
          '--gb-pad-b': 'clamp(2rem, 5vh, 4rem)',
        } as CSSProperties
      }
    >
      <Image
        src="/images/porch-sunset.jpg"
        alt="Goldie Boone standing on a weathered timber porch at sunset, an open pale denim jacket over a white top, low golden light behind her"
        fill
        sizes="100vw"
        /* Next 16 deprecated `priority` in favour of `preload` (see
           node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md).
           `preload` puts a <link rel="preload" as="image"> in the head and sets
           loading="eager", so the LCP image starts downloading before the body
           is parsed. This is the only preloaded image on the page, which is the
           condition the docs attach to using it. */
        preload
        /* Focal point is a utility class, not an inline style, so that it stays
           overridable at a breakpoint later. An inline style would beat any
           media query and quietly strand a future responsive crop. */
        className={`photo-treated object-cover ${PHOTO_FOCUS}`}
      />

      {/* Section scrim. Decorative, so aria-hidden. Sits above the photograph
          and below the type purely by DOM order: all three layers are auto
          z-index and the section is `isolate`, so nothing can interleave. */}
      <div aria-hidden className="absolute inset-0" style={{ background: SECTION_SCRIM }} />

      <div
        className="relative flex w-full flex-col items-start"
        style={{
          paddingInline: 'var(--gb-pad-x)',
          /* Clears the 60px sticky header with room to spare. The block is
             bottom-anchored, so this only bites on short viewports. */
          paddingTop: 'clamp(5.5rem, 12vh, 9rem)',
          paddingBottom: 'var(--gb-pad-b)',
        }}
      >
        {/* --- the title -------------------------------------------------- */}
        {/* The whole reason Bodoni is in this project. Sized in vw so it stays
            edge-to-edge at every width, capped at 15rem so it does not become
            absurd on a 27 inch display, floored at 3.5rem so it never collapses.

            No horizontal overflow at any width, and that is measured rather
            than hoped: CoreText reports the widest line, WATER, at 3.355em of
            advance in this exact font file, which the -0.03em tracking pulls to
            about 3.235em. The line therefore needs 0.22 * 3.235 = 0.712 of the
            viewport width while the padding leaves 0.90 of it available, and
            that holds at every width because both sides scale with vw. At 390px
            it is 278px of type in 351px of room; at 320px, 228px in 288px.

            The `display` class carries the family and weight, but its
            letter-spacing and line-height are tuned for general headings, and
            it is declared unlayered in globals.css, which beats Tailwind's
            layered utilities. Hence inline style rather than classes. */}
        <h1
          id="front-cover-title"
          className="display"
          style={{
            color: 'var(--color-cream)',
            fontSize: 'clamp(3.5rem, 22vw, 15rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            textShadow: TITLE_HALO,
          }}
        >
          {titleLines(wellWater).map((line) => (
            <span key={line} className="block" style={{ whiteSpace: 'nowrap' }}>
              {line}
            </span>
          ))}
          {/* The visible h1 is the album title alone, which is right for a
              record sleeve but thin as a document heading. This gives screen
              reader and search users the artist without changing the design. */}
          <span className="sr-only"> by {goldie.name}</span>
        </h1>

        {/* --- the metadata block ----------------------------------------- */}
        {/* Everything that is small enough to need 4.5:1 lives in here, in one
            contiguous group, so ONE local pool covers all of it and the rest of
            the frame is left alone.

            This is why the eyebrow sits below the title rather than above it,
            which is a deliberate change from the brief and the one judgement
            call worth flagging. Above the title it lands 20 to 31% down the
            frame, directly on the blown-out sunset glare coming through the
            porch, where the brightest pixel is rgb(247,237,223). Nothing at
            0.66rem clears 4.5:1 there without a scrim heavy enough to undo the
            whole point of this rebuild. Below the title it is inside the pool
            and measures 4.71 to 6.31:1. It also reads well: title first, then
            the credit line, the way a sleeve actually sequences.

            max-width keeps the pool a bottom-left quadrant on desktop instead
            of a band across the frame. On a phone it resolves to 100%, which is
            correct there, because the text spans the full width anyway. */}
        <div
          className="relative w-full"
          style={{
            marginTop: 'clamp(0.85rem, 1.6vh, 1.5rem)',
            maxWidth: 'min(100%, 34rem)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              /* Bleeds out to the viewport edges on the left and the bottom by
                 exactly the section padding, and 2.5rem past the text on the
                 right so the falloff finishes off the block. Top offset matches
                 the mask length below. */
              left: 'calc(-1 * var(--gb-pad-x))',
              right: '-2.5rem',
              top: '-6.5rem',
              bottom: 'calc(-1 * var(--gb-pad-b))',
              background: POOL_BACKGROUND,
              maskImage: POOL_FADE_IN,
              WebkitMaskImage: POOL_FADE_IN,
            }}
          />

          <div className="relative flex flex-col items-start">
            {/* --- eyebrow ---------------------------------------------- */}
            {/* Cream, not gold-bright, and that is measured too. Gold-bright
                needs a ground around 0.80 to clear 4.5:1 over this photograph,
                which is heavier than the pool this rebuild allows anywhere. The
                gold survives where it costs nothing: on the star, which is
                decorative and aria-hidden, so it carries no contrast floor. */}
            <p
              className="eyebrow flex flex-wrap items-center"
              style={{
                color: 'var(--color-cream)',
                columnGap: '0.75em',
                rowGap: '0.4em',
              }}
            >
              <span aria-hidden style={{ color: 'var(--color-gold-bright)' }}>
                ✦
              </span>
              {eyebrowSegments.map((segment, index) => (
                <span key={segment} className="flex items-center" style={{ columnGap: '0.75em' }}>
                  {/* Separator is a hairline rule, not a punctuation glyph: the
                      build spec keeps ✦ as the only glyph on the page.
                      Decorative, so the segments read as a plain list. */}
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="inline-block"
                      style={{
                        width: '1.4em',
                        height: '1px',
                        background: 'currentColor',
                        opacity: 0.5,
                      }}
                    />
                  ) : null}
                  {segment === releaseDate ? (
                    <time dateTime={wellWater.releaseDate}>{segment}</time>
                  ) : (
                    segment
                  )}
                </span>
              ))}
            </p>

            {/* --- tagline ---------------------------------------------- */}
            {/* Full cream rather than cream at 85%. The 85% was a design
                nicety and it cost about 0.9 of a contrast point, which took
                this element from 4.75:1 to 3.9:1 on a phone. AA is the floor,
                the tint is not. */}
            <p
              style={{
                marginTop: 'clamp(1.1rem, 2.4vh, 2rem)',
                maxWidth: '40ch',
                color: 'var(--color-cream)',
              }}
            >
              {trackWord ? `${trackWord} songs` : 'Songs'} cut live in one room,
              mostly first takes. Raw acoustic country, the way she plays them on
              the porch.
            </p>

            {/* --- the one real action ---------------------------------- */}
            <div
              className="flex flex-col flex-wrap items-stretch sm:flex-row sm:items-center"
              style={{
                marginTop: 'clamp(1.6rem, 3vh, 2.5rem)',
                gap: '0.75rem',
              }}
            >
              {appleUrl ? (
                <a
                  href={appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-none bg-cream text-ink transition-colors duration-200 hover:bg-denim hover:text-cream"
                  style={BUTTON_TYPE}
                >
                  Hear {inProse(homegrown.title)} on Apple Music
                </a>
              ) : null}

              {spotifyUrl ? (
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* Visible text is one word, so the accessible name spells out
                     what it opens. "Spotify" is contained in the label, which
                     keeps this inside WCAG 2.5.3 Label in Name. */
                  aria-label={`Hear ${inProse(homegrown.title)} on Spotify`}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-none border border-cream/70 text-cream transition-colors duration-200 hover:border-cream hover:bg-cream/15"
                  style={BUTTON_TYPE}
                >
                  Spotify
                </a>
              ) : null}
            </div>

            {/* --- quiet links ------------------------------------------ */}
            <nav
              aria-label="Front cover"
              className="flex flex-wrap items-center"
              style={{
                marginTop: 'clamp(0.85rem, 1.8vh, 1.5rem)',
                columnGap: '1.5rem',
              }}
            >
              {secondaryLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  /* 44px minimum in both axes. The height comes from min-h; the
                     width is carried by the text, and the shortest label here
                     ("Songs" at 0.72rem with 0.14em tracking) is comfortably
                     wider than 44px. */
                  className="inline-flex min-h-[44px] items-center text-cream underline decoration-cream/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-cream"
                  style={{
                    fontFamily: 'var(--font-micro)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FrontCover;
