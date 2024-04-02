export interface FrontMatterData {
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
}

export interface PacksData {
  fields: FrontMatterData;
}

export interface IntegrationsData {
  fields: FrontMatterData;
}

export default interface PacksIntegrationsPluginData {
  integrations: PacksData[];
  packs: IntegrationsData[];
}
