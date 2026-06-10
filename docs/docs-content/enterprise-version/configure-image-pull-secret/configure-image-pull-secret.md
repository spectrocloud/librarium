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

Spectro Cloud is transitioning to security-hardened container images to strengthen the security posture of Palette and
VerteX deployments. These images are hosted in private registries and require an image pull secret for authenticated
access.

An image pull secret is a credential that allows your Palette or VerteX instance to authenticate with private registries
that host security-hardened images. Once configured, the secret is distributed to the management plane and all managed
workload clusters so they can pull the required images.

:::info

Configuring an image pull secret is optional in the current release. In a future release, providing an image pull secret
will become mandatory for all self-hosted connected environments. We recommend configuring it now to prepare for the
transition.

:::

## Who Needs to Configure an Image Pull Secret

You need to configure an image pull secret if your Palette or VerteX instance is a self-hosted, connected deployment.
The following environments do **not** require configuration:

- **SaaS deployments** — Image pull secrets are managed automatically on the backend.

- **Airgapped or disconnected deployments** — Images are obtained through
  [Artifact Studio](../../enterprise-version/install-palette/airgap.md) or a similar offline workflow, and the secret is
  configured on the backend.

- **Environments with configured mirror registries or image swaps** — Images are pulled from your own private registry,
  which bypasses the need for a Spectro Cloud image pull secret.

- **Workload clusters that pull Spectro Cloud images from a private registry** — The secret is only needed when pulling
  directly from Spectro Cloud-hosted registries.

## Request an Image Pull Secret

Image pull secrets are issued by Spectro Cloud. Contact your Spectro Cloud support representative to request one. Your
representative will generate the secret and provide it to you.

Image pull secrets are intended for long-term use and typically require only a one-time configuration. If you need to
rotate the secret, whether due to a security incident or as part of your organization's security policy, contact support
to request a new one.

## Prerequisites

- A self-hosted instance of Palette. For help installing Palette, refer to the
  [Installation](../install-palette/install-palette.md) guide.

- Access to the [system console](../system-management/system-management.md#access-the-system-console).

- An image pull secret provided by Spectro Cloud support.

## Configure the Image Pull Secret in the System Console

After you receive your image pull secret from Spectro Cloud support, use the system console to configure it.

1. Log in to the Palette system console. Refer to the
   [Access the System Console](../system-management/system-management.md#access-the-system-console) guide.

2. From the left main menu, select **Administration**.

3. Select the **Docker Hardened Images** tab.

4. In the **Image Pull Secret** field, paste the image pull secret you received from Spectro Cloud support.

5. Select **Save**.

   Palette validates the secret immediately. If the secret is invalid or expired, the following error message is
   displayed: _"The Image Pull Secret is invalid or expired. Please check it again. If an existing Image Pull Secret
   exists, it was not replaced."_

   If the secret is valid, it is saved and distributed to the management plane and all managed workload clusters.

## Configure the Image Pull Secret During Installation

You can also provide the image pull secret during the initial Palette installation for certain deployment methods. This
configures the secret at install time so that it is available when the system console first starts.

### Helm Chart Installation

If you install Palette using a Helm chart, provide the image pull secret in your `values.yaml` file. For more
information, refer to the [Helm Configuration Reference](../install-palette/install-on-kubernetes/palette-helm-ref.md).

<!-- TODO: Document the exact Helm value path once confirmed. The existing `global.imagePullSecret` is for mirror
registries, not DHI. -->

### Enterprise Cluster Installation

If you install Palette using an Enterprise Cluster (EC), you can include the image pull secret in the `spectro-mgmt`
pack values at install time.

<!-- TODO: Confirm the exact pack value path for EC installs. -->

:::warning

If you installed Palette using an Enterprise Cluster and you configured the image pull secret in the `spectro-mgmt` pack
values, you must also update the pack values during Palette upgrades. If you do not, the pack values overwrite the
system-console-configured secret with an empty value, which results in an upgrade failure.

This does not apply to Helm chart installations, where the system console manages the secret independently after the
initial install.

:::

### Appliance Installation

Day-0 configuration of the image pull secret during Appliance installation is not supported in the current release. If
you deploy Palette using an Appliance, configure the image pull secret through the system console after installation
completes.

## Rotate an Image Pull Secret

If you need to replace an existing image pull secret, for example due to a security incident or as part of a scheduled
rotation, use the system console.

1. Log in to the Palette system console.

2. From the left main menu, select **Administration**.

3. Select the **Docker Hardened Images** tab.

4. In the **Image Pull Secret** field, paste the new image pull secret.

5. Select **Save**.

   A confirmation dialog is displayed with the message: _"An Image Pull Secret is already configured. Updating it now
   will replace it with the new one in Palette/VerteX and your workload clusters. Are you sure you want to proceed?"_

6. Select **Confirm** to proceed with the rotation.

   Palette validates the new secret. If valid, it replaces the previous secret and distributes the updated secret to the
   management plane and all managed workload clusters.

To request a new image pull secret, contact your Spectro Cloud support representative.

## Validate

1. Log in to the Palette system console.

2. From the left main menu, select **Administration**.

3. Select the **Docker Hardened Images** tab.

4. Verify that the **Image Pull Secret** field displays a configured secret.
