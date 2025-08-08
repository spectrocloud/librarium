---
sidebar_label: "Cluster Auto Remediation"
title: "Cluster Auto Remediation"
description: "Learn about Palette's Cluster Auto Remediation platform setting."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster management"]
---

Palette provides Cluster Auto Remediation as a node reconciliation operation. When Cluster Auto Remediation is enabled,
unhealthy nodes in all the Palette-provisioned clusters will automatically be replaced with new nodes. Turning off this
feature will disable auto remediation. This feature can work under two scopes:

- Tenant

- Project

:::warning

This feature does not apply to EKS or AKS clusters.

:::

## Prerequisites

- Tenant admin or project admin access, depending on the scope.

- An existing cluster. Follow this [tutorial](../../clusters.md) to get started.

## Enablement

<Tabs groupId="clusterAutoRemediation">

<TabItem value="projectScope" label="Project Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. Toggle the **Cluster Auto Remediation** button.

5. A pop-up box will ask you to confirm the action. Click **OK**.

</TabItem>

<TabItem value="tenantScope" label="Tenant Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Platform Settings**.

4. Toggle the **Cluster Auto Remediation** button.

5. A pop-up box will ask you to confirm the action. Click **OK**.

</TabItem>

</Tabs>

## Validate

<Tabs groupId="clusterAutoRemediation">

<TabItem value="projectScope" label="Project Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. The **Cluster Auto Remediation** toggle button is checked.

</TabItem>

<TabItem value="tenantScope" label="Tenant Scope">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Platform Settings**.

4. The **Cluster Auto Remediation** toggle button is checked.

</TabItem>

</Tabs>
