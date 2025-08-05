---
sidebar_label: "Registries"
title: "Registries"
description: "Learn how to add your own custom registries to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
---

Palette supports different types of registries that you can add to the platform and use in your cluster profiles. You
can add the following types of registries to Palette:

- Open Container Initiative (OCI) Registries

- Helm Registries

- Legacy Pack Registries

:::info

We recommend you use [OCI registries](./oci-registry/oci-registry.md) over Legacy Pack registries.

:::

Palette supports OCI registries that support basic authentication. OCI registries can also be used to store and serve
images, Helm Charts, Zarf packages, and Packs. Refer to the [OCI Registries](./oci-registry/oci-registry.md) resource to
learn more about OCI registries.

## Scope

Registries are added at the tenant level and are available to all users in the tenant. You can add multiple registries
of the same type to Palette. If you are using a self-hosted Palette instance, or Palette VerteX, you can add registries
through the system console. Registries added through the system console are available to all tenants in the system.
Check out the [Self-Hosted Add Registry](../../enterprise-version/system-management/add-registry.md) guide or the
[VerteX Add Registry](../../vertex/system-management/add-registry.md) guide.

## Synchronization

Registries are automatically synchronized with Palette every 24 hours. Helm registries are different as you can choose
to disable synchronization. When you disable synchronization, you must manually synchronize the Helm registry with
Palette. Refer to the [Helm Registry](helm-charts.md#synchronization-behavior) resource to learn more about the
synchronization behavior of Helm registries.

## Default Registries

Palette comes with a set of default registries that are available to all SaaS tenants, and non-airgap self-hosted
Palette environments. The default registries are listed below:

| **Name**                   | **Provider** | **Description**                                                                   | **URL**                                        | **Base Path**     |
| -------------------------- | ------------ | --------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------- |
| Bitnami                    | Helm         | A Helm Chart registry containing Helm Charts maintained and supported by Bitnami. | `https://charts.bitnami.com/bitnami`           | -                 |
| Public Spectro Helm Repo   | Helm         | A Helm Chart registry containing Helm Charts maintained and supported by us.      | `https://spectrocloud.github.io/helm-charts`   | -                 |
| Public Repo                | Legacy Packs | A packs registry containing packs maintained and supported by us.                 | `https://registry.spectrocloud.com`            | -                 |
| Palette Registry           | OCI          | A packs registry containing packs maintained and supported by us.                 | `415789037893.dkr.ecr.us-east-1.amazonaws.com` | `production`      |
| Palette Registry FIPS      | OCI          | A packs registry containing FIPS packs maintained and supported by us.            | `415789037893.dkr.ecr.us-west-2.amazonaws.com` | `production-fips` |
| Palette Community Registry | OCI          | A packs registry containing community packs.                                      | `415789037893.dkr.ecr.us-east-1.amazonaws.com` | `community`       |

:::info

Palette VerteX comes with a default OCI registry that only contains FIPS compliant packs. Non-FIPS compliant packs are
not available in Palette VerteX by default and must explicitly be added to Palette VerteX. Refer to the
[Use non-FIPS Packs](../../vertex/system-management/enable-non-fips-settings/enable-non-fips-settings.md) guide to learn
how to add non-FIPS packs registries to Palette VerteX.

:::

## Resources

- [OCI Registries](./oci-registry/oci-registry.md)

- [Helm Registries](./helm-charts.md)

- [Legacy Pack Registries](./pack-registries.md)
