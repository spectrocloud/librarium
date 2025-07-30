---
sidebar_label: "Create an Add-on Profile"
title: "Create an Add-on Profile"
description: "Learn how to create an add-on profile in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles"]
---

Add-on cluster profiles offer a range of benefits for workload cluster deployments. These profiles provide enhanced
functionality by allowing the addition of various layers such as system apps, authentication, security, monitoring,
logging, ingress, and load balancers to the cluster.

This capability allows you to customize and configure clusters based on specific requirements. Add-on cluster profiles
follow a modular approach, making managing and maintaining cluster configurations more flexible. Add-on profiles also
promote reusability by allowing profiles to be used across multiple environments, projects, and tenants. Additionally,
add-on profiles support integration-specific packs, charts, and manifests, providing flexibility and customization
options for workload cluster deployments.

The next sections provide guidance in creating each type of these add-on profiles.

## Install Order

You can specify the install order of each add-on pack layer in a cluster profile. The install order value accepts
negative and positive numbers and 0. The default install order value is 0. The install order determines the order in
which manifests in the profile are applied. The lowest-numbered packs will be installed first. Palette will wait a few
moments when installing layers to ensure the readiness checks pass.

To set the install order for an add-on pack layer, add the `spectrocloud.com/install-priority` annotation to the pack
layer YAML. Replace the number with the desired install order value.

```yaml
pack:
  spectrocloud.com/install-priority: "30"
```

If a readiness check for an add-on pack layer fails, Palette will keep checking the status every two minutes until the
check passes. Once the readiness check passes for a pack with a lower priority, add-on layer packs with higher install
priority will be installed.

A cluster profile containing several different install order values will take a few minutes longer to install versus a
cluster profile with the same install order for all add-on packs.

:::info

Palette will deploy together all packs that have the same install order. Palette will wait for all pack readiness checks
to pass before moving to the next install order.

:::

## Deletion Order

When you delete a cluster, Palette removes the add-on pack layers in the reverse order of their installation. Packs with the highest installation priority are deleted first, while those with the lowest priority (installed earliest) are deleted last. This approach ensures that dependent resources are cleaned up properly and in the correct order, avoiding issues during deletion.

## Resources

- [Add a Pack](create-pack-addon.md)

- [Add a Manifest](create-manifest-addon.md)

- [Add a Helm Chart](create-helm-addon.md)
