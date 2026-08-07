import Image from 'next/image';

import type { Release, Track } from '@/content/types';
import { formatDuration, toIsoDuration, totalRuntime } from '@/lib/duration';

/**
 * TRACKLIST SECTION: a record's tracklist, set the way a real sleeve sets it.
 *
 * This was `back-cover.tsx` and rendered HOMEGROWN only. It is parameterised
 * because the page now carries TWO tracklists: Well Water (the record the
 * sleeve is for) and HOMEGROWN below it (the back catalogue). Duplicating the
 * file would have meant maintaining two copies of the measured layout below,
 * so the release, the ground and the weight are props instead.
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
 * LAYOUT NOTE for `variant="full"`, because it is not the obvious arrangement.
 * The cover art is paired with the header block at the top rather than sitting
 * in a third column beside Side A and Side B. Bodoni caps are wide: "THE WHOLE
 * TOWN KNOWS" is 12.5em, which at the 1.5rem title ceiling is 300px of title
 * before the numeral, the leader and the duration. Art in its own column leaves
 * each side about 383px at 1440px wide, so the longest titles wrap and every
 * leader rule collapses. Paired with the header instead, the two sides get the
 * full measure (366px at the 850px breakpoint, 620px at 1440px) and every row
 * stays on one line at every width. The art still anchors the composition, and
 * it hangs 1.5rem lower than the copy column so the two blocks lock rather than
 * sit in a row.
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
 * GROUND THEMES.
 *
 * Colour is threaded as CSS custom properties set once on the <section> rather
 * than as props drilled through TrackRow and Side. Three reasons: the inner
 * components stay unaware of the ground entirely, a new ground is one object
 * here rather than an edit in four files, and the values stay readable as a set
 * so the contrast relationships can actually be checked against each other.
 *
 * MEASURED, not estimated (see LEARNINGS: contrast is solved in the asset, and
 * never guessed). On the ink ground:
 *   --color-footer-text #efe7d6 on --color-ink #2a2721 = 12.10:1
 *   --color-gold-footer #e9c983 on --color-ink #2a2721 =  9.32:1
 * Both clear the 4.5:1 body floor with room, and the muted 0.62 alpha numerals
 * sit at 6.6:1, still past the floor. The cream ground is unchanged from the
 * original back cover, whose contrast was measured when it was built.
 */
interface GroundTheme {
  background: string;
  title: string;
  body: string;
  muted: string;
  /** Gold, for side headings and hover. */
  accent: string;
  /** The gold hairline above the tracklist and under each side heading. */
  rule: string;
  /** The dotted leader running from title to duration. */
  leader: string;
  leaderHover: string;
  rowHover: string;
  /** Primary store button: filled. */
  solidBg: string;
  solidFg: string;
  solidHoverBg: string;
  /** Secondary store button: outlined. */
  outlineBorder: string;
  outlineHoverBg: string;
  outlineHoverFg: string;
}

const GROUNDS: Record<'cream' | 'ink', GroundTheme> = {
  cream: {
    background: 'var(--color-cream)',
    title: 'var(--color-ink)',
    body: 'var(--color-ink-70)',
    muted: 'var(--color-ink-55)',
    accent: 'var(--color-gold-text)',
    rule: 'rgba(138,106,34,0.4)',
    leader: 'rgba(42,39,33,0.26)',
    leaderHover: 'rgba(42,39,33,0.6)',
    rowHover: 'rgba(42,39,33,0.04)',
    solidBg: 'var(--color-ink)',
    solidFg: 'var(--color-cream)',
    solidHoverBg: 'var(--color-ink-70)',
    outlineBorder: 'var(--color-ink)',
    outlineHoverBg: 'var(--color-ink)',
    outlineHoverFg: 'var(--color-cream)',
  },
  ink: {
    background: 'var(--color-ink)',
    title: 'var(--color-footer-text)',
    body: 'rgba(239,231,214,0.78)',
    muted: 'rgba(239,231,214,0.62)',
    accent: 'var(--color-gold-footer)',
    rule: 'rgba(233,201,131,0.4)',
    leader: 'rgba(239,231,214,0.26)',
    leaderHover: 'rgba(239,231,214,0.6)',
    rowHover: 'rgba(239,231,214,0.06)',
    solidBg: 'var(--color-footer-text)',
    solidFg: 'var(--color-ink)',
    solidHoverBg: 'var(--color-gold-footer)',
    outlineBorder: 'rgba(239,231,214,0.34)',
    outlineHoverBg: 'rgba(239,231,214,0.08)',
    outlineHoverFg: 'var(--color-footer-text)',
  },
};

