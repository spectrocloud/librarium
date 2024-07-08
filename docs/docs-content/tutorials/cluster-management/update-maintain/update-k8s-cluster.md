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

- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resource
  for additional guidance.

  - [Register and Manage AWS Accounts](../../../clusters/public-cloud/aws/add-aws-accounts.md)
  - [Register and Manage Azure Cloud Accounts](../../../clusters/public-cloud/azure/azure-cloud.md)
  - [Register and Manage GCP Accounts](../../../clusters/public-cloud/gcp/add-gcp-accounts.md)

- An SSH Key Pair. Use the [Create and Upload an SSH Key](../../../clusters/cluster-management/ssh-keys.md) guide to
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

Check out the following git tag.

```shell
git checkout v1.1.3
```

Change the directory to the tutorial code.

```shell
cd terraform/iaas-cluster-update-tf/
```

</TabItem>
</Tabs>

## Set Up Clusters

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Follow the instructions of the [Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md#ui-workflow)
tutorial to create a cluster profile and cluster with the
[_hello-universe_](https://github.com/spectrocloud/hello-universe) application. Your cluster should be successfully
provisioned and in a healthy state in the cloud of your choosing.

The cluster profile name follows the pattern `[cloud provider]-profile`. The cluster name follows the pattern
`[cloud provider]-cluster`. This tutorial uses Azure for illustration purposes.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.webp)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page is displayed and the
application is functioning correctly.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile
corresponding to your cluster in the list of profiles. Click on the **three-dot Menu** and select **Clone**.

A dialog appears to confirm the details of the cloned cluster profile. Fill in the **Name** input using the pattern
`[cloud provider]-profile-api`. Click on **Confirm** to create the profile.

The list of cluster profiles appears. Select the cloned cluster profile to view its details.

Select the **hello-universe** manifest. The editor appears. In the manifest editor, replace the existing code with the
following content.

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

The code snippet you added deploys the [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) and
[_hello-universe-db_](https://github.com/spectrocloud/hello-universe-db) applications. These applications serve as the
API server and database for the [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.

Click on **Confirm Updates** and close the editor.

Click on **Save Changes** to confirm your updates.

Deploy this cluster profile to a new cluster using the same steps outlined in the
[Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md#ui-workflow) tutorial.

Once you have completed these steps and the host cluster creation process has finished, navigate to the left **Main
Menu** and select **Clusters** to view your deployed clusters. You should have two healthy clusters.

![Image that shows the two clusters in the clusters list](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-clusters-start-setup.webp)

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Open the **terraform.tfvars** file in the editor of your choice and set variables required for the cloud provider you
will use for your clusters. Check out the
[Deploy a Cluster](../../../clusters/public-cloud/deploy-k8s-cluster.md#deploy-cluster) tutorial for guidance how to
provide the required cloud credentials and configuration. This tutorial uses Azure for demonstration purposes.

When you are done making the required changes, issue the following command to initialize Terraform.

```shell
terraform init
```

Next, issue the `plan` command to preview the changes.

```shell
terraform plan
```

Terraform will display the following output for Azure.

```shell
Plan: 6 to add, 0 to change, 0 to destroy.
```

For AWS and GCP, Terraform will create one less resource.

```shell
Plan: 5 to add, 0 to change, 0 to destroy.
```

If you change the desired cloud provider's toggle variable to `true,` you will receive an output message that the
following new resources are planned.

- A cluster profile and a host cluster for the [_hello-universe_](https://github.com/spectrocloud/hello-universe)
  application.
- A cluster profile and a host cluster for the
  [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application.
- The [_kubeconfig_](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file of the
  provisioned _hello-universe-api_ cluster. This is a local file that is created in your current working directory. You
  will need this file later, so do not to delete it.
- An SSH key required for deployment to Azure. This resource is not created if you choose to deploy to another cloud
  provider.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Make a note of the command output by this step. You will need it later.

Once you have completed these steps and the host cluster creation process has finished, log in to
[Palette](https://console.spectrocloud.com).

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. You should have two healthy
clusters. The cluster with the [_hello-universe_](https://github.com/spectrocloud/hello-universe) application is named
using the pattern `[cloud provider]-cluster`. The cluster with the
[_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application is named using the pattern
`[cloud provider]-cluster-api`.

![Image that shows the two clusters in the clusters list](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-clusters-start-setup.webp)

Select the row corresponding to the `[cloud provider]-cluster` to view its **Overview** tab.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_deployed-FE-cluster.webp)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page is displayed and the
application is functioning correctly.

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-without-api.webp)

</TabItem>
</Tabs>

## Tag and Filter Clusters

Palette provides the ability to add tags to your cluster profiles and clusters. This helps you organize and categorize
your clusters based on your custom criteria. You can add tags during the creation process or by editing the resource
after it has been created.

Adding tags to your clusters helps you find and identify your clusters, without having to rely on cluster naming. This
is especially important when operating with many clusters or multiple cloud deployments.

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

Once you apply the filter, only the `[cloud provider]-cluster` with this tag is displayed.

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

## Version Cluster Profiles

Palette supports the creation of multiple cluster profile versions using the same profile name. This provides you with
better change visibility and control over the layers in your host clusters. Profile versions are commonly used for
adding or removing layers and pack configuration updates.

The version number of a given profile must be unique and use the semantic versioning format `major.minor.patch`. If you
do not specify a version for your cluster profile, it defaults to **1.0.0**.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the
**service:hello-universe-backend** tag. You can review how to filter your clusters in the
[Tag and Filter Clusters](#tag-and-filter-clusters) section.

Select cluster to open its **Overview** tab. Make a note of the IP address of the **hello-universe-api-service** present
in this cluster. You can find it by opening the **:3000** URL.

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile
corresponding to your _hello-universe-frontend_ cluster. It should be named using the pattern
`[cloud provider]-profile`. Select it to view its details.

![Image that shows the frontend cluster profile with cluster linked to it](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-with-cluster.webp)

The current version is displayed in the **drop-down Menu** next to the profile name. This profile has the default value
of **1.0.0**, as you did not specify another value when you created it. The cluster profile also shows the host clusters
that are currently deployed with this cluster profile version.

Click on the version **drop-down Menu**. Select the **Create new version** option.

A dialog box appears. Fill in the **Version** input with **1.1.0**. Click on **Confirm**.

Palette creates a new cluster profile version and opens it. The version dropdown displays the newly created **1.1.0**
profile. This profile version is not deployed to any host clusters.

![Image that shows cluster profile version 1.1.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_new-version-overview.webp)

The version **1.1.0** has the same layers as the version **1.0.0** it was created from. Click on the **hello-universe**
manifest layer. The manifest editor appears.

Replace the code in the editor with the following content.

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
          image: ghcr.io/spectrocloud/hello-universe:1.1.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
          env:
            - name: API_URI
              value: "http://REPLACE_ME:3000"
```

The code snippet you added deploys the [_hello-universe_](https://github.com/spectrocloud/hello-universe) application
with the extra environment variable `API_URI`. This environment variable allows you to specify a hostname and port for
the _hello-universe_ API server. Check out the
[_hello-universe_ readme](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#connecting-to-api-server) to
learn more about how to expand the capabilities of the _hello-universe_ application with an API Server.

Replace the _REPLACE_ME_ placeholder in the code snippet provided with the IP address of the
_hello-universe-api-service_ that you made a note of earlier.

Click on **Confirm Updates**. The manifest editor closes.

Click on **Save Changes** to finish the configuration of this cluster profile version.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the
**service:hello-universe-frontend** tag. Select it to view its **Overview** tab.

Select the **Profile** tab of this cluster. You can select a new version of your cluster profile by using the version
dropdown.

Select the **1.1.0** version.

![Image that shows how to select a new profile version for the cluster](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_profile-version-selection.webp)

Click **Review & Save**. Palette prompts you to preview the change summary.

Click **Review changes in Editor**. Palette displays the changes, with the current configuration on the left and the
incoming configuration on the right. The editor shows that the `API_URI` variable is added to the cluster profile.

Click **Apply Changes**.

![Palette Editor that displays changes coming from the profile version update.](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_editor-changes.webp)

:::warning

Palette has backup and restore capabilities available for your mission critical workloads. Ensure that you have adequate
backups before you make any cluster profile version changes in your production environments. You can learn more in the
[Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md) section.

:::

Palette now makes the required changes to your cluster according to the specifications of the configured cluster profile
version. Once your changes have completed, Palette marks your layers with the green status indicator.

![Image that shows completed cluster profile updates](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_completed-cluster-updates.webp)

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application
indicates that it is connected to the API server.

![Image that shows hello-universe with API server](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-with-api.webp)

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Palette cluster profiles are defined with the Terraform resource
[_spectrocloud_cluster_profile_](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/cluster_profile)
. Six resources defined are defined in the **cluster_profiles.tf** file.

| Name                | Description                                                                                                 | Platform |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `aws-profile`       | Cluster profile for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | AWS      |
| `aws-profile-api`   | Cluster profile for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | AWS      |
| `azure-profile`     | Cluster profile for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | Azure    |
| `azure-profile-api` | Cluster profile for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | Azure    |
| `gcp-profile`       | Cluster profile for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | GCP      |
| `gcp-profile-api`   | Cluster profile for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | GCP      |

The `spectrocloud_cluster_profile` resource provides all the basic information that Palette needs to create the cluster
profile and display its attributes, such as the name, description, and cloud type. The resource also provides the
optional version field, which has a default value of **1.0.0**. You can create another version of the cluster profile by
specifying another resource with the same profile name but with a different version value.

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

The cluster profile resources also specify packs for each of their layers using the
[_pack_](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/cluster_profile#nested-schema-for-pack)
nested schema. Check out the [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md) tutorial to learn more
about creating your own packs.

The **cluster_profiles.tf** file also contains 3 resources that have been commented out, one for each public cloud
provider. They are named using the pattern `[cloud provider]-profile-3tier`. Uncomment the cluster profile resource for
the cloud provider of your choice. This resource has the following key differences compared to the already defined
cluster profiles.

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

This resource declares the version as **1.1.0**. The definition of the `hello-universe` pack has also been modified to
use a different YAML file which uses an environment variable as part of its template. The `hello-universe-3tier.yaml`
manifest has the following content.

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
          image: ghcr.io/spectrocloud/hello-universe:1.1.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
          env:
            - name: API_URI
              value: ${api_uri}
```

The manifest deploys the [_hello-universe_](https://github.com/spectrocloud/hello-universe) application with the extra
environment variable `API_URI`. This environment variable allows you to specify a hostname and port for the
_hello-universe_ API server. Check out the
[_hello-universe_ readme](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#connecting-to-api-server) to
learn more about how to expand the capabilities of the _hello-universe_ application with an API Server.

Find the command output by the `terraform apply` step in the [Set Up Clusters](#set-up-clusters) section. Issue the
command to find the external IP address of the `hello-universe-api-service` that you deployed. It has the following form
on Azure, but may be different for your chosen cloud provider.

```shell
export KUBECONFIG=$(pwd)/azure-cluster-api.kubeconfig && kubectl get service hello-universe-api-service --namespace hello-universe-api --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Open your **terraform.tfvars** file in the code editor of your choice and find the section for your chosen cloud
provider. Each cloud provider has a variable named using the pattern `[cloud provider]-hello-universe-api-uri`. Replace
the `REPLACE_ME` placeholder with the external IP address of your `hello-universe-api-service`.

```hcl hideClipboard
azure-hello-universe-api-uri = "http://REPLACE_ME:3000" # Set IP address of hello-universe API once deployed
```

Open your **clusters.tf** file in the code editor of your choice and find the section for your chosen cloud provider.
This file contains the host cluster definitions that Terraform uses to deploy to Palette. The following six resources
are defined in this file.

| Name                | Description                                                                                         | Terraform resource                                                                                                                    | Platform |
| ------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `aws-cluster`       | Cluster for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws)     | AWS      |
| `aws-cluster-api`   | Cluster for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws)     | AWS      |
| `azure-cluster`     | Cluster for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | [`spectrocloud_cluster_azure`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_azure) | Azure    |
| `azure-cluster-api` | Cluster for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_azure`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_azure) | Azure    |
| `gcp-cluster`       | Cluster for [_hello-universe_](https://github.com/spectrocloud/hello-universe) application.         | [`spectrocloud_cluster_gcp`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_gcp)     | GCP      |
| `gcp-cluster-api`   | Cluster for [_hello-universe-api_](https://github.com/spectrocloud/hello-universe-api) application. | [`spectrocloud_cluster_gcp`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_gcp)     | GCP      |

The cluster terraform resource provides all the definitions Palette requires to create it. The `cluster_profile` nested
schema specifies which cluster profile should be used to deploy the host cluster. The cluster profile currently
configured to be used is the **1.0.0** version of the cluster profile.

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
    name                    = "control-plane-pool"
    count                   = var.azure_control_plane_nodes.count
    instance_type           = var.azure_control_plane_nodes.instance_type
    azs                     = var.azure-use-azs ? var.azure_control_plane_nodes.azs : [""]
    is_system_node_pool     = var.azure_control_plane_nodes.is_system_node_pool
    disk {
      size_gb = var.azure_control_plane_nodes.disk_size_gb
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

Comment out the current cluster profile `id` and uncomment the line below it. This configures the cluster to use the
cluster profile named `[cloud provider]-profile-3tier` with version **1.1.0**. The following snippet shows the expected
configuration on Azure.

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

The plan adds the cluster profile resource that you uncommented and changes the host cluster to use it. It also makes
other minor updates, as well as recreates the local **kubeconfig** file.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Switch back to [Palette](https://console.spectrocloud.com) in the browser.

Navigate to the left **Main Menu** and select **Profiles**. Find the cluster profile that with the name pattern
`tf-[cloud provider]-profile` corresponding to your cloud provider. Select it to view its details.

The version drop-down displays the two versions of this profile. Select option **1.1.0**. The overview of this version
displays the profile layers of this cluster profile and shows that it is in use on one cluster.

![Image that shows TF cluster profile version 1.1.0](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_tf-profile-new-version.webp)

Navigate to the left **Main Menu** and select **Clusters** to view your deployed clusters. Filter for the cluster with
the tag **service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now
indicates that it is connected to the API server.

![Image that shows hello-universe with API server](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_hello-universe-with-api.webp)

</TabItem>
</Tabs>

## Roll back Cluster Profiles

One of the key advantages of using cluster profile versions is that they make it possible to maintain a copy of
previously known working states. The ability to roll back to a previously working cluster profile in one action shortens
the time to recovery in the event of an incident.

The process to roll back to a previous version is identical to the process for applying a new version.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the
**service:hello-universe-frontend** tag. Select it to view its **Overview** tab.

Select the **Profile** tab. This cluster is currently deployed using cluster profile version **1.1.0**. Select the
option **1.0.0** in the version dropdown. This process is the reverse of what you have done in the previous section,
[Version Cluster Profiles](#version-cluster-profiles). Click on **Save** to confirm your changes.

Palette now makes the changes required for the cluster to return to the state specified in version **1.0.0** of your
cluster profile. Once your changes have completed, Palette marks your layers with the green status indicator.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application
indicates that the application has returned to its original state and is no longer connected to the API server.

</TabItem>

<TabItem label="Terraform workflow" value="Terraform">

Open your **clusters.tf** file in the code editor of your choice and find the section for your chosen cloud provider.
Find the resource corresponding to your cluster named with the pattern `[cloud provider]-cluster`.

Swap the `id` defined in the `cluster_profile` nested schema. This configures the cluster to use the cluster profile
named `[cloud provider]-profile` with version **1.0.0**. The following snippet shows the expected configuration on
Azure.

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

The plan makes minor updates to multiple resources. It also updates the cluster in place to use the configured cluster
profile version. The `kubeconfig` file is replaced as well.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Navigate back to [Palette](https://console.spectrocloud.com) in the browser.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag
**service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the URL for port **:8080** to access the Hello Universe application. The landing page of the application now
indicates that the application has returned to its original format and is no longer connected to the API server.

</TabItem>
</Tabs>

## Pending Updates

Cluster profiles can also be updated in place, without the need to create a new cluster profile version. Palette
monitors the state of your clusters and notifies you when updates are available for your host clusters. You may then
choose to apply your changes at a convenient time.

The previous state of the cluster profile will not be saved once it is overwritten.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag
**service:hello-universe-frontend**. Select it to view its **Overview** tab.

Select the **Profile** tab. Then, select the **hello-universe** manifest. Change the `replicas` field to `1` on line
`26`. Click on **Save**. The editor closes.

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided
for the single cluster over its cluster profile and begins making the appropriate changes.

Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

One replica of the **hello-universe-deployment** is available, instead of the two specified by your cluster profile.
Your override has been successfully applied.

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Find the cluster profile
corresponding to your _hello-universe-frontend_ cluster. Its name follows the pattern `[cloud provider]-profile`.

Click on it to view its details. Select **1.0.0** in the version dropdown.

Select the **hello-universe** manifest. The editor appears. Change the `replicas` field to `3` on line `26`. Click on
**Confirm Updates**. The editor closes.

Click on **Save Changes** to confirm the changes you have made to your profile.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of
your clusters match this filter. Palette indicates that the cluster associated with the cluster profile you updated has
updates available.

![Image that shows the pending updates ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_pending-update-clusters-view.webp)

Select this cluster to open its **Overview** tab. Click on **Updates** to begin the cluster update.

![Image that shows the Updates button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_updates-available-button-cluster-overview.webp)

A dialog appears which shows the changes made in this update. Click on **Review changes in Editor**. As previously,
Palette displays the changes, with the current configuration on the left and the incoming configuration on the right.

Review the changes and ensure the only change is the `replicas` field value. You can choose to maintain your cluster
override or apply the incoming cluster profile update.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_available-updates-dialog.webp)

Click on **Apply Changes** once you have finished reviewing your changes. This removes your cluster override.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the
**Workloads** tab. Then, select the **hello-universe** namespace.

Three replicas of the **hello-universe-deployment** are available. The cluster profile update is now reflected by your
cluster.

</TabItem>
<TabItem label="Terraform workflow" value="Terraform">

Switch back to [Palette](https://console.spectrocloud.com) in the browser.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the cluster with the tag
**service:hello-universe-frontend**. Select it to view its **Overview** tab.

Click on the **Profile** tab. Select the **hello-universe** manifest. Change the `replicas` field to `1` on line `26`.
Click on **Save**. The editor closes.

This cluster now contains an override over its cluster profile. Palette uses the configuration you have just provided
for the single cluster over its cluster profile and begins making the appropriate changes.

Once these changes are complete, select the **Workloads** tab. Then, select the **hello-universe** namespace.

One replica of the **hello-universe-deployment** is available, instead of the two specified by your cluster profile.
Your override has been successfully applied.

Open the **hello-universe.yaml** file in the **manifests** folder in the code editor of your choice. Change the value of
the `replicas` field on line `26` to the value `3`.

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

The plan makes minor updates to multiple resources. It also updates the cluster profile named with the pattern
`[cloud provider]-profile` in place to use the updated manifest. The `kubeconfig` file is replaced as well.

To deploy all the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

Navigate back to your [Palette](https://console.spectrocloud.com) tab in the browser.

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of
your clusters match this filter. Palette indicates that the cluster associated with the cluster profile you updated has
an update available.

![Image that shows the pending updates ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_pending-update-clusters-view.webp)

Select this cluster to open its **Overview** tab. Click on **Updates** to begin the cluster update.

![Image that shows the Updates button](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_updates-available-button-cluster-overview.webp)

A dialog appears which shows the changes made in this update. Click on **Review changes in Editor**. As previously,
Palette displays the changes, with the current configuration on the left and the incoming configuration on the right.

Review the changes and ensure the only change is the `replicas` field value. You can choose to maintain your cluster
override or apply the incoming cluster profile update.

![Image that shows the available updates dialog ](/tutorials/deploy-cluster-profile-updates/clusters_cluster-management_deploy-cluster-profile-updates_available-updates-dialog.webp)

Click on **Apply Changes** once you have finished reviewing your changes. This removes your cluster override.

Palette updates your cluster according to cluster profile specifications. Once these changes are complete, select the
**Workloads** tab. Then, select the **hello-universe** namespace.

Three replicas of the **hello-universe-deployment** are available. The changes in the cluster profile update are now
reflected by your cluster.

</TabItem>
</Tabs>

## Cleanup

Use the following steps to clean up the resources you created for the tutorial.

<Tabs groupId="tutorial">
<TabItem label="UI workflow" value="UI">

Navigate to the left **Main Menu** and select **Clusters**. Filter for the clusters with the **service** tag. Both of
the clusters you have created for this tutorial match this filter.

Select one of the clusters to view its **Overview** tab.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete. Repeat the same steps for the other cluster.

Once the clusters are deleted, navigate to the left **Main Menu** and click on **Profiles**.

Find the cluster profile you created named with the pattern `[cloud provider]-profile`. Click on the **three-dot Menu**
to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile. Make sure
you delete both versions of this profile.

Repeat the same steps to the delete the cluster profile named with the pattern `[cloud provider]-profile-api`.

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

In this tutorial, you created two clusters and cluster profiles. After the clusters deployed to your chosen cloud
provider, you updated one cluster profile in through three different methods: create a new cluster profile version,
update a cluster profile in place, and cluster profile overrides. After you made your changes, the Hello Universe
application functioned as a three-tier application with a REST API backend server.

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
