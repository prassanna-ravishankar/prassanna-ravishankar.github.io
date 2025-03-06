/**
 * Format a date into a readable string
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sort collection entries by date in descending order (newest first)
 * @param entries Collection entries with a pubDate property
 * @returns Sorted collection entries
 */
export function sortByDate<T extends { data: { pubDate: Date } }>(entries: T[]): T[] {
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
} 