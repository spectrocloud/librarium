---
sidebar_label: "Non-Airgap Installation"
title: "Install Non-Airgap Self-Hosted Palette"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "enterprise"]
keywords: ["self-hosted", "enterprise"]
---

You can use the Palette Helm chart to install Palette in a multi-node Kubernetes cluster in your production environment.

## Prerequisites

:::warning

Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette
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

- An image pull secret from Spectro Cloud customer support, required to pull images from Spectro Cloud OCI registries.
  This is not required if you plan to use [mirror registries](../../system-management/registry-override.md) or
  [image swap](../../../clusters/cluster-management/image-swap.md) when pulling images. Refer to
  [Configure Image Pull Secret for Security-Hardened Images](../../system-management/configure-image-pull-secret.md) for
  more information.

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
     name="kubernetes-install-cert-manager-non-airgap"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Spectro Management CRDs Helm Chart

6. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-spectro-mgmt-crds"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Palette Helm Chart

7. <PartialsComponent
     category="self-hosted"
     name="kubernetes-install-main-chart-non-airgap"
     edition="palette"
     version="Palette"
     helm="palette"
   />

### Image Swap Helm Chart

10. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-image-swap"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Reach System Helm Chart

11. <PartialsComponent
      category="self-hosted"
      name="kubernetes-install-reach-system"
      edition="palette"
      version="Palette"
      helm="palette"
    />

### Installation

12. <PartialsComponent
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
