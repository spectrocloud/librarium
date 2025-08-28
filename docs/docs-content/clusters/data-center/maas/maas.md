---
sidebar_label: "MAAS"
title: "MAAS"
description: "Learn how to configure MAAS and create MAAS clusters in Palette"
hide_table_of_contents: false
tags: ["data center", "maas"]
---

Palette enables seamless integration with Canonical MAAS, allowing you to deploy and manage Kubernetes clusters directly
on bare metal servers or on LXD virtual machines. Palette achieves this through the Private Cloud Gateway (PCG),
establishing a secure connection from the internal network to the internet-accessible Palette instance and effectively
bypassing NAT gateways and firewalls.

Palette also supports self-hosted deployment of Kubernetes clusters in the MAAS environment, allowing direct access to
MAAS through a private network without the need for a PCG. This setup ensures network connectivity and flexibility in
managing Kubernetes clusters on bare metal servers, either through a VPN or by directly accessing the Palette instance
in a private network.

## Resources

- [MAAS Bare-Metal Architecture](architecture.md)

- [Register and Manage MAAS Cloud Accounts](register-manage-maas-cloud-accounts.md)

- [Create and Manage MAAS Cluster](create-manage-maas-clusters.md)
