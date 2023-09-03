---
sidebar_label: "MAAS"
title: "MAAS"
description: "Learn how to configure MAAS and create MAAS clusters in Palette"
hide_table_of_contents: false
tags: ["data center", "maas"]
---

Palette enables seamless integration with Canonical MAAS, allowing you to deploy and manage Kubernetes clusters directly on bare metal servers. Palette achieves this through the Private Cloud Gateway (PCG), establishing a secure connection from the internal network to the internet-accessible Palette instance and effectively bypassing NAT gateways and firewalls.


Palette also supports self-hosted deployment of Kubernetes clusters in the MAAS environment, allowing direct access to MAAS through a private network without the need for a PCG. This setup ensures network connectivity and flexibility in managing Kubernetes clusters on bare metal servers, either through a VPN or by directly accessing the Palette instance in a private network.

## Resources

- [MAAS Bare-Metal Architecture](/clusters/data-center/maas/architecture)


- [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg)


- [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-maas-cloud-accounts)


- [Create and Manage MAAS Cluster](/clusters/data-center/maas/create-manage-maas-clusters)
