import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  checkPages,
  formatResults,
  linkedUrls,
  partialId,
  planPages,
  previewPassed,
  rendersPartial,
  resolveRoute,
  routeForDocFile,
  sitemapPaths,
} from "../check-preview.mjs";

const OLD = "https://old.example.com/guide";
const NEW = "https://new.example.com/guide";
const BASE = "https://deploy-preview-1--docs.example.com";

describe("routeForDocFile", () => {
  it("serves a/b/c.md at /a/b/c/", () => {
    assert.equal(
      routeForDocFile("docs/docs-content/clusters/cluster-management/backup.md"),
      "/clusters/cluster-management/backup/"
    );
  });

  it("drops the .mdx extension too", () => {
    assert.equal(routeForDocFile("docs/docs-content/clusters/backup.mdx"), "/clusters/backup/");
  });

  it("serves a folder's index.md at the folder", () => {
    assert.equal(routeForDocFile("docs/docs-content/clusters/index.md"), "/clusters/");
    assert.equal(routeForDocFile("docs/docs-content/clusters/backup/index.mdx"), "/clusters/backup/");
  });

  it("serves a file named after its folder at the folder", () => {
    assert.equal(routeForDocFile("docs/docs-content/clusters/clusters.md"), "/clusters/");
  });

  it("serves a top-level file at its own name", () => {
    assert.equal(routeForDocFile("docs/docs-content/glossary-all.md"), "/glossary-all/");
  });
});

describe("partialId", () => {
  it("returns the category and the name without the underscore and extension", () => {
    assert.deepEqual(partialId("_partials/getting-started/_deploy-cluster.mdx"), {
      category: "getting-started",
      name: "deploy-cluster",
    });
  });

  it("keeps a nested category's full path and handles .md", () => {
    assert.deepEqual(partialId("_partials/self-hosted/install/_step.md"), {
      category: "self-hosted/install",
      name: "step",
    });
  });
});

describe("rendersPartial", () => {
  const id = { category: "getting-started", name: "deploy-cluster" };

  it("is true when the page uses the partial's category and name", () => {
    const page = '<PartialsComponent\n  category="getting-started"\n  name="deploy-cluster"\n/>';
    assert.equal(rendersPartial(page, id), true);
  });

  it("is false when the category or the name differs", () => {
    assert.equal(rendersPartial('<PartialsComponent category="other" name="deploy-cluster" />', id), false);
    assert.equal(rendersPartial('<PartialsComponent category="getting-started" name="other" />', id), false);
    assert.equal(rendersPartial("No partials here.", id), false);
  });

  it("is false when the page renders a different partial with the category and another with the name", () => {
    const page = [
      '<PartialsComponent category="getting-started" name="other" />',
      '<PartialsComponent category="other" name="deploy-cluster" />',
    ].join("\n");
    assert.equal(rendersPartial(page, id), false);
  });
});

describe("sitemapPaths", () => {
  it("returns the pathname of each <loc>", () => {
    const xml = `<urlset><url><loc>${BASE}/clusters/</loc></url><url><loc>${BASE}/clusters/backup/</loc></url></urlset>`;
    assert.deepEqual(sitemapPaths(xml), new Set(["/clusters/", "/clusters/backup/"]));
  });

  it("returns an empty set when the sitemap is empty or did not load", () => {
    assert.deepEqual(sitemapPaths(""), new Set());
    assert.deepEqual(sitemapPaths("<html>Not found</html>"), new Set());
  });

  it("throws on a <loc> that is not an absolute URL", () => {
    assert.throws(() => sitemapPaths("<loc>/relative/</loc>"), TypeError);
  });
});

