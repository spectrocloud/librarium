---
sidebar_label: "Create Your First Template"
title: "Create Your First Template"
description: "Learn how to create and manage templates in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
draft: true
tags: ["vmo", "vm launchpad", "templates"]
---

<!-- vale off -->

VM templates are reusable VM specifications that define a base image, compute, network, storage, and hardware settings.
Create VMs from templates to ensure consistency and speed up provisioning.

## Create Your First Template

1. Navigate to **Workloads** > **Templates**.

2. Select **Create Template**.

3. The VM creation wizard opens in template mode. Complete the following steps:

| **Parameter** | **Description**                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Source**    | Select the source DataVolume and namespace. Set the template name, display name, description, and guest OS. |
| **Storage**   | Configure the root disk size, StorageClass, and boot order.                                                 |
| **Hardware**  | Configure firmware, devices, and features.                                                                  |
| **Lifecycle** | Configure an optional snapshot policy that is stored as a template annotation.                              |
| **Review**    | Verify the settings and create the template.                                                                |

4. Select **Create Template**. Launchpad saves the template as a `VmTemplate` custom resource.

## Next Steps

After you deploy your first template, follow the [Create Your First VM](./quick-start.md) guide to deploy your first VM.
