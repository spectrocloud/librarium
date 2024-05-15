import React from "react";
// Import each partial here 
import ClusterProfiles from "@site/_partials/clusters/_cluster_profile.mdx"
import { PartialsMap } from "./PartialsMap"

// Maintain a map of existing partials 
export const ClusterPartials: PartialsMap = {
    "ClusterProfile": <ClusterProfiles />,
};