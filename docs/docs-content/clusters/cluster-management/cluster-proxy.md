---
sidebar_label: "Configure Applications to Use Proxy Server"
title: "Configure Applications to Use Proxy Server"
description: "Guide to configure configurations in a cluster to use a proxy server."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management", "proxy"]
---

You can configure applications that operate in your Palette clusters to use a proxy server to access the internet
instead of accessing the internet directly. The steps to do this vary depending on your environment.

When a cluster is configured to use a proxy server, it means that the Palette agent inside the cluster will use the
proxy server for its communications. The applications inside your cluster does not use the same proxy settings by
default, and you need to apply the `spectrocloud.com/connection: proxy` label to instruct application to use the proxy
settings.

## Prerequisites

- An active cluster in Palette.

- An active proxy server reachable by your cluster.

## Configure Applications to Use Proxy Server

<Tabs>

<TabItem value="Palette SaaS Non-Edge">

1.  If you are using Palette SaaS, and your cluster does not have direct access to the internet, then the communication
    between Palette SaaS and your cluster must go through a Private Cloud Gateway (PCG). You can configure proxy
    settings for the PCG, and then cluster created by thr cloud account that is configured to use the PCG will inherit
    its proxy settings.

    Refer to to [Enable and Manage Proxy Configurations for PCG](../pcg/manage-pcg/) to learn how to configure proxy
    settings for a PCG.

2.  Once you have configured proxy settings for your PCG, you still need to specify which applications will use the
    proxy settings. You can do this by applying the `spectrocloud.com/connection: proxy` label to the pack that contains
    the application.

    You must apply the label to every specific job, deployment, or daemon set, etc., that needs to use the proxy
    servers. For example, if you have a Kafka deployment that requires access to the internet through your proxy, you
    need to apply the label to the Kafka deployment.

    ```yaml {7}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: kafka
    labels:
    app: kafka
    spectrocloud.com/connection: proxy
    ```

    </TabItem>

    <TabItem value="Self-Hosted Palette Non-Edge">

    1. If you are using a self-hosted Palette instance, you have the opportunity to configure proxy settings during
       installation. For more information, refer to

    2. If you did not configure proxy settings during installation, you need to install Reach on your Palette/VerteX
       instance and use Reach to provide the proxy configuration.

    3. Once you have configured proxy settings through Reach for your instance, you still need to specify which
       applications will use the proxy settings. You can do this by applying the `spectrocloud.com/connection: proxy`
       label to the pack that contains the application.

       You must apply the label to every specific job, deployment, or daemon set, etc., that needs to use the proxy
       servers. For example, if you have a Kafka deployment that requires access to the internet through your proxy, you
       need to apply the label to the Kafka deployment.

       ```yaml {7}
       apiVersion: apps/v1
       kind: Deployment
       metadata:
       name: kafka
       labels:
       app: kafka
       spectrocloud.com/connection: proxy
       ```

    </TabItem>

    <TabItem value="Edge">

    1. For Edge clusters, you specify the proxy settings during installation in your Edge installer **user-data**. If
       your Edge host is deployed in airgap mode, you may also specify the proxy settings in Local UI. For more
       information, refer to [Configure HTTP-Proxy in Local UI](../edge/local-ui/host-management/configure-proxy.md).

    2. Once you have configured proxy settings for your Edge host, you still need to specify which applications will use
       the proxy settings. You can do this by applying the `spectrocloud.com/connection: proxy` label to the pack that
       contains the application.

       You must apply the label to every specific job, deployment, or daemon set, etc., that needs to use the proxy
       servers. For example, if you have a Kafka deployment that requires access to the internet through your proxy, you
       need to apply the label to the Kafka deployment.

       ```yaml {7}
       apiVersion: apps/v1
       kind: Deployment
       metadata:
       name: kafka
       labels:
       app: kafka
       spectrocloud.com/connection: proxy
       ```

    </TabItem>

<Tabs>

## Validate
