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

| Resources               | Max Limit Per Tenant |
| ----------------------- | -------------------- |
| Users                   | 300                  |
| Teams                   | 100                  |
| Projects                | 50                   |
| Workspaces              | 50                   |
| Roles                   | 100                  |
| CloudAccounts           | 200                  |
| Cluster profiles        | 200                  |
| Registries              | 50                   |
| Private Gateway         | 50                   |
| Api Keys                | 20 keys per user     |
| Locations(Backup)       | 100                  |
| Certificates            | 20                   |
| Macros                  | 200 (Per Project)    |
| SSH Keys                | 300                  |
| Alerts or Webhook       | 100 (Per Project)    |
| Clusters.               | 200                  |
| Appliances (Edge hosts) | 200                  |

## Set Resource Limit

To set resource limit:

<br />

- Login to Palette console as `Tenant Admin`.

- Select `Tenant Settings` from the left ribbon menu.

- Select `Resource Limits` tab and set the values for different Palette resources as per tenant resource requirements.

:::info

The resource limit can be customized according to per tenant resource requirements.

:::

# Palette API Rate Limits

- API operations are limited to 10 requests per second for an IP Address.

3. Select **Resource Limits** from the **Tenant Settings Menu**.

4. Set the values for the different Palette resources.

5. Save your changes.

## Validate

You can validate the updated resource limits by creating a resource of the same type you updated. For example, you can
create five API keys if you updated the **API Key** to five. If you attempt to create a sixth API key, you will receive
an error message.
