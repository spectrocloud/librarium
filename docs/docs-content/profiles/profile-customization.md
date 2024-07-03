---
sidebar_label: "Profile Customization"
title: "Profile Customization"
description:
  "REVISE: Learn how Palette uses cluster profiles to provide both consistency and flexibility across Kubernetes
  clusters."
hide_table_of_contents: false
tags: ["profiles", "cluster profiles", "app profiles", "system profiles"]
---

Namespace labels and annotations are used to customize packs. The section below explains how to apply them in a pack
YAML configuration.

## Pack Labels and Annotations

You can specify namespace labels and annotations to add-on packs, and packs for Container Storage Interfaces (CSI) and
Container Network Interfaces (CNI) drivers. These labels and annotations are applied to the namespace the pack is
deployed to or to a specific namespace if specified. You can apply labels and annotations to the pack's YAML file.

The following parameters are available to specify namespace labels and annotations:

| **Parameter**          | **Description**                                                                                      | **Type** |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| `namespace`            | The Namespace that the pack is deployed to. If the namespace does not exist, Palette will create it. | string   |
| `additionalNamespaces` | A list of additional namespaces that Palette will create.                                            | map      |
| `namespaceLabels`      | A list of key-value pairs for labels applied to the namespace.                                       | map      |
| `namespaceAnnotations` | A list of key-value pairs for annotations applied to the namespace.                                  | map      |

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
