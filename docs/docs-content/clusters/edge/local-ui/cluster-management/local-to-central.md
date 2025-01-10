---
sidebar_label: "Pair Local Cluster with Palette"
title: "Pair Local Cluster with Palette"
description:
  "Learn how to move a local cluster created on hosts with airgap installation mode to be managed by a Palette instance."
hide_table_of_contents: false
sidebar_position: 55
tags: ["edge"]
---

Clusters provisioned on hosts that are installed in the `airgap` installation mode are managed locally by Local UI. You
have the option to transfer the management of a local cluster from Local UI to a Palette instance to be managed
centrally by pairing the local cluster with a Palette instance.

:::preview

:::

## Pair Local Cluster with Palette

Moving a local cluster to central management is a two-step process. You first send a pairing request from your local
cluster to Palette using Local UI. Then you must accept the pairing request and select matching profiles in Palettes to
match the cluster stack.

### Prerequisites

- An active locally managed cluster. The cluster must be in the **Running** state and all nodes must be healthy.

- An Edge host registration token. For more information on how to create registration tokens, refer to
  [Edge Host Registration](../../site-deployment/site-installation/create-registration-token.md).

- All Edge hosts in your cluster must be able to connect to the Palette instance you intend to use to manage the
  cluster.

- Your Palette environment has cluster profiles whose latest version exactly match all layers of the local cluster.
  Refer to [Accept Pairing Request from Palette](#accept-pairing-request-from-palette) for details and examples.

### Procedure

#### Send Pairing Request from Local Cluster

1. Log in to [Local UI](../host-management/access-console.md).

2. On the left **Main Menu**, click **Settings**.

3. On the **Settings** tab, click on the radio button that says **Centrally Managed**. You will be prompted to enter
   information required for pairing your cluster with Palette.

4. Enter the URL for the Palette API endpoint. If you are using Palette SaaS, the endpoint is `api.spectrocloud.com`.

5. Enter your registration token in the **Registration token** field.

6. Click **Pair** to send the pairing request. A pairing ID will be displayed on the Local UI screen once a pairing
   request has been sent. You may use the ID to identify this pairing request in a later step.

#### Accept Pairing Request from Palette

7. Log in to [Palette](https://console.palette.com).

8. From the left **Main Menu**, click **Clusters**.

9. At the top of the page, a box will be displayed prompting you to review pairing requests that Palette has received.
   Click **Pair** to start reviewing the requests.

10. Identify the pairing request corresponding to your cluster by its pairing ID. Click **Pair**.

11. Palette will warn you that once paired, the cluster can only be managed centrally and that local cluster operations
    will no longer be permitted. Check the box that says **I understand** and click **Confirm**. This will take you to
    the **Pair Cluster** wizard.

12. You may change the cluster name as well as the description and tags for your cluster. The fields will be
    pre-populated with their existing values. Once you are satisfied with your changes, click **Next step**.

13. Match the profile used by your local cluster by selecting profiles in your Palette environment. To make a successful
    match, ensure that every pack in the profile used by your cluster is matched with the same pack in the exact same
    version. You can only choose the latest version of a profile in Palette and must make sure that the latest version
    of the profiles you use can match the cluster.

    In the following example, the second and third columns are valid matches because every layer in the original cluster
    has a matching layer in the matched profile. **Valid match 2** is valid even though it only has one full profile
    instead of an infra and an add-on profile, because all the layers are exactly the same.

    The fourth column shows an example of an invalid match because the **Add-on** profile has a pack that is in the
    wrong version. The fifth column is also invalid because it has an additional pack that is not found in the original
    cluster's profile.

    | Local cluster profile     | Valid match 1 ✅          | Valid match 2 ✅          | Invalid match 1 ❌        | Invalid match 2 ❌        |
    | ------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- |
    | **Infra profile**         | **Infra profile**         | **Full profile**          | **Infra profile**         | **Infra profile**         |
    | Amazon EBS CSI 1.20.0     | Amazon EBS CSI 1.20.0     | Amazon EBS CSI 1.20.0     | Amazon EBS CSI 1.20.0     | Amazon EBS CSI 1.20.0     |
    | Calico 3.25.1             | Calico 3.25.1             | Calico 3.25.1             | Calico 3.25.1             | Calico 3.25.1             |
    | PXK-E 1.31.0              | PXK-E 1.31.0              | PXK-E 1.31.0              | PXK-E 1.31.0              | PXK-E 1.31.0              |
    | Ubuntu 22.04              | Ubuntu 22.04              | Ubuntu 22.04              | Ubuntu 22.04              | Ubuntu 22.04              |
    | **Add-on profile**        | **Add-on profile**        |                           | **Add-on profile**        | **Add-on profile**        |
    | Prometheus-Grafana 44.3.1 | Prometheus-Grafana 44.3.1 | Prometheus-Grafana 44.3.1 | Prometheus-Grafana 40.3.1 | Prometheus-Grafana 44.3.1 |
    |                           |                           |                           |                           | Hello-Universe 2.0.0      |

    Once your have selected a valid match, click **Confirm**. Then click **Next step**.

14. Review the profile configurations. Once you are done, click **Validate**.

15. Click **Pair cluster** to start pairing your cluster.

### Validate

1. Log in to [Palette](https://console.palette.com).

2. From the left **Main Menu**, click **Clusters**.

3. Confirm that the cluster is now registered with Palette and can be managed centrally.

## Withdraw Pairing Request From Local Cluster

If you send a pairing request in error from your local cluster, you can withdraw the pairing request before it is
accepted by your Palette instance.

### Prerequisite

- Access to [Local UI](../host-management/access-console.md).

- A pending pairing request. Refer to
  [Send Pairing Request From Local Cluster](#send-pairing-request-from-local-cluster).

### Procedure

1. Log in to [Local UI](../host-management/access-console.md).

2. On the left **Main Menu**, click **Settings**.

3. Copy the **Pairing ID** and save it in a safe location. This ID may be useful when you need to delete the pairing
   request in Palette manually.

4. Click **Cancel Pairing Request**.

5. Your host will inform Palette that the pairing request has been cancelled. This will remove the pending pairing
   request from your Palette instance as well.

   However, if your host cannot connect to your Palette instance, this request will not be able to reach Palette. If
   your host cannot connect to Palette, refer to
   [Reject Pairing Request form Palette](#reject-pairing-request-in-palette) to reject the pending pairing request
   manually.

### Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. On the left **Main Menu**, click **Settings**.

3. Confirm that your cluster is locally managed and does not have a pending pairing request anymore.

## Reject Pairing Request in Palette

If you receive a pairing request that you do not recognize, or if you have a pending pairing request that you know has
been canceled, you can reject the pairing request. You can use tags and the unique pairing ID to identify each pairing
request.

### Prerequisites

- A pending pairing request. Refer to [Pair Local Cluster with Palette](#pair-local-cluster-with-palette) to learn how
  to make one.

- You have the tenant admin or project admin role in your Palette environment. For more information, refer to
  [Role and Permissions](../../../../user-management/palette-rbac/palette-rbac.md).

- The pairing ID of the pairing request.

### Procedure

1. Log in to [Palette](https://console.palette.com).

2. From the left **Main Menu**, click **Clusters**.

3. At the top of the page, a box will be displayed prompting you to review pairing requests that Palette has received.
   Click **Pair** to start reviewing the requests.

4. Identify the pairing request corresponding to your cluster by its pairing ID or tags. Click **Reject**.

### Validate

1. Log in to [Palette](https://console.palette.com).

2. From the left **Main Menu**, click **Clusters**.

3. If you rejected the only pairing request, confirm that the pairing prompt box is no longer present in the
   **Clusters** page.

   If you still have pending pairing requests remaining, at the top of the page, a box will be displayed prompting you
   to review pairing requests that Palette has received. Click **Pair** to start reviewing the requests. Confirm that
   the request you rejected is no longer present.
