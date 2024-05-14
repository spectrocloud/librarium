import React from "react";
// Import each partial here 
import PaletteSetup from "@site/_partials/getting-started/_palette-setup.mdx"
import { PartialsMap } from "@site/src/components/PartialsComponent/PartialsMap.tsx"

// Maintain a map of existing partials 
export const GettingStartedPartials: PartialsMap = {
    "PaletteSetup": <PaletteSetup />,
};