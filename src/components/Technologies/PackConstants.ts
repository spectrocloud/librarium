export const packTypes = [
  'k8s',
  'cni',
  'os',
  'servicemesh',
  'monitoring',
  'csi',
  'logging',
  'load balancer',
  'ingress',
  'authentication',
  'registry',
  'system app',
  'spectro',
  'security',
  'serverless',
  'app services',
] as const;

type packType = typeof packTypes[number];

export const packTypeNames: Record<packType, string> = {
  k8s: 'Kubernetes',
  cni: 'Network',
  os: 'Operating System',
  servicemesh: 'Service Mesh',
  monitoring: 'Monitoring',
  csi: 'Storage',
  logging: 'Logging',
  'load balancer': 'Load Balancer',
  ingress: 'Ingress',
  authentication: 'Authentication',
  registry: 'Registry',
  'system app': 'System App',
  spectro: 'Spectro',
  security: 'Security',
  serverless: 'Serverless',
  'app services': 'App Services',
} as const;

export const cloudProviderTypes = {
  aws: 'AWS IaaS',
  eks: 'AWS EKS',
  aks: 'Azure AKS',
  gke: 'GCP GKE',
  azure: 'Azure IaaS',
  gcp: 'GCP IaaS',
  vsphere: 'VMware',
  openstack: 'OpenStack',
  maas: 'MAAS',
  tke: 'TKE',
  'edge-native': 'Edge Native',
  custom: 'Custom',
} as const;
