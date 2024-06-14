---
sidebar_label: "Deploy Edge Hosts On-Site"
title: "Deploy Edge Hosts On-Site"
description: "Learn how to deploy the an Edge cluster on your Edge host on-site."
hide_table_of_contents: false
tags: ["edge"]
---

After installation, the Edge host is ready to be deployed to your Edge site. The Edge host site deployment has three
stages, as described in the table.

| Phase                | Description                                                                                                                                                                                                                                                                                                                                                                                    | Required |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Apply Site User Data | As described in the [Multiple User Data Use Case](../../edgeforge-workflow/prepare-user-data.md#multiple-user-data-use-case), you can apply a secondary Edge Installer configuration user date to apply additional settings or override global values. This is optional but may be required for certain use cases. Refer to the [Apply Site User Data](site-user-data.md) guide to learn more. | No       |
| Registration         | The Edge host is registered with Palette. Refer to [Register Edge Host](edge-host-registration.md) for guidance. Once registered, the Edge host will remain available in your Palette account until it becomes part of a cluster.                                                                                                                                                              | Yes      |
| Cluster Provisioning | The Edge host boots into the specified provider Operating System (OS) and proceeds with the cluster deployment. You can find the instructions in the [Create Cluster Definition](cluster-deployment.md) resource.                                                                                                                                                                              | Yes      |
