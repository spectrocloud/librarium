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

// URL_PATTERN as one capturing group, so that split() keeps each URL.
const URL_SPLIT = new RegExp(`(${URL_PATTERN.source})`);

/** Splits text into its words and URLs, in document order. A token's key compares URLs by urlKey. */
function tokens(text) {
  return text.split(URL_SPLIT).flatMap((part, i) =>
    i % 2
      ? [{ url: part, key: `url ${urlKey(part)}` }]
      : part
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ key: `word ${word}` }))
  );
}

/**
 * Compares the links of two versions of a text by their place in it. Both
 * texts become lists of words and URLs, and the lists are aligned by their
 * longest common subsequence, so the words around a link anchor its URL.
 * Returns the URLs outside that subsequence, in document order: `removed`
 * from `before`, and `added` in `after`. Whitespace changes, such as a
 * Prettier reflow, change nothing.
 */
export function urlDiff(before, after) {
  const a = tokens(before);
  const b = tokens(after);
  const { removed, added } = lcsDiff(
    a.map((token) => token.key),
    b.map((token) => token.key)
  );
  return {
    removed: removed.map((i) => a[i].url).filter(Boolean),
    added: added.map((i) => b[i].url).filter(Boolean),
  };
}

/**
 * Returns the indexes of the items outside the longest common subsequence of
 * two lists of strings: `removed` from `a`, and `added` in `b`, each in order.
 * It uses Myers' diff, whose time grows with the number of edits rather than
 * with the lists' lengths, so a long page with a few changed links is fast.
 */
export function lcsDiff(a, b) {
  // Before each pass, `furthest` maps each diagonal k = x - y to how far along
  // `a` the best path reaches on it. Each pass allows one more edit.
  const passes = [];
  let furthest = new Map([[1, 0]]);
  for (let d = 0; ; d++) {
    passes.push(furthest);
    const next = new Map();
    for (let k = -d; k <= d; k += 2) {
      const from = previousDiagonal(furthest, k, d);
      let x = from === k + 1 ? furthest.get(from) : furthest.get(from) + 1;
      while (x < a.length && x - k < b.length && a[x] === b[x - k]) x++;
      next.set(k, x);
      if (x >= a.length && x - k >= b.length) return walkBack(passes, a.length, b.length);
    }
    furthest = next;
  }
}

/** Picks the diagonal that pass `d` steps from to reach diagonal `k`: down from k + 1 (an addition), or right from k - 1 (a removal). */
function previousDiagonal(furthest, k, d) {
  return k === -d || (k !== d && furthest.get(k - 1) < furthest.get(k + 1)) ? k + 1 : k - 1;
}

/** Walks the passes back from the end of both lists, and collects the edit that each pass made. */
function walkBack(passes, aLength, bLength) {
  const removed = [];
  const added = [];
  let x = aLength;
  let y = bLength;
  for (let d = passes.length - 1; d > 0; d--) {
    const k = x - y;
    const from = previousDiagonal(passes[d], k, d);
    const startX = passes[d].get(from);
    const startY = startX - from;
    if (from === k + 1) added.push(startY);
    else removed.push(startX);
    x = startX;
    y = startY;
  }
  return { removed: removed.reverse(), added: added.reverse() };
}
