import Image from 'next/image';

/**
 * Sleeve part 8: the inner sleeve, "Around the record".
 *
 * A gatefold montage, thirteen frames, running edge to edge. This is the only
 * full-bleed block on the page and it is meant to break the 1160px column that
 * every other section sits in.
 *
 * WHY THIS IS A COLUMN MASONRY AND NOT A SPAN GRID.
 * The first version was a six-column grid with hand-placed tiles of varying row
 * and column spans. It was correct by construction (verified: no overlaps, no
 * interior holes) and it still looked broken, because varied spans cannot tile
 * a rectangle exactly. The block ends up ragged at its top and bottom edges,
 * and against a solid wheat ground those notches do not read as composition,
 * they read as images that failed to load. That was the client's reaction and
 * they were right.
 *
 * A column masonry cannot produce that failure mode. Each column is an
 * independent vertical stack, every image keeps its own aspect ratio, and the
 * columns simply end where they end. There are no cells, so there is nothing
 * that can be left empty. Variety comes from the images being genuinely
 * different shapes rather than from span arithmetic.
 *
 * Implemented with CSS multi-column. The known tradeoff is that the browser
 * distributes items into columns itself, so visual order is not strictly DOM
 * order. That is acceptable here and nowhere else on this page: these are
 * eleven photographs with no narrative sequence, no numbering and no captions,
 * so no meaning is carried by their order. In exchange it is hole-free at every
 * width and the responsive behaviour is a single property.
 *
 * Server component. No JS, no masonry library, no scroll snap, no observers.
 *
 * PERFORMANCE. Thirteen images, all below the fold, none allowed to compete with
 * the hero for bandwidth. No `priority` and no `preload` here. `sizes` is set
 * from the real rendered column width at each breakpoint, so a tile that paints
 * 300px wide never requests a 1500px file. Every tile carries an explicit
 * aspect-ratio box, so CLS stays at zero whether or not the image has arrived.
 */

interface Frame {
  src: string;
  alt: string;
  /** Rendered aspect ratio of the tile, chosen per image. The mix of 3/4, 4/5
   *  and 9/16 is what gives the columns their uneven rhythm, and with the
   *  arches gone it is now the ONLY source of variety in this section, so do
   *  not flatten these to a single value. */
  ratio: string;
  /** Vertical crop anchor. Only set where the tile ratio differs meaningfully
   *  from the source ratio, so the crop would otherwise cut her head. */
  position?: string;
}

/**
 * SELECTION RULE: one frame per SCENE, never per pose.
 *
 * The previous set had eleven frames of which five were "her at a microphone"
 * (two on a porch, three in a studio). Individually they are different
 * photographs; in a grid they read as duplicates, which is exactly what the
 * client called out. Three were cut.
 *
 * The thirteen below are each a different place or activity: indoors with a
 * lamp, porch steps, a chapel, a kitchen, walking a meadow, singing on a porch,
 * a pickup tailgate, a wheat fence, a studio, standing in a meadow, sitting in
 * a field, a fair at night, a clapboard wall. Before adding a frame, ask what
 * scene it adds. If the answer is "another one of those", leave it out.
 *
 * Descriptions were written from the actual photographs, not from filenames and
 * not from the old design handoff's asset table, which described several as
 * objects and empty scenes. Every one is a portrait of her.
 */
const FRAMES: Frame[] = [
  {
    src: '/images/guitar-lamp.jpg',
    alt: 'Goldie Boone sitting cross-legged playing an acoustic guitar beside a lit lamp, a notebook open on the floor',
    ratio: '4 / 5',
  },
  {
    src: '/images/porch-guitar-goldenhour.jpg',
    alt: 'Goldie Boone playing an acoustic guitar on a farmhouse porch, a wildflower field stretching out behind her at golden hour',
    ratio: '16 / 9',
  },
  {
    src: '/images/chapel-wildflowers.jpg',
    alt: 'Goldie Boone sitting outside a white clapboard chapel with an arched window, wildflowers around her, in an open denim jacket',
    ratio: '4 / 5',
  },
  {
    src: '/images/kitchen-coffee.jpg',
    alt: 'Goldie Boone laughing in a farmhouse kitchen holding a stoneware mug, in a denim shirt',
    ratio: '4 / 5',
  },
  {
    src: '/images/guitar-meadow-walk.jpg',
    alt: 'Goldie Boone walking through a meadow of wildflowers carrying an acoustic guitar by the neck',
    ratio: '4 / 5',
  },
  {
    src: '/images/porch-mic-sunset.jpg',
    alt: 'Goldie Boone singing into a microphone stand on a porch at sunset, wearing a long chambray skirt',
    ratio: '9 / 16',
  },
  {
    src: '/images/peach-truck.jpg',
    alt: 'Goldie Boone sitting on the tailgate of a pale blue pickup in a straw hat, wooden crates of peaches beside her',
    ratio: '3 / 4',
  },
  {
    src: '/images/fence-wheat-guitar.jpg',
    alt: 'Goldie Boone leaning against a weathered timber fence in a wheat field at sunset, an acoustic guitar in her arms',
    ratio: '16 / 9',
  },
  {
    src: '/images/studio-headphones.jpg',
    alt: 'Goldie Boone in a recording studio with headphones round her neck, a condenser microphone and guitars behind her',
    ratio: '4 / 5',
  },
  {
    src: '/images/meadow-wildflowers.jpg',
    alt: 'Goldie Boone standing in a meadow of dry grass and wildflowers, one hand shading her eyes',
    ratio: '3 / 4',
  },
  {
    src: '/images/field-guitar-hills.jpg',
    alt: 'Goldie Boone sitting in a grass field with an acoustic guitar, low hills behind her',
    ratio: '16 / 9',
  },
  {
    src: '/images/county-fair-dusk.jpg',
    alt: 'Goldie Boone at a county fair after dark, fairground lights blurred behind her',
    ratio: '4 / 5',
    position: '50% 22%',
  },
  {
    src: '/images/clapboard-wall.jpg',
    alt: 'Goldie Boone leaning against a weathered grey clapboard wall in a white eyelet dress',
    ratio: '3 / 4',
  },
];

export default function InnerSleeve() {
  return (
    <section
      aria-labelledby="inner-sleeve-title"
      className="bg-wheat"
      style={{
        paddingBlockStart: 'clamp(52px, 8vw, 104px)',
        paddingBlockEnd: 'clamp(56px, 9vw, 112px)',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1160px',
          paddingInline: 'clamp(20px, 4vw, 44px)',
          paddingBlockEnd: '28px',
        }}
      >
        <h2 id="inner-sleeve-title" className="eyebrow">
          Around the record
        </h2>
      </div>

      {/*
        Full bleed. The column count is the only responsive lever: two on a
        phone, three from 768px, four on very wide screens where three columns
        would make each frame absurdly tall. `orphans`/`widows` are irrelevant
        here since every child has break-inside: avoid.
      */}
      <div className="gb-mosaic">
        {FRAMES.map((frame) => (
          <div key={frame.src} className="gb-mosaic-item">
            <div
              className="relative w-full overflow-hidden bg-photo-bg photo-wash"
              style={{
                aspectRatio: frame.ratio,
                borderRadius: '3px',
              }}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1439px) 34vw, 25vw"
                className="photo-treated object-cover"
                style={frame.position ? { objectPosition: frame.position } : undefined}
              />
              {/* Inset hairline, so the edge reads as a printed die-cut rather
                  than a photograph dropped onto a background. Decorative. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  border: '1px solid rgba(244, 235, 218, 0.5)',
                  borderRadius: 'inherit',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
