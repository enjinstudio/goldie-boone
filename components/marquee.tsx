import type { Track } from '@/content/types';
import { homegrown, wellWater } from '@/content/releases';
import { formatReleaseDate } from '@/lib/release-state';

/**
 * THE SPINE.
 *
 * Section 4 of the sleeve. A full-bleed ink strip, read the way you read the
 * spine of a record standing on a shelf: the new release, then every song on
 * the last one, running past you.
 *
 * Two things about this component are load-bearing and easy to break:
 *
 * 1. The track holds TWO IDENTICAL SPANS. The keyframe in globals.css
 *    (`gb-marquee`) translates the track by -50%, which lands exactly on the
 *    start of the second span only while the two are byte-identical. If you
 *    change the words, change both halves, which is why both render from the
 *    same `spineText` constant rather than being typed out twice.
 *
 * 2. The strip is `aria-hidden`. It is decoration. Every word in it is
 *    available as real text elsewhere on the page (the tracklist on the back
 *    cover, the release date in the record section), so hiding it costs a
 *    screen reader nothing and spares it ten song titles scrolling past twice.
 *
 * Reduced motion is already handled in globals.css: `.marquee-track` has its
 * animation removed under `prefers-reduced-motion: reduce`, and the strip then
 * simply sits still showing the first span.
 */

/** Titles are stored UPPERCASE because that is how the album art sets them.
 *  This is running prose, not album art, so it gets sentence case per the
 *  build spec. The strip is styled uppercase in CSS, which keeps the look
 *  without baking shouting into the DOM text. */
function toSentenceCase(track: Track): string {
  const lower = track.title.toLocaleLowerCase('en-US');
  return lower.charAt(0).toLocaleUpperCase('en-US') + lower.slice(1);
}

/** Non-breaking, so the trailing gap survives HTML whitespace collapsing.
 *  Ordinary spaces here would collapse to nothing and the loop would butt the
 *  last title straight up against the first. */
const TRAILING_GAP = '\u00A0\u00A0\u00A0\u00A0';

const spineText = `${[
  `${wellWater.title}, ${formatReleaseDate(wellWater)}`,
  ...homegrown.tracks.map(toSentenceCase),
].join(' ✦ ')} ✦${TRAILING_GAP}`;

const TYPE = {
  fontFamily: 'var(--font-micro)',
  fontWeight: 500,
  fontSize: '0.66rem',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
} as const;

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden"
      style={{
        background: 'var(--color-ink)',
        /* Measures 10.7:1 on ink. */
        color: '#EBD9AF',
        paddingBlock: '14px',
      }}
    >
      <div className="marquee-track">
        <span style={TYPE}>{spineText}</span>
        <span style={TYPE}>{spineText}</span>
      </div>
    </div>
  );
}
