import { FunctionComponent } from "react";
import GetAllVersions from "./GetAllVersions";

export interface PartialsMap {
  [key: string]: FunctionComponent;
}

export interface Modules {
  [key: string]: Module;
}

interface Module {
  frontMatter: {
    partial_category: string;
    partial_name: string;
  };
  default: FunctionComponent;
}

export default function ImportPartials(): PartialsMap {
  const pmap: PartialsMap = {};
  const versions: string[] = GetAllVersions();
  versions.map((ver) => {
    if (ver == "current") {
      importLatestHelper(ver, pmap);
    } else {
      //Import all the versioned partials if this is the first time we visit this version.
      importVersionedHelper("version-" + ver, pmap);
    }
  });

  return pmap;
}

function importLatestHelper(prefix: string, existingPartials: PartialsMap) {
  try {
    // Linting is disabled for next line, as we need the ability to dynamically import partials.
    // eslint-disable-next-line  @typescript-eslint/no-var-requires
    const modules: Modules = require("@site/_partials");
    MapPartials(prefix, modules, existingPartials);
  } catch {
    console.log("No partials found for " + prefix + ". Skipping imports for it.");
  }
}

function importVersionedHelper(prefix: string, existingPartials: PartialsMap) {
  try {
    // Linting is disabled for next line, as we need the ability to dynamically import partials.
    // eslint-disable-next-line  @typescript-eslint/no-var-requires
    const modules: Modules = require("@site/versioned_partials/" + prefix + "/");
    MapPartials(prefix, modules, existingPartials);
  } catch {
    console.log("No partials found for " + prefix + ". Skipping imports for it.");
  }
}

export function MapPartials(ver: string, module: Modules, pmap: PartialsMap) {
  // The keys are the names of each exported module in _partials/index.ts
  const partialKeys: string[] = Object.keys(module);
  partialKeys.map(function (pkey) {
    const currentPartial: Module = module[pkey];
    const catFrontMatter = currentPartial.frontMatter.partial_category;
    const nameFrontMatter = currentPartial.frontMatter.partial_name;

    if (!catFrontMatter || !nameFrontMatter) {
      throw new Error("Please specify partial_category and partial_name for ".concat(pkey).concat("."));
    }

    const mapKey = ver.concat("#").concat(catFrontMatter).concat("#").concat(nameFrontMatter);
    if (pmap[mapKey]) {
      throw new Error(
        "Duplicate partial defined for name "
          .concat(nameFrontMatter)
          .concat(" in category ")
          .concat(catFrontMatter)
          .concat("for version")
          .concat(ver)
          .concat(".")
      );
    }

    pmap[mapKey] = currentPartial.default;
  });

  return pmap;
}
