---
title: "Packs and Profiles"
metaTitle: "Packs and Profiles"
metaDescription: "Learn how to "
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

Palette's Virtual Machine (VM) Management solution consolidates all the dependencies needed to run and manage virtual machines in your Kubernetes host cluster into the Spectro VM Dashboard single pack.

 ... includes the following components that are required to run and manage Virtual Machines (VMs) in your Kubernetes host cluster. The Spectro VM Dashboard pack dependencies are consolidated in a single pack for your convenience. 

Administrators can configure out-of-the-box add-on packs, cluster profiles, and virtual machine templates that include commonly used operating systems, or they can define their own VM templates to share with users. 

<br />

- **Spectro VM Dashboard**: An add-on pack that enables access to a web console so you can manage and monitor your VMs. It provides an easy-to-use web interface to create and manage VMs in your Kubernetes cluster, which Palette manages.


- **Spectro Proxy**: An add-on pack that enables the use of a reverse proxy with a Kubernetes cluster. You will need to configure the Spectro Proxy for remote access to the cluster.

 <br />

- **KubeVirt**: A VM management add-on pack for Kubernetes clusters that allows you to create VMs. KubeVirt is an open-source project that allows you to create virtual machines within a Kubernetes cluster.


- **KubeVirt CDI**:  An add-on pack for Kubernetes that provides persistent storage. It is a data import service for Kubernetes designed to improve improves the workflow for managing KubeVirt and its storage. It enables Persistent Volume Claims (PVCs) to be used as disks for KubeVirt VMs.
<br />
<br />
KubeVirt extends Kubernetes with additional virtualization resource types using Kubernetes Custom Resource Definitions (CRD) API. KubeVirt also includes controllers and agents that provide virtual machine management capabilities on the cluster. Through KubeVirt you can use the Kubernetes API to manage virtual machine resources similar to the way you manage Kubernetes resources. 
management. 


- **Volume Snapshot Controller**: many storage systems provide the ability to create a "snapshot" of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore the existing volume to a previous state (represented by the snapshot). The volume snapshot controller is responsible for watching the VolumeSnapshot CRD objects and manages the creation and deletion lifecycle of snapshots.


- **Multus CNI**: a CNI plugin that enables multiple network interfaces to attach to pods within Kubernetes.


# KubeVirt Feature Gates

KubeVirt has a set of features that are not enabled by default. The features are protected by a Kubernetes concept called feature gates, which are key-value pairs that describe Kubernetes features.

For example live migration and the use of HostDisk for virtual machine disk images are disabled. 

Feature gates can be enabled directly in the Spectro VM Dashboard pack by editing the `kubevirt.kubevirtResource.additionalFeatureGates` parameter in the kubevirt manifest.

Palette VM Management enables these feature gates by default:

- LiveMigration
- Snapshot
- HotplugVolumes
- DataVolumes






MOVE TO CREATE VM:
and can import virtual machines from their VMware vSphere environment into Palette.
