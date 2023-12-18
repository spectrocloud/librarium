---
sidebar_label: "Deploy Cluster Profile Updates"
title: "Deploy Cluster Profile Updates"
description: "Learn how to update a Kubernetes cluster deployed in a public cloud provider with Palette. "
icon: ""
category: ["tutorial"]
hide_table_of_contents: false
tags: ["public cloud", "aws", "azure", "gcp", "cluster profiles", "tutorial"]
sidebar_position: 240
---
Palette provides cluster profiles, which allow you to specify layers for your workloads using packs, Helm charts or cluster manifests. They serve as blueprints to the provisioning and deployment process, as they contain the versions of the container images that Palette will install for you. Cluster profiles provide consistency across environments during the cluster creation process, as well as when maintaining your clusters. Check out the [cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) section to learn more about how to create and use them. Once provisioned, there are three main ways to update your Palette deployments.

| Method | Description               | Cluster application process |
|--------|---------------------------|-----------------------------|
| Cluster profile versions | Create a new version of the cluster profile with your updates. | Select the new version of the cluster profile. Apply this new profile version to your existing clusters. |
| Cluster profile updates | Change the cluster profile in place. | Palette detects the difference between the already provisioned resources and this profile. A pending update is available to existing clusters using this profile. Apply pending updates to the clusters you want to update. |
| Cluster overrides | Change the configuration of a single deployed cluster outside its cluster profile. | Save and apply the changes you've made to your cluster.|

This tutorial will teach you how to update an existing cluster deployed to Palette with Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) cloud providers. You will explore each cluster update method and learn how to apply these changes using either Palette or Terraform.

## Prerequisites
To complete this tutorial, you will need the following items.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

- A public cloud account from one of these providers:
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)

- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resource for additional guidance.
  - [Register and Manage AWS Accounts](../public-cloud/aws/add-aws-accounts.md)
  - [Register and Manage Azure Cloud Accounts](../public-cloud/azure/azure-cloud.md)
  - [Register and Manage GCP Accounts](../public-cloud/gcp/add-gcp-accounts.md)

- An SSH Key Pair. Use the [Create and Upload an SSH Key](../cluster-management/ssh-keys.md) guide to learn how to create an SSH key and upload it to Palette.

  - AWS users must create an AWS Key pair before starting the tutorial. If you need additional guidance, check out the [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) tutorial.

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

- Basic knowledge of containers.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or another container management tool.
- A public cloud account from one of these providers:
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)
- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resource for additional guidance.
  - [Register and Manage AWS Accounts](../public-cloud/aws/add-aws-accounts.md)
  - [Register and Manage Azure Cloud Accounts](../public-cloud/azure/azure-cloud.md)
  - [Register and Manage GCP Accounts](../public-cloud/gcp/add-gcp-accounts.md)