/** The custom properties the inner components read. */
function themeVars(theme: GroundTheme): React.CSSProperties {
  return {
    background: theme.background,
    '--tl-title': theme.title,
    '--tl-body': theme.body,
    '--tl-muted': theme.muted,
    '--tl-accent': theme.accent,
    '--tl-rule': theme.rule,
    '--tl-leader': theme.leader,
    '--tl-leader-hover': theme.leaderHover,
    '--tl-row-hover': theme.rowHover,
    '--tl-solid-bg': theme.solidBg,
    '--tl-solid-fg': theme.solidFg,
    '--tl-solid-hover-bg': theme.solidHoverBg,
    '--tl-outline-border': theme.outlineBorder,
    '--tl-outline-hover-bg': theme.outlineHoverBg,
    '--tl-outline-hover-fg': theme.outlineHoverFg,
  } as React.CSSProperties;
}

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
        className="group -mx-2 flex min-h-11 items-baseline gap-3 px-2 py-[0.95rem] transition-colors duration-200 hover:bg-[var(--tl-row-hover)]"
        /* A row must never be split down the middle by the compact variant's
           column break. Harmless in the two-column `full` layout, which uses
           grid rather than columns and never fragments. */
        style={{ breakInside: 'avoid' }}
      >
        <span
          aria-hidden="true"
          className="w-7 shrink-0 font-micro text-[0.86rem] leading-none tracking-[0.1em] tabular-nums text-[var(--tl-muted)] transition-colors duration-200 group-hover:text-[var(--tl-accent)]"
        >
          {String(number).padStart(2, '0')}
        </span>

        <span className="display text-[clamp(1.05rem,2.2vw,1.5rem)] text-[var(--tl-title)] transition-colors duration-200 group-hover:text-[var(--tl-accent)]">
          {track.title}
        </span>

        {/* The leader. It is an empty flex item, so its synthesized baseline is
            its bottom margin edge: the margin-bottom is what lifts the rule off
            the shared text baseline to sit through the title's x-height. */}
        <span
          aria-hidden="true"
          className="mb-[0.34em] flex-1 border-b border-dotted border-[var(--tl-leader)] transition-colors duration-200 group-hover:border-[var(--tl-leader-hover)]"
        />

        <span className="sr-only">, duration </span>
        <time
          dateTime={toIsoDuration(track.durationMs)}
          className="w-10 shrink-0 text-right font-micro text-[0.78rem] leading-none tracking-[0.04em] tabular-nums text-[var(--tl-muted)]"
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
  headingId,
  tracks,
  startNumber,
}: {
  label: string;
  headingId: string;
  tracks: Track[];
  startNumber: number;
}) {
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
          color: 'var(--tl-accent)',
          borderColor: 'var(--tl-rule)',
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
function StoreRow({ release }: { release: Release }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-3 pt-[clamp(2rem,4vw,3rem)] sm:gap-4">
      {release.appleMusicUrl ? (
        <a
          href={release.appleMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center bg-[var(--tl-solid-bg)] px-7 py-3 font-micro text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[var(--tl-solid-fg)] transition-colors duration-200 hover:bg-[var(--tl-solid-hover-bg)]"
        >
          Own it on Apple Music
        </a>
      ) : null}

      {release.spotifyAlbumId ? (
        <a
          href={`https://open.spotify.com/album/${release.spotifyAlbumId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-[var(--tl-outline-border)] px-7 py-3 font-micro text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[var(--tl-title)] transition-colors duration-200 hover:bg-[var(--tl-outline-hover-bg)] hover:text-[var(--tl-outline-hover-fg)]"
        >
          Spotify
        </a>
      ) : null}
    </div>
  );
}

export interface TracklistSectionProps {
  release: Release;
  /** Anchor target. `music` is the header nav's destination. */
  id: string;
  /** Unique per instance: two sections on one page cannot share heading ids. */
  slug: string;
  /** The small starred line above the title. */
  eyebrow: string;
  /**
   * `full` is the back cover: cover art, big display title, Side A / Side B.
   * `compact` is the back catalogue: no art, smaller title, one continuous
   * list. The rows themselves are identical in both, because the leader rule
   * IS the tracklist and shrinking it would just make it worse.
   */
  variant: 'full' | 'compact';
  ground: 'cream' | 'ink';
  /** Optional lede under the metadata line. */
  blurb?: string;
}

export function TracklistSection({
  release,
  id,
  slug,
  eyebrow,
  variant,
  ground,
  blurb,
}: TracklistSectionProps) {
  const isFull = variant === 'full';
  const theme = GROUNDS[ground];
  const titleId = `${slug}-title`;

  const half = Math.ceil(release.tracks.length / 2);
  const sideA = release.tracks.slice(0, half);
  const sideB = release.tracks.slice(half);

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="py-[clamp(4.5rem,10vw,8.5rem)]"
      style={themeVars(theme)}
    >
      <div className="mx-auto w-full max-w-[1440px] pl-[clamp(1.25rem,6vw,7rem)] pr-[clamp(1.25rem,4vw,3.5rem)]">
        {/* Header block. In `full` the cover art sits alongside it from 1000px
            up; in `compact` there is no art, so the header is a single column
            at every width and the store row follows the copy directly. DOM
            order matches visual order in both layouts, so there is no reading
            order mismatch to reason about. */}
        <div
          className={
            isFull
              ? 'grid items-start gap-y-[clamp(2.5rem,6vw,3.5rem)] min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,clamp(17rem,30vw,27rem))] min-[1000px]:gap-x-[clamp(2.5rem,5vw,5rem)]'
              : 'grid items-start'
          }
        >
          {/* `self-stretch` makes this column as tall as the cover beside it,
              which is what gives the store row's `mt-auto` something to push
              against. Without it the column shrink-wraps its copy and leaves
              about 200px of ground under the paragraph. Only relevant when
              there IS a cover beside it. */}
          <header
            className={
              isFull
                ? 'flex max-w-[40rem] flex-col min-[1000px]:self-stretch'
                : 'flex max-w-[40rem] flex-col'
            }
          >
            <p className="eyebrow" style={{ color: 'var(--tl-accent)' }}>
              <span aria-hidden="true">✦</span> {eyebrow}
            </p>

            <h2
              id={titleId}
              className="display mt-4 text-[var(--tl-title)]"
              style={{
                fontSize: isFull
                  ? 'clamp(2.4rem,6vw,4.4rem)'
                  : 'clamp(1.8rem,4vw,2.8rem)',
              }}
            >
              {sentenceCase(release.title)}
            </h2>

            <p
              className="micro mt-6 flex flex-wrap items-center gap-x-3 gap-y-1"
              style={{ color: 'var(--tl-muted)' }}
            >
              <span>{release.tracks.length} tracks</span>
              <span aria-hidden="true" style={{ color: 'var(--tl-accent)' }}>
                ✦
              </span>
              <span>{totalRuntime(release.tracks)}</span>
              <span aria-hidden="true" style={{ color: 'var(--tl-accent)' }}>
                ✦
              </span>
              <time dateTime={release.releaseDate}>{release.releaseDate}</time>
            </p>

            {blurb ? (
              <p
                className="mt-6 max-w-[32rem] text-[1.0625rem]"
                style={{ color: 'var(--tl-body)' }}
              >
                {blurb}
              </p>
            ) : null}

            <StoreRow release={release} />
          </header>

          {/* `relative` keeps the cover painting above anything below it, and
              the negative bottom margin is the 1.5rem overhang past the copy
              column. It stays well short of the gold rule's own top margin, so
              it never reaches the Side B heading underneath.
              Intrinsic art is 640x640: no fixed `sizes` entry exceeds that. */}
          {isFull ? (
            <div className="relative w-full max-w-[26rem] justify-self-start min-[1000px]:mb-[-1.5rem] min-[1000px]:max-w-none min-[1000px]:justify-self-end">
              <Image
                src={release.coverArt}
                alt={release.coverAlt}
                width={640}
                height={640}
                sizes="(min-width: 1000px) 432px, (min-width: 640px) 416px, 92vw"
                className="photo-treated block h-auto w-full"
                style={{ borderRadius: 0, boxShadow: COVER_SHADOW }}
              />
            </div>
          ) : null}
        </div>

        {/* The printed rule, carried on the tracklist itself, at full measure.
            `full` splits into labelled Side A / Side B like a real sleeve.
            `compact` skips the side headings, because at back-catalogue weight
            they claim more ceremony than the block is meant to carry.

            It still runs TWO columns from 850px up, via CSS multi-column
            rather than grid. A single column was tried first and measured
            1191px tall at 1440px, against 1126px for the full-weight record
            above it: the "subordinate" block was the taller of the two, which
            defeats the whole point. Multi-column (not grid) because it flows
            1-5 down the first column then 6-10 down the second, so reading
            order stays vertical. A two-column grid would have run 1,2 across
            the first row instead, which reads as a table, not a sleeve. */}
        <div
          className={
            isFull
              ? 'mt-[clamp(2.75rem,6vw,4.5rem)] grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-[clamp(2.25rem,4vw,3rem)] border-t pt-[clamp(2.5rem,4.5vw,4rem)] min-[850px]:grid-cols-2'
              : 'mt-[clamp(2.25rem,5vw,3.5rem)] max-w-[64rem] border-t pt-[clamp(2rem,4vw,3rem)]'
          }
          style={{ borderColor: 'var(--tl-rule)' }}
        >
          {isFull ? (
            <>
              <Side
                label="Side A"
                headingId={`${slug}-side-a`}
                tracks={sideA}
                startNumber={1}
              />
              <Side
                label="Side B"
                headingId={`${slug}-side-b`}
                tracks={sideB}
                startNumber={half + 1}
              />
            </>
          ) : (
            <ol
              aria-labelledby={titleId}
              className="min-[850px]:[column-count:2] min-[850px]:[column-gap:clamp(2rem,4vw,4rem)]"
            >
              {release.tracks.map((track, index) => (
                <TrackRow
                  key={track.spotifyTrackId}
                  track={track}
                  number={index + 1}
                />
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

export default TracklistSection;
