---
sidebar_label: "Install Non-Airgap Palette VerteX"
title: "Install Non-Airgap Palette VerteX on VMware vSphere with Palette CLI"
description: "Install non-airgap, self-hosted Palette VerteX on VMware vSphere using the Palette CLI."
icon: ""
sidebar_position: 20
hide_table_of_contents: false
tags: ["self-hosted", "vertex", "vmware", "non-airgap", "cli"]
keywords: ["self-hosted", "vertex", "vmware", "non-airgap", "cli"]
---

<PartialsComponent category="self-hosted" name="install-non-airgap-introduction" version="Palette VerteX" />

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="install-vmware-prerequisites-first"
  edition="VerteX"
  version="Palette VerteX"
/>

:::warning

Palette VerteX does not support insecure connections. Ensure you have the Certificate Authority (CA) available in PEM
format when using custom packs and an image registry. Otherwise, VerteX will not be able to pull packs and images from
the registry. The Palette CLI will prompt you to provide the CA certificate file path when necessary.

:::

<PartialsComponent
  category="self-hosted"
  name="install-vmware-prerequisites-second"
  edition="VerteX"
  version="Palette VerteX"
/>

## Deploy

<PartialsComponent
  category="self-hosted"
  name="install-vmware-non-airgap-first"
  edition="VerteX"
  version="Palette VerteX"
/>
:::info

    Refer to the [Additional OVAs](../../../../../../downloads/palette-vertex/additional-ovas) page for a list of additional OVAs you can download and upload to your vCenter environment.

    :::

<PartialsComponent category="self-hosted" name="install-vmware-non-airgap-second" />

<Video title="palette-cli-install" src="/videos/vertex-install.mp4"></Video>

<PartialsComponent
  category="self-hosted"
  name="install-vmware-non-airgap-third"
  edition="VerteX"
  version="Palette VerteX"
/>

    ![Screenshot of the Palette VerteX system console showing Username and Password fields.](/self-hosted-setup_install_non-airgap_vertex-system-console_4-8.webp)

## Validate

<PartialsComponent category="self-hosted" name="install-non-airgap-validation" />

## Next Steps

<PartialsComponent
  category="self-hosted"
  name="install-next-steps"
  install="vmware"
  edition="VerteX"
  version="Palette VerteX"
/>
