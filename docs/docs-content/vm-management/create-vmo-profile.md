---
sidebar_label: "Create a VMO Profile"
title: "Create a VMO Profile"
description: "Learn how to create a cluster profile to utilize Palette Virtual Machine Orchestrator capabilities."
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---

<!-- prettier-ignore -->
The **Virtual Machine Orchestrator** pack conveniently includes several components and automatically installs the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack when you use the default
profile configuration. To learn about pack components, refer to [Palette VMO](./vm-management.md).

## Limitations

- If you are updating the profile of an existing cluster that already has the **Spectro Proxy** pack. You must restart
  the Spectro Proxy pod for the proxy to work as expected.

  To restart the Spectro Proxy pod, delete the pod and it will restart automatically. You can issue the following
  command to delete the pod:

  ```shell
  kubectl delete pods --selector app=spectro-proxy --all-namespaces
  ```

- Ensure the cluster that you are using with the Virtual Machine Orchestrator pack does not have the
  <VersionedLink text=" Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> pack
  already present in its cluster profile. The Virtual Machine Orchestrator will configure snapshots.

## Prerequisites

<Tabs groupId="environment">

<TabItem value="non-edge" label="Non-edge">

- A Palette permission key `create` for the resource `clusterProfile`.

</TabItem>

<TabItem value="edge" label="Edge">

- A Palette permission key `create` for the resource `clusterProfile`.

- Your Edge cluster profile must have a Container Storage Interface (CSI) pack.

:::warning

We recommend using Ubuntu 22.04 as the OS image for Edge clusters deployed in
[appliance mode](../deployment-modes/appliance-mode/appliance-mode.md). Refer to
[Palette Edge Getting Started](../tutorials/getting-started/palette-edge/palette-edge.md) for further guidance.

:::

</TabItem>

<TabItem value="airgap" label="Airgap">

- A Palette permission key `create` for the resource `clusterProfile`.

- Ensure the VMO pack is installed in your airgap environment. Refer to the
  [Install VMO in Airgap Environments](./install-vmo-in-airgap.md) guide for further information.

- Ensure the Spectro Proxy pack is installed in your airgap environment. Refer to the
  [Install VMO in Airgap Environments](./install-vmo-in-airgap.md) guide for further information.

</TabItem>

</Tabs>

## Create the Profile

<Tabs groupId="environment">

<TabItem value="non-edge" label="Non-edge">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.

3. Enter basic information for the profile: name, version if desired, and optional description.

4. Select type **Add-on**, and click **Next**.

5. In the following screen, click **Add New Pack**.

6. Locate the **Virtual Machine Orchestrator** pack and add it to your profile.

7. Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the
   **Spectro Proxy** pack when you create the cluster, allowing access to the Spectro VM Dashboard from anywhere. Check
   out the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> guide to learn more.
   Changing the default may require some additional configuration.

   The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired. Ensure
   that you configure the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack
   separately in your cluster profile if you select this option.

   :::warning

   We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default
   settings can introduce misconfigurations. Carefully review the changes you make to a pack.

   :::

8. Click **Confirm & Create**.

9. In the following screen, click **Next**.

10. Review the profile and click **Finish Configuration**.

11. Apply the profile to your cluster. For more information, refer to the [Getting Started](/getting-started/)
    tutorials.

</TabItem>

<TabItem value="edge" label="Edge">

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.

3.  Enter basic information for the profile: name, version if desired, and optional description.

4.  Select type **Add-on**, and click **Next**.

5.  In the following screen, click **Add New Pack**.

6.  Locate the **Virtual Machine Orchestrator** pack and add it to your profile.

<!-- prettier-ignore -->
7.  Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the
    **Spectro Proxy** pack when you create the cluster, allowing access to the Spectro VM Dashboard from anywhere.
    Changing the default may require some additional configuration. Check out the
    <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> guide to learn more.

    The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired.
    Ensure that you configure the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack
    separately in your cluster profile if you select this option.

8.  If you are using PKX-E, no change is required and you can skip this step.

    If you are using K3s or RKE2 as the Kubernetes layer in your cluster profile, you need to update the
    `charts.virtual-machine-orchestrator.multus.networkController` parameter in the `values.yaml` for the VMO pack. Add
    a line for the parameter `enableK3SHostPath` and set its value to `true`. In addition, change
    `criSocketContainerPath` to `/host/run/containerd/containerd.sock`.

    ```yaml {3-4}
    networkController:
      criSocket:
        enableK3SHostPath: true
        criSocketContainerPath: /host/run/containerd/containerd.sock
    ```

<!-- prettier-ignore -->
9.  If your cluster profile does include a load balancer such as MetalLB, no changes are required and you can skip this
    step. For more information about MetalLB, refer to the <VersionedLink text="MetalLB pack documentation" url="/integrations/packs/?pack=lb-metallb-helm" />


    If your cluster profile does not include a load balancer, update the services
    `charts.virtual-machine-orchestrator.kubevirt` and `charts.virtual-machine-orchestrator.cdi` to type ClusterIP in
    **values.yaml** for the VMO pack:

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

13. Add the add-on profile when you create a cluster. For more information, refer to
    [Create Cluster Definition](../clusters/edge/site-deployment/cluster-deployment.md).

</TabItem>

<TabItem value="airgap" label="Airgap">

1.  Log in to a tenant that belongs to your instance of Palette or Palette VerteX.

