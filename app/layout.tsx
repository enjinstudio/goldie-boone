import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { fontVariables } from './fonts';
import { buildSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site-url';

import './globals.css';

const SITE = SITE_URL;

/**
 * A GA4 measurement ID is public by design, since it ships in the page source
 * on every request. So it is a constant here rather than an env var: reading it
 * from the environment would buy no secrecy and would add a silent failure mode,
 * where a build with the var unset drops analytics with no error.
 */
const GA_MEASUREMENT_ID = 'G-06ZKVE39GD';

/**
 * Titles carry the artist name plus the current record, because the query these
 * pages actually compete for is the artist name, and the album is what makes
 * the result worth clicking. Keep the name first: search engines truncate the
 * tail, never the head.
 */
const TITLE = 'Goldie Boone, Well Water';
const DESCRIPTION =
  'Neotraditional country from a small Southern town. Well Water, the second album, out August 7. Listen to Homegrown on Apple Music and Spotify.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s | Goldie Boone',
  },
  description: DESCRIPTION,
  applicationName: 'Goldie Boone',
  authors: [{ name: 'Goldie Boone', url: SITE }],
  creator: 'Goldie Boone',
  publisher: 'Goldie Boone',
  category: 'music',
  keywords: [
    'Goldie Boone',
    'Well Water',
    'Homegrown',
    'country music',
    'neotraditional country',
    'Peach Season',
    'Sunday Dress',
  ],
  alternates: { canonical: '/' },
  /**
   * Explicit rather than inherited. `max-image-preview: large` is what lets the
   * album art appear at full size in Google results and Discover, which for a
   * music page is most of the click.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    siteName: 'Goldie Boone',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    locale: 'en_US',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Goldie Boone, Well Water, new album out August 7',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  // The page ground, so mobile browser chrome matches the paper rather than
  // flashing white above a cream page.
  themeColor: '#F4EBDA',
  // Her palette is deliberately daylight only. There is no dark variant, and
  // declaring that stops the browser inventing one.
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      {/* `grain` is the paper texture overlay. It is a ::after on the body so it
          sits above every section without needing an element in the tree. */}
      <body className="grain antialiased">
        {children}
        <script
          type="application/ld+json"
          // Static, developer-authored JSON built from typed content in
          // content/. No user input reaches it, so there is nothing to sanitise.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
        />
        {/* Google Analytics 4.
            `afterInteractive` deliberately, not `beforeInteractive`: this page
            is measured on LCP and analytics must never sit in front of the
            paint. It loads once the page is interactive, which is early enough
            that no real session is missed. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
          // Static, developer-authored config with no user input, matching the
          // JSON-LD block above.
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
          }}
        />
      </body>
    </html>
  );
}
