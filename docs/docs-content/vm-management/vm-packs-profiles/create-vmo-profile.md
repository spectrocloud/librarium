---
sidebar_label: "Create a VMO Profile"
title: "Create a VMO Profile"
description: "Learn how to create a cluster profile to utilize Palette Virtual Machine Orchestrator capabilities."
icon: " "
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo"]
---

The **Virtual Machine Orchestrator** pack that you use to create a cluster profile conveniently includes several
components and automatically installs the [Spectro Proxy](../../integrations/frp.md) pack when you use the default
profile configuration. To learn about pack components, refer to
[Virtual Machine Orchestrator Pack](../vm-packs-profiles/vm-packs-profiles.md).

## Limitations

- If you are updating the profile of an existing cluster that already has the **Spectro Proxy** pack. You must restart
  the Spectro Proxy pod for the proxy to work as expected.

  To restart the Spectro Proxy pod, delete the pod and it will restart automatically. You can issue the following
  command to delete the pod:

  ```shell
  kubectl delete pods --selector app=spectro-proxy --all-namespaces
  ```

## Prerequisites

- A Palette permission key `create` for the resource `clusterProfile`.

## Create the Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.

3. Enter basic information for the profile: name, version if desired, and optional description.

4. Select type **Add-on**, and click **Next**.

5. In the following screen, click **Add New Pack**.

6. Use the information below to find the **Virtual Machine Orchestrator** pack:

   <br />

   - **Pack Type**: System App
   - **Registry**: Public Repo
   - **Pack Name**: Virtual Machine Orchestrator
   - **Pack Version**: 1.0 or higher

7. Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the
   **Spectro Proxy** pack when you create the cluster. Check out the [Spectro Proxy](../../integrations/frp.md) guide to
   learn more. Changing the default may require some additional configuration.

   The **Direct** option is intended for a private configuration where a proxy is not implemented or not desired.

   <br />

   :::warning

   We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default
   settings can introduce misconfigurations. Carefully review the changes you make to a pack.

   :::

8. Click **Confirm & Create**.

9. In the following screen, click **Next**.

10. Review the profile and click **Finish Configuration**.

11. Apply the profile to your cluster.

## Validate

You can validate the profile is created.

<br />

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to **Profiles** from the left **Main Menu**.

3.  Locate the newly created profile in the list.

4.  From the left **Main Menu**, click **Clusters** and select your cluster.

5.  Based on your Single Sign-On (SSO) settings, the **Virtual Machines** tab may display on the **Cluster Overview**
    page, or the **Connect** button may display next to **Virtual Machines Dashboard** in cluster details.

## Next Steps

You will need to configure roles and role bindings to give users access to clusters. You can use VM user roles and
permissions or standard Kubernetes roles. For configuration guidance, refer to
[Add Roles and Role Bindings](add-roles-and-role-bindings.md). The
[VM User Roles and Permissions](../vm-roles-permissions.md) reference lists Cluster Roles and equivalent Palette Roles.

## Resources

- [Add Roles and Role Bindings](add-roles-and-role-bindings.md)
