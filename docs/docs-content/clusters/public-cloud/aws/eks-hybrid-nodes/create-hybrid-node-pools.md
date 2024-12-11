---
sidebar_label: "Create Hybrid Node Pools"
title: "Create Hybrid Node Pools"
description: "Learn how to create hybrid node pools and add your edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 30
---

This section guides you on how to create a cluster profile to collectively manage your hybrid nodes. You can then create
hybrid node pools and add your edge hosts to them.

## Limitations

- Overall cluster health is determined by the Amazon EKS cluster's status. While unhealthy edge hosts will appear as
  unhealthy nodes in Palette, this does not change the Amazon EKS cluster's overall health status.

## Create Cluster Profile for Hybrid Node Pools

### Prerequisites

- Edge hosts have been registered with Palette through
  [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) or by using
  [provider images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md).

  :::warning

  If using provider images, you must include the following in your `.arg` file during the
  [build steps](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md#build-provider-images).

  ```shell
  K8S_DISTRIBUTION=nodeadm
  K8S_VERSION=<kubernetesVersion>  # supported versions: [ 1.28.0 | 1.29.0 | 1.30.0 | 1.31.0 ]
  ```

  Replace `<kubernetesVersion>` with your version of Kubernetes. For example, `1.29.0`.

  :::

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

### Create Profile

1. Log in to [Palette](https://spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click **Add Cluster Profile**.

4. Fill out the basic information and ensure **Type** is set to **Full**. Click **Next** when done.

5. Select **Edge Native** from the **Infrastructure provider** list, and click **Next**.

6. Select your base OS pack depending on how you have registered your edge hosts.

   - For Agent Mode, select **BYOS - Agent Mode**.
   - For provider images, select **BYOS - Edge OS**.

7. If selecting **BYOS - Agent Mode**, on the **Configure Pack** page, click **Values** under **Pack Details**.

   Click on **Presets** on the right-hand side, and select **Agent Mode**.

8. Click **Next layer** to continue.

9.  Select **Nodeadm** as your base Kubernetes pack, and click **Next**.

10. On the **Configure Pack** page, under **Pack Version**, select your Kubernetes version from the **drop-down Menu**.

11. In the YAML editor, make any changes you need for the kubelet or containerd configuration. Refer to [Amazon EKS Hybrid Nodes Configuration](https://github.com/aws/eks-hybrid?tab=readme-ov-file#configuration) for guidance on the available options.

12. Click **Next layer** to continue.

13. Select **Custom CNI** as your base Network pack, and click **Next**.

14. In the YAML editor on the **Configure Pack** page, change the value of `manifests.byo-cni.contents.data.custom-cni` from `calico` to `dummy`.

    While this change is not required for the pack to function, setting it to 'dummy' better indicates that this pack serves as a placeholder only.

15. Click **Confirm** when complete.

16. In **Profile Layers**, click **Next** to continue.

17. Click **Finish Configuration**.

Your cluster profile for hybrid nodes is now created and can be used in the [Create Hybrid Node Pool](#create-hybrid-node-pool) steps.

### Validate

1. Log in to [Palette](https://spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your newly created profile.

4. Check that your profile layers are present and correct.

## Create Hybrid Node Pool

### Prerequisites

- TBA

### Create Node Pool

### Validate

## Resources

- [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md)

- [Build Provider Images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md)
