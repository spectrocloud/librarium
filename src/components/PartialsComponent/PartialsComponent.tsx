import React from "react";
import ImportPartials from "./PartialsImporter";

interface ComponentProperties {
  [key: string]: string;
}

const AllPartials = ImportPartials();

export default function PartialsComponent(details: ComponentProperties): React.ReactElement {
  const mapKey = details.category.concat("#").concat(details.name);

  if (!AllPartials[mapKey]) {
    throw new Error(
      "No partial found for name ".concat(details.name).concat(" in category ").concat(details.category).concat(".")
    );
  }

  // Map elements to object properties
  const propAttribute: { [key: string]: string } = {};
  for (const key in details) {
    // Don't send category and name to the partial
    if (key == "category" || key == "name") {
      continue;
    }
    propAttribute[key] = details[key];
  }

  return React.createElement(AllPartials[mapKey], propAttribute);
}
