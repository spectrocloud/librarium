const { api, callRateLimitAPI } = require("../src/services/api");
const { packTypeNames, addOnTypes, layerTypes } = require("../src/constants/packs");
const packDescription = require("../static/packs-data/packs_information.json");
const { coerce, rcompare } = require("semver");
const path = require("path");
const mime = require("mime-types");
const { setTimeout } = require("timers/promises");
const BASE_URL = require("../static/scripts/constants.js").BASE_URL;
const fetch = require("node-fetch");
const excludeList = require("../static/packs-data/exclude_packs.json");
const { existsSync, promises, open, mkdirSync, writeFile, close, createWriteStream } = require("node:fs");
import logger from "@docusaurus/logger";

const filterLimit = 100; //Limit for fetching the packs from the Palette API
const dirname = ".docusaurus/packs-integrations/";
const logoDirname = "static/img/packs/";
const packs_filename = "api_pack_response.json";
const repos_filename = "api_repositories_response.json";
const options = {
  headers: {
    "Content-Disposition": "attachment",
    ApiKey: process.env.PALETTE_API_KEY,
  },
};
let counter = 0;
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

function getPackUidMap(registries) {
  let generatedReadMeData = {};
  registries.forEach((registry) => {
    const proccessedPackReadMeDetails = registry.packValues.reduce(
      (packValuesMap, packValue) =>
        Object.assign(packValuesMap, {
          [packValue.packUid]: {
            registryUid: registry.registryUid,
            readme: packValue.readme,
            deprecated: packValue.annotations?.system_state === "deprecated",
          },
        }),
      {}
    );
    generatedReadMeData = Object.assign(generatedReadMeData, proccessedPackReadMeDetails);
  });
  return generatedReadMeData;
}

function filterBasedOnRegistriesInConfig(packRegistries, configRepositories) {
  //Filter the pack registries based on the selected registries given in the docusaurus config file
  return packRegistries.filter((registry) => {
    return configRepositories.find((repo) => repo.uid === registry.registryUid);
  });
}

