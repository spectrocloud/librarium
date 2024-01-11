---
sidebar_label: "OCI Registry"
title: "Spectro Cloud OCI Registry"
description: "creation and usages of OCI Registry within Spectro Cloud"
icon: ""
hide_table_of_contents: false
sidebar_position: 70
---



Palette supports OCI registries to serve the “filesystem bundle” unpacked on disk as helm registries. Helm charts hosted in OCI registries can be added to cluster profiles and deployed to Kubernetes clusters. We support all OCI complaint registries.

## Setup OCI Registry:

* Login as **Tenant Admin**.


* Click **Registries** to open **Manage Registries**.


* Select the **OCI Registries** tab and click **Add New OCI Registry** button.


* Provide the following information to the Add OCI registry wizard:
     * Name: An unique registry name
     * Provide registry endpoint
     * OCI Authentication type: Basic or ECR
     * Provide authentication details based on the authentication type selected


* Click on **Confirm** to complete the registry creation process.


* Once the registry is created, and charts are added, they can be [attached as part of an add-on cluster profile](#use-your-oci-registry).

# BASIC Authentication of Azure Container Registry

Palette supports basic authentication for [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal?tabs=azure-cli). Azure Container Registry is a private registry service for building, storing, and managing container images and related artifacts. 

## Pre-requisite

In Azure portal:

 * Create Azure Container Registry.


 * Go to Azure Container Registry, select AccessKeys and enable AdminUser to generate the password.
 
## How to authenticate:

 * Go to Palette Console,Create OCI Registry providing the following details:

    * EndPoint : Azure Container Registry Details - Login server End Point
    * Username : Azure Container Registry UserName
    * Password : Azure Container Registry Password
    * Authentication type : Basic

## Amazon ECR Authentication

Choose among one of the following ECR protection modes:
* Un-protected Mode: No credentials required.


* Protected Mode: Toggle the “protected” button for protected registry creation and authenticate the AWS account using credentials or STS.
	* For the credentials method of authentication, use the Access Key and Secret Access Key of the role created and validate the credentials.
	* For STS, use the unique ARN  of the AWS role and validate.

:::caution
To provision ECR based OCI Authentication make sure that the User's STS Role has the ECR policy configured.
:::

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
## Multi-Region Support for AWS ECR registries:

Palette supports the parameterization of AWS ECR registry endpoint to support cross-region replicated registries. For performance considerations, Helm chart content may be replicated across multiple AWS regions and served to the clusters from within the region of cluster deployment. To support this, the variable “\{\{.spectro.system.aws.region}}” can be used in the registry endpoint. This variable is substituted at the time of cluster deployment with the region selected for deployment. 


**Region Parameter:**

```json
{{.spectro.system.aws.region}}
```
**Endpoint format:**

```json
<registry-id>.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```
**A sample Endpoint:**

```json
214575254960.dkr.ecr.{{.spectro.system.aws.region}}.amazonaws.com
```
Specify a default region to fall back to when the deployment region does not contain the requested helm chart.
(Eg:, Default region: us-west-1)

## Use Your OCI Registry
Charts from the OCI registry can be used in your **Add on** cluster profiles as follows:
* From the Repository menu, select the desired OCI registry.


* Key in the required chart name and version. The name and version should exactly match the chart name and version hosted in the OCI registry.


* Click done to get your OCI-helm layer added to the cluster profile.

