---
sidebar_label: "Controller Mode"
title: "Controller Mode"
description: "Learn about the controller deployment mode and its use cases."
hide_table_of_contents: false
sidebar_position: 30
tags: ["CAPI"]
---

Controller mode uses the Palette management plane and the [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) project
to provision and manage clusters along with their underlying infrastructure resources in the specified target
environment. CAPI is a Kubernetes sub-project focused on providing declarative APIs and tooling to automate cluster
lifecycle management for platform operations.

To create a cluster, you must provide Palette with the required permissions and credentials, and then request that
Palette create the cluster. The following steps briefly describe what happens after the cluster creation request.

1. The Palette management plane creates the CAPI Custom Resource Definitions (CRDs) for the target cloud.

2. CAPI then uses the CRDs to provision the first control plane node on the target environment.

3. Next, the Palette management plane installs a Palette agent on the node and performs a pivot of CAPI resources,
   transferring management responsibilities to the workload cluster.

4. The workload cluster then creates the remaining control plane and worker nodes.

<!-- prettier-ignore -->
5. Finally, the Palette agent installs the cluster's add-ons as specified in the cluster profile. This includes
   downloading images for the Operating System (OS), Kubernetes, network and storage plugins, and applications. You also
   have the option to customize the OS image and use it with the
   <VersionedLink text="BYOS pack" url="/integrations/packs/?pack=generic-byoi"/> in the cluster profile.

The diagram below illustrates the controller mode cluster provisioning workflow.

![Controller Mode diagram](/deployment-modes_controller-diagram.webp)

For more details, refer to [Order of Operations](../architecture/orchestration-spectrocloud.md)

## Use Cases

You can deploy clusters in controller mode across a range of environments to meet your operational requirements. The
table below provides an overview of the different use cases and the corresponding supported environments for controller
mode deployments.

| Use Case         | Supported Environments                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public Cloud** | [AWS](../clusters/public-cloud/aws/aws.md)<br />[Azure](../clusters/public-cloud/azure/azure.md)<br />[GCP](../clusters/public-cloud/gcp/gcp.md)                                |
| **Data Center**  | [VMware vSphere](../clusters/data-center/vmware/vmware.md) <br /> [Nutanix](../clusters/data-center/nutanix/nutanix.md) <br />[Openstack](../clusters/data-center/openstack.md) |
| **Bare Metal**   | [MAAS](../clusters/data-center/maas/maas.md)                                                                                                                                    |

## Resources

- [Architecture Overview](../architecture/architecture-overview.md)

- [Order of Operations](../architecture/orchestration-spectrocloud.md)

- [Getting Started](../getting-started/getting-started.md)
