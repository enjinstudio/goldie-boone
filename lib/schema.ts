import { goldie } from '@/content/artist';
import { homegrown, wellWater } from '@/content/releases';
import { toIsoDuration } from './duration';
import type { Release } from '@/content/types';
import { SITE_URL } from './site-url';

const SITE = SITE_URL;

/**
 * schema.org graph. Its job is entity consolidation: telling search engines
 * that the Goldie Boone on Spotify, on Apple Music, on YouTube and on this
 * domain are one artist rather than four.
 *
 * That only works if the strings match the streaming services EXACTLY. Track
 * titles are emitted verbatim from content/releases.ts, which was resolved from
 * Spotify rather than transcribed. Do not "tidy" the casing here to match the
 * prose style; a mismatch fragments the entity instead of corroborating it.
 *
 * `sameAs` carries only URLs verified to resolve. A wrong sameAs is worse than
 * a missing one, for the same reason.
 */

function albumSchema(release: Release) {
  const sameAs = [
    release.appleMusicUrl,
    release.spotifyAlbumId
      ? `https://open.spotify.com/album/${release.spotifyAlbumId}`
      : null,
  ].filter((u): u is string => Boolean(u));

  return {
    '@type': 'MusicAlbum',
    '@id': `${SITE}/#album-${release.title.toLowerCase().replace(/\s+/g, '-')}`,
    name: release.title,
    albumProductionType: 'https://schema.org/StudioAlbum',
    byArtist: { '@id': `${SITE}/#artist` },
    datePublished: release.releaseDate,
    ...(sameAs.length ? { sameAs } : {}),
    ...(release.tracks.length
      ? {
          numTracks: release.tracks.length,
          track: release.tracks.map((t, i) => ({
            '@type': 'MusicRecording',
            name: t.title,
            position: i + 1,
            duration: toIsoDuration(t.durationMs),
            byArtist: { '@id': `${SITE}/#artist` },
            sameAs: `https://open.spotify.com/track/${t.spotifyTrackId}`,
          })),
        }
      : { numTracks: release.trackCount }),
  };
}

export function buildSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        '@id': `${SITE}/#artist`,
        name: goldie.name,
        genre: goldie.genre,
        description: goldie.bios.short,
        url: SITE,
        sameAs: Object.values(goldie.profiles),
      },
      albumSchema(homegrown),
      albumSchema(wellWater),
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: goldie.name,
        publisher: { '@id': `${SITE}/#artist` },
      },
    ],
  };
}
