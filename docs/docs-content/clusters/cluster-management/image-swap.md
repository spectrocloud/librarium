---
sidebar_label: "Image Swap"
title: "Image Swap"
description: "Learn how to swap out images and registries through the image swap webhook exposed by Palette."
hide_table_of_contents: false
sidebar_position: 230
tags: ["clusters", "cluster management"]
---

Palette supports swapping out images and registries at the Kubernetes layer. Palette uses the _ImageSwap_ webhook that
is exposed by the
[ImageSwap Mutating Admission Controller for Kubernetes](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md).
You can use this feature to override a specific number of container image registries or particular images. The following
are some common use cases for image swapping: <br /> <br />

- Avoid rate limit issues encountered with public images by pointing to an alternate image registry that caches public
  images. This is more common in an Enterprise setting.

- Changing the URL of an internal or external container registry.

- Support air-gapped environments by redirecting public image requests to an internal registry.

To use the image swap feature, specify an image swap configuration in the Kubernetes pack YAML. The `imageSwap` block
must be its own node, meaning that it's a standalone block at the root level of the YAML.

```yaml
imageSwap:
  imageChange: |-
    default:
    # your custom configuration goes here
```

You can add the `imageSwap` section when you create the cluster profile or at cluster deployment. You can customize the
image swap functionality several ways. We recommend you review the official
[Image Swap configuration](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md#configuration)
documentation to learn more. To help you get started, the following are some common configuration patterns.

:::info

The `default::`entry specifies the default configuration for all images. The `::` delimiter is used to separate
different elements of the configuration.

:::

## Configuration Examples

The following examples demonstrate how to configure the image swap functionality in the Kubernetes pack YAML.

### Override a Specific Registry

In this example, image swapping is disabled for all registries except for `example.private.io`. All image requests for
`example.private.io` will be swapped for `harbor.internal.example.com`.

```yaml
imageSwap:
  imageChange: |-
    default::
    example.private.io::harbor.internal.example.com
```

### Apply a Global Swap with an Exception

Enable image swapping for all registries except `example.private.io`. All image requests for `example.private.io` will
not get swapped. All other image requests will get swapped to `harbor.internal.example.com`.

```yaml
imageSwap:
  imageChange: |-
    default::harbor.internal.example.com
    example.private.io::
```

### Swap a Specific Image

Swap out a specific image. The image `example.private.io/demo:v1.0.0` will be swapped with
`gcr.io/google-samples/hello-app:1.0`. The syntax format is `[EXACT]<source-image>::<target-image>`.

```yaml
imageSwap:
  imageChange: |-
    default::
    [EXACT]example.private.io/demo:v1.0.0::gcr.io/google-samples/hello-app:1.0
```

### Replace Image Path

Replace an image path with a custom registry. All image requests that start with `ghcr.io/example*` will get swapped
with `example.private.io`.

```yaml
imageSwap:
  imageChange: |-
    default::
    [REPLACE]ghcr.io/example*::example.private.io
```

:::info

If the registry or image mentioned in the image swap configuration cannot be located, Kubernetes will try to obtain the
image from the source mentioned in the deployment configuration.

:::

The examples provided are intended to help you get started. Refer to the official
[Image Swap configuration](https://github.com/phenixblue/imageswap-webhook/blob/master/README.md#configuration) for more
examples and information.

## Limitations

- Image swap is only supported for managed Kubernetes clusters, such as Amazon EKS, Azure AKS, and Google GKE.

- Self-hosted Palette and VerteX installations can support image swap functionality for non-managed Kubernetes clusters.
  This requires mirror registries to be specified during the
  [self-hosted Palette](../../self-hosted-setup/palette/palette.md) or
  [Palette VerteX installation](../../self-hosted-setup/vertex/vertex.md) process.

  The following table summarizes the image swap support for different scenarios and what Palette deployment type is
  required.

  | Image Swap Scenario            | Supported in Palette SaaS? | Supported in Self-Hosted Palette? | Supported in VerteX? | Description                                                                                                                                                         |
  | ------------------------------ | -------------------------- | --------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Managed Kubernetes Cluster     | :white_check_mark:         | :white_check_mark:                | :white_check_mark:   | Image swap is supported for managed Kubernetes clusters, such as AKS, EKS, and GKE.                                                                                 |
  | Non-Managed Kubernetes Cluster | :x:                        | :white_check_mark:                | :white_check_mark:   | Image swap is supported for non-managed Kubernetes clusters. This requires mirror registries to be specified during the self-hosted Palette or VerteX installation. |

## Image Swap with Palette

Use the following steps to learn how to use Palette's image swap functionality.

### Prerequisites

- Kubernetes 1.19.0 or greater.

- Palette v3.4.0 or greater.

### Swap Image

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Click on **Add Cluster Profile**.

4. Fill out the input fields for **Name**, **Description**, **Type** and **Tags**. Select the type **Full** and click on
   **Next**.

5. Select your infrastructure provider and click on **Next**.

6. Complete the Operating System (OS) layer by selecting **Registry**, **Pack Name**, and **Pack Version**. Click on
   **Next layer** to continue.

7. Select a Kubernetes distribution and version.

8. Next, select the code editor button **\</\>** to edit the pack YAML configuration. Within the `pack` section's scope,
   add your `imageSwap` configuration block. Click on **Next layer** to continue.

<br />

![A view of the Kubernetes layer YAML with an imageSwap configuration block.](/clusters_cluster-management_image-swap_kubernetes-layer-yaml.webp)

9. Complete the remainder of the cluster profile creation wizard.

10. Deploy a host cluster and use the cluster profile containing the image swap functionality. Check out the
    [Getting Started](/getting-started/) tutorials for additional guidance in deploying a host cluster.

### Validate

You can validate that the image swap is functioning correctly by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you deployed with the image swap functionality.

4. Download the kubeconfig file to access the cluster. Refer to the [Access Cluster with CLI](palette-webctl.md) guide
   for detailed steps.

5. Review the deployment configuration of a workload using a registry or image impacted by the image swap configuration.
   Verify the image or registry is swapped to the expected configuration value you provided in the image swap
   configuration block.

You can use the following command to verify the correct image and registry of the deployment. Change the `REPLACE_ME`
value with the correct values from your environment.

<br />

```shell
kubectl get deployment REPLACE_ME \
--namespace REPLACE_ME -o=jsonpath='{.spec.template.spec.containers[0].image}'
```

:::tip

Use the command `kubectl get deployments --all-namespaces` to list all deployments in the cluster.

:::
