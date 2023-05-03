---
title: "Packs and Profiles"
metaTitle: "Packs and Profiles"
metaDescription: "Learn about components of the Spectro VM Dashboard integrated pack"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

Palette's Virtual Machine (VM) Management solution is provided as a single pack experience that consolidates all the dependencies needed to run and manage virtual machines in your Kubernetes host cluster. Its components are described below. Two essential components of the VM Management solution are the **Spectro VM Dashboard** pack and **Spectro Proxy** pack.

<br />

- **Spectro VM Dashboard**: An add-on pack that enables access to a web console in so you can manage and monitor your VMs. The console is accessible from the **Virtual Machines** tab that appears on the cluster overview page in Palette when VM Management is enabled. It provides an easy-to-use web interface to create and manage VMs in your Kubernetes cluster. This pack is an essential component.


- **Spectro Proxy**: An add-on pack that enables the use of a reverse proxy with a Kubernetes cluster.This pack is automatically added when you use the default dashboard configuration. Check out the [Spectro Proxy](/integrations/frp) guide to learn more. 


- **KubeVirt**: An add-on pack that allows you to create virtual machines within a Kubernetes cluster using open-source KubeVirt.
<br />
<br />
KubeVirt extends Kubernetes with additional virtualization resource types using Kubernetes Custom Resource Definitions (CRD) API. KubeVirt also includes controllers and agents that provide virtual machine management capabilities on the cluster. Through KubeVirt you can use the Kubernetes API to manage virtual machine resources similar to the way you manage Kubernetes resources.  


- **KubeVirt CDI**:  An add-on pack that provides persistent storage for Kubernetes clusters. It enables Persistent Volume Claims (PVCs) to be used as disks for KubeVirt VMs.


- **Volume Snapshot Controller**: A Kubernetes plug-in that watches VolumeSnapshot CRD objects and manages the creation and deletion of volume snapshots. A snapshot represents a point-in-time copy of a volume.


- **Multus CNI**: A CNI plugin that enables multiple network interfaces to attach to Kubernetes pods. In this context, it is used to attach VM networks to the launched VM.


Administrators can configure out-of-the-box add-on packs, cluster profiles, and virtual machine templates that include commonly used operating systems, or they can define their own VM templates to share with users.

# Next Steps

When you receive credentials and a URL from Spectro Cloud, register the Spectro VM Dashboard pack in your Palette environment. Follow steps in [Configure a Custom Pack Registry](https://docs.spectrocloud.com/registries-and-packs/adding-a-custom-registry#configureacustompackregistryonthepaletteconsole) and provide the URL as the endpoint.


<br />

<br />

<br />

<br />
