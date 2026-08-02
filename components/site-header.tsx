import type { CSSProperties } from 'react';
import { goldie } from '@/content/artist';

/**
 * The sleeve's top edge. Server component: nothing here is interactive beyond
 * plain links, so there is no reason to ship JavaScript for it.
 *
 * WHY EVERY SIZE IS A clamp()
 * The narrow case is real, not theoretical. Measured at a 390px viewport:
 *
 *   inline padding  clamp(16px, 4vw, 44px) -> 4vw is 15.6px, so it clamps to 16px
 *   content width   390 - 32 = 358px
 *
 *   wordmark    ~119px  (Bodoni at 0.74rem, 12 chars, 2.34px of tracking each)
 *   "Music"       44px  (natural width is ~37px, widened to the tap floor)
 *   "About"       44px  (natural width is ~38px, widened to the tap floor)
 *   Apple pill   ~97px  (~77px of text plus 10px of padding each side)
 *   two gaps      17px  (clamp(8px, 2.2vw, 26px) -> 8.58px)
 *   -------------------
 *   total       ~322px inside 358px, so roughly 36px of slack. It fits.
 *
 * It does NOT fit much below that, and the reason is the font swap rather than
 * the viewport. Bodoni loads with display: swap, so first paint renders Georgia,
 * whose capitals run about 12% wider. That pushes the wordmark to ~134px and the
 * row to ~337px. Still fine at 390px, but at 360px (the most common Android
 * width) the content box is only 328px and the first paint would overflow and
 * hand the whole page a horizontal scrollbar.
 *
 * So the two section links are dropped below 380px. Per the spec that is the
 * correct trade: tap targets are the floor, not the variable, and the page is a
 * single scroll, so nothing becomes unreachable when they go. Apple Music, the
 * conversion target, never leaves the bar.
 */

interface SectionLink {
  label: string;
  href: string;
}

const SECTION_LINKS: SectionLink[] = [
  { label: 'Music', href: '#music' },
  { label: 'About', href: '#about' },
];

/* Shared by both nav link kinds so they cannot drift apart. Font sizing and
   tracking only: layout stays in className so the responsive variants win. */
const NAV_TYPE: CSSProperties = {
  fontFamily: 'var(--font-micro)',
  fontSize: 'clamp(0.8rem, 2vw, 0.92rem)',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

export default function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b backdrop-blur-[8px]"
      style={{
        paddingInline: 'clamp(16px, 4vw, 44px)',
        background: 'rgba(244, 235, 218, 0.94)',
        borderBottomColor: 'rgba(42, 39, 33, 0.20)',
      }}
    >
      {/*
        Not a link. The page is already here, so a self-link is noise for both a
        mouse and a screen reader.

        Written in sentence case and uppercased in CSS on purpose: some screen
        readers spell out all-capital strings letter by letter, so the accessible
        name stays "Goldie Boone" while the rendered wordmark reads GOLDIE BOONE.
      */}
      <p
        className="display shrink-0 uppercase text-ink"
        style={{
          fontSize: 'clamp(0.74rem, 1.9vw, 0.95rem)',
          letterSpacing: 'clamp(0.16em, 0.6vw, 0.3em)',
          whiteSpace: 'nowrap',
        }}
      >
        Goldie Boone
      </p>

      <nav
        aria-label="Sections"
        className="flex items-center"
        style={{ gap: 'clamp(8px, 2.2vw, 26px)' }}
      >
        {SECTION_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            /*
              Layout lives in className, never in the inline style, so the
              min-[380px] variant actually wins. An inline `display` would beat
              the media query and the link would never hide.

              min-w-11 / h-11 is the 44px tap floor in both axes; the label is
              only ~37px wide on its own.

              #B08A32 is given by the spec and is deliberately not a theme token:
              it sits between --color-gold-rule and --color-gold-bright and it
              appears in exactly this one place.
            */
            className="hidden h-11 min-w-11 shrink-0 items-center justify-center border-b border-b-transparent text-ink-45 transition-colors duration-150 hover:border-b-[#B08A32] hover:text-ink min-[380px]:inline-flex"
            style={NAV_TYPE}
          >
            {link.label}
          </a>
        ))}

        {/* Apple Music is the primary conversion target, so it is the only
            filled element in the bar and it never drops at any width. */}
        <a
          href={goldie.profiles.appleMusic}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center bg-ink text-cream transition-colors duration-150 hover:bg-denim"
          style={{ ...NAV_TYPE, paddingInline: 'clamp(10px, 2vw, 18px)' }}
        >
          Apple Music
        </a>
      </nav>
    </header>
  );
}
