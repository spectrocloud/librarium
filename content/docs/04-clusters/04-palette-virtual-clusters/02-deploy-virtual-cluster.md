---
title: "Deploy a Virtual Cluster to a Cluster Group"
metaTitle: "Deploy a Virtual Clusters to a Cluster Group"
metaDescription: "How to add Palette Virtual Clusters to a Cluster Group"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Add Virtual Clusters to a Cluster Group


You can deploy Palette Virtual Clusters to a [cluster group](/clusters/cluster-groups). The advantages of a virtual cluster environment are:
- You can operate with admin-level privileges while ensuring strong isolation.
- Virtual clusters reduce operational overhead and improve resource utilization.

Use the followings steps to deploy a virtual cluster.

# Prerequisites

- A Spectro Cloud account.

- A cluster group. Refer to the [Create and Manage Cluster Groups](/clusters/cluster-groups/create-cluster-group) guide to learn how to create a cluster group.

- Attach any required policies in your cloud account that must be added to your virtual cluster deployment. 
  - For AWS, refer to the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies#globalroleadditionalpolicies) documentation.
  - For Azure, no additional policies are required.

<InfoBox>

Palette doesn't support _Usage_ and _Cost_ metrics for Virtual Clusters running on Google Kubernetes Engine (GKE).

</InfoBox>

## Add Node-Level Policies in your Cloud Account

In some situations additional node-level policies must be added to your deployment. 

To add node-level policies: 

1. In **Cluster Mode**, switch to the **Tenant Admin**  project.


2. Select **Tenant Settings** in the **Main Menu**. 


3. Click **Cloud Accounts** and ensure **Add IAM policies** is enabled for your cloud account. If an account does not already exist, you must add one.


4. You can specify any additional policies to include in virtual clusters deployed with this cloud account.

    - For AWS, add the **AmazonEBSCSIDriver** policy so that the virtual clusters can access the underlying host cluster's storage. Check out the [Palette required IAM policies](/clusters/public-cloud/aws/required-iam-policies#globalroleadditionalpolicies) documentation to learn more about additional IAM policies.


5. Confirm your changes.

# Deploy a Virtual Cluster

Follow these steps to deploy a virtual clusters to a cluster group:

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.


2. Select **Virtual Clusters** from the left **Main Menu**. 


3. Click on the **+New Virtual Cluster**.


4. Select your cluster group from the **Select cluster group** drop-down Menu, and provide a name to the virtual cluster.


5. Assign the CPU, Memory, and Storage size for the cluster.


6. Deploy the cluster.



# Validation

To validate your virtual cluster is available and ready for use. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.
Select **Virtual Clusters** from the left **Main Menu**. Your cluster is ready for use if the status is **Running**.


# Resources

- [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)

- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

- [Amazon EBS CSI driver - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)

- [Creating the Amazon EBS CSI driver IAM role for service accounts - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html)
