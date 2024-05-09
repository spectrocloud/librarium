---
sidebar_label: "Palette Resource Limits"
title: "Default Palette Resource Limits"
description:
  "Understand the default resource limits for Palette and learn how to set resource limits for your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["user-management"]
---

## Default Palette Resource Limits

Tenant admins can set and update resource limits for Palette. The resource limits determine the maximum number of
resources that can be created in Palette. The resource limits are set at the tenant level and apply to all projects in
the tenant.

The following table lists the default resource limits for Palette:

| **Resources**     | **Max Limit** | **Scope** |
| ----------------- | ------------- | --------- |
| Users             | 300           | Tenant    |
| Teams             | 100           | Tenant    |
| Projects          | 50            | Tenant    |
| Workspaces        | 50            | Tenant    |
| Roles             | 100           | Tenant    |
| Cloud Accounts    | 200           | Tenant    |
| Cluster Profiles (profile versions count as well) | 200           | Tenant    |
| Registries        | 50            | Tenant    |
| Private Gateway   | 50            | Tenant    |
| API Keys          | 20            | User      |
| Backup Locations  | 100           | Tenant    |
| Certificates      | 20            | Tenant    |
| Macros            | 200           | Project   |
| SSH Keys          | 300           | Tenant    |
| Alerts or Webhook | 100           | Project   |
| Clusters          | 10,000        | Tenant    |
| Edge Hosts        | 200           | Tenant    |

## Set Resource Limit

Use the following steps to set or update resource limits for your Palette tenant.

## Prerequisites

- You must have access to the _tenant admin_ role.

## Update Limits

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Resource Limits** from the **Tenant Settings Menu**.

4. Set the values for the different Palette resources.

5. Save your changes.

## Validate

You can validate the updated resource limits by creating a resource of the same type you updated. For example, you can
create five API keys if you updated the **API Key** to five. If you attempt to create a sixth API key, you will receive
an error message.
