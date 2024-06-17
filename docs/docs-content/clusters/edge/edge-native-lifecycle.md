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

## Connected Clusters

A connected cluster is a cluster that is managed by a Palette instance. The Palette instance could be the public Palette
SaaS or a self-hosted instance. The following diagram represents the deployment lifecycle of a connected cluster.

![A flow of the lifecycle for connected clusters: modeling, EdgeForge, installation, on-site deployment, cluster formation, and cluster management. ](/native-edge-deployment-lifecycle.webp)

1. **Modeling**. App owners build and test the applications in test environments and model application profiles in
   Palette for a cluster installation. For more information, refer to
   [Model Cluster Profile](./site-deployment/model-profile.md).

2. **EdgeForge**. IT/Ops teams prepare an Edge host installer variant from Palette's base installer. In this phase,
   available customizations that are common to all edge locations are applied to the base installer. This includes
   specifying or overriding properties such as Palette endpoints, registration tokens, default OS users, and default
   network settings. For more information, refer to [EdgeForge Workflow](./edgeforge-workflow/edgeforge-workflow.md).

3. **Installation**. IT/Ops use the installer prepared in the EdgeForge phase and installs Palette Edge onto the Edge
   hosts. The Edge hosts are then shipped to edge sites. For more information, refer to
   [Installation](./site-deployment/site-installation/site-installation.md).

4. **On-site Deployment**. Edge hosts need to be registered with Palette. In this phase, the site operator powers on the
   Edge host, which will boot to registration. The site operator also applies site-specific properties such as static IP
   address, network proxy, and SSL certificates with site user data or Palette Terminal User Interface (TUI). For more
   information, refer to [Edge Host Registration](./site-deployment/site-installation/edge-host-registration.md).

5. **Cluster formation**. One an Edge host is registered with Palette, the Edge host can be used to form a new cluster
   or be added to an existing cluster. Each cluster uses a cluster profile modeled in the **Modeling** stage. For more
   information, refer to [Cluster Definition](./site-deployment/site-installation/cluster-deployment.md).

6. **Cluster management**. In this phase, the IT/Ops team performs maintenance and update activities on your active
   clusters. Using versioned cluster profiles, Palette allows you to centrally managed all your Edge clusters and
   perform rolling upgrades with zero downtime. For more information about cluster upgrades, refer to
   [Update a Cluster](../cluster-management/cluster-updates.md).

If the edge location configuration is known and predictable, then the IT/Ops team can combine EdgeForge, installation,
and registration into one step and ship the fully configured Edge hosts to the edge location. The site operator at the
edge location only needs to hook up the power and network cables without further device configuration. The Edge host
will be ready to be centrally managed for cluster formation.

## Air-gapped Clusters

An air-gapped cluster is a cluster that does not have a connection to a Palette instance. The deployment lifecycle for
air-gapped Edge hosts is slightly different from connected Edge hosts. Since there is no Palette instance and each Edge
host is managed locally, there is no Edge host registration during the on-site deployment phase.

In addition, you need to provide the images that are required for deployment to the Edge host through a content bundle
or through an external registry. After a cluster is formed, you manage the cluster locally with local UI instead of
using through a Palette instance.

![A flow of the lifecycle for air-gapped clusters: modeling, EdgeForge, installation, on-site deployment, cluster formation, and cluster management. ](/native-edge-deployment-lifecycle-airgap.webp)

The following are the phases of the deployment lifecycle of air-gapped Edge hosts:

1. **Modeling**. App owners build and test the applications in test environments and model application profiles in
   Palette for a cluster installation.

2. **EdgeForge**. IT/Ops teams build the Palette Edge Installer and the provider images, which contain the OS and
   Kubernetes layer of their cluster. Through the installer user data configuration, IT/Ops teams can configure the Edge
   host to download images from a private external registry. For more information, refer to
   [Deploy Cluster with Private External Registry](./site-deployment/deploy-custom-registries/deploy-external-registry.md).

   The IT/Ops teams can also create a content bundle containing all the necessary assets needed to provision their
   cluster and a cluster definition that reflects the cluster profile designed in the **Modeling** stage. Both the
   content bundle and the cluster definition can be included in the installer. The installer is then exported to all the
   site locations. For more information, refer to [Build Content Bundle](./edgeforge-workflow/build-content-bundle.md)
   and [Export Cluster Definition](./local-ui/cluster-management/export-cluster-definition.md).

3. **Installation**. IT/Ops use the installer prepared in the EdgeForge phase and installs Palette Edge onto the Edge
   hosts. The Edge hosts are then shipped to edge sites.

4. **On-site deployment**. Air-gapped Edge hosts do not have a connection to Palette and therefore does not require
   registration. Site operator powers on the Edge host, which will boot up and serve the local UI and the Edge
   Management API instead of to the registration screen. The site operator also applies site-specific properties such as
   static IP address, network proxy, and SSL certificates with site user data or Palette Terminal User Interface (TUI).
   For more information, refer to [Access Local UI](./local-ui/host-management/access-console.md).

5. **Cluster formation**. If the Edge host is installed with a content bundle and cluster definition, the site operator
   can power on the Edge host and create a cluster using the local UI. For more information, refer to
   [Create a Cluster with Local UI](./local-ui/cluster-management/create-cluster.md).

   If the Edge host is missing either the content bundle or the cluster definition, you can still build a content bundle
   or export the cluster definition and upload them to the Edge host through the local UI. For more information, refer
   to [Upload Content Bundle](./local-ui/cluster-management/upload-content-bundle.md). If the Edge host is configured to
   pull images from a private external registry, then cluster formation does not require a content bundle, but it will
   still require a cluster definition. For more information about using

6. **Cluster management**. In this phase, the IT/Ops teams perform maintenance and update activities on your active
   clusters. Using the local Harbor registry, you can provide images that can be used to upgrade your cluster. For more
   information, refer to [Enable Local Harbor Registry](./site-deployment/deploy-custom-registries/local-registry.md).

## Next Steps

Now that you have an understanding of the deployment lifecycle, start the deployment of your Edge host by modeling a
cluster profile for your Edge cluster to use and start building the required Edge artifacts for deployment.

- [Model Cluster Profile](./site-deployment/model-profile.md).
- [EdgeForge](./edgeforge-workflow/)
