import type { Metadata, Viewport } from 'next';
import { fontVariables } from './fonts';
import { buildSchema } from '@/lib/schema';

import './globals.css';

const SITE = 'https://goldieboonemusic.com';

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
      </body>
    </html>
  );
}
