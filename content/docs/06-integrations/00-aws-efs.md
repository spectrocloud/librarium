---
title: 'AWS-EFS'
metaTitle: 'AWS EFS Integration with Palette'
metaDescription: 'AWS EFS storage add on into Spectro Cloud'
hiddenFromNav: true
type: "integration"
category: ['storage']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-aws-efs/blobs/sha256:5d1eb98bb847489f341beda1407c14442854ab8e5910d0cc8da1a63636057927?type=image/png'

---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# AWS EFS

Amazon Elastic File System (Amazon EFS) is a scalable file storage that allows for automatic data encryption at rest and in transit. You can access information from an AWS EFS volume, within a specific region, no matter which availability zone. The cluster can be distributed across availability zones instead of having it in one location and replicating it across multiple times.

Palette handles setting up the AWS EFS as a volume with ease when adding the PersistentVolume storage container. Palette will dynamically provision the AWS EFS storage layer for the worker node.

## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.4.x" key="1.4.x">

* **1.4.9**
* **1.4.0**

## Prerequisites

- Create the Identity and Access Management (IAM) role that allows the driver to manage AWS EFS access points. See the [Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/) blog for information on `EFSCSIControllerIAMPolicy`.


- Have a filesystem created and available before you provision AWS EFS to Palette.

- Create your EKS cluster using static provisioning. Static provisioning requires you to create a virtual private cloud (VPC), subnets, route tables, internet gateway and NAT gateways in the AWS console.

  You can use the same VPC or a different one for EFS:

    - Using the same VPC for EFS ensures EFS is reachable from your EKS cluster. We recommend using the same VPC because it doesn't require peering.

    - If you use a different VPC for EFS, you need to peer the VPC with the VPC on which the EKS cluster is running.<br /><br />

- The security group associated with your EFS file system must have an inbound rule that allows Network File System (NFS) traffic (port 2049) from the CIDR for your cluster's VPC.


## Parameters

While adding the AWS EFS layer, the following parameters can be configured:

| Name             | Supported Values | Default Value         | Description                                                                                                                                                                                                                              |
| ---------------- | ---------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storageClassName |                  | spectro-storage-class | AWS Volume type to be used.                                                                                                                                                                                                              |
| isDefaultClass   |                  | true                  | Toggle for Default class.                                                                                                                                                                                                                   |
| fileSystemId     |                  |                       | This is the File System under which access points are created. It should be created prior to this setup. <br /> This is a mandatory field and needs to be set to a pre-created AWS EFS volume.  Other values can be at the default setting. |
| provisioningMode | efs-ap           | efs-ap                | The type of volume provisioned by AWS EFS. For now, this is the <br /> only access point supported.                                                                                                                                      |
| directoryPerms   |                  | 700                   | Directory permissions for Access Point root directory creation.                                                                                                                                                                          |
| gidRangeStart    |                  | 1000                  | Starting range of the Portable Operating System Interface(POSIX) group Id to be applied for access point root directory creation (optional).                                                                                      |
| gidRangeEnd      |                     | 2000                  | End range of the POSIX group Id (optional).                                                                                                                                                                                                 |
| basePath         |                  | /base_efs             | Path under which access points for dynamic provisioning is created. <br /> If this parameter is not specified, access points are created under the root directory of the file system.                                             |


## Usage

There are two ways to add AWS EFS to Palette:

- Add EFS as a CSI layer in AWS/EKS.


- Add EFS as an Add-on layer, which will create a new storage class using the AWS EFS file system.


### Policy Information

```yaml
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "elasticfilesystem:DescribeAccessPoints",
      "elasticfilesystem:DescribeFileSystems"
    ],
    "Resource": "*"
  },
    {
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:CreateAccessPoint"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:RequestTag/efs.csi.aws.com/cluster": "true"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "elasticfilesystem:DeleteAccessPoint",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/efs.csi.aws.com/cluster": "true"
        }
      }
    }
  ]
}
```

</Tabs.TabPane>
<Tabs.TabPane tab="1.3.x" key="1.3.x">


* **1.3.6**

## Prerequisites

- Create the Identity and Access Management (IAM) role that allows the driver to manage AWS EFS access points. See the [Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/) blog for information on `EFSCSIControllerIAMPolicy`.


- Have a filesystem created and available before you provision AWS EFS to Palette.

