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


- **Spectro Proxy**: An add-on pack that enables the use of a reverse proxy with a Kubernetes cluster.

 <br />

- **KubeVirt**: A VM management add-on pack for Kubernetes clusters that allows you to create VMs. KubeVirt is an open-source project that allows you to create virtual machines within a Kubernetes cluster.


- **KubeVirt CDI**: An add-on pack for Kubernetes that provides persistent storage
management. It is a data import service for Kubernetes designed with KubeVirt in mind which  to improve improves the workflow for of managing KubeVirt and its storage. It provides for example facilities for enabling Persistent Volume Claims (PVCs) to be used as disks for KubeVirt VMs.

Palette uses KubeVirt to manage virtual machines in Kubernetes clusters. KubeVirt enables virtual machine workloads to run on top of Kubernetes in a Kubernetes-native way. 

KubeVirt extends Kubernetes with additional virtualization resource types using Kubernetes Custom Resource Definitions (CRD) API. KubeVirt also includes controllers and agents that provide virtual machine management capabilities on the cluster. Through KubeVirt you can use the Kubernetes API to manage virtual machine resources similar to the way you manage Kubernetes resources.


- **Volume Snapshot Controller**: many storage systems provide the ability to create a "snapshot" of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore the existing volume to a previous state (represented by the snapshot). The volume snapshot controller is responsible for watching the VolumeSnapshot CRD objects and manages the creation and deletion lifecycle of snapshots.


- **Multus CNI**: a CNI plugin that enables multiple network interfaces to attach to pods within Kubernetes.


# Feature Gates

Feature gates are a set of key-value pairs that toggle Kubernetes features. Some KubeVirt functionalities are disabled by default and must be enabled via feature gates. For example live migration and the use of HostDisk for virtual machine disk images are disabled. Enabling KubeVirt feature gates can be done by altering an existing KubeVirt custom resource and specifying the list of features to enable.

This can be done directly in the add-on pack.

# Remote Access to Cluster

You will need to configure the Spectro Proxy for remote access to the cluster.






MOVE TO CREATE VM:
and can import virtual machines from their VMware vSphere environment into Palette.
