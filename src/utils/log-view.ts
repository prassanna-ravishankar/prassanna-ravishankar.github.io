// Log kinds, filters and row selection. Kept free of astro:content so the Log component's client script can share it.
export const BUILT_KINDS = ['pushed', 'release', 'project'] as const;
export const WRITTEN_KINDS = ['essay', 'poem', 'episode'] as const;
export type LogKind = (typeof BUILT_KINDS)[number] | (typeof WRITTEN_KINDS)[number];

export const LOG_FILTERS = [
  { id: 'all', label: 'all', kinds: [...BUILT_KINDS, ...WRITTEN_KINDS] },
  { id: 'built', label: 'built', kinds: [...BUILT_KINDS] },
  { id: 'essay', label: 'essays', kinds: ['essay'] },
  { id: 'poem', label: 'verse', kinds: ['poem'] },
  { id: 'episode', label: 'podcast', kinds: ['episode'] },
] as const;

export const isBuilt = (kind: string) => (BUILT_KINDS as readonly string[]).includes(kind);

/**
 * Which rows a filter shows, newest first, up to `limit`. When the filter mixes built and written kinds,
 * at most `builtCap` built rows are shown, so code activity cannot crowd writing off a short log.
 */
export function visibleRows(kinds: readonly string[], rowKinds: readonly string[], limit = Infinity, builtCap = Infinity) {
  const capped = kinds.some((k) => !isBuilt(k));
  let shown = 0;
  let built = 0;
  return rowKinds.map((kind) => {
    if (shown >= limit || !kinds.includes(kind)) return false;
    if (capped && isBuilt(kind) && built++ >= builtCap) return false;
    shown++;
    return true;
  });
}
