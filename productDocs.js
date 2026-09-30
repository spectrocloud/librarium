// Registry of independently versioned product doc sets.
//
// WHAT THIS IS FOR
// ----------------
// Docusaurus tracks "which version am I reading" per docs *collection* (its
// term: plugin instance), not per navbar tab. Everything under
// docs/docs-content -- core Palette docs, Tutorials, Downloads -- is one
// collection sharing one version, which is correct: they ship together.
//
// A product that releases on its own schedule needs its own collection, or it
// inherits Palette's version and Palette's version dropdown. Each entry below
// becomes one such collection.
//
// Old versions are kept as frozen folders in this repo (`<id>_versioned_docs/`)
// rather than as whole-site archive branches on separate domains, which is how
// Palette's own archives work. See docs/contributing/release-process.md.
//
// ADDING A PRODUCT
// ----------------
// Add an entry here, create the content directory, and add a sidebar file.
// That covers the docs collection, the navbar tab, the version dropdown, and
// the Palette navbar highlighting rule.
//
// It does NOT cover these, which have folder paths written into them. They are
// already wildcarded for `*_versioned_docs`, so a new product only needs the
// content path added where a wildcard cannot reach:
//
//   - .github/workflows/spellcheck-report.yaml  (scans `docs`, so covered)
//   - scripts/find-unused-images.sh             (scans `docs`, so covered)
//   - .prettierignore / .vale.ini               (wildcarded, so covered)
//   - .vale.ini per-file rule exceptions        (only if the product needs any)
//
// KNOWN CEILING: the navbar is already crowded with one product. Before adding
// a third, group product tabs under a single "Products" dropdown rather than
// adding more top-level tabs.

const fs = require("fs");
const path = require("path");

/**
 * @typedef {Object} ProductDocs
 * @property {string} id            Collection id. Appears in the public Algolia
 *                                  `docusaurus_tag` facet and in the
 *                                  `<id>_versioned_docs/` folder name, so pick
 *                                  something readable and stable.
 * @property {string} label         Navbar tab text.
 * @property {string} routeBasePath URL prefix. Changing this breaks every URL.
 * @property {string} contentPath   Where the current (unfrozen) docs live.
 * @property {string} sidebarPath   Must be its own file -- see the comment in
 *                                  inferenceLaunchpadSidebar.js.
 * @property {string} sidebarId     Sidebar key. Frozen into every version
 *                                  snapshot; never rename after the first cut.
 * @property {Record<string, Record<string, unknown>>} [versionOverrides]
 *                                  Optional per-version presentation. Keys must
 *                                  already exist in <id>_versions.json.
 */

/** @type {ProductDocs[]} */
const PRODUCTS = [
  {
    id: "inference-launchpad",
    label: "PaletteAI Inference Launchpad",
    routeBasePath: "paletteai-inference-launchpad",
    contentPath: "docs/products/paletteai-inference-launchpad",
    sidebarPath: "./inferenceLaunchpadSidebar.js",
    sidebarId: "launchpadSidebar",
    versionOverrides: {
      // Example, once a version is cut:
      // "1.0.x": { label: "v1.0.x" },
    },
  },
];

/**
 * Versions that have actually been cut, newest first, read from disk.
 *
 * Docusaurus rejects a `versions` config key naming a version that does not
 * exist, so the config must follow the filesystem rather than the other way
 * round. This also lets the version dropdown appear on its own once there is
 * genuinely something to choose between.
 *
 * @param {string} id
 * @returns {string[]}
 */
function cutVersions(id) {
  const versionsFile = path.join(__dirname, `${id}_versions.json`);
  if (!fs.existsSync(versionsFile)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(versionsFile, "utf8"));
}

