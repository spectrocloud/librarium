import { GettingStartedPartials } from "./maps/GettingStartedPartials"
import { PartialsMap } from "./maps/PartialsMap"

export interface PartialsCategory {
    category: string; 
    map: PartialsMap;
}

interface PartialsMapCategories {
    maps: PartialsCategory[]
}

// Maintain a map of existing partials 
export const AllPartials: PartialsMapCategories = {
   maps: [
        {
            category: "GETTING-STARTED",
            map: GettingStartedPartials
        }
    ]
}; 
