---
sidebar_label: "Self-Hosted Operation"
title: "Self-Hosted Operation"
description: "Learn about Palette security in a self-Hosted deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["security"]
---

# Self-Hosted Operation

In self-hosted operation, where Palette is typically deployed on-prem behind a firewall, you must ensure your
environment has security controls. Palette automatically generates security keys at installation and stores them in the
management cluster. You can import an optional certificate and private key to match the Fully Qualified Domain Name
(FQDN) management cluster. Palette supports enabling disk encryption policies for management cluster virtual machines
(VMs) if required. For information about deploying Palette in a self-hosted environment, review the
[Self-Hosted Installation](../../self-hosted-setup/palette/palette.md) guide.

In self-hosted deployments, the Open Virtualization Appliance (OVA) can operate in stand-alone mode for quick Proof of
Concept (POC) or in enterprise mode, which launches a three-node High Availability (HA) cluster as the Palette
management cluster. The management cluster provides a browser-based web interface that allows you to set up a tenant and
provision and manage tenant clusters. You can also deploy Palette to a Kubernetes cluster by using the Palette Helm
Chart. To learn more, review the
[Install Using Helm Chart](../../self-hosted-setup/palette/supported-environments/kubernetes/install/install.md) guide.

The following points apply to self-hosted deployments:

<br />

- In deployments that require a proxy internet connection, both the Private Cloud Gateway (PCG) component and the
  management agent support SOCKS5 or HTTPS proxy.

- You manage your own SSH public keys unless an agreement is in place for Spectro Cloud to maintain your environment.

- Self-hosted Palette does not connect to Palette SaaS or send telemetry or customer data back to the Palette SaaS
  platform.
