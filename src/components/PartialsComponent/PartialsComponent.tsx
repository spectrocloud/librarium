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

  // Prefer a partial defined for this exact version, then fall back to the "current" one.
  //
  // A versioned docs collection whose partials have not been versioned alongside it -- which is
  // every collection today, since versioned_partials/ is only generated for the default
  // collection -- would otherwise fail the build on every frozen page that uses a partial.
  // Falling back makes partials shared by default, with a versioned override remaining opt-in:
  // drop a partial into versioned_partials/version-<v>/ and it wins for that version.
  const foundPartial =
    AllPartials[getMapKey(ver, details.category, details.name)] ??
    AllPartials[getMapKey("current", details.category, details.name)];
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
