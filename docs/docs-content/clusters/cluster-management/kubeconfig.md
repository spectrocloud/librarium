---
sidebar_label: "Kubeconfig"
title: "Kubeconfig"
description: "Learn how to find the kubeconfig file for your cluster and how permissions are managed."
hide_table_of_contents: false
sidebar_position: 150
tags: ["clusters", "cluster management", "kubeconfig"]
---

A [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file contains the
cluster API server address, authentication credentials, and cluster-specific settings needed to interact with a
Kubernetes cluster. You can use Palette's kubeconfig files to issue
[kubectl](https://kubernetes.io/docs/reference/kubectl/) commands against your self-hosted management and workload
clusters.

:::info

This guide focuses on the kubeconfig files for workload clusters. The kubeconfig for self-hosted management clusters is
found at the system console at **Enterprise Cluster** > **Overview** tab. Refer to the appropriate
[self-hosted Palette](../../enterprise-version/system-management/system-management.md#access-the-system-console) or
[Palette VerteX](../../vertex/system-management/system-management.md#administration-and-management) guide for details on
accessing the system console.

:::

## Types of Kubeconfig Files

Palette provides up to two kubeconfig files for each workload cluster, depending on your cluster configuration and
Palette permissions. These files are located at **Clusters** > **Overview** tab. Refer to our
[Kubectl](palette-webctl.md) guide for steps on how to download the kubeconfig file and connect to your cluster with the
`kubectl` CLI.

    ![The cluster details page with the two Kubeconfig files elements highlighted](/kubeconfig_workload-cluster_4-9.webp)

- **Kubeconfig** - Authenticates you through OpenID Connect (OIDC) as a specific user. The cluster identifies you by
  your username and group memberships, allowing Kubernetes Role-Based Access Control (RBAC) policies to control what you
  can access. This file is only available when OIDC is configured in the Kubernetes layer of your cluster profile. If
  OIDC is not configured, this file does not appear on the cluster **Overview** tab. Refer to the
  [Kubeconfig Access Permissions](#kubeconfig-access-permissions) section for more information.

- **Admin Kubeconfig** - Authenticates with a shared cluster administrator certificate and grants full
  [Cluster Admin](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) privileges. The cluster
  does not distinguish between individual users of this file. This file is intended for automation, emergency scenarios,
  or environments where OIDC is not available. It is always available to users with sufficient Palette permissions,
  regardless of whether OIDC is configured. Refer to the [Kubeconfig Access Permissions](#kubeconfig-access-permissions)
  section for more information.

:::info

The <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack affects how Palette routes
connections to the cluster API server but does not determine whether the kubeconfig or admin kubeconfig file is
available. Kubeconfig file availability depends on OIDC configuration and your Palette role.

:::

## Kubeconfig Access Permissions

Access to each kubeconfig file depends on the following factors:

- **Palette Role** - The admin kubeconfig file requires the Cluster Admin role or a custom role with the
  `cluster.adminKubeconfigDownload` permission. Users with the Cluster Admin role can access the admin kubeconfig file
  for all clusters in the project. Users with lower-level project roles, such as Cluster Editor or Cluster Viewer, do
  not have access to the admin kubeconfig file. Refer to our
  [Project Roles](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) page for more
  information on cluster permissions.

- **OIDC Configuration** - The regular kubeconfig file is only available when OIDC is configured in the Kubernetes layer
  of the cluster profile. Without OIDC, only the admin kubeconfig file is available. Refer to the respective Kubernetes
  distribution on the [Packs List](../../integrations/integrations.mdx) page to learn more about OIDC configuration.

  :::warning

  When enabling OIDC, ensure the `oidc-issuer-url` parameter and the `clientConfig` block are both properly configured
  in the Kubernetes pack YAML. Both parameters are required for the kubeconfig file to be available to all project
  users. If either is missing, the kubeconfig file is only available to users with the Cluster Admin role or a custom
  role that has the `cluster.adminKubeconfigDownload` permission.

  :::

Use the following table to identify which kubeconfig files are available based on your role and cluster configuration.

| **Palette Role**      | **Cluster OIDC Configured** | **Kubeconfig Access** | **Admin Kubeconfig Access** |
| --------------------- | :-------------------------: | :-------------------: | :-------------------------: |
| **Cluster Admin**     |     :white_check_mark:      |  :white_check_mark:   |     :white_check_mark:      |
| **Cluster Admin**     |             :x:             |          :x:          |     :white_check_mark:      |
| **Non-Cluster Admin** |     :white_check_mark:      |  :white_check_mark:   |             :x:             |
| **Non-Cluster Admin** |             :x:             |          :x:          |             :x:             |

:::info

Palette has its own RBAC system that is separate from the
[Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) system in the cluster. Palette
permissions control platform-level operations within Palette, such as downloading kubeconfig files, scaling node pools,
and deleting clusters. Kubernetes RBAC permissions control what you can do inside the cluster, such as creating pods or
reading secrets. Refer to [Palette Roles and Kubernetes Roles](cluster-rbac.md#palette-roles-and-kubernetes-roles) for
additional information.

:::

## API Access

Palette exposes two API endpoints for downloading kubeconfig files.

- `GET https://api.spectrocloud.com/v1/spectroclusters/{clusterId}/assets/kubeconfig` - Returns the kubeconfig file for
  the cluster as a text string. This endpoint requires OIDC to be configured on the cluster. Access is determined by
  your Palette permissions. Refer to the [Kubeconfig Access Permissions](#kubeconfig-access-permissions) section for
  details.

- `GET https://api.spectrocloud.com/v1/spectroclusters/{clusterId}/assets/adminkubeconfig` - Returns the admin
  kubeconfig file for the cluster as a text string. Only users with the Cluster Admin role or a custom role with the
  `cluster.adminKubeconfigDownload` permission can access this endpoint.
