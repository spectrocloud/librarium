function generateIntegrationData(allContent) {
  const packsData = allContent[
    "docusaurus-plugin-content-docs"
  ].default.loadedVersions[0].docs
    .filter((doc) => {
      return doc.frontMatter.type === "appTier";
    })
    .map((doc) => {
      return { fields: { ...doc.frontMatter, slug: doc.slug, id: doc.id } };
    });
  return packsData;
}

function generatePacksData(allContent) {
  const packsData = allContent[
    "docusaurus-plugin-content-docs"
  ].default.loadedVersions[0].docs
    .filter((doc) => {
      return doc.frontMatter.type === "integration";
    })
    .map((doc) => {
      return { fields: { ...doc.frontMatter, slug: doc.slug, id: doc.id } };
    });
  return packsData;
}

async function pluginPacksAndIntegrationsData() {
  return {
    name: "plugin-packs-integrations",
    async contentLoaded({ allContent, actions }) {
      const { setGlobalData } = actions;
      const integrationsData = generateIntegrationData(allContent);
      const packsData = generatePacksData(allContent);
      setGlobalData({ integrations: integrationsData, packs: packsData });
    },
  };
}

module.exports = {
  pluginPacksAndIntegrationsData,
};