function combineAPICustomPackData(packsMData, packsPaletteDetailsData, customPacksData, repositories, logoPathMap) {
  const filteredPalattePackDataMap = packsPaletteDetailsData.reduce((acc, packContent) => {
    const packName = packContent.name;
    //filtered the packs based on the selected registries given in the docusaurus config file
    if (
      repositories.find((repo) => repo.uid === packContent.registryUid) &&
      ((packsMData[packName].spec.layer === "addon" && packsMData[packName].spec.addonType) ||
        packsMData[packName].spec.layer !== "addon")
    ) {
      if (Object.hasOwnProperty.call(acc, packName)) {
        const packValues = acc[packName];
        packValues.registries.push(packContent);
      } else {
        const packData = {
          name: packName,
          registries: [packContent],
        };
        acc[packName] = packData;
      }
    }
    return acc;
  }, {});
  const filteredPalattePackData = Object.values(filteredPalattePackDataMap);
  const preferredRegistryUid = repositories?.[0]?.uid;
  return filteredPalattePackData.map((packContent) => {
    const packName = packContent.name;
    if (packsMData[packName]) {
      const packMDValue = packsMData[packName];
      const preferredRegistry = packMDValue.spec.registries.find((registry) => registry.uid === preferredRegistryUid);
      const latestPackVersion = preferredRegistry
        ? preferredRegistry.latestVersion
        : packMDValue.spec.registries[0].latestVersion;
      const packType = packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packMDValue.spec.layer;
      const layer =
        packMDValue.spec.layer === "addon" ? packMDValue.spec.addonType : packTypeNames[packMDValue.spec.layer];
      const selectedRegistries = filterBasedOnRegistriesInConfig(packContent.registries, repositories);
      const packDetailsMap = getPackUidMap(selectedRegistries);
      //union of all the versions of all the supported registries of a pack.
      const allSupportedVersions = getAggregatedVersions(selectedRegistries, repositories, packDetailsMap, packName);
      return {
        name: packName,
        title: packMDValue.spec.displayName,
        description: customPacksData?.[packName],
        packUidMap: packDetailsMap,
        cloudTypes: packMDValue.spec.cloudTypes,
        type: "integration",
        category: [layer],
        packType: packType,
        logoUrl: logoPathMap[packName],
        tags: [],
        slug: "/integrations/${packMDValue.spec.name}",
        id: "integrations/${packMDValue.spec.name}",
        registries: packMDValue.spec.registries.map((registry) => registry.uid),
        community: packMDValue.spec.registries[0].annotations?.source === "community",
        verified: packMDValue.spec.registries[0].annotations?.source === "spectrocloud",
        versions: allSupportedVersions,
        // disabled: packMDValue.spec.registries[0].annotations?.disabled === "true",
        disabled: packMDValue.spec.registries[0].annotations?.disabled === "true",
        deprecated: packMDValue.spec.registries[0].annotations?.system_state === "deprecated",
        latestVersion: latestPackVersion,
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

function getAggregatedVersions(registries, repositories, packUidMap) {
  const prefferedRegistryUid = repositories?.[0]?.uid;
  //if a pack has multiple registries, then the versions of the pack are aggregated based on the selected registries
  //if a same version in multiple registries, the preferred registry is the higher precendence.
  const aggregatedTags = registries.reduce((previousVersions, registry) => {
    const computedVersions = getComputedVersions(registry.tags);
    if (previousVersions.length) {
      const versionTags = new Set(previousVersions.map((verssion) => verssion.title));
      const computedCommonVersions = computedVersions.filter((version) => versionTags.has(version.title));
      if (computedCommonVersions.length) {
        //merging the non-overlapping Tags in the previous computed versions and current computing versions
        const mergedNonOverlappingParentVersions = [
          ...computedVersions.filter((version) => !versionTags.has(version.title)),
          ...previousVersions.filter((version) => !versionTags.has(version.title)),
        ];
        computedCommonVersions.forEach((commonVersion) => {
          //Take PreviousVersion Parent version tag from the iterated overlapping tag title
          const previousVersiontagdata = previousVersions.find(
            (prevVersion) => prevVersion.title === commonVersion.title
          );
          const previousVersionChildrenSet = new Set(previousVersiontagdata.children.map((verssion) => verssion.title));
          // Ensure that children are never undefined.
          const commonVersionChildren = commonVersion.children || [];
          const commonComputedChildren = commonVersionChildren.filter((child) =>
            previousVersionChildrenSet.has(child.title)
          );
          if (commonComputedChildren.length) {
            //merge non overlapping children in each parent version
            const mergedNonOverlappingChildren = [
              ...commonVersionChildren.filter((child) => !previousVersionChildrenSet.has(child.title)),
              ...previousVersiontagdata.children.filter((child) => !previousVersionChildrenSet.has(child.title)),
            ];
            commonComputedChildren.forEach((childComputedVersion) => {
              const previousVersionChild = previousVersiontagdata.children.find(
                (prevChildVersion) => prevChildVersion.title === childComputedVersion.title
              );
              const childPreviousVersionPackUid = previousVersionChild.packUid;
              const previousVersionRegistryUid = packUidMap[childPreviousVersionPackUid]?.registryUid;
              //while doing union of both versions of pack of the registries, not belong to the preferred registry,
              //then either of the registry is considered.
              if (previousVersionRegistryUid !== prefferedRegistryUid) {
                previousVersionChild.packUid = childComputedVersion.packUid;
              }
            });
            //merging non-overlapping children with the previous version children
            previousVersiontagdata.children = [...previousVersiontagdata.children, ...mergedNonOverlappingChildren];
          } else {
            previousVersiontagdata.children = [...previousVersiontagdata.children, ...commonVersionChildren];
          }
        });
        //merging the non-overlapping tags with the previous Versions
        previousVersions = [...previousVersions, ...mergedNonOverlappingParentVersions];
      } else {
        previousVersions = [...previousVersions, ...computedVersions];
      }
    } else {
      previousVersions = [...previousVersions, ...computedVersions];
    }
    return previousVersions;
  }, []);
  return aggregatedTags;
}

function getComputedVersions(tags) {
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
    const parentVersion = roots.find((rootVersion) => rootVersion.title === parent);
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
  const generatedCustomData = packsDescription.reduce(
    (obj, desc) => Object.assign(obj, { [desc.name]: desc.description }),
    {}
  );
  logger.info("Completed generating custom data description.");
  return generatedCustomData;
}

function generateRoutes(packsAllData) {
  return packsAllData.map((pack) => {
    const parentVersion = pack.versions.find((version) => {
      return (version.children && version.children.find((child) => child.title === pack.latestVersion)) || version;
    });
    let path = `/integrations/packs/${pack.name}/${pack.latestVersion}`;
    if (parentVersion && parentVersion.title) {
      path = `${path}/${parentVersion.title}`;
    }
    return {
      path: path,
      exact: false,
      component: "@site/src/components/PacksInformation",
      metadata: {
        sourceFilePath: "../docs/docs-content/integrations/packs.mdx",
      },
      data: { name: pack.name, version: pack.latestVersion, parent: parentVersion?.title, tab: "main" },
    };
  });
}

async function fetchPackListItems(queryParams, packDataArr, counter, mappedRepos) {
  // Loop through the mappedRepos object and extract all the registries provided in the Docusarus config file
  const registryUids = [];
  for (let i = 0; i < mappedRepos.length; i++) {
    registryUids.push(mappedRepos[i].uid);
  }
  // Provide the registryUids in the payload to fetch the packs ONLY from registries provided in the Docusarus config file
  const payload = { filter: { type: ["spectro", "oci"], registryUid: registryUids } };
  let response = [];
  try {
    response = await callRateLimitAPI(() => api.post(`/v1/packs/search${queryParams}`, payload));
  } catch (error) {
    logger.error("An error occurred while fetching packs:", error);
    process.exit(5);
  }
  const tempPackArr = packDataArr.concat(response?.data?.items);

  if (response?.data?.listmeta?.continue) {
    return fetchPackListItems(
      `?limit=${filterLimit}&continue=` + response.data.listmeta.continue,
      tempPackArr,
      counter,
      mappedRepos
    );
  } else {
    return tempPackArr;
  }
}

async function mapRepositories(repositories) {
  let ociRegistries = [];
  let packRegistries = [];
  try {
    ociRegistries = await api.get("v1/registries/oci/summary");
    packRegistries = await api.get("v1/registries/pack");
  } catch (error) {
    logger.error("An error occurred while fetching registries:", error);
    process.exit(5);
  }
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

  await writeResponseFile(`${dirname}${repos_filename}`, repoMap);

  return repoMap;
}

async function write(res, packName, logoUrlMap) {
  return new Promise((resolve, reject) => {
    const type = res.headers.get("Content-Type");
    if (mime.extension(type) !== "html") {
      const destination = path.resolve(logoDirname, packName);
      const fileStream = createWriteStream(`${destination}.${mime.extension(type)}`);
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function () {
        resolve();
        logoUrlMap[packName] = `${packName}.${mime.extension(type)}`;
      });
    } else {
      reject(`Invalid MIME type received for the logo ${packName}`);
    }
  });
}

async function getLogoUrl(packsAllData, logoUrlMap) {
  for (let j = 0; j < packsAllData.length; j++) {
    const { registries, name: packName } = packsAllData[j].spec;

    for (let i = 0; i < registries.length; i++) {
      const registry = registries[i];
      let url = registry.logoUrl || `${BASE_URL}/v1/packs/${registry.latestPackUid}/logo`;

      url =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : url.startsWith("/")
            ? `${BASE_URL}${url}`
            : `${BASE_URL}/${url}`;

      if (!Object.prototype.hasOwnProperty.call(logoUrlMap, packName)) {
        try {
          options.headers["Accept"] = "image/png";
          const res = await fetch(url, options);

          if (!res.ok) {
            throw new Error(`Failed to fetch logo for ${packName} from ${url}. Got status ${res.status}`);
          }

          await write(res, packName, logoUrlMap);
          counter++;

          if (counter % 10 === 0) {
            await setTimeout(1000);
          }
        } catch (e) {
          logger.error(e);
        }
      }
    }
  }
}

async function writeResponseFile(path, apiResponse) {
  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true });
  }
  open(path, "w+", (err, fd) => {
    if (err) {
      logger.error("An error occurred while opening the JSON file:", err);
      return;
    }
    try {
      writeFile(path, JSON.stringify(apiResponse), (err1) => {
        if (err1) {
          logger.error("An error occurred while writing the JSON file:", err1);
        }
        logger.info(`API Response saved to ${path}`);
      });
    } finally {
      close(fd, (err2) => {
        if (err2) logger.error("An error occurred while closing the file:", err2);
      });
    }
  });
}

// If the plugin is disabled, then the packs and integrations data will not be fetched.
// However, the PDE service packs still need to be loaded.
// Otherwise, errors will be thrown when the PDE service packs are accessed.
// The redirect.js file has logic to redirect pack pages in production to the /integrations/ page.
async function pluginPacksAndIntegrationsData(context, options) {
  if (process.env.DISABLE_PACKS_INTEGRATIONS === "true") {
    logger.warn(
      "The Packs Integrations plugin is disabled. To enable it, set the environment variable DISABLE_PACKS_INTEGRATIONS to false."
    );
    return {
      name: "plugin-packs-integrations",
      async allContentLoaded({ allContent, actions }) {
        const { setGlobalData } = actions;
        const integrationsData = generateIntegrationData(allContent);
        setGlobalData({ integrations: integrationsData });
      },
    };
  }

  return {
    name: "plugin-packs-integrations",
    async loadContent() {
      const repositories = options.repositories || [];
      let isPackFileExists = false;
      let isReposFileExists = false;
      let mappedRepos = [];
      if (existsSync(dirname) && existsSync(`${dirname}${repos_filename}`)) {
        isReposFileExists = true;
      }
      if (existsSync(dirname) && existsSync(`${dirname}${packs_filename}`)) {
        isPackFileExists = true;
      }
      if (!isReposFileExists) {
        mappedRepos = await mapRepositories(repositories);
      } else {
        try {
          const data = await promises.readFile(`${dirname}${repos_filename}`);
          mappedRepos = JSON.parse(data);
        } catch (e) {
          logger.error("An error occurred while reading the JSON file:", e);
        }
      }

      let apiPackResponse = {};
      let logoUrlMap = {};
      if (!isPackFileExists) {
        logger.info("Fetching the list of packs from the Palette API");
        let packDataArr = await fetchPackListItems(`?limit=${filterLimit}`, [], 0, mappedRepos);

        // Filter out the packs from the exclude list.
        packDataArr = packDataArr.filter((pack) => {
          if (excludeList.includes(pack.spec.name)) {
            // Only uncomment if debugging is required
            // logger.warn(`Pack ${pack.spec.name} is excluded from the list`);
            return false;
          }
          return true;
        });
        logger.info("Downloading each pack's details and README");
        packDataArr = packDataArr.filter((pack) => {
          return (
            layerTypes.includes(pack.spec.layer) ||
            (pack.spec.layer === "addon" && addOnTypes.includes(pack.spec.addonType) && pack.spec.registries.length)
          );
        });
        const packUrl = "v1/packs/";
        const packMDMap = new Map();
        let apiPacksData = [];
        const promisesPackDetails = packDataArr.map((packData) => {
          packMDMap[packData.spec.name] = packData;
          const cloudType = packData.spec.cloudTypes.includes("all") ? "aws" : packData.spec.cloudTypes[0];
          const registryPackData = [];
          try {
            for (const registry of packData.spec.registries) {
              const url = `${packUrl}${packData.spec.name}/registries/${registry.uid}?cloudType=${cloudType}&layer=${packData.spec.layer}`;
              registryPackData.push(
                callRateLimitAPI(() => {
                  return api.get(url);
                })
              );
            }
          } catch (error) {
            logger.error("An error occurred while fetching packs:", error);
            process.exit(5);
          }

          return registryPackData;
        });
        const flatted = promisesPackDetails.flat();
        const results = await Promise.allSettled(flatted);

        for (const result of results) {
          if (result.status === "fulfilled" && result.value?.data) {
            apiPacksData.push(result.value.data);
          } else {
            logger.error("Failed to fetch the details for the following pack " + result.reason.config.url);
          }
        }
        logger.info("Completed fetching all the packs and their details");
        logger.info("Fetching the logo for each pack");
        //Fetch logos
        if (!existsSync(logoDirname)) {
          mkdirSync(logoDirname, { recursive: true });
        }
        await getLogoUrl(packDataArr, logoUrlMap);
        logger.info("Completed fetching all pack logos");
        apiPackResponse.apiPacksData = apiPacksData;
        apiPackResponse.packMDMap = packMDMap;
        apiPackResponse.logoUrlMap = logoUrlMap;
        await writeResponseFile(`${dirname}${packs_filename}`, apiPackResponse);
      } else {
        try {
          const data = await promises.readFile(`${dirname}${packs_filename}`);
          apiPackResponse = JSON.parse(data);
        } catch (e) {
          logger.error("An error occurred while reading the JSON file:", e);
        }
      }
      logger.info(`The number of packs identified is:  ${Object.keys(apiPackResponse.packMDMap).length}`);
      return {
        packsPaletteData: apiPackResponse.packMDMap,
        packsPaletteDetailsData: apiPackResponse.apiPacksData,
        packsDescription: packDescription,
        repositories: mappedRepos,
        logoFilesPathMap: apiPackResponse.logoUrlMap,
      };
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData, addRoute } = actions;
      const { packsPaletteData, packsPaletteDetailsData, packsDescription, repositories, logoFilesPathMap } = content;
      const customPacksData = generateCustomData(packsDescription);
      const unionPackData = combineAPICustomPackData(
        packsPaletteData,
        packsPaletteDetailsData,
        customPacksData,
        repositories,
        logoFilesPathMap
      );
      const routes = generateRoutes(unionPackData);
      logger.info("Completed generating routes for all the packs");
      routes.map((route) => addRoute(route));
      setGlobalData({ packs: unionPackData, repositories: repositories });
      logger.success("Packs data successfully loaded 📦");
    },
    async allContentLoaded({ allContent, actions }) {
      const { setGlobalData } = actions;
      const integrationsData = generateIntegrationData(allContent);
      setGlobalData({ integrations: integrationsData });
    },
  };
}

module.exports = {
  pluginPacksAndIntegrationsData,
};
