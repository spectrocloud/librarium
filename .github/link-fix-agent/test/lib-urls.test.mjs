import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { countUrls, findUrls, urlChanges, urlCountChanges, urlKey } from "../lib/urls.mjs";

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

describe("countUrls", () => {
  it("counts each URL's copies, and keeps each fragment as its own URL", () => {
    const text = "[a](https://a.example.com) [b](https://a.example.com) [c](https://a.example.com#x)";
    assert.deepEqual(
      countUrls(text),
      new Map([
        ["https://a.example.com", 2],
        ["https://a.example.com#x", 1],
      ])
    );
  });

  it("returns an empty map for text without URLs", () => {
    assert.deepEqual(countUrls("No links."), new Map());
  });
});

describe("urlCountChanges", () => {
  const A = "https://a.example.com";
  const B = "https://b.example.com";

  it("lists a URL that lost one of its copies as removed, and the URL that replaced it as added", () => {
    assert.deepEqual(urlCountChanges(countUrls(`${A} ${A}`), countUrls(`${A} ${B}`)), { removed: [A], added: [B] });
  });

  it("lists a URL that gained a copy as added", () => {
    assert.deepEqual(urlCountChanges(countUrls(`${A} ${B}`), countUrls(`${A} ${A}`)), { removed: [B], added: [A] });
  });

  it("returns sorted lists of URLs that are gone or new", () => {
    assert.deepEqual(
      urlCountChanges(countUrls(`${B} ${A}`), countUrls("https://d.example.com https://c.example.com")),
      {
        removed: [A, B],
        added: ["https://c.example.com", "https://d.example.com"],
      }
    );
  });

  it("returns empty lists when every URL keeps its count, even when the copies move", () => {
    assert.deepEqual(urlCountChanges(countUrls(`${A} ${B} ${A}`), countUrls(`${A} ${A} ${B}`)), {
      removed: [],
      added: [],
    });
    assert.deepEqual(urlCountChanges(new Map(), new Map()), { removed: [], added: [] });
  });
});
