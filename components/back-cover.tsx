import Image from 'next/image';
import { homegrown } from '@/content/releases';
import type { Track } from '@/content/types';
import { formatDuration, toIsoDuration, totalRuntime } from '@/lib/duration';

/**
 * BACK COVER: the HOMEGROWN tracklist, set the way a real sleeve sets it.
 *
 * Server component on purpose. Nothing here needs state, and the scroll reveal
 * is the CSS-only `[data-rise]` view() timeline from globals.css.
 *
 * The device that makes this read as a sleeve rather than a settings screen is
 * the leader rule: numeral, title, then a dotted hairline running across to a
 * right-aligned duration. It fills the horizontal gap instead of leaving one.
 * No thumbnails, and no per-row pair of text links: the row IS the link, so a
 * track is one 44px target rather than two small ones.
 *
 * LAYOUT NOTE, because it is not the obvious arrangement. The cover art is
 * paired with the header block at the top rather than sitting in a third column
 * beside Side A and Side B. Bodoni caps are wide: "THE WHOLE TOWN KNOWS" is
 * 12.5em, which at the 1.5rem title ceiling is 300px of title before the
 * numeral, the leader and the duration. Art in its own column leaves each side
 * about 383px at 1440px wide, so the longest titles wrap and every leader rule
 * collapses. Paired with the header instead, the two sides get the full measure
 * (366px at the 850px breakpoint, 620px at 1440px) and every row stays on one
 * line at every width. The art still anchors the composition, and it hangs 1.5rem
 * lower than the copy column so the two blocks lock rather than sit in a row.
 *
 * The store row lives in the header column, bottom-aligned to the cover, not
 * under the tracklist. Two reasons. At the foot of the section the primary
 * conversion target sat roughly 800px below the fold. And the copy column is
 * shorter than a 432px square, so without something in it the composition
 * carried about 200px of dead cream: the same flatness this section replaced,
 * only rotated. One store row, one place, sitting on the cover's bottom edge.
 *
 * Cover art and its alt text both come from content/releases.ts. That file is
 * 640x640 and it is the only artwork that exists, so no fixed `sizes` entry may
 * claim more than 640px. Asking for more only upscales.
 */

/** The album-cover drop shadow, per the design spec. */
const COVER_SHADOW = '0 24px 48px rgba(42,39,33,0.30)';

/**
 * Titles are stored UPPERCASE because that is how Spotify spells them, and the
 * tracklist reproduces album art so it renders as stored. The h2 is prose, so
 * it takes sentence case. Derived rather than retyped, so the album title keeps
 * exactly one source of truth.
 */
function sentenceCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function TrackRow({ track, number }: { track: Track; number: number }) {
  return (
    <li data-rise>
      {/* py is 0.95rem rather than a scale step on purpose. `.display` sets
          line-height 0.9 and lives outside Tailwind's @layer utilities, so a
          `leading-*` class cannot override it, and at the smallest title size
          the natural row lands at 39px. Padding is what carries the row past
          the 44px tap-target floor. min-h-11 is the belt to that braces. */}
      <a
        href={`https://open.spotify.com/track/${track.spotifyTrackId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group -mx-2 flex min-h-11 items-baseline gap-3 px-2 py-[0.95rem] transition-colors duration-200 hover:bg-[rgba(42,39,33,0.04)]"
      >
        <span
          aria-hidden="true"
          className="w-7 shrink-0 font-micro text-[0.86rem] leading-none tracking-[0.1em] text-ink-55 tabular-nums transition-colors duration-200 group-hover:text-gold-rule"
        >
          {String(number).padStart(2, '0')}
        </span>

        <span className="display text-[clamp(1.05rem,2.2vw,1.5rem)] text-ink transition-colors duration-200 group-hover:text-gold-rule">
          {track.title}
        </span>

        {/* The leader. It is an empty flex item, so its synthesized baseline is
            its bottom margin edge: the margin-bottom is what lifts the rule off
            the shared text baseline to sit through the title's x-height. */}
        <span
          aria-hidden="true"
          className="mb-[0.34em] flex-1 border-b border-dotted border-[rgba(42,39,33,0.26)] transition-colors duration-200 group-hover:border-[rgba(42,39,33,0.6)]"
        />

        <span className="sr-only">, duration </span>
        <time
          dateTime={toIsoDuration(track.durationMs)}
          className="w-10 shrink-0 text-right font-micro text-[0.78rem] leading-none tracking-[0.04em] text-ink-55 tabular-nums"
        >
          {formatDuration(track.durationMs)}
        </time>
        <span className="sr-only">, on Spotify</span>
      </a>
    </li>
  );
}

function Side({
  label,
  slug,
  tracks,
  startNumber,
}: {
  label: string;
  slug: string;
  tracks: Track[];
  startNumber: number;
}) {
  const headingId = `homegrown-side-${slug}`;

  return (
    <div>
      {/* `.micro` is unlayered CSS, so it beats Tailwind's @layer utilities in
          the cascade and a `text-*` class here would silently do nothing. The
          size and colour bump goes inline. Typography only, never layout. */}
      <h3
        id={headingId}
        className="micro border-b pb-2"
        style={{
          fontSize: '0.72rem',
          color: 'var(--color-gold-text)',
          borderColor: 'rgba(138,106,34,0.4)',
        }}
      >
        {label}
      </h3>
      <ol aria-labelledby={headingId} start={startNumber} className="mt-1">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.spotifyTrackId}
            track={track}
            number={startNumber + index}
          />
        ))}
      </ol>
    </div>
  );
}

/**
 * Apple Music is always first and always the stronger of the two: it is the
 * primary conversion target. Each renders only when its URL exists, so an
 * unreleased record degrades to nothing rather than to a dead link.
 *
 * `mt-auto` is what bottom-aligns this to the cover art in the two-column
 * layout. Below that breakpoint there is no free space to absorb, the auto
 * margin resolves to zero, and the padding carries the spacing instead.
 */
function StoreRow() {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-3 pt-[clamp(2rem,4vw,3rem)] sm:gap-4">
      {homegrown.appleMusicUrl ? (
        <a
          href={homegrown.appleMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center bg-ink px-7 py-3 font-micro text-[0.78rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors duration-200 hover:bg-ink-70"
        >
          Own it on Apple Music
        </a>
      ) : null}

      {homegrown.spotifyAlbumId ? (
        <a
          href={`https://open.spotify.com/album/${homegrown.spotifyAlbumId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-ink px-7 py-3 font-micro text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-ink hover:text-cream"
        >
          Spotify
        </a>
      ) : null}
    </div>
  );
}

