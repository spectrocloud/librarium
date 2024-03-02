const fs = require("fs");
const lodash = require("lodash");
// Read the content of api.json file

// Function to process a single Swagger file
function processSwaggerFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    try {
      const tagSet = new Set();
      const jsonData = JSON.parse(data);
      const paths = Object.keys(jsonData.paths);

      // Process each path and add tags
      const versionRegex = /\/v\d+\/([^/]+)/;
      paths.forEach((path) => {
        const match = path.match(versionRegex);
        let tag;

        if (match && match[1]) {
          tag = match[1];
        } else {
          tag = path.split("/")[1];
        }
        tagSet.add(tag);

        if (jsonData.paths[path].tags) {
          jsonData.paths[path].tags = [tag];
        }
        Object.keys(jsonData.paths[path]).forEach((key) => {
          if (jsonData.paths[path][key] && jsonData.paths[path][key].tags) {
            jsonData.paths[path][key].tags = [tag];
          }
        });
      });

      jsonData.tags = Array.from(tagSet, (item) => ({
        name: item,
        "x-displayName": lodash.startCase(item),
      }));

      jsonData.servers = [
        {
          url: "https://api.spectrocloud.com",
        },
      ];

      const result = JSON.stringify(jsonData, null, 2);
      fs.writeFile(filePath, result, "utf8", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return;
        }
        console.log(`Processed and updated ${filePath}`);
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
}

// List of Swagger files to process
const swaggerFiles = [
  "docs/api-content/api-docs/v1/api.json",
  // Add the path to your second Swagger file here
  "docs/api-content/api-docs/edge-v1/emc-api.json",
];

// Process each Swagger file
swaggerFiles.forEach(processSwaggerFile);
