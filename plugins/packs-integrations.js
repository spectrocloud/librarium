const api = require("../src/services/api");
const { setTimeout } = require("timers/promises");
const { packTypeNames, addOnTypes, layerTypes } = require("../src/components/Technologies/PackConstants");
const packDescription = require("../static/packs-data/packs_information.json");
const { coerce, rcompare } = require('semver');

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

function getReadMeMap(packValues) {
  const map = new Map();
  packValues.forEach((packValue) => {
    map[packValue.packUid] = packValue.readme;
    console.log("packValue.packUid = ---------- ", packValue.packUid);
    console.log("packValue.readme  =*************  ", packValue.readme);
  });
  return map;
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
      const packValues = packContent.packValues;
      return {
        fields: {
          name: packName,
          title: packMDValue.spec.displayName,
          description: customPacksData?.[packName],
          readme: getReadMeMap(packValues),
          hide_table_of_contents: false,
          cloudTypes: packMDValue.spec.cloudTypes,
          type: 'integration',
          category: [layer],
          packType: packType,
          sidebar_class_name: 'hide-from-sidebar',
          logoUrl: packMDValue.spec.registries[0].logoUrl,
          tags: [],
          slug: '/integrations/${packMDValue.spec.name}',
          id: 'integrations/${packMDValue.spec.name}',
          community: packMDValue.spec.registries[0].annotations?.source === "community",
          verified: packMDValue.spec.registries[0].annotations?.source === "spectrocloud",
          versions: getAggregatedVersions(packContent.tags, packValues, packName, layer)
        }
      };
    }
  });
}

function matchAmbiguousPatch(tag) {
  const [major, minor, patch] = tag.split(".");
  return major !== undefined && minor !== undefined && patch === "x";
}

export function sanitizeVersion(version) {
  let sanitizedVersion = version;
  if (version.split(".").length < 3) {
    sanitizedVersion = `${version}.0`;
  }
  return sanitizedVersion
    .split(".")
    .map((subVersion) => {
      if (subVersion.startsWith("0")) {
        return subVersion.replace("0", "");
      }

      return subVersion;
    })
    .join(".");
}

function sortVersions(tags) {
  let sortedVersions = [...tags].sort((pack1, pack2) => {
    let version1 = sanitizeVersion(pack1.version);
    let version2 = sanitizeVersion(pack2.version);


    if (coerce(version1) !== null) {
      version1 = coerce(version1).version;
    }

    if (coerce(version2) !== null) {
      version2 = coerce(version2).version;
    }

    try {
      return rcompare(version1, version2, true);
    } catch (e) {
      return 0;
    }
  });
  return sortedVersions;
}

function getAggregatedVersions(tags, packValues, packName, layer) {
  const _sortedVersions = sortVersions(tags);
  const roots = _sortedVersions
    .filter((version) => {
      return matchAmbiguousPatch(version.tag);
    })
    .map((version) => {
      return {
        title: version.tag,
        value: version.version,
        packUid: version.packUid,
      };
    });
    console.log("roots length= ", roots.length);
    console.log("_sortedVersions length= ", _sortedVersions.length);
    _sortedVersions.forEach((version) => {
      const parentTags = version?.parentTags || [];
      const parent = parentTags.find(matchAmbiguousPatch);

      if (!parent) return;

      const parentVersion = roots.find(
        (rootVersion) => rootVersion.title === parent
      );

      if (parentVersion) {
        parentVersion.children = parentVersion.children || [];
        parentVersion.children.push({
          title: version.tag,
          value: version.version,
          packUid: version.packUid,
        });
      }
    });
  console.log("roots = ", JSON.stringify(roots));

  return roots;
}

function generateCustomData(packsDescription) {
  const customPackMap = new Map();
  packsDescription.forEach((pack) => {
    customPackMap[pack.name] = pack.description;
  });
  return customPackMap;
}

function generateRoutes(packDataMap, packsData) {
  return Object.keys(packDataMap).map((packName) => {
    return {
      path: `/integrations/packs/${packName}`,
      exact: false,
      component: '@site/src/components/PacksInformation',
      metadata: {
        sourceFilePath: '../docs/docs-content/integrations/packs.mdx',
      },
      data: packName,
    }
  });
}

async function fetchPackListItems(queryParams, packDataArr, counter) {
  const payload = {filter: { type: ["spectro", "oci"], environment:["aws"]}};
  //const payload = {filter: { type: ["spectro", "oci"], layer: ["os", "k8s"], environment:["aws"]}}
  //const payload = {"filter":{"displayName":{"contains":""},"ignoreCase":true,"type":["spectro"],"layer":["csi"],"environment":["openstack"],"registryUid":["5e2031962f090e2d3d8a3290"]}};
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
      let packDataArr = await fetchPackListItems("?limit=100", [], 0);
      packDataArr = packDataArr.filter((pack) => {
        return layerTypes.includes(pack.spec.layer) || (pack.spec.layer === "addon" && addOnTypes.includes(pack.spec.addonType));
      })
      console.log("packDataArr length = ", packDataArr.length)
      const packUrl = "v1/packs/";
      const packMDMap = new Map();
      let apiPacksData = [];
      let counter = 0;
      let promises = new Array();
      for (let i = 0; i < packDataArr.length; i++) {
        const packData = packDataArr[i];
        if(packData.spec.registries.length) {
          counter+=1
          packMDMap[packData.spec.name]=packData;
          const cloudType = packData.spec.cloudTypes.includes("all") ? "aws" : packData.spec.cloudTypes[0];
          promises.push(api.get(`${packUrl}${packData.spec.name}/registries/${packData.spec.registries[0].uid}?cloudType=${cloudType}&layer=${packData.spec.layer}`));
          if(counter%10 === 0 || i === packDataArr.length-1) {
            await setTimeout(2000);
            const response2 = await Promise.all(promises);
            apiPacksData = apiPacksData.concat(response2.map((pack) => pack.data));
            promises = [];
          }
        }
      }
      console.log("packDescription = ", packDescription);
      return {packsPaletteData: packMDMap, packsPaletteDetailsData: apiPacksData, packsDescription: packDescription} ;
    },
    async contentLoaded({ allContent, content, actions }) {
      const { setGlobalData, addRoute } = actions;
      const { packsPaletteData, packsPaletteDetailsData, packsDescription } = content;
      const integrationsData = generateIntegrationData(allContent);
      const customPacksData = generateCustomData(packsDescription);
      const unionPackData = combineAPICustomPackData(packsPaletteData, packsPaletteDetailsData, customPacksData);
      const routes = generateRoutes(packsPaletteData, unionPackData);
      routes.map(route => addRoute(route));
      setGlobalData({ integrations: integrationsData, packs: unionPackData });
    },
  };
}

module.exports = {
  pluginPacksAndIntegrationsData,
};
