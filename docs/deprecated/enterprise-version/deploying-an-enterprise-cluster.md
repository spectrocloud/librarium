---
sidebar_label: "Install Enterprise Cluster"
title: "Install Enterprise Cluster"
description:
  "Learn how to install self-hosted Palette or convert a self-hosted single node cluster to a highly available three
  node cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["self-hosted", "enterprise"]
---

The Palette Enterprise Mode is a multi-node, highly-available installation of the Palette platform suitable for
production purposes. Installation involves instantiating the on-prem platform installer VM and invoking the "Enterprise
Cluster Migration" wizard. Please follow [these](deploying-the-platform-installer.md) steps to deploy the installer VM
and observe the [monitoring console](deploying-the-platform-installer.md#monitor-installation) to ensure installation is
successful. After a successful installation of the platform installer, proceed to enterprise cluster migration.

:::info

Deployment of an enterprise cluster is a migration process from the quick start mode. You may choose to deploy the
enterprise cluster on day 1 right after instantiating the platform installer VM, or use the system in the quick start
mode initially and at a later point invoke the enterprise cluster migration wizard to deploy the enterprise cluster. All
the data from the quick start mode is migrated to the enterprise cluster as part of this migration process.

:::

# Migrate quick start mode cluster to enterprise

1. Open the On-Prem system console from a browser window by navigating to https://&lt;VM IP Address&gt;/system and log
   in.
2. Navigate to the Enterprise Cluster Migration wizard from the menu on the left-hand side.
3. Enter the vCenter credentials to be used to launch the enterprise cluster. Provide the vCenter server, username, and
   password. Check the `Use self-signed certificates` if applicable. Validate your credentials and click on `Next`
   button to proceed to IP Pool Configuration.
4. Enter the IPs to be used for Enterprise Cluster VMs as a `Range` or a `Subnet`. At least 5 IP addresses should be
   required in the range for the installation and the ongoing management. Provide the details of the `Gateway` and the
   `Nameserver addresses`. Any search suffixes being used can be entered in the `Nameserver search suffix` box. Click on
   `Next` to proceed to Cloud Settings.
5. Select the datacenter and the folder to be used for the enterprise cluster VMs. Select the desired compute cluster,
   resource pools, datastore, and network. For high availability purposes, you may choose to distribute the three VMs
   across multiple compute clusters. If this is desired, invoke the "Add Domain" option to enter multiple sets of
   properties.
6. Add SSH Public key and optionally NTP servers and click "Confirm".
7. The Enterprise cluster deployment will proceed through the following three steps:
   - Deployment - A 3 node Kubernetes cluster is launched and Palette Platform is deployed on it. This typically takes
     10 mins.
   - Data Migration - Data from the installer VM is migrated to the newly created enterprise cluster.
   - Tenant Migration - If any tenants were created prior to the enterprise cluster migration, which would typically be
     the case if the system was used in the quick start mode initially, all those tenants, as well as the management of
     any such tenant clusters previously deployed, will be migrated to the enterprise cluster.
8. Once Enterprise Cluster is fully deployed, the On-Prem System and Management Console should be accessed on this new
   cluster. The platform installer VM can be safely powered off at this point.

<br />

## Resources

- [Palette CLI](../palette-cli/install-palette-cli.md#download-and-setup)

- [Airgap Install Instructions](air-gap-repo.md)
