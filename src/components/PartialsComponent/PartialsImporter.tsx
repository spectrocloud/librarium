import { FunctionComponent } from "react";
// Import all the partials as one module.
import * as PartialModules from "@site/_partials";

export interface PartialsMap {
  [key: string]: FunctionComponent;
}

interface Modules {
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
  const allPartialModules: Modules = PartialModules;

  // The keys are the names of each exported module in _partials/index.ts
  const partialKeys: string[] = Object.keys(allPartialModules);
  partialKeys.map(function (pkey) {
    const currentPartial: Module = allPartialModules[pkey];
    const catFrontMatter = currentPartial.frontMatter.partial_category;
    const nameFrontMatter = currentPartial.frontMatter.partial_name;

    if (!catFrontMatter || !nameFrontMatter) {
      throw new Error("Please specify partial_category and partial_name for ".concat(pkey).concat("."));
    }

    const mapKey = catFrontMatter.concat("#").concat(nameFrontMatter);
    if (pmap[mapKey]) {
      throw new Error(
        "Duplicate partial defined for name "
          .concat(nameFrontMatter)
          .concat(" in category ")
          .concat(catFrontMatter)
          .concat(".")
      );
    }

    pmap[mapKey] = currentPartial.default;
  });

  return pmap;
}
