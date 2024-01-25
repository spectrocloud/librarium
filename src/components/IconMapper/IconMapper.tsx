import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AboutIcon from "@site/static/assets/icons/about.svg";
import AdminIcon from "@site/static/assets/icons/admin.svg";
import AuditsIcon from "@site/static/assets/icons/audits.svg";
import BellIcon from "@site/static/assets/icons/bell.svg";
import BundlesIcon from "@site/static/assets/icons/bundles.svg";
import ClustersIcon from "@site/static/assets/icons/clusters.svg";
import CogIcon from "@site/static/assets/icons/cog.svg";
import FolderIcon from "@site/static/assets/icons/folder.svg";
import Graph from "@site/static/assets/icons/graph.svg";
import LogoutIcon from "@site/static/assets/icons/logout.svg";
import NodesIcon from "@site/static/assets/icons/nodes.svg";
import OverlordIcon from "@site/static/assets/icons/overlord.svg";
import OverviewIcon from "@site/static/assets/icons/overview.svg";
import ProjectIcon from "@site/static/assets/icons/project.svg";
import RolesIcon from "@site/static/assets/icons/roles.svg";
import TeamsIcon from "@site/static/assets/icons/teams.svg";
import WorkspacesIcon from "@site/static/assets/icons/workspaces.svg";
import TerraformIcon from "@site/static/assets/icons/terraform.svg";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { fontAwesomeIcons } from "./dynamicFontAwesomeImports";

interface IconsMap {
  [key: string]: React.ReactElement;
}

export const icons: IconsMap = {
  about: <AboutIcon />,
  admin: <AdminIcon />,
  audits: <AuditsIcon />,
  bell: <BellIcon />,
  bundles: <BundlesIcon />,
  clusters: <ClustersIcon />,
  cog: <CogIcon />,
  folder: <FolderIcon />,
  graph: <Graph />,
  logout: <LogoutIcon />,
  nodes: <NodesIcon />,
  overlord: <OverlordIcon />,
  overview: <OverviewIcon />,
  project: <ProjectIcon />,
  roles: <RolesIcon />,
  teams: <TeamsIcon />,
  workspaces: <WorkspacesIcon />,
  terraform: <TerraformIcon />,
};

function IconMapper({ type }: { type: string }): React.ReactElement {
  if (!icons[type]) {
    return <FontAwesomeIcon icon={fontAwesomeIcons[type as keyof typeof fontAwesomeIcons] as IconProp} />;
  }

  return icons[type];
}

export default IconMapper;
