---
sidebar_label: "Configure OIDC for a Virtual Cluster"
title: "Configure OIDC for a Virtual Cluster"
description: "Learn how to configure OIDC for Palette Virtual Clusters."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["clusters", "cluster groups", "virtual clusters"]
---


Before deploying a virtual cluster, you must set up OpenID Connect (OIDC) Identity Provider (IDP) for the cluster group the virtual cluster belongs to. As virtual clusters are deployed to that cluster group, OIDC information in the cluster group configuration will be inserted into the virtual cluster configuration. 


## Prerequisites

- A healthy host cluster that you will use to create a cluster group.
- A cluster group to which you can add virtual clusters.
- An issuer URL and client ID that you obtain from your identity provider.
- Privileges sufficient to edit cluster group settings and a viewer role to access the generated kubeconfig. If you are deploying virtual clusters, you will need admin privileges.
- [kubelogin](https://github.com/int128/kubelogin) installed. This is a kubectl plugin for Kubernetes OIDC authentication, also known as `kubectl` oidc-login.


## Configure OIDC

Use these steps to configure your cluster group with OIDC *before* creating a virtual cluster.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. If a cluster group does not exist, you will need to create a host cluster and then create the cluster group. Refer to [Create and Manage Cluster Groups](../../clusters/cluster-groups/create-cluster-group.md) for guidance.

3. If a cluster group exists, navigate to the left **Main Menu** and click on **Cluster Groups**.

4. Select the cluster group to which you will deploy a virtual cluster. 

5. In the **Host Clusters** tab that displays on the next page, click on **Settings**.

6. In the slide panel that opens, select the **Settings** option. The cluster group YAML file displays.

7. Locate the `vcluster.extraArgs` parameter section of the cluster group configuration file and uncomment the lines shown in the example.

![Screenshot of the cluster group YAML showing oidc-related parameters to uncomment and update.](/clusters_palette-virtual-clusters_configure-vcluster-oidc.png)

8. Update the `vcluster.extraArgs` section with your identity provider information as shown in example.

    ```yaml
    vcluster:
      extraArgs:	
        - --kube-apiserver-arg=”oidc-issuer-url=URL"
        - --kube-apiserver-arg="oidc-client-id=ID"
        - --kube-apiserver-arg="oidc-username-claim=EMAIL"
        - --kube-apiserver-arg="oidc-groups-claim=GROUPS"
    ```

9. If are configuring Okta OIDC, you must also provide the client secret. In the `clientConfig` parameter section of cluster group YAML file, uncomment the `oidc-client-secret` parameter and provide the Okta client secret.

    ```yaml
    clientConfig:	
      oidc-client-secret: <CLIENT-SECRET>
    ```

10. From the **User Menu**, switch to *App Mode* and click on **Virtual Clusters**.  

11. Deploy a virtual cluster to the cluster group that you configured with OIDC. For steps, review the [Deploy a Virtual Cluster](../palette-virtual-clusters/deploy-virtual-cluster.md#deploy-a-virtual-cluster) guide. 

  :::info

  If the cluster group is part of a project, you can deploy a virtual cluster in *Cluster Mode* from **Cluster Groups** > **Virtual Clusters**.

  :::

  When the virtual cluster is finished deploying and in **Running** state, a Kubeconfig file is generated that contains OIDC information inserted into it from the cluster group configuration.

12. Use the **Kubeconfig** link to download the Kubeconfig file. This will give you access the Kubernetes cluster.

<<< Placeholder for possible screenshot >>>

13. Configure Role-Based Access Control (RBAC) for the virtual cluster. 

:::caution

Configuring OIDC requires you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../cluster-management/cluster-rbac.md#create-role-bindings). Refer to [Use RBAC with OIDC](../../integrations/kubernetes.md#use-rbac-with-oidc) for an example. 

:::


## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to your virtual clusters, either from **Cluster Groups** > **Virtual Clusters** in *Cluster Mode* if the cluster group is part of a project, or by switching to *App Mode*  from the **User Menu** and selecting **Virtual Clusters**.

3. Select the virtual cluster you deployed to the cluster group that has OIDC configured.

4. Use the **Kubeconfig** link to download the Kubeconfig file, and ensure you’re able to connect to the cluster. 


## Resources

- [Create and Manage Cluster Groups](../../clusters/cluster-groups/create-cluster-group.md)

- [Deploy a Virtual Cluster](../palette-virtual-clusters/deploy-virtual-cluster.md#deploy-a-virtual-cluster)

- [Create Role Bindings](../cluster-management/cluster-rbac.md#create-role-bindings)

- [Use RBAC with OIDC](../../integrations/kubernetes.md#use-rbac-with-oidc)