---
sidebar_label: "Configure Applications to Use Proxy Server"
title: "Configure Applications to Use Proxy Server"
description: "Guide to configure configurations in a cluster to use a proxy server."
hide_table_of_contents: false
sidebar_position: 201
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

:::tip

We recommend you review the [gRPC and Proxies](../../architecture/grps-proxy.md) article to be aware of network proxies
that Palette supports. Palette uses gRPC to communicate with clusters, and depending on the proxy server you use, you
may need to configure the proxy server to support gRPC.

:::

## Prerequisites

- An active proxy server reachable by your cluster.

<Tabs groupId="scenario">

<TabItem value="Palette SaaS Non-Edge">

- A PCG is deployed into an active and healthy Kubernetes cluster. Refer to
  [Deploy a PCG to an Existing Kubernetes Cluster](../pcg/deploy-pcg-k8s.md) or
  [Deploy a PCG with Palette CLI](../pcg/deploy-pcg/deploy-pcg.md) for additional guidance.

- The PCG is configured to use the proxy server that you intend for your applications to use for outbound
  communications. For more information, refer to
  [Enabled and Manage Proxy Configurations](../pcg/manage-pcg/configure-proxy.md).

  - If you deployed a PCG through the Palette CLI, refer to
    [the respective platform installation guide](../pcg/pcg.md#supported-environments) for instructions on how to
    configure proxy settings during the installation process through the CLI.

</TabItem>

<TabItem value="Self-Hosted Palette Non-Edge">

- A [self-hosted Palette](../../self-hosted-setup/palette/supported-environments/kubernetes/kubernetes.md) or
  [Palette VerteX](../../self-hosted-setup/vertex/supported-environments/kubernetes/kubernetes.md) instance deployed on
  an active and healthy Kubernetes cluster.

- The self-hosted Palette instance is configured to use the proxy server that you intend for your applications to use
  for outbound communications.

</TabItem>

<TabItem value="Edge">

- Your Edge host is configured to use the proxy server that you intend for your applications to use for outbound
  communications. Refer to [Edge Host Installation](../edge/site-deployment/stage.md) for more information.

</TabItem>

</Tabs>

## Configure Applications to Use Proxy Server

<Tabs groupId="scenario">

<TabItem value="Palette SaaS Non-Edge">

1.  If you are using Palette SaaS, you must deploy a Private Cloud Gateway (PCG) and configure it to use a proxy server
    before you can configure cluster applications to use the proxy server. For more information about PCGs, refer to
    [Private Cloud Gateway](../pcg/pcg.md).

    If you are provisioning the PCG using the Palette CLI, you can configure the proxy settings during the PCG
    installation through the Palette CLI's interactive prompts. If you are using Helm to provision a PCG or have an
    existing PCG that is not yet configured to use proxy, refer to
    [Enable and Manage Proxy Configurations for PCG](../pcg/manage-pcg/configure-proxy.md) to learn how to install Reach
    on a PCG cluster and use it to configure proxy settings.

2.  If you deployed the PCG using the Palette CLI, the cloud account is created automatically. You can skip this step.

    Once you have deployed the PCG, you must create a new cloud account associated with the PCG. Refer to the following
    resources to learn how to create a cloud account:

    - [Add an AWS Account to Palette](../public-cloud/aws/add-aws-accounts/add-aws-accounts.md)
    - [Register and Manage Azure Cloud Account](../public-cloud/azure/azure-cloud.md)
    - [Register and Manage GCP Accounts](../public-cloud/gcp/add-gcp-accounts.md)

3.  Create a cluster profile that contains your application. Refer to
    [Create a Cluster Profile](../../profiles/cluster-profiles/cluster-profiles.md) for additional guidance.

    In your cluster profile, apply the `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set
    in the pack that contains your application.

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

4.  Start creating your cluster using the cloud account associated with the PCG. Refer to the following resources on
    cluster creation.

    - [Create and Manage AWS Cluster](../public-cloud/aws/create-cluster.md)
    - [Create and Manage Azure IaaS Cluster](../public-cloud/azure/create-azure-cluster.md)
    - [Create and Manage GCP IaaS Cluster](../public-cloud/gcp/create-gcp-iaas-cluster.md)

</TabItem>

<TabItem value="Self-Hosted Palette Non-Edge">

1.  If you are using a self-hosted Palette instance, you have the opportunity to configure proxy settings during
    installation. If you are using the Palette CLI for installation, refer to
    [Self Hosted Palette - Installation](../../self-hosted-setup/palette/supported-environments/kubernetes/install/non-airgap.md)
    to learn how to specify proxy settings during installation. If you used Helm charts for installation, refer to
    [Enable and Manage Proxy Configurations](../pcg/manage-pcg/configure-proxy.md) to learn how to install reach and use
    it to configure proxy settings. The process to install Reach on an existing self-hosted Palette instance is the same
    as the process to install Reach on an existing PCG cluster.

2.  Create a cluster profile that contains your application. Refer to
    [Create a Cluster Profile](../../profiles/cluster-profiles/cluster-profiles.md) for additional guidance.

    In your cluster profile, apply the `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set
    in the pack that contains your application.

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

3.  Start creating your cluster using the cluster profile. Refer to the following resources on cluster creation.

    - [Create and Manage AWS Cluster](../public-cloud/aws/create-cluster.md)
    - [Create and Manage Azure IaaS Cluster](../public-cloud/azure/create-azure-cluster.md)
    - [Create and Manage GCP IaaS Cluster](../public-cloud/gcp/create-gcp-iaas-cluster.md)

</TabItem>

<TabItem value="Edge">

1.  For Edge clusters, you specify the proxy settings for your Edge host during installation in your Edge installer
    **user-data**. For more information, refer to [Installation](../edge/site-deployment/stage.md). If your Edge host is
    deployed in airgap mode, you may also specify the proxy settings in Local UI. For more information, refer to
    [Configure HTTP-Proxy in Local UI](../edge/local-ui/host-management/configure-proxy.md).

2.  Create a cluster profile that contains your application. Refer to
    [Create a Cluster Profile](../../profiles/cluster-profiles/cluster-profiles.md) for additional guidance.

    In your cluster profile, apply the `spectrocloud.com/connection: proxy` label to the deployment, job, or daemon set
    in the pack that contains your application.

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

3.  Create a cluster using the cluster profile. For more information, refer to
    [Create Cluster Definition](../edge/site-deployment/cluster-deployment.md).

</TabItem>

</Tabs>

## Validate

1. Access your cluster with kubectl. For more information, refer to [Access Cluster with kubectl](./palette-webctl.md).

2. Issue the following command. Replace `pod-name` with the name of the pod for your application and replace
   `your-namespace` with the namespace where the pod resides.

   ```
   kubectl get pod pod-name --output jsonpath='{.spec.containers[*].env}' --namespace your-namespace | jq .
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
