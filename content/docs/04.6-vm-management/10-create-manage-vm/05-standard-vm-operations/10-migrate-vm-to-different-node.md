---
title: "Migrate a VM"
metaTitle: "Migrate a VM to a Different Node"
metaDescription: "Learn how to migrate a VM from node to node using Palette."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Palette supports seamless virtual machine (VM) migration to another physical host in the cluster. This is known as *live migration*. During live migration, the VM and its memory, storage, and CPU resources are moved from one cluster compute node to another without any noticeable downtime. 

Successful live migrations rely on appropriately configured storage and networking, and live migration must be enabled as a feature gate. Live migration is enabled by default in the ``feature-gates`` section of the KubeVirt configuration file that is part of the Spectro VM Dashboard pack. For more information, review the [Feature Gates](/vm-management#featuregates) section.

Live migration is used with rolling Kubernetes upgrades and workload balancing. To avoid interrupting a VM when a node is placed into maintenance or upgraded, all VM instances require a ``LiveMigrate`` eviction strategy. By default, the ``spec.template.spec.evictionStrategy`` parameter is set to ``LiveMigrate`` in the KubeVirt configuration file. 


# Prerequisites

- Live migration must be enabled as a feature gate. Keep this default in the KubeVirt configuration file.


- All VM instances must have an eviction strategy set as `evictionStrategy: LiveMigrate` to ensure that a VM is not interrupted if the node is placed into maintenance. This is configured automatically in the KubeVirt configuration file. If needed, you can override the default setting by configuring `spec.template.spec.evictionStrategy`.


- VMs that use Persistent Volumes must have shared ``ReadWriteMany`` (``RWX``) access mode. For more information, refer to the [Persistent Volume Access Modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) Kubernetes resource. VMs that do not use persistent storage, such as containerDisks, do not require modifications for live migration.


- A VM’s pod network cannot use a Bridge interface. Disable the default Bridge interface on the pod network. However, other interfaces such as those that Multus grants, may use a bridge interface for live migration.


# Migrate VM to a Different Node

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, choose **Clusters** and click on your cluster. 


3. Click the **Virtual Machines** tab.


4. Select the VM to migrate and use either the **three-dot Menu** or the **Actions drop-down Menu**, and click **Migrate Node to Node**.  

<br />


## Validation

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, click **Clusters** and select the cluster. 


3. Navigate to  the **Virtual Machines** tab, and click the VM you migrated. 


4. Click the **Details** tab, and verify that the name and IP address of the new node is changed.


# Maintain a Node

Compute nodes can be placed into maintenance mode using the `cordon` and `drain` commands. These commands mark the node as un-schedulable and drains all the virtual machines and pods from it. This process is useful in case you need to perform hardware maintenance on the node such as replace a disk or network interface card (NIC) card, perform memory maintenance, or if there are any issues with a particular node that need to be resolved. 

If you need to perform a manual migration to change a disk or network interface card (NIC), perform memory maintenance, or if there is an issue with the node that needs to be resolved, you can override the default `evictionStrategy: LiveMigrate` parameter setting.


## Prerequisites

- For seamless migration when the host is put in maintenance mode, ensure `LiveMigrate` is set as the eviction strategy for all concerned VMs.  


## Manually Migrate the VM

<br />

1. ?? Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. ?? From the left **Main Menu**, choose **Clusters** and click on your cluster. 


3. ?? Click the **Virtual Machines** tab.


4. ?? Select the VM to migrate and use either the **three-dot Menu** or the **Actions drop-down Menu**, and click **Open Console**. 

2. Log in to the VM from a terminal window.


3. Issue the following command to mark the node as *un-schedulable*. This alerts the Kubernetes scheduler not to schedule any new pods on that node, but allows existing pods running on the node to continue to run.
    
    ```bash
    kubectl cordon <node-name>
    ``` 
    <br />
    
    **node-name**: The name of the node that should be marked as *un-schedulable*.


4. Issue the following command to gracefully remove all pods from the node that is undergoing maintenance. When you drain a node, all pods and VMs will be safely evicted from the node.

    ```bash
    kubectl drain <node-name>
    
    ```
    <br />

    **node-name**: The name of the node that you wish to drain.
    
    <br />
    
    <InfoBox>

    The kubectl `drain` command should only be issued to a single node at a time.

    </InfoBox>


## Validation


1. Using kubectl, log in to a machine that has access to the kubernetes cluster. 


2. Issue the following command to verify the pods are rescheduled on a different node by verifying the name and IP address of the new node changed.

    
    ```bash
    kubectl get pods -o wide
    ```


# Resources

[Persistent Volume Access Modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)


<br />


<br />


<br />


<br />

