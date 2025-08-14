---
sidebar_label: "Add Roles and Role Bindings"
title: "Add Roles and Role Bindings"
description:
  "Learn how to configure user roles and cluster role bindings for Virtual Machines managed by Palette Virtual Machine
  Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo"]
---

You must configure permissions for actions that users can perform on Virtual Machines (VMs) deployed using Palette
Virtual Machine Orchestrator (VMO), such as cloning, updating, and migrating VMs. You can do this by creating roles and
cluster role bindings to determine access permissions. Refer to
[VM User Roles and Permissions](./vm-roles-permissions.md) for a list of Cluster Roles and equivalent Palette Roles. To
learn more about role-based Access Control (RBAC) in Palette, review the
[RBAC and Namespace Support](../../clusters/cluster-management/cluster-rbac.md) guide.

## Prerequisites

- A cluster profile with the **Virtual Machine Orchestrator** add-on pack configured. Check out the
  [Create a VMO Profile](../create-vmo-profile.md) guide to learn more.
  <!-- prettier-ignore-start -->

  - Configure OpenID Connect (OIDC) at the Kubernetes layer of your cluster profile to allow you to create role bindings
    that map individual users or groups assigned within the OIDC provider's configuration to a role. Refer to the
    <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" />
    pack additional guidance for more information.

  <!-- prettier-ignore-end -->

- Assigned permissions to access Palette clusters.

## Add Roles and Role Bindings

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and select your cluster.

3. From the cluster **Overview** tab, download the [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) file.
   This file allows you to connect to your deployed cluster.

4. Open a terminal session and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

5. Execute the following command to list all of the `ClusterRole` templates that have been installed by the VMO pack.
   Palette provides the following four out-of-the-box Cluster roles for Palette Virtual Machine Orchestrator. Refer to
   the [VM User Roles and Permissions](./vm-roles-permissions.md) to learn more about each role.

   ```shell
   kubectl get clusterroles | awk '{print $1}' | grep '^spectro-vm-'
   ```

   ```text hideClipboard title="Expected output"
   spectro-vm-admin
   spectro-vm-power-user
   spectro-vm-user
   spectro-vm-viewer
   ```

6. Choose a cluster role based on the level of access that you require. We recommend choosing the lowest level of
   privilege required. Execute the following command to copy the contents of the template to a YAML file.

   ```shell
   kubectl get clusterrole <cluster-role-name> --output yaml > role.yaml
   ```

7. Open your manifest file with the editor of your choice and change the `kind` type to `Role`.

   Then, create a new `metadata.namespace` field and set it to a namespace of your choice.

   Finally, delete any other unnecessary metadata fields such as `metadata.resourceVersion`, `metadata.uid`,
   `metadata.creationTimestamp`, `metadata.helm.sh/chart`, `metadata.annotations`, and all `metadata.app.kubernetes.io`
   labels.

   Save your changes and close your text editor.

   ```text hideClipboard title="Example role definition"
   apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
     namespace: default
     name: spectro-vm-viewer
   ```

8. Execute the following command to apply your configured role. This role grants the specified permissions in the
   specified namespace of your cluster.

   ```shell
   kubectl apply --filename spectro-vm-viewer-role.yaml
   ```

   ```text hideClipboard title="Expected output"
   role.rbac.authorization.k8s.io/spectro-vm-viewer created
   ```

9. Return to [Palette](https://console.spectrocloud.com). Click on **Settings** and choose **RBAC** to add role
   bindings. Select the **Namespaces** tab.

10. Click **Add namespace** and fill in the details of the namespace you want to configure. You can also specify
    resource quotas. Click **Confirm** to save your configuration.

11. Click on **Add New Binding** under the **Role Bindings** section. Select the namespace you configured from the
    **Namespace** drop down. Fill in the name of the role you defined in Step 8. Then, add a user, group or service
    account name in the **Subjects** section. Refer the
    [Create Role Bindings](../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide for further
    information. Click **Confirm** to update the cluster.

![Cluster role binding](/vm-management_rbac_add-roles-and-role-bindings_created-binding.webp)

The cluster status displays as **Upgrading** on the **Cluster Overview** page. Upgrading can take several minutes
depending on your environment. You can track events from the **Events** tab.

## Validate

You can verify role creation and role binding is successful by following the steps below.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and select your cluster.

3. From the cluster **Overview** tab, download the [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) file.
   This file allows you to connect to your deployed cluster.

4. Open a terminal session and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

5. Use the following command to ensure the role binding was successful.The command outputs the name of namespace and
   name of your role binding, separated by a `/`.

   ```shell
   ROLE_NAME=<role-name>
   kubectl get rolebinding --all-namespaces --output jsonpath='{range .items[?(@.roleRef.name=="spectro-vm-viewer")]}{.metadata.namespace}/{.metadata.name}{"\n"}{end}'
   ```

   ```text hideClipboard title="Example output"
   default/spectro-on-demand-16823991360055847390
   ```

6. Execute the following command to review the configuration of the role binding you created in the Palette UI.

   ```shell
   kubectl describe rolebinding <role-binding-name> --namespace <namespace>
   ```

   ```text hideClipboard title="Example output"
   Name:         spectro-on-demand-16823991360055847390
   Labels:       spectrocloud.com/clusterId=689cd541dd4d6d26c98e60c8
                 spectrocloud.com/clusterRbac=true
   Annotations:  <none>
    Role:
      Kind:  Role
      Name:  spectro-vm-viewer
    Subjects:
      Kind  Name                             Namespace
      ----  ----                             ---------
      User  user@example.com
   ```

## Next Steps

Now you are ready to deploy a VM. Review the [Deploy VM From a Template](../create-manage-vm/deploy-vm-from-template.md)
guide to get started with the deployment process.
