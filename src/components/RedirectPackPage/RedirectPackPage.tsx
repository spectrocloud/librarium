import React from "react";
import { Redirect } from "@docusaurus/router";

export default function IntegrationsRedirect({ packName }: { packName: string }) {
  return <Redirect to={`/integrations/packs/?pack=${packName}`} />;
}
