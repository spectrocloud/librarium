---
sidebar_label: "Install VerteX"
title: "Install Airgap Self-Hosted Palette VerteX"
description: "Learn how to deploy airgap VerteX to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "enterprise"]
keywords: ["self-hosted", "vertex"]
---

You can use the Palette VerteX Helm chart to install Palette VerteX in a multi-node Kubernetes cluster in your
production environment.

This installation method is common in secure environments with restricted network access that prohibits using Palette
VerteX SaaS. Review our [architecture diagrams](../../../../architecture/networking-ports.md) to ensure your Kubernetes
cluster has the necessary network connectivity for Palette VerteX to operate successfully.

## Prerequisites

:::warning

- Complete the [Environment Setup](./kubernetes-airgap-instructions.md) steps before proceeding with the installation.

- Do not use a VerteX-managed Kubernetes cluster when installing VerteX. VerteX-managed clusters contain the VerteX
  agent and VerteX-created Kubernetes resources that will interfere with the installation of VerteX.

:::

### Kubernetes Cluster

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-cluster-prereqs"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

- _(FIPS compliance only)_ The OS and Kubernetes cluster you are installing Palette VerteX onto must be FIPS-compliant.
  Otherwise, Palette VerteX and its operations will not be FIPS-compliant.

### Local Environment

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-local-prereqs"
  edition="vertex"
  version="Palette VerteX"
/>

### Other Prerequisites

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-other-prereqs"
  edition="vertex"
  version="Palette VerteX"
/>

## Install Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-begin"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

### Cert-Manager Helm Chart

3. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-cert-manager-airgap"
     edition="vertex"
     version="Palette VerteX"
     helm="vertex"
   />

### Spectro Management CRDs Helm Chart

7.  <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-spectro-mgmt-crds"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### VerteX Helm Chart

8.  <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-main-chart-airgap"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Image Swap Helm Chart

11. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-image-swap"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Reach System Helm Chart

12. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-reach-system"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

### Installation

13. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-end"
      edition="vertex"
      version="Palette VerteX"
      helm="vertex"
    />

## Validate

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-validate"
  edition="vertex"
  version="Palette VerteX"
  helm="vertex"
/>

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="VerteX" version="Palette VerteX" />
