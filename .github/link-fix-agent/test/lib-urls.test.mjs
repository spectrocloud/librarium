import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findUrls, urlChanges, withoutFragment } from "../lib/urls.mjs";

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

describe("withoutFragment", () => {
  it("drops the fragment", () => {
    assert.equal(withoutFragment("https://example.com/page#section"), "https://example.com/page");
  });

  it("returns a URL without a fragment unchanged", () => {
    assert.equal(withoutFragment("https://example.com/page?q=1"), "https://example.com/page?q=1");
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
