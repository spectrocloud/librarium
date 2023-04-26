---
title: "Dashboard Pack and Profile"
metaTitle: "Dashboard Pack and Profile"
metaDescription: "Components of the Spectro VM Dashboard integrated pack."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

Palette Virtual Machine (VM) Management provides a single-pack experience that consolidates all the dependencies needed to run and manage virtual machines in your Kubernetes host cluster. 

The components of the pack are described below. Two essential components are the **Spectro VM Dashboard** pack and **Spectro Proxy** pack. When you create the cluster profile, you only need to add the **Spectro VM Dashboard** pack.

<br />

- **Spectro VM Dashboard**: An add-on pack that enables access to a web console so you can manage and monitor your VMs. The console is accessible from the **Virtual Machines** tab that appears on the cluster overview page in Palette when VM Management is enabled. It provides an easy-to-use web interface to create and manage VMs in your Kubernetes cluster. To learn more about the web console, refer to [Spectro VM Dashboard](/vm-management/vm-packs-profiles/vm-dashboard).


- **Spectro Proxy**: An add-on pack that enables the use of a reverse proxy with a Kubernetes cluster. This pack is automatically added when you use the default dashboard configuration. Check out the [Spectro Proxy](/integrations/frp) guide to learn more. 


- **KubeVirt**: An add-on pack that allows you to create virtual machines within a Kubernetes cluster using open-source KubeVirt. KubeVirt offers feature gates you can enable in the Spectro VM Dashboard manifest. To learn more, refer to [Feature Gates](/vm-management#featuregates).

 KubeVirt provides the ``virtctl`` tool, which we recommend downloading and connecting to your VM to facilitate copying and pasting into the virtual console. For instructions, refer to [Set Up virtctl]().   


- **KubeVirt CDI**: An add-on pack that provides persistent storage for Kubernetes clusters. It enables Persistent Volume Claims (PVCs) to be used as disks for KubeVirt VMs.


- **Volume Snapshot Controller**: A Kubernetes plug-in that watches VolumeSnapshot CRD objects and manages the creation and deletion of volume snapshots. A snapshot represents a point-in-time copy of a volume.


- **Multus CNI**: A Controller Network Interface (CNI) plugin that enables multiple network interfaces to attach to Kubernetes pods. In this context, it is used to attach VM networks to the launched VM.


Administrators can configure out-of-the-box add-on packs, cluster profiles, and virtual machine templates that include commonly used operating systems, or they can define their own VM templates to share with users.



<br />

<br />

<br />

<br />
