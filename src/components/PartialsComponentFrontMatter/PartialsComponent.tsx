import React, { FunctionComponent } from "react";
// Import all the partials as one module. 
import * as PartialModules from "@site/_partials";

export interface PartialsMap {
    [key: string]: FunctionComponent;
}

interface InputProperty {
    key: string,
    value: string,
}

interface PartialsComponentDetails {
    category: string;
    name: string;
    // Pass the key-value property pairs 
    props: InputProperty[];
}

const AllPartials = importPartials()

export default function PartialsComponentFrontMatter(details : PartialsComponentDetails) : React.ReactElement {
    var mapKey = getMapKey(details.category, details.name)
    
    if (!AllPartials[mapKey]) {
    throw new Error("No partial found for name ".
        concat(details.name).
        concat(" in category ").
        concat(details.category).
        concat(".="));
    }

    // Map elements to index signatures
    var propAttribute: {[key: string] : string} = {}
    details.props.map((val) => {
        propAttribute[val.key] = val.value
    })

    var cloned = React.createElement(AllPartials[mapKey], propAttribute);
    return cloned;
}

function importPartials() : PartialsMap {
    const pmap : PartialsMap = {}

    // Partials exported as default
    const defaultModules = PartialModules.default
    // The keys are the names of each imported module in _partials/index.ts
    const categoryKeys = Object.keys(defaultModules);

    for (const categoryKey of categoryKeys) {
        var currentCategory = defaultModules[categoryKey];

        // Each category contains its own partials exported as default in its own index.ts
        const defaultPartials = currentCategory.default
        // The keys are the names of each imported module in _partials/index.ts
        const partialKeys = Object.keys(defaultPartials);
        for (const partialKey of partialKeys) {
            var currentPartial = defaultPartials[partialKey];
            var catFrontMatter = currentPartial["frontMatter"]["partial_category"];
            var nameFrontMatter = currentPartial["frontMatter"]["partial_name"];

            var mapKey = getMapKey(catFrontMatter, nameFrontMatter)
            if (pmap[mapKey]) {
                throw new Error("Duplicate partial defined for name ".
                    concat(nameFrontMatter).
                    concat(" in category ").
                    concat(catFrontMatter).
                    concat(".="));
            }

            pmap[mapKey] = currentPartial.default as FunctionComponent;
        }
    }
    return pmap
}

function getMapKey(category: string, name: string): string {
   return category.concat('#').concat(name)
}