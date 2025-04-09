---
sidebar_position: 0
sidebar_label: "Tag and Filter Clusters"
title: "Tag and Filter Clusters"
description:
  "Learn how to apply tags to your clusters to make administration easier. This tutorial teaches you how to: create
  Cluster Profile versions, apply cluster updates and roll back to previous versions. Get started with the basics of
  cluster maintenance in Azure with this hands-on exercise."
tags: ["cluster profiles", "tutorial"]
category: ["tutorial"]
---

Palette provides the ability to add tags to your cluster profiles and clusters. This helps you organize and categorize
your clusters based on your custom criteria. You can add tags during the creation process or by editing the resource
after it has been created.

Adding tags to your clusters helps you find and identify your clusters, without having to rely on cluster naming. This
is especially important when operating with many clusters or multiple cloud deployments.

## Prerequisites

This tutorial builds upon the resources and steps outlined in the
[Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md) tutorial for creating initial clusters. To
complete it, you will need the following items.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

- A public cloud account from one of these providers:

  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)

- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resources
  for additional guidance.

  - [Register and Manage AWS Accounts](../../../clusters/public-cloud/aws/add-aws-accounts.md)
  - [Register and Manage Azure Cloud Accounts](../../../clusters/public-cloud/azure/azure-cloud.md)
  - [Register and Manage GCP Accounts](../../../clusters/public-cloud/gcp/add-gcp-accounts.md)

- An SSH Key Pair. Use the [Create and Upload an SSH Key](../../../clusters/cluster-management/ssh/ssh-keys.md) guide to
  learn how to create an SSH key and upload it to Palette.

  - AWS users must create an AWS Key pair before starting the tutorial. If you need additional guidance, check out the
    [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html)
    tutorial.

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

- Basic knowledge of containers.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), [Podman](https://podman.io/docs/installation) or
  another container management tool.
- A public cloud account from one of these providers:
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)
- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resource
  for additional guidance.
  - [Register and Manage AWS Accounts](../../../clusters/public-cloud/aws/add-aws-accounts.md)
  - [Register and Manage Azure Cloud Accounts](../../../clusters/public-cloud/azure/azure-cloud.md)
  - [Register and Manage GCP Accounts](../../../clusters/public-cloud/gcp/add-gcp-accounts.md)
- Install the [Terraform CLI](https://developer.hashicorp.com/terraform/install) v1.4.0 or greater according to the
  setup steps for your operating system.
- A Spectro Cloud API key is required to interact with the Palette API. Use the
  [Create API Key](../../../user-management/authentication/api-key/create-api-key.md) guide to learn how to create one.

In your terminal session, issue the following command to export the API key as an environment variable. Replace the
placeholder `YourAPIKeyHere` with your previously copied API key.

```shell
export SPECTROCLOUD_APIKEY=YourAPIKeyHere
```

Open a terminal window and download the tutorial code from GitHub.

```shell
git clone git@github.com:spectrocloud/tutorials.git
```

Change the directory to the tutorial folder.

```shell
cd tutorials/
```

<PartialsComponent category="tutorials" name="checkout-tutorials-tag" />

Change the directory to the tutorial code.

```shell
cd terraform/iaas-cluster-update-tf/
```

</TabItem>
</Tabs>

## Tag and Filter Clusters

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Find the
`[cloud provider]-cluster` you deployed with the _hello-universe_ application. Click on it to view its **Overview** tab.

Click on the **Settings** dropdown menu in the upper right corner and select **Cluster Settings**.

Fill **service:hello-universe-frontend** in the **Tags (Optional)** input box. Click on **Save Changes**. Close the
panel.

![Image that shows how to add a cluster tag](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_add-service-tag.webp)

Repeat the steps above for the `[cloud provider]-cluster-api` cluster you deployed with the _hello-universe-api_. Add
the **service:hello-universe-backend** tag to it.

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Click on **Add Filter**, then
select the **Add custom filter** option.

Use the drop-down boxes to fill in the values of the filter. Select **Tags** in the left-hand **drop-down Menu**. Select
**is** in the middle **drop-down Menu**. Fill in **service:hello-universe-frontend** in the right-hand input box.

Click on **Apply Filter**.

![Image that shows how to add a frontend service filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_apply-frontend-filter.webp)

Once you apply the filter, only the cluster you created during setup has this tag and is displayed.

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

The Terraform cluster specification that you applied specifies the tags **service:hello-universe-frontend** and
**service:hello-universe-backend** to the host clusters created.

```hcl {5,13} hideClipboard
resource "spectrocloud_cluster_azure" "azure-cluster" {
  count = var.deploy-azure ? 1 : 0

  name             = "azure-cluster"
  tags             = concat(var.tags, ["env:azure", "service:hello-universe-frontend"])
  cloud_account_id = data.spectrocloud_cloudaccount_azure.account[0].is
}

resource "spectrocloud_cluster_azure" "azure-cluster-api" {
  count = var.deploy-azure ? 1 : 0

  name             = "azure-cluster-api"
  tags             = concat(var.tags, ["env:azure", "service:hello-universe-backend"])
  cloud_account_id = data.spectrocloud_cloudaccount_azure.account[0].id
}
```

Navigate back to your [Palette](https://console.spectrocloud.com) tab in the browser.

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Click on **Add Filter**, then
select the **Add custom filter** option.

Use the dropdown boxes to fill in the values of the filter. Select **Tags** in the left-hand dropdown menu. Select
**is** in the middle dropdown menu. Fill in **service:hello-universe-frontend** in the right-hand input box.

Click on **Apply Filter**.

![Image that shows how to add a frontend service filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_apply-frontend-filter.webp)

Once you apply the filter, only the `[cloud provider]-cluster` with this tag is displayed.

</TabItem>
</Tabs>
