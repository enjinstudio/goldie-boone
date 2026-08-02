import Image from 'next/image';

import { goldie } from '@/content/artist';
import { wellWater } from '@/content/releases';
import type { Release } from '@/content/types';
import { formatReleaseDate, getReleaseState } from '@/lib/release-state';

/**
 * THE RECORD.
 *
 * Section 5 of the sleeve, on the wheat ground: the album cover with the disc
 * half pulled out of it, and the copy that sells Well Water.
 *
 * The one piece of real logic here is the release-state block at the bottom of
 * the copy column. Both of Well Water's store URLs are null on purpose today,
 * so there is nowhere to send anybody, so this renders a countdown instead of
 * two dead buttons. Fill in `appleMusicUrl` and `spotifyAlbumId` in
 * content/releases.ts and the same block turns into store buttons with no edit
 * here. The middle case (the date has passed but the URLs are still null) is
 * handled too, because that is the state this page would otherwise get stuck
 * in at midnight on release day: it stops counting and points at her artist
 * page instead.
 *
 * The number is computed on the server at regeneration time (the page sets
 * `revalidate = 3600`) so it never ticks and costs zero client JavaScript.
 * There is no 'use client' in this file and there must not be one.
 */

/* Written out rather than digits, because a lone "11" in the middle of a
   sentence reads like a spec sheet. The count still comes from the data. */
const COUNT_WORDS: Record<number, string> = {
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
};

function trackCountLine(release: Release): string | null {
  const count = release.trackCount;
  if (!count) return null;
  return `${COUNT_WORDS[count] ?? String(count)}, including the title song`;
}

/* The disc geometry lives here rather than in globals.css because it is one
   component's business, and because the pull-out needs its own keyframe. The
   `href` + `precedence` pair is React 19's stylesheet hoisting: the block is
   lifted into <head> and deduplicated if this ever renders twice.

   Motion: gated behind BOTH @supports (animation-timeline: view()) and
   prefers-reduced-motion, exactly like gb-rise. The base state is the FINISHED
   state (disc fully out), so a browser with no scroll-driven animation support
   shows the composition as designed and nothing depends on motion running. */
const DISC_CSS = `
.gb-art {
  position: relative;
  width: 100%;
}
.gb-cover {
  position: relative;
  z-index: 2;
  width: 74%;
  aspect-ratio: 1;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(42, 39, 33, 0.30);
}
.gb-disc {
  position: absolute;
  z-index: 1;
  top: 50%;
  /* GEOMETRY, all percentages of the ART COLUMN width, and they are a set:
     changing one without the others either kills the gag or overflows.

       cover  74%              disc  68%   at   31%  ..  99%

     The disc clears the cover's right edge by 25% of the column, which is 37%
     of its own diameter. That is what makes the eye read "circle sliding out
     of a sleeve" rather than a stray crescent, and it is the number that gets
     the rose centre label out past the cover (the label is 32% wide and
     centred, so its right edge sits 34% of the diameter in from the disc's
     edge: anything under a 34% pull-out leaves the label completely hidden).

     The right edge stops at 99%, so the whole pull-out is reserved INSIDE the
     column. Nothing overflows the section at any width, which is why no
     ancestor needs overflow: clip, which is what would silently kill the
     view() timeline below. Box shadows do not contribute to scrollable
     overflow, so the disc's shadow past 99% cannot raise a scrollbar. */
  inset-inline-start: 31%;
  width: 68%;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(0, -50%);
  background: repeating-radial-gradient(circle at 50% 50%, #221F1A 0 1px, #2E2A24 1px 4px);
  box-shadow: 0 18px 34px rgba(42, 39, 33, 0.34);
}
.gb-disc-label,
.gb-disc-hole {
  position: absolute;
  top: 50%;
  inset-inline-start: 50%;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.gb-disc-label {
  width: 32%;
  background: var(--color-rose);
}
.gb-disc-hole {
  /* A true LP spindle. A real 12 inch record's hole is about 2.4% of its
     diameter; 12% was reading as a 45 adapter. */
  width: 3%;
  background: var(--color-wheat);
}
@keyframes gb-disc-pull {
  from {
    transform: translate(-15%, -50%);
  }
  to {
    transform: translate(0, -50%);
  }
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .gb-disc {
      animation: gb-disc-pull linear both;
      animation-timeline: view();
      animation-range: entry 16% cover 52%;
    }
  }
}
`;

