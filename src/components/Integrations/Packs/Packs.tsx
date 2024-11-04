import React from "react";
import Integrations from "@site/src/components/Technologies";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../IntegrationTypes";
import Admonition from "@theme/Admonition";

export default function Packs() {
  try {
    const { packs, repositories } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;
    if (!packs && !repositories) {
      throw new Error("No packs data is available at the moment. Returning admonition with warning message.");
    }

    return <Integrations data={packs} repositories={repositories} />;
  } catch (_e) {
    return (
      <Admonition type="warning">
        <p>
          No packs data is available at the moment. This may be due to maintenance or an issue with the data source. Try
          again later.
        </p>
      </Admonition>
    );
  }
}
