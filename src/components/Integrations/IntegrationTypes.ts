export interface FrontMatterData {
  name: string;
  title: string;
  description: string;
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
  disabled: boolean;
  deprecated: boolean;
}

export interface VersionTemplate {
  title: string;
  version: string;
  packUid: string;
  children: VersionTemplate[];
}

export interface RepositoryData {
  name: string;
  uid: string;
}

export default interface PacksIntegrationsPluginData {
  integrations: FrontMatterData[];
  packs: FrontMatterData[];
  repositories: RepositoryData[];
}
