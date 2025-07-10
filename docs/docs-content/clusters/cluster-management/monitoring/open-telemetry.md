---
sidebar_label: "Deploy OpenTelemetry Monitoring Stack"
title: "Deploy OpenTelemetry Monitoring Stack"
description: "Learn how to deploy an OpenTelemetry monitoring stack in your Palette environment."
hiddenFromNav: false
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management", "monitoring"]
---

## Prerequisites

- A Palette account.
- Three or more Healthy [VMware](../../data-center/vmware/vmware.md), [MAAS](../../data-center/maas/maas.md) or
  [Edge](../../edge/edge.md) clusters.
- Network connectivity between the clusters.

## Create and Deploy Cluster Profiles

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

3.  Input **exporter-profile** as the name of the cluster profile. Then, select **Add-on** as the cluster profile
    **Type** and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**     | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                   |
    | ------------ | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | MetalLB      | 0.13.x      | Palette Registry (OCI) | Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                   |
    | PostgreSQL   | 1.22.x      | Palette Registry (OCI) | No customization required.                                                                                                                                                                                          |
    | Open Observe | 0.14.x      | Palette Registry (OCI) | Set a user email in the `charts.openobserve.auth.ZO_ROOT_USER_EMAIL` field or leave the default value of `admin@openobserve.dev`. Set a user password in the `charts.openobserve.auth.ZO_ROOT_USER_PASSWORD` field. |

    Make a note of the base64 encoding of the `useremail:password` you have configured here. For example, the string
    `admin@openobserve.dev:admin` is encoded to `YWRtaW5Ab3Blbm9ic2VydmUuZGV2OmFkbWl`.

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Observe dashboard.

4.  Navigate to the left **Main Menu** and select **Clusters** to view the cluster profile page. Select one of the
    healthy clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add a add-on profile to this cluster. The list of cluster
    profile appears.

    Finally, select the **exporter-profile** you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

5.  Select **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will find
    two services deployed once the add-on profile correctly applies. Make a note of the address of the services by
    copying the link under port 5080.

    ![Exporter profile deployed](/clusters_cluster-management_monitoring_open-telemetry_exporter-deployed.webp)

6.  Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

    Input **central-collector-profile** as the name of the cluster profile. Then, select **Add-on** as the cluster
    profile **Type** and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**       | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | -------------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | MetalLB        | 0.13.x      | Palette Registry (OCI) | Set an IP range that is available in your environment in the `manifests.metallb.addresses` field.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | Open Telemetry | 0.127.x     | Palette Registry (OCI) | Click **Presets**. Select **Enable** under the **central-collector** section and select **OpenObserve** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.endpoint` field with the service address of the exporter service you deployed in the previous step. Replace the password placeholder in the `charts.opentelemetry-collector.config.exporters.otlphttp/openobserve.headers.Authorization` field with the base64 encoded value you made a note of in Step 3. |

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Telemetry central collector.

7.  Navigate to the left **Main Menu** and select **Clusters** to view the cluster profile page. Select one of the
    healthy clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add a add-on profile to this cluster. The list of cluster
    profile appears.

    Finally, select the **central-collector-profile** you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

8.  Select **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. You will find
    six services deployed once the add-on profile correctly applies. Make a note of the address of the services by
    copying the link under port 4317.

    ![Central Collector profile deployed](/clusters_cluster-management_monitoring_open-telemetry_central-collector-deployed.webp)

9.  Navigate to the left **Main Menu** and select **Profiles** to view the cluster profile page. Select **Add Cluster
    Profile**. The cluster profile creation wizard appears.

    Input **workload-profile** as the name of the cluster profile. Then, select **Add-on** as the cluster profile
    **Type** and select **Next**.

    Add the following packs in your cluster profile with customizations that suit your environment. Then, select
    **Next**.

    | **Pack**                | **Version** | **Registry**           | **Customization**                                                                                                                                                                                                                                                                                                      |
    | ----------------------- | ----------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Spectro Cluster Metrics | 3.3.x       | Palette Registry (OCI) | No customization required.                                                                                                                                                                                                                                                                                             |
    | Open Telemetry          | 0.127.x     | Palette Registry (OCI) | Click **Presets**. Select **Central Otel** under the **export** section. Replace the domain placeholder in the `charts.opentelemetry-collector.config.exporters.otlp.endpoint` field with the service address of the exporter service you deployed in the previous step, without the `https://` or `http://` protocol. |

    Review the configuration you have provided and click **Finish Configuration** to save your cluster profile. This
    profile configures and deploys the Open Telemetry workload collector. It also deploys the Spectro Cluster Metrics
    pack to gather additional metrics from the cluster.

    :::tip

    You can add any other monitoring, logging, or tracing pack that is compatible with the OpenTelemetry Protocol to the
    workload collector cluster profile. We recommend configuring the Prometheus - Grafana pack for monitoring production
    workloads.

    :::

10. Navigate to the left **Main Menu** and select **Clusters** to view the cluster profile page. Select one of the
    healthy clusters that you have deployed as a prerequisite to this guide. The **Overview** tab appears.

    Select the **Profile** tab. Then, select the **+** to add a add-on profile to this cluster. The list of cluster
    profile appears.

    Finally, select the **workload-profile** you created in the previous step and click **Confirm**. Review the
    configuration and click **Save**.

    :::tip

    You can deploy this profile to as many workload clusters as you want to monitor. They will all connect to the
    central collector cluster.

    :::

11. Select the **Overview** tab and monitor the progress of your add-on profile. This may take a few minutes. Palette
    marks all the cluster profile layers with green indicator once they are succesfully deployed.

    ![Workload profile deployed](/clusters_cluster-management_monitoring_open-telemetry_workload-deployed.webp)

## Validation