- The Terraform CLI. Install the [Terraform CLI](https://developer.hashicorp.com/terraform/install) v1.4.0 or greater according to the setup steps for your operating system.
- A Spectro Cloud API key to interact with the Palette API. To create an API key, log in to [Palette](https://console.spectrocloud.com) and click on the user **User Menu** and select **My API Keys**. Next, click on **Add New API Key**. Fill out the required input field, **API Key Name**, and the **Expiration Date**. Click on **Confirm** to create the API key. Copy the key value to your clipboard, as it will only be shown once.

![Image that points to the user drop-down Menu and points to the API key link](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_create_api_key.png)

In your terminal session, issue the following command to export the API key as an environment variable. Replace the placeholder `YourAPIKeyHere` with your previously copied API key. 

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

Check out the following git tag.

```shell
git checkout v1.0.12
```

Change the directory to the tutorial code.

```shell
cd terraform/iaas-cluster-update-tf/
```

</TabItem>
</Tabs>

## Set Up Clusters

This tutorial builds upon the resources and steps outlined in the [Deploy a Cluster](../public-cloud/deploy-k8s-cluster.md) tutorial for creating initial clusters. 

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Follow the instructions of the [Deploy a Cluster](../public-cloud/deploy-k8s-cluster.md#ui-workflow) tutorial to create a cluster profile and cluster running the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. The cluster profile name follows the pattern `[cloud provider]-profile`. Your cluster should be successfully provisioned and in a healthy state in the cloud of your choosing. The cluster name follows the pattern `[cloud provider]-cluster`. This tutorial uses Azure for illustration purposes, so the cluster is named `azure-cluster`.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.png)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now indicates the application is functioning correctly.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.png)

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile corresponding to your cluster in the list of profiles. It is named using the pattern `[cloud provider]-profile`. Click on the **three-dot Menu** and select **Clone**.

![Image that points to the cluster profile Clone button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_clone-profile.png)

A new window will appear to confirm the details of the cloned cluster profile. Fill in the **Name** input using the pattern `[cloud provider]-profile-api`. Click on the **Confirm** button to create the profile.

![Image that shows the cluster clone confirmation dialogue](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_confirm-profile-clone.png)

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cloned cluster profile in the list of profiles. Open it and select the **hello-universe** manifest. The editor will appear. 

![Image that shows manifest editor](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_edit-manifest.png)

In the manifest editor, replace the existing code with the following content.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: hello-universe-api
---
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-api-service
  namespace: hello-universe-api
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  selector:
    app: hello-universe-api
---
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-db-service
  namespace: hello-universe-api
spec:
  type: ClusterIP
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
  selector:
    app: hello-universe-db
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-api-deployment
  namespace: hello-universe-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-universe-api
  template:
    metadata:
      labels:
        app: hello-universe-api
    spec:
      containers:
      - name: hello-universe-api
        image: ghcr.io/spectrocloud/hello-universe-api:1.0.9
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
        env:
          - name: DB_HOST
            value: "hello-universe-db-service.hello-universe-api.svc.cluster.local"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-db-deployment
  namespace: hello-universe-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-universe-db
  template:
    metadata:
      labels:
        app: hello-universe-db
    spec:
      containers:
      - name: hello-universe-db
        image: ghcr.io/spectrocloud/hello-universe-db:1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5432
```

The code snippet you added will deploy the [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) and [*hello-universe-db*](https://github.com/spectrocloud/hello-universe-db) applications. These applications serve as the API server and database for the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application.

Click on **Confirm Updates** and close the editor. Click on **Save Changes** to update the API cluster profile.

Deploy this cluster profile to a new cluster using the same steps outlined in the [Deploy a Cluster](../public-cloud/deploy-k8s-cluster.md#ui-workflow) tutorial. 

Once you have completed these steps and the host cluster creation process has finished, navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. You should have two healthy clusters.

![Image that shows the two clusters in the clusters list](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-clusters-start-setup.png)

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Open the **terraform.tfvars** file in the editor of your choice and set variables required for the cloud provider you will use for your clusters. Check out the [Deploy a Cluster](../public-cloud/deploy-k8s-cluster.md#deploy-cluster) tutorial for guidance how to provide the required cloud credentials and configuration. This tutorial uses Azure for demonstration purposes.

When you are done making the required changes, issue the following command to initialize Terraform.

```shell
terraform init
```

Next, issue the `plan` command to preview the changes.

```shell
terraform plan
```

Output:
```shell
Plan: 6 to add, 0 to change, 0 to destroy.
```

If you change the desired cloud provider's toggle variable to `true,` you will receive an output message that six new resources will be created. The plan contains the following resources.
- A cluster profile and a host cluster for the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application.
- A cluster profile and a host cluster for the [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application.
- The [*kubeconfig*](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file of the provisioned *hello-universe-api* cluster. This is a local file that is created in your current working directory. You will need this file later, so make sure not to delete it.
- An SSH key required for deployment to Azure. This resource will not be created if you choose to deploy to another cloud provider.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Once you have completed these steps and the host cluster creation process has finished, log in to [Palette](https://console.spectrocloud.com). 

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. You should have two healthy clusters. The cluster running the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application is named using the pattern `[cloud provider]-cluster`. The cluster running the [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application is named using the pattern `[cloud provider]-cluster-api`.

![Image that shows the two clusters in the clusters list](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-clusters-start-setup.png)

Select the row corresponding to the  cluster named `[cloud provider]-cluster` to view its **Overview** tab.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.png)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application indicates the application is functioning correctly.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.png)

</TabItem>
</Tabs>

## Tag and Filter Clusters

Palette provides the ability to add tags to your cluster profiles and clusters. This helps you organize and categorize your clusters and environments based on your criteria. You can add tags during the creation process or by editing the resource after it has been created.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Find the cluster you deployed with the *hello-universe* application named `[cloud provider]-cluster`. Click on it to view its **Overview** tab. 

Click on the **Settings** dropdown menu in the upper right corner and click on **Cluster Settings**.

![Image that shows the Settings dropdown menu](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_cluster-settings-dropdown.png)

Fill **service:hello-universe-frontend** in the **Tags (Optional)** input box. Click on **Save Changes** then close the **Settings** panel. 

![Image that shows how to add a cluster tag](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_add-service-tag.png)

Repeat the steps above for the cluster named `[cloud provider]-cluster-api` and add the **service:hello-universe-backend** tag to it. 

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Click the **Add Filter** button then select the **Add custom filter** option.

![Image that shows how to add a custom filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_add-custom-filter.png)

Use the dropdown boxes to fill in the values of the filter. Select **Tags** in the left-hand dropdown menu. Select **is** in the middle dropdown menu. Fill in **service:hello-universe-frontend**. Click on **Apply Filter**. 

![Image that shows how to add a frontend service filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_apply-frontend-filter.png)

Once you apply the filter, only the cluster with this tag will be displayed.

![Image that shows the frontend service filter applied](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_frontend-filter-applied.png)

Adding tags to your clusters will help you find and identify your clusters, without having to rely on cluster naming. This is especially important when operating with many workloads or workloads deployed to multiple clouds. 
 
</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

The Terraform cluster specification that you applied specifie the tags **service:hello-universe-frontend** and **service:hello-universe-backend** to the host clusters created.

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

Log in to [Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Click the **Add Filter** button then select the **Add custom filter** option.

![Image that shows how to add a custom filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_add-custom-filter.png)

Use the dropdown boxes to fill in the values of the filter. Select **Tags** in the left-hand dropdown menu. Select **is** in the middle dropdown menu. Fill in **service:hello-universe-frontend**. Click on **Apply Filter**. 

![Image that shows how to add a frontend service filter](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_apply-frontend-filter.png)

Once you apply the filter, only the cluster with this tag will be displayed.

![Image that shows the frontend service filter applied](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_frontend-filter-applied.png)

Adding tags to your clusters will help you find and identify your clusters, without having to rely on cluster naming. This is especially important when operating with many workloads or workloads deployed to multiple clouds. 

</TabItem>
</Tabs>

## Version Cluster Profiles
 Palette supports the creation of multiple cluster profile versions using the same profile name. This provides you with better change visibility and control over the layers in your host clusters. Profile versions are commonly used for adding/removing layers and pack configuration updates. 
 
 The version number of a given profile must be unique and use the format `major.minor.patch`. If you do not specify a version for your cluster profile, it will have a default value of **1.0.0**.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the **service:hello-universe-backend** tag. You can review how to filter your clusters in the [Tag and Filter Clusters](#tag-and-filter-clusters) section.

Click on the cluster to open its **Overview** tab. Make a note of the IP address of the **hello-universe-api-service** present in this cluster. You will be able to see it at the **:3000** link.

![Image that shows where to get the hello-universe-api-service](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_api-service-ip.png)

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile corresponding to your *hello-universe-frontend* cluster. It should be named using the pattern `[cloud provider]-profile`. Click on it to view its **Overview** tab.

![Image that shows the frontend cluster profile with cluster linked to it](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-with-cluster.png)

The current version is displayed in the dropdown next to the profile name. This profile has the default value of **1.0.0**, as you did not specify another value when you created it. The cluster profile **Overview** tab also shows the host clusters that are currently deployed with this cluster profile version.

Click on the version dropdown and select the **Create new version** option.

![Image that shows how to create a new profile verison](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-with-cluster.png)

A new dialog box appear. Fill in the **Version** input with **1.1.0**. Click **Confirm**. 

![Image that shows the cluster profile version dialog](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_create-profile-version-dialog.png)

Palette will create a new cluster profile version and automatically navigate to its **Overview** tab. The version dropdown now displays the newly created **1.1.0** version. This profile version is not deployed to any host clusters.

![Image that shows cluster profile version 1.1.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_new-version-overview.png)

Click on the **hello-universe** manifest layer. The manifest editor will open and display the manifest contents that you have added to version **1.0.0**.

![Image that shows manifest editor of cluster profile version 1.1.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_manifest-editor-new-version.png)


Replace the existing code in the editor with the following content.

```yaml {41,42,43}
apiVersion: v1
kind: Namespace
metadata:
  name: hello-universe
--- 
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
  namespace: hello-universe
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  selector:
    app: hello-universe
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-deployment
  namespace: hello-universe
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-universe
  template:
    metadata:
      labels:
        app: hello-universe
    spec:
      containers:
      - name: hello-universe
        image: ghcr.io/spectrocloud/hello-universe:1.0.12
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
        env:
          - name: API_URI
            value: "https://REPLACE_ME:3000"
```

The code snippet you added will deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application with the extra environment variable `API_URI`. This environment variable allows you to specify a hostname and port for the *hello-universe* API server to connect to. Check out the [*hello-universe* README](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#connecting-to-api-server) to learn more about how to expand the capabilities of the *hello-universe* application with an API Server.

Replace the *REPLACE_ME* placeholder in the code snippet provided with the IP address of the *hello-universe-api-service* that you made a note of earlier.

Click **Confirm Updates**. The manifest editor closes. 

Click **Save Changes** to finish the configuration of this cluster profile version.

Navigate to the left **Main Menu** and select **Clusters** to your host clusters. Filter for the cluster with the **service:hello-universe-frontend** tag. Click on the cluster to open its **Overview** tab.

Click on the **Profile** tab. 

![Image that shows the profile tab of a cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-tab.png)

You can select a new version of your cluster profile by using the version dropdown. Select the **1.1.0** version.

![Image that shows how to select a new profile version for the cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-version-selection.png)

Click on **Save** to confirm your profile version selection.

:::caution

Palette has backup and restore capabilities available for all your mission critical workloads. Always ensure that you have adequate backups before you make any cluster profile version changes in your production environments. You can learn more in the [Backup and Restore](./backup-restore) section. 

:::

Palette will now make the required changes to your cluster layers and packs according to the specifications of the cluster profile. The time required for the updates to complete could vary based on how extensive the changes applied in your cluster profile version are. Once your changes have completed, Palette will mark your layers with the green status indicator.

![Image that shows completed cluster profile updates](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_completed-cluster-updates.png)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now indicates that it is connected to the the API server.

![Image that shows hello-universe with API server](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-with-api.png)

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Palette cluster profiles are defined with the [*spectrocloud_cluster_profile*](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/cluster_profile) Terraform resource. There are six resources defined in the **cluster_profiles.tf** file.

| Name | Description | Platform |
|----- |-------------|----------|
| `aws-profile` | Cluster profile for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | AWS |
| `aws-profile-api` | Cluster profile for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | AWS |
| `azure-profile` | Cluster profile for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | Azure |
| `azure-profile-api` | Cluster profile for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | Azure |
| `gcp-profile` | Cluster profile for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | GCP |
| `gcp-profile-api` | Cluster profile for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | GCP |

The `spectrocloud_cluster_profile` resource provides all the basic information that Palette needs to display it, such as the name, description and cloud type. It also provides the optional version field, which has a default value of **1.0.0**. You can create another version of the cluster profile by specifying the same name, but different version value. 

```hcl {9} hideClipboard
resource "spectrocloud_cluster_profile" "azure-profile" {
  count = var.deploy-azure ? 1 : 0

  name        = "tf-azure-profile"
  description = "A basic cluster profile for Azure"
  tags        = concat(var.tags, ["env:azure"])
  cloud       = "azure"
  type        = "cluster"
  version     = "1.0.0"
}
```

The cluster profile resources also specify packs for each of their layers using the [*pack*](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/cluster_profile#nested-schema-for-pack) nested schema. Check out the [Deploy a Custom Pack](../../registries-and-packs/deploy-pack.md) tutorial to learn more about creating your own packs.

The **cluster_profiles.tf** file also contains 3 resources that have been commented out, one for each public cloud provider. They are named using the pattern `[cloud provider]-profile-3tier`. Uncomment the cluster profile resource for the provider of your choice. This resource has the following key differences compared to the already defined resources.

```hcl {9,44,45,46,47,48} hideClipboard
resource "spectrocloud_cluster_profile" "azure-profile-3tier" {
  count = var.deploy-azure ? 1 : 0

  name        = "tf-azure-profile"
  description = "A basic cluster profile for Azure"
  tags        = concat(var.tags, ["env:azure"])
  cloud       = "azure"
  type        = "cluster"
  version     = "1.1.0"

  pack {
    name   = data.spectrocloud_pack.azure_ubuntu.name
    tag    = data.spectrocloud_pack.azure_ubuntu.version
    uid    = data.spectrocloud_pack.azure_ubuntu.id
    values = data.spectrocloud_pack.azure_ubuntu.values
  }

  pack {
    name   = data.spectrocloud_pack.azure_k8s.name
    tag    = data.spectrocloud_pack.azure_k8s.version
    uid    = data.spectrocloud_pack.azure_k8s.id
    values = data.spectrocloud_pack.azure_k8s.values
  }

  pack {
    name   = data.spectrocloud_pack.azure_cni.name
    tag    = data.spectrocloud_pack.azure_cni.version
    uid    = data.spectrocloud_pack.azure_cni.id
    values = data.spectrocloud_pack.azure_cni.values
  }

  pack {
    name   = data.spectrocloud_pack.azure_csi.name
    tag    = data.spectrocloud_pack.azure_csi.version
    uid    = data.spectrocloud_pack.azure_csi.id
    values = data.spectrocloud_pack.azure_csi.values
  }

  pack {
    name = "hello-universe"
    type = "manifest"
    tag  = "1.0.0"
    values = ""
    manifest {
      name = "hello-universe"
      content = templatefile("manifests/hello-universe-3tier.yaml", {
        api_uri = var.azure-hello-universe-api-uri
      })
    }
  }
}
```

This resource declares the version as **1.1.0**. The definition of the `hello-universe` pack has also been modified to use a different YAML file which uses an environment variable as part of its template. The `hello-universe-3tier.yaml` manifest has the following content. 

```yaml {41,42,43} hideClipboard
apiVersion: v1
kind: Namespace
metadata:
  name: hello-universe
--- 
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
  namespace: hello-universe
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  selector:
    app: hello-universe
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-deployment
  namespace: hello-universe
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-universe
  template:
    metadata:
      labels:
        app: hello-universe
    spec:
      containers:
      - name: hello-universe
        image: ghcr.io/spectrocloud/hello-universe:1.0.12
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
        env:
          - name: API_URI
            value: ${api_uri}
```

The manifest will deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application with the extra environment variable `API_URI`. This environment variable allows you to specify a hostname and port for the *hello-universe* API server to connect to. Check out the [*hello-universe* README](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#connecting-to-api-server) to learn more about how to expand the capabilities of the *hello-universe* application with an API Server.

Execute the following command in your terminal to find the external IP address of the `hello-universe-api-service` that you deployed in the [Set Up Clusters](#set-up-clusters) section. Replace the placeholder `REPLACE_ME` with the cloud provider that you have chosen to deploy to during this tutorial - `aws`, `azure` or `gcp`. 

```shell
export KUBECONFIG=$(pwd)/REPLACE_ME-cluster-api.kubeconfig && kubectl get service hello-universe-api-service --namespace hello-universe-api --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

This command was also output by your Terraform apply step.

Open your **terraform.tfvars** file in the code editor of your choice and find the section for your chosen cloud provider. Each cloud provider has a variable named using the pattern `[cloud provider]-hello-universe-api-uri`. Replace the `REPLACE_ME` placeholder with the external IP address of your `hello-universe-api-service`. 

```hcl hideClipboard
azure-hello-universe-api-uri = "http://REPLACE_ME:3000" # Set IP address of hello-universe API once deployed
```

The **clusters.tf** file contains the definitions for the host clusters that this plan deploys to Palette. The following six resources are defined in this file

| Name | Description | Terraform resource | Platform |
|----- |-------------|--------------------|----------|
| `aws-cluster` | Cluster for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws) | AWS |
| `aws-cluster-api` | Cluster for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws) | AWS |
| `azure-cluster` | Cluster for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | [`spectrocloud_cluster_azure`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_azure)| Azure |
| `azure-cluster-api` | Cluster for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_azure`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_azure)| Azure |
| `gcp-cluster` | Cluster for [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. | [`spectrocloud_cluster_gcp`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_gcp) | GCP |
| `gcp-cluster-api` | Cluster for [*hello-universe-api*](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_gcp`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_gcp) | GCP |

