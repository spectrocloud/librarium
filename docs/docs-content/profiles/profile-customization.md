---
sidebar_label: "Profile Customization"
title: "Profile Customization"
description:
  "REVISE: Learn how Palette uses cluster profiles to provide both consistency and flexibility across Kubernetes
  clusters."
hide_table_of_contents: false
tags: ["profiles", "cluster profiles", "app profiles", "system profiles"]
---

## Pack Labels and Annotations

Namespace labels and annotations are used to customize packs. This section explains how to apply them in a pack YAML
configuration.

You can specify namespace labels and annotations to add-on packs, and packs for Container Storage Interfaces (CSI) and
Container Network Interfaces (CNI) drivers. These labels and annotations are applied to the namespace the pack is
deployed to or to a specific namespace if specified. You can apply labels and annotations to the pack's YAML file.

The following parameters are available to specify namespace labels and annotations:

| **Parameter**                        | **Description**                                                                                                                                                                                                                                                                                                        | **Type** |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `namespace`                          | The namespace that the pack is deployed to. If the namespace does not exist, Palette will create it. The namespace must follow the regex format `[a-z0-9]([-a-z0-9]*[a-z0-9])?`; only lowercase, alphanumeric characters and hyphens are allowed, and the namespace must start and end with an alphanumeric character. | string   |
| `additionalNamespaces`               | A list of additional namespaces that Palette will create. `additionalNamespace` values must follow the same name regex format as `namespace`.                                                                                                                                                                          | map      |
| `namespaceLabels`                    | A list of key-value pairs for labels applied to the namespace.                                                                                                                                                                                                                                                         | map      |
| `namespaceAnnotations`               | A list of key-value pairs for annotations applied to the namespace.                                                                                                                                                                                                                                                    | map      |
| ` spectrocloud.com/install-priority` | The install order of the pack. The lower the number, the higher the priority. Refer to the [Install Order](./cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md#install-order) section to learn more.                                                                               | string   |

The following example shows how to specify namespace labels and annotations for an add-on pack, a CSI pack, and a CNI
pack. In the example pack YAML configuration, the `wordpress` namespace is created. An additional namespace titled
`wordpress-storage` is also created. In the parameters sections, `namespaceLabels` and `namespaceAnnotations`, each
entry has a key and a value. The key is the name of the target namespace, and the value is the value of the label or
annotation.

```yaml
pack:
  namespace: "wordpress"
  additionalNamespaces: "wordpress-storage"

  namespaceLabels:
    "monitoring": "org=spectro,team=dev"
    "wordpress-storage": "user=demo-user"
    "default": "user=demo-user"

  namespaceAnnotations:
    "monitoring": "monitoring.io/enable=true"
    "wordpress-storage": "storage.metrics.io/format=json"
```

## Namespace Considerations

When deploying Helm charts or other manifests to your cluster outside of the context of Palette, it is important you
understand the expected behavior of how Palette manages namespaces and its resources.

If a Palette-managed cluster profile is removed, Palette will destroy the associated namespace and all resources within
that namespace. This includes resources that were not deployed by Palette.

Here is an example scenario.

A cluster has the following two packs and Helm chart installed in the `hello-universe` namespace:

- Hello Universe (Palette-managed pack)
- Kubecost (Palette-managed pack)
- kubernetes-dashboard (helm chart added outside of Palette)

Initial state of the namespace.

```bash
kubectl get pods --namespace hello-universe
NAME                                                             READY   STATUS    RESTARTS   AGE
hello-universe-deployment-5b4ffc8f97-r5nhb                       1/1     Running   0          3m50s
cost-analyzer-cost-analyzer-59bf7cc86-tzdgs                      2/2     Running   0          7m47s
cost-analyzer-cost-analyzer-kube-state-metrics-8b6dbd76b-scjbj   1/1     Running   0          7m47s
cost-analyzer-cost-analyzer-prometheus-server-7b4c66596f-fb5f2   1/1     Running   0          7m47s
kubernetes-dashboard-7b544877d5-j8r4x                            1/1     Running   0          10m13s
dashboard-metrics-scraper-7bc864c59-n2j4m                        1/1     Running   0          10m13s
```

If you remove the Kubecost pack through Palette, all resources in the `hello-universe` namespace will be destroyed,
including the namespace.

```bash
kubectl get pods --namespace hello-universe
No resources found in hello-universe namespace.
```

We recommend using separate namespaces for all cluster profile layers, including resources manually deployed outside
Palette. Separating resources into namespaces prevents unintended deletions.
