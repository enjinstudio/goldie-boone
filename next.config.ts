import type { NextConfig } from 'next';

/**
 * NOT using `output: 'export'`, deliberately.
 *
 * The brief asks for fully static output AND for next/image to serve AVIF. Those
 * two are mutually exclusive: `output: 'export'` disables the image optimizer and
 * forces `unoptimized: true`, which would ship full-size JPEGs to a mostly-mobile
 * audience and blow the LCP < 2.0s budget.
 *
 * On Vercel this costs nothing. There is no database, no API route, no auth and
 * no server action, so every route still prerenders to static HTML. The page
 * carries `revalidate = 3600` purely so the release countdown stays accurate and
 * flips itself on 7 August without a deploy.
 */
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Do not leak sources for a site whose whole job is looking professional.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