Open your **clusters.tf** file in the code editor of your choice and find the section for your chosen cloud provider.

The cluster terraform resources provides all the definitions the Palette requires to create it. The `cluster_profile` nested schema specifies which cluster profile should be used to deploy the host cluster. The cluster profile currently configured to be used is the original **1.0.0** version of the cluster profile.

```hcl {15,16,17,18} hideClipboard
resource "spectrocloud_cluster_azure" "azure-cluster" {
  count = var.deploy-azure ? 1 : 0

  name             = "azure-cluster"
  tags             = concat(var.tags, ["env:azure", "service:hello-universe-frontend"])
  cloud_account_id = data.spectrocloud_cloudaccount_azure.account[0].id

  cloud_config {
    subscription_id = var.azure_subscription_id
    resource_group  = var.azure_resource_group
    region          = var.azure-region
    ssh_key         = tls_private_key.tutorial_ssh_key[0].public_key_openssh
  }

  cluster_profile {
    id = spectrocloud_cluster_profile.azure-profile[0].id
    # id = spectrocloud_cluster_profile.azure-profile-3tier[0].id
  }

  machine_pool {
    control_plane           = true
    control_plane_as_worker = true
    name                    = "master-pool"
    count                   = var.azure_master_nodes.count
    instance_type           = var.azure_master_nodes.instance_type
    azs                     = var.azure-use-azs ? var.azure_master_nodes.azs : [""]
    is_system_node_pool     = var.azure_master_nodes.is_system_node_pool
    disk {
      size_gb = var.azure_master_nodes.disk_size_gb
      type    = "Standard_LRS"
    }
  }

  machine_pool {
    name                = "worker-basic"
    count               = var.azure_worker_nodes.count
    instance_type       = var.azure_worker_nodes.instance_type
    azs                 = var.azure-use-azs ? var.azure_worker_nodes.azs : [""]
    is_system_node_pool = var.azure_worker_nodes.is_system_node_pool
  }

  timeouts {
    create = "30m"
    delete = "15m"
  }
}
```

