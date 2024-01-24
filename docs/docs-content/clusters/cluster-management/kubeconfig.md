---
sidebar_label: "Kubeconfig"
title: "Kubeconfig"
description: "Learn how to find the kubeconfig file for your cluster and how permissions are managed."
hide_table_of_contents: false
sidebar_position: 150
tags: ["clusters", "cluster management", "kubeconfig"]
---

A [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file is a
configuration file used to access a Kubernetes cluster. It contains information such as the cluster's API server
address, authentication credentials, and cluster-specific settings. The kubeconfig file allows you to authenticate and
interact with the cluster using the kubectl CLI or other Kubernetes client tools.

The kubeconfig file is crucial in enabling you and other users to issue kubectl commands against the host cluster. It
ensures you have the necessary permissions and access to the cluster's resources. Using the kubeconfig file, you can
validate your access to the host cluster and perform various operations, such as deploying applications, managing
resources, and monitoring the cluster.

Overall, the kubeconfig file serves as a key component in connecting and interacting with a Kubernetes cluster,
providing you with the necessary configuration and credentials to access the cluster's API server.

You can download the kubeconfig file from the cluster details page in Palette. Check out the
[Access Cluster with CLI](palette-webctl.md) guide for steps on how to download your cluster's kubeconfig file and
connect to your host cluster with the kubectl CLI.

## Kubeconfig Files

Palette exposes two kubeconfig files for each cluster deployed through Palette.

- Kubeconfig - This kubeconfig contains OIDC and Spectro Proxy configurations. The kubeconfig file is available for all
  users with proper access to the cluster. The kubeconfig file can be used to access the cluster's resources and perform
  operations on the cluster. Refer to the [Kubeconfig Access Permissions](#kubeconfig-access-permissions) section to
  learn more about access permissions for the kubeconfig file.

- Admin Kubeconfig - The admin kubeconfig is created without OIDC configurations. This file is ideal for those that need
  to access an intermediate host to access the cluster, such as a jump host. Refer to the
  [Kubeconfig Access Permissions](#kubeconfig-access-permissions) section to learn more about access permissions for the
  admin kubeconfig file.

![The cluster details page with the two Kubeconfig files elements highlighted](/clusters_cluster--management_kubeconfig_cluster-details-kubeconfig-files.png)

## Kubeconfig Access Permissions

Palette exposes kubeconfig files for each cluster deployed through the platform. Depending on the cluster's
configuration, the kubeconfig file may contain different configurations, such as the cluster's API server address and
authentication credentials.

Your assigned [Palette permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md) determine
which clusters you can access and what operations you can perform on the cluster. The permissions assigned to you in
Palette determine if you can download and access the kubeconfig files for a cluster.

As a rule, users with the Palette role
[_Cluster Admin_](../../user-management/palette-rbac/project-scope-roles-permissions#cluster) can access the admin
kubeconfig files for all clusters in the project. Users with lower-level project roles such as the _Cluster Editor_ or
the _Cluster Viewer_ may not be able to access the kubeconfig file of the cluster.

:::info

Palette has its own RBAC system that is separate from the
[Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) system in the host cluster. The
permissions assigned to you in Palette determine what operations you can perform on the cluster. The permissions
assigned to you in the host cluster through the Kubernetes RBAC system determine what operations you can perform inside
the cluster and on its resources. Refer to the
[Palette Roles and Kubernetes Roles](cluster-rbac#palette-roles-and-kubernetes-roles) for additional information.

:::

The access you have as a user to the kubeconfig files for a cluster depends on the following factors:

- Is OIDC configured for the cluster? OIDC is configured in the Kubernetes pack YAML file of the cluster profile. Refer
  to the respective Kubernetes distribution on the [Packs List](../../integrations/integrations.mdx) page to learn more
  about OIDC configuration.

:::warning

When enabling OIDC, ensure the parameter `oidc-issuer-url` and the `clientConfig` block are properly configured in the
Kubernetes Pack YAML. Properly configuring both parameters ensures the kubeconfig file is available for all project
users. Otherwise, the kubeconfig file will only be available for Cluster Admins or custom roles that have the _delete_
permission for the resource key _cluster_.

:::

- Is the [Spectro Proxy](../../integrations/frp.md) enabled for the cluster?

Use the tables below to help you identify which project role you need to access the kubeconfig file for a cluster.

### Cluster Admin

The following table shows the _Cluster Admin_ role or equivalent provides access to both the Kubeconfig file and the
Admin Kubeconfig file whether OIDC and the Spectro Proxy are configured or not. If you use a custom Palette resource
role instead of the Palette role Cluster Admin, ensure the custom Palette resource role has the _delete_ permissions for
the resource key _cluster_ to access both kubeconfig files for a cluster.

| **Is OIDC Configured?** | **Is Spectro Proxy Enabled?** | **Access to Kubeconfig File** | **Access to Admin Kubeconfig File** |
| ----------------------- | ----------------------------- | ----------------------------- | ----------------------------------- |
| Yes                     | Yes                           | ✅                            | ✅                                  |
| No                      | Yes                           | ❌                            | ✅                                  |
| Yes                     | No                            | ✅                            | ✅                                  |

### Non-Cluster Admin

The table shows that lower-level project roles, such as the _Cluster Editor_ or the _Cluster Viewer_, or custom Palette
resource roles that do not have the _delete_ permissions for the resource key _cluster_ may have access to the
kubeconfig file.

If a cluster has OIDC and the Spectro Proxy enabled then the kubeconfig file is available. Or, if the cluster has OIDC
enabled and the Spectro Proxy disabled, the kubeconfig file is available.

| **Is OIDC Configured?** | **Is Spectro Proxy Enabled?** | **Access to Kubeconfig File** | **Access to Admin Kubeconfig File** |
| ----------------------- | ----------------------------- | ----------------------------- | ----------------------------------- |
| Yes                     | Yes                           | ✅                            | ❌                                  |
| No                      | Yes                           | ❌                            | ❌                                  |
| Yes                     | No                            | ✅                            | ❌                                  |

## API Access

Palette exposes two API endpoints that you can use to access the kubeconfig file for a host cluster. The endpoints are:

- `GET https://api.spectrocloud.com/v1/spectroclusters/{clusterId}/assets/kubeconfig` Returns the kubeconfig file for
  the cluster. The kubeconfig file is returned as a text string. Access to the kubeconfig file is determined by the
  permissions assigned to you in Palette. For additional information, refer to the
  [Kubeconfig Access Permissions](#kubeconfig-access-permissions) section.

- `GET https://api.spectrocloud.com/v1/spectroclusters/{clusterId}/assets/adminkubeconfig` Returns the admin kubeconfig
  file for the cluster. The admin kubeconfig file is returned as a text string. Only users with the Palette project role
  _Cluster Admin_ or with a custom Palette resource role with the resource key _cluster_ and the _delete_ permission can
  access the admin kubeconfig file for a cluster.
