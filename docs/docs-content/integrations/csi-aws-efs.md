---
sidebar_label: "AWS EFS"
title: "AWS EFS"
description: "AWS EFS storage add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/csi-aws-efs/blobs/sha256:5d1eb98bb847489f341beda1407c14442854ab8e5910d0cc8da1a63636057927?type=image.webp"
tags: ["packs", "aws-efs", "storage"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="2.0.x" value="2.0.x">

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC,
as shown in the following output, when you use the `kubectl describe pvc` command.

```bash
kubectl describe pvc my-efs-volume
```

```shell hideClipboard
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

</TabItem>
<TabItem label="1.7.x" value="1.7.x">

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC,
as shown in the following output, when you use the `kubectl describe pvc` command.

```bash
kubectl describe pvc my-efs-volume
```

```shell hideClipboard
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

</TabItem>
<TabItem label="1.6.x" value="1.6.x">

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC,
as shown in the following output, when you use the `kubectl describe pvc` command.

```bash
kubectl describe pvc my-efs-volume
```

```shell hideClipboard
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

</TabItem>
<TabItem label="1.5.x" value="1.5.x">

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC,
as shown in the following output, when you use the `kubectl describe pvc` command.

```bash
kubectl describe pvc my-efs-volume
```

```shell hideClipboard
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

</TabItem>

<TabItem label="1.4.x" value="1.4.x">

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC,
as shown in the following output, when you use the `kubectl describe pvc` command.

```bash
kubectl describe pvc my-efs-volume
```

```shell hideClipboard
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

</TabItem>

<TabItem label="1.3.x" value="1.3.x">

## Prerequisites

- Create the Identity and Access Management (IAM) role that allows the driver to manage AWS EFS access points. The
  [Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/)
  blog provides information on `EFSCSIControllerIAMPolicy`.

- An AWS EFS file system is available. Check out the guide
  [Create your Amazon EFS file system](https://docs.aws.amazon.com/efs/latest/ug/gs-step-two-create-efs-resources.html)
  if you need additional guidance.

- Create your EKS cluster using static provisioning. Static provisioning requires you to create a virtual private cloud
  (VPC), subnets, route tables, internet gateway and NAT gateways in the AWS console.

  You can use the same VPC or a different one for EFS:

  - Using the same VPC for EFS ensures EFS is reachable from your EKS cluster. We recommend using the same VPC because
    it doesn't require peering.

  - If you use a different VPC for EFS, you need to peer the VPC with the VPC on which the EKS cluster is
    running.<br /><br />

- The security group associated with your EFS file system must have an inbound rule that allows Network File System
  (NFS) traffic (port 2049) from the CIDR for your cluster's VPC.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter        | Description                                                                                                                                                                                                                | Default                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| storageClassName | AWS Volume type to be used.                                                                                                                                                                                                | spectro-storage-class                                   |
| isDefaultClass   | Toggle for Default class.                                                                                                                                                                                                  | true                                                    |
| fileSystemId     | The file system under which access points are created. Create the file system prior to this setup. This is a required field and needs to be set to a pre-created AWS EFS volume. Other values can use the default setting. | Set this to an AWS EFS volume you have already created. |
| provisioningMode | Type of volume provisioned by AWS EFS. For now, this is the only access point supported.                                                                                                                                   | efs-ap                                                  |
| directoryPerms   | Directory permissions for Access Point root directory creation.                                                                                                                                                            | 700                                                     |
| gidRangeStart    | Starting range of the Portable Operating System Interface (POSIX) group Id to be applied for access point root directory creation (optional).                                                                              | 1000                                                    |
| gidRangeEnd      | End range of the POSIX group Id (optional).                                                                                                                                                                                | 2000                                                    |
| basePath         | Path under which access points for dynamic provisioning is created. If this parameter is not specified, access points are created under the root directory of the file system.                                             | `/base_efs`                                             |

## Usage

There are two ways to add AWS EFS to Palette:

- Add EFS as a CSI layer in AWS/EKS.
- Add EFS as an Add-on layer, which will create a new storage class using the AWS EFS file system.

### Policy Information

You must create a policy that allows you to use EFS from your IAM account. You can use the following JSON to create the
policy.<br /><br />

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:DescribeAccessPoints", "elasticfilesystem:DescribeFileSystems"],
        "Resource": "*",
      },
      {
        "Effect": "Allow",
        "Action": ["elasticfilesystem:CreateAccessPoint"],
        "Resource": "*",
        "Condition": { "StringLike": { "aws:RequestTag/efs.csi.aws.com/cluster": "true" } },
      },
      {
        "Effect": "Allow",
        "Action": "elasticfilesystem:DeleteAccessPoint",
        "Resource": "*",
        "Condition": { "StringEquals": { "aws:ResourceTag/efs.csi.aws.com/cluster": "true" } },
      },
    ],
}
```

### Storage Class

Palette creates storage classes named _spectro-storage-class_. You can view a list of storage classes using this kubectl
command:

<br />

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request made by a pod for a certain amount of storage from the cluster. It acts as a
link between the pod and the storage resource, allowing the pod to use the storage. You can learn details about a PVC by
using the `kubectl describe pvc` command, as the following example output shows. <br />

```bash
kubectl describe pvc my-efs-volume
```

```yaml

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

</TabItem>
</Tabs>

## Troubleshooting

Some basic troubleshooting steps you can take if you receive errors in your pods when mounting an Amazon EFS volume in
your Amazon EKS cluster are to verify you have the following:

If you encounter some issues when mounting an Amazon EFS volume in your Amazon EKS cluster, start by reviewing the items
below:

- Ensure you have an Amazon EFS file system created with a mount target in each of the worker node subnets.
- A valid EFS storage class definition is created and using the `efs.csi.aws.com` provisioner.
- A valid PersistentVolumeClaim (PVC) definition and PersistentVolume definition. This is not necessary if you are using
  dynamic provisioning.
- The Amazon EFS CSI driver is installed in the cluster.

### Common Issues

The following list provides more specific details to help you troubleshoot issues when mounting an Amazon EFS volume.

:::tip

The CSI driver pod logs are also available to help you determine the cause of the mount failures. If the volume is
failing to mount, use `efs-plugin` logs to help you debug. Use the following command to view the logs.

```shell
kubectl logs --namespace kube-system --label app=efs-csi-node --containe efs-plugin
```

:::

- **Mount Targets:** Verify the mount targets are configured correctly. Be sure to create the EFS mount targets in each
  Availability Zone where the EKS worker nodes are running.

- **Allow NFS Traffic:** Verify the security group associated with your EFS file system and worker nodes allows NFS
  traffic. The security group that's associated with your EFS file system must have an inbound rule that allows NFS
  traffic (port 2049) from the CIDR for your cluster's VPC. The security group that's associated with your worker nodes
  where the pods are failing to mount the EFS volume must have an outbound rule that allows NFS traffic (port 2049) to
  the EFS file system.

- **Subdirectories:** If you are mounting the pod to a subdirectory, verify the subdirectory is created in your EFS file
  system. When you add sub paths in persistent volumes, the EFS CSI driver does not create the subdirectory path in the
  EFS file system as part of the mount operation. Subdirectories must be present before you start the mount operation.

- **DNS server:** Confirm the cluster's Virtual Private Cloud (VPC) uses the Amazon DNS server.

- **Permissions:** Verify you have `iam` mount options in the Persistent Volume (PV) definition when using a restrictive
  file system policy. In some cases, the EFS file system policy is configured to restrict mount permissions to specific
  IAM roles. In this case, the EFS mount helper in the EFS CSI driver requires the `-o iam` mount option during the
  mount operation. Include the **spec.mountOptions** property in the Persistent Volume (PV) definition to specify the
  mount options.

  ```bash
  spec:
    mountOptions:
      - iam
  ```

- **IAM role:** Verify the Amazon EFS CSI driver controller service account associates with the correct IAM role and the
  IAM role has the required permissions. Use the following command to view the service account annotation.

  ```bash
  kubectl describe sa efs-csi-controller-sa --namespace kube-system
  ```

  The output should look similar to the following:

  ```bash
  eks.amazonaws.com/role-arn"="arn:aws:iam::111122223333:role/AmazonEKS_EFS_CSI_Driver_Policy
  ```

- **Driver Pods:** Verify the EFS CSI driver pods are active. Issue the following command to display a list of
  controller pods and node pods active in your cluster.

  ```bash
  kubectl get all --label app.kubernetes.io/name=aws-efs-csi-driver --namespace kube-system
  ```

- **File System Not Mounting:** Verify the EFS mount operation from the EC2 worker node where the pod is failing to
  mount the file system. Log in to the Amazon EKS worker node where the pod is scheduled. Then, use the EFS mount helper
  to try to manually mount the EFS file system to the worker node. Use the following command to mount the EFS file
  system.

  ```bash
  sudo mount -types -efs -options tls file-system-dns-name efs-mount-point/
  ```

Check out the
[Amazon EFS](https://aws.amazon.com/premiumsupport/knowledge-center/eks-troubleshoot-efs-volume-mount-issues/)
troubleshooting guide for more information.

## Terraform

You can reference the AWS EFS pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "csi-aws-efs" {
  name    = "aws-efs"
  version = "1.7.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Amazon EFS CSI Driver](https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html)

- [Amazon Elastic File System](https://aws.amazon.com/efs/)

- [Amazon EFS Tutorial and Examples](https://github.com/aws-samples/amazon-efs-tutorial)

- [IAM Policy Example](https://raw.githubusercontent.com/kubernetes-sigs/aws-ebs-csi-driver/master/docs/example-iam-policy.json)

- [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)<br />
