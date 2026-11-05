// URL helpers that the link fix agent's checks share.

// A URL in Markdown or MDX ends at whitespace, a closing parenthesis or
// bracket, a quote, an angle bracket, or a backtick.
export const URL_PATTERN = /https?:\/\/[^\s)\]"'<>`]+/g;

/** Returns every URL in `text` as a Set. */
export function findUrls(text) {
  return new Set(text.match(URL_PATTERN) ?? []);
}

/**
 * Returns the URL as linkinator reports it: parsed, so a bare domain gains its
 * trailing slash and the host is lowercased, and without the #fragment. Text
 * that does not parse only loses its fragment.
 */
export function urlKey(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return url.split("#")[0];
  }
}

/** Compares two URL sets and returns the sorted URLs removed from `before` and added in `after`. */
export function urlChanges(before, after) {
  return {
    removed: [...before].filter((url) => !after.has(url)).sort(),
    added: [...after].filter((url) => !before.has(url)).sort(),
  };
}

/** Counts how many times each URL appears in `text`. */
export function countUrls(text) {
  const counts = new Map();
  for (const url of text.match(URL_PATTERN) ?? []) counts.set(url, (counts.get(url) ?? 0) + 1);
  return counts;
}

/**
 * Compares two URL counts from countUrls, and returns the sorted URLs that
 * appear fewer times in `after` (removed) and more times (added). Swapping one
 * copy of a URL that appears twice removes it, though the other copy stays.
 */
export function urlCountChanges(before, after) {
  const fewerIn = (a, b) => [...b].filter(([url, count]) => (a.get(url) ?? 0) < count).map(([url]) => url);
  return { removed: fewerIn(after, before).sort(), added: fewerIn(before, after).sort() };
}
