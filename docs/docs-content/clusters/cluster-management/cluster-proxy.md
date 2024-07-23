---
sidebar_label: "Configure Applications to Use Proxy Server"
title: "Configure Applications to Use Proxy Server"
description: "Guide to configure configurations in a cluster to use a proxy server."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management", "proxy"]
---

You can configure applications that operate in your Palette clusters to use a proxy server to access the internet
instead of accessing the internet directly.

Before you are able to configure applications in a cluster to use the proxy server, you must first ensure that the
cluster itself is configured to use the proxy server. This means that the host Operating System (OS) and the Palette
agent inside the cluster will use the proxy server for its outbound communications. The steps to do this vary depending
on your environment.

After the cluster is configured to use the proxy server, you can proceed to configure the applications inside the
cluster to use the proxy server. You can do this by applying the `spectrocloud.com/connection: proxy` label to instruct
application to use the proxy settings of the cluster.

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

2.  After you have configured proxy settings for your PCG, you still need to specify which applications will use the
    proxy settings. You can do this by applying the `spectrocloud.com/connection: proxy` label to the pack that contains
    the application.

    You must apply the label to every specific job, deployment, or daemon set that needs to use the proxy servers. For
    example, if you have a Kafka deployment that requires access to the internet through your proxy, you need to apply
    the label to the Kafka deployment.

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
   installation. If you are using the Palette CLI for installation, refer to
   [Self Hosted Palette - Installation](../../enterprise-version/install-palette/install-on-kubernetes/install.md) to
   learn how to specify proxy settings during installation. If you are using Helm charts for installation, refer to
   [Enable and Manage Proxy Configurations](../pcg/manage-pcg/add-dns-mapping.md) to learn how to configure proxy
   through Reach.

2. Once you have configured proxy settings through Reach for your instance, you still need to specify which applications
   will use the proxy settings. You can do this by applying the `spectrocloud.com/connection: proxy` label to the pack
   that contains the application.

   You must apply the label to every specific job, deployment, or daemon set, etc., that needs to use the proxy servers.
   For example, if you have a Kafka deployment that requires access to the internet through your proxy, you need to
   apply the label to the Kafka deployment.

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

1.  For Edge clusters, you specify the proxy settings during installation in your Edge installer **user-data**. If your
    Edge host is deployed in airgap mode, you may also specify the proxy settings in Local UI. For more information,
    refer to [Configure HTTP-Proxy in Local UI](../edge/local-ui/host-management/configure-proxy.md).

2.  Once you have configured proxy settings for your Edge host, you still need to specify which applications will use
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

The best way to validate that your applications are using the proxy server is to examine the logs of the proxy server.
If you are able to observe application traffic originating from your Kubernetes cluster, you can validate that the proxy
settings are in effect.

Alternatively, you can follow the steps below and use tools such as **tcpdump** or **Wireshark** to passively observe
network traffic and ensure that they are routed through the proxy server.

1. Establish an SSH connection to the node where your application workloads reside.

2. Issue the following command to analyze the packets sent and received from your node. Replace `nic-name` with the name
   of your network interface and replace `proxy-server-ip` with the IP address of your proxy server.

   ```shell
   sudo tcpdump -i nic-name -nn host proxy-server-ip
   ```
