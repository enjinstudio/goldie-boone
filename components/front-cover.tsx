import type { CSSProperties } from 'react';
import Image from 'next/image';
import ReactDOM from 'react-dom';

import { goldie } from '@/content/artist';
import { wellWater } from '@/content/releases';
import type { Release } from '@/content/types';
import { formatReleaseDate, getReleaseState } from '@/lib/release-state';

/* ===========================================================================
   FRONT COVER, as a die-cut sleeve
   ---------------------------------------------------------------------------
   A cream paper cover with the album title cut out of it, so a photograph
   shows through the letterforms, and a large arched portrait beside it.

   The previous pass was a dark full-bleed photo with cream type over it, which
   is the most common artist-site hero on the internet and threw away the one
   genuinely unusual thing about this artist. brand/goldie.md calls her palette
   ivory, wheat and pale denim, a DAYLIGHT page, and flags that as worth keeping
   rather than overriding for convention. This section is now paper.

   No client JavaScript ships from this file. `react-dom`'s preload is a server
   API here: React hoists the resulting <link> into the document head.
   ========================================================================= */

const FILL_SRC = '/images/hero-fill.jpg';
const PORTRAIT_SRC = '/images/porch-sunset.jpg';

/* ---------------------------------------------------------------------------
   THE DIE-CUT, and why the fallback is written the way it is.

   Verified against the actual file rather than taken on trust. Sampling every
   second pixel of hero-fill.jpg (1600x700, 99KB) and measuring each against
   cream #F4EBDA:

     lightest pixel in the whole image   3.57:1
     99th percentile                     3.68:1
     median                              9.29:1
     darkest                            15.41:1
     pixels below the 3:1 large-text floor   0.000%

   So there is no pixel anywhere in the fill that can land inside a letterform
   and fail. That is the entire reason this technique is safe here, and it is
   why this file must not be swapped for the undarkened photograph or lightened.

   THE FALLBACK. Two independent failure modes, both handled:

   1. Browser does not support background-clip: text. The @supports block below
      carries the background image, the clip AND the transparent colour
      together. Outside it the rule is only `color: var(--color-ink)`. That
      ordering matters: if the background image sat outside the guard, an
      unsupported browser would paint a dark photograph across the whole
      heading box behind solid ink text, which is worse than no effect at all.
      Unsupported browsers get solid warm-ink type on cream paper, 12.6:1.

   2. Browser supports it but hero-fill.jpg has not arrived yet. This is the
      trap the technique is famous for: `color: transparent` with a background
      image still in flight renders an INVISIBLE heading. So the rule also sets
      `background-color: var(--color-ink)`. background-clip applies to the whole
      background, colour included, so the glyphs paint solid ink the moment the
      text lays out and are simply refilled with the photograph when it lands.
      The title is never blank, at any point, in any browser.

   background-size: cover on the h1 box (which spans BOTH lines) so line one
   samples the upper part of the frame and line two the lower part, rather than
   each line repeating the same crop.

   Hairlines: at the sizes actually used, 126px to 224px, Bodoni Moda's thin
   strokes land at roughly 3 to 5 device pixels, wide enough that antialiasing
   will not wash them into the cream. Tracking is left at the specified -0.03em.
   The floor of the clamp (3.2rem) only engages below a 256px viewport.
   --------------------------------------------------------------------------- */
const DIE_CUT_CSS = `
.gb-diecut { color: var(--color-ink); }
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .gb-diecut {
    background-color: var(--color-ink);
    background-image: url('${FILL_SRC}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
`;

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

/** Shared by both buttons: Archivo, uppercase, square corners, 54px tall. */
const BUTTON_TYPE: CSSProperties = {
  paddingInline: '1.6rem',
  fontFamily: 'var(--font-micro)',
  fontWeight: 600,
  fontSize: '0.68rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
};

