const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');


const docusaurusConfigFile = 'docusaurus.config.js';
const versionsJSONFile = 'versions.json';
const tempDirectory = process.argv[2] // The first argument is the path to the temp directory
const baseDirectory = process.argv[3] // The second argument is the path to the base directory

let versionsArray = [];
try {
  const versionsJson = fs.readFileSync(versionsJSONFile, 'utf8'); // Read the versions.json file
  versionsArray = JSON.parse(versionsJson);
} catch (err) {
  console.error('Could not read versions.json:', err);
}

// Read and parse the existing docusaurus.config.js
const configCode = fs.readFileSync(`${baseDirectory}/${docusaurusConfigFile}`, 'utf8'); // Read the docusaurus.config.js file
const ast = parser.parse(configCode, {
  sourceType: 'module',
});

// Find the 'config' object
let configObject;
ast.program.body.forEach((node) => {
  if (
    node.type === 'VariableDeclaration' &&
    node.declarations[0].id.name === 'config'
  ) {
    configObject = node.declarations[0].init.properties.find(
      (prop) => prop.key.name === 'presets'
    ).value.elements[0].elements[1].properties.find(
      (prop) => prop.key.name === 'docs'
    ).value.properties.find(
      (prop) => prop.key.name === 'versions'
    ).value;
  }
});


// Add versions to 'configObject'
versionsArray.forEach((version) => {
  const versionProperty = t.objectProperty(
    t.stringLiteral(version),
    // Add the 'banner' property to the version object and set it to 'none'
    // This removes the warning banner from the versioned docs that states a version is not maintained anymore.
    t.objectExpression([t.objectProperty(t.identifier('banner'), t.stringLiteral('none'))])
  );
  configObject.properties.push(versionProperty);
});

// Generate the updated code
const updatedCode = generate(ast).code;

// Write the updated code back to docusaurus.config.js
fs.writeFileSync(`${tempDirectory}/temp.docusaurus.config.js`, updatedCode);