Comment out the current cluster profile id and uncomment the line below it. This will configure the cluster to use the cluster profile named `[cloud provider]-profile-3tier` with version **1.1.0**. The following snippet shows what it should be on Azure.  

```hcl hideClipboard
  cluster_profile {
    # id = spectrocloud_cluster_profile.azure-profile[0].id
    id = spectrocloud_cluster_profile.azure-profile-3tier[0].id
  }
```

Next, issue the `plan` command to preview the changes.

```shell
terraform plan
```

Output:
```shell
Plan: 2 to add, 4 to change, 1 to destroy.
```

The plan will the add cluster profile resource that you uncommented and change the host cluster to use it. It will also make other minor updates and as well as recreate the local **kubeconfig** file.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Log in to [Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Profiles**. Find the cluster profile that with the name pattern `tf-[cloud provider]-profile` corresponding to your cloud provider. Click on it to view its details. The version dropdown displays the two versions of this profile.

![Image that shows the versions of the TF cluster profile](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_tf-profile-versions.png)

Select the option **1.1.0**. The overview of this version displays the profile layers of this cluster profile and shows that it is in use on one cluster.

![Image that shows TF cluster profile version 1.1.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_tf-profile-new-version.png)

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Filter for the cluster with the tag **service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now indicates that it is connected to the the API server.

![Image that shows hello-universe with API server](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-with-api.png)

</TabItem>
</Tabs>

## Roll back Cluster Profiles
One of the key advantages of using cluster profile versions is that they make it possible to maintain a copy of previously known working states. The ability to roll back to a previously working cluster profile will shorten the time to recovery in the event of an incident.

The process to roll back to a previous version is identical to the process for applying a new version.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the **service:hello-universe-frontend** tag. Select it to view its **Overview** tab.

Click on the **Profile** tab. This cluster is currently deployed using cluster profile version **1.1.0**. Select the option **1.0.0** in the version dropdown.

![Image that shows how to select version 1.0.0 of the cluster profile](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_rollback-cluster-profile-version.png)

Click **Save** to confirm your changes. Palette will now make the changes required for the cluster to return to the state specified in version **1.0.0**. Once your changes have completed, Palette will mark your layers with the green status indicator.

![Image that shows completed cluster profile updates](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_completed-cluster-updates.png)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now indicates that the application has returned to its original format and is no longer connected to the API server. 

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.png)

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Open your **clusters.tf** file in the code editor of your choice and find the section for your chosen cloud provider.

