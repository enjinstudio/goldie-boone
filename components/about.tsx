import Image from 'next/image';
import { goldie } from '@/content/artist';
import { wellWater } from '@/content/releases';
import { formatReleaseDate } from '@/lib/release-state';

/**
 * Sleeve part 9: About, on the cream ground.
 *
 * Server component. Everything factual here comes from `content/`: the bio
 * paragraph is `goldie.bios.long` verbatim and the release date is derived from
 * `wellWater`, so neither can drift from the rest of the page. The album names
 * are written in prose case on purpose (spec §7: uppercase only where we are
 * reproducing album art, which is the tracklist and nothing else).
 */
export default function About() {
  return (
    <section
      id="about"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'clamp(58px, 9vw, 120px)',
        paddingInline: 'clamp(20px, 4vw, 44px)',
      }}
    >
      <div
        data-rise
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'clamp(32px, 5vw, 74px)',
        }}
      >
        {/*
          LAYOUT TRAP, documented from the previous build: this wrapper must not
          be allowed to shrink to fit. Under a `justify-items: center` parent an
          intrinsically sized arch collapses to zero width and the photograph
          disappears. It carries a definite flex basis AND `margin: 0 auto`, so
          it holds its width in the row and stays centred once the row wraps.
        */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', margin: '0 auto' }}>
          <div
            className="arch"
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              overflow: 'hidden',
              background: 'var(--color-photo-bg)',
              boxShadow: '0 24px 48px rgba(42,39,33,0.22)',
            }}
          >
            <Image
              src="/images/porch-rail-square.jpg"
              alt="Goldie Boone leaning on a porch rail"
              fill
              sizes="(max-width: 880px) 92vw, 400px"
              className="photo-treated"
              style={{ objectFit: 'cover', objectPosition: '50% 22%' }}
            />
            <div
              aria-hidden="true"
              className="photo-wash"
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </div>

        <div style={{ flex: '1 1 440px', display: 'grid', gap: '22px' }}>
          <h2 className="eyebrow" style={{ margin: 0 }}>
            <span aria-hidden="true">✦ </span>About
          </h2>

          {/*
            A pull quote, not a lyric. Only one lyric is cleared for this site
            (Peach Season, in lyric-band.tsx), so this is deliberately a <p> and
            not a <blockquote>: nothing here should read as a second one.
          */}
          <p
            className="display"
            style={{
              margin: 0,
              fontStyle: 'italic',
              maxWidth: '30ch',
              fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
              lineHeight: 1.18,
              color: 'var(--color-ink)',
              textWrap: 'pretty',
            }}
          >
            The songs were the only place the truth could fit.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '16px',
              maxWidth: '54ch',
              color: 'var(--color-ink-70)',
            }}
          >
            <p style={{ margin: 0 }}>{goldie.bios.long}</p>
            <p style={{ margin: 0 }}>
              The words arrive on whatever paper is nearest, a grocery receipt, a
              church bulletin, the back of a peach crate label, and they live in
              her guitar case until they turn into songs. Her rule is simple:
              every song has to hold at least one line that hurts.
            </p>
            {/*
              The design handoff wrote this as "an audience of hundreds of
              thousands". That is a hard metric claim with nothing in content/
              backing it, on a page where every track ID, duration and profile
              URL was verified against the live services. Reworded to keep the
              meaning (it happened without industry machinery) while asserting
              no number we cannot defend if press checks it. Do not put a figure
              back without a source.
            */}
            <p style={{ margin: 0 }}>
              Homegrown found its audience without a label, a radio push or a
              tour. {wellWater.title} follows on {formatReleaseDate(wellWater)}.
            </p>
          </div>

          {/*
            Destination is out of scope for v1, so this points at "#" for now.
            Hover uses --color-gold-text rather than --color-gold-rule: at this
            size (0.66rem) the text is small copy, and gold-rule measures 4.25:1
            on cream, which misses AA. gold-text is the tuned text token and
            clears it at 5.96:1. The rule underneath stays gold-rule.
          */}
          <a
            href="#"
            className="text-ink hover:text-gold-text border-b border-gold-rule transition-colors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: 'fit-content',
              minHeight: '44px',
              fontFamily: 'var(--font-micro)',
              fontWeight: 500,
              fontSize: '0.66rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Press and photos
          </a>
        </div>
      </div>
    </section>
  );
}
