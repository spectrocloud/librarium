const fs = require("fs");
const path = require("path");

const assetIcons = {
  about: true,
  admin: true,
  audits: true,
  bell: true,
  bundles: true,
  clusters: true,
  cog: true,
  folder: true,
  graph: true,
  logout: true,
  nodes: true,
  overlord: true,
  overview: true,
  project: true,
  roles: true,
  teams: true,
  workspaces: true,
  terraform: true,
};

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function camelCase(str) {
  return str
    .split("-")
    .map((s, index) => {
      return (index === 0 ? s[0].toLowerCase() : s[0].toUpperCase()) + s.slice(1).toLowerCase();
    })
    .join("");
}

async function pluginImportFontAwesomeIcons() {
  return {
    name: "import-font-awesome-icons",
    async contentLoaded({ allContent }) {
      const appFontAwesomeIcons = {};
      allContent["docusaurus-plugin-content-docs"].default.loadedVersions[0].docs.map((doc) => {
        if (doc.frontMatter?.sidebar_custom_props?.icon && !assetIcons[doc.frontMatter?.sidebar_custom_props?.icon]) {
          appFontAwesomeIcons[doc.frontMatter?.sidebar_custom_props?.icon] =
            doc.frontMatter?.sidebar_custom_props?.icon;
        }
      });

      // Create an array to hold all the import statements
      const importsArray = [];

      // Generate import statements and add them to importsArray
      for (const iconName in appFontAwesomeIcons) {
        const capitalizedCamelCasedIcon = `fa${capitalize(camelCase(iconName))}`;
        const importStatement = `import { ${capitalizedCamelCasedIcon} } from '@fortawesome/free-solid-svg-icons';`;
        importsArray.push(importStatement);
      }

      // Create the object mapping for icons
      const iconMapping = Object.keys(appFontAwesomeIcons)
        .map((iconName) => `"${iconName}": fa${capitalize(camelCase(iconName))}`)
        .join(",\n  ");

      // Create the content for dynamicFontAwesomeImports.js
      const importStatementsString = importsArray.join("\n");
      const fileContent = `${importStatementsString}\n\nexport const fontAwesomeIcons = {\n  ${iconMapping}\n};`;

      // Write the content to dynamicFontAwesomeImports.js
      const directory = "src/components/IconMapper";

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      fs.writeFile(path.join(directory, "dynamicFontAwesomeImports.js"), fileContent, "utf8", (err) => {
        if (err) {
          console.error("An error occurred while writing the file:", err);
        }
      });
    },
  };
}

module.exports = {
  pluginImportFontAwesomeIcons,
};
