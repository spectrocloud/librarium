import React from "react";
import { AllPartials, PartialsCategory } from "./PartialsCategories"

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

export default function PartialsComponent(details : PartialsComponentDetails) : React.ReactElement {

    var foundCategoryMap = null;
    AllPartials.maps.forEach((val) => {
        if (val.category == details.category) {
            foundCategoryMap = val;
            return
        }
    })

    if (!foundCategoryMap) {
        throw new Error("No partial found for category".
            concat(details.name).
            concat("."));
    }
    
    const partialsMap = foundCategoryMap as PartialsCategory;
    if (!partialsMap.map[details.name]) {
        throw new Error("No partial found for name ".
            concat(details.name).
            concat("in category ").
            concat(details.category).
            concat(".="));
    }

    // Map elements to index signatures
    var propAttribute: {[key: string] : string} = {}
    details.props.map((val) => {
        propAttribute[val.key] = val.value
    })    

    var cloned = React.cloneElement(partialsMap.map[details.name], propAttribute)

    console.log("Found ORIGINAL: ", partialsMap.map[details.name]);
    console.log("Cloned ORIGINAL: ", cloned);
    return cloned;
}

