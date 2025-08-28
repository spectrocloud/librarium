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
import K8sIcon from "@site/static/assets/packs/k8s_layer.svg";
import CniIcon from "@site/static/assets/packs/cni_layer.svg";
import OsIcon from "@site/static/assets/packs/os_layer.svg";
import ServiceMeshIcon from "@site/static/assets/packs/service_mesh_layer.svg";
import MonitoringIcon from "@site/static/assets/packs/monitoring_layer.svg";
import CsiIcon from "@site/static/assets/packs/csi_layer.svg";
import LoggingIcon from "@site/static/assets/packs/logging_layer.svg";
import LoadBalancerIcon from "@site/static/assets/packs/load_balancer_layer.svg";
import IngressIcon from "@site/static/assets/packs/ingress_layer.svg";
import AuthenticationIcon from "@site/static/assets/packs/authentication_layer.svg";
import RegistryIcon from "@site/static/assets/packs/registry_layer.svg";
import SystemAppIcon from "@site/static/assets/packs/system_app_layer.svg";
import SecurityIcon from "@site/static/assets/packs/security_layer.svg";
import AppServicesIcon from "@site/static/assets/packs/system_app_layer.svg";
import AiIcon from "@site/static/assets/packs/ai_layer.svg";
import MiscIcon from "@site/static/assets/packs/misc_layer.svg";
import BookIcon from "@site/static/assets/icons/book-solid-full.svg";
import FlagIcon from "@site/static/assets/icons/flag-checkered-solid-full.svg";
import UsersIcon from "@site/static/assets/icons/users-solid-full.svg";
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
  integration: <SystemAppIcon />,
  k8s: <K8sIcon />,
  cni: <CniIcon />,
  os: <OsIcon />,
  servicemesh: <ServiceMeshIcon />,
  monitoring: <MonitoringIcon />,
  csi: <CsiIcon />,
  logging: <LoggingIcon />,
  "load balancer": <LoadBalancerIcon />,
  ingress: <IngressIcon />,
  authentication: <AuthenticationIcon />,
  registry: <RegistryIcon />,
  "system app": <SystemAppIcon />,
  spectro: <MiscIcon />,
  security: <SecurityIcon />,
  serverless: <MiscIcon />,
  "app services": <AppServicesIcon />,
  ai: <AiIcon />,
  book: <BookIcon />,
  flag: <FlagIcon />,
  users: <UsersIcon />,
};

function IconMapper({ type }: { type: string }): React.ReactElement {
  if (!icons[type]) {
    return <FontAwesomeIcon icon={fontAwesomeIcons[type as keyof typeof fontAwesomeIcons] as IconProp} />;
  }

  return icons[type];
}

export default IconMapper;
