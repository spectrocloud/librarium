import React from 'react';

async function created() {
  let fileExists;
  try {
    fileExists = await import('@site/docs/docs-content/integrations/falco.md').then((res) => res.default);
  } catch (err) {
    fileExists = null;
  }
  return fileExists;
}

const NewComponent = created();
export default NewComponent;
