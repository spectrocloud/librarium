---
sidebar_position: 0
sidebar_label: "Deploy Cluster Profile Updates"
title: "Deploy Cluster Profile Updates"
description:
  "Learn how to update your deployed clusters using Palette Cluster Profiles. This tutorial teaches you how to: create
  Cluster Profile versions, apply cluster updates and roll back to previous versions. Get started with the basics of
  cluster maintenance in Azure with this hands-on exercise."
tags: ["cluster profiles", "tutorial"]
category: ["tutorial"]
---

Multi cluster environments create administration and maintenance challenges as they grow.

Some of these challenges are:

- Operational Efficiency
  - Increased manual work hours to maintain and update the environment as more clusters are built
- Environment Consistency
  - New clusters may be built with a different profile than its counter parts. This could impact performance of hosted
    services or cause them to fail.
- Configuration Drift
  - Clusters needing matching configurations may not receive them at the same time. This could impact performance of
    hosted services or cause them to fail.

Palette provides cluster profiles, which allow you to specify layers for your workloads using packs, Helm charts, Zarf
packages, or cluster manifests. Packs serve as blueprints to the provisioning and deployment process, as they contain
the versions of the container images that Palette will install for you. Cluster profiles provide consistency across
environments during the cluster creation process, as well as when maintaining your clusters. Check out the
[cluster profiles](../../../profiles/cluster-profiles/cluster-profiles.md) section to learn more about how to create and
use them. Once provisioned, there are three main ways to update your Palette deployments.

| Method                   | Description                                                                        | Cluster application process                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster profile versions | Create a new version of the cluster profile with your updates.                     | Select the new version of the cluster profile. Apply this new profile version to the clusters you want to update.                                                                                          |
| Cluster profile updates  | Change the cluster profile in place.                                               | Palette detects the difference between the provisioned resources and this profile. A pending update is available to clusters using this profile. Apply pending updates to the clusters you want to update. |
| Cluster overrides        | Change the configuration of a single deployed cluster outside its cluster profile. | Save and apply the changes you've made to your cluster.                                                                                                                                                    |

This tutorial will teach you how to update a cluster deployed with Palette to Amazon Web Services (AWS), Microsoft
Azure, or Google Cloud Platform (GCP) cloud providers. You will explore each cluster update method and learn how to
apply these changes using either Palette or Terraform.

:::warning

Palette has backup and restore capabilities available for your mission critical workloads. Ensure that you have adequate
backups before you make any cluster profile version changes in your production environments. You can learn more in the
[Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md) section.

:::

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

## Set Up Clusters

