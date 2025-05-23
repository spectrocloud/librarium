---
sidebar_label: "Deploy Edge Hosts On-Site"
title: "Deploy Edge Hosts On-Site"
description: "Learn how to deploy the an Edge cluster on your Edge host on-site."
hide_table_of_contents: false
tags: ["edge"]
---

After installation, the Edge host is ready to be deployed to your Edge site. The Edge host site deployment has the
following stages, as described in the table.

:::info

The steps described in the on-site deployment stage do not necessarily have to happen on-site. When site-related
parameters are predicable, it is possible to perform all of the steps in this stage before shipping the Edge host
on-site. If you decide to do so, all that the field technicians need to do to ready the Edge host for cluster deployment
is to power on the Edge host and connect it to the on-site network.

:::

| Phase                           | Description                                                                                                                                                                                                                                                                                                                                                                                    | Required                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Apply Site User Data            | As described in the [Multiple User Data Use Case](../../edgeforge-workflow/prepare-user-data.md#multiple-user-data-use-case), you can apply a secondary Edge Installer configuration user date to apply additional settings or override global values. This is optional but may be required for certain use cases. Refer to the [Apply Site User Data](site-user-data.md) guide to learn more. | No                                 |
| Initial Edge Host Configuration | When you power up the Edge host for the first time after installation, you can use the Palette Terminal User Interface (TUI) to configure settings such as host name, static IP, and an Operating System (OS) user. For more information, refer to [Initial Edge Host Configuration](./initial-setup.md)                                                                                       | No                                 |
| Registration                    | The Edge host is registered with Palette. Refer to [Register Edge Host](edge-host-registration.md) for guidance. Once registered, the Edge host will remain available in your Palette account until it becomes part of a cluster.                                                                                                                                                              | Yes for centrally managed clusters |

Once an Edge host is registered with Palette, you can then proceed to allocate the Edge host to a cluster. For more
information, refer to [Create Cluster Definition](../cluster-deployment.md).

## Resources

- [Apply Site User Data](site-user-data.md)
- [Create Edge Registration Token](./create-registration-token.md)
- [Initial Edge Host Configuration](./initial-setup.md)
- [Edge Host Registration](./edge-host-registration.md)