- Create your EKS cluster using static provisioning. Static provisioning requires you to create a virtual private cloud (VPC), subnets, route tables, internet gateway and NAT gateways in the AWS console.

  You can use the same VPC or a different one for EFS:

    - Using the same VPC for EFS ensures EFS is reachable from your EKS cluster. We recommend using the same VPC because it doesn't require peering.

    - If you use a different VPC for EFS, you need to peer the VPC with the VPC on which the EKS cluster is running.<br /><br />

- The security group associated with your EFS file system must have an inbound rule that allows Network File System (NFS) traffic (port 2049) from the CIDR for your cluster's VPC.


## Parameters

While adding the AWS EFS layer, the following parameters can be configured:

| Name             | Supported Values | Default Value         | Description                                                                                                                                                                                                                              |
| ---------------- | ---------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storageClassName |                  | spectro-storage-class | AWS Volume type to be used.                                                                                                                                                                                                              |
| isDefaultClass   |                  | true                  | Toggle for Default class.                                                                                                                                                                                                                   |
| fileSystemId     |                  |                       | This is the File System under which access points are created. It should be created prior to this setup. <br /> This is a mandatory field and needs to be set to a pre-created AWS EFS volume.  Other values can be at the default setting. |
| provisioningMode | efs-ap           | efs-ap                | The type of volume provisioned by AWS EFS. For now, this is the <br /> only access point supported.                                                                                                                                      |
| directoryPerms   |                  | 700                   | Directory permissions for Access Point root directory creation.                                                                                                                                                                          |
| gidRangeStart    |                  | 1000                  | Starting range of the Portable Operating System Interface(POSIX) group Id to be applied for access point root directory creation (optional).                                                                                      |
| gidRangeEnd      |                     | 2000                  | End range of the POSIX group Id (optional).                                                                                                                                                                                                 |
| basePath         |                  | /base_efs             | Path under which access points for dynamic provisioning is created. <br /> If this parameter is not specified, access points are created under the root directory of the file system.                                             |


## Usage

There are two ways to add AWS EFS to Palette:

- Add EFS as a CSI layer in AWS/EKS.


- Add EFS as an Add-on layer, which will create a new storage class using the AWS EFS file system.


### Policy Information

```yaml
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "elasticfilesystem:DescribeAccessPoints",
      "elasticfilesystem:DescribeFileSystems"
    ],
    "Resource": "*"
  },
    {
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:CreateAccessPoint"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:RequestTag/efs.csi.aws.com/cluster": "true"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "elasticfilesystem:DeleteAccessPoint",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/efs.csi.aws.com/cluster": "true"
        }
      }
    }
  ]
}
```

</Tabs.TabPane>
</Tabs>


# Troubleshooting 
**QUESTION: Is information below about "Storage Class" and "PersistentVolumnClaim" really information for the Usage section?** 

**Should the Troubleshooting section list the following points instead?**
**Is is safe to include the commands shown or is there the possibility they could change?. If so, the doc can list the bullet points and refer users to the Amazon troubleshooting site for more details.**



Some basic troubleshooting steps you can take if you receive errors in your pods when mounting an Amazon EFS volume in your Amazon EKS cluster are to verify you have the following:
<br />

  - An Amazon EFS file system created with a mount target in each of the worker node subnets.
  - A valid EFS storage class definition using the efs.csi.aws.com provisioner.
  - A valid PersistentVolumeClaim (PVC) definition and PersistentVolume definition. This isn't needed if you're using dynamic provisioning.
  - The Amazon EFS CSI driver installed in the cluster.

The following list provides more specific details to help you troubleshoot issues when mounting an Amazon EFS volume. CSI driver pod logs are also available to determine the cause of the mount failures. If the volume is failing to mount, the efs-plugin logs are available.
<br /> 

- **Mount Targets:** Verify the mount targets are configured correctly. Be sure to create the EFS mount targets in each Availability Zone where the EKS worker nodes are running.

- **Allow NFS Traffic:** Verify the security group associated with your EFS file system and worker nodes allows NFS traffic.

  - The security group that's associated with your EFS file system must have an inbound rule that allows NFS traffic (port 2049) from the CIDR for your cluster's VPC.

  - The security group that's associated with your worker nodes where the pods are failing to mount the EFS volume must have an outbound rule that allows NFS traffic (port 2049) to the EFS file system.

- **Subdirectories:** If you're mounting the pod to a subdirectory, verify the subdirectory is created in your EFS file system. When you add sub paths in persistent volumes, the EFS CSI driver doesn't create the subdirectory path in the EFS file system as part of the mount operation. Subdirectories must be present before you start the mount operation. 

