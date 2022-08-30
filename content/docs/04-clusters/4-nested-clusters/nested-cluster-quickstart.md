---
title: "Quick Start with Nested Cluster"
metaTitle: "Getting Started with nested clusters on Palette"
metaDescription: "The methods of creating nested clusters for a speedy deployment on any CSP"
icon: "clusters"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Getting Started with Nested Clusters

With the Palette Nested Cluster option, you can deploy additional Kubernetes clusters within an existing cluster to provide teams with sandboxed environments where you are free to operate with admin level privileges, while simultaneously ensuring strong isolation, reducing operational overhead, and improving resource utilization.

To access a Palette Sandbox, go to [SpectroCloud](https://spectrocloud.com) <!--confirm link--> and use your Github or Google SSO. You will be prompted to create a Palette account.
You are allowed to deploy a managed Nested Cluster. See below under [Deploying a Nested Cluster](/clusters/nested-clusters/cluster-quickstart#deployinganestedcluster), follow the steps below under 


# Prerequisites

- You will need to have access to a Palette Account. Refer to the [Getting Started with Palette](/getting-started).


- Ensure you have a functioning cluster already configure. Refer to the [New Clusters](/clusters/new-clusters) page for more information.


# Deploying a Nested Cluster
1. From the slide menu, select the **Clusters** tab and click the **Nested Clusters** tab to list the available Nested Clusters, and then select **Add New Nested Cluster**.


2. Select Deploy New Cluster or Import Cluster if you have your own cluster. For this exercise we will deploy a new cluster.


3. Complete the Deploy New Nested Cluster information: 
    - Select a Host cluster.
   
    - Add a Cluster name.

      **Note**: Use lowercase and do not had spaces
    
    
    - Provide a Description and Tags. These are optional.


4. Attach a profile to this cluster by clicking the **Attach Profile** button. If you do not have a Cluster Profile, see the [Create Cluster Profile] page for more information.


5. Set the **Quota Limits** for the following hardware settings:
    - CPU
    - Memory (RAM)


6. If the Host Cluster's **Cluster Endpoint Type** is _Load Balancer_, you may optionally provide the following advanced configurations here:
      - External Traffic Policy: Cluster or Local
      - External IPs (Optional)
      - Load Balancer Source Ranges (Optional)

<!-- <Insert pic here> -->



## Enabling a Nested Clusters on a Host Cluster
1. Click the **Clusters** tab and select **Clusters List**.


2. Click any Host Cluster from the list and select **Settings** > **Cluster Settings** > **Nested Clusters**.


3. Toggle the **Enable Nested Clusters** option(yes/no).


4. Select the **Cluster Endpoint Type**
   
  <br />

  ### Load Balancer

  If **Load Balancer** is selected, the following must be true:

    -  The Host Cluster must support dynamic provisioning of load balancers. 
    -  If the Host Cluster is in the public cloud, the AKS/EKS/GCP Cloud Controller Manager will provide this support by default. 
    -  If the Host Cluster is in a private data center, a bare metal load balancer provider such as MetalLB must be installed and correctly configured.

  ### Ingress
     - If **Ingress** is selected, a Host Pattern must be specified for this Host Cluster. To create a valid Host Pattern, the NGINX Ingress Controller must be deployed on the Host Cluster with SSL passthrough enabled. This allows TLS termination to occur at the nested cluster's Kubernetes API server. 
       
      Additionally, a wildcard DNS record must be configured that maps the Host Pattern to the load balancer associated with the NGINX Ingress Controller.
      
      For example `*.nested.host.1.spectrocloud.com.` 


<InfoBox>
Deploy the NGINX Ingress Controller on the Host Cluster and ensure that the SSL passthrough is enabled in the NGINX Ingress Controller pack's values.yaml. Specifically, charts.ingress-nginx.controller.extraArgs must be set as follows:

```yml
charts:
  ingress-nginx:
    ...
    controller:
      ...
      extraArgs:
        enable-ssl-passthrough: true
```

  - Identify the public DNS name of the load balancer associated with the LoadBalancer Service that is associated with your NGINX Ingress Controller deployment.


  - Create a wildcard DNS record (e.g., in AWS Route53) mapping the Host Pattern to the NGINX Ingress Controller load balancer.


  - The same settings as above are also available in the Host Cluster deployment wizard.

</InfoBox>

Example AWS Route53 record for the `*.starship.te.spectrocloud.com` Host Pattern

<br />

![AWS Route 53](/record-details.png)

<br />

