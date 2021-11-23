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


# Overview

Spectro Cloud supports OCI registries that serve a “filesystem bundle” that is unpacked on disk as helm registies. Helm charts hosted in OCI regitries can be added to cluster profiles and deployed to kubernetes clusters. We support all OCI compliant registries.

# Setup OCI Registry:
* Login as Tenant Admin.
* Click On Registries to open Manage Registries.
* Select the OCI Registries tab and click Add New OCI Registry button.
* Provide the following information to the Add OCI registry wizard:
  * Name: An unique registry name
  * Provide registry endpoint
  * OCI Registry type: Basic or ECR
  * Provide authentication details based on registry type
  * Click on confirm to complete the registry creation process.

**BASIC Authentication**

Specify username and password

**ECR Authentication**

Choose one of the following authentcation modes:
* Un-protected mode - No credentials required
* Toggle the “protected” button for protected registry creation and authenticate the AWS account using credentials or STS.
	* For the credentials method of authentication, use the Access Key and Secret Access Key of the role created and validate.
	* For STS, use the unique ARN  of the AWS role and validate.

<WarningBox>
To provision ECR based OCI Authentication make sure that the User's STS Role has the ECR policy configured.
</WarningBox>

# ECR Policy:

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
# Multi-Region Support for AWS ECR registries:

Palette supports paremeterization of AWS ECR registry endpoint to support cross-region replicated registries. For performance considerations, Helm chart content may be replicated across multiple AWS reqions and served to the clusters from within region of cluster deployment. To support this, the variable “{{.spectro.system.aws.region}” can be used in the registry endpoint. This variable is substituted at the time of cluster deployment with the region selected for deployment. 


Region Parameter:

```json
{{.spectro.system.aws.region}}
```
Endpoint format:

```json
<registry-id>.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```
A sample Endpoint: 

```json
214575254960.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```

A default region must be specified to fallback to when the deployment region does not contain the requested helm chart.
(Eg:, Default region: us-west-1)


# Use Your OCI Registry

Charts from the OCI reistries can be used in your cluster profiles as follows:
* From the Repository menu, select the desired OCI registry.
* Key in the required chart name and version. The name and version should exactly match the chart name and version hosted in the OCI registry.
* Click done to get your OCI-helm layer added to the cluster profile.

