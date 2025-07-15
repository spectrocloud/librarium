---
sidebar_label: "Scale, Upgrade, and Secure Clusters"
title: "Scale, Upgrade, and Secure Clusters"
description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to VMware."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
pagination_next: tutorials/getting-started/additional-capabilities/additional-capabilities
tags: ["getting-started", "vmware", "tutorial"]
---

Palette has in-built features to help with the automation of Day-2 operations. Upgrading and maintaining a deployed
cluster is typically complex because you need to consider any possible impact on service availability. Palette provides
out-of-the-box functionality for upgrades, observability, granular Role Based Access Control (RBAC), backup, and
security scans.

This tutorial will teach you how to use the Palette UI to perform scale and maintenance tasks on your clusters. You will
learn how to create Palette projects and teams, import a cluster profile, safely upgrade the Kubernetes version of a
deployed cluster and scale up your cluster nodes. The concepts you learn about in the Getting Started section are
centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-scale-secure-cluster-intro" />

## Prerequisites

To complete this tutorial, follow the steps described in the [Set up Palette with VMware](./setup.md) guide to
authenticate Palette for use with your VMware vSphere account.

Follow the steps described in the [Deploy a PCG](./deploy-pcg.md) tutorial to deploy a VMware vSphere Private Cloud
Gateway (PCG).

