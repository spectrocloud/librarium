import React from "react";
import PacksReadme from "@site/src/components/PacksReadme/PacksReadme";
import { Switch, Redirect } from "react-router-dom";

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
  return (
    <>
      {props?.route?.data ? (
        <Switch>
          <Redirect
            to={`/integrations/packs?pack=${props.route.data.name}&version=${props.route.data.version}&parent=${props.route.data.parent}`}
          />
        </Switch>
      ) : (
        <PacksReadme />
      )}
    </>
  );
}
