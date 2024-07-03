---
sidebar_label: "Deployment Lifecycle"
title: "Edge Deployment Lifecycle"
description: "Learn about the Edge Deployment Lifecycle"
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

The typical end-to-end lifecycle of deploying clusters at edge locations involves several distinct phases in which
different organizations or teams need to perform specific tasks.

![A flow of the lifecycle, starting with model, staging, install, and finally register. Once all phases are complete the cluster provision occurs.](/native-edge-deployment-lifecycle.webp)

- **Modeling** - App owners build and test the applications in test environments and model application profiles in
  Palette for a cluster installation.

- **Staging** - IT/Ops teams prepare an Edge host installer variant from Palette's base installer. In this phase,
  available customizations that are common to all edge locations are applied to the base installer. This includes
  specifying or overriding properties such as Palette endpoints, app URL for QR code-based registration, default OS
  users, and default network settings. The installer variant is then exported to all the site locations.

- **Installation** - Site operators provision one or more Edge hosts at edge locations using the image prepared in the
  staging phase. In this phase, the site operator applies site-specific properties such as static IP address, network
  proxy, and certificate.

- **Registration** - Edge hosts need to be registered with Palette or through registration tokens. Each cluster requires
  a cluster profile. Clusters are configured with infrastructure and add-on profiles that application architects applied
  in the modeling phase.

IT Ops teams can perform this step in two different ways:

- Deploy an application without having to manage a server to automate edge device registration. We provide a sample
  application you can customize to fit your needs.

- Register Edge hosts and configure clusters using the Palette UI, API or Terraform.

The Palette Edge Management agent inside the Edge host waits for the configuration to be available in Palette. Once
registration and configuration are complete, the agent installs the Kubernetes cluster. The agent reads the Kubernetes
distribution, version, and configuration properties from the cluster profile. Additional add-ons, if any, are deployed
after the Kubernetes installation. You can install a single or multi-node cluster using this process. You can scale up
your cluster at a later time after deployment.

If the edge location configuration is known and predictable, then the IT/Ops team can combine staging, installation, and
registration into one step and ship the fully configured Edge hosts to the edge location. The site operator at the edge
location only needs to hook up the power and network cables without further device configuration. The Edge cluster will
be ready to be centrally managed for future upgrades.

## Next Steps

Now that you have an understanding of the deployment lifecycle, start the deployment of your Edge host by reviewing the
[Site Deployment](site-deployment/site-deployment.md) instructions.
