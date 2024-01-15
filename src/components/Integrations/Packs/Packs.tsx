import React from "react";
import Integrations from "@site/src/components/Technologies";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../IntegrationTypes";

export default function Packs() {
  const { packs } = usePluginData(
    "plugin-packs-integrations",
  ) as PacksIntegrationsPluginData;
  return <Integrations data={packs} />;
}
