---
title: "OCI Registry"
metaTitle: "Spectro Cloud OCI Registry"
metaDescription: "creation and usages of OCI Registry within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";


# OCI Registry

Spectro Cloud leverages OCI registries to run a “filesystem bundle” that is unpacked on disk. Open container initiative is an open governance structure to create open industry standards around container formats and runtimes. We support all OCI Registries which are compliant with OCI.

## Instructions to Setup OCI Registry:
* Login as Tenant Admin
* Click On Registries to open Manage Registries
* Select the OCI Registries tab and click Add New OCI Registry button 
* Provide the following information to the Add OCI registry wizard,
  * Name: An unique registry name
  * OCI Authentication type: Basic and ECR based OCI Authentication.

**BASIC Authentication**

To configure the Basic OCI Authentication for your OCI registry,
* Provide the unique Name, Endpoint, User Name, and Password. 
* Click on confirm to complete the registry creation process.

**ECR Authentication**

* To provision, your OCI registry in un-protected mode provide the endpoint and confirm creation.
* Toggle the “protected” button for protected registry creation and authenticate the AWS user using credentials or STS.
	* For the credentials method of authentication, use the Access Key and Secret Access Key of the AWS account.
	* For STS, use the unique ARN  of the AWS Account.
* Click on confirm to complete the registry creation process.
<WarningBox>
To provision ECR based OCI Authentication make sure that the User's STS Role has the following policy created.
</WarningBox>

## ECR Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ecr-public:DescribeRegistries",
                "ecr:DescribeImageReplicationStatus",
                "ecr:ListTagsForResource",
                "ecr:ListImages",
                "ecr:DescribeRepositories",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetLifecyclePolicy",
                "ecr-public:DescribeImageTags",
                "ecr-public:DescribeImages",
                "ecr:GetRegistryPolicy",
                "ecr-public:GetAuthorizationToken",
                "ecr:DescribeImageScanFindings",
                "ecr:GetLifecyclePolicyPreview",
                "ecr:GetDownloadUrlForLayer",
                "ecr-public:GetRepositoryCatalogData",
                "ecr:DescribeRegistry",
                "ecr:GetAuthorizationToken",
                "ecr-public:GetRepositoryPolicy",
                "ecr-public:DescribeRepositories",
                "ecr:BatchGetImage",
                "ecr:DescribeImages",
                "ecr-public:GetRegistryCatalogData",
                "ecr-public:ListTagsForResource",
                "ecr-public:BatchCheckLayerAvailability",
                "ecr:GetRepositoryPolicy"
            ],
            "Resource": "*"
        }
    ]
}
```
