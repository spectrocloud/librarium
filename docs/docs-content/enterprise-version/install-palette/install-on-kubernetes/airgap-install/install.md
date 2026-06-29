---
sidebar_label: "Install Palette"
title: "Install Airgap Self-Hosted Palette"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "enterprise", "airgap"]
keywords: ["self-hosted", "enterprise"]
---

You can use the Palette Helm chart to install Palette in a multi-node Kubernetes cluster in your airgap production
environment.

This installation method is common in secure environments with restricted network access that prohibits using Palette
SaaS. Review our [architecture diagrams](../../../../architecture/networking-ports.md) to ensure your Kubernetes cluster
has the necessary network connectivity for self-hosted Palette to operate successfully.

## Prerequisites

:::warning

- Complete the [Environment Setup](./kubernetes-airgap-instructions.md) steps before proceeding with the installation.

- Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette
  agent and Palette-created Kubernetes resources that will interfere with the installation of Palette.

:::

### Kubernetes Cluster

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-cluster-prereqs"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Local Environment

<PartialsComponent category="self-hosted" name="kubernetes-install-local-prereqs" edition="palette" version="Palette" />

### Other Prerequisites

<PartialsComponent category="self-hosted" name="kubernetes-install-other-prereqs" edition="palette" version="Palette" />

## Install Palette

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-begin"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Cert-Manager Helm Chart

3. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-cert-manager-airgap"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Spectro Management CRDs Helm Chart

7.  <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-spectro-mgmt-crds"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Palette Helm Chart

8.  <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-main-chart-airgap"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Image Swap Helm Chart

11. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-image-swap"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Reach System Helm Chart

12. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-reach-system"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Installation

13. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-end"
      edition="palette"
      version="Palette"
      helm="palette"
    />

## Validate

<PartialsComponent
  category="self-hosted"
  name="kubernetes-install-validate"
  edition="palette"
  version="Palette"
  helm="palette"
/>

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="Palette" version="Palette" />
