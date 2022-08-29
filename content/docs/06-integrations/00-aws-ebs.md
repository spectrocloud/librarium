---
title: 'AWS-EBS'
metaTitle: 'AWS EBS Integration with Spectro Cloud'
metaDescription: 'AWS EBS storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-aws/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# AWS EBS

AWS Elastic Block Store is an easy to use, high performance block storage at any scale. It helps in the easy deployment, management, and scaling of the most demanding and high-performance tenant workloads. AWS EBS also ensures availability with replication and durability.

# Versions Supported

<Tabs>
<Tabs.TabPane tab="1.8.x" key="1.8.x">

* ** 1.8.0**

</Tabs.TabPane>
<Tabs.TabPane tab="1.5.x" key="1.5.x">

* ** 1.5.1**

</Tabs.TabPane>
</Tabs>

# Pre-requisite Permissions

1. [AmazonEBSCSIDriverPolicy](/integrations/aws-ebs#amazonebscsidriverpolicy) the minimum permission to be attached.


2. [EBSCSIKMSEncryptionPolicy](/integrations/aws-ebs#ebscsikmsencryptionpolicy) (custom policy name), if the user wants to enable KMS Key encryption.


3. For EKS cluster, make the following modifcation to the Kubernetes values.yaml file attached to the cluster profile:

```
managedMachinePool:
  #roleName: {{ name of the self-managed role | format "${string}" }}

  ## A list of additional policies to attach to the node group role
  roleAdditionalPolicies:
  - "arn:aws:iam::214575254960:policy/kmswrite"
  - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  ```


# Policies to be attached

The following are the permissions described in the prerequisite section to be attached to the cloud account.
<br />
<br />

<Tabs>

<Tabs.TabPane tab="AmazonEBSCSIDriverPolicy" key="AmazonEBSCSIDriverPolicy">


## AmazonEBSCSIDriverPolicy

<br />
<br />

```{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateSnapshot",
                "ec2:AttachVolume",
                "ec2:DetachVolume",
                "ec2:ModifyVolume",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeInstances",
                "ec2:DescribeSnapshots",
                "ec2:DescribeTags",
                "ec2:DescribeVolumes",
                "ec2:DescribeVolumesModifications"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags"
            ],
            "Resource": [
                "arn:aws:ec2:*:*:volume/*",
                "arn:aws:ec2:*:*:snapshot/*"
            ],
            "Condition": {
                "StringEquals": {
                    "ec2:CreateAction": [
                        "CreateVolume",
                        "CreateSnapshot"
                    ]
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteTags"
            ],
            "Resource": [
                "arn:aws:ec2:*:*:volume/*",
                "arn:aws:ec2:*:*:snapshot/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "aws:RequestTag/ebs.csi.aws.com/cluster": "true"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "aws:RequestTag/CSIVolumeName": "*"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "aws:RequestTag/kubernetes.io/cluster/*": "owned"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/ebs.csi.aws.com/cluster": "true"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/CSIVolumeName": "*"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteVolume"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/kubernetes.io/cluster/*": "owned"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteSnapshot"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/CSIVolumeSnapshotName": "*"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DeleteSnapshot"
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/ebs.csi.aws.com/cluster": "true"
                }
            }
        }
    ]
}
```
<br />
<br />
</Tabs.TabPane>

<Tabs.TabPane tab="KMS Key Encryption Policy" key="Encryption Policy">

## EBSCSIKMSEncryptionPolicy

<br />
<br />

```
{
"Version": "2012-10-17",
"Statement": [
{
"Sid": "VisualEditor0",
"Effect": "Allow",
"Action": [
"kms:GenerateDataKeyWithoutPlaintext",
"kms:CreateGrant"
],
"Resource": "*"
}
]
}
```
</Tabs.TabPane>
</Tabs>

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| storageType | gp2, sc1, st1, io1 | gp2 | AWS Volume type to be used |
| reclaimPolicy | Delete, Retain | Delete | Defines whether volumes will be retained or deleted |
| allowVolumeExpansion | true, false | true | Flag to allow resizing volume |
| isDefaultClass |  true, false | true | Flag to denote if this StorageClass will be the default |
| volumeBindingMode | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen |

## Parameter Support csi-aws-1.0.0 pack manifest

Palette supports a wide list of parameters and cutomization in csi-aws-1.0.0 pack manifest.

* `encrypted`: Denotes whether the EBS volume should be encrypted or not. Valid values are "true" or "false". A string  expected here is either a "true" or “not true”.

* `kmsKeyId`: Optional Parameter, the full Amazon Resource Name of the key to use when encrypting the volume. If none is supplied but encrypted is true, a key is generated by [AWS](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs).

* The above are the two major parameters; find the [extensive list here](https://github.com/kubernetes-sigs/aws-ebs-csi-driver#createvolume-parameters). 

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs
https://aws.amazon.com/ebs/


# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Palette will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```
