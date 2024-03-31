import api from "../src/services/api";
import { setTimeout } from "timers/promises";
import { packTypeNames } from "../src/components/Technologies/PackConstants";

/*const layerMap = {
  k8s: "Kubernetes",
  cni: "network",
  os: "operating system",
  servicemesh: "service mesh",
  monitoring: "monitoring",
  csi: "storage",
  logging: "logging",
  "load balancer": "load balancer",
  ingress: "ingress",
  authentication: "authentication",
  registry: "registry",
  "system app": "system app",
  spectro: "spectro",
  security: "security",
  serverless: "serverless",
  "app services": "app services",

}*/

function generateIntegrationData(allContent) {
  const packsData = allContent["docusaurus-plugin-content-docs"].default.loadedVersions[0].docs
    .filter((doc) => {
      return doc.frontMatter.type === "appTier";
    })
    .map((doc) => {
      return { fields: { ...doc.frontMatter, slug: doc.slug, id: doc.id } };
    });
  return packsData;
}

function generatePacksData(allContent) {
  const packsData = allContent["docusaurus-plugin-content-docs"].default.loadedVersions[0].docs
    .filter((doc) => {
      return doc.frontMatter.type === "integration";
    })
    .map((doc) => {
      return { fields: { ...doc.frontMatter, slug: doc.slug, id: doc.id } };
    });
  return packsData;
}

function combineAPICustomPackData(packsMData, packsPaletteDetailsData, customPacksData) {
  const filteredPalattePackData = packsPaletteDetailsData.filter((packContent) => {
    const packName = packContent.name;
    return ((packsMData[packName].spec.layer === "addon" && packsMData[packName].spec.addonType) || packsMData[packName].spec.layer !== "addon");
  });
  return filteredPalattePackData.map((packContent) => {
    const packName = packContent.name;
    if (packsMData[packName]) {
      const packMDValue = packsMData[packName];
      const packType = packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packMDValue.spec.layer;
      const layer = packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packTypeNames[packMDValue.spec.layer];
      return {
        fields: {
          sidebar_label: packMDValue.spec.name,
          name: packMDValue.spec.name,
          title: packMDValue.spec.displayName,
          description: 'dynamically generated',
          hide_table_of_contents: true,
          cloudTypes: packMDValue.spec.cloudTypes,
          type: 'integration',
          category: [layer],
          packType: packType,
          sidebar_class_name: 'hide-from-sidebar',
          logoUrl: packMDValue.spec.registries[0].logoUrl,
          tags: [],
          slug: '/integrations/${packMDValue.spec.name}',
          id: 'integrations/${packMDValue.spec.name}',
        }
      };
    }
  });
}

async function fetchPackListItems(queryParams, packDataArr, counter) {
  const payload = {filter: { type: ["spectro", "oci"],environment:["aws"]}};
  //const payload = {filter: { type: ["spectro", "oci"], layer: ["os", "k8s"], environment:["aws"]}}
  //const payload = {filter: { type: ["spectro", "oci"], layer: ["addon"], "environment":["all"] }};
  counter+=1;
  if(counter%10 === 0) {
    await setTimeout(2000);
  }
  const response = await api.post('/v1/packs/search'+queryParams, payload);
  console.log("response.data.listmeta.count = ", response.data.listmeta.count);
  const tempPackArr = packDataArr.concat(response.data.items);
  if(response.data.listmeta.continue) {
    return fetchPackListItems("?limit=100&continue="+response.data.listmeta.continue, tempPackArr, counter);
  } else {
    return tempPackArr;
  }
}

async function pluginPacksAndIntegrationsData() {
  return {
    name: "plugin-packs-integrations",
    async loadContent() {
      const packDataArr = await fetchPackListItems("?limit=100", [], 0);
      const packUrl = "v1/packs/";
      const packMDMap = new Map();
      let apiPacksData = [];
      let counter = 0;
      let promises = new Array();
      for (let i = 0; i < packDataArr.length; i++) {
        counter+=1
        const packData = packDataArr[i];
        packMDMap[packData.spec.name]=packData;
        promises.push(api.get(packUrl + packData.spec.registries[0].latestPackUid));
        if(counter%10 === 0 || i === packDataArr.length-1) {
          await setTimeout(2000);
          const response2 = await Promise.all(promises);
          apiPacksData = apiPacksData.concat(response2.map((pack) => pack.data));
          promises = [];
        }
      }
      return {packsPaletteData: packMDMap, packsPaletteDetailsData: apiPacksData} ;
    },
    async contentLoaded({ allContent, content, actions }) {
      const { setGlobalData } = actions;
      const { packsPaletteData, packsPaletteDetailsData } = content;
      const integrationsData = generateIntegrationData(allContent);
      const customPacksData = generatePacksData(allContent);
      //console.log("hello here packData is ---- ", customPacksData);
      //console.log("hello here packData is ---- ", packsPaletteDetailsData.length);
      const unionPackData = combineAPICustomPackData(packsPaletteData, packsPaletteDetailsData, customPacksData)
      setGlobalData({ integrations: integrationsData, packs: unionPackData });
    },
  };
}

module.exports = {
  pluginPacksAndIntegrationsData,
};
