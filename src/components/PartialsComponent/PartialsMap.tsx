import React from "react";
import { GettingStartedPartials } from "./maps/GettingStartedPartialsMap"

export interface PartialsMap {
    [key: string]: React.ReactElement;
}

export interface PartialsMapCategory {
    category: string; 
    map: PartialsMap;
}

interface PartialsMapCategories {
    maps: PartialsMapCategory[]
}

// Maintain a map of existing partials 
export const AllPartials: PartialsMapCategories = {
   maps: [
        {
            category: "GETTING-STARTED",
            map: GettingStartedPartials
        }
    ]}; 
