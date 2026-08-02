import type { CSSProperties } from 'react';
import Link from 'next/link';
import { goldie } from '@/content/artist';

/**
 * The back of the sleeve: the printed matter along the bottom edge.
 *
 * No newsletter box, no email capture, no "follow us". Removed by the client and
 * not to be reintroduced.
 */

interface PlatformLink {
  label: string;
  href: string;
  primary?: boolean;
}

/* Apple Music first and gold everywhere it appears. It is the conversion
   target, so it is the only pill that carries the accent. */
const PLATFORM_LINKS: PlatformLink[] = [
  { label: 'Apple Music', href: goldie.profiles.appleMusic, primary: true },
  { label: 'Spotify', href: goldie.profiles.spotify },
  { label: 'Instagram', href: goldie.profiles.instagram },
  { label: 'YouTube', href: goldie.profiles.youtube },
  { label: 'TikTok', href: goldie.profiles.tiktok },
];

const PILL_BASE =
  'inline-flex min-h-12 items-center justify-center rounded-full border transition-colors duration-150';

/* Labels are stored in natural case and uppercased in CSS so the accessible
   name stays "Apple Music" rather than a string a screen reader may spell out. */
const PILL_TYPE: CSSProperties = {
  fontFamily: 'var(--font-micro)',
  fontSize: '0.64rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  paddingInline: '22px',
};

const RULE = 'rgba(239, 231, 214, 0.34)';

/*
  ============================================================================
  The two "More" links share ONE className and ONE style object. That is not
  tidiness, it is the enforcement mechanism.

  The provenance link is a legal disclosure. It must render at exactly the same
  size, weight and colour as every link beside it, and must never be quietened,
  greyed, shrunk or moved below the fold. Giving both links a single shared
  definition means the two physically cannot drift apart in a later edit: change
  one and you have changed both.

  If you ever need to restyle "Press", restyle this constant, or the disclosure
  breaks with it. Do not split them.
  ============================================================================
*/
/* min-w-11 matters for "Press": at 1.02rem Newsreader it is only ~38px wide on
   its own, under the 44px tap floor in the horizontal axis. */
const MORE_LINK_CLASS =
  'inline-flex min-h-11 min-w-11 items-center justify-center text-footer-text transition-colors duration-150 hover:text-gold-footer';

const MORE_LINK_TYPE: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '1.02rem',
  fontWeight: 400,
};

export default function SiteFooter() {
  return (
    <footer
      className="bg-ink text-footer-text"
      style={{
        paddingTop: 'clamp(50px, 7vw, 88px)',
        paddingInline: 'clamp(20px, 4vw, 44px)',
        paddingBottom: 'clamp(32px, 5vw, 50px)',
      }}
    >
      <div
        className="mx-auto grid max-w-[1160px] justify-items-center text-center"
        style={{ gap: 'clamp(28px, 4vw, 44px)' }}
      >
        {/* Sentence case in the source, uppercased in CSS, so the accessible
            name reads "Goldie Boone" while the wordmark renders GOLDIE BOONE. */}
        <p
          className="display uppercase"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            letterSpacing: '0.14em',
            color: '#F7F1E4',
          }}
        >
          Goldie Boone
        </p>

        {/* Decorative. The only glyph in the system, and always aria-hidden. */}
        <div
          aria-hidden="true"
          className="flex items-center"
          style={{ width: 'min(300px, 58vw)', gap: '14px' }}
        >
          <span className="h-px flex-1" style={{ background: RULE }} />
          <span
            className="leading-none text-gold-bright"
            style={{ fontSize: '0.85rem' }}
          >
            ✦
          </span>
          <span className="h-px flex-1" style={{ background: RULE }} />
        </div>

        <nav
          aria-label="Platforms"
          className="flex flex-wrap items-center justify-center gap-[10px]"
        >
          {PLATFORM_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              /*
                Both border colours are written out as literal arbitrary values
                rather than interpolated from a constant: Tailwind extracts
                classes by scanning source text, so `border-[${RULE}]` would
                never be generated. They also cannot go in the inline style,
                because an inline borderColor outranks the :hover rule and the
                hover state would silently do nothing.
              */
              className={
                link.primary
                  ? `${PILL_BASE} border-[rgba(224,184,96,0.60)] text-gold-footer hover:bg-[rgba(224,184,96,0.14)]`
                  : `${PILL_BASE} border-[rgba(239,231,214,0.34)] text-footer-text hover:border-[#F7F1E4] hover:bg-[rgba(239,231,214,0.08)]`
              }
              style={PILL_TYPE}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Exactly two links. See the block comment above MORE_LINK_CLASS
            before touching either of them. */}
        <nav
          aria-label="More"
          className="flex flex-wrap items-center justify-center gap-x-[26px] gap-y-[6px]"
        >
          <a href="#" className={MORE_LINK_CLASS} style={MORE_LINK_TYPE}>
            Press
          </a>
          <Link
            href={goldie.provenanceHref}
            className={MORE_LINK_CLASS}
            style={MORE_LINK_TYPE}
          >
            {goldie.provenanceLabel}
          </Link>
        </nav>

        <p
          className="text-footer-muted"
          style={{
            fontFamily: 'var(--font-micro)',
            fontSize: '0.62rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}
        >
          Goldie Boone, dust and pixels
        </p>
      </div>
    </footer>
  );
}
