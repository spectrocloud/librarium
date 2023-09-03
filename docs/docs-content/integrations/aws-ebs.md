---
sidebar_label: 'AWS-EBS'
title: 'AWS EBS'
description: 'AWS EBS storage add on into Spectro Cloud'
type: "integration"
category: ['storage', 'amd64','fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/csi-aws/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
tags: ["packs", "aws-ebs", "storage"]
---


AWS Elastic Block Store is an easy to use, high performance block storage at any scale. It helps in the easy deployment, management, and scaling of the most demanding and high-performance tenant workloads. AWS EBS also ensures availability with replication and durability.

## Prerequisites

Palette requires the following IAM policies to be attached to the IAM role that is used to create the cluster:

- The AWS managed policy `AmazonEBSCSIDriverPolicy`.

- For AWS Key Management Service (KMS) encryption, refer to the [KMS Encryption Policy](#kms-encryption-policy) section.

## Versions Supported

<Tabs queryString="version">

<TabItem label="1.12.x" value="1.12.x">

* **1.12.0**

</TabItem>

<TabItem label="1.10.x" value="1.10.x">

* **1.10.0**

</TabItem>

<TabItem label="1.8.x" value="1.8.x">

* ** 1.8.0**

</TabItem>

<TabItem label="1.5.x" value="1.5.x">

* ** 1.5.1**

</TabItem>
</Tabs>


## KMS Encryption Policy

If you want to use KMS encryption, you must attach the following IAM policy to the Palette IAM role that is used to create the cluster.

```json
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

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| storageType | gp2, sc1, st1, io1 | gp2 | AWS Volume type to be used. |
| reclaimPolicy | Delete, Retain | Delete | Defines whether volumes will be retained or deleted. |
| allowVolumeExpansion | true, false | true | Flag to allow resizing a volume. |
| isDefaultClass |  true, false | true | Flag to denote if this StorageClass will be the default. |
| volumeBindingMode | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen. |
| encrypted | true, false | true | Denotes whether the EBS volume should be encrypted or not. |
| kmsKeyId (optional) | The full Amazon Resource Name of the key to use when encrypting the volume. | -- | If you don't provide the full Amazon Resource Name but **encrypted** is true, AWS [generates a key](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs). |


You can view the full parameter list [here](https://github.com/kubernetes-sigs/aws-ebs-csi-driver#createvolume-parameters).


Storage classes that Palette creates are named `spectro-storage-class` and can be fetched from kubectl using the following CLI command:


```bash
kubectl get storageclass --all-namespaces
```


## References

- [AWS EBS](https://aws.amazon.com/ebs/)


- [AWS EBS Storage Class Details](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs)
