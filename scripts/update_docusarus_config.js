const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const docusaurusConfigFile = 'docusaurus.config.js';
const versionsJSONFile = 'versions.json';
const tempDirectory = process.argv[2];
const baseDirectory = process.argv[3];

// This creates an array that contains all the versions that are in the versions.json file. 
// The versions.json file is created by the bash script (versions.sh) that runs before this one.
let versionsArray = [];
try {
  const versionsJson = fs.readFileSync(versionsJSONFile, 'utf8');
  versionsArray = JSON.parse(versionsJson);
} catch (err) {
  console.error('Could not read versions.json:', err);
}


// This creates an array that contains all the versions that are in the versionsOverride.json file.
// The versionsOverride.json file is a manually created file that allows us to override the banner and label for a specific version.
// If the version is not in the versionsOverride.json file, then the banner will be set to 'none' and the label will be the version number.
let versionsOverride = [];
try {
  const versionsOverrideJson = fs.readFileSync(`${baseDirectory}/versionsOverride.json`, 'utf8');
  versionsOverride = JSON.parse(versionsOverrideJson);
} catch (err) {
  console.error('Could not read versionsOverride.json:', err);
}

// This reads the docusaurus.config.js file and parses it into an AST.
// We need to parse it into an AST so that we can add the new versions to the config object.
// This is how we dynamically add the new versions to the config object.
const configCode = fs.readFileSync(`${baseDirectory}/${docusaurusConfigFile}`, 'utf8');
const ast = parser.parse(configCode, {
  sourceType: 'module',
});

// This is where the scripts loop through the AST to find the config object.
// We are after the config object and the docs object that is nested inside of it.
// Inside of the docs object is the versions object that we need to add the new versions to.
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

// This is where the scrip loops through the versions array and add the new versions to the config object.
// This also check to identify if the version is in the versionsOverride.json file.
// If it is, then use the banner and label from the versionsOverride.json file.
versionsArray.forEach((version) => {
  const override = versionsOverride.find((item) => item.version === version) || {};
  const bannerValue = override.banner || 'none';
  const labelValue = override.label || `v${version}`;

  const versionProperty = t.objectProperty(
    t.stringLiteral(version),
    t.objectExpression([
      t.objectProperty(t.identifier('banner'), t.stringLiteral(bannerValue)),
      t.objectProperty(t.identifier('label'), t.stringLiteral(labelValue))
    ])
  );

  configObject.properties.push(versionProperty);
});

// This is where the new config object is converted back into code.
const updatedCode = generate(ast).code;

// Lastly, this is where the new config object is written to the temp.docusaurus.config.js file.
// Catch the error if it fails.
try {
  fs.writeFileSync(`${tempDirectory}/temp.docusaurus.config.js`, updatedCode);
} catch (err) {
  console.error('Could not write to temp.docusaurus.config.js:', err);
}
