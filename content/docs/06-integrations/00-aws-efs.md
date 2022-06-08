---
title: 'AWS-EFS'
metaTitle: 'AWS EFS Integration with Palette'
metaDescription: 'AWS EFS storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-aws/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# AWS EFS

Amazon Elastic File System (Amazon EFS) is a scalable file storage that allows for automatic encryption of data at rest and in transit. You can access information from an AWS EFS volume, within a specific region, no matter which availability zone. The cluster can be distributed across availability zones instead of having it in one location and replicating it across multiple times.

Palette handles setting up the AWS EFS as a volume with ease when adding the persistentvolume storage container. Palette will dynamically provision the AWS EFS storage layer for the worker node. 


# Requirements

- The Identity and Access Management (IAM) policy below contains the minimum access required for Palette to work with AWS EFS.

- The AWS EFS policy needs to be attached as `*roleadditionalpolicies*` in the Kubernetes layer of the Cluster.

- Create and add this policy as a `roleAdditionalPolicies` in the `managedMachinePool` policy of kubernetes layer.

## Usage

There are two ways to add AWS EFS to Palette:

1. Add AWS EFS as a CSI layer in AWS/EKS.


2. You can also load AWS EFS as an Add-on layer, which will create a new storage class using the AWS EFS file system.



## Policy Information

      {
          "Version": "2012-10-17",
          "Statement": [
              {
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



## Notable Parameters

| Name             | Supported Values | Default Value         | Description                                                                                                                                                                      |
| ---------------- | ---------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storageClassName |                  | spectro-storage-class | AWS Volume type to be used.                                                                                                                                                      |
| isDefaultClass   |                  | true                  | Toggle for Default class                                                                                                                                                         |
| fileSystemId     | true, false      |                       | This is the File System under which access points are created. <br /> This is a mandatory field and needs to be set to pre-created AWS EFS volume. <br /> Other values can be at default setting.    |
| provisioningMode | efs-ap           | efs-ap                | The type of volume provisioned by AWS EFS. For now, this is the <br /> only access point supported.                                                                                           |
| directoryPerms   |                  | 700                   | Directory permissions for Access Point root directory.creation.                                                                                                                |
| gidRangeStart    |                  | 1000                  | Starting range of the Portable Operating System Interface(POSIX) group Id <br /> to be applied for access point root directory creation (optional).                          |
| gidRangeEnd      |                  | 2000                  | End range of the POSIX group Id.(optional)                                                                                                                                     |
| basePath         |                  | /base_efs             | Path under which access points for dynamic provisioning is created. <br /> If this parameter is not specified, access points <br /> are created under the root directory of the file system. |


# Troubleshooting

### Storage Class
Storage classes created by Palette will be with the name *spectro-storage-class* and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```

### PersistentVolumeClaim

The output of the kubectl describe pvc ${PVC_NAME} command is:

 `$ PVC_NAME=efs; kubectl describe pvc ${PVC_NAME}`

Name:          efs
Namespace:     default
StorageClass:  aws-efs
Status:        Pending
Volume:
Labels:<none>
Annotations:   kubectl.kubernetes.io/last-applied-configuration:
{"apiVersion":"v1","kind":"PersistentVolumeClaim","metadata":{"annotations":{"volume.beta.kubernetes.io/storage-class":"aws-efs"},"name":"...
volume.beta.kubernetes.io/storage-class: aws-efs
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:
Access Modes:
Events:
| Type    | Reason             | Age                | From                        | Message                  |
| ------- | ------------------ | ------------------ | --------------------------- | ------------------------ |
| Warning | ProvisioningFailed | 43s (x12 over 11m) | persistentvolume-controller | no volume plugin matched |
Mounted By:  <none> </p>



# References

See the following information on all AWS EFS parameters:

- https://github.com/kubernetes-sigs/aws-efs-csi-driver

- https://aws.amazon.com/efs/

- https://github.com/aws-samples/amazon-efs-tutorial



Example of an IAM Policy:

- https://raw.githubusercontent.com/kubernetes-sigs/aws-ebs-csi-driver/master/docs/example-iam-policy.json


To learn more info about Storage Classes see following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/