/**
 * Frozen versions are de-indexed, matching how version-* archive branches are
 * treated by .github/workflows/versions_robot.yaml. `noIndex` also removes them
 * from sitemap.xml, which keeps them out of the visual-regression sweep and the
 * Algolia crawler.
 *
 * `banner: "none"` suppresses the "no longer actively maintained" notice that
 * Docusaurus shows on an archived page. Three reasons:
 *
 *   - Palette's own archived sites at *.legacy.docs.spectrocloud.com show no
 *     such notice, so this keeps every archive on the site consistent.
 *   - Nothing routes a reader to an archived page by accident. They are
 *     de-indexed and absent from the sitemap, so neither a search engine nor
 *     site search reaches them, and an old bookmark cannot rot into one either,
 *     because a version lives at the unversioned URL while it is current.
 *   - Docusaurus builds the notice from the site-wide title, which is shared by
 *     every collection, so it named the wrong product on a product page. The
 *     only fix is to fork the DocVersionBanner theme component, which is a lot
 *     of copied code to maintain for a notice nobody arrives needing.
 *
 * The "Version: x" label that Docusaurus prints above the page title is kept on
 * archived pages and turned off on the current one. It carries only the version
 * label, so unlike the banner it cannot name the wrong product, which makes it a
 * cheap way to mark an archived page without forking a theme component. On the
 * current version it would tell the reader nothing.
 *
 * Both settings are explicit because Docusaurus turns the badge on for every
 * version, current included, as soon as a second version exists.
 *
 * The version dropdown also shows which version is being read, and switching
 * from it lands on the same page in the other version.
 *
 * @param {ProductDocs} product
 */
function buildVersionsConfig(product) {
  const versions = {
    current: { label: "latest", banner: "none", badge: false },
  };

  for (const version of cutVersions(product.id)) {
    versions[version] = {
      label: `v${version}`,
      banner: "none",
      noIndex: true,
      badge: true,
      ...(product.versionOverrides?.[version] ?? {}),
    };
  }

  return versions;
}

/**
 * The docs collection.
 *
 * `lastVersion: "current"` is load-bearing. Without it Docusaurus points the
 * base URL at the newest *frozen* version and moves the live docs to `/next/`,
 * changing every URL the day the first version is cut.
 *
 * @param {ProductDocs} product
 */
function toDocsPlugin(product) {
  return [
    "@docusaurus/plugin-content-docs",
    {
      id: product.id,
      path: product.contentPath,
      routeBasePath: product.routeBasePath,
      sidebarPath: require.resolve(product.sidebarPath),
      lastVersion: "current",
      includeCurrentVersion: true,
      versions: buildVersionsConfig(product),
      admonitions: {
        keywords: ["preview", "further", "deprecated"],
        extendDefaults: true,
      },
      editUrl: "https://github.com/spectrocloud/librarium/blob/master",
    },
  ];
}

/**
 * The navbar tab.
 *
 * `docsPluginId` is required: without it Docusaurus looks for the sidebar in
 * the `default` collection and throws at build time.
 *
 * @param {ProductDocs} product
 */
function toNavbarTab(product) {
  return {
    to: `/${product.routeBasePath}`,
    type: "docSidebar",
    docsPluginId: product.id,
    sidebarId: product.sidebarId,
    label: product.label,
    position: "left",
    activeBaseRegex: `^/${product.routeBasePath}(/.*)?$`,
  };
}

/**
 * The version dropdown.
 *
 * Emitted only once a version has been cut. With a single version Docusaurus
 * renders a plain "latest" link rather than a dropdown, which is a dead control
 * that just takes up navbar space.
 *
 * @param {ProductDocs} product
 */
function toVersionDropdown(product) {
  return {
    type: "docsVersionDropdown",
    position: "left",
    docsPluginId: product.id,
  };
}

const docsPlugins = PRODUCTS.map(toDocsPlugin);
const navbarTabs = PRODUCTS.map(toNavbarTab);
const versionDropdowns = PRODUCTS.filter((p) => cutVersions(p.id).length > 0).map(toVersionDropdown);

/**
 * Keeps the Docs / Tutorials / Downloads tabs from highlighting on routes that
 * belong to another collection. The `default` collection is mounted at "/", so
 * without this every product route also looks like a Docs route.
 */
const paletteNavbarActiveBaseRegex = `^(?!/api/|${PRODUCTS.map((p) => `/${p.routeBasePath}/`).join("|")}).*$`;

module.exports = {
  PRODUCTS,
  cutVersions,
  docsPlugins,
  navbarTabs,
  versionDropdowns,
  paletteNavbarActiveBaseRegex,
};
