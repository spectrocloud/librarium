---
sidebar_label: "Artifacts Studio"
title: "Artifacts Studio"
description: "Overview of the Artifacts Studio"
hide_table_of_contents: false
sidebar_position: 10
sidebar_custom_props:
  icon: "layer-group"
tags: ["downloads", "artifact-studio"]
---

Artifacts Studio is a unified platform that helps air-gapped and regulatory-focused organizations to populate their own internal registries with bundles, packs and installers to be used with Palette or VerteX. There are four main areas for Artifacts:
	- Download of Palette Enterprise (binary or ISO).
	- Download of Palette VerteX (binary or ISO).
	- Create a pack bundle to download.
	- Browse pack Catalog to download individual packs. 

![Image of the default homepage of Artifacts Studio](../../../static/assets/docs/images/downloads/downloads_artifacts-studio-main.webp)

## Install Palette Enterprise

From the drop-down, select the version needed, and click **Show Binaries**.

Click **Download** on Enterprise Binary or Release Iso, whichever file is appropriate for your environment. 


## Install Palette VerteX

From the drop-down, select the version needed, and click **Show Binaries**.

Click **Download** on VerteX Binary or Release Iso, whichever file is appropriate for your environment. 

Click on **Bundle Verification Instructions** found at the top right of the page. 

## Create pack bundle



Click on **Bundle Verification Instructions** found at the top right of the page. 

Download the public key file `public_key.pem`.

Use the following command to verify the bundle integrity. 

```
openssl dgst -sha256 -verify public_key.pem -signature bundle-name.tar.sig.bin bundle-name.zst
```

A successful verification will show: **Verification OK**.