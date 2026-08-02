/** Milliseconds to "3:41" for display on the sleeve tracklist. */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Milliseconds to ISO 8601 duration ("PT3M41S") for schema.org. */
export function toIsoDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  return `PT${Math.floor(total / 60)}M${total % 60}S`;
}

/** Total runtime of a set of tracks, as "36 minutes". */
export function totalRuntime(tracks: { durationMs: number }[]): string {
  const minutes = Math.round(
    tracks.reduce((sum, t) => sum + t.durationMs, 0) / 60_000,
  );
  return `${minutes} minutes`;
}