export function FrontCover() {
  /* The die-cut fill is a CSS background, so it is invisible to the preload
     scanner and would otherwise not be discovered until the stylesheet has
     parsed and the h1 has laid out. React hoists this into <head> as
     <link rel="preload" as="image">, verified in the rendered markup.

     Deliberately NOT fetchPriority high: only one element should claim that,
     and the title already paints without this file thanks to the
     background-color fallback above. See the report.

     This file is not served through next/image, so it ships as the 99KB JPEG
     as authored. Budgeted and accepted. */
  ReactDOM.preload(FILL_SRC, { as: 'image' });

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

  /* Well Water is out and both store URLs exist, so the front cover now sends
     people to the NEW record rather than to HOMEGROWN. This is the swap the
     previous comment here described: during the countdown these two lines read
     `homegrown`, because a button that goes nowhere (or worse, to a search
     page) is a dead end on the most important screen of the site, and the
     record she already had out was the honest thing to offer instead.

     Apple Music leads and is the filled button because it is the primary
     conversion target (build spec, Data section).

     The guards below are unchanged and still do the work: each button renders
     only if its OWN url is non-null, so this cannot ship a dead button. */
  const appleUrl = wellWater.appleMusicUrl;
  const spotifyUrl = wellWater.spotifyAlbumId
    ? `https://open.spotify.com/album/${wellWater.spotifyAlbumId}`
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
      /* Paper. Cream ground, no photograph behind the section, no gradient.
         min-h-svh rather than vh so mobile browser chrome cannot clip it.
         overflow-hidden is a guard only: the title is proven below to fit at
         every width, but it is the one element sized in vw and set nowrap. */
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-cream"
      style={{
        paddingInline: 'clamp(1.25rem, 4vw, 4.5rem)',
        /* Clears the 60px sticky header with room to spare. */
        paddingTop: 'clamp(5rem, 10vh, 7rem)',
        paddingBottom: 'clamp(2rem, 5vh, 4rem)',
      }}
    >
      {/* React 19 hoists this into <head>, deduped by href, verified in the
          rendered markup. It lives here rather than in globals.css because the
          @supports guard belongs to this one heading and cannot be expressed as
          an inline style. */}
      <style
        href="gb-front-cover"
        precedence="medium"
        dangerouslySetInnerHTML={{ __html: DIE_CUT_CSS }}
      />

      <div className="flex w-full flex-col items-start gap-[clamp(2rem,4vh,3rem)] min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-[clamp(1.5rem,3vw,3.5rem)]">
        {/* --- the copy column ------------------------------------------- */}
        <div className="flex w-full flex-col items-start min-[900px]:flex-1">
          {/* --- eyebrow ------------------------------------------------- */}
          {/* .eyebrow already carries --color-gold-text, measured at 5.96:1 on
              cream. Back on the ground that token was tuned for, so unlike the
              dark version of this hero it needs no colour override. */}
          <p
            className="eyebrow flex flex-wrap items-center"
            style={{ columnGap: '0.75em', rowGap: '0.4em' }}
          >
            <span aria-hidden>✦</span>
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
                      opacity: 0.55,
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

          {/* --- the die-cut title --------------------------------------- */}
          {/* Real text in a real h1. Not an SVG, not an image, no aria-label on
              a decorative node: screen readers and crawlers get "Well Water".

              Font size is a CLASS, not an inline style, because it changes at
              the 900px breakpoint and an inline style would beat the media
              query. Two scales on purpose: below 900px the title owns the full
              width; above it the portrait sits alongside and the title shares.

              WATER is the widest line. Its rendered width is measured, not
              guessed: CoreText reports 3.3550em of natural advance in this
              exact font file, and CSS letter-spacing applies to every one of
              the five characters, so -0.03em pulls it to 3.2050em.

                stacked   needs      3.205em x 0.20vw = 0.641V
                          available              V - 8vw padding = 0.92V
                two-col   needs      3.205em x 0.175vw = 0.561V
                          available  0.92V - 0.313V portrait - 0.03V gap = 0.577V

              Both hold, so there is no horizontal overflow at any width. Worked
              at real viewports, title against available room:

                390   250px in 350px      1136  637px in 656px
                900   505px in 520px      1440  808px in 831px
                1024  574px in 591px      1920  872px in 1116px

              NOTE the margin. Stacked has 100px or more to spare, but the
              two-column case runs at a constant 1.6% of the viewport, 14.7px at
              900px. That is the cost of taking the title to 17.5vw against a
              34% portrait, and it is real but it does hold. Do not raise either
              number without re-running this: at 18.5vw they collide at 900px.

              One consequence worth knowing: during the font swap the first
              fallback, Didot, is 3.575em rendered, about 11% wider than Bodoni,
              so between first paint and the font landing the last glyph of
              WATER is clipped between 900 and 1554px. The section's
              overflow-hidden contains it to a cosmetic clip rather than a
              scrollbar, and Bodoni is 22KB and preloaded by next/font, so the
              window is short. The proper fix is a size-adjust fallback in
              app/fonts.ts, which is outside this file.

              letter-spacing and line-height are inline because .display is
              declared unlayered in globals.css and would otherwise win, and
              because React hoists the die-cut stylesheet with no guaranteed
              order against globals.css. Colour is NOT inline, deliberately:
              inline would beat the @supports rule and break the fallback. */}
          <h1
            id="front-cover-title"
            className="gb-diecut display mt-[clamp(0.9rem,1.8vh,1.6rem)] text-[clamp(3.2rem,20vw,14rem)] min-[900px]:text-[clamp(3.2rem,17.5vw,17rem)]"
            style={{
              lineHeight: 0.82,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
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

          {/* --- tagline -------------------------------------------------- */}
          <p
            style={{
              marginTop: 'clamp(1.1rem, 2.4vh, 1.9rem)',
              maxWidth: '40ch',
              color: 'var(--color-ink-70)',
            }}
          >
            {trackWord ? `${trackWord} songs` : 'Songs'} cut live in one room,
            mostly first takes. Raw acoustic country, the way she plays them on
            the porch.
          </p>

          {/* --- the one real action -------------------------------------- */}
          <div
            className="flex flex-col flex-wrap items-stretch sm:flex-row sm:items-center"
            style={{ marginTop: 'clamp(1.5rem, 3vh, 2.4rem)', gap: '0.75rem' }}
          >
            {appleUrl ? (
              <a
                href={appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                /* Ink fill on the paper ground, which is the right way round
                   for a cream hero: 12.6:1, and cream on denim at 6.25:1 on
                   hover. */
                className="inline-flex min-h-[54px] items-center justify-center rounded-none bg-ink text-cream transition-colors duration-200 hover:bg-denim"
                style={BUTTON_TYPE}
              >
                Hear {inProse(wellWater.title)} on Apple Music
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
                aria-label={`Hear ${inProse(wellWater.title)} on Spotify`}
                className="inline-flex min-h-[54px] items-center justify-center rounded-none border border-ink/60 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink/10"
                style={BUTTON_TYPE}
              >
                Spotify
              </a>
            ) : null}
          </div>

          {/* --- quiet links ---------------------------------------------- */}
          <nav
            aria-label="Front cover"
            className="flex flex-wrap items-center"
            style={{ marginTop: 'clamp(0.85rem, 1.8vh, 1.4rem)', columnGap: '1.5rem' }}
          >
            {secondaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                /* 44px minimum in both axes. --color-ink-70 is 7.89:1 on cream.
                   All three links, provenance included, are identical. */
                className="inline-flex min-h-[44px] items-center underline decoration-ink/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-ink"
                style={{
                  fontFamily: 'var(--font-micro)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-70)',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* --- the arched portrait ---------------------------------------- */}
        {/* Keeps the die-cut reading as a window onto a photograph rather than
            as a texture effect: the same frame appears twice, once whole and
            once cut into the type.

            34% of the content column, which is 31% of the viewport once the
            page padding is taken off. The width freed by coming down from 40%
            is spent on the title (17.5vw rather than 14vw), which is what stops
            the composition floating in the middle of a tall viewport. The two
            numbers are coupled: see the collision maths on the h1 above before
            changing either, because the pair now runs at 1.6% clearance.

            isolate confines the .photo-wash multiply blend to the image instead
            of letting it reach the cream ground, and overflow-hidden is what
            actually clips the photograph to the arch. The photo-bg colour
            underneath means the arch is never a blank hole while the image
            decodes. */}
        <div
          className="photo-wash arch relative isolate h-[clamp(18rem,44svh,26rem)] w-full shrink-0 overflow-hidden min-[900px]:h-[clamp(24rem,74svh,50rem)] min-[900px]:w-[34%]"
          style={{ background: 'var(--color-photo-bg)' }}
        >
          <Image
            src={PORTRAIT_SRC}
            alt="Goldie Boone standing on a weathered timber porch at sunset, an open pale denim jacket over a white top, low golden light behind her"
            fill
            sizes="(min-width: 900px) 34vw, 92vw"
            /* Next 16 deprecated `priority` in favour of `preload`. This is the
               largest painted element above the fold on desktop, so it is the
               one element carrying fetchPriority high. See the report. */
            preload
            fetchPriority="high"
            /* She sits high in a 1237x2200 portrait: crown at about 7%, eyeline
               at 20%, neckline at 50%, belt at 68%. The arch box is wider than
               the source aspect either way, so cover crops the height and Y
               chooses the band. Re-checked against the current 34% / 74svh box:

                 desktop 1440x900  box 450x666, 83% of the frame survives,
                                   band 2.0% to 85.1%. Crown lands 6% down the
                                   arch, eyeline 22%, neckline 58%, belt 79%.
                 phone   390x844   box 359x371, 58% survives, band 5.0% to
                                   63.2%. Crown 3% down, eyeline 26%.

               So the desktop arch is now close to a full-length portrait rather
               than a head-and-shoulders crop, which is what the taller 74svh
               box bought. Her whole head stays inside it at both sizes. */
            className="photo-treated object-cover object-[50%_12%]"
          />
        </div>
      </div>
    </section>
  );
}

export default FrontCover;
