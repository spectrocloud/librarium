---
sidebar_label: "Add Roles and Role Bindings"
title: "Add Roles and Role Bindings"
description: "Learn how to configure user roles and cluster role bindings for Virtual Machines managed by Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo"]
---


You must configure permissions for actions that users can perform on Virtual Machines (VMs) deployed using Palette Virtual Machine Orchestrator (VMO), such as cloning, updating, and migrating VMs. You can do this by creating roles and cluster role bindings to determine access permissions. Refer to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles. To learn more about Cluster RBAC in Palette, review the [RBAC and NS Support](/clusters/cluster-management/cluster-rbac) guide. 


## Prerequisites

- A cluster profile with the **Virtual Machine Orchestrator** add-on pack configured. Check out the [Create a VMO Profile](/vm-management/vm-packs-profiles/create-vmo-profile) guide to learn more.


- Two defined cluster role bindings for every user: ``spectro-list-namespaces``and ``spectro-list-vmtemplates``.


- Additional cluster roles, based on the user's persona, must be associated with the user by specifying a cluster role binding or a namespace-restricted role binding:

    <br />

    - ``spectro-vm-admin``

    - ``spectro-vm-power-user``

    - ``spectro-vm-user``

    - ``spectro-vm-viewer``

    Alternatively, you can use standard Kubernetes roles ``cluster-admin``, ``admin``, ``edit``, and ``view`` instead of defining bindings based on ``spectro-vm-*`` roles.


- Assigned permissions to access Palette clusters. 


## Add Roles and Role Bindings

1. Log in to [Palette](https://console.spectrocloud.com).


2. From the left **Main Menu**, click **Clusters** and select your cluster. 


3. Click on **Settings** and choose **RBAC** to add role bindings. Refer to [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) for guidance. Refer to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles.


4. Click **Confirm** to update the cluster.
	
The cluster status displays as **Upgrading** on the **Cluster Overview** page. Upgrading can take several minutes depending on your environment. You can track events from the **Events** tab.


## Validate

You can verify role creation and role binding is successful by following the steps below.

<br />


1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the cluster you created the role binding in to view its details page.


4. Download the **kubeconfig** file for the cluster or use the web shell to access the host cluster.


5. Use the following commands to review details about the role and to ensure the role binding was successful.  


#### Cluster Role:

```shell
kubectl get clusterrole <yourRoleNameHere> --output yaml
```


#### Role

```shell
kubectl get role <yourRoleNameHere> --namespace <namespace> --show-kind --export
```


## Next Steps

Now you are ready to deploy a VM. Review the [Deploy VM From a Template](/vm-management/create-manage-vm/standard-vm-operations/deploy-vm-from-template) guide to get started with the deployment process.
	

## Resources

- [VM User Roles and Permissions](/vm-management/vm-roles-permissions)