2.  In the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

3.  Enter basic information for the profile: name, version if desired, and optional description.

4.  Select type **Add-on**, and click **Next**.

5.  In the following screen, click **Add New Pack**.

6.  Locate the **Virtual Machine Orchestrator** pack and add it to your profile.

7.  Review the **Access** configuration panel on the right. The default setting is **Proxied**, which automatically adds
    the **Spectro Proxy** pack when you create the cluster, allowing access to the Spectro VM Dashboard from anywhere.
    Check out the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> guide to learn
    more.

    The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired.
    Ensure that you configure the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" />
    pack separately in your cluster profile if you select this option.

    :::warning

    We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the
    default settings can introduce misconfigurations. Carefully review the changes you make to a pack.

    :::

8.  Click **Values** in the **Pack Details** section. The pack manifest editor appears. Locate the
    `pack.cdi.privateRegistry` section in the manifest. The table below contains a brief description of each field
    exposed by the private registry. Set the `pack.cdi.privateRegistry.enabled` field to true and fill in the registry
    IP address and base path according to your environment. This configures the VMO pack to pull images from your airgap
    environment private registry.

        | Field                                       | Description                                                          |
        | ------------------------------------------- | -------------------------------------------------------------------- |
        | `pack.cdi.privateRegistry.enabled`          | Flag to enable the profile to use the airgap private image registry. |
        | `pack.cdi.privateRegistry.registryIP`       | The IP address the private image registry.                           |
        | `pack.cdi.privateRegistry.registryBasePath` | The base path of the private image registry.                         |

        ```yaml
        cdi:
          privateRegistry:
            enabled: true
            registryIP: <REPLACE ME>
            registryBasePath: <REPLACE ME>
        ```

9.  Click **Confirm & Create**.

10. On the following screen, click **Next**.

11. Review the profile and click **Finish Configuration**.

12. Apply the profile to your cluster. For more information, refer to the [Getting Started](/getting-started/)
    tutorials.

:::info

If you want to use direct access in an environment configured to use an external proxy, you must exclude your cluster's
load balancer IP range from proxy routing. Expand the following section to learn how you can configure your
environment's **No Proxy** list.

   <details>
      <summary>Configure the **No Proxy** list</summary>

      1. Download the [Kubeconfig](../clusters/cluster-management/kubeconfig.md) file of the airgap support VM.

      2. Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

          ```shell
          export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
          ```

      3. Execute the following command to find the namespace which contains your environment proxy configuration. Make a note of the namespace.

          ```shell
          kubectl get podpreset --all-namespaces --field-selector=metadata.name=proxy
          ```

      4. Issue following command to edit the pod preset. Replace the placeholder with the namespace you identified previously.

          ```shell
          kubectl edit podpreset proxy --namespace <namespace>
          ```

      5. Add your load balancer IP range to the `NO_PROXY` configuration under the `spec.env` section.

          ```yaml
          env:
            - name: NO_PROXY
              value: "REPLACE ME"
          ```

      6. Save your changes and close the editor.

      Your configuration changes are automatically applied.

   </details>
   
   :::

</TabItem>

</Tabs>

## Validate

You can validate the profile is created.

<Tabs groupId="environment">

<TabItem value="non-edge" label="Non-edge">

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to **Profiles** from the left **Main Menu**.

3.  Locate the newly created profile in the list.

4.  From the left **Main Menu**, click **Clusters** and select your cluster.

5.  Based on your Single Sign-On (SSO) settings, the **Virtual Machines** tab may display on the **Cluster Overview**
    page, or the **Connect** button may display next to **Virtual Machines Dashboard** in cluster details.

</TabItem>

<TabItem value="edge" label="Edge">

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to **Profiles** from the left **Main Menu**.

3.  Locate the newly created profile in the list.

4.  From the left **Main Menu**, click **Clusters** and select your cluster.

5.  Based on your Single Sign-On (SSO) settings, the **Virtual Machines** tab may display on the **Cluster Overview**
    page, or the **Connect** button may display next to **Virtual Machines Dashboard** in cluster details.

</TabItem>

<TabItem value="airgap" label="Airgap">

1.  Log in to a tenant that belongs to your instance of Palette or Palette VerteX.

2.  Navigate to **Profiles** from the left **Main Menu**.

3.  Locate the newly created profile in the list.

4.  From the left **Main Menu**, click **Clusters** and select your cluster.

5.  Based on your Single Sign-On (SSO) settings, the **Virtual Machines** tab may display on the **Cluster Overview**
    page, or the **Connect** button may display next to **Virtual Machines Dashboard** in cluster details.

</TabItem>

</Tabs>

## Next Steps

You will need to configure roles and role bindings to give users access to clusters. You can use VM user roles and
permissions or standard Kubernetes roles. For configuration guidance, refer to
[Add Roles and Role Bindings](./rbac/add-roles-and-role-bindings.md). The
[VM User Roles and Permissions](./rbac/vm-roles-permissions.md) reference lists Cluster Roles and equivalent Palette
Roles.

<!-- prettier-ignore-start -->

If you have OpenID Connect (OIDC) configured at the Kubernetes layer of your cluster profile, you can create a role
binding that maps individual users or groups assigned within the OIDC provider's configuration to a role. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional guidance for more information.

<!-- prettier-ignore-end -->

## Resources

- [Add Roles and Role Bindings](./rbac/add-roles-and-role-bindings.md)
