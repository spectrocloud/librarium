export const packTypes = [
  "ai",
  "app services",
  "authentication",
  "ingress",
  "k8s",
  "load balancer",
  "logging",
  "monitoring",
  "cni",
  "os",
  "registry",
  "security",
  "servicemesh",
  "csi",
  "system app",
  "integration",
] as const;

export const packTypeNames: Record<string, string> = {
  ai: "AI",
  "app services": "App Services",
  authentication: "Authentication",
  ingress: "Ingress",
  k8s: "Kubernetes",
  "load balancer": "Load Balancer",
  logging: "Logging",
  monitoring: "Monitoring",
  cni: "Network",
  os: "Operating System",
  registry: "Registry",
  security: "Security",
  servicemesh: "Service Mesh",
  csi: "Storage",
  "system app": "System App",
  integration: "Integration",
} as const;

export const cloudProviderTypes = [
  { name: "aws", displayName: "AWS IaaS" },
  { name: "eks", displayName: "AWS EKS" },
  { name: "azure", displayName: "Azure IaaS" },
  { name: "aks", displayName: "Azure AKS" },
  { name: "gcp", displayName: "GCP IaaS" },
  { name: "gke", displayName: "GCP GKE" },
  { name: "vsphere", displayName: "VMware" },
  { name: "openstack", displayName: "OpenStack" },
  { name: "maas", displayName: "MAAS" },
  { name: "edge-native", displayName: "Edge" },
  { name: "custom", displayName: "Custom" },
] as const;

export const layerTypes = ["k8s", "cni", "os", "csi"] as const;

export const addOnTypes = [
  "ai",
  "app services",
  "authentication",
  "ingress",
  "load balancer",
  "logging",
  "monitoring",
  "registry",
  "security",
  "servicemesh",
  "system app",
  "integration",
] as const;

export const cloudDisplayNames = {
  aws: "AWS",
  eks: "AWS EKS",
  aks: "Azure AKS",
  gke: "GCP GKE",
  azure: "Azure",
  gcp: "GCP",
  vsphere: "VMware",
  openstack: "OpenStack",
  maas: "MAAS",
  "edge-native": "Edge",
  custom: "Custom",
} as const;
