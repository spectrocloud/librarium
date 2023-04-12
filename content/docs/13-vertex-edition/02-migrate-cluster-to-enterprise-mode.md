---
title: "Migrate Cluster to Enterprise Mode"
metaTitle: "Migrate Cluster to Enterprise Mode"
metaDescription: "Migrate Cluster to Enterprise Mode."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Migrate Cluster to Enterprise Mode



# Prerequisites

- Completed deploying the Open Virtualization Format (OVF) installation and have a working cluster.


- A valid cloud account.


- An IP pool with a minimum of six unused IPs.


- vSphere placement settings.



# Migrate Cluster

Follow these steps to migrate the single-node cluster you deployed using Quick-Start mode to a three-node cluster for your production environment.

<br />

1. Enter the IP address of your Vcenter server, username and password, and ensure the **Use self-signed certificate** setting is enabled. The server will launch the enterprise cluster.


2. Click the **Validate account** button to verify the cloud account connects successfully, then click **Next**.


3. Configure the IP pool. For **Range**, enter the start and end of the range. The range should have at least six IP addresses for the installation and ongoing management. Alternatively, choose **Subnet** and enter the subnet address.


4. For **Subnet Prefix**, enter ``18``. 


5. Enter the **Gateway** IP address, **Nameserver** addresses, and an optional **Nameserver search suffix**, and click **Next**.


<br />


<br />


<br />


<br />