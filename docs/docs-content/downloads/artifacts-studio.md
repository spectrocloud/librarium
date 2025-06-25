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

[Artifacts Studio](https://artifact-studio.internal.spectrocloud.com/) is a unified platform that helps air-gapped and regulatory-focused organizations to populate their own internal registries with bundles, packs and installers to be used with Palette or VerteX. There are four main areas for Artifacts:
	- Download of Palette Enterprise (binary or ISO).
	- Download of Palette VerteX (binary or ISO).
	- Create a pack bundle to download.
	- Browse pack Catalog to download individual packs. 

![Image of the default homepage of Artifacts Studio](../../../static/assets/docs/images/downloads/downloads_artifacts-studio-main.webp)

## Install Palette Enterprise

1. Navigate to [Artifacts Studio](https://artifact-studio.internal.spectrocloud.com/).

2. From the drop-down, select the version needed, and click **Show Binaries**.

3. Click **Download** on Enterprise Binary or Release Iso, whichever file is appropriate for your environment. 


## Install Palette VerteX

1. Navigate to [Artifacts Studio](https://artifact-studio.internal.spectrocloud.com/).

2. From the drop-down, select the version needed, and click **Show Binaries**.

3. Click **Download** on VerteX Binary or Release Iso, whichever file is appropriate for your environment. 

## Create pack bundle

1. Navigate to [Artifacts Studio](https://artifact-studio.internal.spectrocloud.com/).

2. ....

3. Click on **Bundle Verification Instructions** found at the top right of the page. 

4. Download the public key file `public_key.pem`.

5. Use the following command to verify the individual pack integrity. 

```
openssl dgst -sha256 -verify public_key.pem -signature bundle-name.tar.sig.bin bundle-name.zst
```

6. A successful verification will show: **Verification OK**.

Alternatively, use the following sample script to check all the files downloaded.

```shell title="Example"
 
# This script verifies the signatures of data files against a public key.
# It expects files named like `datafile.zst` and corresponding signatures `datafile.sig.bin`.
# Ensure you have OpenSSL installed to run this script and that the public key is in PEM format.
# Ensure the script has execute permissions: `chmod +x verify.sh`
# Usage: ./verify.sh 

#!/bin/bash

PUBKEY="public_key.pem" # Enter path to public key file

for sigfile in *.sig.bin; do
  # Strip `.sig.bin` to get base filename and corresponding data file
  base="${sigfile%.sig.bin}"
  datafile="${base}.zst"

  if [[ ! -f "$datafile" ]]; then # Check if data file exists
    echo "$datafile: ❌ Data file not found" # Skip to next iteration  
    continue
  fi

  # Run signature verification
  if openssl dgst -sha256 -verify "$PUBKEY" -signature "$sigfile" "$datafile" > /dev/null 2>&1; then # Verify signature
    echo "$datafile: ✅ Signature valid" # Print success message
  else
    echo "$datafile: ❌ Signature invalid" # Print failure message
  fi
done
```

You should see the following output.

```shell title="Output Example"
cni-calico-3.29.2.zst: ✅ Signature valid
csi-aws-ebs-1.41.0.zst: ✅ Signature valid
kubernetes-1.32.3.zst: ✅ Signature valid
spectro-k8s-dashboard-7.11.1.zst: ✅ Signature valid
ubuntu-aws-22.04.zst: ✅ Signature valid
```

## Download specific pack

