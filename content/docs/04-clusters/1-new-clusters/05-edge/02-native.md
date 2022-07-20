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

Palette extends the native containerized application orchestration capabilities to host Native Edge Deployment. The Palette Native Edge solution can run natively on bare metal machines or virtual appliances. The users can make the choice of the machine or appliance based on their intend. It is built upon a highly immutable P6OS with embedded K8s distro, a stable base Operating System and Palette’s edge agent. Palette provides several versions of P6OS with different combinations of base Operating System and Kubernetes distributions. 

# Prerequisites

* Two choices of running a Native Edge Deployment:
  * Choice 1: Bare metal box with at least 2GB of RAM
  * Choice 2: Laptops with virtual machine management software: Install the Virtual Box if you are using x86-based laptops or UTM on M1-based Mac.

* A Palette Account [sign up](https://spectrocloud.com/free-trial)


* Make a choice of P6OS as per user requirement. The flavors are made available from the combination of the following components:
  * Pick your flavor of base Operating System with versions (CentOS, Ubuntu, etc..)
  * Pick your flavor of Kubernetes with version (CNCF, RKE or K3s)


* Download and save the ISO file for later usage (Contact Sale for file).


# Deploy your Edge Native Machine

The follow steps needs to be followed to setup your Edge Native Machine:

1. Create a new Linux flavoured Virtual Machine using Virtual Box (or UTM) with the following configuration:
  * Minimum memory of VM:  2GB
  * In the networking section, make sure you specify bridging to the host network adapter for Internet from within the VM for booting.


2. Specify to boot from **Optical Drive** (Virtual Box) or boot from **ISO image** (UTM) as the primary boot device.


3. In the boot image, point to the ISO file you downloaded previously. Initiate the boot process and wait for it to finish.


4. Initiate the boot process and wait for it to finish.


5. After the boot process finishes, the VM will shut down automatically.


6. Go into settings to mark hard disk as primary boot device.


7. Boot up the VM and wait for it to finish. When the VM finishes booting, a QR Code with **Edge-host ID** will be displayed.


8. Once VM finishes booting, the user can progress in two ways:

  * Follow the Palette UI
  * Progress by scanning the QR Code


## Cluster Import - Palette UI

For the users who choose to follow Palette UI for cluster Import the following steps can be followed:

1. Login to Palette as Tenant Admin


2. Click Clusters on the left-hand menu. Click the Appliance tab


3. Click “Add an appliance”


4. Enter the exact **Edge-host ID** in the Appliance ID field on Palette


5. At this point, open another browser tab and login to the Palette


6. Click Clusters on the left hand menu. Click **Add a New cluster**


7. Select **Import Cluster**


8. Import a `Generic cluster` with `Full permission mode`.


9. Click **Create cluster**


10. Make sure to copy the **cluster id**


11. Switch to the first browser and provide the **cluster id** in the following format to the tag fields of `Add Appliance` wizard.

|ADD Appliance| Wizard      |	
|------------|--------------|   
|**Format:** |cluster:id  |
|**Example:**|cluster:12fd688jg5hg9iuy|



12. Confirm the values provided for `Appliance IDs` and `Tag' and complete the VM appliance registration with the Palette.


13. The appliance will change its state to “In-Use”.

  **Note:** To view the registered appliance toggle the **In-use** appliance botton.


14. After a few minutes, the cluster import will be finished in the other browser.


15. Your Edge Native cluster is ready.

  **Note:** The aforementioned steps is based on the intention of using a virtual machine as an Edge Native appliance. However if you have access to a bare metal box that can be re-flashed, the steps will work by booting the ISO image (simply ignore the VM setup part).

## Cluster Import through QR Code Scan



# Troubleshooting

If your cluster / Edge Native VM does not show up:

1. Check network connectivity because your virtual appliance or bare metal box needs to reach Palette. For VM case, ensure there is Internet connectivity by setting up the host adapter properly. 


2. Once P6OS is set up, one may login to the console using **p6os / spectro** to check out different processes. The following commands can be useful:
   * systemctl status p6os # to check os service
   * tail -f /var/log/p6os-edge-apply # show logs
   * tail -f /opt/spectrocloud/edge.log # show logs











  


    




