// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require("dotenv").config();
const themes = require("prism-react-renderer").themes;
const lightCodeTheme = themes.oceanicNext;
const darkCodeTheme = themes.dracula;
const redirects = require("./redirects");
const ArchivedVersions = require("./archiveVersions.json");
const { pluginPacksAndIntegrationsData } = require("./plugins/packs-integrations");
const { pluginImportFontAwesomeIcons } = require("./plugins/font-awesome");
import path from "path";

// Logo paths are hardcoded or we use the default logos.
function getLightLogoPath() {
  if (process.env.CUSTOM_LIGHT_LOGO && process.env.CUSTOM_LIGHT_LOGO.trim() === "true") {
    return "img/custom-light-logo.svg";
  }

  return "img/spectrocloud-logo-light.svg?new=true";
}

// Logo paths are hardcoded through Docker mounts or we use the default logos.
function getDarkLogoPath() {
  if (process.env.CUSTOM_DARK_LOGO && process.env.CUSTOM_DARK_LOGO.trim() === "true") {
    return "img/custom-dark-logo.svg";
  }

  return "img/spectrocloud-logo-dark.svg?new=true";
}

// We will only show the update time if the environment variable is set to true.
function showLastUpdateTime() {
  const envValue = process.env.SHOW_LAST_UPDATE_TIME || "";
  const trimmedValue = envValue.trim().toLowerCase();
  if (trimmedValue === "true") {
    return true;
  }

  return false;
}

// The list of all scripts to be loaded on the site.
const allScripts = [
  {
    src: `https://w.appzi.io/w.js?token=${process.env.APPZI_TOKEN}`,
    defer: true,
  },
  {
    src: "/scripts/kapa-shortcut.js",
    async: false,
  },
  {
    src: "https://widget.kapa.ai/kapa-widget.bundle.js",
    "data-website-id": "9c212df9-d1fc-4f65-9c93-8bcd9c8ec6ca",
    "data-project-name": "Spectro Cloud Docs AI",
    "data-project-color": "#3A9D99",
    "data-consent-required": "true",
    "data-consent-screen-title": "Privacy Notice",
    "data-consent-screen-disclaimer":
      "Thank you for using our chat service!  Information you submit through this chat is subject to our [Privacy Policy and Terms of Use](https://www.spectrocloud.com/privacy-policy) and will be processed by our service provider. Please do not enter sensitive information. Chat transcripts may be kept for future reference.",
    "data-consent-screen-accept-button-text": "Accept",
    "data-consent-screen-reject-button-text": "Decline",
    "data-project-logo": "/img/spectrocloud-mark-light-bkgd-RGB.svg",
    "data-modal-title": "Spectro Cloud - Ask Docs",
    "data-modal-disclaimer":
      "This AI bot provides responses based solely on your input and the latest available version of Spectro Cloud’s public documentation. Its output is for informational purposes only and should not be considered official guidance. Please do not share any personally identifiable information (PII) or sensitive data. By using this service, you agree to our [Privacy Policy](https://www.spectrocloud.com/privacy-policy). \n\n Note that the bot does not have access to past versions of the documentation and cannot answer version-specific questions.",
    "data-modal-x-offset": "0",
    "data-modal-y-offset": "0",
    "data-modal-with-overlay": "false",
    "data-modal-inner-flex-direction": "column",
    "data-modal-inner-justify-content": "end",
    "data-modal-inner-max-width": "400px",
    "data-modal-inner-position-right": "20px",
    "data-modal-inner-position-bottom": "calc(2.5rem + 25px)",
    "data-button-height": "5rem",
    "data-button-width": "5rem",
    "data-button-text": "Ask AI",
    "data-conversation-button-icons-only": "true",
    "data-modal-size": "80%",
    "data-modal-lock-scroll": "false",
    "data-modal-inner-position-left": "auto",
    async: true,
  },
  {
    src: "/scripts/fullstory.js",
    type: "text/javascript",
  },
  {
    type: "text/javascript",
    src: "/scripts/googleTagManager.js",
    "dataLayer": "GTM-T2F9ZMS"
  },
  {
    src: "https://cdn.seersco.com/banners/55793/23380/cb.js",
    id: "seers-cmp",
    async: "true",
    "data-key": process.env.SEERS_CMP_KEY,
    "data-name": "CookieXray",
    type: "text/javascript",
  },
];

