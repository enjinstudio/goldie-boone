import Image from 'next/image';

/**
 * Sleeve part 6: the lyric band.
 *
 * A full-bleed emotional beat between the record and the back cover. It carries
 * the ONLY lyric cleared for use anywhere on this site (Peach Season, one line).
 * Do not add a second one, do not paraphrase it, do not extend it.
 *
 * Server component. No state, no interactivity, no client JS.
 */
export default function LyricBand() {
  return (
    <section
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        minHeight: 'min(74svh, 680px)',
        overflow: 'hidden',
        background: 'var(--color-wheat-deep)',
      }}
    >
      <Image
        src="/images/peach-orchard.jpg"
        alt="Goldie Boone standing among the trees in a peach orchard"
        fill
        sizes="100vw"
        className="photo-treated"
        style={{
          objectFit: 'cover',
          /*
           * 26%, not the 58% this section first shipped with. The source is
           * 1600x900 and she stands in the right half, so 58% parks her face,
           * her hat and her shoulder directly behind the second line of the
           * quote. 26% pulls the crop onto the blurred orchard rows instead.
           *
           * Know what this value can and cannot do. At 1168x680 the cover scale
           * is 0.7556, the scaled image is 1209px wide, and there are only 41px
           * of horizontal overflow to slide, so at desktop widths this moves the
           * picture by about 20px and cannot fix legibility on its own. It earns
           * its keep at narrow widths, where the overflow is large: at 390px the
           * overflow is 677px, and 58% frames source x 589 to 1174 (her face)
           * while 26% frames x 264 to 849 (orchard rows, her at the right edge).
           * The cream pool below is what carries legibility on wide screens.
           */
          objectPosition: '26% center',
          /*
           * This band alone runs a slightly stronger sepia than the global
           * .photo-treated (0.10), because the scrim below sits so light that
           * the photograph would otherwise read cooler than every other frame
           * on the page. Held at 0.14 and NEVER higher: brand/goldie.md carries
           * a hard guard that her honey-blonde hair must not be pushed toward
           * copper, and 0.20 does exactly that. Inline wins over the class, so
           * saturate is repeated here rather than lost.
           */
          filter: 'sepia(0.14) saturate(0.94)',
        }}
      />

      {/*
        Warm scrim, not a black one. Darkening this band with black would drop it
        out of the wheat-and-cream palette the whole sleeve lives in. The wheat
        ramp does the same legibility job for the dark ink quote while keeping
        the section inside the daylight palette.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(228,204,153,0.50) 0%, rgba(200,176,132,0.40) 46%, rgba(120,102,70,0.62) 100%)',
        }}
      />

      {/*
        The local pool of light behind the type, and it is LIGHT on purpose.
        The obvious instinct is a pool of warm shade, but measuring the actual
        composited pixels shows that is backwards here. The type is dark ink
        (#241F16), and under the quote the background ranges from L 0.073 to
        L 0.739: blown sunlight on the left, her hair and shadowed foliage on the
        right. The bright pixels were never the problem. Every failure was dark
        ink sitting on dark leaves, so shade makes it worse. Measured: an ink
        pool at 0.34 dropped the worst case from 1.90 to 1.60. Cream lifts the
        floor instead, and cream is the page's own paper colour, so the band
        stays inside the palette exactly the way the warm scrim above does.

        Geometry is measured, not eyeballed. The ellipse is centred at 53% down
        rather than 50% so it covers the figcaption, which sits below the optical
        centre and needs 4.5:1 as micro type. It reaches zero at 4% and 96%
        across and is effectively invisible past about 13% and 87%, so it reads
        as a sun-bleached patch on the paper rather than a bar across the band.

        The 0.56 peak is set by the figcaption, not by the quote. The quote is
        large text and clears 3:1 at half this strength. The caption is 0.62rem,
        so it needs a full 4.5:1, and it is the last thing to pass. The extra
        headroom above 4.5 is deliberate: .grain multiplies over this band and
        darkens the text and its bed together, which pulls both toward each
        other. At a modelled 10% grain the caption still holds 4.73:1 here.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 46% 38% at 50% 53%, rgba(244,235,218,0.56) 0%, rgba(244,235,218,0.53) 46%, rgba(244,235,218,0.24) 74%, rgba(244,235,218,0) 100%)',
        }}
      />

      <figure
        style={{
          position: 'relative',
          margin: 0,
          maxWidth: '900px',
          paddingBlock: 'clamp(52px, 9vw, 100px)',
          paddingInline: 'clamp(22px, 4vw, 44px)',
          textAlign: 'center',
          display: 'grid',
          justifyItems: 'center',
          gap: '22px',
        }}
      >
        {/* Star divider. Decoration only, so it is hidden from assistive tech. */}
        <div
          aria-hidden="true"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '14px',
            width: 'min(320px, 60vw)',
          }}
        >
          <span style={{ height: '1px', background: 'rgba(46,40,26,0.42)' }} />
          <span
            className="micro"
            style={{ color: '#4A3F26', fontSize: '0.7rem', letterSpacing: 0 }}
          >
            ✦
          </span>
          <span style={{ height: '1px', background: 'rgba(46,40,26,0.42)' }} />
        </div>

        <blockquote
          className="display"
          style={{
            margin: 0,
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 5.6vw, 3.7rem)',
            lineHeight: 1.14,
            color: '#241F16',
            textWrap: 'pretty',
          }}
        >
          The sweetest things go soft the fastest
        </blockquote>

        <figcaption
          className="micro"
          style={{ color: '#3F3626', letterSpacing: '0.28em' }}
        >
          Peach Season
        </figcaption>
      </figure>
    </section>
  );
}
