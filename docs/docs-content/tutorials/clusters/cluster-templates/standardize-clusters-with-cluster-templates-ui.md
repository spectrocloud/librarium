---
sidebar_position: 1
sidebar_label: "Standardize Clusters using the Palette UI"
title: "Standardize Cluster Provisioning and Maintenance with Cluster Templates using the Palette UI"
description:
  "A tutorial that shows how to standardize cluster provisioning, apply maintenance windows, and roll out upgrades using
  cluster templates and the Palette UI."
tags: ["cluster templates", "tutorial", "profiles", "aws", "azure"]
---

<PartialsComponent category="cluster-templates" name="intro" />

In this tutorial, you will:

- Create a cluster profile, a cluster template policy, and a cluster template that uses them together
- Deploy two clusters (`dev` and `prod`) from the same template
- Use
  [cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
  to apply environment-specific settings
- Update the template and upgrade both clusters

You will complete this tutorial using the Palette UI. You will import a cluster profile, create a cluster template with
a maintenance policy, and deploy clusters from it.

## Prerequisites

- A Palette account with permissions to create cluster profiles, cluster template policies, cluster templates, and
  clusters.
- A cloud account registered in Palette. Refer to [AWS](../../../tutorials/getting-started/palette/aws/setup.md),
  [Azure](../../../tutorials/getting-started/palette/azure/setup.md),
  [GCP](../../../tutorials/getting-started/palette/gcp/setup.md), or
  [VMware](../../../tutorials/getting-started/palette/vmware/setup.md) to get started.
- Ensure that the
  [Palette Community Registry](../../../registries-and-packs/registries/registries.md#default-registries) is available
  in your Palette environment.
- kubectl installed locally. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) page for
  further guidance.

## Provision and Upgrade Clusters Using the Palette UI

Use the Palette UI to complete each step in the sections below.

<PartialsComponent category="cluster-templates" name="aws-example-note" />

### Import a Cluster Profile

In this section, you will import a cluster profile into Palette. This profile will be used to deploy two clusters: a
development cluster running fewer application replicas and a production cluster running more.

<PartialsComponent category="cluster-templates" name="cluster-profile-pack-versions" />

The `hello-universe` pack declares an `app_replicas`
[cluster profile variable](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/).
This variable has no value in the profile itself. A cluster template assigns a value for each cluster it manages. This
allows a development cluster and a production cluster to share the same profile while running different replica counts.
The variable is marked `required`, so no cluster can be deployed without a value.

Log in to [Palette](https://console.spectrocloud.com). From the left **Main Menu**, select **Profiles** and click
**Import Cluster Profile**.

In the slide drawer that opens, paste the following JSON snippet for your cloud provider.

<Tabs>

<TabItem label="AWS" value="aws">

```json
{
  "metadata": {
    "name": "cluster-template-profile-aws",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "aws",
      "packs": [
        {
          "name": "ubuntu-aws",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-aws-ebs",
          "type": "spectro",
          "layer": "csi",
          "version": "1.46.0",
          "tag": "1.46.0",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```json
{
  "metadata": {
    "name": "cluster-template-profile-azure",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "azure",
      "packs": [
        {
          "name": "ubuntu-azure",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico-azure",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-azure",
          "type": "spectro",
          "layer": "csi",
          "version": "1.31.2-rev2",
          "tag": "1.31.2-rev2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

</Tabs>

Click **Validate**. A _Validated successfully_ message appears. Click **Confirm**. The `cluster-template-profile-aws`
cluster profile is created.

### Create a Maintenance Policy

A
[cluster template policy](../../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md)
governs how Palette manages the lifecycle of clusters attached to a template. You will use a
[maintenance policy](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md), which defines a
recurring upgrade window.

Create a maintenance policy with a weekly Sunday midnight schedule and a four-hour upgrade window.

1. From the left **Main Menu**, select **Cluster Configurations**.
2. From the top-right of the **Policies** tab, select **Create Policy > Maintenance Policy**.
3. In the **Name** field, enter `cluster-template-policy`.
4. Select **Add Schedule** to open the schedule drawer.
5. In the **Name** field, enter `weekly-sunday`.
6. From the **Schedule** drop-down menu, select **Every week on Sunday at midnight**.
7. Set the **Upgrade window** to **4** hours.
8. Select **Confirm**, then **Next**, then **Finalize**.

The policy appears in the **Policies** list and is ready to attach to a cluster template.

### Create a Cluster Template

A [cluster template](../../../cluster-templates/cluster-templates.md) links a cluster profile and maintenance policy.

Create a cluster template and attach the profile and policy you created in the previous steps.

1. From the left main menu, select **Cluster Configurations**.
2. Select the **Templates** tab and select **Create Template**.
3. Select **AWS IaaS** and select **Start AWS IaaS Configuration**.
4. In the **Name** field, enter `cluster-template-aws`. Select **Next Step**.
5. Select the plus icon next to **Maintenance Policy**. In the **Select a policy** side drawer, locate and select
   `cluster-template-policy`. Select **Confirm**.
6. Select the plus icon next to **Linked Profiles**. In the **Select a profile** drawer, select
   `cluster-template-profile-aws`. Select **Confirm**.
7. From the version drop-down menu, confirm version `1.0.0` is selected.
8. Select **Next Step**, review the configuration, and select **Finalize**.

The template appears in the **Templates** list and is ready to deploy clusters from.

### Deploy a Dev Cluster from the Template

The dev environment requires fewer replicas, so assign `app_replicas`, displayed as **Hello Universe Replicas** in the
UI, a value of `1`. Once that value is set, deploy a cluster from the `cluster-template-aws` cluster template.

From the left main menu, select **Clusters > Add New Cluster**. Select **AWS IaaS > Start AWS IaaS Configuration**.

On the **Basic Information** page, enter `dev-cluster-aws` as the cluster name. Select the **Cloud Account** value, and
then select **Next**.

On the **Setup Type** page, select **Cluster Template** and **Select Cluster Template**. Select `cluster-template-aws`,
and then select **Confirm**.

On the **Cluster Template** page, confirm the correct **Maintenance Policy** and **Linked Profiles** are configured,
then select **Next**.

On the **Cluster Profile** page, select **Next**.

On the **Profile Config** page, set **Hello Universe Replicas** to `1`. Select **Next**.

![Hello Universe Replicas](/hello-universe-replicas.webp)

On the **Cluster Config** page, select the **Region** and **SSH Key Pair Name**. Select **Next**.

In **Nodes Config**, under **CONTROL-PLANE-POOL CONFIGURATION > Cloud Configuration**, select **General purpose >
m4.2xlarge** as the **Instance Type**. Select **Availability zones** if required by your cloud region.

In **Nodes Config**, under **WORKER-POOL-CONFIGURATION > Cloud Configuration**, select **General purpose > m4.2xlarge**
as the **Instance Type**. Select **Availability zones** if required by your cloud region. Select **Next**.

![Cluster Template Instance Type](/cluster-template-instance-type.webp)

On the **Cluster Settings** page, under **Cluster Timezone**, set the **Cluster time zone** to **Etc/GMT**. Select
**Validate**, then **Finish Configuration**.

The cluster deployment may take 15 to 30 minutes. From the left main menu, select **Clusters** to monitor progress.

#### Confirm the Deployment

Once `dev-cluster-aws` has a **Running** status, confirm the deployment. Select `dev-cluster-aws`, and then select the
**Profile** tab. Confirm it is using `cluster-template-profile-aws`. Select **Configure Values > Profiles Variables
Configuration**. Confirm that **Hello Universe Replicas** is set to `1` for this dev cluster.

### Deploy a Prod Cluster from the Template

The prod environment requires more replicas than dev, so assign `app_replicas`, displayed as **Hello Universe Replicas**
in the UI, a value of `2`. Once that value is set, deploy a prod cluster from the `cluster-template-aws` cluster
template.

Follow the same steps as the dev deployment, with two key differences.

On the **Basic Information** page, enter `prod-cluster-aws` as the cluster name.

On the **Profile Config** page, set **Hello Universe Replicas** to `2`.

The cluster deployment may take another 15 to 30 minutes. From the left main menu, select **Clusters** to monitor
progress.

#### Confirm the Deployment

Once `prod-cluster-aws` has a **Running** status, confirm the deployment. Select `prod-cluster-aws`, and then select the
**Profile** tab. Confirm it is using `cluster-template-profile-aws`. Select **Configure Values > Profiles Variables
Configuration**. Confirm that **Hello Universe Replicas** is set to `2` for this prod cluster.

### Validate the Deployments

From the left main menu, select **Clusters**, and then select **dev-cluster-aws**.

When the application is deployed and ready for network traffic, indicated in the **Services** field, Palette exposes the
service URL. Open the URL for port **:8080** to launch the Hello Universe application.

![Screenshot showing how to find the Hello Universe service URL](/hello-universe-service-url.webp)

:::warning

It can take up to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few
moments before opening the service URL to prevent the browser from caching an unresolved DNS request.

:::

![Hello Universe application](/hello-universe-1-3-0.webp)

The `dev-cluster-aws` cluster is serving the Hello Universe application.

Repeat these steps for `prod-cluster-aws` to confirm you can launch the Hello Universe application.

### Create a New Cluster Profile Version

The Kubecost pack provides real-time cost visibility. We recommend creating a new cluster profile version for every
change so clusters on other versions are unaffected. Create version `1.1.0` to add Kubecost. `dev-cluster-aws` and
`prod-cluster-aws` remain on `1.0.0` for now.

In Palette, navigate to the left main menu and select **Profiles**. Select `cluster-template-profile-aws` from the
profile list.

The current version is displayed in the drop-down menu beside the profile name. The default version is **1.0.0**. Select
the version drop-down menu and choose **Create new version**.

In the dialog that appears, enter `1.1.0` in the **Version** field. Select **Confirm**.

Palette creates version `1.1.0` with the same packs as version `1.0.0`. Select **Add New Pack**.

Search the **Palette Community Registry** for the **Kubecost** pack and select it. No changes to the default
configuration are needed for this tutorial. Select **Confirm & Create**.

The configuration stack now shows the Kubecost (cost-analyzer) pack.

![Pack layers with Kubecost](/pack-layers-with-kubecost.webp)

Select **Save Changes** to finalize the new profile version.

### Update the Cluster Template to the New Profile Version

Update the `cluster-template-aws` cluster template to reference profile version `1.1.0`.

From the left main menu, select **Cluster Configurations**. Select the **Templates** tab and select
`cluster-template-aws`. Select the **Policies** tab.

Under **Linked profiles**, locate `cluster-template-profile-aws` and select `1.1.0` in the version drop-down menu.

![Select new profile version](/select-new-profile-version.webp)

Select **Review & Save**.

In the **Changes Summary** dialog, select **Review changes in Editor**.

Then, select **Apply Changes**.

The cluster template now references profile version `1.1.0`. This does not trigger an upgrade. `dev-cluster-aws` and
`prod-cluster-aws` remain on `1.0.0` until the maintenance policy initiates the upgrade.

### Upgrade Clusters

Trigger an upgrade on `cluster-template-aws` to apply profile version `1.1.0` to both clusters.

From the left main menu, select **Cluster Configurations**. Select the **Templates** tab and select
`cluster-template-aws`. Select the **Overview** tab.

Select **Options > Upgrade now**.

![Cluster template overview showing the Upgrade now option](/cluster-template-upgrade-now.webp)

From the left main menu, select **Clusters**, then select either cluster to track the upgrade progress.

The upgrade may take several minutes per cluster. Once complete, Palette marks the Kubecost layer with a green status
indicator.

![Kubecost layer with a green status indicator](/kubecost-green-status.webp)

### Validate the Upgrades

Confirm that both clusters upgraded successfully and that Kubecost is deployed and accessible.

From the left main menu, select **Clusters** and select `dev-cluster-aws`. Confirm it has a **Running** status. Select
the **Profile** tab and confirm the version drop-downs show `1.1.0`.

Select the **Overview** tab and download the kubeconfig file for `dev-cluster-aws`. This file enables you and other
users to issue kubectl commands against the host cluster.

![Download kubeconfig from cluster overview](/download-kubeconfig.webp)

Open a terminal window and set the `KUBECONFIG` environment variable to point to the file you downloaded. Replace
`~/Downloads/admin.dev-cluster-aws.kubeconfig` with the path to your file.

```shell
export KUBECONFIG=~/Downloads/admin.dev-cluster-aws.kubeconfig
```

Forward the Kubecost UI to your local machine. The Kubecost dashboard is not exposed externally by default. The
following command makes it available locally on port **9090**.

```shell
kubectl port-forward --namespace kubecost deployment/cost-analyzer-cost-analyzer 9090
```

Open a browser and navigate to `http://localhost:9090`. The Kubecost dashboard displays cost and resource data for your
cluster. Read more about
[Navigating the Kubecost UI](https://docs.kubecost.com/using-kubecost/navigating-the-kubecost-ui) to make the most of
the cost analyzer.

![Image that shows the Kubecost UI](/getting-started/vmware/getting-started_deploy-manage-k8s-cluster_kubecost.webp)

Once you are done, stop the `kubectl port-forward` command by closing the terminal window it is executing from.

Repeat the same cluster profile version and Kubecost checks for `prod-cluster-aws`.

### Cleanup
