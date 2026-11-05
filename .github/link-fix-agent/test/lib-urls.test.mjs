import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findUrls, fragmentOf, lcsDiff, urlChanges, urlDiff, urlKey } from "../lib/urls.mjs";

describe("findUrls", () => {
  it("finds the URL in a Markdown link and stops at the closing parenthesis", () => {
    assert.deepEqual(
      findUrls("See [the guide](https://example.com/guide) now."),
      new Set(["https://example.com/guide"])
    );
  });

  it("stops at quotes, angle brackets, brackets, and backticks", () => {
    const text = [
      '<a href="https://a.example.com/x">a</a>',
      "<https://b.example.com/y>",
      "[https://c.example.com/z]",
      "`https://d.example.com/w`",
      "url='https://e.example.com/v'",
    ].join("\n");
    assert.deepEqual(
      findUrls(text),
      new Set([
        "https://a.example.com/x",
        "https://b.example.com/y",
        "https://c.example.com/z",
        "https://d.example.com/w",
        "https://e.example.com/v",
      ])
    );
  });

  it("keeps query strings and fragments, and finds http URLs too", () => {
    assert.deepEqual(findUrls("http://example.com/a?b=1&c=2#d"), new Set(["http://example.com/a?b=1&c=2#d"]));
  });

  it("returns each URL once when it appears several times", () => {
    assert.equal(findUrls("https://example.com https://example.com").size, 1);
  });

  it("returns an empty set for text without URLs", () => {
    assert.deepEqual(findUrls("No links here, only ftp://example.com and example.com."), new Set());
    assert.deepEqual(findUrls(""), new Set());
  });
});

describe("urlKey", () => {
  it("drops the fragment", () => {
    assert.equal(urlKey("https://example.com/page#section"), "https://example.com/page");
    assert.equal(urlKey("https://example.com/page#"), "https://example.com/page");
  });

  it("returns a URL that is already in linkinator's form unchanged", () => {
    assert.equal(urlKey("https://example.com/page?q=1&r=2"), "https://example.com/page?q=1&r=2");
  });

  it("gives a bare domain its trailing slash and lowercases the host, as linkinator reports it", () => {
    assert.equal(urlKey("https://kubevirt.io"), "https://kubevirt.io/");
    assert.equal(urlKey("https://WWW.Weave.Works#top"), "https://www.weave.works/");
  });

  it("percent-encodes the characters that linkinator encodes", () => {
    assert.equal(urlKey("https://example.com/café"), "https://example.com/caf%C3%A9");
  });

  it("drops only the fragment of text that does not parse as a URL", () => {
    assert.equal(urlKey("https://[bad-host/page#section"), "https://[bad-host/page");
  });
});

describe("fragmentOf", () => {
  it("returns the part after the first #", () => {
    assert.equal(fragmentOf("https://example.com/guide#setup"), "setup");
    assert.equal(fragmentOf("https://example.com/guide?a=1#step-2"), "step-2");
    assert.equal(fragmentOf("https://example.com/guide#a#b"), "a#b");
  });

  it("returns an empty string for a URL with no fragment or an empty one", () => {
    assert.equal(fragmentOf("https://example.com/guide"), "");
    assert.equal(fragmentOf("https://example.com/guide#"), "");
  });
});

describe("urlChanges", () => {
  it("returns the sorted URLs removed and added", () => {
    const before = new Set(["https://z.example.com", "https://a.example.com", "https://keep.example.com"]);
    const after = new Set(["https://keep.example.com", "https://y.example.com", "https://b.example.com"]);
    assert.deepEqual(urlChanges(before, after), {
      removed: ["https://a.example.com", "https://z.example.com"],
      added: ["https://b.example.com", "https://y.example.com"],
    });
  });

  it("returns empty lists when nothing changed", () => {
    const urls = new Set(["https://example.com"]);
    assert.deepEqual(urlChanges(urls, new Set(urls)), { removed: [], added: [] });
    assert.deepEqual(urlChanges(new Set(), new Set()), { removed: [], added: [] });
  });
});

