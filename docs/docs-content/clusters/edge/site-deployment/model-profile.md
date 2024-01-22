---
sidebar_label: "Model Edge Native Cluster Profile"
title: "Model Edge Native Cluster Profile"
description: "Instructions for creating an Edge Native Cluster Profile"
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

[Cluster profiles](../../../profiles/cluster-profiles/cluster-profiles.md) contain the desired specifications the
Kubernetes cluster Edge host makes up. The cluster profile defines the following components.

- Kubernetes flavor and version

- Operating system (OS)

- Container network interface (CNI)

- Container storage interface (CSI)

You define these components in an Edge Native Infrastructure profile. As with any other environment in Palette, you can
define additional add-on cluster profiles. You can use add-on profiles to define integrations or applications that must
be included when Palette deploys the cluster.

The following steps will guide you on how to create a cluster profile for Edge. Choose the workflow that best fits your
needs.

- [Custom OS](#custom-os)

- [Without Custom OS](#without-custom-os)

## Custom OS

### Prerequisites

- Ensure all required provider images are created and uploaded to the respective registry. Refer to the EdgeForge
  [Build Images](../edgeforge-workflow/build-images.md) guide for details.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Click on **Add Cluster Profile**.

5. Provide **Basic Information**, such as profile name, description, and tags. Select **Full** and click on **Next**.

6. Select **Edge Native** as the **Cloud Type** and click on **Next**.

7. Select **Public Repo** in the **Registry field**.

8. Select **BYOS Edge OS** in the **Pack Name** field and the pack version.

9. Click on the code editor button **\</\>** to open up the editor

{" "}

<br />

![A view of the Kubernetes pack editor with a YAML configuration](/clusters_site-deployment_model-profile_byoos-pack-yaml.png)

10. Update the `system.uri` parameter in the pack editor. Use the custom OS image you created in the EdgeForge process.
    Refer to the EdgeForge [Build Images](../edgeforge-workflow/build-images.md) guide if you are missing a custom OS
    image. The following is an example configuration using a custom OS image.

```yaml
pack:
content:
  images:
    - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
    # - image: example.io/my-other-images/example:v1.0.0
    # - image: example.io/my-super-other-images/example:v1.0.0
  #drain:
  #cordon: true
  #timeout: 60 # The length of time to wait before giving up, zero means infinite
  #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
  #ignoreDaemonSets: true
  #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
  #force: true # Continue even if there are pods that do not declare a controller
  #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
  #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.

options:
  system.uri: example.io/my-images/example-custom-os:v1.4.5
```

{" "}

<br />

:::info

You can customize the node drainage behavior and specify additional images that you may have created that are part of
the content bundle. Specify any additional image required by the cluster profile in the `images` section. Add an
`- image: ` entry for each image you need to specify. Refer to the [BYOOS Pack](../../../integrations/byoos.md) resource
to learn more about the pack details.

:::

11. Click on the **Next layer** button to continue.

12. Complete the cluster profile creation process by filling out the remaining layers.

You have successfully created a cluster profile that you can use to deploy Edge clusters.

### Validate

Verify you created a cluster profile for Edge hosts by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Use the **Cloud Types** **drop-down Menu** and select **Edge Native**.

5. Your newly created cluster profile is displayed along with other cluster profiles of the same type.

## Without Custom OS

:::warning

This workflow is unavailable for new Edge clusters. Use the **Custom OS** tab to learn how to use a custom OS with your
cluster profile.

:::

### Prerequisites

No prerequisites.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Click the **Add New Profile** button.

5. Provide the profile with a name, description, version, and tags. Select **Full** for the profile type. Click on
   **Next**.

6. Select **Edge Native** as the cloud type and click on **Next**.

7. In the profile layers screen, for the OS layer, choose the desired OS type and OS version. Click on **Next layer**.

:::info

You can select **Bring Your Own OS (BYOOS)** if you build your enterprise Edge artifacts. Specify the registry that
hosts your provider images as the system URI. You can also provide additional cloud-init configurations in the OS pack
YAML file to set up Edge host users, install other OS packages, install certificates, and more. Refer to the
[Cloud-Init Stages](../edge-configuration/cloud-init.md) resource to learn more about the cloud-init stages.

:::

8. Choose the desired Kubernetes distribution and version. Click on **Next layer**.

9. Choose the desired CNI type and version. Click on **Next layer**.

10. Review and save your cluster profile.

You now have a cluster profile you can use for deploying Edge hosts.

Consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other
capabilities. If you need remote access to the cluster, consider adding the
[Spectro Proxy](../../../integrations/frp.md) pack to one of the add-on profiles.

Optionally, add additional Helm or OCI registries and include applications hosted in those registries in add-on
profiles. Check out the guide for adding a [Helm](../../../registries-and-packs/helm-charts.md) or
[OCI](../../../registries-and-packs/oci-registry.md) registry to learn more.

### Validate

Verify you created a cluster profile for Edge hosts by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Choose the desired scope, project or **Tenant Admin**.

3. Navigate to the left **Main Menu** and select **Profiles**.

4. Select **Edge Native** as the cloud type.

You can view your newly created cluster profile on the **Cluster Profiles** page.

## Next Steps

Your next step in the deployment lifecycle is to prepare the Edge host for the installation. Use the
[Prepare Edge Hosts for Installation](../site-deployment/stage.md) guide to continue.

<br />
