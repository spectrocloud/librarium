---
sidebar_label: "Artifact Studio"
title: "Artifact Studio"
description: "Overview of the Artifact Studio"
hide_table_of_contents: false
sidebar_position: 10
sidebar_custom_props:
  icon: "layer-group"
tags: ["downloads", "artifact-studio"]
---

[Artifact Studio](https://artifact-studio.spectrocloud.com/) is a unified platform that helps airgapped,
regulatory-focused, and security-conscious organizations populate their registries with bundles, packs , and installers
to be used with Palette or VerteX. It provides a single location for packs and images, streamlining access and
management.

## Use Cases

You will be able to download the Palette or VerteX Management Appliance or Helm chart in order to instantiate or upgrade
your environment. Additionally, if you are using an airgapped environment, you will be able to browse through all
available packs, and download only the components you wish to use. You can also validate the integrity and authenticity
of the bundle via code signature. With these new artifact bundles, we are replacing the self-extracting binaries we
create for airgapped environments with a more familiar zstandard compressed format (`zst`) that can be moved and
manipulated with the Palette CLI.

There are four main artifact areas:

- Install Palette Enterprise (content bundle, ISO or Helm chart).
- Install Palette VerteX (content bundle, ISO or Helm chart).
- Create a pack bundle to download.
- Browse the pack catalog to download individual packs.

:::preview

:::

## Install Palette Enterprise

1. Navigate to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

2. From the drop-down, select the version needed, and click **Show Artifacts**.

3. Click **Download** on **Content bundle**, **Palette management appliance ISO**, or **Helm installation**, whichever
   file is appropriate for your environment.

| Download Option   | Use Case                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| Content bundle    | Used for traditional application install                                               |
| ISO               | Used for installation from ISO device in a virtual machine, edge device, or bare-metal |
| Helm installation | Used to install with Helm charts                                                       |

Once you have the file, you can deploy Palette as a self-hosted application. Review the
[Self-Hosted Palette](../enterprise-version/install-palette/palette-management-appliance.md) for more information on deploying
Palette locally.

## Install Palette VerteX

1. Navigate to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

2. From the drop-down, select the version needed, and click **Show Artifacts**.

3. Click **Download** on **Content bundle**, **VerteX management appliance ISO**, or **Helm installation**, whichever
   file is appropriate for your environment.

Once you have the file, you can deploy Palette VerteX as a self-hosted application. Review the
[VerteX Installation](../vertex/install-palette-vertex/vertex-management-appliance.md) for more information on deploying
Palette VerteX locally.

## Create a Pack Bundle

:::warning

Agent mode binaries are not supported for download.

:::

1. Navigate to [Artifact Studio](https://artifact-studio.spectrocloud.com/).

2. Click on **Build bundle**.

   :::tip

   Ensure that pop-ups are enabled in your browser for [Artifact Studio](https://artifact-studio.spectrocloud.com/) to
   allow for multiple artifact downloads.

   :::

   ![Image of Create pack bundle](../../../static/assets/docs/images/downloads/downloads_artifact-studio-build-bundle.webp)

3. On the **Select Product** page select either **Palette Enterprise Appliance** or **Palette Vertex Appliance**.

4. On the **Current Version** page select the version the pack bundle will installed on.

5. On the **Use case** page, select the use case for the bundle.

| Use Case                     | Definition                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Controller mode              | Download specific component packs for provisioning CAPI-based clusters on public cloud or datacenters. |
| Agent mode or Appliance mode | Get required packages for deploying Kubernetes at remote edge locations.                               |
| Add-on only                  | Download just supplementary tools and features to enhance your clusters.                               |

6. On the **Configure cloud types**, select the appropriate cloud for your bundle. Depending on the use case, cloud
   types include **Public Clouds** (AWS, GCP, Azure), **Data Centers** (MAAS, OpenStack, vSphere) and **Bare Metal**
   (Edge Native)

7. On the **Configure bundle** page, select **OS**. This will start the process of building the bundle.

8. Select the Operating System and click **Next Layer**.

9. Select the Kubernetes version and click **Next Layer**.

10. On the **Network** page select the Network pack to be used. Click **Next Layer**.

11. Select the Storage pack to be used and click **Next Layer**.

12. On the **Add Packs** page, select one or more add-on packs. Click **Add to Bundle**.

13. Click **Next Step**.

14. On the **Review and download** page, click the **I'm not a robot** reCAPTCHA to download the bundle. The bundle will
    download as individual pack files (`<filename>.zst`) and individual signature file (`<filename>.bin`). Ensure that
    all the files are saved in the same folder. Alternatively, you click **Copy all URLs** to download the individual
    files via the individual URLs.

15. Click **Artifact Studio Home** to repeat the process for additional bundles.

### Bundle Download Verification

<PartialsComponent category="verifications" name="artifact-studio-signature-verification" />

## Download a Specific Pack

1. Click on **Browse Packs**.

   ![Image showing where to download individual packs](../../../static/assets/docs/images/downloads/downloads_artifact-studio-browse-packs.webp)

2. Filter based on **Product**, **Version** (Product version), **Cloud type**, **Layer type**, CPU version and whether
   it is FIPS compliant or not.

3. Enter your search terms and click **Search** to further filter.

   ![Image showing filter and search together](../../../static/assets/docs/images/downloads/downloads_artifact-studio-search-and-filter.webp)

4. Select one or more packs, and click the **I'm not a robot** reCAPTCHA to download the bundle. The bundle will
   download as individual pack files (`<filename>.zst`) and individual signature file (`<filename>.bin`). Ensure that
   all the files are saved in the same folder. Alternatively, you click **Copy all URLs** to download the individual
   files via the individual URLs.

   ![Image showing download of multiple packs](../../../static/assets/docs/images/downloads/downloads_artifact-studio-individual-packs-download.webp)

   :::tip

   Ensure that pop-ups are enabled in your browser for [Artifact Studio](https://artifact-studio.spectrocloud.com/) to
   allow for multiple artifact downloads.

   :::

### Specific Pack Download Verification

<PartialsComponent category="verifications" name="artifact-studio-signature-verification" />
