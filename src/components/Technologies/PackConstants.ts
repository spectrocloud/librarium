export const packTypes = [
  'app services',
  'authentication',
  'ingress',
  'k8s',
  'load balancer',
  'logging',
  'monitoring',
  'cni',
  'os',
  'registry',
  'security',
  'servicemesh',
  'csi',
  'system app',
] as const;

type packType = typeof packTypes[number];

export const packTypeNames: Record<packType, string> = {
  'app services': 'App Services',
  authentication: 'Authentication',
  ingress: 'Ingress',
  k8s: 'Kubernetes',
  'load balancer': 'Load Balancer',
  logging: 'Logging',
  monitoring: 'Monitoring',
  cni: 'Network',
  os: 'Operating System',
  registry: 'Registry',
  security: 'Security',
  servicemesh: 'Service Mesh',
  csi: 'Storage',
  'system app': 'System App',
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

export const layerTypes = [
  'k8s',
  'cni',
  'os',
  'csi',
] as const;

export const addOnTypes = [
  'app services',
  'authentication',
  'ingress',
  'load balancer',
  'logging',
  'monitoring',
  'registry',
  'security',
  'servicemesh',
  'system app',
] as const;
