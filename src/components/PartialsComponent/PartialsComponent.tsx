import React from "react";
// Import each partial here 
import PaletteSetup from "./_partials/getting-started/_palette-setup.mdx"

interface InputProperty {
    key: string,
    value: string,
}

interface PartialsComponentDetails {
    name: string;
    // Pass the key-value property pairs 
    props: InputProperty[];
}

interface PartialsMap {
    [key: string]: React.ReactElement;
}
 
// Maintain a map of existing partials 
export const partials: PartialsMap = {
    PaletteSetup: <PaletteSetup />,
}; 

export default function PartialsComponent(details : PartialsComponentDetails) : React.ReactElement {
    if (!partials[details.name]) {
        throw new Error("No partial found for ".
            concat(details.name).
            concat(". Check partial names in PartialsComponent."))
    }

    // Map elements to index signatures
    var propAttribute: {[key: string] : string} = {}
    details.props.map((val) => {
        propAttribute[val.key] = val.value
    })    

    return React.cloneElement(partials[details.name], propAttribute);
}

