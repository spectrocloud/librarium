---
sidebar_label: "Enable and Mange Proxy Configurations"
title: "Enable and Mange Proxy Configurations"
description:
  "Learn how to add and manage proxy configurations for a Private Cloud Gateway (PCG) deployed in to an existing
  Kubernetes cluster."
hide_table_of_contents: false
sidebar_position: 14
tags: ["pcg", "proxy"]
---

You can add and manage proxy configurations for a Private Cloud Gateway (PCG) deployed in to an existing Kubernetes
cluster. By default, a PCG deployed onto an existing Kubernetes cluster does not have a proxy configuration. If your
infrastructure environment requires a proxy configuration, use the instructions in this guide to add and manage proxy
configurations for a PCG deployed in a Kubernetes cluster and to ensure workload clusters deployed through Palette
inherit the proxy configuration from the PCG cluster.

:::info

You workload clusters deployed through Palette will inherit proxy configuration from the PCG cluster. The PCG is not
used as a network proxy for deployed workload clusters. The PCG does also not provide connectivity to the internet for
the workload clusters. Individual workload clusters must have their own proxy configurations to access the internet.

:::

Use the following steps to add and manage proxy configurations for a PCG.

## Prerequisites

- A PCG is deployed into an existing Kubernetes cluster, active, and in a healthy state. Refer to
  [Deploy a PCG to an Existing Kubernetes Cluster](../deploy-pcg-k8s.md) for additional guidance.

  :::warning

  If you deployed a [PCG through the Palette CLI](../pcg.md#supported-environments), refer to the respective platform
  install guide for instructions on how to configure proxy settings during the installation process through the CLI.

  :::

- Tenant administrator access.

- Proxy configuration details, such as the proxy URL, port, and authentication credentials.

- The deployed PCG must have network connectivity to the proxy server.

- The Kubernetes cluster where the PCG is deployed must have the proxy configuration set up. This includes any
  Certificate Authority (CA) certificates required to authenticate the proxy server. This step varies depending on the
  platform where the Kubernetes cluster is deployed. Some platforms, such as managed Kubernetes services, may require
  additional steps. Below is a list of helpful links to set up proxy configurations for some common Kubernetes
  platforms:

  - [Amazon EKS](https://repost.aws/knowledge-center/eks-http-proxy-containerd-automation)
  - [Azure AKS](https://learn.microsoft.com/en-us/azure/aks/http-proxy)
  - [Google GKE](https://cloud.google.com/kubernetes-engine/docs/archive/creating-kubernetes-engine-private-clusters-with-net-proxies)

    :::warning

    This feature has only been tested with Azure. If you are using a different cloud provider, please contact our
    support team for additional guidance.

    :::

- Download the Reach Helm Chart provided by our suppor team. The Reach Helm Chart is used to deploy the Reach service
  into the Kubernetes cluster where the PCG is deployed. The Reach service is used to manage proxy configurations for
  the PCG. Contact our support team to obtain the Reach Helm Chart.

## Enable Proxy
