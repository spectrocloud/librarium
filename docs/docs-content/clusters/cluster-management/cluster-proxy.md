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
cluster to use the proxy server. You can do this by applying the `spectrocloud.com/connection: proxy` label to the
specific job, deployment, or daemon set to instruct an application to use the proxy settings of the cluster.

## Prerequisites

- An active proxy server reachable by your cluster.

<Tabs group="scenario">

<TabItem value="Palette SaaS Non-Edge">

- A PCG is deployed into an active and healthy Kubernetes cluster. Refer to
  [Deploy a PCG to an Existing Kubernetes Cluster](../deploy-pcg-k8s.md) for additional guidance.

  :::warning

  If you deployed a [PCG through the Palette CLI](../pcg.md#supported-environments), refer to the respective platform
  installation guide for instructions on how to configure proxy settings during the installation process through the
  CLI.

  :::

- The PCG is configured to use the proxy server that you intend for your applications to use for outbound
  communications. For more information, refer to
  [Enabled and Manage Proxy Configurations](../pcg/manage-pcg/configure-proxy.md).

</TabItem>

<TabItem value="Self-Hosted Palette Non-Edge">

- A self-hosted Palette instance is deployed into an active and healthy Kubernetes cluster. Refer to
  [Self-Hosted Palette Installation](../../enterprise-version/install-palette/install-palette.md) for additional
  guidance.

- The self-hosted Palette instance is configured to use the proxy server that you intend for your applications to use
  for outbound communications.

</TabItem>

<TabItem value="Edge">

- An Edge host that is configured to use the proxy server that you intend for your applications to use for outbound
  communications.

</TabItem>

</Tabs>

## Configure Applications to Use Proxy Server

<Tabs group="scenario">

<TabItem value="Palette SaaS Non-Edge">

1.  If you are using Palette SaaS, and your cluster does not have direct access to the internet, then the communication
    between Palette SaaS and your cluster must go through a Private Cloud Gateway (PCG). For more information about
    PCGs, refer to [Private Cloud Gateway](../pcg/pcg.md). You must configure proxy settings for the PCG, and then
    clusters created by cloud accounts configured to use the PCG will inherit its proxy settings.

    If you are provisioning the PCG using the Palette CLI, you can configure the proxy settings during the PCG
    installation through the Palette CLI's interactive prompts. If you are using Helm to provision a PCG or have an
    existing PCG that is not yet configured to use proxy, refer to to
    [Enable and Manage Proxy Configurations for PCG](../pcg/manage-pcg/configure-proxy.md) to learn how to install Reach
    on a PCG cluster and use it to configure proxy settings.

2.  Once you have configured proxy settings through Reach for your PCG, you can proceed to create your cluster using a
    cloud account associated with the PCG. The cluster will inherit proxy settings from the PCG automatically.

    However, you still need to specify which applications will use the proxy settings. You can do this by applying the
    `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set in the pack that contains your
    application.

    You must apply the label to every specific job, deployment, or daemon set that needs to use the proxy servers. For
    example, if you have a Kafka deployment that requires access to the internet through your proxy, you need to apply
    the label to the Kafka deployment.

    ```yaml {10}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: kafka
    spec:
      template:
        metadata:
          labels:
            app: kafka
            spectrocloud.com/connection: proxy
    ```

3.  Continue with the cluster creation process and provision your cluster. For more information, refer to
    [Clusters](../clusters.md) and choose the infrastructure provider of your choice.

</TabItem>

<TabItem value="Self-Hosted Palette Non-Edge">

1.  If you are using a self-hosted Palette instance, you have the opportunity to configure proxy settings during
    installation. If you are using the Palette CLI for installation, refer to
    [Self Hosted Palette - Installation](../../enterprise-version/install-palette/install-on-kubernetes/install.md) to
    learn how to specify proxy settings during installation. If you used Helm charts for installation, refer to
    [Enable and Manage Proxy Configurations](../pcg/manage-pcg/add-dns-mapping.md) to learn how to install reach and use
    it to configure proxy settings. The process to install Reach on an existing self-hosted Palette instance is the same
    as the process to install Reach on an existing PCG cluster.

2.  Once you have configured proxy settings through Reach for your self-hosted Palette instance, you can proceed to
    create your cluster. The cluster will inherit proxy settings from the Palette instance automatically.

    However, you still need to specify which applications will use the proxy settings. You can do this by applying the
    `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set in the pack that contains the
    application.

    You must apply the label to every specific job, deployment, or daemon set that needs to use the proxy servers. For
    example, if you have a Kafka deployment that requires access to the internet through your proxy, you need to apply
    the label to the Kafka deployment.

    ```yaml {7}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: kafka
    spec:
      template:
        metadata:
          labels:
            app: kafka
            spectrocloud.com/connection: proxy
    ```

3.  Continue with the cluster creation process and provision your cluster. For more information, refer to
    [Clusters](../clusters.md) and choose the infrastructure provider of your choice.

</TabItem>

<TabItem value="Edge">

1.  For Edge clusters, you specify the proxy settings for your Edge host during installation in your Edge installer
    **user-data**. For more information, refer to [Installation](../edge/site-deployment/stage.md). If your Edge host is
    deployed in airgap mode, you may also specify the proxy settings in Local UI. For more information, refer to
    [Configure HTTP-Proxy in Local UI](../edge/local-ui/host-management/configure-proxy.md).

2.  Once you have configured proxy settings for your Edge host, you can proceed to create your cluster. The cluster will
    use the proxy settings you configured for the Edge host.

    However, you still need to specify which applications will use the proxy settings. You can do this by applying the
    `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set in the pack that contains the
    application.

    You must apply the label to every specific job, deployment, or daemon set that needs to use the proxy servers. For
    example, if you have a Kafka deployment that requires access to the internet through your proxy, you need to apply
    the label to the Kafka deployment.

    ```yaml {7}
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: kafka
    spec:
      template:
        metadata:
          labels:
            app: kafka
            spectrocloud.com/connection: proxy
    ```

3.  Continue with the cluster creation process and provision your cluster. For more information, refer to
    [Create Cluster Definition](../edge/site-deployment/cluster-deployment.md).

</TabItem>

</Tabs>

## Validate

1. Access your cluster with kubectl. For more information, refer to [Access Cluster with kubectl](./palette-webctl.md).

2. Issue the following command. Replace `pod-name` with the name of the pod for your application and replace
   `your-namespace` with the namespace where the pod resides.

   ```
   kubectl get pod pod-name -o jsonpath='{.spec.containers[*].env}' --namespace your-namespace | jq .
   ```

   The command will yield output similar to the following. If the output includes the proxy settings you configured, you
   can validate that the application is configured to use the proxy server.

   ```json
   [
     {
       "name": "http_proxy",
       "value": "http://10.10.180.0:3128"
     },
     {
       "name": "https_proxy",
       "value": "http://10.10.180.0:3128"
     },
     {
       "name": "NO_PROXY",
       "value": ""
     },
     {
       "name": "USER_NO_PROXY",
       "value": ""
     }
   ]
   ```
