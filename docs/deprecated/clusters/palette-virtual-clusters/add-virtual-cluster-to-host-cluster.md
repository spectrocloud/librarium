---
sidebar_label: "Add Virtual Clusters to a Host Cluster"
title: "Add Virtual Clusters to a Host Cluster"
description: "How to add Palette Virtual Clusters to a Host Cluster"
icon: ""
hide_table_of_contents: false
---

# Add Virtual Clusters to a Host Cluster

:::warning

As of Palette 3.2, this feature is deprecated. Use the
[Deploy a Virtual Cluster to a Cluster Group](/clusters/palette-virtual-clusters/deploy-virtual-cluster) guide to learn
how to deploy Palette Virtual clusters.

:::

You can deploy Palette Virtual Clusters in a [Host Cluster](/glossary-all#hostcluster). To do this, Palette provides the
**Enable Virtual Clusters** option for new or existing clusters. Clusters with the virtual clusters feature enabled are
called Host Clusters.

The advantages of a virtual cluster environment are:

- You can operate with admin-level privileges while ensuring strong isolation.
- Virtual clusters reduce operational overhead and improve resource utilization.

Follow steps below to enable and deploy a virtual cluster.

# Prerequisites

- A Spectro Cloud account.

- A configured [Cluster](/clusters).

- Attach any required policies in your cloud account that must be added to your virtual cluster deployment.
  - For AWS, refer to the
    [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies#globalroleadditionalpolicies)
    documentation.
  - For Azure, no additional policies are required.

:::info

Palette doesn't support _Usage_ and _Cost_ metrics for Virtual Clusters running on Google Kubernetes Engine (GKE).

:::

## Add Node-Level Policies in your Cloud Account

In some situations additional node-level policies must be added to your deployment.

To add node-level policies:

1. In **Cluster Mode**, switch to the **Tenant Admin** project.
2. Select **Tenant Settings** in the **Main Menu**.
3. Click **Cloud Accounts** and ensure **Add IAM policies** is enabled for your cloud account. If an account does not
   already exist, you must add one.
4. You can specify any additional policies to include in virtual clusters deployed with this cloud account.
   - For AWS, add the **AmazonEBSCSIDriver** policy so that the virtual clusters can access the underlying host
     cluster's storage. Check out the
     [Palette required IAM policies](/clusters/public-cloud/aws/required-iam-policies#globalroleadditionalpolicies)
     documentation to learn more about additional IAM policies.
5. Confirm your changes.

# Enable Virtual Clusters on a Host Cluster

Follow these steps to enable virtual clusters on a new or existing Host Cluster:

1. In **Cluster Mode**, select **Clusters** in the **Main Menu**.
2. Select a **Host Cluster** from the list and click **Settings > Cluster Settings > Virtual Clusters**.
3. Toggle the **Enable Virtual Clusters** option to _on_.
4. Select an endpoint in the **Cluster Endpoint Type** drop-down menu: _Load Balancer_ or _Ingress_.
5. Configure the load balancer or ingress endpoint.

<Tabs>
<TabItem label="Configure Load Balancer Endpoint" value="Configure Load Balancer Endpoint">

### Configure Load Balancer Endpoint

<br />
These requirements apply to a Load Balancer endpoint:
<br />
<br />

- The Host Cluster supports dynamic provisioning of load balancers.
- If the Host Cluster is in the public cloud, the AKS/EKS/GCP Cloud Controller Manager must support load balancers by
  default.
- If the Host Cluster is in a private data center, a bare metal load balancer provider such as MetalLB must be installed
  and configured.

</TabItem>   
    
<TabItem label="Configure Ingress Endpoint" value="Configure Ingress Endpoint">
  
<b>Configure Ingress Endpoint:</b>
<br /> 
These requirements apply to an Ingress endpoint:
<br />
<br />

- The Host Cluster must specify a Host domain name service (DNS) Pattern, for example: `*.starship.te.spectrocloud.com`
  <br />
  To create a valid Host DNS Pattern, you must deploy the NGINX Ingress Controller on the Host Cluster with SSL passthrough
  enabled. This allows transport layer security (TLS) termination to occur at the virtual cluster's Kubernetes API server.
  <br />
- A wildcard DNS record must be configured, which maps the Host DNS Pattern to the load balancer associated with the
  NGINX Ingress Controller.

To map the Host DNS Pattern to the load balancer with the NGINX Ingress Controller:

<br />

1. Deploy the NGINX Ingress Controller on the Host Cluster and ensure that SSL passthrough is enabled in the
   `values.yaml` file for the NGINX Ingress Controller pack. Set `charts.ingress-nginx.controller.extraArgs` to _true_
   as shown in the example:
   <br />

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

2. Identify the public DNS name of the load balancer associated with the LoadBalancer Service associated with your NGINX
   Ingress Controller deployment.

3. Create a wildcard DNS record that maps the Host Pattern to the NGINX Ingress Controller load balancer. The example
   shows an AWS Route53 record for the `*.starship.te.spectrocloud.com` Host DNS Pattern.

| Example Record with Host DNS Pattern |                                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| ![AWS Route 53](/record-details.png) | Here is an example of an <br /> AWS Route53 record for the <br />`*.starship.te.spectrocloud.com` <br /> Host DNS Pattern. |

</TabItem>
</Tabs>

# Deploy a Virtual Cluster in the Host Cluster

To deploy a new virtual cluster in an existing Host Cluster:

1. In **Cluster Mode** select a project from the drop-down menu, and click **Clusters** in the **Main** menu.

2. Click the **Virtual Clusters** tab to list available virtual clusters, and select **Add New Virtual Cluster**.

3. Provide **Deploy New Virtual Cluster** configuration information:<br />

   - Select the Host Cluster in which you'll enable virtual clusters.
   - Add a cluster name.
   - Optionally, provide a Description and Tags.

   - Click the **Attach Profile** button to assign a profile.

     You can attach one or more Add-on layers to this cluster. If you do not have a Cluster Profile, refer to
     [Creating Cluster Profile](/cluster-profiles/task-define-profile) for details.

     <br />

4. (Optional) If the Host Cluster's **Cluster Endpoint Type** is a _Load Balancer_, you can provide the following
   advanced configuration options here:

   - [External Traffic Policy](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip):
     _Cluster_ or _Local_.<br />

   - Load Balancer Source Ranges: Limits which client IPs can access the load balancer. Inputs must be a comma-separated
     list of CIDR ranges in `a.b.c.d/x` format.
     [Network Load Balancer support on AWS](https://kubernetes.io/docs/concepts/services-networking/service/#aws-nlb-support)
     provides additional details.

# Validate

To validate your virtual cluster is available and ready for use, navigate to **Clusters > Virtual Clusters**, which
lists all your virtual clusters.

# Resources

- [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)

- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

- [Amazon EBS CSI driver - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)

- [Creating the Amazon EBS CSI driver IAM role for service accounts - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html)