- **DNS server:** Confirm the cluster's Virtual Private Cloud (VPC) uses the Amazon DNS server. To verify the DNS server, log in to the worker node and issue the following command, replacing ```region``` with your AWS Region: <br />

  ```bash 
  nslookup fs-4fxxxxxx.efs.region.amazonaws.com <amazon provided DNS IP>
  <amazon provided DNS IP = VPC network(10.0.0.0) range plus two>
  ```

- **Permissions:** Verify you have "iam" mount options in the persistent volume definition when using a restrictive file system policy. In some cases, the EFS file system policy is configured to restrict mount permissions to specific IAM roles. In this case, the EFS mount helper in the EFS CSI driver requires the ```-o iam``` mount option during the mount operation. Include the **spec.mountOptions** property:<br />

  ```bash
  spec:
    mountOptions:
      - iam
  ```
- **IAM role:** Verify the Amazon EFS CSI driver controller service account associates with the correct IAM role and the IAM role has the required permissions.

  Run the following command:

  ```bash
  kubectl describe sa efs-csi-controller-sa -n kube-system
  ```
  
  You shoud see this annotation:

  ```bash
  eks\.amazonaws\.com/role-arn"="arn:aws:iam::111122223333:role/AmazonEKS_EFS_CSI_Driver_Policy
  ```
- **Driver Pods:** Verify the EFS CSI driver pods are running. Issue the following command to display a list of controller pods and node pods running in your cluster:

  ```bash
  kubectl get all -l app.kubernetes.io/name=aws-efs-csi-driver -n kube-system
  ```

- **File system won't mount:** Verify the EFS mount operation from the EC2 worker node where the pod is failing to mount the file system. Log in to the Amazon EKS worker node where the pod is scheduled. Then, use the EFS mount helper to try to manually mount the EFS file system to the worker node. You can run the following command to test:

  ```bash
  sudo mount -t -efs -o tls file-system-dns-name efs-mount-point/
  ```

You can find more information in Amazon's [Troubleshoot Amazon EFS](https://aws.amazon.com/premiumsupport/knowledge-center/eks-troubleshoot-efs-volume-mount-issues/) guide.

### Storage Class
Storage classes that Palette creates are named *spectro-storage-class* and can be fetched using the kubectl command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

The example shows the command output for `kubectl describes pvc` ${PVC_NAME}:

```yaml

 `$ PVC_NAME=efs; kubectl describe pvc ${PVC_NAME}`


Name:          efs

Namespace:     default

StorageClass:  aws-efs

Status:        Pending

Volume:

Labels:<none>

Annotations:   kubectl.kubernetes.io/last-applied-configuration:
{"apiVersion":"v1","kind":"PersistentVolumeClaim","metadata":{"annotations":{"volume.beta.kubernetes.io/
storage-class":"aws-efs"},"name":"..."}

volume.beta.kubernetes.io/storage-class: aws-efs

Finalizers:    [kubernetes.io/pvc-protection]

Capacity:

Access Modes:

Events:
| Type    | Reason             | Age                | From                        | Message                  |
| ------- | ------------------ | ------------------ | --------------------------- | ------------------------ |
| Warning | ProvisioningFailed | 43s (x12 over 11m) | persistentvolume-controller | no volume plugin matched |
Mounted By:  <none>

```
Possible Troubleshooting info to add:

If you get errors in your pods when mounting your Amazon EFS volume in your Amazon EKS cluster, verify you have the following:

- An Amazon EFS file system created with a mount target in each of the worker node subnets.
- A valid EFS storage class (from the GitHub website) definition using the efs.csi.aws.com provisioner.
- A valid PersistentVolumeClaim (PVC) definition and PersistentVolume definition. This isn't needed if you're using dynamic provisioning (from the GitHub website).
- The Amazon EFS CSI driver installed in the cluster.


# Terraform

```
data "spectrocloud_registry" "container_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "csi-aws-efs" {
  name    = "csi-aws-efs"
  version = "1.4.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.container_registry.id
}
```

# References

[Amazon EFS CSI Driver](https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html)<br />
[Amazon Elastic File System](https://aws.amazon.com/efs/)<br />
[Amazon EFS Tutorial and Examples](https://github.com/aws-samples/amazon-efs-tutorial)<br />
[IAM Policy Example](https://raw.githubusercontent.com/kubernetes-sigs/aws-ebs-csi-driver/master/docs/example-iam-policy.json)<br />
[Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)<br />
