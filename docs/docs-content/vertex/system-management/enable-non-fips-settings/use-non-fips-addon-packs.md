---
sidebar_label: "Use non-FIPS Packs"
title: "Use non-FIPS Packs"
description: "Add non-FIPS packs to VerteX cluster profiles."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["vertex", "non-fips"]
---




Palette VerteX provides the following FIPS-compliant infrastructure components in Kubernetes clusters it deploys. Review [FIPS-Compliant Components](../../fips/fips-compliant-components.md) to learn more.
    
- Operating System (OS)
- Kubernetes
- Container Network Interface (CNI)
- Container Storage Interface (CSI)

VerteX provides the flexibility to utilize non-FIPS packs. To do this, you must add a non-FIPS compliant pack registry. Review the [Add a Registry](../add-registry.md) guide. 

We provide an Open Container Initiative (OCI) registry and a community registry. You can add both non-FIPS registries to utilize the entire suite of packs. The table below lists these registries and their endpoints. Our support team will provide you with the required credentials.

| **Production**     | **Type**   | **Endpoint**       | **Base Path**   |
| -------------------| ---------- | -------------------------- | ----------------------- |
| **OCI Pack Registry**  | non-FIPS   | 415789037893.dkr.ecr.us-east-1.amazonaws.com | `production` |
| **Spectro Cloud Community Registry** | non-FIPS | 415789037893.dkr.ecr.us-east-1.amazonaws.com  | `community` |

The ability to use non-FIPS packs allows tenant users to tailor deployments to their specific needs by customizing cluster profiles with infrastructure or add-on functionality that meets their requirements. For more information about cluster profiles and how to create them, check out the [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) documentation.

The screenshot below shows the icon that VerteX displays next to FIPS-compliant infrastructure components to indicate full FIPS compliance. Other icons are used to indicate profile layers with partial, unknown, or non-FIPS compliant status. To learn about other icons VerteX applies, refer to [FIPS Status Icons](../../fips/fips-status-icons.md).

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.png) 


Use the following steps to enable non-FIPS packs.

## Prerequisites

- You need tenant admin permission to enable this feature.

- To use non-FIPS packs, add the **Non-fips pack registry**.


## Allow Non-FIPS Packs

1. Log in to the Palette VerteX system console. Refer to [Access the System Console](../system-management.md#access-the-system-console) guide.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**. 

3. From the **Tenant Settings Menu**, select **Platform Settings**.

4. Enable the **Allow non-FIPS packs** option. When you enable this option, you are prompted to confirm the use of non-FIPS packs for the tenant.


![Diagram showing the Allow non-FIPS packs toggle enabled.](/vertex_use-non-fips-settings_nonFips-packs.png)
 

To disable the setting, toggle this option off and confirm you want to disable it.

When packs are added to a cluster profile, VerteX applies the appropriate icon next to packs and imported clusters to indicate their FIPS compliance status.   


## Validate

Use these steps to verify non-FIPS packs are available.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**. 

3. Try creating a cluster profile and verify the registry you added is available and packs are displayed. For guidance, review the [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) documentation.

VerteX will display the appropriate FIPS status icon next to each pack layer.
   

## Resources

- [Packs List](../../../integrations/integrations.mdx)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [Create an Add-on Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [FIPS Status Icons](../../fips/fips-status-icons.md)



