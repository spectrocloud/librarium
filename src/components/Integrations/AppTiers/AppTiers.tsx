import React from "react";
import Integrations from "@site/src/components/Technologies";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../IntegrationTypes";

export default function AppTiers() {
  const { integrations } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
  return <Integrations data={integrations} />;
}