export function BackCover() {
  const half = Math.ceil(homegrown.tracks.length / 2);
  const sideA = homegrown.tracks.slice(0, half);
  const sideB = homegrown.tracks.slice(half);

  return (
    <section
      id="music"
      aria-labelledby="homegrown-title"
      className="bg-cream py-[clamp(4.5rem,10vw,8.5rem)]"
    >
      <div className="mx-auto w-full max-w-[1440px] pl-[clamp(1.25rem,6vw,7rem)] pr-[clamp(1.25rem,4vw,3.5rem)]">
        {/* Header block, with the cover art alongside it from 1000px up. DOM
            order matches visual order in both layouts, so there is no reading
            order mismatch to reason about. */}
        <div className="grid items-start gap-y-[clamp(2.5rem,6vw,3.5rem)] min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,clamp(17rem,30vw,27rem))] min-[1000px]:gap-x-[clamp(2.5rem,5vw,5rem)]">
          {/* `self-stretch` makes this column as tall as the cover beside it,
              which is what gives the store row's `mt-auto` something to push
              against. Without it the column shrink-wraps its copy and leaves
              about 200px of cream under the paragraph. */}
          <header className="flex max-w-[40rem] flex-col min-[1000px]:self-stretch">
            <p className="eyebrow">
              <span aria-hidden="true">✦</span> The record
            </p>

            <h2
              id="homegrown-title"
              className="display mt-4 text-[clamp(2.4rem,6vw,4.4rem)] text-ink"
            >
              {sentenceCase(homegrown.title)}
            </h2>

            <p className="micro mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{homegrown.tracks.length} tracks</span>
              <span aria-hidden="true" className="text-gold-rule">
                ✦
              </span>
              <span>{totalRuntime(homegrown.tracks)}</span>
              <span aria-hidden="true" className="text-gold-rule">
                ✦
              </span>
              <time dateTime={homegrown.releaseDate}>
                {homegrown.releaseDate}
              </time>
            </p>

            <p className="mt-6 max-w-[32rem] text-[1.0625rem] text-ink-70">
              Every title below opens that song on Spotify. They&rsquo;re listed
              in the order they sit on the record.
            </p>

            <StoreRow />
          </header>

          {/* `relative` keeps the cover painting above anything below it, and
              the negative bottom margin is the 1.5rem overhang past the copy
              column. It stays well short of the gold rule's own top margin, so
              it never reaches the Side B heading underneath.
              Intrinsic art is 640x640: no fixed `sizes` entry exceeds that. */}
          <div className="relative w-full max-w-[26rem] justify-self-start min-[1000px]:mb-[-1.5rem] min-[1000px]:max-w-none min-[1000px]:justify-self-end">
            <Image
              src={homegrown.coverArt}
              alt={homegrown.coverAlt}
              width={640}
              height={640}
              sizes="(min-width: 1000px) 432px, (min-width: 640px) 416px, 92vw"
              className="photo-treated block h-auto w-full"
              style={{ borderRadius: 0, boxShadow: COVER_SHADOW }}
            />
          </div>
        </div>

        {/* The printed rule, carried on the tracklist itself, at full measure. */}
        <div
          className="mt-[clamp(2.75rem,6vw,4.5rem)] grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-[clamp(2.25rem,4vw,3rem)] border-t pt-[clamp(2.5rem,4.5vw,4rem)] min-[850px]:grid-cols-2"
          style={{ borderColor: 'rgba(138,106,34,0.4)' }}
        >
          <Side label="Side A" slug="a" tracks={sideA} startNumber={1} />
          <Side label="Side B" slug="b" tracks={sideB} startNumber={half + 1} />
        </div>
      </div>
    </section>
  );
}

export default BackCover;
