import type { Release } from './types';

/**
 * HOMEGROWN's track titles, Spotify IDs and durations were resolved live from
 * the Spotify embed payload for album 2Qf20OxC4rCPxkstERv7dW on 2026-08-02 and
 * cross-checked, all ten, against tools/persona-catalog.md in ~/socialmedia.
 * Nothing here was transcribed from the design brief.
 *
 * The design handoff claimed "one album, six singles" and listed PEACH SEASON,
 * SUNDAY DRESS, MAMA KNEW, THE WHOLE TOWN KNOWS, EIGHTEEN ACRES and
 * GROW BACK GOLD as standalone singles. They are not. They are tracks 2, 3, 4,
 * 5, 9 and 10 of this album, and the brief silently dropped DOING FINE,
 * HEART ON THE LINE and STILL SETS TWO PLATES. Spotify is authoritative.
 */
export const homegrown: Release = {
  title: 'HOMEGROWN',
  type: 'album',
  // Year only, deliberately. Spotify's embed payload returns releaseDate: null
  // for this album and no other source on file gives the day, so the exact date
  // is unverified. persona-catalog.md records "HOMEGROWN (2026, 10 tracks)".
  releaseDate: '2026',
  // The real 640x640 artwork, pulled from Spotify's image CDN, not a crop of a
  // press photo. The design handoff stood a landscape photograph in for this
  // because it had no access to the actual cover.
  coverArt: '/images/homegrown-cover.jpg',
  coverAlt:
    'Homegrown album cover: Goldie Boone in a wildflower field holding an acoustic guitar, her name in gold script above the title',
  spotifyAlbumId: '2Qf20OxC4rCPxkstERv7dW',
  appleMusicUrl: 'https://music.apple.com/album/homegrown/6780044290',
  tracks: [
    { title: 'HOMEGROWN', durationMs: 179800, spotifyTrackId: '0V42Dnyq9TAxexiT98ZYds' },
    { title: 'PEACH SEASON', durationMs: 153360, spotifyTrackId: '52CUvzuRhZRfwdDqFhQNrf' },
    { title: 'SUNDAY DRESS', durationMs: 234840, spotifyTrackId: '2dcMIUEpXxpm2cFFGnKE5B' },
    { title: 'MAMA KNEW', durationMs: 184800, spotifyTrackId: '7cB8T10WDYanxtsZmDTUy6' },
    { title: 'THE WHOLE TOWN KNOWS', durationMs: 170000, spotifyTrackId: '7bOEr0iad2g9lEkpZaNhdV' },
    { title: 'DOING FINE', durationMs: 174840, spotifyTrackId: '53KRZh7lzU6wwcZdPnJ1TZ' },
    { title: 'HEART ON THE LINE', durationMs: 199880, spotifyTrackId: '5Q89QeFRgPSlxyRV9VCQ0M' },
    { title: 'STILL SETS TWO PLATES', durationMs: 194640, spotifyTrackId: '69sBlVxYiBiPGJD2hr5h5U' },
    { title: 'EIGHTEEN ACRES', durationMs: 203440, spotifyTrackId: '3UCRpNNfLEMhFqYIIwmAc5' },
    { title: 'GROW BACK GOLD', durationMs: 197200, spotifyTrackId: '6N89H3p7jXpqHW69mjmVtp' },
  ],
};

/**
 * Well Water is unreleased. There are no store URLs yet and the tracklist is
 * not public, so `tracks` is deliberately empty and both URLs are null.
 *
 * Do NOT invent titles here. brand/goldie.md §8: never list a song that is not
 * in persona-catalog.md. The page renders a countdown while these are null and
 * swaps to store buttons once they are filled in. Fill both URLs, then set
 * `spotifyAlbumId`, and the release section changes with no other edits.
 */
export const wellWater: Release = {
  title: 'Well Water',
  type: 'album',
  releaseDate: '2026-08-07',
  coverArt: '/images/well-water-cover.jpg',
  coverAlt: 'Goldie Boone drawing water from a hand pump on a frosted morning',
  spotifyAlbumId: null,
  appleMusicUrl: null,
  tracks: [],
  // 10, not 11. Corrected by Tolga 2026-08-04; this field and the project
  // CLAUDE.md in ~/socialmedia both carried 11 and were both wrong. The number
  // renders on the page AND shipped into launch-week captions, so it is
  // load-bearing in two places at once.
  trackCount: 10,
  isLead: true,
};

export const releases: Release[] = [wellWater, homegrown];
