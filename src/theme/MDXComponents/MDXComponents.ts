import MDXComponents from "@theme-original/MDXComponents";
import customMdxComponents from "@site/src/components/mdx/index";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Tooltip from "@site/src/components/Tooltip/Tooltip";
import PointsOfInterest from "@site/src/components/PointOfInterest/index";
import YouTube from "@site/src/components/Youtube/Youtube";
import Packs from "@site/src/components/Integrations/Packs/Packs";
import PacksInformation from "@site/src/components/PacksInformation/PacksInformation";
import AppTiers from "@site/src/components/Integrations/AppTiers/AppTiers";
import PacksTable from "@site/src/components/PacksTable/PacksTable";
import TOCInline from "@theme/TOCInline";
import { TechnicalPreviewReleaseNote as TpBadge } from "@site/src/components/Badges";
import SimpleCardGrid from "@site/src/components/SimpleCardGrid/index";
import ReleaseNotesVersions from "@site/src/components/ReleaseNotesVersions/index";
import ReleaseNotesBreakingChanges from "@site/src/components/ReleaseNotesBreakingChanges/index";
import PartialsComponent from "@site/src/components/PartialsComponent";
import VersionedLink from "@site/src/components/VersionedLink";
import PaletteVertexUrlMapper from "@site/src/components/PaletteVertexUrlMapper/PaletteVertexUrlMapper";
import Accordion from "@site/src/components/Accordion";
import AccordionPanel from "@site/src/components/AccordionPanel";
import RedirectPackPage from "@site/src/components/RedirectPackPage";
import OsCveTable from "@site/src/components/OsCveTable/OsCveTable";

export default {
  ...MDXComponents,
  ...customMdxComponents,
  Accordion,
  AccordionPanel,
  Tabs,
  TabItem,
  Tooltip,
  PointsOfInterest,
  YouTube,
  Packs,
  PacksInformation,
  AppTiers,
  PacksTable,
  TOCInline,
  TpBadge,
  SimpleCardGrid,
  ReleaseNotesVersions,
  PartialsComponent,
  VersionedLink,
  PaletteVertexUrlMapper,
  RedirectPackPage,
  OsCveTable,
  ReleaseNotesBreakingChanges,
};
