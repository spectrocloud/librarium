import React from "react";
import PacksReadme from "@site/src/components/PacksReadme/PacksReadme";
import { Switch, Redirect } from 'react-router-dom'

export default function Packs(props: any) {
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
