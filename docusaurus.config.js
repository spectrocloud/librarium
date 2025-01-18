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
    experimental_faster: {
      swcJsLoader: false, // Set to 'false' as Netlify builds fail with this enabled.
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
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
        href: "https://api.usercentrics.eu",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://app.usercentrics.eu",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "app.usercentrics.eu/browser-ui/latest/loader.js",
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
          showLastUpdateTime: false,
          routeBasePath: "/",
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: "latest",
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
        repositories: ["Palette Registry", "Public Repo", "Spectro Addon Repo", "Palette Community Registry"],
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
  /* IMPORTANT
  Any script added below must have the "data-usercentrics" attribute with the name of the script as the value. 
  We also need to notify marketing about the script being added so that they can update the Usercentrics CMP.
  Marketing needs to know what to label the script as, for example Analytics, Marketing, etc. And, if it's essential or not.
  Essential scripts are always loaded, non-essential scripts are loaded based on user consent.
  This is used to identify the script for Usercentrics CMP.
  Scripts also need to have the type attribute set to "text/plain" to prevent them from being executed by the browser in the event that the user has not given consent to the script.
  The exception to the text/plain rule is the Usercentrics CMP script which must be loaded as a script tag.
  To learn more about attributes and values, visit https://docs.usercentrics.com/#/direct-implementation-guide?id=change-script-type-textjavascript-becomes-textplain
  */
  scripts: [
    {
      src: `https://w.appzi.io/w.js?token=${process.env.APPZI_TOKEN}`,
      defer: true,
    },
    {
      src: "/scripts/fullstory.js",
      type: "text/plain",
      "data-usercentrics": "FullStory",
    },
    {
      type: "text/plain",
      src: "/scripts/googleTagManager.js",
      "data-usercentrics": "Google Tag Manager",
    },
    {
      src: "https://app.usercentrics.eu/browser-ui/latest/loader.js",
      id: "usercentrics-cmp",
      async: "true",
      "data-settings-id": "0IhiFXOBwy0Z2U",
      type: "text/javascript",
    },
  ],
  themes: ["docusaurus-theme-openapi-docs"],
  customFields: {
    // Put your custom environment here
  },
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
      image: "img/spectro-cloud-social-card.png",
      navbar: {
        title: "",
        logo: {
          href: "/",
          target: "self",
          width: 144,
          height: 36,
          alt: "Spectro cloud logo",
          src: "img/spectrocloud-logo-light.svg",
          srcDark: "img/spectrocloud-logo-dark.svg",
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
