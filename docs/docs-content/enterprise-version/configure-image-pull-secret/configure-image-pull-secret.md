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
surface further by containing only the essential runtime components an application needs. They have strict Service Level
Agreements (SLAs) that require the images to be regularly scanned for vulnerabilities, rebuilt, and patched, keeping the
number of CVEs to a minimum. These images also contain artifacts such as Software Bill of Materials (SBOMs) and
cryptographic signatures to verify the image has not been tampered with.

As a result of this transition, all images hosted in Spectro Cloud's OCI registries must now be authenticated and
retrieved using
[image pull secrets](https://kubernetes.io/docs/concepts/configuration/secret/#using-imagepullsecrets-1). Like
[activation keys](../activate-installation/activate-installation.md), these secrets are obtained from your Spectro Cloud
customer support representative; they are intended for long-term use and only need to be configured once as part of your
initial setup process. If you need to rotate the secret as part of your organization's security policy, contact support
to request a new one.

Once configured, the secret is distributed to the management plane, PCGs, and all managed workload clusters so they can
pull the required images.

:::warning

As of 4.9.b, configuring an image pull secret is optional; however, it will be mandatory in an upcoming release.
Therefore, we recommend configuring your image pull secret as soon as possible to avoid service disruptions. Refer to
the [Announcements](../../release-notes/announcements.md#upcoming-breaking-changes) page for the latest updates.

:::

## When to Configure Image Pull Secret

Depending on how your environment retrieves images, you may or may not need to configure Spectro Cloud's image pull
secret.

### Configuration Required

Non-airgapped self-hosted Palette and Palette VerteX environments that pull images directly from Spectro Cloud-owned OCI
registries must configure an image pull secret. This includes environments that _do not_ use
[mirror registries](../system-management/registry-override.md) or
[image swap](../../clusters/cluster-management/image-swap.md) configurations to redirect image pulls to a private
registry.

### Configuration Not Required

Image pull secrets are managed by Spectro Cloud. While you do not need to configure the pull secret, you must ensure
that the secret propagates to your clusters. This happens automatically unless there are connectivity issues from your
cluster to the Palette or Palette VerteX management plane.

- **SaaS deployments** — Image pull secrets are managed automatically on the backend. For multi-tenant SaaS, no action
  is needed; for dedicated SaaS customers with access to the system console, consult with your customer support
  representative.

- **Airgapped self-hosted Palette and Palette VerteX environments** - The Spectro Cloud-owned images are pulled directly
  from your local registry and do not need the Spectro Cloud's OCI registry pull secret.

- **Environments with configured mirror registries or image swaps** - If your non-airgapped self-hosted Palette or
  Palette VerteX environment pulls all Spectro Cloud-owned images from a custom or private registry through
  [mirror registries](../system-management/registry-override.md) or
  [image swaps](../../clusters/cluster-management/image-swap.md), you do not need to configure the image pull secret.

## Configure Image Pull Secret

Depending on your installation method, you can configure Spectro Cloud's image pull secret during or after installing
self-hosted Palette.

### During Installation

You can add your image pull secret when installing self-hosted Palette and Palette VerteX using Helm charts or the
Palette CLI.

Day-0 secret configuration is not supported for Palette Management Appliance installations. You must configure the
secret [post-installation](#configure-image-pull-secret-post-installation) using the system console.

#### Helm Chart Installations

For self-hosted Palette or Palette VerteX environments installed on an existing Kubernetes cluster using Helm charts,
you can apply your image pull secret during the installation process.

| **File**                                      | **Parameter**                                                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `palette/values.yaml` or `vertex/values.yaml` | [`global.imagePullSecret.dockerConfigJson`](../install-palette/install-on-kubernetes/palette-helm-ref.md#image-pull-secret) |
| `extras/cert-manager/values.yaml`             | `imagePullSecret.dockerConfigJson`                                                                                          |

For the full installation process, refer to the appropriate
[Palette](../install-palette/install-on-kubernetes/install.md) or
[Palette VerteX](../../vertex/install-palette-vertex/install-on-kubernetes/install.md) installation guide.

#### Palette CLI Installations

[AWAITING INSTRUCTIONS FROM ZULFI]

Configuring an image pull secret when installing self-hosted Palette using the Palette Management Appliance or Palette
CLI is not supported.

### Post-Installation

Alternatively, you can configure the image pull secret once Palette is installed.

:::warning

Configuring an image pull secret is currently optional. Once it is mandatory, image pull secrets must be added during
the installation process. At that time, the system console method described below will only be used to rotate the image
pull secret if required by your organization's security policy.

:::

#### Prerequisites

- A self-hosted instance of Palette.

- Access to the [system console](../system-management/system-management.md#access-the-system-console).

- An image pull secret provided by Spectro Cloud support.

#### Enablement

1. Log in to the Palette [system console](../system-management/system-management.md#access-the-system-console).

2. From the left main menu, select **Administration**.

3. Select the **Hardened Images** tab.

4. In the **Pull secret** field, paste the image pull secret you received from Spectro Cloud support.

5. Select **Validate and Save**.

If the secret is valid, it is saved and distributed to the management plane, workload clusters, and PCGs. If you need to
rotate your image pull secret for any reason, repeat these steps, and paste your new secret into the **Pull secret**
field.

#### Validate

<Tabs>

<TabItem value="ui" label="UI">

1. Log in to the Palette system console.

2. From the left main menu, select **Administration**.

3. Select the **Hardened Images** tab.

4. Verify that the **Pull secret** field displays a masked secret.

   ![Configuring an image pull secret in the system console](/configure-image-pull-secret_palette.webp)

</TabItem>

<TabItem value="terminal" label="Terminal">

1. Open a terminal session in an environment that has network access to the cluster. Set the `KUBECONFIG` environment
   variable to the file path of your cluster's kubeconfig that Palette is installed on.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

2. Issue the following command to verify the secret propagated to your management cluster matches the one configured in
   the system console.

   ```shell
   kubectl get secret spectro-image-pull-secret --namespace hubble-system --output yaml
   ```

   ```yaml title="Example output" hideClipboard {3}
   apiVersion: v1
   data:
     .dockerconfigjson: abcdEFGhiJKlmnOPQrSTUVwX... # output omitted for brevity
   kind: Secret
   metadata:
     annotations:
       meta.helm.sh/release-name: hubble
       meta.helm.sh/release-namespace: default
     creationTimestamp: "2026-06-18T22:33:37Z"
     labels:
       app: spectro
       app.kubernetes.io/managed-by: Helm
       module: hubble
     name: spectro-image-pull-secret
     namespace: hubble-system
     resourceVersion: "28192"
     uid: c7991fac-2ec0-4419-b451-10c82208f8e5
   type: kubernetes.io/dockerconfigjson
   ```

</TabItem>

</Tabs>
