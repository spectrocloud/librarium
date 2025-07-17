---
sidebar_label: "Artifact Signatures"
title: "Artifact Signatures"
description: "Learn how Spectro Cloud signs artifacts and how to verify signatures"
hide_table_of_contents: false
sidebar_position: 110
tags: ["security"]
---

As part of our commitment to secure software delivery and regulatory compliance, Spectro Cloud digitally signs key
artifacts using [Cosign](https://docs.sigstore.dev/cosign/system_config/installation/). This ensures artifacts are
traceable, tamper-evident, and aligned with modern compliance frameworks such as NIST SP 800-218, FedRAMP, and CMMC.

Generated keys use the FIPS-compliant ECDSA-P256 cryptographic algorithm for the signature and SHA256 for hashes, while
the keys are stored in PEM-encoded PKCS8 format.

To support trusted deployment and secure validation, Spectro Cloud currently signs the following artifacts:

- All ZST bundles downloaded from [Artifact Studio](https://artifact-studio.spectrocloud.com/).
- All ISOs downloaded from [Artifact Studio](https://artifact-studio.spectrocloud.com/).
- Spectro Cloud-owned and upstream images stored in the following registries:

  - `us-docker.pkg.dev/palette-images`
  - `us-docker.pkg.dev/palette-images-fips`
  - `gcr.io/spectro-images-fips`
  - `gcr.io/spectro-images-public`

  :::warning

  Images are signed only if they are built after version 4.7.0. Individual image signatures must be verified by existing
  Secure Supply Chain validation flows.

  :::

For signature information related to Spectro Cloud's offline documentation, refer to our
[Offline Documentation guide](../../downloads/offline-docs.md#container-image-authenticity).

## Verify Artifact Signatures

All ZST bundles and ISO files downloaded from Artifact Studio are signed. An additional `.sig.bin` file accompanies each
artifact, which must be decrypted using Spectro Cloud's public key, `spectro_public_key.pem`. Images embedded within ZST
bundles that originate from a Spectro Cloud registry are also signed and can be verified using validation flows.

### Prerequisites

- Artifacts installed from [Artifact Studio](https://artifact-studio.spectrocloud.com/). For more information, refer to
  our [Artifact Studio guide][LINK PENDING].

- [OpenSSL](https://www.openssl.org/) installed on the machine where the downloaded artifacts are located.

### Artifact Studio Bundle Verification

To verify the integrity and authenticity of your artifacts, you can do a checksum verification of the files downloaded.

<PartialsComponent category="security" name="artifact-studio-signature-verification" />
