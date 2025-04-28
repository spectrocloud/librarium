---
sidebar_label: "VMware System and Permission Requirements"
title: "VMware System and Permission Requirements"
description: "Review VMware system requirements and cloud account permissions."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "self-hosted", "vmware"]
keywords: ["self-hosted", "vertex"]
---

Before installing Palette VerteX on VMware, review the following system requirements and permissions. The vSphere user
account used to deploy VerteX must have the required permissions to access the proper roles and objects in vSphere.

Start by reviewing the required action items below:

1. Create the two custom vSphere roles. Check out the [Create Required Roles](#create-required-roles) section to create
   the required roles in vSphere.

2. Review the [vSphere Permissions](#vsphere-permissions) section to ensure the created roles have the required vSphere
   privileges and permissions.

3. Create node zones and regions for your Kubernetes clusters. Refer to the [Zone Tagging](#zone-tagging) section to
   ensure that the required tags are created in vSphere to ensure proper resource allocation across fault domains.

4. If you are deploying VerteX with Red Hat Enterprise Linux (RHEL). Ensure you create a custom image containing your
   RHEL subscription credentials and the desired Kubernetes version. This image template must be uploaded to the vSphere
   `spectro-templates` folder. Instructions for creating the custom RHEL image with Kubernetes are available in the
   [RHEL and PXK](../../../byoos/image-builder/build-image-vmware/rhel-pxk.md) guide.

:::info

The permissions listed in this page are also needed for deploying a Private Cloud Gateway (PCG) and workload cluster in
vSphere through VerteX.

:::

## Create Required Roles

VerteX requires two custom roles to be created in vSphere before the installation. Refer to the
[Create a Custom Role](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html?hWord=N4IghgNiBcIE4HsIFMDOIC+Q)
guide if you need help creating a custom role in vSphere. The required custom roles are:

- A root-level role with access to higher-level vSphere objects. This role is referred to as the _Spectro root role_.
  Check out the
  [Root-Level Role Privileges](../../../clusters/data-center/vmware/permissions.md#spectro-root-role-privileges) table
  for the list of privileges required for the root-level role.

- A role with the required privileges for deploying VMs. This role is referred to as the _Spectro role_. Review the
  [Spectro Role Privileges](../../../clusters/data-center/vmware/permissions.md#spectro-role-privileges) table for the
  list of privileges required for the Spectro role.

The user account you use to deploy VerteX must have access to both roles. Each vSphere object required by VerteX must
have a
[Permission](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-4B47F690-72E7-4861-A299-9195B9C52E71.html)
entry for the respective Spectro role. The following tables list the privileges required for the each custom role.

:::info

For an in-depth explanation of vSphere authorization and permissions, check out the
[Understanding Authorization in vSphere](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-74F53189-EF41-4AC1-A78E-D25621855800.html)
resource.

:::

## vSphere Permissions

<PartialsComponent category="permissions" name="vsphere-permissions" />

## Zone Tagging

You can use tags to create node zones and regions for your Kubernetes clusters. The node zones and regions can be used
to dynamically place Kubernetes workloads and achieve higher availability. Kubernetes nodes inherit the zone and region
tags as [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Kubernetes workloads can
use the node labels to ensure that the workloads are deployed to the correct zone and region.

The following is an example of node labels that are discovered and inherited from vSphere tags. The tag values are
applied to Kubernetes nodes in vSphere.

```yaml hideClipboard
topology.kubernetes.io/region=usdc topology.kubernetes.io/zone=zone3 failure-domain.beta.kubernetes.io/region=usdc
failure-domain.beta.kubernetes.io/zone=zone3
```

:::info

To learn more about node zones and regions, refer to the
[Node Zones/Regions Topology](https://cloud-provider-vsphere.sigs.k8s.io/cloud_provider_interface.html) section of the
Cloud Provider Interface documentation.

:::

Zone tagging is required to install VerteX and is helpful for Kubernetes workloads deployed in vSphere clusters through
VerteX if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a data center and clusters are applied to the Kubernetes nodes
you deploy through VerteX into your vSphere environment. Kubernetes clusters deployed to other infrastructure providers,
such as public cloud may have other native mechanisms for auto discovery of zones.

For example, assume a vCenter environment contains three compute clusters, cluster-1, cluster-2, and cluster-3. To
support this environment you create the tag categories `k8s-region` and `k8s-zone`. The `k8s-region` is assigned to the
data center, and the `k8s-zone` tag is assigned to the compute clusters.

The following table lists the tag values for the data center and compute clusters.

| **vSphere Object** | **Assigned Name** | **Tag Category** | **Tag Value** |
| ------------------ | ----------------- | ---------------- | ------------- |
| **Datacenter**     | dc-1              | k8s-region       | region1       |
| **Cluster**        | cluster-1         | k8s-zone         | az1           |
| **Cluster**        | cluster-2         | k8s-zone         | az2           |
| **Cluster**        | cluster-3         | k8s-zone         | az3           |

Create a tag category and tag values for each data center and cluster in your environment. Use the tag categories to
create zones. Use a name that is meaningful and that complies with the tag requirements listed in the following section.

### Tag Requirements

The following requirements apply to tags:

- A valid tag must consist of alphanumeric characters.

- The tag must start and end with an alphanumeric characters.

- The regex used for tag validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`