describe("lcsDiff", () => {
  /** The LCS length, by the textbook dynamic program, to check lcsDiff against. */
  function lcsLength(a, b) {
    let row = new Array(b.length + 1).fill(0);
    for (const item of a) {
      const next = [0];
      b.forEach((other, j) => next.push(item === other ? row[j] + 1 : Math.max(row[j + 1], next[j])));
      row = next;
    }
    return row[b.length];
  }

  /** The items that lcsDiff keeps, from `list` without the `dropped` indexes. */
  const kept = (list, dropped) => list.filter((_, i) => !dropped.includes(i));

  it("returns nothing for equal lists, including empty ones", () => {
    assert.deepEqual(lcsDiff(["a", "b", "c"], ["a", "b", "c"]), { removed: [], added: [] });
    assert.deepEqual(lcsDiff([], []), { removed: [], added: [] });
  });

  it("removes every item when the new list is empty, and adds every item when the old one is", () => {
    assert.deepEqual(lcsDiff(["a", "b"], []), { removed: [0, 1], added: [] });
    assert.deepEqual(lcsDiff([], ["a", "b"]), { removed: [], added: [0, 1] });
  });

  it("returns the indexes of a swapped item", () => {
    assert.deepEqual(lcsDiff(["a", "b", "c"], ["a", "x", "c"]), { removed: [1], added: [1] });
  });

  it("keeps the longest common subsequence when an item moves", () => {
    const a = ["u", "t1", "t2", "r"];
    const b = ["t1", "t2", "u"];
    const { removed, added } = lcsDiff(a, b);
    assert.deepEqual(kept(a, removed), ["t1", "t2"]);
    assert.deepEqual(kept(b, added), ["t1", "t2"]);
  });

  it("keeps a common subsequence of the longest length for random lists", () => {
    // A fixed linear congruential generator, so every run checks the same lists.
    let seed = 42;
    const random = (n) => (seed = (seed * 1103515245 + 12345) % 2 ** 31) % n;
    const randomList = () => Array.from({ length: random(12) }, () => "abcd"[random(4)]);
    for (let run = 0; run < 500; run++) {
      const [a, b] = [randomList(), randomList()];
      const { removed, added } = lcsDiff(a, b);
      const label = JSON.stringify({ a, b, removed, added });
      assert.deepEqual(kept(a, removed), kept(b, added), label);
      assert.equal(kept(a, removed).length, lcsLength(a, b), label);
      assert.deepEqual(
        removed,
        [...new Set(removed)].sort((x, y) => x - y),
        label
      );
      assert.deepEqual(
        added,
        [...new Set(added)].sort((x, y) => x - y),
        label
      );
      assert.ok(
        [...removed, ...added].every((i) => i >= 0),
        label
      );
      assert.ok(removed.every((i) => i < a.length) && added.every((i) => i < b.length), label);
    }
  });

  it("diffs a long list with a few edits quickly", () => {
    const a = Array.from({ length: 20_000 }, (_, i) => `w${i}`);
    const b = a.map((item, i) => (i === 10 || i === 19_990 ? `${item}-new` : item));
    const started = Date.now();
    assert.deepEqual(lcsDiff(a, b), { removed: [10, 19_990], added: [10, 19_990] });
    assert.ok(Date.now() - started < 1000);
  });
});

describe("urlDiff", () => {
  const U = "https://kubernetes.io/docs/concepts/";
  const R = "https://reported.example.com/tool";
  const ATT = "https://attacker.example.com/";

  it("returns the URL swapped at a link", () => {
    assert.deepEqual(urlDiff(`See [the guide](${R}).`, `See [the guide](${U}).`), { removed: [R], added: [U] });
  });

  it("catches a URL that moves to another link, because the words around each link anchor it", () => {
    const before = `See [the concepts](${U}). Install [the tool](${R}).`;
    const after = `See [the concepts](${ATT}). Install [the tool](${U}).`;
    assert.deepEqual(urlDiff(before, after), { removed: [U, R], added: [ATT, U] });
  });

  it("catches a URL that moves to an adjacent link with no words between them", () => {
    const { removed } = urlDiff(`[a](${U})[b](${R})`, `[a](${ATT})[b](${U})`);
    assert.ok(new Set(removed).has(U), JSON.stringify(removed));
  });

  it("ignores a reflow that keeps the links in order", () => {
    const before = `See the\n[guide](${R}) and [the concepts](${U}) here.`;
    const after = `See the [guide](${ATT})\nand [the concepts](${U})\n  here.`;
    assert.deepEqual(urlDiff(before, after), { removed: [R], added: [ATT] });
  });

  it("keeps the next link matched when a link is removed and its text kept", () => {
    const before = `Read [the tool guide](${R}) first. See [the concepts](${U}).`;
    const after = `Read the tool guide first. See [the concepts](${U}).`;
    assert.deepEqual(urlDiff(before, after), { removed: [R], added: [] });
  });

  it("compares URLs by urlKey, as linkinator reports them", () => {
    assert.deepEqual(urlDiff("[k](https://kubevirt.io)", "[k](https://KubeVirt.io/#top)"), { removed: [], added: [] });
  });

  it("returns every copy, in document order", () => {
    assert.deepEqual(urlDiff(`[a](${R}) [b](${R})`, `[a](${ATT}) [b](${U})`), { removed: [R, R], added: [ATT, U] });
  });

  it("returns empty lists for text without URLs", () => {
    assert.deepEqual(urlDiff("No links.", "No links here."), { removed: [], added: [] });
  });
});
