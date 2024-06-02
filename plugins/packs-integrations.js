const { api, callRateLimitAPI } = require("../src/services/api");
const { packTypeNames, addOnTypes, layerTypes } = require("../src/constants//packs");
const packDescription = require("../static/packs-data/packs_information.json");
const { coerce, rcompare } = require('semver');

function generateIntegrationData(allContent) {
  const packsData = allContent["docusaurus-plugin-content-docs"].default.loadedVersions[0].docs
    .filter((doc) => {
      return doc.frontMatter.type === "appTier";
    })
    .map((doc) => {
      return { ...doc.frontMatter, slug: doc.slug, id: doc.id };
    });
  return packsData;
}

function getReadMeMap(packValues) {
  const generatedReadMeData = packValues.reduce((packValuesMap, packValue) =>
    Object.assign(packValuesMap, { [packValue.packUid]: packValue.readme }), {});
  return generatedReadMeData;
}

function combineAPICustomPackData(packsMData, packsPaletteDetailsData, customPacksData, repositories) {
  const filteredPalattePackData = packsPaletteDetailsData.filter((packContent) => {
    const packName = packContent.name;
    return ((packsMData[packName].spec.layer === "addon" && packsMData[packName].spec.addonType) || packsMData[packName].spec.layer !== "addon");
  });
  const preferredRegistryUid = repositories?.[0]?.uid;
  return filteredPalattePackData.map((packContent) => {
    const packName = packContent.name;
    if (packsMData[packName]) {
      const packMDValue = packsMData[packName];
      const preferredRegistry = packMDValue.spec.registries.find((registry) => registry.uid === preferredRegistryUid);
      const latestPackVersion = preferredRegistry ? preferredRegistry.latestVersion : packMDValue.spec.registries[0].latestVersion;
      const packType = packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packMDValue.spec.layer;
      const layer = packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packTypeNames[packMDValue.spec.layer];
      const packValues = packContent.packValues;
      const allSupportedVersions = getAggregatedVersions(packContent.tags);
      const latestPackTagVersion = allSupportedVersions.find((version) => version.value === latestPackVersion);
      return {
        name: packName,
        title: packMDValue.spec.displayName,
        description: customPacksData?.[packName],
        readme: getReadMeMap(packValues),
        cloudTypes: packMDValue.spec.cloudTypes,
        type: 'integration',
        category: [layer],
        packType: packType,
        logoUrl: packMDValue.spec.registries[0].logoUrl,
        tags: [],
        slug: '/integrations/${packMDValue.spec.name}',
        id: 'integrations/${packMDValue.spec.name}',
        registries: packMDValue.spec.registries.map((registry) => registry.uid),
        community: packMDValue.spec.registries[0].annotations?.source === "community",
        verified: packMDValue.spec.registries[0].annotations?.source === "spectrocloud",
        versions: allSupportedVersions,
        disabled: packMDValue.spec.registries[0].annotations?.disabled === "true",
        deprecated: packMDValue.spec.registries[0].annotations?.system_state === "deprecated",
        latestVersion: latestPackTagVersion?.title,
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

function getAggregatedVersions(tags) {
  const sortedVersions = sortVersions(tags);
  const roots = sortedVersions
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
  sortedVersions.forEach((version) => {
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
  return roots;
}

function generateCustomData(packsDescription) {
  const generatedCustomData = packsDescription.reduce((obj, desc) =>
    Object.assign(obj, { [desc.name]: desc.description }), {});
  console.info("completed custom data description generation");
  return generatedCustomData;
}

function generateRoutes(packDataMap) {
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
  const payload = { filter: { type: ["spectro", "oci"] } };
  const response = await callRateLimitAPI(() => api.post(`/v1/packs/search${queryParams}`, payload));
  const tempPackArr = packDataArr.concat(response?.data?.items);
  if (response?.data?.listmeta?.continue) {
    return fetchPackListItems("?limit=100&continue=" + response.data.listmeta.continue, tempPackArr, counter);
  } else {
    return tempPackArr;
  }
}

async function mapRepositories(repositories) {
  const ociRegistries = await api.get("v1/registries/oci/summary");
  const packRegistries = await api.get("v1/registries/pack");
  const mergedRegistries = [ociRegistries.data?.items || [], packRegistries.data?.items || []];
  const results = mergedRegistries.flat();
  const repoMap = repositories.reduce((acc, repository) => {
    const repoObj = results.find((repo) => {
      return repo.metadata.name === repository;
    });
    if (repoObj) {
      acc.push({ name: repoObj.metadata.name, uid: repoObj.metadata.uid });
    }
    return acc;
  }, []);
  return repoMap;
}

function isSelectedRegistry(registries, selectedRepositories) {
  if (!selectedRepositories || !selectedRepositories.length) {
    return true;
  }
  return registries.some((registry) => {
    return selectedRepositories.find((selRepo) => selRepo.uid === registry.uid);
  });
}

async function pluginPacksAndIntegrationsData(context, options) {
  return {
    name: "plugin-packs-integrations",
    async loadContent() {
      const repositories = options.repositories || [];
      const mappedRepos = await mapRepositories(repositories);
      let packDataArr = await fetchPackListItems("?limit=100", [], 0);
      console.info("completed the fetch of all the names of the pack");
      packDataArr = packDataArr.filter((pack) => {
        return (((layerTypes.includes(pack.spec.layer) || (pack.spec.layer === "addon") && (addOnTypes.includes(pack.spec.addonType))) &&
          pack.spec.registries.length && isSelectedRegistry(pack.spec.registries, mappedRepos)))
      })
      const packUrl = "v1/packs/";
      const packMDMap = new Map();
      let apiPacksData = [];
      const preferredRegistryUid = mappedRepos?.[0]?.uid;
      const promises = packDataArr.map((packData) => {
        packMDMap[packData.spec.name] = packData;
        const cloudType = packData.spec.cloudTypes.includes("all") ? "aws" : packData.spec.cloudTypes[0];
        //there is a scenario where the pack is not part of preferred registry, in that case, the item of the pack registries is sent to API request
        const hasPreferredRegistry = packData.spec.registries.some((registry) => registry.uid === preferredRegistryUid);
        let packRegistryUid = packData.spec.registries[0].uid
        if (hasPreferredRegistry) {
          packRegistryUid = preferredRegistryUid;
        }
        const url = `${packUrl}${packData.spec.name}/registries/${packRegistryUid}?cloudType=${cloudType}&layer=${packData.spec.layer}`;
        return callRateLimitAPI(() => api.get(url));
      });
      const results = await Promise.allSettled(promises);
      apiPacksData = results.filter(result => result.status === "fulfilled" && result.value?.data).map((pack) => pack.value?.data);
      console.info("completed the fetch of all the pack details");
      return { packsPaletteData: packMDMap, packsPaletteDetailsData: apiPacksData, packsDescription: packDescription, repositories: mappedRepos };
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData, addRoute } = actions;
      const { packsPaletteData, packsPaletteDetailsData, packsDescription, repositories } = content;
      const customPacksData = generateCustomData(packsDescription);
      const unionPackData = combineAPICustomPackData(packsPaletteData, packsPaletteDetailsData, customPacksData, repositories);
      const routes = generateRoutes(packsPaletteData);
      console.info("completed the generation of the routes");
      routes.map(route => addRoute(route));
      setGlobalData({ packs: unionPackData, repositories: repositories });
    },
    async allContentLoaded({ allContent, actions }) {
      const { setGlobalData } = actions;
      const integrationsData = generateIntegrationData(allContent);
      setGlobalData({ integrations: integrationsData })
    }
  };
}

module.exports = {
  pluginPacksAndIntegrationsData,
};
