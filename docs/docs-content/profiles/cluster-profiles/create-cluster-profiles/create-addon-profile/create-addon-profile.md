---
sidebar_label: "Create an Add-on Profile"
title: "Create an Add-on Profile"
description: "Learn how to create an add-on profile in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles"]
---


Add-on cluster profiles offer a range of benefits for workload cluster deployments. These profiles provide enhanced functionality by allowing the addition of various layers such as system apps, authentication, security, monitoring, logging, ingress, and load balancers to the cluster. 

This capability allows you to customize and configure clusters based on specific requirements. Add-on cluster profiles follow a modular approach, making managing and maintaining cluster configurations more flexible. Add-on profiles also promote reusability by allowing profiles to be used across multiple environments, projects, and tenants. Additionally, add-on profiles support integration-specific packs, charts, and manifests, providing flexibility and customization options for workload cluster deployments.

The following documents guide you in customizing a cluster profile using add-on profiles:

- [Add a New Pack](create-pack-addon.md)
- [Add a Manifest](create-manifest-addon.md)
- [Add a Helm Chart](create-helm-addon.md)

## Pack Labels and Annotations

You can specify Namespace labels and annotations to add-on packs, and packs for Container Storage Interfaces (CSI) and Container Network Interfaces (CNI) drivers. These labels and annotations are applied to the Namespace the pack is deployed to or to a specific Namespace if specified. You can apply labels and annotations to the pack's YAML file.

The following parameters are available to specify Namespace labels and annotations:

| **Parameter** | **Description** | **Type** |
| --- | --- | --- |
| `namespace` | The Namespace that the pack is deployed to. If the Namespace does not exist, Palette will create it. | string |
| `additionalNamespaces`| A list of additional Namespaces that Palette will create. | map |
| `namespaceLabels` | A list of key-value pairs for labels applied to the Namespace. | map |
| `namespaceAnnotations` | A list of key-value pairs for annotations applied to the Namespace. | map |


The following example shows how to specify Namespace labels and annotations for an add-on pack, a CSI pack, and a CNI pack. In the example pack YAML configuration, the `wordpress` Namespace is created. An additional Namespace titled `wordpress-storage` is also created. In the parameters sections, `namespaceLabels` and `namespaceAnnotations`, each entry has a key and a value. The key is the name of the target Namespace, and the value is the value of the label or annotation.

```yaml 
pack:
  namespace: "wordpress"
  additionalNamespaces:
    "wordpress-storage"

  namespaceLabels:
    "monitoring": "org=spectro,team=dev"
    "wordpress-storage": "user=demo-user"
    "default": "user=demo-user"
    
  namespaceAnnotations:
    "monitoring": "monitoring.io/enable=true"
    "wordpress-storage": "storage.metrics.io/format=json"
```

## Resources 

- [Profile Layers](../../cluster-profiles.md#profile-layers)

- [Add a New Pack](create-pack-addon.md)

- [Add a Manifest](create-manifest-addon.md)

- [Add a Helm Chart](create-helm-addon.md)

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)