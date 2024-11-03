import React from "react";
import PacksReadme from "@site/src/components/PacksReadme/PacksReadme";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { Switch, Redirect } from "react-router-dom";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface Packs {
  route: PacksData;
}

interface PacksData {
  data: {
    name: string;
    version: string;
    parent: string;
  };
}

export default function Packs(props: Packs) {
  const { siteConfig } = useDocusaurusContext();
  const isPacksDisabled = siteConfig.customFields.DISABLE_PACKS_INTEGRATIONS === "true";

  if (isPacksDisabled) {
    return <Redirect to="/integrations" />;
  }

  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const data = props?.route?.data;
        return data ? (
          <Switch>
            <Redirect to={`/integrations/packs?pack=${data.name}&version=${data.version}&parent=${data.parent}`} />
          </Switch>
        ) : (
          <PacksReadme />
        );
      }}
    </BrowserOnly>
  );
}