Swap the `id` defined in the `cluster_profile` nested schema. This will configure the cluster to use the cluster profile named `[cloud provider]-profile` with version **1.0.0**. The following snippet shows what it should be on Azure. 

```hcl hideClipboard
  cluster_profile {
    id = spectrocloud_cluster_profile.azure-profile[0].id
    # id = spectrocloud_cluster_profile.azure-profile-3tier[0].id
  }
```

Next, issue the `plan` command in your terminal to preview any changes.

```shell
terraform plan
```

Output:
```shell
Plan: 1 to add, 5 to change, 1 to destroy.
```

The plan will make minor updates to multiple resources. It will also update the cluster in place to use the configured cluster profile version. The `kubeconfig` file will be replaced as well.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Log in to [Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag **service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now indicates that the application has returned to its original format and is no longer connected to the API server.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.png)

</TabItem>
</Tabs>

## Pending Updates
Cluster profiles can also be updated in place, without the need to create a new cluster profile version. Palette monitors the state of your clusters and notifies you when updates are available for your existing host clusters. You may then choose to apply your changes at a convenient time.

The previous state of the cluster profile will not be saved once it is overwritten.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag **service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the **Profile** tab. Select the **hello-universe** manifest. Change the `replicas` field to `1` on line `26`.

![Image that shows updating the replicas count to 1 in cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_override-replicas-cluster.png)

