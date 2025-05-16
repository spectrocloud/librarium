---
sidebar_position: 0
sidebar_label: "Install and Configure the Spectro Kubernetes Dashboard"
title: "Install and Configure the Spectro Kubernetes Dashboard"
description: "Learn how to deploy and confiure the Spectro Kubernetes Dashboard in your clusters."
tags: ["clusters", "cluster management", "Dashboard", "Cluster Dashboard"]
category: ["tutorial"]
---

The cluster workloads tab in the Palette UI will begin to be phased out starting in Palette version 4.6.b. The _Spectro
Kubernetes Dashboard_ will replace the workloads tab. The dashboard is not automatically installed with Palette eXtended
Kubernetes and must be manually installed on each cluster.

This tutorial will guide you through the process to manually add the _Spectro Kubernetes Dashboard_ pack into your
existing cluster profiles and deploy the service.

:::caution

Upgrading the dashboard to 7.11.1 from older versions is not supported. If you are upgrading from version 2.7.1 or
lower,we recommend fully uninstalling the prior version before installing the new version. The Kubernetes-Dashboard is a
stateless application and no data will be lost during the upgrade process.

:::

## Prerequisites

- kubectl client 1.24 or higher

  - confirm with `kubectl version --short`

- Kubernetes Dashboard version 2.7.1 or lower is not installed on target clusters

- A Kubernetes cluster deployed using an existing Palette Cluster profile

By Default, dashboard creates a service account called kubernetes-dashboard (in 2.6.1 and previous versions) and
k8s-dashboard-kubernetes-dashboard ( in 2.7.0 version). It also creates a clusterrole and clusterrolebinding which has
read-only permission.

## Install the Spectrocloud Kubernetes Dashboard (Spectro K8s Dashboard)

The Spectro Kubernetes Dashboard is a customized version of the open source Kubernetes Dashboard. The Spectro K8s
Dashboard is available as a pack. It can be deployed by adding it to your existing cluster profiles and deploying to
your clusters using the Palette UI or with Terraform.

Login to Palette and select **Clusters** from the left Main Menu. Select a cluster that does not have the _Spectro
Kubernetes Dashboard_ installed. Select the \*_Workloads_ tab.

You will see an announcement stating that the current workloads view will soon be depracated and direct you to install
version 7.11.1 of the _Spectro Kubernetes Dashboard_

![Image of workloads tab being depracated banner](/tutorials/cluster-dashboard-upgrade/clusters_cluster-management_cluster-dashboard-upgrade_update-available.webp)

Follow the steps in our [Update Cluster Profiles](./update-k8s-cluster.md) to add the pack to your cluster profiles.
Ensure that you are using _Spectro Kubernetes Dashboard pack version 7.11.1 or higher_.

Your cluster profile should look like the example.

![Image of cluster profile with Spectro Kubernetes Dashboard pack](/tutorials/cluster-dashboard-upgrade/clusters_cluster-management_cluster-dashboard_cluster-profile-example.webp)

Select **Clusters** from the left hand Main Menu and select your cluster.

Select the **Profile** tab and increase the profile to the new version that contains the _Spectro Kubernetes Dashboard_
pack. Apply the changes.

When the pack is installed successfully, navigate to the cluster you deployed it to and select **Workloads**. A
"connect" button will appear. Use this button to connect to your clusters new dashboard.

**IMAGE GOES HERE**

:::info

The old dashboard information will still display until the feature is removed.

:::

Near the top of the screen you will see a new message box announcing **Enhanced Kubernetes Dashboard Available**. Select
the **Connect to dashboard** button.

**INSERT IMAGE HERE**

**OIDC NOT FOUND FOR THE ORGANIZATION**

## Configuring the Dashboard

Configure Ingress Use the following steps to configure ingress for the Kubernetes Dashboard pack.

Log in to Palette and click Profiles from the left Main Menu. Select the profile configured with the Kubernetes
Dashboard.

Select the spectro-k8s-dashboard pack and click Values under the Pack Details section.

Ensure the service.type parameter is set to "ClusterIP".

Set the ingress.enabled parameter to "true" to enable ingress.

Set ingress rules, such as annotations, path, hosts, and any other rules. This allows you to access the Kubernetes
Dashboard in hostname or IP format using the IP address that the ingress controller exposes.

Typically you would point a DNS CNAME record to the ingress controller IP. Talk to your system administrator to learn
more about which hostname to use.

Configure LoadBalancer Use the service.loadBalancerIP and service.externalPort parameters to connect to the Kubernetes
Dashboard.

Troubleshooting Scenario - Kubernetes Dashboard not Accessible If the Kubernetes Dashboard is not accessible, check the
dashboard pod for errors and ensure the dashboard service is in the Running state.

References Spectro Kubernetes Dashboard Kubernetes Dashboardd

Using the service account, we can create the token using the command - kubectl create token kubernetes-dashboard -n
kubernetes-dashboard

The token generated can be used to sign in the dashboard UI

The [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general-purpose, web-based UI for Kubernetes
clusters. The dashboard provides a rich variety of functionality by wrapping around the
[kubectl](https://kubernetes.io/docs/tasks/tools/) CLI. You can use it to perform the following operations:

- List and manage Kubernetes cluster resources.
- Deploy a containerized application to a host cluster.
- Troubleshoot deployed applications and resources.

<!-- prettier-ignore -->
Use the <VersionedLink text="Spectro Kubernetes Dashboard" url="/integrations/packs/?pack=spectro-k8s-dashboard" /> pack to add the Kubernetes dashboard
to your cluster. The pack documentation page has instructions on how to configure and use the dashboard.

![Kubernetes dashboard login page](/integrations_spectro-k8s-dashboard_dashboard-page.webp)
