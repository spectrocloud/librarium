---
sidebar_label: "Migrate a PCG"
title: "Migrate a PCG"
description: "Learn why, when, and how to migrate an existing Private Cloud Gateway (PCG) to a differnt PCG."
hide_table_of_contents: false
sidebar_position: 50
tags: ["pcg"]
---

Clusters deployed through a Private Cloud Gateway (PCG) maintain a reference point to the PCG that deployed them. This
reference point is needed so that Palette knows what PCG to use when the cluster needs to be removed. A Cluster API
pivot occurs between the PCG and the cluster during a cluster deployment and removal. In a cluster creation, the pivot
occurs from the PCG to the cluster. In a cluster removal, the Cluster API pivot occurs from the cluster to the PCG.
Check out the [Order of Operations](../../../architecture/orchestration-spectrocloud.md) to learn more about the Cluster
API pivot.

The cluster's PCG reference point is stored in the Palette management plane's internal database. You can retrieve a
cluster's PCG reference point by using the Palette API endpoint `GET /v1/spectroclusters/:uid`. The resonse payload's
`metadata.annotations.overlordUid` field contains the ID of the PCG that deployed the cluster.

```json hideClipboard {5}
{
    "metadata": {
        "annotations": {
            "jetUid": "6d1e59d9-08fb-4f5c-88ed-1f8c318884bb",
            "overlordUid": "6732677ce46389af646d517a",
            "ownerUid": "667c37669fb1d224ffd0bd1d",
            "palette.spectrocloud.com/disablenodeautoremidiation": "false",
            "permissions": "cluster.create,cluster.delete,cluster.get,cluster.import,cluster.list,cluster.update,tag.update",
            "projectUid": "11111111111111111111",
            "rootDomain": "console.spectrocloud.com",
            "scope": "project",
            "scopeVisibility": "16",
            "spectroComponentsUpgradeForbidden": "true",
            "tenantUid": "2222222222222222222"
        },
```

<details>
<summary>How do I get my PCG's `overlordUid`?</summary>

The `overlordUid` is a unique identifier of the PCG that deployed the cluster. However, this value is different from the
actual cluster ID of the PCG. To retrieve a PCG cluster's `overlordUid` use the following kubectl command on the PCG
cluster.

```shell
kubectl get configmap overlord-config --namespace=jet-system --output=jsonpath='{.data.overlord-config\.yaml}' | grep 'overlordUid:' | sed 's/overlordUid: //'
```

You will get the `overlordUid` of the PCG cluster.

```text hideClipboard
6732677ce46389af646d517a
```

</details>

## What is a PCG migration?

A PCG migration is an action that updates the PCG reference point mapping in Palette of the PCG deployed clusters. All
clusters deployed by the original PCG will be updated to reference the new PCG. This action is internal to the Palette
management plane. The migration process is necessary when you want to remove the existing PCG. The ability to migrate a
PCG is helpful in scenarios such as:

- Decommissioning an existing PCG.

- PCG upgrade errors.

- The cloud account associated with the existing PCG is no longer valid and a new cloud account is needed.

:::warning

A PCG migration is an irreversible action. Once a PCG is migrated, the original PCG is no longer associated with the
clusters that it deployed.

:::

Use the following steps to migrate a PCG to a different PCG.

## Prerequisites

- Tenant admin access to the Palette.

- At least two healthy PCG with network connectivity to the Palette management plane.

- The new PCG must target the same infrastructure provider as the existing PCG.

## Migrate PCG

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**.

4. In the list of PCGs, identify the PCG that you want to migrate and click on the **three-dot Menu** at the end of the
   PCG row.

5. Select **Migrate** from the **drop-down Menu**.

6. In the **Migrate Cloud Gateway** dialog box, select the a PCG from the **PCG** drop-down list.

7. Click **Migrate**.

We recommend you remove the cloud account created by the PCG that you migrated. This will prevent any future cluster
deployments from using the cloud account associated with the migrated PCG. During a cluster deployment, if you
accidentally select the cloud account mapped to the migrated PCG. Palette will automatically ensure the newly specified
PCG is used as a PCG reference point instead of the migrated PCG that belongs to the cloud account selected.

## Validate

After the migration is complete, you can validate the migration by checking a cluster deployed with the migrated PCG no
longer referencing the old PCG. Use the Palette API endpoint `GET /v1/spectroclusters/:uid` and verify the
`metadata.annotations.overlordUid` field to ensure that the cluster now references the new PCG.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click **Clusters**.

3. Click on a cluster that was deployed by the PCG that you migrated. Take note of the cluster ID. You can find the ID
   in the URL of the browser. It is the last part of the URL after the `/clusters/`.

   ```text hideClipboard
   https://console.spectrocloud.com/clusters/11111111111111111111
   ```

4. Retrieve a deployed cluster's `overlordUid` using the Palette API endpoint `GET /v1/spectroclusters/:uid`. You can
   use the `curl` command below. Make sure you replace the `:uid` path parameter with the cluster ID, and the `apiKey`
   and `ProjectUid` headers with your own values.

   ```shell hideClipboard
   curl --location 'https://api.spectrocloud.com/v1/spectroclusters/:uid' \
   --header 'ProjectUid: XXXXXXXXXXXX' \
   --header 'Accept: application/json' \
   --header 'apiKey: XXXXXXXXXXX'
   ```

5. Verify that the `metadata.annotations.overlordUid` field in the response payload matches the new PCG's `overlordUid`.
   Refer to the into section of this guide on how to get the `overlordUid` of a PCG cluster if you need additional help.

   ```json hideClipboard {5}
   {
    "metadata": {
        "annotations": {
            "jetUid": "6d1e59d9-08fb-4f5c-88ed-1f8c318884bb",
            "overlordUid": "672fa7ad6e7f4d26fd91d81b",
            "ownerUid": "667c37669fb1d224ffd0bd1d",
            "palette.spectrocloud.com/disablenodeautoremidiation": "false",
            "permissions": "cluster.create,cluster.delete,cluster.get,cluster.import,cluster.list,cluster.update,tag.update",
            "projectUid": "11111111111111111111",
            "rootDomain": "console.spectrocloud.com",
            "scope": "project",
            "scopeVisibility": "16",
            "spectroComponentsUpgradeForbidden": "true",
            "tenantUid": "2222222222222222222"
        },
   ```
