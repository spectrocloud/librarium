const fs = require("fs");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const docusaurusConfigFile = "docusaurus.config.js";
const baseDirectory = process.argv[2]; // Remove the tempDirectory argument

// This reads the docusaurus.config.js file and parses it into an AST.
// We need to parse it into an AST so that we can add the new versions to the config object.
// We then add the noIndex property to the config object.
// This is only for version branches
const configCode = fs.readFileSync(`${baseDirectory}/${docusaurusConfigFile}`, "utf8");
const ast = parser.parse(configCode, {
  sourceType: "module",
});

// Function to add noIndex: true after trailingSlash if not already present
const addNoIndexProperty = () => {
  const configDeclaration = ast.program.body.find(
    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "config"
  );

  if (!configDeclaration) {
    console.error('Could not locate the main "config" declaration.');
    return;
  }

  const noIndexExists = configDeclaration.declarations[0].init.properties.some((prop) => prop.key.name === "noIndex");

  if (noIndexExists) {
    console.log('"noIndex" property already exists in the config.');
    return;
  }

  const trailingSlashProperty = configDeclaration.declarations[0].init.properties.find(
    (prop) => prop.key.name === "trailingSlash"
  );

  if (trailingSlashProperty) {
    const noIndexProperty = t.objectProperty(t.identifier("noIndex"), t.booleanLiteral(true));

    const index = configDeclaration.declarations[0].init.properties.indexOf(trailingSlashProperty);
    configDeclaration.declarations[0].init.properties.splice(index + 1, 0, noIndexProperty);
    console.log('"noIndex" property added to the config.');
  } else {
    console.error('Could not locate the "trailingSlash" property.');
  }
};

addNoIndexProperty();

// Generate the updated code from the AST and overwrite the original config file
const updatedCode = generate(ast).code;
try {
  // Write directly to the original docusaurus.config.js file
  fs.writeFileSync(`${baseDirectory}/${docusaurusConfigFile}`, updatedCode);
  console.log("Original docusaurus.config.js updated with the new content.");
} catch (err) {
  console.error("Could not write to docusaurus.config.js:", err);
}
