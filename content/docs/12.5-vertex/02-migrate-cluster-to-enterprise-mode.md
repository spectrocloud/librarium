---
title: "Migrate Cluster to Enterprise Mode (Delete)"
metaTitle: "Migrate Cluster to Enterprise Mode"
metaDescription: "Learn how to convert a self-hosted single node cluster to a highly available three-node cluster."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Migrate Cluster to Enterprise Mode

When you install Palette using steps in [Install Using Quick-Start Mode](/vertex/install-using-quick-start-mode), a single-node cluster is deployed as a self-hosted Palette instance in vCenter. Enterprise mode stands up two additional virtual appliance instances to provide High Availability (HA) for your production environment.  

Data from the installer VM is migrated to the newly created enterprise cluster. If any tenants were created prior to the enterprise cluster migration, which may be the case if the system was initially used in Quick-Start mode for a POC, those tenants are migrated to the enterprise cluster.

Follow steps below to migrate the single-node cluster to a three-node cluster. 

# Prerequisites

- Completed deploying the Open Virtualization Format (OVF) installation.


- Configured vSphere settings.


- A valid cloud account.


- An IP pool with a minimum of six unused IPs.


# Migrate Cluster

1. Enter your vCenter IP address and credentials, and ensure the **Use self-signed certificate** setting is enabled, then click the **Validate Account** button. 

  When your account is validated, click **Next**.     

  The server launches the enterprise cluster. This process adds two nodes to the cluster, making it a three-node cluster.<br /><br />


2. Configure the IP pool. You can enter the IPs to be used for Enterprise cluster VMs as a `Range` or a `Subnet`. The address range should have at least six IP addresses for the installation and ongoing management.


3. Enter the **Subnet Prefix**. For example `18`.


4. Enter the **Gateway** IP and **Nameserver** addresses and click **Next**.


5. Choose where to deploy the three control plane nodes. Use drop-down menus to select **Datacenter** and the folder that contains your VM deployment.


6. Select your compute cluster, resource pool, datastore, and network. For high availability, you may choose to distribute the three VMs across multiple compute clusters. If this is desired, click **Add Domain** to enter multiple sets of these properties.


7. Select an installer size. 


8. Add your SSH key and optional NTP servers, then click **Done**.


9. The Enterprise Cluster Migration dashboard displays the Cluster Status **Provisioning**. Provisioning takes about 10 minutes. You can view the progress in the **Events** tab. The **Nodes** tab displays the three nodes. 

  If you are installing VerteX, note that the Kubernetes layer in the cluster profile displays **Kubernetes (Fips)**.

  ![Screenshot of a FIPS-enabled cluster profile.](/vertex_cluster-profile-k8s-fips1.png) 

# Validation

You can validate that a three-node Kubernetes cluster is launched and Palette Platform is deployed on it. 

<br />

1. Log in to vCenter Server using the vSphere Client.


2. Navigate to your Datacenter and locate your VM. Click on the VM to access its details page. 


3. Power on the VM.


# Next Steps

Next, continue to perform various tasks as desired from the management console. You can create gateways, cloud accounts, cluster profiles, and launch clusters. To learn how to create profiles and apply them clusters, check out [Cluster profiles](/cluster-profiles/task-define-profile) and [Clusters](/clusters) guides. 

If you are deploying a FIPS-enabled cluster, you need to enable FIPS in both the cluster and the cluster profile. Review [Create a FIPS-Enabled Cluster Profile](/vertex/migrate-cluster-to-enterprise-mode/create-profile) and [Create a FIPS-Enabled Cluster](/vertex/migrate-cluster-to-enterprise-mode/create-cluster). 


# Resources 

[Create a FIPS-Enabled Cluster Profile](/vertex/migrate-cluster-to-enterprise-mode/create-profile)


[Create a FIPS-Enabled Cluster](/vertex/migrate-cluster-to-enterprise-mode/create-cluster)

<br />


<br />


<br />


<br />