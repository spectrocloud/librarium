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

- Three or more healthy [Public Cloud](../../public-cloud/public-cloud.md),
  [Data Center](../../data-center/data-center.md), or [Edge](../../edge/edge.md) clusters.

- Network connectivity between the clusters.

- The cluster that hosts OpenObserve must be a [VMware vSphere](../../data-center/vmware/vmware.md),
  [MAAS](../../data-center/maas/maas.md), or [Edge](../../edge/edge.md) cluster. The OpenObserve pack supports only
  these environments.

- The cluster that hosts OpenObserve must be able to provision the persistent volumes that the OpenObserve pack
  requests. By default, the pack requests the following volumes:

  - A 100 GiB volume for each of the `ingester`, `querier`, `compactor`, and `scheduler` components.

  - A 20 GiB volume for each of the three NATS JetStream replicas.

  - A 10 GiB volume for each of the two in-cluster PostgreSQL instances.

- OpenObserve stores its metadata in PostgreSQL. The OpenObserve pack offers two presets for the database:

  - **In-Cluster Postgres (Requires postgresql Pack)** is the default. The pack deploys a PostgreSQL database in the
    cluster and connects OpenObserve to it automatically. This preset requires the
    [CloudNativePG](https://cloudnative-pg.io/) operator, which the PostgreSQL pack installs. This guide uses this
    preset.

  - **External Postgres (Bring Your Own)** connects OpenObserve to a managed PostgreSQL service or a self-hosted
    PostgreSQL server, version 14 or later, that the cluster can reach. With this preset, you do not need the PostgreSQL
    pack. Instead, provide the connection string of your server in the `charts.openobserve.auth.ZO_META_POSTGRES_DSN`
    field of the OpenObserve pack, in the format `postgres://<user>:<password>@<host>:<port>/<database>`.

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

    | **Pack**    | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | ----------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | MetalLB     | 0.13.x      | Palette Registry (OCI) | Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | PostgreSQL  | 1.29.x      | Palette Registry (OCI) | No customization required.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | OpenObserve | 1.1.x       | Palette Registry (OCI) | Keep the default **In-Cluster Postgres (Requires postgresql Pack)** preset, which the [Prerequisites](#prerequisites) section describes. Set a user email in the `charts.openobserve.auth.ZO_ROOT_USER_EMAIL` field or leave the default value of `root@example.com`. Set a user password in the `charts.openobserve.auth.ZO_ROOT_USER_PASSWORD` field. Set `charts.openobserve.config.ZO_LOCAL_MODE` to `true`. Add the `spectrocloud.com/install-priority: "10"` annotation under the `pack` key so that Palette installs the PostgreSQL pack first. |

    The PostgreSQL pack keeps the default install order value of `0`, so Palette installs the PostgreSQL pack, which
    provides the CloudNativePG operator, and waits until it is ready before it deploys OpenObserve. The following
    example shows the annotation in the OpenObserve pack YAML. Refer to
    [Install Order](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md#install-order)
    for more information.

    ```yaml
    pack:
      spectrocloud.com/install-priority: "10"
    ```

    With `ZO_LOCAL_MODE` set to `true`, OpenObserve stores metrics on its persistent volumes. To store metrics in an
    existing S3 bucket instead, make the following changes to the OpenObserve pack:

    - Set `charts.openobserve.config.ZO_LOCAL_MODE` to `false`.

    - Fill in an access key in the field `charts.openobserve.auth.ZO_S3_ACCESS_KEY` and a secret key in the field
      `charts.openobserve.auth.ZO_S3_SECRET_KEY`.

    - Fill in the region of your S3 bucket in the field `charts.openobserve.config.ZO_S3_REGION_NAME` and the name of
      your bucket in the field `charts.openobserve.config.ZO_S3_BUCKET_NAME`.

    Encode the credentials that you configured in the OpenObserve pack in Base64, in the format
    `<user-email>:<password>`, and make a note of the encoded value. The central collector cluster profile uses it.

    ```shell
    printf '%s' '<user-email>:<password>' | base64
    ```

    Replace `<user-email>` and `<password>` with the values of the `charts.openobserve.auth.ZO_ROOT_USER_EMAIL` and
    `charts.openobserve.auth.ZO_ROOT_USER_PASSWORD` fields. For example, the default credentials
    `root@example.com:Complexpass#123` encode to `cm9vdEBleGFtcGxlLmNvbTpDb21wbGV4cGFzcyMxMjM=`.

    Review the configuration you have provided and select **Finish Configuration** to save your cluster profile. This
    profile configures and deploys OpenObserve.

4.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select one of the healthy
    VMware vSphere, MAAS, or Edge clusters that you have deployed as a prerequisite to this guide. The **Overview** tab
    appears.

    Select the **Profile** tab. Then, select the **+** to add an add-on profile to this cluster. The list of cluster
    profiles appears.

    Finally, select the `exporter-profile` you created in the previous step and select **Confirm**. Review the
    configuration and select **Save**.

5.  Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will
    find two services deployed once the add-on profile is correctly applied.

    Make a note of the address of the OpenObserve service by copying the **:5080** link under **Services**.

    ![Exporter profile deployed](/clusters_cluster-management_monitoring_open-telemetry_exporter-deployed.webp)

### Create and Deploy the Central Collector Cluster Profile

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

    Enter `central-collector-profile` as the name of the cluster profile. Then, select **Add-on** as the cluster profile
    **Type** and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**       | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | -------------- | ----------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | MetalLB        | 0.13.x      | Palette Registry (OCI) | This pack is only required for data center and Edge clusters. Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Open Telemetry | 0.132.x     | Palette Registry (OCI) | Select **Presets**. Select **Enable** under the **central-collector** section and select **OpenObserve** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.endpoint` field with the service address of the exporter service you deployed in the [Create and Deploy the Exporter Cluster Profile](#create-and-deploy-the-exporter-cluster-profile) section. Replace the password placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.headers.Authorization` field with the Base64-encoded value you made a note of in Step 3 of the [Create and Deploy the Exporter Cluster Profile](#create-and-deploy-the-exporter-cluster-profile) section, keeping the prefix `Basic`, in the format `Basic <encoded-credentials>`. |

    Review the configuration you have provided and select **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Telemetry central collector.

    :::info

    The OpenTelemetry pack supports auto-instrumentation for Java, Python, Node.js, .NET and Go applications. This
    capability allows you to collect traces, metrics, and logs from your applications without changing their source
    code. You can enable the instrumentation by adding annotations to your workloads.

    Refer to the <VersionedLink text="OpenTelemetry Collector" url="/integrations/packs/?pack=opentelemetry" /> pack
    documentation for further details.

    :::

3.  Navigate to the left main menu and select **Clusters** to view the cluster profile page. Select one of the healthy
    clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add an add-on profile to this cluster. The list of cluster
    profiles appears.

    Finally, select the `central-collector-profile` you created in the previous step and select **Confirm**. Review the
    configuration and select **Save**.

4.  Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will
    find five services deployed once the add-on profile is correctly applied.

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

    | **Pack**                | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | ----------------------- | ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Spectro Cluster Metrics | 3.3.x       | Palette Registry (OCI) | No customization required.                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | Open Telemetry          | 0.127.x     | Palette Registry (OCI) | Select **Presets**. Select **Central Otel** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlp.endpoint` field with the service address of the central collector service you deployed in the [Create and Deploy the Central Collector Cluster Profile](#create-and-deploy-the-central-collector-cluster-profile) section, without the `https://` or `http://` protocol. |

    Review the configuration you have provided and select **Finish Configuration** to save your cluster profile. This
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

    Finally, select the `workload-profile` you created in the previous step and select **Confirm**. Review the
    configuration and select **Save**.

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

3.  Open the OpenObserve web interface by selecting the **:5080** link under **Services**. The OpenObserve login page
    appears. Enter the user email and password that you configured in the cluster profile. Then, select **Login**.

4.  From the left main menu, select **Metrics**. The **Explore** tab displays charts for the metric streams that the
    central collector exports to OpenObserve, such as `container_cpu_usage` and `container_memory_rss`.

5.  Select the **Visualize** tab. From the **Stream** drop-down menu, select the `k8s_pod_memory_working_set` metric
    stream. Select **PromQL** as the query language and **Custom** as the query mode, and then enter the following
    query.

    ```text
    avg by (cluster_name) (k8s_pod_memory_working_set)
    ```

    Select **Refresh**. The chart displays the average pod memory usage of each cluster, with one series for each
    workload cluster and one for the central collector cluster. This confirms that OpenObserve receives metrics from the
    central collector cluster and every workload cluster.

    OpenObserve provides features such as dashboards, alerts, and log search that you can use to monitor and track the
    health of your clusters. Refer to the [OpenObserve documentation](https://openobserve.ai/docs/) for further
    information.
