---
sidebar_label: "Deploy OpenTelemetry Monitoring Stack"
title: "Deploy OpenTelemetry Monitoring Stack"
description: "Learn how to deploy an OpenTelemetry monitoring stack in your Palette environment."
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management", "monitoring"]
---

The monitoring stack you will use leverages the [OpenTelemetry (OTel)](https://opentelemetry.io/) ecosystem to meet your
environment’s observability requirements. OTel standardizes how telemetry data such as logs, metrics, and traces is
generated and exported. Any backend that supports the OpenTelemetry Protocol (OTLP) is compatible, making the OTel stack
one of the most flexible and vendor-neutral observability solutions available. OTel is widely supported by a variety of
monitoring and backend tools, including [Prometheus](https://prometheus.io/), [Jaeger](https://www.jaegertracing.io/),
[OpenObserve](https://github.com/openobserve/openobserve), and [Datadog](https://docs.datadoghq.com/).

Use the following steps to deploy a monitoring stack with [OpenTelemetry](https://opentelemetry.io/) and configure a
host cluster to forward metrics to [OpenObserve](https://github.com/openobserve/openobserve).

The stack uses the following architecture:

- One or more _workload clusters_ are instrumented with OpenTelemetry to gather metrics. These metrics are sent to a
  centralized component known as the _central collector_.
- The _central collector_ is configured with OpenTelemetry and is responsible for receiving, processing, and forwarding
  the telemetry data.
- The collector uses an _exporter_ to send the processed metrics to _OpenObserve_, which acts as the observability
  backend and provides a dashboard to visualize the metrics.

:::tip

Workload clusters can be configured to send telemetry data directly to a backend system such as OpenObserve by including
an exporter in the configuration of each cluster. However, we recommend deploying a central OpenTelemetry collector, as
it centralizes authentication and external traffic configurations in a single cluster, simplifying management and
reducing duplication.

:::

![OTel architecture](/clusters_cluster-management_monitoring_open-telemetry_otel-architecture.webp)

## Prerequisites

- A Palette account.
- Three or more healthy [VMware](../../data-center/vmware/vmware.md), [MAAS](../../data-center/maas/maas.md) or
  [Edge](../../edge/edge.md) clusters.
- Network connectivity between the clusters.

## Deploy an OpenTelemetry Monitoring Stack

The following steps create cluster profiles for the workload cluster, central collector, and exporter. Then, you deploy
them to your deployed healthy clusters.

### Create and Deploy the Exporter Cluster Profile

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

3.  Enter `exporter-profile` as the name of the cluster profile. Then, select **Add-on** as the cluster profile **Type**
    and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**     | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                   |
    | ------------ | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | MetalLB      | 0.13.x      | Palette Registry (OCI) | Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                   |
    | PostgreSQL   | 1.22.x      | Palette Registry (OCI) | No customization required.                                                                                                                                                                                          |
    | Open Observe | 0.14.x      | Palette Registry (OCI) | Set a user email in the `charts.openobserve.auth.ZO_ROOT_USER_EMAIL` field or leave the default value of `admin@openobserve.dev`. Set a user password in the `charts.openobserve.auth.ZO_ROOT_USER_PASSWORD` field. |

    Construct a Base64 encoding of the credentials you have configured in the format `useremail:password` in the Open
    Observe pack. For example, the string `admin@openobserve.dev:admin` is encoded to
    `YWRtaW5Ab3Blbm9ic2VydmUuZGV2OmFkbWl`.

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Observe dashboard.

4.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select one of the healthy
    clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add an add-on profile to this cluster. The list of cluster
    profiles appears.

    Finally, select the `exporter-profile` you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

5.  Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will
    find two services deployed once the add-on profile is correctly applied.

    Make a note of the address of the services by copying the link under port **5080**.

    ![Exporter profile deployed](/clusters_cluster-management_monitoring_open-telemetry_exporter-deployed.webp)

### Create and Deploy the Central Collector Cluster Profile

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

    Enter `central-collector-profile` as the name of the cluster profile. Then, select **Add-on** as the cluster profile
    **Type** and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**       | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | -------------- | ----------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | MetalLB        | 0.13.x      | Palette Registry (OCI) | Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | Open Telemetry | 0.127.x     | Palette Registry (OCI) | Click **Presets**. Select **Enable** under the **central-collector** section and select **OpenObserve** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.endpoint` field with the service address of the exporter service you deployed in the [Create and Deploy the Exporter Cluster Profile](#create-and-deploy-the-exporter-cluster-profile) section. Replace the password placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.headers.Authorization` field with the Base64-encoded value you made a note of in Step 3 of the [Create and Deploy the Exporter Cluster Profile](#create-and-deploy-the-exporter-cluster-profile) section, keeping the prefix `Basic`. For example, `Basic YWRtaW5Ab3Blbm9ic2VydmUuZGV2OmFkbWl` uses the encoded sample value `admin@openobserve.dev:admin`. |

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Telemetry central collector.

3.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select one of the healthy
    clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add an add-on profile to this cluster. The list of cluster
    profiles appears.

    Finally, select the `central-collector-profile` you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

4.  Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will
    find six services deployed once the add-on profile is correctly applied.

    Make a note of the address of the services by copying the link under port **4317**.

    ![Central Collector profile deployed](/clusters_cluster-management_monitoring_open-telemetry_central-collector-deployed.webp)

### Create and Deploy the Workload Cluster Profile

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

    Enter `workload-profile` as the name of the cluster profile. Then, select **Add-on** as the cluster profile **Type**
    and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**                | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                            |
    | ----------------------- | ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Spectro Cluster Metrics | 3.3.x       | Palette Registry (OCI) | No customization required.                                                                                                                                                                                                                                                                                                                                                                                                   |
    | Open Telemetry          | 0.127.x     | Palette Registry (OCI) | Click **Presets**. Select **Central Otel** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlp.endpoint` field with the service address of the exporter service you deployed in the [Create and Deploy the Central Collector Cluster Profile](#create-and-deploy-the-central-collector-cluster-profile), without the `https://` or `http://` protocol. |

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Telemetry workload collector. It also deploys the Spectro Cluster Metrics
    pack to gather additional metrics from the cluster.

    :::tip

    You can add any other monitoring, logging, or tracing pack that is compatible with the OpenTelemetry Protocol to the
    workload collector cluster profile. We recommend configuring the Prometheus - Grafana pack for monitoring production
    workloads.

    :::

3.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select one of the healthy
    clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add an add-on profile to this cluster. The list of cluster
    profiles appears.

    Finally, select the `workload-profile` you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

    :::tip

    You can deploy this profile to as many workload clusters as you want to monitor. They will all connect and send data
    to the central collector cluster.

    :::

4.  Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. Palette
    marks all cluster profile layers with a green indicator once they are successfully deployed.

    ![Workload profile deployed](/clusters_cluster-management_monitoring_open-telemetry_workload-deployed.webp)

## Validation

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select the cluster that you
    have deployed the `exporter-profile` to in the
    [Create and Deploy the Exporter Cluster Profile](#create-and-deploy-the-exporter-cluster-profile) section. The
    **Overview** tab appears.

3.  Open the Open Observe dashboard by clicking on the link under **5080**. The Open Observe login page appears. Enter
    the user email and password that you configured in the cluster profile. Then, click **Login**.

4.  The Open Observe dashboard appears. The exporter contains metrics from all workload clusters and the central
    collector.

    ![Open Observe dashboard](/clusters_cluster-management_monitoring_open-telemetry_open-observe-dashboard.webp)

    The **Metrics** tab allows you to create various types of charts to visualize your workload cluster metrics.

    ![Open Observe metrics tab ](/clusters_cluster-management_monitoring_open-telemetry_open-observe-metrics.webp)

    The Open Observe dashboard contains a wealth of functionality that you can use to monitor and track the health of
    your clusters. Refer to the
    [Open Observe documentation](https://github.com/openobserve/openobserve?tab=readme-ov-file) for further information.