export default function TheRecord() {
  const state = getReleaseState(wellWater);
  const releaseDay = formatReleaseDate(wellWater);
  const releaseYear = wellWater.releaseDate.slice(0, 4);
  const releaseLine = `${releaseDay}, ${releaseYear}`;
  const tracks = trackCountLine(wellWater);
  const spotifyUrl = wellWater.spotifyAlbumId
    ? `https://open.spotify.com/album/${wellWater.spotifyAlbumId}`
    : null;

  return (
    <section id="the-record" style={{ background: 'var(--color-wheat)' }}>
      <style href="gb-the-record" precedence="default">
        {DISC_CSS}
      </style>

      <div
        data-rise
        /* The art column is given a little more than half. The pull-out space
           is reserved inside that column, so an even split would have paid for
           the vinyl by shrinking the cover. The copy column stays wide enough
           for the 46ch paragraph. */
        className="mx-auto grid grid-cols-1 items-center gap-y-16 min-[850px]:grid-cols-[1fr_1.08fr] min-[850px]:gap-x-[clamp(36px,5vw,72px)]"
        style={{
          maxWidth: '1160px',
          paddingBlock: 'clamp(56px, 9vw, 120px)',
          paddingInline: 'clamp(20px, 4vw, 44px)',
        }}
      >
        {/* COPY. First in the DOM so the stacked layout reads copy then art. */}
        <div className="grid gap-5">
          <p className="eyebrow">
            <span aria-hidden="true">✦</span> The new record
          </p>

          <h2
            className="display"
            style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.1rem)' }}
          >
            {wellWater.title}
          </h2>

          <p style={{ maxWidth: '46ch', color: 'var(--color-ink-70)' }}>
            She wrote most of it in the eight months after Homegrown, sitting on
            the floor with a borrowed guitar and a notebook. Nothing on it is
            tidied up. You can hear the room, and once or twice you can hear her
            breathe.
          </p>

          <dl
            className="grid"
            style={{
              gridTemplateColumns: 'auto 1fr',
              gap: '12px 28px',
              alignItems: 'baseline',
              borderTop: '1px solid rgba(42, 39, 33, 0.26)',
              paddingTop: '22px',
              marginTop: '6px',
            }}
          >
            <dt className="micro">Release</dt>
            <dd style={{ fontFamily: 'var(--font-body)', fontSize: '1.08rem' }}>
              {releaseLine}
            </dd>

            {tracks ? (
              <>
                <dt className="micro">Tracks</dt>
                <dd
                  style={{ fontFamily: 'var(--font-body)', fontSize: '1.08rem' }}
                >
                  {tracks}
                </dd>
              </>
            ) : null}

            <dt className="micro">Recorded</dt>
            <dd style={{ fontFamily: 'var(--font-body)', fontSize: '1.08rem' }}>
              Live, one room, no click
            </dd>
          </dl>

          <div style={{ marginTop: '10px' }}>
            {state.hasStoreLinks ? (
              /* THE RECORD IS OUT AND THERE IS SOMEWHERE TO SEND PEOPLE.
                 Apple Music is first and is the solid one: it is the primary
                 conversion target, per the build spec. Each button is gated on
                 its OWN url, because hasStoreLinks only promises that at least
                 one of the two exists. */
              <div className="flex flex-wrap gap-3">
                {wellWater.appleMusicUrl ? (
                  <a
                    href={wellWater.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-ink text-cream hover:bg-denim inline-flex items-center justify-center transition-colors"
                    style={{
                      minHeight: '54px',
                      borderRadius: 0,
                      paddingInline: '28px',
                      fontFamily: 'var(--font-micro)',
                      fontWeight: 500,
                      fontSize: '0.78rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Own it on Apple Music
                  </a>
                ) : null}

                {spotifyUrl ? (
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:border-denim hover:text-denim inline-flex items-center justify-center border border-[rgba(42,39,33,0.42)] transition-colors"
                    style={{
                      minHeight: '54px',
                      borderRadius: 0,
                      paddingInline: '28px',
                      fontFamily: 'var(--font-micro)',
                      fontWeight: 500,
                      fontSize: '0.78rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Spotify
                  </a>
                ) : null}
              </div>
            ) : state.isOut ? (
              /* THE DATE HAS PASSED BUT THE URLS ARE STILL NULL.
                 Do not render a button that goes nowhere, and do not keep
                 counting down to a day that already happened. */
              <div className="grid justify-items-start gap-2">
                <p style={{ maxWidth: '46ch', color: 'var(--color-ink-70)' }}>
                  It&apos;s out. The album links aren&apos;t up yet, so her
                  artist page is the best place to find it.
                </p>
                <a
                  href={goldie.profiles.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-denim inline-flex items-center transition-colors"
                  style={{
                    minHeight: '44px',
                    color: 'var(--color-gold-text)',
                    fontFamily: 'var(--font-body)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  Her Apple Music page
                </a>
              </div>
            ) : (
              /* NOT OUT YET, WHICH IS TODAY'S STATE.
                 A date stamped on the sleeve, not a marketing timer: an ink
                 rule box, Bodoni for the number, no accent colour, no tick.
                 The word "days" carries the meaning, not the size. */
              <p
                className="inline-flex flex-col"
                style={{
                  border: '1px solid rgba(42, 39, 33, 0.30)',
                  padding: '18px 26px 16px',
                  gap: '6px',
                }}
              >
                <span className="micro">Out in</span>
                <span className="flex items-baseline" style={{ gap: '12px' }}>
                  <span
                    className="display"
                    style={{ fontSize: 'clamp(3rem, 7vw, 4.4rem)' }}
                  >
                    {state.daysRemaining}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.08rem',
                      color: 'var(--color-ink-70)',
                    }}
                  >
                    {state.daysRemaining === 1 ? 'day' : 'days'}
                  </span>
                </span>
                <span className="micro">{releaseLine}</span>
              </p>
            )}
          </div>
        </div>

        {/* ART. The cover, and the disc sliding out from behind it.
            The pull-out space is reserved INSIDE this column (cover 84%, disc
            reaching 98%) so nothing ever overflows the section and no
            horizontal scrollbar is possible at any width. */}
        <div className="gb-art">
          <div className="gb-disc" aria-hidden="true">
            <span className="gb-disc-label" />
            <span className="gb-disc-hole" />
          </div>

          <div className="gb-cover">
            <Image
              src={wellWater.coverArt}
              alt={wellWater.coverAlt}
              fill
              sizes="(max-width: 850px) 72vw, 400px"
              className="photo-treated"
              /* NO object-position. The asset is a pre-composed 1400x1400
                 square going into a square box, so there is nothing left to
                 crop and centre is correct. Any other value re-crops a crop
                 and cuts the pump, the bucket or the field back out of it. */
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