describe("resolveRoute", () => {
  const paths = new Set(["/clusters/", "/clusters/backup/", "/custom-slug/install/", "/a/overview/", "/b/overview/"]);

  it("returns the route when the sitemap lists it", () => {
    assert.equal(resolveRoute("/clusters/backup/", paths), "/clusters/backup/");
  });

  it("falls back to the one sitemap path that ends in the same segment", () => {
    assert.equal(resolveRoute("/getting-started/install/", paths), "/custom-slug/install/");
  });

  it("returns null when several sitemap paths end in the same segment", () => {
    assert.equal(resolveRoute("/c/overview/", paths), null);
  });

  it("returns null when nothing matches", () => {
    assert.equal(resolveRoute("/missing/", paths), null);
    assert.equal(resolveRoute("/clusters/backup/", new Set()), null);
  });
});

describe("linkedUrls", () => {
  it("finds a URL in a quoted or an unquoted attribute", () => {
    assert.deepEqual(linkedUrls(`<a href="${NEW}">guide</a>`), new Set([NEW]));
    assert.deepEqual(linkedUrls(`<a href=${NEW} target=_blank>guide</a>`), new Set([NEW]));
    assert.deepEqual(linkedUrls(`<a href=${NEW}>guide</a>`), new Set([NEW]));
  });

  it("drops the fragment, and finds a URL at the end of the text", () => {
    assert.deepEqual(linkedUrls(`<a href="${NEW}#install">`), new Set([NEW]));
    assert.deepEqual(linkedUrls(`see ${NEW}`), new Set([NEW]));
  });

  it("finds a URL whose & the HTML escapes as &amp;", () => {
    assert.deepEqual(
      linkedUrls('<a href="https://example.com/a?b=1&amp;c=2">'),
      new Set(["https://example.com/a?b=1&c=2"])
    );
  });

  it("returns a bare domain in linkinator's form, with its trailing slash", () => {
    assert.deepEqual(linkedUrls('<a href="https://kubevirt.io">KubeVirt</a>'), new Set(["https://kubevirt.io/"]));
  });

  it("keeps a longer URL whole, so it does not count as the URL it starts with", () => {
    const urls = linkedUrls(`<a href="${NEW}/v2"> <a href="${NEW}?page=2">`);
    assert.deepEqual(urls, new Set([`${NEW}/v2`, `${NEW}?page=2`]));
    assert.equal(urls.has(NEW), false);
  });

  it("returns an empty set for a page without links", () => {
    assert.deepEqual(linkedUrls("<p>No links.</p>"), new Set());
    assert.deepEqual(linkedUrls(""), new Set());
  });
});