Additionally, you should install kubectl locally. Use the Kubernetes
[Install Tools](https://kubernetes.io/docs/tasks/tools/) page for further guidance.

## Create Palette Projects

Palette projects help you organize and manage cluster resources, providing logical groupings. They also allow you to
manage user access control through RBAC. You can assign users and teams with specific roles to specific projects. All
resources created within a project are scoped to that project and only available to that project, but a tenant can have
multiple projects.

Log in to [Palette](https://console.spectrocloud.com).

Click on the **drop-down Menu** at the top of the page and switch to the **Tenant Admin** scope. Palette provides the
**Default** project out-of-the-box.

![Image that shows how to select tenant admin scope](/getting-started/getting-started_scale-secure-cluster_switch-tenant-admin-scope.webp)

Navigate to the left **Main Menu** and click on **Projects**. Click on the **Create Project** button. The **Create a new
project** dialog appears.

Fill out the input fields with values from the table below to create a project.

| Field       | Description                         | Value                                                     |
| ----------- | ----------------------------------- | --------------------------------------------------------- |
| Name        | The name of the project.            | `Project-ScaleSecureTutorial`                             |
| Description | A brief description of the project. | Project for Scale, Upgrade, and Secure Clusters tutorial. |
| Tags        | Add tags to the project.            | `env:dev`                                                 |

Click **Confirm** to create the project. Once Palette finishes creating the project, a new card appears on the
**Projects** page.

Navigate to the left **Main Menu** and click on **Users & Teams**.

Select the **Teams** tab. Then, click on **Create Team**.

Fill in the **Team Name** with **scale-secure-tutorial-team**. Click on **Confirm**.

Once Palette creates the team, select it from the **Teams** list. The **Team Details** pane opens.

On the **Project Roles** tab, click on **New Project Role**. The list of project roles appears.

Select the **Project-ScaleSecureTutorial** from the **Projects** drop-down. Then, select the **Cluster Profile Viewer**
and **Cluster Viewer** roles. Click on **Confirm**.

![Image that shows how to select team roles](/getting-started/getting-started_scale-secure-cluster_select-team-roles.webp)

Any users that you add to this team inherit the project roles assigned to it. Roles are the foundation of Palette's RBAC
enforcement. They allow a single user to have different types of access control based on the resource being accessed. In
this scenario, any user added to this team will have access to view any cluster profiles and clusters in the
**Project-ScaleSecureTutorial** project, but not modify them. Check out the
[Palette RBAC](../../../../user-management/palette-rbac/palette-rbac.md) section for more details.

Navigate to the left **Main Menu** and click on **Projects**.

Click on **Open project** on the **Project-ScaleSecureTutorial** card.

![Image that shows how to open the tutorial project](/getting-started/getting-started_scale-secure-cluster_open-tutorial-project.webp)

Your scope changes from **Tenant Admin** to **Project-ScaleSecureTutorial**. All further resources you create will be
part of this project.

## Import a Cluster Profile

Palette provides three resource contexts. They help you customize your environment to your organizational needs, as well
as control the scope of your settings.

| Context | Description                                                                              |
| ------- | ---------------------------------------------------------------------------------------- |
| System  | Resources are available at the system level and to all tenants in the system.            |
| Tenant  | Resources are available at the tenant level and to all projects belonging to the tenant. |
| Project | Resources are available within a project and not available to other projects.            |

All of the resources you have created as part of your Getting Started journey have used the **Project** context. They
are only visible in the **Default** project. Therefore, you will need to create a new cluster profile in
**Project-ScaleSecureTutorial**.

Navigate to the left **Main Menu** and click on **Profiles**. Click on **Import Cluster Profile**. The **Import Cluster
Profile** pane opens.

Paste the following in the text editor. Click on **Validate**.

<PartialsComponent category="getting-started" name="import-hello-uni-vmware" />

Click on **Confirm**. Palette creates a new cluster profile named **vmware-profile**.

On the **Profiles** list, select **Project** from the **Contexts** drop-down. Your newly created cluster profile
displays. The Palette UI confirms that the cluster profile was created in the scope of the
**Project-ScaleSecureTutorial**.

![Image that shows the cluster profile ](/getting-started/vmware/getting-started_scale-secure-cluster_cluster-profile-created.webp)

Select the cluster profile to view its details. The cluster profile summary appears.

This cluster profile deploys the [Hello Universe](https://github.com/spectrocloud/hello-universe) application using a
pack. Click on the `hellouniverse 1.2.0` layer. The pack manifest editor appears.

Click on **Presets** on the right-hand side. You can learn more about the pack presets on the pack README, which is
available in the Palette UI. Select the **Enable Hello Universe API** preset. The pack manifest changes accordingly.

![Screenshot of pack presets](/getting-started/vmware/getting-started_scale-secure-cluster_pack-presets.webp)

The pack requires two values to be replaced for the authorization token and for the database password when using this
preset. Replace these values with your own base64 encoded values. The
[_hello-universe_](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#single-load-balancer) repository
provides a token that you can use.

Click on **Confirm Updates**. The manifest editor closes.

Click on the **lb-metallb-helm** layer. The pack manifest editor appears.

Replace the predefined `192.168.10.0/24` IP CIDR listed below the **addresses** line with a valid IP address or IP range
from your VMware environment to be assigned to your load balancer.

![MetalLb Helm-based pack.](/getting-started/vmware/getting-started_scale-secure-cluster_metallb-pack.webp)

Click on **Confirm Updates**. The manifest editor closes. Then, click on **Save Changes** to save your updates.

## Deploy a Cluster

Navigate to the left **Main Menu** and select **Clusters**. Click on **Create Cluster**.

Palette will prompt you to select the type of cluster. Select **VMware** and click on **Start VMware Configuration**.

Continue with the rest of the cluster deployment flow using the cluster profile you created in the
[Import a Cluster Profile](#import-a-cluster-profile) section, named **vmware-profile**. Refer to the
[Deploy a Cluster](./deploy-k8s-cluster.md#deploy-a-cluster) tutorial for additional guidance or if you need a refresher
of the Palette deployment flow.

### Verify the Application

Navigate to the left **Main Menu** and select **Clusters**.

Select your cluster to view its **Overview** tab.

When the application is deployed and ready for network traffic, Palette exposes the service URL in the **Services**
field. Click on the URL for port **:8080** to access the Hello Universe application.

![Cluster details page with service URL highlighted](/getting-started/vmware/getting-started_scale-secure-cluster_service_url.webp)

## Upgrade Kubernetes Versions

Regularly upgrading your Kubernetes version is an important part of maintaining a good security posture. New versions
may contain important patches to security vulnerabilities and bugs that could affect the integrity and availability of
your clusters.

Palette supports three minor Kubernetes versions at any given time. We support the current release and the three
previous minor version releases, also known as N-3. For example, if the current release is 1.29, we support 1.28, 1.27,
and 1.26.

:::warning

Once you upgrade your cluster to a new Kubernetes version, you will not be able to downgrade.

:::

We recommend using cluster profile versions to safely upgrade any layer of your cluster profile and maintain the
security of your clusters. Expand the following section to learn how to create a new cluster profile version with a
Kubernetes upgrade.

<details>

<summary>Upgrade Kubernetes using Cluster Profile Versions</summary>

Navigate to the left **Main Menu** and click on **Profiles**. Select the cluster profile that you used to deploy your
cluster, named **vmware-profile**. The cluster profile details page appears.

Click on the version drop-down and select **Create new version**. The version creation dialog appears.

Fill in **1.1.0** in the **Version** input field. Then, click on **Confirm**. The new cluster profile version is created
with the same layers as version **1.0.0**.

Select the `kubernetes 1.27.x` layer of the profile. The pack manifest editor appears.

Click on the **Pack Version** dropdown. All of the available versions of the **Palette eXtended Kubernetes** pack
appear. The cluster profile is configured to use the latest patch version of **Kubernetes 1.27**.

![Cluster profile with all Kubernetes versions](/getting-started/vmware/getting-started_scale-secure-cluster_kubernetes-versions.webp)

The official guidelines for Kubernetes upgrades recommend upgrading one minor version at a time. For example, if you are
using Kubernetes version 1.26, you should upgrade to 1.27, before upgrading to version 1.28. You can learn more about
the official Kubernetes upgrade guidelines in the
[Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/) page.

Select **1.28.x** from the version dropdown. This selection follows the Kubernetes upgrade guidelines as the cluster
profile is using **1.27.x**.

The manifest editor highlights the changes made by this upgrade. Once you have verified that the upgrade changes
versions as expected, click on **Confirm changes**.

Click on **Confirm Updates**. Then, click on **Save Changes** to persist your updates.

Navigate to the left **Main Menu** and select **Clusters**. Select your cluster to view its **Overview** tab.

Select the **Profile** tab. Your cluster is currently using the **1.0.0** version of your cluster profile.

Change the cluster profile version by selecting **1.1.0** from the version drop-down. Click on **Review & Save**. The
**Changes Summary** dialog appears.

Click on **Review changes in Editor**. The **Review Update Changes** dialog displays the same Kubernetes version
upgrades as the cluster profile editor previously did. Click on **Update**.

</details>

Upgrading the Kubernetes version of your cluster modifies an infrastructure layer. Therefore, Kubernetes needs to
replace its nodes. This is known as a repave. Check out the
[Node Pools](../../../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration) page to learn more
about the repave behavior and configuration.

Click on the **Nodes** tab. You can follow along with the node upgrades on this screen. Palette replaces the nodes
configured with the old Kubernetes version with newly upgraded ones. This may affect the performance of your
application, as Kubernetes swaps the workloads to the upgraded nodes.

![Node repaves in progress](/getting-started/vmware/getting-started_scale-secure-cluster_node-repaves.webp)

### Verify the Application

The cluster update completes when the Palette UI marks the cluster profile layers as green and the cluster is in a
**Healthy** state. The cluster **Overview** page also displays the Kubernetes version as **1.28**. Click on the URL for
port **:8080** to access the application and verify that your upgraded cluster is functional.

![Kubernetes upgrade applied](/getting-started/vmware/getting-started_scale-secure-cluster_kubernetes-upgrade-applied.webp)

## Scan Clusters

Palette provides compliance, security, conformance, and Software Bill of Materials (SBOM) scans on tenant clusters.
These scans ensure cluster adherence to specific compliance and security standards, as well as detect potential
vulnerabilities. You can perform four types of scans on your cluster.

| Scan                              | Description                                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kubernetes Configuration Security | This scan examines the compliance of deployed security features against the CIS Kubernetes Benchmarks, which are consensus-driven security guidelines for Kubernetes. By default, the test set will execute based on the cluster Kubernetes version.                     |
| Kubernetes Penetration Testing    | This scan evaluates Kubernetes-related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your clusters and increases visibility of the security controls in your Kubernetes environments. |
| Kubernetes Conformance Testing    | This scan validates your Kubernetes configuration to ensure that it conforms to CNCF specifications. Palette leverages an open source tool called [Sonobuoy](https://sonobuoy.io) to perform this scan.                                                                  |
| Software Bill of Materials (SBOM) | This scan details the various third-party components and dependencies used by your workloads and helps to manage security and compliance risks associated with those components.                                                                                         |

Navigate to the left **Main Menu** and select **Clusters**. Select your cluster to view its **Overview** tab.

Select the **Scan** tab. The list of all the available cluster scans appears. Palette indicates that you have never
scanned your cluster.

![Scans never performed on the cluster](/getting-started/vmware/getting-started_scale-secure-cluster_never-scanned-cluster.webp)

Click **Run Scan** on the **Kubernetes configuration security** and **Kubernetes penetration testing** scans. Palette
schedules and executes these scans on your cluster, which may take a few minutes. Once they complete, you can download
the report in PDF, CSV or view the results directly in the Palette UI.

![Scans completed on the cluster](/getting-started/vmware/getting-started_scale-secure-cluster_scans-completed.webp)

Click on **Configure Scan** on the **Software Bill of Materials (SBOM)** scan. The **Configure SBOM Scan** dialog
appears.

Leave the default selections on this screen and click on **Confirm**. Optionally, you can configure an S3 bucket to save
your report into. Refer to the
[Configure an SBOM Scan](../../../../clusters/cluster-management/compliance-scan.md#configure-an-sbom-scan) guide to
learn more about the configuration options of this scan.

Once the scan completes, click on the report to view it within the Palette UI. The third-party dependencies that your
workloads rely on are evaluated for potential security vulnerabilities. Reviewing the SBOM enables organizations to
track vulnerabilities, perform regular software maintenance, and ensure compliance with regulatory requirements.

:::info

The scan reports highlight any failed checks, based on Kubernetes community standards and CNCF requirements. We
recommend that you prioritize the rectification of any identified issues.

:::

As you have seen so far, Palette scans are crucial when maintaining your security posture. Palette provides the ability
to schedule your scans and periodically evaluate your clusters. In addition, it keeps a history of previous scans for
comparison purposes. Expand the following section to learn how to configure scan schedules for your cluster.

<details>

<summary>Configure Cluster Scan Schedules</summary>

Click on **Settings**. Then, select **Cluster Settings**. The **Settings** pane appears.

Select the **Schedule Scans** option. You can configure schedules for you cluster scans. Palette provides common scan
schedules or you can provide a custom time. We recommend choosing a schedule when you expect the usage of your cluster
to be lowest. Otherwise, the scans may impact the performance of your nodes.

![Scan schedules](/getting-started/vmware/getting-started_scale-secure-cluster_scans-schedules.webp)

Palette will automatically scan your cluster according to your configured schedule.

</details>

## Scale a Cluster

A node pool is a group of nodes within a cluster that all have the same configuration. You can use node pools for
different workloads. For example, you can create a node pool for your production workloads and another for your
development workloads. You can update node pools for active clusters or create a new one for the cluster.

Navigate to the left **Main Menu** and select **Clusters**. Select your cluster to view its **Overview** tab.

Select the **Nodes** tab. Your cluster has a **control-plane-pool** and a **worker-pool**. Each pool contains one node.

Select the **Overview** tab. Download the [kubeconfig](../../../../clusters/cluster-management/kubeconfig.md) file.

![kubeconfig download](/getting-started/vmware/getting-started_scale-secure-cluster_download-kubeconfig.webp)

Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

```shell
export KUBECONFIG=~/Downloads/admin.vmware-cluster.kubeconfig
```

Execute the following command in your terminal to view the nodes of your cluster.

```shell
kubectl get nodes
```

The output reveals two nodes, one for the worker pool and one for the control plane. Make a note of the name of your
worker node, which is the node that does not have the `control-plane` role. In the example below,
`vmware-cluster-worker-pool-7d6d76b55b-dhffq` is the name of the worker node.

```shell
NAME                                          STATUS   ROLES           AGE   VERSION
vmware-cluster-cp-xcqlw                       Ready    control-plane   28m   v1.28.13
vmware-cluster-worker-pool-7d6d76b55b-dhffq   Ready    <none>          28m   v1.28.13
```

The Hello Universe pack deploys three pods in the `hello-universe` namespace. Execute the following command to verify
where these pods have been scheduled.

```shell
kubectl get pods --namespace hello-universe --output wide
```

The output verifies that all of the pods have been scheduled on the worker node you made a note of previously.

```shell
NAME                        READY   STATUS    AGE   NODE
api-7db799cf85-5w5l6        1/1     Running   20m   vmware-cluster-worker-pool-7d6d76b55b-dhffq
postgres-698d7ff8f4-vbktf   1/1     Running   20m   vmware-cluster-worker-pool-7d6d76b55b-dhffq
ui-5f777c76df-pplcv         1/1     Running   20m   vmware-cluster-worker-pool-7d6d76b55b-dhffq
```

Navigate back to the Palette UI in your browser. Select the **Nodes** tab.

Click on **New Node Pool**. The **Add node pool** dialog appears. This workflow allows you to create a new worker pool
for your cluster. Fill in the following configuration.

| Field                 | Value           | Description                                                                                                                                                                                        |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node pool name**    | `worker-pool-2` | The name of your worker pool.                                                                                                                                                                      |
| **Enable Autoscaler** | Enabled         | Scale the worker pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. |
| **CPU**               | 4 cores         | Set the number of CPUs equal to the already provisioned nodes.                                                                                                                                     |
| **Memory**            | 8 GB            | Set the memory allocation equal to the already provisioned nodes.                                                                                                                                  |
| **Disk**              | 60 GB           | Set the disk space equal to the already provisioned nodes.                                                                                                                                         |

Next, populate the **Compute cluster**, **Resource Pool**, **Datastore**, and **Network** fields according to your
VMware vSphere environment.

Click on **Confirm**. The dialog closes. Palette begins provisioning your node pool. Once the process completes, your
three node pools appear in a healthy state.

![New worker pool provisioned](/getting-started/vmware/getting-started_scale-secure-cluster_third-node-pool.webp)

Navigate back to your terminal and execute the following command in your terminal to view the nodes of your cluster.

```shell
kubectl get nodes
```

The output reveals three nodes, two for worker pools and one for the control plane. Make a note of the names of your
worker nodes. In the example below, `vmware-cluster-worker-pool-7d6d76b55b-dhffq ` and
`vmware-cluster-worker-pool-2-5b4b559f6d-znbtm` are the worker nodes.

```shell
NAME                                            STATUS   ROLES           AGE   VERSION
vmware-cluster-cp-xcqlw                         Ready    control-plane   58m   v1.28.13
vmware-cluster-worker-pool-2-5b4b559f6d-znbtm   Ready    <none>          30m   v1.28.13
vmware-cluster-worker-pool-7d6d76b55b-dhffq     Ready    <none>          58m   v1.28.13
```

It is common to dedicate node pools to a particular type of workload. One way to specify this is through the use of
Kubernetes taints and tolerations.

Taints provide nodes with the ability to repel a set of pods, allowing you to mark nodes as unavailable for certain
pods. Tolerations are applied to pods and allow the pods to schedule onto nodes with matching taints. Once configured,
nodes do not accept any pods that do not tolerate the taints.

The animation below provides a visual representation of how taints and tolerations can be used to specify which
workloads execute on which nodes.

![Taints repel pods to a new node](/getting-started/getting-started_scale-secure-cluster_taints-in-action.gif)

Switch back to Palette in your web browser. Navigate to the left **Main Menu** and select **Profiles**. Select the
cluster profile deployed to your cluster, named `vmware-profile`. Ensure that the **1.1.0** version is selected.

Click on the `hellouniverse 1.2.0` layer. The manifest editor appears. Set the
`manifests.hello-universe.ui.useTolerations` field on line 19 to `true`. Then, set the
`manifests.hello-universe.ui.effect` field on line 21 to `NoExecute`. This toleration describes that the UI pods of
Hello Universe will tolerate the taint with the effect `NoExecute`, key `app`, and value `ui`. The tolerations of the UI
pods should be as below.

```yaml
ui:
  useTolerations: true
  tolerations:
    effect: NoExecute
    key: app
    value: ui
```

Click on **Confirm Updates**. The manifest editor closes. Then, click on **Save Changes** to persist your changes.

Navigate to the left **Main Menu** and select **Clusters**. Select your deployed cluster, named **vmware-cluster**.

Due to the changes you have made to the cluster profile, this cluster has a pending update. Click on **Updates**. The
**Changes Summary** dialog appears.

Click on **Review Changes in Editor**. The **Review Update Changes** dialog appears. The toleration changes appear as
incoming configuration.

Click on **Apply Changes** to apply the update to your cluster.

Select the **Nodes** tab. Click on **Edit** on the first worker pool, named **worker-pool**. The **Edit node pool**
dialog appears.

Click on **Add New Taint** in the **Taints** section. Fill in `app` for the **Key**, `ui` for the **Value** and select
`NoExecute` for the **Effect**. These values match the toleration you specified in your cluster profile earlier.

![Add taint to worker pool](/getting-started/getting-started_scale-secure-cluster_add-taint.webp)

Click on **Confirm** to save your changes. The nodes in the `worker-pool` can now only execute the UI pods that have a
toleration matching the configured taint.

Switch back to your terminal. Execute the following command again to verify where the Hello Universe pods have been
scheduled.

```shell
kubectl get pods --namespace hello-universe --output wide
```

The output verifies that the UI pods have remained scheduled on their original node named
`vmware-cluster-worker-pool-7d6d76b55b-dhffq`, while the other two pods have been moved to the node of the second worker
pool named `vmware-cluster-worker-pool-2-5b4b559f6d-znbtm`.

```shell
NAME                        READY   STATUS    AGE   NODE
api-7db799cf85-5w5l6        1/1     Running   20m   vmware-cluster-worker-pool-2-5b4b559f6d-znbtm
postgres-698d7ff8f4-vbktf   1/1     Running   20m   vmware-cluster-worker-pool-2-5b4b559f6d-znbtm
ui-5f777c76df-pplcv         1/1     Running   20m   vmware-cluster-worker-pool-7d6d76b55b-dhffq
```

Taints and tolerations are a common way of creating nodes dedicated to certain workloads, once the cluster has scaled
accordingly through its provisioned node pools. Refer to the
[Taints and Tolerations](../../../../clusters/cluster-management/taints.md) guide to learn more.

### Verify the Application

Select the **Overview** tab. Click on the URL for port **:8080** to access the Hello Universe application and verify
that the application is functioning correctly.

## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters**. Select the cluster you want to
delete to access its details page.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

![Delete cluster](/getting-started/vmware/getting-started_scale-secure-cluster_delete-cluster-button.webp)

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name `vmware-cluster`
to proceed with the delete step. The deletion process takes several minutes to complete.

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for a force delete. To trigger a force
delete, navigate to the cluster’s details page, click on **Settings**, then select **Force Delete Cluster**. Palette
automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

:::

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you
created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the
selection to remove the cluster profile.

Click on the **drop-down Menu** at the top of the page and switch to **Tenant Admin** scope.

Navigate to the left **Main Menu** and click on **Projects**.

Click on the **three-dot Menu** of the **Project-ScaleSecureTutorial** and select **Delete**. A pop-up box will ask you
to confirm the action. Confirm the deletion.

Navigate to the left **Main Menu** and click on **Users & Teams**. Select the **Teams** tab.

Click on **scale-secure-tutorial-team** list entry. The **Team Details** pane appears. Click on **Delete Team**. A
pop-up box will ask you to confirm the action. Confirm the deletion.

## Wrap-up

In this tutorial, you learned how to perform very important operations relating to the scalability and availability of
your clusters. First, you created a project and team. Next, you imported a cluster profile and deployed a host VMware
vSphere cluster. Then, you upgraded the Kubernetes version of your cluster and scanned your clusters using Palette's
scanning capabilities. Finally, you scaled your cluster's nodes and used taints to select which Hello Universe pods
execute on them.

We encourage you to check out the [Additional Capabilities](../../additional-capabilities/additional-capabilities.md) to
explore other Palette functionalities.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-scale-secure-cluster-end" />
