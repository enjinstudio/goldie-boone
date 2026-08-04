export interface Track {
  /** Title exactly as Spotify spells it, including casing. Goldie's titles are
   *  styled UPPERCASE on Spotify. Entity consistency across services depends on
   *  this string matching character for character, so do not "tidy" it.
   *  See brand/goldie.md §5: uppercase where reproducing album art, sentence
   *  case in prose. The sleeve tracklist IS album art, so it renders as stored. */
  title: string;
  /** Milliseconds, straight from the Spotify embed payload. ISO 8601 for
   *  schema.org is derived in lib/duration.ts so there is one source of truth. */
  durationMs: number;
  spotifyTrackId: string;
}

export interface Release {
  title: string;
  type: 'album' | 'single' | 'ep';
  /** ISO 8601, at whatever precision we can actually verify. Full date
   *  ("2026-08-07") where known, year only ("2026") where it is not. Both are
   *  valid ISO 8601 and both are accepted by schema.org datePublished. Never
   *  pad a year out to a made-up day just to make the type look tidier. */
  releaseDate: string;
  coverArt: string;
  coverAlt: string;
  /** Null until the record is out and the URLs exist. */
  spotifyAlbumId: string | null;
  /** Storefront-NEUTRAL Apple Music URL. Never /us/ or /au/. A storefront-coded
   *  link pins every visitor to one region. Null until the record is out. */
  appleMusicUrl: string | null;
  tracks: Track[];
  /** Shown when tracks are not yet public knowledge. */
  trackCount?: number;
  isLead?: boolean;
}

export interface Artist {
  name: string;
  genre: string;
  bios: { short: string; long: string };
  profiles: {
    spotify: string;
    appleMusic: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  /**
   * EU AI Act Art. 50. Disclosure now lives in TWO places, deliberately.
   *
   * `aiDisclosureShort` is one honest line rendered in the footer on every
   * route, so the obligation is met whether or not anyone follows a link.
   * `provenanceHref` points at the fuller account of how the songs get made.
   *
   * This supersedes the original rule that the words "AI" or "generated" must
   * never appear in visible page copy. That rule assumed the provenance route
   * carried the whole burden, and it left the site with a disclosure that only
   * existed for readers who clicked. Vada's site has always worked this way.
   * Changed 2026-08-04, see docs/superpowers/specs/2026-08-04-provenance-page-design.md.
   */
  aiDisclosureShort: string;
  provenanceHref: string;
  provenanceLabel: string;
}