describe("planPages", () => {
  const sitemap = new Set(["/clusters/backup/", "/clusters/restore/", "/a/overview/", "/b/overview/"]);
  const swap = (path) => ({ path, before: `[guide](${OLD}#setup)`, after: `[guide](${NEW}#setup)` });

  it("maps a changed docs page to its preview page with the URLs it added and removed", () => {
    const { pages, missing } = planPages([swap("docs/docs-content/clusters/backup.md")], {
      sitemap,
      pagesUsingPartial: () => assert.fail("not a partial"),
    });
    assert.deepEqual(missing, []);
    assert.deepEqual(
      pages,
      new Map([
        [
          "/clusters/backup/",
          {
            sources: new Set(["docs/docs-content/clusters/backup.md"]),
            added: new Set([NEW]),
            removed: new Set([OLD]),
          },
        ],
      ])
    );
  });

  it("maps a changed partial to every page that renders it", () => {
    const { pages, missing } = planPages([swap("_partials/clusters/_shared.mdx")], {
      sitemap,
      pagesUsingPartial: (file) => {
        assert.equal(file, "_partials/clusters/_shared.mdx");
        return ["docs/docs-content/clusters/backup.md", "docs/docs-content/clusters/restore.md"];
      },
    });
    assert.deepEqual(missing, []);
    assert.deepEqual([...pages.keys()], ["/clusters/backup/", "/clusters/restore/"]);
    assert.deepEqual(pages.get("/clusters/restore/").sources, new Set(["_partials/clusters/_shared.mdx"]));
  });

  it("merges a page and a partial that the page renders into one preview page", () => {
    const { pages } = planPages(
      [
        swap("docs/docs-content/clusters/backup.md"),
        {
          path: "_partials/clusters/_shared.mdx",
          before: "[x](https://a.example.com)",
          after: "[x](https://b.example.com)",
        },
      ],
      { sitemap, pagesUsingPartial: () => ["docs/docs-content/clusters/backup.md"] }
    );
    assert.equal(pages.size, 1);
    const page = pages.get("/clusters/backup/");
    assert.deepEqual(page.sources, new Set(["docs/docs-content/clusters/backup.md", "_partials/clusters/_shared.mdx"]));
    assert.deepEqual(page.added, new Set([NEW, "https://b.example.com/"]));
    assert.deepEqual(page.removed, new Set([OLD, "https://a.example.com/"]));
  });

  it("keys the added and removed URLs as linkinator reports them", () => {
    const { pages } = planPages(
      [
        {
          path: "docs/docs-content/clusters/backup.md",
          before: "[x](https://WWW.Weave.Works)",
          after: "[x](https://kubevirt.io#a)",
        },
      ],
      { sitemap, pagesUsingPartial: () => [] }
    );
    const page = pages.get("/clusters/backup/");
    assert.deepEqual(page.added, new Set(["https://kubevirt.io/"]));
    assert.deepEqual(page.removed, new Set(["https://www.weave.works/"]));
  });

  it("reports a partial that no page renders", () => {
    const { pages, missing } = planPages([swap("_partials/clusters/_unused.mdx")], {
      sitemap,
      pagesUsingPartial: () => [],
    });
    assert.equal(pages.size, 0);
    assert.deepEqual(missing, ["_partials/clusters/_unused.mdx: no page renders this partial"]);
  });

  it("reports a page that has no single preview page", () => {
    const { pages, missing } = planPages([swap("docs/docs-content/c/overview.md")], {
      sitemap,
      pagesUsingPartial: () => [],
    });
    assert.equal(pages.size, 0);
    assert.deepEqual(missing, [
      "docs/docs-content/c/overview.md: no single preview page for docs/docs-content/c/overview.md (tried /c/overview/)",
    ]);
  });
});

describe("checkPages", () => {
  const page = (added, removed) => ({
    sources: new Set(["docs/docs-content/a.md"]),
    added: new Set(added),
    removed: new Set(removed),
  });
  const fakeFetch = (responses) => {
    const fetched = [];
    const fetchPage = async (url) => {
      fetched.push(url);
      return responses[url];
    };
    return { fetched, fetchPage };
  };

  it("passes a page that shows the new URL and not the removed one", async () => {
    const { fetched, fetchPage } = fakeFetch({ [`${BASE}/a/`]: { status: 200, ok: true, text: `<a href="${NEW}">` } });
    const results = await checkPages(new Map([["/a/", page([NEW], [OLD])]]), BASE, fetchPage);
    assert.deepEqual(fetched, [`${BASE}/a/`]);
    assert.deepEqual(results, [
      { url: `${BASE}/a/`, sources: ["docs/docs-content/a.md"], status: 200, notShown: [], stillShown: [], ok: true },
    ]);
  });

  it("fails a page that is missing the new URL or still shows the removed one", async () => {
    const { fetchPage } = fakeFetch({ [`${BASE}/a/`]: { status: 200, ok: true, text: `<a href="${OLD}">` } });
    const [result] = await checkPages(new Map([["/a/", page([NEW], [OLD])]]), BASE, fetchPage);
    assert.equal(result.ok, false);
    assert.deepEqual(result.notShown, [NEW]);
    assert.deepEqual(result.stillShown, [OLD]);
  });

  it("passes a bare domain that the page links to without its trailing slash", async () => {
    const { fetchPage } = fakeFetch({
      [`${BASE}/a/`]: { status: 200, ok: true, text: '<a href="https://kubevirt.io">KubeVirt</a>' },
    });
    const [result] = await checkPages(
      new Map([["/a/", page(["https://kubevirt.io/"], ["https://www.weave.works/"])]]),
      BASE,
      fetchPage
    );
    assert.equal(result.ok, true);
  });

  it("fails a page that still shows a removed bare domain", async () => {
    const { fetchPage } = fakeFetch({
      [`${BASE}/a/`]: { status: 200, ok: true, text: `<a href="${NEW}"> <a href="https://www.weave.works">` },
    });
    const [result] = await checkPages(new Map([["/a/", page([NEW], ["https://www.weave.works/"])]]), BASE, fetchPage);
    assert.equal(result.ok, false);
    assert.deepEqual(result.stillShown, ["https://www.weave.works/"]);
  });

  it("fails a page that did not load, and ignores its error page's text", async () => {
    const { fetchPage } = fakeFetch({ [`${BASE}/a/`]: { status: 404, ok: false, text: `<a href="${OLD}">` } });
    const [result] = await checkPages(new Map([["/a/", page([NEW], [OLD])]]), BASE, fetchPage);
    assert.deepEqual(result, {
      url: `${BASE}/a/`,
      sources: ["docs/docs-content/a.md"],
      status: 404,
      notShown: [NEW],
      stillShown: [],
      ok: false,
    });
  });

  it("returns no results when there are no pages", async () => {
    assert.deepEqual(await checkPages(new Map(), BASE, () => assert.fail("nothing to fetch")), []);
  });
});

