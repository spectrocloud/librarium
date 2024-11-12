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
cluster's PCG reference point by using the Palette API endpoint `GET /v1/spectroclusters/clusterId`. The resonse
payload's `metadata.annotations.overlordUid` field contains the ID of the PCG that deployed the cluster.

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
