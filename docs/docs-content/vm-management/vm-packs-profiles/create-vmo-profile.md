---
sidebar_label: "Create a VMO Profile"
title: "Create a VMO Profile"
description: "Learn how to create a cluster profile to utilize Palette Virtual Machine Orchestrator capabilities."
icon: " "
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo"]
---

The **Virtual Machine Orchestrator** pack conveniently includes several components and automatically installs the [Spectro Proxy](../../integrations/frp.md) pack when you use the default profile configuration. To learn about pack components, refer to [Virtual Machine Orchestrator Pack](../vm-packs-profiles/vm-packs-profiles.md).

## Prerequisites

- A Palette permission key `create` for the resource `clusterProfile`.

- If you are creating an Edge cluster profile, your profile must have a Container Storage Interface pack.

## Create the Profile

<Tabs>
<TabItem value="non-edge" label="Non-edge">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.

3. Enter basic information for the profile: name, version if desired, and optional description.

4. Select type **Add-on**, and click **Next**.

5. In the following screen, click **Add New Pack**.

6. Locate the **Virtual Machine Orchestrator** pack and add it to your profile.

7. Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the **Spectro Proxy** pack when you create the cluster, allowing access to the Spectro VM Dashboard from anywhere. Check out the [Spectro Proxy](../../integrations/frp.md) guide to learn more. Changing the default may require some additional configuration.

   The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired.

   :::caution

   We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default settings can introduce misconfigurations. Carefully review the changes you make to a pack.

   :::

8. Click **Confirm & Create**.

9. In the following screen, click **Next**.

10. Review the profile and click **Finish Configuration**.

11. Apply the profile to your cluster. For more information, refer to [Create a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md).

</TabItem>

<TabItem value="edge" label="Edge">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.

3. Enter basic information for the profile: name, version if desired, and optional description.

4. Select type **Add-on**, and click **Next**.

5. In the following screen, click **Add New Pack**.

6. Locate the **Virtual Machine Orchestrator** pack and add it to your profile.

7. Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the **Spectro Proxy** pack when you create the cluster, allowing access to the Spectro VM Dashboard from anywhere. Changing the default may require some additional configuration. Check out the [Spectro Proxy](../../integrations/frp.md) guide to learn more

   The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired.

8. If you are using PKX-E, no change is required and you can skip this step.

   If you are using K3s or RKE2 as the Kubernetes layer in your cluster profile, you need to update the `charts.virtual-machine-orchestrator.multus.networkController` parameter in the `values.yaml` for the VMO pack. Add a line for the parameter `enableK3SHostPath` and set its value to `true`. In addition, change `criSocketContainerPath` to `/host/run/containerd/containerd.sock`.

   ```yaml {3-4}
   networkController:
     criSocket:
       enableK3SHostPath: true
       criSocketContainerPath: /host/run/containerd/containerd.sock
   ```

9. If your cluster profile does include a load balancer such as MetalLB, no changes are required and you can skip this step. For more information about MetalLB, refer to [MetalLB pack documentation](../../integrations/metallb.md).

   If your cluster profile does not include a load balancer, update the services `charts.virtual-machine-orchestrator.kubevirt` and `charts.virtual-machine-orchestrator.cdi` to type ClusterIP in **values.yaml** for the VMO pack:

   <Tabs>
   <TabItem value="cdi" label="cdi">

   ```yaml {10}
   cdi:
     enabled: true
     replicas: 1
     image:
       repository: quay.io/kubevirt/cdi-operator
       pullPolicy: IfNotPresent
       # Overrides the image tag whose default is the chart appVersion.
       tag: "v1.56.0"
     service:
       type: ClusterIP
       port: 443
       targetPort: 8443
   ```

   </TabItem>

   <TabItem value="kubevirt" label="kubevirt">

   ```yaml {7}
   kubevirt:
     enabled: true
     # defaults to kubevirt
     namespace: kubevirt
     replicas: 1
     service:
       type: ClusterIP
       port: 443
       targetPort: 8443
   ```

   </TabItem>
   </Tabs>

10. Click **Confirm & Create**.

11. In the following screen, click **Next**.

12. Review the profile and click **Finish Configuration**.

13. Add the add-on profile when you create a cluster. For more information, refer to [Create Cluster Definition](../../clusters/edge/site-deployment/site-installation/cluster-deployment.md).

</TabItem>

</Tabs>

## Validate

You can validate the profile is created.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to **Profiles** from the left **Main Menu**.

3.  Locate the newly created profile in the list.

4.  From the left **Main Menu**, click **Clusters** and select your cluster.

5.  Based on your Single Sign-On (SSO) settings, the **Virtual Machines** tab may display on the **Cluster Overview** page, or the **Connect** button may display next to **Virtual Machines Dashboard** in cluster details.

## Next Steps

You will need to configure roles and role bindings to give users access virtual clusters. You can use VM user roles and permissions or standard Kubernetes roles. For configuration guidance, refer to [Add Roles and Role Bindings](add-roles-and-role-bindings.md). The [VM User Roles and Permissions](../vm-roles-permissions.md) reference lists Cluster Roles and equivalent Palette Roles.

If you have OpenID Connect (OIDC) configured at the Kubernetes layer of your cluster profile, you can create a role binding that maps individual users or groups assigned within the OIDC provider's configuration to a role. To learn more, review [Use RBAC with OIDC](../../integrations/kubernetes.md#use-rbac-with-oidc).

## Resources

- [Add Roles and Role Bindings](add-roles-and-role-bindings.md)
