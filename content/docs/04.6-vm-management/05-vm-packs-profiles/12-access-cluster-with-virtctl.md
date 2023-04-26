---
title: "Access VM Cluster with virtctl"
metaTitle: "Set up virtctl"
metaDescription: "Set up KubeVirt virtctl to facilitate VM operations in the Spectro VM Dashboard web interface."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The virtctl command-line interface (CLI) tool facilitates some of the VM operations you will perform, such as copying and pasting into the virtual console.

# Prerequisites

[Any? Do they need to do this at a particular time?] 

# Download and Connect virtctl

(Are they already logged in to Palette at this point?? If so, see STEP 3.)

1. Download the virtctl artifact based on your machine type from [KubeVirt Assets](https://github.com/kubevirt/kubevirt/releases/tag/v0.60.0-alpha.0). Scroll down to the Assets section.


2. Give execute permission to the virtctl command.

  ```shell
  chmod +x virtctl 
  ```


3. Next, log in to Palette as a tenant admin to connect your host cluster with the virtctl CLI.


4. Navigate to the left **Main Menu** and select **Clusters**. 


5. Select the host cluster you want to connect.


6. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes Config File** row.


7. Click on the kubeconfig link to download the file.


8. Open a terminal window and set the KUBECONFIG environment variable to the file path of the kubeconfig file.

    Example:
  ```shell
  export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig 
  ```

You can now issue virtctl commands against your host cluster.

# Validation

Verify you have access to your host cluster by issuing virtctl commands against it.