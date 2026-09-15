---
sidebar_label: "Configure Image Pull Secret"
title: "Configure Image Pull Secret for Security-Hardened Images"
description:
  "Learn how to request and configure an image pull secret from Spectro Cloud, used for retrieving security-hardened
  images."
icon: ""
hide_table_of_contents: false
sidebar_position: 35
tags: ["self-hosted", "account", "image pull secret", "hardened images", "security"]
keywords: ["self-hosted", "palette", "image pull secret", "hardened images", "security"]
---

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-intro"
  edition="palette"
  version="Palette"
  helm="palette"
/>

:::info

If your installation pulls images from the Spectro Cloud registry instead of a local registry, configure the image pull
secret before you upgrade or install. Until you do, Local UI and the system console display a warning. Existing clusters
and workloads are unaffected, but new cluster deployments and day-2 operations that pull Spectro Cloud images fail until
the pull secret is configured.

:::

## When to Configure Image Pull Secret

Depending on how your environment retrieves images, you may or may not need to configure Spectro Cloud's image pull
secret.

Review the following sections to learn if your environment requires configuration.

### Configuration Required

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-config-required"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Configuration Not Required

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-config-not-required"
  edition="palette"
  version="Palette"
  helm="palette"
/>

## Configure Image Pull Secret

Depending on your installation method, you can configure Spectro Cloud's image pull secret during or after installing
self-hosted Palette.

### During Installation

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-during-install"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Helm Chart Installations

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-helm-install"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Palette Management Appliance Installations

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-appliance-install"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Palette CLI Installations

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-cli-install"
  edition="palette"
  version="Palette"
  helm="palette"
/>

### Post-Installation

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-post-install"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-prereqs"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Enablement

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-enablement"
  edition="palette"
  version="Palette"
  helm="palette"
/>

#### Validate

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-validate"
  edition="palette"
  version="Palette"
  helm="palette"
/>

## Monitor Propagation of the Image Pull Secret {#monitor-propagation}

<PartialsComponent
  category="self-hosted"
  name="image-pull-secret-monitor-propagation"
  edition="palette"
  version="Palette"
  helm="palette"
/>
