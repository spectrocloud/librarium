const axios = require("axios");
const xml2js = require("xml2js");

async function fetchAndFilterUrls(sitemapUrl, urlPrefix) {
  try {
    const response = await axios.get(sitemapUrl);

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    const paths = [];

    for (const entry of result.urlset.url) {
      const url = entry.loc[0];
      if (url.startsWith(urlPrefix)) {
        // We are stripping the base URL to get the relative path so that we can use it in the redirect rules
        const path = url.replace("https://docs.spectrocloud.com", "");
        paths.push(path);
      }
    }

    return paths;
  } catch (error) {
    console.error("Error fetching or processing sitemap:", error);
  }
}

module.exports = fetchAndFilterUrls;
