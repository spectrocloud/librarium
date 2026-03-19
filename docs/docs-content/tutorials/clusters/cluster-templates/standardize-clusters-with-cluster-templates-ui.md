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

The dev environment requires fewer replicas, so assign `app_replicas`, displayed as **Hello Universe Replicas** in the UI,
a value of `1`. Once that value is set, deploy a cluster from the `cluster-template-aws` cluster template.

1. From the left main menu, select **Clusters > Add New Cluster**.

2. Select **AWS IaaS > Start AWS IaaS Configuration**.

3. On the **Basic Information** page, enter `dev-cluster-aws` as the cluster name. Select the **Cloud Account** value, and then select
   **Next**.

4. On the **Setup Type** page, select **Cluster Template** and **Select Cluster Template**.

5. Select `cluster-template-aws`, and then select **Confirm**.

6. On the **Cluster Template** page, confirm the correct **Maintenance Policy** and **Linked Profiles** are configured, then
   select **Next**.

7. On the **Cluster Profile** page, select **Next**.

8. On the **Profile Config** page, set **Hello Universe Replicas** to `1`. Select **Next**.

9. On the **Cluster Config** page, select the **Region** and **SSH Key Pair Name**. Select **Next**.

10. In **Nodes Config**, under **CONTROL-PLANE-POOL CONFIGURATION > Cloud Configuration**, select
    **General purpose > m4.2xlarge** as the **Instance Type**. Select **Availability zones** if required by your cloud region.

11. In **Nodes Config**, under **WORKER-POOL-CONFIGURATION > Cloud Configuration**, select
    **General purpose > m4.2xlarge** as the **Instance Type**. Select **Availability zones** if required by your cloud region.
    Select **Next**.

12. On the **Cluster Settings** page, under **Cluster Timezone**, set the **Cluster time zone** to **Etc/GMT**. Select
    **Validate**, then **Finish Configuration**.

The cluster deployment may take 15 to 30 minutes. From the left **Main Menu**, select **Clusters** to monitor progress.

Once `dev-cluster-aws` has a **Running** status, validate the deployment.

1. Select `dev-cluster-aws`, and select the **Profile** tab. Confirm it is using `cluster-template-profile-aws`.

2. Select **Configure Values > Profiles Variables Configuration**. Confirm that `Hello Universe Replicas` is set to `1`
   for this dev cluster.

### Deploy a Prod Cluster from the Template

### Validate the Deployments

### Create a New Cluster Profile Version

### Update the Cluster Template to the New Profile Version

### Upgrade Clusters

### Validate the Upgrades

### Cleanup
