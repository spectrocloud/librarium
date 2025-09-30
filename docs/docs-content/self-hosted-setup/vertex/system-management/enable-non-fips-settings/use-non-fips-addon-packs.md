---
sidebar_label: "Use Non-FIPS Packs"
title: "Use Non-FIPS Packs"
description: "Add non-FIPS packs to VerteX cluster profiles."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vertex", "non-fips"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX provides the following FIPS-compliant infrastructure components in Kubernetes clusters it deploys. Review
[FIPS-Compliant Components](../../fips/fips-compliant-components.md) to learn more.

- Operating System (OS)
- Kubernetes
- Container Network Interface (CNI)
- Container Storage Interface (CSI)

VerteX provides the flexibility to utilize non-FIPS packs listed in the table below. This allows tenant users to
customize deployments to their specific needs. To make non-FIPS packs available, you must add one or both of the
registries. To utilize the entire suite of packs we recommend adding both registries. Check out
[Add a Registry](../add-registry.md) for guidance. Our support team will provide the required credentials to access the
registries.

| **Registry**                         | **Type** | **Endpoint URL**                                       | **FIPS** | **Base Path** |
| ------------------------------------ | -------- | ------------------------------------------------------ | -------- | ------------- |
| **OCI Pack Registry**                | AWS ECR  | `https://415789037893.dkr.ecr.us-east-1.amazonaws.com` | No       | production    |
| **Spectro Cloud Community Registry** | AWS ECR  | `https://415789037893.dkr.ecr.us-east-1.amazonaws.com` | No       | community     |

:::info

Registries can be added at the system level or tenant level. When added at the system level, registries are available to
all the tenants. When added at the tenant level, registries are available only to that tenant. The
[Add a Registry](../add-registry.md) page offers guidance on adding a registry at the system scope in VerteX. For
guidance on adding a registry at the tenant scope, check out
[Add a Tenant-Level Registry](../../../tenant-settings/add-registry.md).

:::

The screenshot below shows the icon that VerteX displays next to FIPS-compliant infrastructure components to indicate
full FIPS compliance. Other icons are used to indicate profile layers with partial, unknown, or non-FIPS compliant
status. To learn about other icons VerteX applies, refer to [FIPS Status Icons](../../fips/fips-status-icons.md).

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.webp)

Use the following steps to enable non-FIPS packs.

## Prerequisites

- Tenant admin permission to enable this feature.

- Non-FIPS OCI pack registries added in VerteX and required credentials to access them. Review
  [Add a Registry](../add-registry.md) for guidance.

## Allow Non-FIPS Packs

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Platform Settings**.

4. Enable the **Allow non-FIPS packs** option. When you enable this option, you are prompted to confirm the use of
   non-FIPS packs for the tenant.

![Diagram showing the Allow non-FIPS packs toggle enabled.](/vertex_use-non-fips-settings_nonFips-packs.webp)

To disable the setting, toggle this option off and confirm you want to disable it.

When packs are added to a cluster profile, VerteX applies the appropriate icon next to packs and imported clusters to
indicate their FIPS compliance status.

## Validate

Use these steps to verify non-FIPS packs are available.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Try creating a cluster profile and verify the registry you added is available and packs are displayed. For guidance,
   review the [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) documentation.

VerteX will display the appropriate FIPS status icon next to each pack layer.

## Resources

- [Packs List](../../../integrations/integrations.mdx)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [Create an Add-on Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [FIPS Status Icons](../../fips/fips-status-icons.md)

- [Add a Registry](../add-registry.md)

- [Add a Tenant-Level Registry](../../../tenant-settings/add-registry.md)