// Load only Kapa and Seers for local development.
const localScripts = [allScripts[1], allScripts[2], allScripts[5]];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Palette",
  tagline: "Palette",
  favicon: "img/favicon.png",
  url: "https://docs.spectrocloud.com",
  baseUrl: "/",
  organizationName: "Spectro Cloud",
  // Usually your GitHub org/user name.
  projectName: "Spectro Cloud docs",
  // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "throw",
  trailingSlash: true,
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true, // Slightly decreases padding of admonitions when set to `true`.
    },
    experimental_faster: {
      ssgWorkerThreads: false, // Set to 'false' as Netlify builds fail with this enabled.
      swcJsLoader: false, // Set to 'false' as Netlify builds fail with this enabled.
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      mdxCrossCompilerCache: true,
    },
  },
  customFields: {
    // Used to access the environment variable in the build process during the client-side step
    DISABLE_PACKS_INTEGRATIONS: process.env.DISABLE_PACKS_INTEGRATIONS,
  },
  staticDirectories: ["static", "static/assets/docs/images", "static/assets", "static/img/"],
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://cdn.seersco.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://cdn-auth.seersco.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "https://cdn.seersco.com/banners/55793/23380/cb.js",
        as: "script",
      },
    },
  ],
  stylesheets: [],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          path: "docs/docs-content",
          showLastUpdateAuthor: false,
          showLastUpdateTime: showLastUpdateTime(),
          routeBasePath: "/",
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: "latest",
              banner: process.env.UNRELEASED_VERSION_BANNER == "true" ? "unreleased" : "none",
            },
          },
          admonitions: {
            keywords: ["preview", "further"],
            extendDefaults: true,
          },
          // exclude: ["api/v1/palette-apis-3-4"],

          sidebarPath: require.resolve("./sidebars.js"),
          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
            const { docs } = args;
            const filteredDocs = docs.filter((doc) => {
              return true;
            });
            const sidebarItems = await defaultSidebarItemsGenerator({
              ...args,
              docs: filteredDocs,
            });
            return sidebarItems;
          },
          editUrl: "https://github.com/spectrocloud/librarium/blob/master",
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      },
    ],
  ],
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "docs/api-content/api-docs",
        routeBasePath: "api",
        docItemComponent: "@theme/ApiItem",
        lastVersion: "current",
        includeCurrentVersion: true,
        admonitions: {
          keywords: ["preview", "further"],
          extendDefaults: true,
        },
        versions: {
          current: {
            label: "latest",
          },
        },
        sidebarPath: require.resolve("./apisidebar.js"),
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        // Visit https://docusaurus-openapi.tryingpan.dev/#config to learn more about this plugin's config options.
        id: "apidocs",
        docsPluginId: "api",
        config: {
          palette: {
            specPath: "docs/api-content/api-docs/v1/api.json",
            outputDir: "docs/api-content/api-docs/v1",
            downloadUrl:
              "https://github.com/spectrocloud/librarium/blob/master/docs/api-content/api-docs/palette-apis.json",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            template: "api.mustache",
            // Customize API MDX with mustache template
            hideSendButton: true,
          },
          emc: {
            specPath: "docs/api-content/api-docs/edge-v1/emc-api.json",
            outputDir: "docs/api-content/api-docs/edge-v1",
            downloadUrl:
              "https://github.com/spectrocloud/librarium/blob/master/docs/api-content/api-docs/palette-apis.json",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            template: "api.mustache",
            // Customize API MDX with mustache template
            hideSendButton: true,
          },
        },
      },
    ],
    process.env.NODE_ENV !== "production" && [
      () => ({
        name: "plugin-enable-source-map",
        configureWebpack() {
          return {
            devtool: "source-map",
          };
        },
      }),
      {
        id: "enable-source-map",
      },
    ],
    [
      pluginPacksAndIntegrationsData,
      {
        repositories: ["Palette Registry", "Public Repo", "Palette Community Registry"],
      },
    ],
    pluginImportFontAwesomeIcons,
    function () {
      return {
        name: "plugin-watch-custom-plugin-path",
        getPathsToWatch() {
          return ["plugins/font-awesome.js", "plugins/packs-integrations.js"];
        },
      };
    },
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 50,
        max: 1035,
        steps: 4,
        disableInDev: false,
      },
    ],
    [
      require.resolve("docusaurus-plugin-image-zoom"),
      {
        id: "docusaurus-plugin-image-zoom",
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [...redirects],
      },
    ],
  ].filter(Boolean),
  scripts: process.env.NODE_ENV === "production" ? allScripts : localScripts,
  themes: ["docusaurus-theme-openapi-docs"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      // announcementBar: {
      //   id: "docs_announcement_bar",
      //   content:
      //     REPLACE MESSAGE BELOW
      //     'The 2024 State of Production Kubernetes report is now available and it\'s full of insights and goodies. Click <a target="_blank" rel="noopener noreferrer" href="https://www.spectrocloud.com/news/2024-state-of-production-kubernetes">here to get your own copy.</a>',
      //   backgroundColor: "#FBB117",
      //   textColor: "#091E42",
      //   isCloseable: false,
      // },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: false,
          autoCollapseCategories: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      // Replace with your project's social card
      image: "img/spectrocloud-social-card.png",
      navbar: {
        title: "",
        logo: {
          href: "/",
          target: "self",
          width: 105,
          height: 48,
          alt: "Spectro cloud logo",
          src: getLightLogoPath(),
          srcDark: getDarkLogoPath(),
        },
        items: [
          {
            to: "/",
            type: "docSidebar",
            sidebarId: "docSidebar",
            label: "Docs",
            position: "left",
            activeBaseRegex: "^(?!/api/).*$",
          },
          {
            to: "/tutorials",
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            label: "Tutorials",
            position: "left",
            activeBaseRegex: "^(?!/api/).*$",
          },
          {
            to: "/downloads",
            type: "docSidebar",
            sidebarId: "downloadsSidebar",
            label: "Downloads",
            position: "left",
            activeBaseRegex: "^(?!/api/).*$",
          },
          {
            to: "/api/introduction",
            label: "API",
            position: "left",
          },
          {
            href: "https://github.com/spectrocloud/librarium",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
          {
            type: "docsVersionDropdown",
            position: "left",
            docsPluginId: "default",
            dropdownItemsAfter: [
              ...Object.entries(ArchivedVersions).map(([versionName, versionUrl]) => ({
                href: versionUrl,
                label: versionName,
              })),
            ],
          },
          {
            type: "docsVersionDropdown",
            position: "left",
            docsPluginId: "api",
            dropdownItemsAfter: [
              ...Object.entries(ArchivedVersions).map(([versionName, versionUrl]) => ({
                href: versionUrl,
                label: versionName,
              })),
            ],
          },
        ],
        hideOnScroll: true,
      },
      languageTabs: [
        {
          highlight: "bash",
          language: "curl",
          logoClass: "curl",
        },
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
          variant: "requests",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
        {
          highlight: "javascript",
          language: "nodejs",
          logoClass: "nodejs",
          variant: "axios",
        },
        {
          highlight: "java",
          language: "java",
          logoClass: "java",
          variant: "unirest",
        },
      ],
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.ALGOLIA_APP_ID,
        // Public API key: it is safe to commit it
        apiKey: process.env.ALGOLIA_SEARCH_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME,
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "external\\.com|domain\\.com",
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: "/docs/",
          // or as RegExp: /\/docs\//
          to: "/",
        },
        // Optional: Algolia search parameters
        searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",
        maxResultsPerGroup: 7,
      },
      sidebar: {
        hideable: true,
      },
      prism: {
        defaultLanguage: "json",
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["hcl", "bash", "json", "powershell", "go", "javascript", "rust"],
        magicComments: [
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: {
              start: "highlight-start",
              end: "highlight-end",
            },
          },
          {
            className: "code-block-error-line",
            line: "This will error",
          },
        ],
      },
      zoom: {
        selector: ".markdown-image",
        background: {
          light: "rgb(255, 255, 255)",
          dark: "rgb(50, 50, 50)",
        },
        config: {},
      },
    },
};
module.exports = config;
export default function (context, options) {
  return {
    name: "@docusaurus/plugin-content-docs",
    getPathsToWatch() {
      const contentPath = path.resolve(context.siteDir, options.path);
      return [`${contentPath}/_partials/*/*.{mdx}`];
    },
  };
}