Click on **Save**. The editor closes. 

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided for the single cluster over its cluster profile and begins making the appropriate changes.

 Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_select-namespace.png)

There is one replica of the **hello-universe-deployment** available, instead of the two specified by your cluster profile. Your override has been successfully applied.

![Image that shows the number of hello universe deployments](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_cluster-override-applied.png)

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile corresponding to your *hello-universe-frontend* cluster. It should be named using the pattern `[cloud provider]-profile`. 

Click on it to view its **Overview** tab. Select **1.0.0** in the version dropdown. Select the **hello-universe** manifest. The editor will appear. Change the `replicas` field to `3` on line `26`.

![Image that shows updating the replicas count to 3 in profile 1.0.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_update-profile-inplace.png)

 Click **Confirm Updates**. The editor closes.

 Click **Save Changes** to confirm the changes you have made to your profile.

 Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of your clusters match this filter. Palette indicates that the cluster associated with the cluster profile you updated has an update available.

![Image that shows the pending updates ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_pending-update-clusters-view.png)

Select this cluster to open its **Overview** tab. Click the **Updates Available** button to begin the cluster update process.

![Image that shows the Updates Available button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_updates-available-button-cluster-overview.png)

A dialog appears which shows the changes made in this update. Review the changes and ensure the only changes made are the replica count. The pending update maintains the override you have made and will set the replicas to `1`. If you want remove your override, set the replicas count to `3` in this dialog.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_available-updates-dialog.png)

