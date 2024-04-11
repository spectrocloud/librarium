import React from "react";
import { useLocation } from 'react-router-dom';
import PacksReadme from "@site/src/components/PacksReadme";
import { usePluginData } from "@docusaurus/useGlobalData";
import PacksIntegrationsPluginData from "../Integrations/IntegrationTypes";
import Layout from '@theme/Layout';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'

interface PackInfoProps {
  custom: any;
};


export default function Packs(props:any) {
  //const { packs } = usePluginData("plugin-packs-integrations") as PacksIntegrationsPluginData;

  //return <PacksReadme data={packs} />;
  let match = useRouteMatch();
  const location = useLocation();
  const packName = location?.state?.id;
  return (
    <>
      { props?.route?.data ?
        (<Switch>
            <Redirect to={`/integrations/packs?pack=${props.route.data}`} />
        </Switch>) : (
          <PacksReadme />
        )
      }
      </>
  );
}