describe("previewPassed", () => {
  const ok = { ok: true };
  const failed = { ok: false };

  it("is true when every page passed and every file had a page", () => {
    assert.equal(previewPassed([ok, ok], []), true);
  });

  it("is false when no page was checked", () => {
    assert.equal(previewPassed([], []), false);
  });

  it("is false when a page failed or a file had no page", () => {
    assert.equal(previewPassed([ok, failed], []), false);
    assert.equal(previewPassed([ok], ["_partials/x/_y.mdx: no page renders this partial"]), false);
  });
});

describe("formatResults", () => {
  it("prints PASS and FAIL lines, the URLs that failed, the missing pages, and the totals", () => {
    const results = [
      { url: `${BASE}/a/`, status: 200, notShown: [], stillShown: [], ok: true },
      { url: `${BASE}/b/`, status: 200, notShown: [NEW], stillShown: [OLD], ok: false },
    ];
    assert.equal(
      formatResults(results, ["_partials/x/_y.mdx: no page renders this partial"]),
      [
        `PASS 200 ${BASE}/a/`,
        `FAIL 200 ${BASE}/b/`,
        `  new URL not on the page: ${NEW}`,
        `  removed URL still on the page: ${OLD}`,
        "FAIL _partials/x/_y.mdx: no page renders this partial",
        "Pages checked: 2  Failed: 2",
      ].join("\n")
    );
  });

  it("prints only the totals when there was nothing to check", () => {
    assert.equal(formatResults([], []), "Pages checked: 0  Failed: 0");
  });
});

describe("routeForDocFile outside docs-content", () => {
  it("serves a product page under the product's folder name", () => {
    assert.equal(
      routeForDocFile("docs/products/paletteai-inference-launchpad/release-notes.md"),
      "/paletteai-inference-launchpad/release-notes/"
    );
  });

  it("returns null for a file outside the docs", () => {
    assert.equal(routeForDocFile("README.md"), null);
  });

  it("reports a changed file with no route as missing instead of throwing", () => {
    const { pages, missing } = planPages([{ path: "docs/other/a.md", before: "", after: "" }], {
      sitemap: new Set(["/a/"]),
      pagesUsingPartial: () => [],
    });
    assert.equal(pages.size, 0);
    assert.deepEqual(missing, ["docs/other/a.md: no single preview page for docs/other/a.md (tried no route)"]);
  });
});
