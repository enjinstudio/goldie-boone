import type { CSSProperties } from 'react';
import { goldie } from '@/content/artist';

/**
 * The spine label running down the right edge of the sleeve. Desktop only.
 *
 * It is display: none below 900px and never shown on a phone: a 54px fixed
 * column costs 14% of a 390px viewport and sits on top of the content, which is
 * a bad trade for links the footer already carries.
 *
 * ON EXPOSING THE SAME FIVE LINKS TWICE TO A SCREEN READER
 * These destinations also live in the footer's "Platforms" nav, so the question
 * is whether to hide this one from assistive tech. The answer is no, and the
 * reason is mechanical rather than stylistic: aria-hidden on a container full of
 * focusable links produces the classic aria-hidden-focus failure, where a
 * keyboard user can still tab into elements the accessibility tree says are not
 * there. Fixing that properly means tabindex={-1} on every link, which takes the
 * rail away from sighted keyboard users, who can plainly see it. That is a worse
 * outcome than a little duplication.
 *
 * So it stays exposed, with an aria-label ("Listen and follow") that is
 * deliberately different from the footer's ("Platforms"). A screen reader user
 * browsing landmarks then sees two distinctly named navs rather than the same
 * name twice, which is the normal, expected pattern for a site whose header and
 * footer both link the same places. Below 900px display: none removes it from
 * the accessibility tree entirely, so on phones there is no duplication at all.
 */

interface RailLink {
  label: string;
  href: string;
  /** Physical height, per the spec. All are comfortably over the 44px floor,
   *  and the 54px rail width covers the other axis. */
  minHeight: number;
  primary?: boolean;
}

/* Apple Music first and gold, because it is the conversion target. */
const STORE_LINKS: RailLink[] = [
  {
    label: 'Apple Music',
    href: goldie.profiles.appleMusic,
    minHeight: 88,
    primary: true,
  },
  { label: 'Spotify', href: goldie.profiles.spotify, minHeight: 58 },
];

const SOCIAL_LINKS: RailLink[] = [
  { label: 'Instagram', href: goldie.profiles.instagram, minHeight: 76 },
  { label: 'YouTube', href: goldie.profiles.youtube, minHeight: 64 },
  { label: 'TikTok', href: goldie.profiles.tiktok, minHeight: 52 },
];

/*
  Layout and state live in className so nothing inline can beat the min-[900px]
  media query. writing-mode goes through Tailwind's arbitrary-property syntax for
  the same reason: it keeps the whole rule set in one cascade.
*/
const LINK_BASE =
  'flex w-full items-center justify-center [writing-mode:vertical-rl] transition-colors duration-150 hover:bg-[rgba(239,231,214,0.10)]';

const LINK_TYPE: CSSProperties = {
  fontFamily: 'var(--font-micro)',
  fontSize: '0.62rem',
  letterSpacing: '0.18em',
};

function RailAnchor({ link }: { link: RailLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        link.primary
          ? `${LINK_BASE} text-gold-footer hover:text-[#F7F1E4]`
          : `${LINK_BASE} text-footer-text hover:text-gold-footer`
      }
      /* Labels are stored in natural case and uppercased in CSS: the rendered
         spine reads APPLE MUSIC while the accessible name stays "Apple Music",
         which is what a screen reader should say for a proper noun. */
      style={{ ...LINK_TYPE, minHeight: `${link.minHeight}px`, textTransform: 'uppercase' }}
    >
      {link.label}
    </a>
  );
}

export default function SideRail() {
  return (
    <nav
      aria-label="Listen and follow"
      className="fixed top-1/2 right-0 z-40 hidden w-[54px] -translate-y-1/2 flex-col items-center gap-[2px] border py-[10px] min-[900px]:flex"
      style={{
        background: 'rgba(42, 39, 33, 0.94)',
        borderColor: 'rgba(42, 39, 33, 0.5)',
        borderRightWidth: 0,
      }}
    >
      {STORE_LINKS.map((link) => (
        <RailAnchor key={link.href} link={link} />
      ))}

      {/* Decorative separator between the stores and the socials. */}
      <span
        aria-hidden="true"
        className="my-[4px] block h-px w-[18px] shrink-0"
        style={{ background: 'rgba(239, 231, 214, 0.30)' }}
      />

      {SOCIAL_LINKS.map((link) => (
        <RailAnchor key={link.href} link={link} />
      ))}
    </nav>
  );
}
