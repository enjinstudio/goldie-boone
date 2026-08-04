import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

/**
 * The EU AI Act Art. 50 provenance page.
 *
 * This route was linked from the footer and the front cover for months before
 * it existed, which meant the site advertised a disclosure and served a 404.
 * The footer now also carries a one-line disclosure on every route, so this
 * page is no longer the only place the obligation is met. That is what lets it
 * open with the craft instead of the compliance.
 *
 * The copy is approved verbatim in
 * docs/superpowers/specs/2026-08-04-provenance-page-design.md. Two rules govern
 * any future edit:
 *
 *   1. The "I'm a character" paragraph must stay reachable by ordinary
 *      scrolling on a 390px viewport. If the page grows, cut copy ABOVE it.
 *      Never restyle it smaller or move it down.
 *   2. Nothing here may claim the work is unautomated. It is not: posting,
 *      brief drafting and reply drafting are all automated. The true and
 *      stronger claim, the one this page makes, is that nothing ships without
 *      a person choosing it.
 */

const TITLE = 'How these songs are made';

export const metadata: Metadata = {
  title: TITLE,
  description:
    'Where Goldie Boone songs come from, what the tools do, and what they do not. Written plainly, because you would want to know.',
  alternates: { canonical: '/how-these-songs-are-made' },
  openGraph: {
    type: 'article',
    title: TITLE,
    description:
      'Where Goldie Boone songs come from, what the tools do, and what they do not.',
    url: '/how-these-songs-are-made',
  },
};

/* Body copy shares one type spec so no paragraph can drift quieter than the
   others. The disclosure paragraph is body copy like everything else, and that
   is deliberate: it must not read as fine print. */
const PROSE = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(1.06rem, 1.6vw, 1.22rem)',
  lineHeight: 1.62,
} as const;

export default function HowTheseSongsAreMade() {
  return (
    <>
      <SiteHeader />
      <main>
        <article
          className="mx-auto text-ink"
          style={{
            maxWidth: '58ch',
            paddingInline: 'clamp(20px, 5vw, 44px)',
            paddingTop: 'clamp(88px, 14vw, 152px)',
            paddingBottom: 'clamp(56px, 9vw, 104px)',
          }}
        >
          <h1
            className="display"
            style={{
              fontSize: 'clamp(1.9rem, 5.4vw, 3rem)',
              lineHeight: 1.08,
              letterSpacing: '0.01em',
              marginBottom: 'clamp(28px, 4vw, 44px)',
            }}
          >
            {TITLE}
          </h1>

          <div className="grid" style={{ gap: 'clamp(18px, 2.4vw, 26px)' }}>
            <p style={PROSE}>I&rsquo;d rather you hear it from me.</p>

            <p style={PROSE}>
              Every one of these starts the same way. Somebody writes down a
              line they can&rsquo;t quit turning over.{' '}
              <em>Round here fine&rsquo;s a four letter word.</em>{' '}
              <em>Left my cart right where it stood.</em> That part isn&rsquo;t
              a machine. That&rsquo;s a person at a kitchen table who
              couldn&rsquo;t let a thought go.
            </p>

            <p style={PROSE}>
              Then the work starts, and most of the work is saying no. A version
              comes back and the melody&rsquo;s right but the second verse is a
              lie, so it goes. The next one is close, and something in the
              phrasing rings false, so that goes too. You sit with a whole lot
              of almost before you get to one that&rsquo;s true.
            </p>

            <p style={PROSE}>
              The tools build the song around those lines. They give it a voice,
              a band, a shape you can actually put on in the truck. What they
              don&rsquo;t do is decide. Nothing leaves here that somebody
              didn&rsquo;t sit with first and say yes to out loud.
            </p>

            <p style={PROSE}>
              Here&rsquo;s the plain part, because you&rsquo;d want to know.
              I&rsquo;m a character. The face you&rsquo;re looking at and the
              voice you&rsquo;re hearing were made with AI. I&rsquo;m not
              somebody you could drive out and meet.
            </p>

            <p style={PROSE}>
              But the ache in these songs got put there on purpose, by people
              who argued over a single word until it sat right. That part is as
              real as it gets.
            </p>

            <p style={PROSE}>
              Thank you for listening close enough to come read this. 🤍
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
