---
sidebar_label: "Virtual Machine Orchestrator Pack"
title: "Virtual Machine Orchestrator Pack"
description: "Learn about components of the Virtual Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
tags: ["vmo"]
---

The **Virtual Machine Orchestrator** pack provides a single-pack experience that consolidates all the dependencies needed to deploy and manage VMs in your Kubernetes host cluster. You use **Virtual Machine Orchestrator** pack to create a VMO cluster profile. The pack's components are described below. All the components are enabled by default in the `charts:` section of the pack YAML configuration file. 

<br />

- **Spectro VM Dashboard**: An add-on pack that enables access to a web console so you can manage and monitor your VMs. The console is accessible from the **Virtual Machines** tab that appears on the cluster overview page in Palette when VM Management is enabled. The dashboard provides a web interface to create and manage VMs in your Kubernetes cluster. To learn more about the web console, refer to [Spectro VM Dashboard](/vm-management/vm-packs-profiles/vm-dashboard).


- **Spectro Proxy**: An add-on pack that enables the use of a reverse proxy with a Kubernetes cluster. This pack is automatically added when you use the default dashboard configuration. Check out the [Spectro Proxy](/integrations/frp) guide to learn more. 


- **KubeVirt**: An add-on pack that allows you to create VMs within a Kubernetes cluster using open-source KubeVirt. KubeVirt provides feature gates you can enable in the Spectro VM Dashboard manifest. To learn which feature gates Palette enables by default and how you can enable additonal feature gates, check out the [Feature Gates](/vm-management#featuregates) section.

    KubeVirt extends Kubernetes with additional virtualization resource types using Kubernetes Custom Resource Definitions (CRD) API. KubeVirt also includes controllers and agents that provide VM management capabilities on the cluster. Through KubeVirt you can use the Kubernetes API to manage VM resources similar to the way you manage Kubernetes resources.     


- **KubeVirt CDI**: An add-on pack that provides persistent storage for Kubernetes clusters. It enables Persistent Volume Claims (PVCs) to be used as disks for KubeVirt VMs.


- **Volume Snapshot Controller**: A Kubernetes plug-in that watches VolumeSnapshot CRD objects and manages the creation and deletion of volume snapshots. A snapshot represents a point-in-time copy of a volume.


- **Multus CNI**: A Controller Network Interface (CNI) plugin that enables multiple network interfaces to attach to Kubernetes pods. In this context, it is used to attach VM networks to the launched VM.


:::info

The **Spectro Proxy** pack enables the use of a reverse proxy with a Kubernetes cluster and is automatically installed when you create the cluster with the default **Proxied** setting for **Access** during cluster profile creation. Check out the [Spectro Proxy](/integrations/frp) pack documentation to learn more. 

:::


Administrators can configure the out-of-the-box add-on packs, cluster profiles, and VM templates that include commonly used operating systems, or they can define their own VM templates to share with users.


## Resources

- [Spectro VM Dashboard](/vm-management/vm-packs-profiles/vm-dashboard)


- [Spectro Proxy](/integrations/frp)


- [Feature Gates](/vm-management#featuregates)