Follow the instructions of the [Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md#ui-workflow)
tutorial to create a cluster profile and cluster with the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application. This tutorial uses Azure and follows the
[Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md#ui-workflow) steps for Azure. Your cluster
should be successfully provisioned and in a healthy state before continuing this tutorial.

Navigate to the left **Main Menu** and select **Clusters**. Select the cluster you created in the **Deploy a Cluster**
tutorial.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page is displayed and the
application is functioning correctly.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.webp)

Your result should be similar to the below screenshot.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

## Creating Cluster Profile Versions

Palette supports the creation of multiple cluster profile versions using the same profile name. This provides you with
better change visibility and control over the layers in your host clusters. Profile versions are commonly used for
adding or removing layers and pack configuration updates.

The version number of a given profile must be unique and use the semantic versioning format `major.minor.patch`. If you
do not specify a version for your cluster profile, it defaults to **1.0.0**.

In Palette, navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page.

Select the cluster profile created during set up from the list of profiles displayed in the **left main menu**.

The current profile version is displayed in the **drop-down Menu** next to the profile name. This profile has the
default value of **1.0.0**, as you did not specify another value when you created it. The cluster profile also shows the
host clusters that are currently deployed with this cluster profile version.

![Image that shows the profile management screen](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_create-new-profile-version-ui.webp)

Click on the version **drop-down Menu**. Select the **Create new version** option.

A dialog box appears. Fill in the **Version** input with **1.1.0**. Click on **Confirm**.

Palette creates a new cluster profile version and opens it. The version dropdown menu now displays the newly created
**1.1.0** profile. This version has the same packs as version 1.0.0 which it was created from.

Select **Add New Pack**

![Image that shows the profile management screen](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-add-new-pack-ui.webp)

Search the **Palette Community Registry** for the **Kubecost** pack and select it.

The next screen shows the configurations that the pack will apply to your cluster. No changes to the manifest are
required for this tutorial. Select **Confirm & Create** to continue.

![Image that shows the pack search screen with inputs to find kubecost pack](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_kubcost-pack-details-ui.webp)

You are now able to confirm the changes you made. Ensure the configuration stack diagram matches what you are expecting.
Click on **Save Changes** to confirm your updates.

![Image that shows the new version of the cluster profile](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_confirm-new-pack-version-ui.webp)

## Deploying Cluster Profile Version Updates

Navigate to the left **Main Menu** and select **Clusters**. Select the cluster you created in the **Deploy a Cluster**
tutorial.

Select the **Profile** tab. This cluster is currently deployed using cluster profile version **1.0.0**. Select the
option **1.1.0** in the version dropdown. The kubecost pack will now display in the profile pack list. Click on **Save**
to confirm your changes.

![Image that shows how to select a new profile version for the cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-version-selection.webp)

Palette now makes the changes required for the cluster to update the cluster to the configuration specifieid in version
**1.1.0** of your cluster profile. Once your changes have completed, Palette marks your layers with the green status
indicator. Click the **Overview** tab to verify that the kubecost pack was installed successfully.

![Image that shows the new cluster profile with kubecost running](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-profile-version.webp)

The kubecost pack is not automatically available using public internet. To access the kube cost ui we will create a port
forward in the Kubernetes cluster.

Download the kubeconfig file for your cluster from the Palette UI. This file enables you and other users to issue
kubectl commands against the host cluster.

![Image that shows the new cluster profile with kubecost running](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_download-kube-config.webp)

Open a new terminal window and set the `KUBECONFIG` environment variable to use the kube config file you downloaded.

```shell
export KUBECONFIG=~/Downloads/admin.aws-cluster.kubeconfig
```

Execute the command below to forward the kubecost ui port to your local network. If port 9090 is already in use, choose
a different port number.

```shell
kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090
```

Open a browser window and navigate to `http://localhost:9090`.

![Image that shows the new cluster profile with kubecost running](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_kubecost-ui.webp)

## Roll back Cluster Profiles

One of the key advantages of using cluster profile versions is that they make it possible to maintain a copy of
previously known working states. The ability to roll back to a previously working cluster profile in one action shortens
the time to recovery in the event of an incident.

The process to roll back to a previous version is identical to the process for applying a new version.

In Palette, navigate to the left **Main Menu** and select **Clusters**. Select the cluster you created in the **Deploy a
Cluster** tutorial.

Select the **Profile** tab. This cluster is currently deployed using cluster profile version **1.1.0**. Select the
option **1.0.0** in the version dropdown. The kubecost pack will no longer be displayed in the profile pack list. Click
on **Save** to confirm your changes.

Select the **Profile** tab. This cluster is currently deployed using cluster profile version **1.1.0**. Select the
option **1.0.0** in the version dropdown. This process is the reverse of what you have done in the previous section,
[Version Cluster Profiles](#Deploying Cluster Profile Version Updates). Click on **Save** to confirm your changes.

Palette now makes the changes required for the cluster to update the cluster to the configuration specifieid in version
**1.0.0** of your cluster profile. Once your changes have completed, Palette marks your layers with the green status
indicator. Click the **Overview** tab to verify that the kubecost pack was successfully removed.

To further verify the pack and all configurations were completely removed, execute the command below. This command will
query your cluster for pods in the `kubecost` namespace.

```shell
kubectl get pods --namespace kubecost
```

The command will fail return the below response confirming all kubecost pods have been removed.

```shell
No resources found in kubecost namespace.
```

Confirm the namespace created by the pack was removed with the command below.

```shell
kubectl get --namespace kubecost
```

Your result should be the same as below.

```shell
Error from server (NotFound): namespaces "kubecost" not found
```

## Cluster Profile Overrides

Cluster profiles can be updated in place and applied to one specific cluster. This method is referred to as a Profile
Override. When using this methed the previous state of the cluster profile will not be saved once it is overwritten.
This method will only push changes to the cluster you specify. All other clusters using the specific profile and version
will not be impacted.

Navigate to the left **Main Menu** and select **Clusters**. Select the cluster you created in the **Deploy a Cluster**
tutorial.

Select the **Profile** tab. Then, select the **hello-universe** manifest. Change the value of the `replicas` field to
`2`. Click on **Save**. The editor closes.

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided
for the single cluster over its cluster profile and begins making the appropriate changes. Select the **Overview** tab
and wait for the **hello-universe** deployment status to turn green.

Once these changes are complete, select the **Workloads** tab. Then, select **namespces** and select the
**hello-universe** namespace.

Two replicas of the **ui** deployment are available, instead of the one specified by your cluster profile. The Palette
UI (User Interface) may take some time to update the change. To force a refresh, select the **refresh** icon next to the
**time duration drop down menu**. Your override has been successfully applied.

![Image that shows the new cluster profile with kubecost running](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-override.webp)

## Cluster Profile In Place Updates

Cluster profiles can be updated in place and applied to all clusters using the modified profile and version. When a
profile version is updated, all clusters using it will display a notification that updates are avialble. You have the
choice of when to apply these updates for each impacted cluster, giving you flexibility to schedule the work around
maintenance windows for each cluster.

Navigate to the left **Main Menu** and select **Profiles**. Select the profile you created in the **Deploy a Cluster**
tutorial.

Select **1.0.0** in the version dropdown.

Select the **hello-universe** manifest. The editor appears. Change the value of the `replicas` field to `3`. Click on
**Confirm Updates**. The editor closes.

Click on **Save Changes** to confirm the changes you have made to your profile.

Navigate to the left **Main Menu** and select **Clusters**. Select the cluster you created in the **Deploy a Cluster**
tutorial. Palette indicates that the cluster associated with the cluster profile you updated has updates available.

![Image that shows the pending updates ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_pending-update-clusters-view.webp)

Select this cluster to open its **Overview** tab. Click on **Updates** to begin the cluster update.

![Image that shows the Updates button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_updates-available-button-cluster-overview.webp)

A dialog appears which shows the changes made in this update. Click on **Review changes in Editor**. As previously,
Palette displays the changes, with the current configuration on the left and the incoming configuration on the right.

Review the changes and ensure the only change is the `replicas` field value. You can choose to maintain your cluster
override or apply the incoming cluster profile update.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_reivew-updates-dialog.webp)

Click on **Apply Changes** once you have finished reviewing your changes. This removes your cluster override.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the
**Workloads** tab. Then, select the **hello-universe** namespace.

Two replicas of the **ui** deployment are available, instead of the one specified by your cluster profile. The Palette
UI (User Interface) may take some time to update the change. To force a refresh, select the **refresh** icon next to the
**time duration drop down menu**.

## Cleanup

Use the following steps to clean up the resources you created for the tutorial.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the **left Main Menu** and select **Clusters** to view the list of clusters. Find and select the cluster you
created

Click on **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete. Repeat the same steps for any other cluster you created.

Once the clusters are deleted, navigate to the left **Main Menu** and click on **Profiles**.

Select the cluster profile created during set up from the list of profiles displayed in the **left main menu**. Click on
the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the selection to remove the
cluster profile. Make sure you delete both versions of this profile.

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Use the `destroy` command to remove all the resources you created through Terraform.

```shell
terraform destroy --auto-approve
```

Output:

```shell
Destroy complete! Resources: 7 destroyed.
```

</TabItem>
</Tabs>

## Wrap-Up

In this tutorial, you updated one cluster profile using two different methods: create a new cluster profile version,
update a cluster profile in place. After you made your changes, the kubecost application was deployed and confirmed
operational. After deployment, you rolled back the cluster profile to a previous version and confirmed all
configurations were removed from the cluster.

Cluster profiles provide consistency during the cluster creation process, as well as when maintaining your clusters.
They can be versioned to keep a record of previously working cluster states, giving you visibility when updating or
rolling back workloads across your environments.

To learn more about Palette, we encourage you to check out the reference resources below.

- [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../../../clusters/clusters.md)

- [Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md)

- [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

- [Hello Universe API GitHub repository](https://github.com/spectrocloud/hello-universe-api)