Set the replicas value to `3` in the right hand dialog. Click **Confirm updates** once you have finished reviewing your changes.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

There are three replicas of the **hello-universe-deployment** available. The changes in the cluster profile update are now reflected by your cluster. 

![Image that shows the number of hello universe deployments](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployments-count-updated.png)

</TabItem>
<TabItem label="Terraform workflow" value="Terraform">

Log in to [Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag **service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the **Profile** tab. Select the **hello-universe** manifest. Change the `replicas` field to `1` on line `26`.

![Image that shows updating the replicas count to 1 in cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_tf-override-replicas-cluster.png)

Click on **Save**. The editor closes. 

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided for the single cluster over its cluster profile and begins making the appropriate changes.

 Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_select-namespace.png)

There is one replica of the **hello-universe-deployment** available, instead of the two specified by your cluster profile. Your override has been successfully applied.

![Image that shows the number of hello universe deployments](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_cluster-override-applied.png)

Open the **hello-universe.yaml** file in the **manifests** folder in the code editor of your choice. Change the value of the replicas field on line `26` to the value `3`. 

```hcl 
  replicas: 3 
```

Next, issue the `plan` command in your terminal to preview any changes.

```shell
terraform plan
```

Output:
```shell
Plan: 1 to add, 5 to change, 1 to destroy.
```

