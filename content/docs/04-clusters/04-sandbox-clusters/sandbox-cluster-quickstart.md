---
title: "Quickstart with Sandbox Clusters"
metaTitle: "Getting Started with Sandbox  Clusters on Palette"
metaDescription: "The methods of creating Sandbox  clusters for a speedy deployment on any CSP"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Getting Started with Sandbox  Clusters

With the Palette Sandbox Cluster option, you can deploy additional Kubernetes clusters that run as nested clusters within an existing Host Cluster.

There are certain advantages to use a sandbox  cluster environment. For example, you are free to operate with admin level privileges, while simultaneously ensuring strong isolation, reducing operational overhead, and improving resource utilization.

Try the steps below to [enable](/clusters/sandbox-clusters/cluster-quickstart#enablingsandboxclustersonanexistinghostcluster) and [deploy](/clusters/sandbox-clusters/cluster-quickstart#deployingasandboxcluster) a managed Sandbox  Cluster from within Palette.

<br />

## Prerequisites

- You will need to have access to a Palette Account. Refer to the [Getting Started with Palette](/getting-started) page, and sign up for free [here](https://www.spectrocloud.com/get-started/).<p></p><br />

- Ensure you have a functioning [cluster](/clusters) already configured. If not, you can deploy a new cluster and enable the Sandbox  Clusters feature at the Settings step of your new cluster's deployment configuration. Clusters with the Sandbox  Cluster feature enabled are referred to as **Host Clusters**.<p></p><br />

  ### Host Clusters

  There are two ways to engage with a Sandbox  Cluster on Palette.<p></p><br />

   1. When you [create](/clusters) and [deploy](/clusters/sandbox-clusters/cluster-quickstart#deployingasandboxcluster) a new Host Cluster, there is an option to **Enable Sandbox  Clusters**. <p></p><br />Refer to the [Cluster Endpoint](/clusters/sandbox-clusters/cluster-quickstart#loadbalancer) step below for more information on how to configure this option. The settings listed below are available when you are enabling the Sandbox  Clusters feature on a pre-existing cluster and when using the Host Cluster deployment wizard.

    ![HostCluster](create-host-cluster.png "Host Cluster")<p></p><br />

    2. Similarly, you can [enable](/clusters/sandbox-clusters/cluster-quickstart#enablingsandboxclustersonanexistinghostcluster) an existing cluster; thus allowing it to host Sandbox  Clusters.<p></p><br />

<InfoBox>

When you create a Host Cluster and the storage layer is AWS EKS CSI, ensure the following role policies are included.
Sandbox 
<br />

```yml
roleName: "custom-ng-role"
  roleAdditionalPolicies:
  - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
```
</InfoBox>


# Enabling Sandbox  Clusters on an Existing Host Cluster

You can enable sandbox  clusters on an existing host cluster by performing the following steps:<p></p><br />

1. From the slide menu, select **Clusters** and view the list of **Clusters**.


2. Click any Host Cluster from the list and select **Settings** > **Cluster Settings** > **Sandbox  Clusters**.


3. Toggle the **Enable Sandbox  Clusters** option (yes/no).

    **Note**: This feature can be enabled when first creating a new cluster, so you may find that it is already enabled.


4. Select the **Cluster Endpoint Type**: *Load Balancer* or *Ingress*.


## Load Balancer

If **Load Balancer** is selected, the following must be true:<p></p><br />

-  The Host Cluster must support dynamic provisioning of load balancers.<p></p><br />
-  If the Host Cluster is in the public cloud, the AKS/EKS/GCP Cloud Controller Manager will provide this support by default. <p></p><br />
-  If the Host Cluster is in a private data center, a bare metal load balancer provider such as MetalLB must be installed and correctly configured.<p></p><br />

## Ingress
  If **Ingress** is selected, a **Host DNS Pattern** must be specified for this Host Cluster. To create a valid Host DNS Pattern, the NGINX Ingress Controller must be deployed on the Host Cluster with SSL passthrough enabled. This allows TLS termination to occur at the sandbox  cluster's Kubernetes API server.

  Additionally, a wildcard DNS record must be configured that maps the Host DNS Pattern to the load balancer associated with the NGINX Ingress Controller. See the Example Record in the recap below:

   **Host DNS Pattern**: `*.sandbox .host.1.spectrocloud.com`
<br />

<br />

<InfoBox>
<b>Recap</b>

1. Deploy the NGINX Ingress Controller on the Host Cluster and ensure that SSL passthrough is enabled in the NGINX Ingress Controller pack's values.yaml. Specifically, `charts.ingress-nginx.controller.extraArgs` must be set as follows:
<br />

  ```yml
    charts:
      ingress-nginx:
        ...
        controller:
          ...
          extraArgs:
            enable-ssl-passthrough: true
  ```
2. Identify the public DNS name of the load balancer associated with the LoadBalancer Service that is associated with your NGINX Ingress Controller deployment.<p></p><br />

3. Create a wildcard DNS record (e.g., in AWS Route53) mapping the Host Pattern to the NGINX Ingress Controller load balancer.

  |Example Record with Host DNS Pattern||
  |-|-|
  |![AWS Route 53](/record-details.png) |Here is an example of an <br /> AWS Route53 record for the <br />`*.starship.te.spectrocloud.com` <br /> Host DNS Pattern.|
 
</InfoBox>

<br />

# Deploying a Sandbox  Cluster

1. From the slide menu, select the **Clusters** tab and click the **Sandbox  Clusters** tab to list the available Sandbox  Clusters, and then select **Add New Sandbox  Cluster**.


2. Complete the **Deploy New Sandbox  Cluster** information:<p></p><br />

    - Select a Host Cluster.<p></p><br />

    - Add a Cluster name.

      **Note**: Use lowercase letters and do not add spaces.<p></p><br />

    - Provide a Description and Tags. These are optional.<p></p><br />

    - Click the **Attach Profile** button to assign a profile.

      **Note**: Optionally, attach one or more Add-on layer(s) to this cluster. If you do not have a Cluster Profile, see the [Creating Cluster Profile](/cluster-profiles/task-define-profile) page for more information.<p></p><br />


3. If the Host Cluster's **Cluster Endpoint Type** is a _Load Balancer_, you may optionally provide the following advanced configurations here:<p></p><br />

   - [External Traffic Policy](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip) - Cluster or Local<p></p><br />

   - Load Balancer Source Ranges (Optional) - Limit which client IP's can access the load balancer. Inputs **must** be a comma-separated list of CIDR ranges in the `a.b.c.d/x` format. See [Network Load Balancer support on AWS](https://kubernetes.io/docs/concepts/services-networking/service/#aws-nlb-support) for additional details.
<p></p><br />

  ![Deploy-sandbox-cluster](deploy-nested-cluster.png "Deploy a Sandbox  Cluster")

Congratulations! Your Sandbox  Cluster is now deployed. If you like more information on managing your resources, refer to the links below.
<br />


<InfoBox>

Palette does not support **Usage** and **Cost** metrics for the Sandbox  clusters running on GKE (Google Kubernetes Engine).

</InfoBox>


# Resources

[Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

[CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)

[Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

[Amazon EBS CSI driver - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)

[Creating the Amazon EBS CSI driver IAM role for service accounts - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html)
