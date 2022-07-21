---
title: "Native Edge"
metaTitle: "Creating new clusters on native edge device"
metaDescription: "The methods of creating clusters for a speedy deployment native edge device"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

Palette extends the native containerized application orchestration capabilities to host Native Edge Deployment. The Palette Native Edge solution can run natively on bare metal machines or virtual appliances. The users can choose the machine or appliance based on their intended. It is built upon a highly immutable P6OS with embedded K8s distro, a stable base Operating System and Palette's edge agent. In addition, Palette provides several versions of P6OS with different combinations of base Operating System and Kubernetes distributions.

# Prerequisites

* Two choices of running a Native Edge Deployment:
  * Choice 1: Bare metal box with at least 2 GB of RAM
  * Choice 2: Laptops with virtual machine management software: Install the Virtual Box if you are using x86-based laptops or UTM on M1-based Mac.


* A Palette Account [sign up](https://spectrocloud.com/free-trial)


* Make a choice of P6OS as per user requirement. The flavors are made available from the combination of the following components:
  * Pick your flavor of base Operating System with versions (CentOS, Ubuntu, etc..)
  * Pick your flavor of Kubernetes with version (CNCF, RKE or K3s)


* Download and save the ISO file for later usage (Contact Sale for file).


# Deploy your Edge Native Machine

The following steps need to be followed to set up your Edge Native Machine:

1. Create a new Linux-flavored Virtual Machine using Virtual Box (or UTM) with the following configuration:

   * Minimum memory of VM: 2 GB
   * In the networking section, make sure you specify bridging to the host network adapter for Internet from within the VM for booting.


2. Specify to boot from the **Optical Drive** (Virtual Box) or boot from the **ISO image** (UTM) as the primary boot device.


3. In the boot image, point to the ISO file you previously downloaded. 


4. Initiate the boot process and wait for it to finish.


5. After the boot process finishes, the VM will shut down automatically.


6. Go into Settings to mark the hard disk as the primary boot device.


7. Boot up the VM and wait for it to finish. When the VM finishes booting, a QR Code with **Edge-host ID** will be displayed.


8. Once VM finishes booting, the user can progress in two ways:

   * Follow the Palette UI.
   * Progress by scanning the QR Code.


## Cluster Import - Palette UI

For the users who choose to pursue the Palette UI for cluster Import method, the follow these steps:

1. Log in to Palette Management Console as Tenant Admin.


2. Select **Clusters** on the left-hand menu and then click the **Appliance** tab.


3. Click the **Add an appliance** button.


4. Enter the exact **Edge-host ID** in the **Appliance ID** field on Palette.


5. At this point, open another browser tab and log in to the Palette.


6. Select **Clusters** on the left-hand menu and click **Add a New cluster**.


7. Select **Import Cluster**.


8. Import a **Generic cluster** with **Full permission mode**.


9. Click **Create cluster**.


10. Make sure to copy the **cluster id**.


11. Switch to the first browser and provide the **cluster id** in the following format to the tag fields of **Add Appliance** wizard.

  | **ADD Appliance** | **Wizard**               |
  | ----------------- | ------------------------ |
  | **Format:**       | cluster:id               |
  | **Example:**      | cluster:12fd688jg5hg9iuy |



12. Confirm the values provided for **Appliance IDs** and **Tag** and complete the VM appliance registration with the Palette.


13. The appliance will change its state to *In-Use*.

  **Note:** To view the registered appliance toggle the **In-use** appliance button.


14. After a few minutes, the cluster import will be finished in the other browser.


15. Your Edge Native cluster is ready.

    **Note:** The steps above are based on the intention of using a virtual machine as an Edge Native appliance. However, if you have access to a bare metal box that can be re-flashed, the steps will work by booting the ISO image (ignore the VM setup part).

## Cluster Import through QR Code Scan


# Troubleshooting

If your cluster/Edge Native VM does not show up, follow the steps below.

1. Check the network connectivity, because your virtual appliance or bare metal box needs to reach Palette. For VM case, ensure there is Internet connectivity by setting up the host adapter properly.


2. Once Palette6OS is set up, you may log in to the console using **p6os/spectro** to check out different processes. The following commands can be useful:
   
   * systemctl status p6os # to check OS service
   * tail -f /var/log/p6os-edge-apply # show logs
   * tail -f /opt/spectrocloud/edge.log # show logs











  


    




