import type { Release } from '@/content/types';

/**
 * Release-state derivation for a statically prerendered page.
 *
 * The page sets `export const revalidate = 3600`, so Next regenerates this HTML
 * hourly on the CDN. That is what makes a countdown possible with ZERO client
 * JavaScript: the number is computed on the server at regeneration time and
 * baked into the HTML. Without the revalidate, a build-time `new Date()` would
 * freeze at the deploy date and the page would read "in 5 days" forever.
 *
 * The practical consequence: the countdown is accurate to the hour, and the
 * page flips itself to the released state on 7 August with no deploy.
 */

/** Release instant. Midnight UTC on the release date. */
function releaseInstant(release: Release): number {
  return Date.parse(`${release.releaseDate}T00:00:00Z`);
}

export interface ReleaseState {
  /** True once the release date has passed. */
  isOut: boolean;
  /** Whole days remaining. 0 on the final day. Never negative. */
  daysRemaining: number;
  /** True when the record is out AND we actually have somewhere to send people. */
  hasStoreLinks: boolean;
  /** Human label for the countdown, e.g. "in 5 days", "tomorrow", "today". */
  countdownLabel: string;
}

export function getReleaseState(release: Release, now = Date.now()): ReleaseState {
  const msRemaining = releaseInstant(release) - now;
  const isOut = msRemaining <= 0;
  const daysRemaining = isOut ? 0 : Math.ceil(msRemaining / 86_400_000);
  const hasStoreLinks = Boolean(release.appleMusicUrl || release.spotifyAlbumId);

  let countdownLabel: string;
  if (isOut) countdownLabel = 'out now';
  else if (daysRemaining <= 1) countdownLabel = 'tomorrow';
  else countdownLabel = `in ${daysRemaining} days`;

  return { isOut, daysRemaining, hasStoreLinks, countdownLabel };
}

/**
 * The release date as Goldie would say it: "August 7". No year, no ordinal.
 * Fixed to UTC so the server and the prerender agree regardless of where the
 * build runs.
 */
export function formatReleaseDate(release: Release): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${release.releaseDate}T00:00:00Z`));
}
