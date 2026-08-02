import type { Artist } from './types';

/**
 * Every profile URL below was verified live on 2026-08-02, not copied from the
 * design handoff (which shipped `href="#"` placeholders for all of them).
 *
 * Handles came from the connected-account list in Blotato, which is the source
 * of truth for which accounts actually exist. Do not guess these from the
 * artist name: youtube.com/@goldieboone is a 404, the real channel is
 * @GoldieBooneMusic. Instagram and TikTok both return HTTP 200 for handles that
 * do not exist, so status codes alone are not evidence there.
 *
 * Apple Music URLs are storefront-neutral (no /us/). Apple geo-redirects each
 * visitor to their own storefront; a hardcoded /us/ pins everyone to the US.
 */
export const goldie: Artist = {
  name: 'Goldie Boone',
  genre: 'Country',
  bios: {
    short:
      'Neotraditional country from a small Southern town. Story songs, sung plain.',
    long:
      'Goldie Boone grew up in a small Southern town where everybody already knew everything about everybody. She started writing because saying things out loud was harder than singing them.',
  },
  profiles: {
    spotify: 'https://open.spotify.com/artist/4vvphMdulCwf5c2dXikEcz',
    appleMusic: 'https://music.apple.com/artist/goldie-boone/6779835494',
    instagram: 'https://www.instagram.com/goldieboonemusic/',
    youtube: 'https://www.youtube.com/@GoldieBooneMusic',
    tiktok: 'https://www.tiktok.com/@goldieboonemusic',
  },
  /**
   * Structural disclosure. The label is worded exactly this way and must never
   * be styled more quietly than the links beside it, per the handoff. The route
   * itself is out of scope for v1; the link exists so the page has a home.
   */
  provenanceHref: '/how-these-songs-are-made',
  provenanceLabel: 'How these songs are made',
};
