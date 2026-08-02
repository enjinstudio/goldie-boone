/**
 * The site's own absolute URL, resolved at build time.
 *
 * This exists because a hardcoded canonical is actively harmful before the real
 * domain is attached. The first deploy pointed `rel=canonical`, `og:url` and
 * every schema.org `@id` at https://goldieboonemusic.com, which is not
 * registered yet. A canonical aimed at a domain that does not resolve tells
 * search engines the page they are looking at is a duplicate of nothing, which
 * suppresses the URL that IS live instead of consolidating it.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL, once the real domain exists. Set it in Vercel and
 *      everything below follows with no code change.
 *   2. The Vercel production alias, so a deploy with no domain self-canonicalises
 *      to the URL it is actually served from.
 *   3. localhost for local builds.
 *
 * NOTE it deliberately does NOT fall back to VERCEL_URL, the per-deployment
 * hostname. That changes on every deploy, so canonicalising to it would point
 * each build at a different URL and split the entity rather than consolidate it.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const productionAlias = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionAlias) return `https://${productionAlias}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolve();
