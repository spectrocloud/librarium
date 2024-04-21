export interface FrontMatterData {
  name: string;
  sidebar_label: string;
  title: string;
  description: string;
  hide_table_of_contents: boolean;
  type: string;
  category: string[];
  logoUrl: string;
  slug: string;
  id: string;
  packType: string;
  verified: boolean;
  cloudTypes: string[];
  readme: Map<string, string>;
  versions: VersionTemplate[];
  community: boolean;
  registries: string[];
}

export interface VersionTemplate {
  title: string;
  version: string;
  packUid: string;
  children: VersionTemplate[];
}

export interface PacksData {
  fields: FrontMatterData;
}

export interface IntegrationsData {
  fields: FrontMatterData;
}

export interface RepositoryData {
  name: string;
  uid: string;
}

export default interface PacksIntegrationsPluginData {
  integrations: PacksData[];
  packs: IntegrationsData[];
  repositories: RepositoryData[];
}
