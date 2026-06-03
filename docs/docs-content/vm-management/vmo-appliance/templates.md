---
sidebar_label: "Create Your First Template"
title: "Create Your First Template"
description: "Learn how to create and manage templates in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "vm launchpad", "templates"]
---

<!-- vale off -->

VM templates are reusable VM specifications that define a base image, compute, network, storage, and hardware settings.
Create VMs from templates to ensure consistency and speed up provisioning.


## Create Your First Template

1. Navigate to **Workloads** > **Templates**.

2. Select **Create Template**.

3. The VM creation wizard opens in template mode. Complete the following steps:

   - **Source**: Select the source DataVolume and namespace. Set the template name, display name, description, and guest
     OS.

   - **Compute**: Select an instance type or configure custom CPU and memory values.

   - **Storage**: Configure the root disk size, StorageClass, and boot order.

   - **Network**: Configure interfaces and NADs.

   - **Hardware**: Configure firmware, devices, and features.

   - **Lifecycle**: Configure an optional snapshot policy that is stored as a template annotation.

   - **Review**: Verify the settings and create the template.

4. Select **Create Template**. Launchpad saves the template as a `VmTemplate` custom resource.


## Next Steps

Create a [VM](./virtual-machines/creating.md) from your template, or create another [golden image](./golden-images.md)
to use as a template source.
