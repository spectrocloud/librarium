import React from "react";
import ImportPartials, { PartialsMap } from "./PartialsImporter";
import GetVersion from "./GetVersion";

interface ComponentProperties {
  [key: string]: string;
}

let AllPartials: PartialsMap = {};
let firstLoad = true;

export default function PartialsComponent(details: ComponentProperties): React.ReactElement {
  // Hooks can only be invoked inside the body of the component, so we cannot load this beforehand.
  if (firstLoad) {
    AllPartials = ImportPartials();
    firstLoad = false;
  }
  // Get the version this page is on.
  const ver: string = GetVersion();

  // Construct the map key including the version
  const mapKey = getMapKey(ver, details.category, details.name);
  const foundPartial = AllPartials[mapKey];
  if (!foundPartial) {
    throw new Error(
      "No partial found for name "
        .concat(details.name)
        .concat(" in category ")
        .concat(details.category)
        .concat(" for version ")
        .concat(ver)
        .concat(".")
    );
  }

  // Remove the key from the details, as it is not a valid prop for the component.
  const { category, name, key: _, ...safeProps } = details;

  return React.createElement(foundPartial, safeProps);
}

function getMapKey(ver: string, category: string, name: string): string {
  if (ver == "current") {
    return ver.concat("#").concat(category).concat("#").concat(name);
  }
  return "version-".concat(ver).concat("#").concat(category).concat("#").concat(name);
}
