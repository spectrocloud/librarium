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

# Instructions to Setup OCI Registry:
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

Palette parameterizes the AWS ECR registry endpoints to support multiple regions. The variable “{{.spectro.system.aws.region}” is used and replaced based region selected during the deployment. The AWS ECR registry should be deployed in the required regions and can be further synchronized across deployed regions to deploy multi-region support.

Enable multi-region support by attaching the following template string as part of the endpoint:

```json
{{.spectro.system.aws.region}}
```
Hence the required format of the endpoint for multi-region availability is:

```json
<registry-id>.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```
A sample Endpoint: 

```json
214575254960.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```
* Mandatorily includes a default region for enabling multi-region support.
(Eg:, Default region: us-west-1)

* Toggle the “protected” button for protected registry creation and authenticate the AWS account using credentials or STS.
	* For the credentials method of authentication, use the Access Key and Secret Access Key of the role created and validate.
	* For STS, use the unique ARN  of the AWS role and validate.
* Click on confirm to complete the registry creation process.
<WarningBox>
To provision ECR based OCI Authentication make sure that the User's STS Role has the following ECR policy configured.
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
# Use Your OCI Registry

The created registries could be used while creating the cluster profiles.
* While creating full or add-on cluster profiles add Pack Type as Helm charts
* From the Repository menu, select the OCI registry created
* Key in the required chart name with dependant values and versions
* Click done to get your OCI-helm layer added to the cluster profile

<InfoBox>
Spectro Cloud leveraged public registry images to the custom OCI registries.
</InfoBox>
