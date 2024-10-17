const fs = require("fs");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const docusaurusConfigFile = "docusaurus.config.js";
const tempDirectory = process.argv[2];
const baseDirectory = process.argv[3];

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
  // Find the main "config" declaration
  const configDeclaration = ast.program.body.find(
    (node) => node.type === "VariableDeclaration" && node.declarations[0].id.name === "config"
  );

  // If the "config" declaration is not found, log an error and return
  if (!configDeclaration) {
    console.error('Could not locate the main "config" declaration.');
    return;
  }

  // Check if the "noIndex" property already exists
  const noIndexExists = configDeclaration.declarations[0].init.properties.some((prop) => prop.key.name === "noIndex");

  if (noIndexExists) {
    console.log('"noIndex" property already exists in the config.');
    return; // Do nothing if noIndex already exists
  }

  // Find the "trailingSlash" property in the "config" declaration
  const trailingSlashProperty = configDeclaration.declarations[0].init.properties.find(
    (prop) => prop.key.name === "trailingSlash"
  );

  // If "trailingSlash" is found, insert "noIndex: true" after it
  if (trailingSlashProperty) {
    const noIndexProperty = t.objectProperty(t.identifier("noIndex"), t.booleanLiteral(true));

    // Find the index of the trailingSlash property and insert noIndex after it
    const index = configDeclaration.declarations[0].init.properties.indexOf(trailingSlashProperty);
    configDeclaration.declarations[0].init.properties.splice(index + 1, 0, noIndexProperty);
    console.log('"noIndex" property added to the config.');
  } else {
    console.error('Could not locate the "trailingSlash" property.');
  }
};

addNoIndexProperty();

// This is where the new config object is converted back into code.
const updatedCode = generate(ast).code;
try {
  // Lastly, this is where the new config object is written to the temp.docusaurus.config.js file.
  fs.writeFileSync(`${tempDirectory}/temp.docusaurus.config.js`, updatedCode);
} catch (err) {
  console.error("Could not write to temp.docusaurus.config.js:", err);
}
