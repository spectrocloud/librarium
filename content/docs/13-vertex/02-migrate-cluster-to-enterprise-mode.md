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

...Enterprise mode stands up two additional virtual appliance instances to provide High Availability (HA)...

# Prerequisites

- Completed deploying the Open Virtualization Format (OVF) installation and have a working single-node cluster.


- A valid cloud account.


- An IP pool with a minimum of six unused IPs.


- Configured vSphere settings.



# Migrate Cluster

Follow these steps to migrate the single-node cluster you deployed to a three-node cluster for High Availability (HA) in your production environment.

<br />

1. Enter your vCenter IP address and credentials, and ensure the **Use self-signed certificate** setting is enabled, then click the **Validate** button. 

  When **The cloud account is valid!** displays, click **Next**.  

  ??Had to do ``nslookup``. Does it have to be an IP address??<br />   

  The server launches the enterprise cluster. This process adds two nodes to the cluster, making it a three-node cluster.<br /><br />


2. Configure the IP pool. You can choose **Range** and enter the start and end of the IP address range. The address range should have at least six IP addresses for the installation and ongoing management. Alternatively, you can choose **Subnet** and enter the subnet address.


3. Enter `18` as the **Subnet Prefix**. 


4. Enter the **Gateway** IP address, **Nameserver** addresses, and click **Next**.


5. Choose where to deploy the three control plane nodes. Select **Datacenter** in the **Datacenter drop-down Menu**. Select the folder you are using for your installation in the **Folder drop-down Menu**.


6. Select your compute cluster from the **Compute Cluster drop-down menu**, and select your resource pool from the **Resource Pool drop-down Menu**.


7. Select **vsanDatastore** in the **Datastore drop-down menu**, and select your network from the **Network drop-down Menu**.


8. Select an installer size. We recommend **Large** for production environments. 


9. Copy your SSH key into the **SSH Keys** field, and click **Done**.


10. The Enterprise Cluster Migration dashboard displays the Cluster Status **Provisioning**. Provisioning takes about 45 minutes.

  If you are installing VerteX, note that the Kubernetes layer in the cluster profile displays **(Fips).

  ![Screenshot of a FIPS-enabled cluster profile.](/vertex_cluster-profile-k8s-fips.png) 



# Validation



# Next Steps

Next, continue to perform various tasks as desired from the management console. You can create gateways, cloud accounts, cluster profiles, and launch clusters. Need a link here to Clusters docs. Create more tenants??

<br />


<br />


<br />


<br />