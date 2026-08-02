import localFont from 'next/font/local';

/**
 * Self-hosted, per the handoff: no runtime request to the Google Fonts CDN.
 *
 * All three are VARIABLE fonts, registered once with a weight range rather than
 * once per weight. Registering per-weight would ship byte-identical duplicates.
 *
 * They are also instanced and subset (see the note below), which is why the
 * whole type system is 128KB instead of 416KB:
 *
 *   Bodoni Moda   45KB -> 22KB   opsz pinned to 96, latin subset
 *   Bodoni italic 52KB -> 26KB   opsz pinned to 96, latin subset
 *   Newsreader   128KB -> 48KB   opsz pinned to 18, latin subset
 *   Archivo       34KB -> 27KB   latin subset
 *
 * WHY opsz IS PINNED, and why it matters for Bodoni specifically:
 * Bodoni Moda ships an optical-size axis spanning 6..96. The low end thickens
 * the hairlines so small text stays legible; the high end lets them go properly
 * thin. A didone set at display size using the TEXT optical master is the single
 * most common tell of an amateur build: the thick/thin contrast collapses and it
 * stops looking like Bodoni. We pin opsz to 96 because every place we use this
 * face is a large heading. Newsreader is pinned to 18 for the opposite reason:
 * it is only ever body copy.
 *
 * Consequence to know before editing: because opsz is baked in, setting
 * `font-variation-settings: 'opsz' N` in CSS now does nothing. If a small
 * Bodoni size is ever needed, re-instance the font rather than adding a CSS axis.
 */

export const bodoni = localFont({
  src: [
    { path: './fonts/bodonimoda-var.woff2', weight: '400 500', style: 'normal' },
    { path: './fonts/bodonimoda-var-italic.woff2', weight: '400 500', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display',
  fallback: ['Didot', 'Bodoni MT', 'Georgia', 'serif'],
});

export const newsreader = localFont({
  src: './fonts/newsreader-var.woff2',
  weight: '300 400',
  style: 'normal',
  display: 'swap',
  variable: '--font-body',
  fallback: ['Georgia', 'serif'],
});

export const archivo = localFont({
  src: './fonts/archivo-var.woff2',
  weight: '400 600',
  style: 'normal',
  display: 'swap',
  variable: '--font-micro',
  fallback: ['system-ui', 'sans-serif'],
});

export const fontVariables = `${bodoni.variable} ${newsreader.variable} ${archivo.variable}`;
