import React from "react";
import { useLocation } from 'react-router-dom';
import PacksReadme from "@site/src/components/PacksReadme";
import { Switch, useRouteMatch, Redirect } from 'react-router-dom'

export default function Packs(props: any) {
  let match = useRouteMatch();
  const location = useLocation();
  const packName = location?.state?.id;
  return (
    <>
      {props?.route?.data ?
        (<Switch>
          <Redirect to={`/integrations/packs?pack=${props.route.data}`} />
        </Switch>) : (
          <PacksReadme />
        )
      }
    </>
  );
}