The plan will make minor updates to multiple resources. It will also update the cluster profile named with the patter `[cloud provider]-profile` in place to use the updated manifest. The `kubeconfig` file will be replaced as well.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Log in to [Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of your clusters match this filter. Palette indicates that the cluster associated with the cluster profile you updated has an update available.

![Image that shows the pending updates ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_pending-update-clusters-view.png)

Select this cluster to open its **Overview** tab. Click the **Updates Available** button to begin the cluster update process.

![Image that shows the Updates Available button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_updates-available-button-cluster-overview.png)

A dialog appears which shows the changes made in this update. Review the changes and ensure the only changes made are the replica count. The pending update maintains the override you have made and will set the replicas to `1`. If you want remove your override, set the replicas count to `3` in this dialog.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_tf-available-updates-dialog.png)

Set the replicas value to `3` in the right hand dialog. Click **Confirm updates** once you have finished reviewing your changes.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

There are three replicas of the **hello-universe-deployment** available. The changes in the cluster profile update are now reflected by your cluster. 

![Image that shows the number of hello universe deployments](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployments-count-updated.png)

</TabItem>
</Tabs>

## Cleanup
Use the following steps to clean up the resources you created for the tutorial.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of the clusters you have created for this tutorial match this filter.

Select one of the clusters to view its **Overview** tab.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

![Delete cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_delete-cluster.png))

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with the delete step. The deletion process takes several minutes to complete.

Repeat the same steps for the other cluster.

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you created named with the pattern `[cloud provider]-profile`. Click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile. Make sure you delete both versions of this profile.

Repeat the same steps to the delete the second cluster profile name with the pattern `[cloud provider]-profile-api`.

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

In this tutorial, you created two clusters and cluster profiles. After the cluster deployed to your chosen cloud provider, you updated a cluster profile in three different methods: create a new cluster profile version, update cluster profile in place and cluster overrides. After you made your changes, the Hello Universe application functioned as a three-tier application with a REST API backend server.

Cluster profiles provide consistency during the cluster creation process, as well as when maintaining your clusters. They can be versioned to keep a record of previously working cluster states, giving you visibility when updating or rolling back workloads across your environments. 

To learn more about Palette, we encourage you to check out the reference resources below.

- [Cluster Profiles](../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../clusters.md)

- [Backup and Restore](./backup-restore)

- [Deploy a Custom Pack](../../registries-and-packs/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

- [Hello Universe API GitHub repository](https://github.com/spectrocloud/hello-universe-api)
