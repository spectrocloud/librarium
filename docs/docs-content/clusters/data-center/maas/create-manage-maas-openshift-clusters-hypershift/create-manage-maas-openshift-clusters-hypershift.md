---
sidebar_label: "MAAS OpenShift Clusters with HyperShift"
title: "Create and Manage MAAS OpenShift Clusters with HyperShift"
description: "Learn how to create and manage HyperShift-hosted OpenShift clusters on MAAS in Palette."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
sidebar_position: 40
---

:::preview

:::

Palette supports creating and managing OpenShift clusters on MAAS bare-metal servers using
[HyperShift](https://hypershift-docs.netlify.app/). In this model, a HyperShift host cluster runs the OpenShift control
plane components as pods. OpenShift workload clusters are then provisioned with their worker nodes on bare-metal MAAS
hosts, while their control planes are hosted on the HyperShift host cluster.

Prior to creating OpenShift workload clusters, you must build a custom
[Red Hat Enterprise Linux CoreOS (RHCOS)](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/architecture/architecture-rhcos)
image that is compatible with MAAS deployment.

This section covers three sequential tasks that enable you to create and manage OpenShift clusters on MAAS using
HyperShift:

1. [Build and import a MAAS-compatible RHCOS image.](./build-import-rhcos-image.md)
2. [Create a HyperShift cluster to host the OpenShift control plane pods.](./create-hypershift-host-cluster.md)
3. [Create OpenShift workload clusters that use the HyperShift hosted control plane.](./create-openshift-workload-cluster.md)

## Limitations

The following limitations apply broadly to both HyperShift host clusters and OpenShift workload clusters deployed on
MAAS. Specific limitations for each cluster type are detailed in their respective sections.

- Terraform and Crossplane are not supported as deployment methods.

- Palette does not validate version compatibility between the HyperShift Operator on the host cluster and the OpenShift
  version on workload clusters. You must ensure these are compatible before deploying or upgrading. Refer to the
  [HyperShift Versioning Support](https://hypershift-docs.netlify.app/reference/versioning-support/) documentation for
  guidance.

- Federal Information Processing Standards (FIPS) support is not currently available for the
  <VersionedLink text="HyperShift Operator" url="/integrations/packs/?pack=spectro-hypershift-operator&tab=main" /> and
  <VersionedLink text="OpenShift" url="/integrations/packs/?pack=openshift&tab=main" /> packs.
