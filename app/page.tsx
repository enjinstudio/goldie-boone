import SiteHeader from '@/components/site-header';
import SideRail from '@/components/side-rail';
import FrontCover from '@/components/front-cover';
import Marquee from '@/components/marquee';
import TheRecord from '@/components/the-record';
import LyricBand from '@/components/lyric-band';
import TracklistSection from '@/components/tracklist-section';
import { homegrown, wellWater } from '@/content/releases';
import InnerSleeve from '@/components/inner-sleeve';
import About from '@/components/about';
import SiteFooter from '@/components/site-footer';

/**
 * The page is a record sleeve, read front to back.
 *
 * `revalidate = 3600` is the ONLY reason the release countdown works. The page
 * is still fully static HTML served from the CDN; Next just regenerates it
 * hourly, so `getReleaseState()` re-runs against a current clock. Without this,
 * a build-time `new Date()` would freeze at the deploy date and the front cover
 * would read "in 5 days" forever, then never flip on release day.
 *
 * Consequence: the countdown is accurate to the hour, costs zero client
 * JavaScript, and 7 August needs no deploy.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <SideRail />
      <main>
        {/* Front cover */}
        <FrontCover />
        {/* Spine */}
        <Marquee />
        {/* The record itself */}
        <TheRecord />
        {/* One emotional beat */}
        <LyricBand />
        {/* Back cover: the tracklist of the record this sleeve is FOR.
            It owns #music, because the header nav's "Music" link should land
            on the current album, not the back catalogue. */}
        <TracklistSection
          release={wellWater}
          id="music"
          slug="wellwater"
          eyebrow="The record"
          variant="full"
          ground="cream"
          blurb="Every title below opens that song on Spotify. They're listed in the order they sit on the record."
        />
        {/* The back catalogue, at deliberately lower weight: no cover art, one
            column, smaller title. Ink rather than wheat because the inner
            sleeve below is already wheat, and no two adjacent sections may
            share a ground (DESIGN-SPEC, The Sleeve). */}
        <TracklistSection
          release={homegrown}
          id="homegrown"
          slug="homegrown"
          eyebrow="Also out"
          variant="compact"
          ground="ink"
          blurb="Her first record, still the one most people find her through."
        />
        {/* Inner sleeve: the photo reel */}
        <InnerSleeve />
        <About />
      </main>
      <SiteFooter />
    </>
  );
}
