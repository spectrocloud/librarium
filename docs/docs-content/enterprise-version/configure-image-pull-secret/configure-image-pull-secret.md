---
sidebar_label: "Configure Image Pull Secret"
title: "Configure Image Pull Secret for Security-Hardened Images"
description:
  "Learn how to request and configure an image pull secret from Spectro Cloud, used for retrieving security-hardened
  images."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["self-hosted", "account", "image pull secret", "hardened images", "security"]
keywords: ["self-hosted", "palette", "image pull secret", "hardened images", "security"]
---

Beginning in 4.9.b, Spectro Cloud is initiating the shift to security-hardened images. While images have a smaller
attack surface compared to physical and virtual machines, security-hardened images are built to reduce the attack
surface further by containing only the essential runtime components an application needs. They have strict Software
Lifecycle Agreements (SLAs) that require the images to be regularly scanned for vulnerabilities, rebuilt, and patched,
keeping the number of CVEs to a minimum. These images also contain artifacts such as Software Bill of Materials (SBOMs)
and cryptographic signatures to verify the image has not been tampered with.

As a result of this transition, all images hosted Spectro Cloud's private repositories must now be authenticated and
retrieved using
[image pull secrets](https://kubernetes.io/docs/concepts/configuration/secret/#using-imagepullsecrets-1). Like
activation keys, these secrets are obtained from your Spectro Cloud customer support representative; they are intended
for long-term use and only need to be configured once as part of your initial setup process. If you need to rotate the
secret, whether due to a security incident or as part of your organization's security policy, contact support to request
a new one.

Once configured, the secret is distributed to the management plane, PCGs, and all managed workload clusters so they can
pull the required images.

:::warning

As of 4.9.b, configuring an image pull secret is optional; however, it will be mandatory in an upcoming release.
Therefore, we recommend configuring your image pull secret as soon as possible to avoid service disruptions. Refer to
the [Announcements](../../release-notes/announcements.md#upcoming-breaking-changes) page for the latest updates.

:::

## Image Pull Secret Requirements

While pulling any image hosted in a Spectro Cloud-owned repository requires an image pull secret, this secret is
preconfigured in certain Spectro Cloud-maintained environments.

### Configuration Required

Connected self-hosted Palette and Palette VerteX environments that pull images directly from Spectro Cloud-owned
registries must have an image pull secret configured. This includes environments that do not use
[mirror registries](../system-management/registry-override.md) or
[image swap](../../clusters/cluster-management/image-swap.md) configurations to redirect image pulls to a private
registry.

### Configuration Not Required

The following environments do not require you to configure Spectro Cloud's image pull secret:

- **SaaS deployments** — Image pull secrets are managed automatically on the backend. For multi-tenant SaaS, no action
  is needed; for dedicated SaaS customers with access to the system console, consult with your customer support
  representative.

- **Airgapped self-hosted Palette and Palette VerteX environments** - Assets downloaded from
  [Artifact Studio](../../downloads/artifact-studio.md) are automatically authenticated using Spectro Cloud's image pull
  secret. When you upload the packs and images to your private registry, you can use your _personal_ image pull secret
  to authenticate and retrieve the images from your private registry. [CHECKING WITH ANIRUDH IF THERE IS CURRENTLY A WAY
  TO CONFIGURE AN IMAGE PULL SECRET OUTSIDE OF THE HELM INSTALL METHOD]

- **Environments with configured mirror registries or image swaps** - Images are pulled from your own private registry,
  which bypasses the need for a Spectro Cloud image pull secret.

- **Workload clusters that pull Spectro Cloud images from a private registry** - The secret is only needed when pulling
  directly from Spectro Cloud-hosted registries.

## Configure Image Pull Secret During Installation

Certain installation methods allow you to include the image pull secret during your Palette installation.

- **Helm Chart** - Use the
  [`global.imagePullSecret.dockerConfigJson`](../install-palette/install-on-kubernetes/palette-helm-ref.md#image-pull-secret)
  field in your `palette/values.yaml` file.

- **Management Appliance** - Not supported. Configure the secret
  [post-installation](#configure-image-pull-secret-post-installation) using the system console.

- **Palette CLI** - [APPARENTLY WITH THE SPECTRO-MGMT PACK? I WASN'T AWARE YOU COULD MODIFY THAT WITH THE CLI? CONFIRM
  WITH ANIRUDH]

## Configure Image Pull Secret Post-Installation

Alternatively, you can configure the image pull secret once Palette is installed. This method is the same for all
installation methods.

### Prerequisites

- A self-hosted instance of Palette installed using the Palette CLI, Helm chart, or management appliance.

- Access to the [system console](../system-management/system-management.md#access-the-system-console).

- An image pull secret provided by Spectro Cloud support.

### Enablement

1. Log in to the Palette [system console](../system-management/system-management.md#access-the-system-console). Refer to
   the [Access the System Console](../system-management/system-management.md#access-the-system-console) guide.

2. From the left main menu, select **Administration**.

3. Select the **Hardened Images** tab.

4. In the **Pull secret** field, paste the image pull secret you received from Spectro Cloud support.

5. Select **Validate and Save**.

If the secret is valid, it is saved and distributed to the management plane, workload clusters, and PCGs. If you need to
rotate your image pull secret for any reason, repeat these steps, and paste your new secret into the **Pull secret**
field.

### Validate

[INCLUDE TERMINAL STEPS?]

1. Log in to the Palette system console.

2. From the left main menu, select **Administration**.

3. Select the **Hardened Images** tab.

4. Verify that the **Pull secret** field displays a masked secret.
