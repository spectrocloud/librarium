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

- The Kubeconfig file for the Kubernetes cluster where the PCG is deployed. The Kubconfig file is used to authenticate
  with the Kubernetes cluster and deploy the Reach service.

- Admin access to the Kubernetes cluster where the PCG is deployed. The Reach Helm Chart will create namespace, service
  accounts, and roles in the cluster.

- The extract utility `zip` and `tar` is installed on the machine you are using to deploy the Helm chart.

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

    This feature has only been tested with Azure. If you are using a different cloud provider, contact our support team
    for additional guidance.

    :::

- Download the Reach Helm Chart provided by our suppor team. The Reach Helm Chart is used to deploy the Reach service
  into the Kubernetes cluster where the PCG is deployed. The Reach service is used to manage proxy configurations for
  the PCG. Contact our support team to obtain the Reach Helm Chart.

- `cert-manager` is not already deployed in the Kubernetes cluster where the PCG is deployed. If `cert-manager` is
  already deployed, make sure you edit the deployment to use the
  `- --feature-gates=AdditionalCertificateOutputFormats=true` flag. Otherwise, the Reach service will not be able to
  manage the proxy configurations.

## Enable Proxy

1. Open a terminal session and navigate to the folder you have the Reach Helm Chart zip file downloaded to.

2. Unzip the downloaded artifact you received from the support team.

   ```shell
   unzip release-*.zip -d palette
   ```

3. Navigate to the release folder inside the unzipped folder.

   ```shell
   cd palette/charts/release-*/
   ```

4. Deploy `cert-manager` to the Kubernetes cluster where the PCG is deployed. Use the following command to deploy the
   `cert-manager` Helm Chart.

   ```shell
   helm upgrade --values extras/cert-manager/values.yaml \
   cert-manager extras/cert-manager/cert-manager-*.tgz --install
   ```

5. Next, navigate to the reach-system folder and extract the Reach Helm Chart.

   ```shell
   cd extras/reach-system/ && tar -xvzf reach-system-*.tgz
   ```

6. Use a text editor and open the **values.yaml** file that is inside the **reach-system** directory. Fill out the
   following YAML fields with the proxy configuration details:

   - `reachSystem.enabled`: Set this field to `true` to enable the Reach service.
   - `reachSystem.proxySettings.http_proxy`: The HTTP proxy URL, including the port number.
   - `reachSystem.proxySettings.https_proxy`: The HTTPS proxy URL, including the port number.
   - `reachSystem.proxySettings.no_proxy`: A comma-separated list of URLs that should bypass the proxy.
   - `reachSystem.proxySettings.ca_crt_path`: The path to the CA certificate file used to authenticate the proxy server.
     Make sure the CA is in PEM format. If you do not have a CA certificate, leave this field empty.

   <br />

   :::info

   A note on the `no_proxy` field: The `no_proxy` field is a comma-separated list of URLs that should bypass the proxy.
   Depending on your environment, you may need to add additional URLs to this list. The list provided in the code
   snippet below is a generic list that should work for most environments. The IP adderess `169.254.169.254,` is
   required to be added to the `no_proxy` list. Otherwise, pods will not be able to start up successfully.

   ```
   aks.io,.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,.privatelink.eastus.azmk8s.io,.azure.com,.aks.io,.capz.io,.spectrocloud.com,gcr.io,windows.net,.windows.net,.microsoftonline.com,.amazonaws.com,.gcr.io,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net
   ```

   :::

   The following is an example of a filled-out **values.yaml** file.

   ```yaml hideClipboard
   reachSystem:
     enabled: true
     proxySettings:
       http_proxy: "http://172.16.0.4:1080"
       https_proxy: "https://172.16.0.4:1080"
       no_proxy: ".aks.io,.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,.privatelink.eastus.azmk8s.io,.azure.com,.aks.io,.capz.io,.spectrocloud.com,gcr.io,windows.net,.windows.net,.microsoftonline.com,.amazonaws.com,.gcr.io,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net"
       ca_crt_path: "proxy-ca-cert.pem"
   ```

7. Save the **values.yaml** file.

8. Deploy the Reach service into the Kubernetes cluster where the PCG is deployed using the Reach Helm Chart. Use the
   following command to deploy the Reach service.

   ```shell
   helm upgrade --values reach-system/values.yaml reach-system reach-system-*.tgz --install
   ```

   ```shell hideClipboard
   WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /Users/ubuntu/.kube/config
   WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /Users/ubuntu/.kube/config
   Release "reach-system" does not exist. Installing it now.
   NAME: reach-system
   LAST DEPLOYED: Mon Jul 15 15:17:58 2024
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   ```

Once the Reach service is deployed, the PCG will use the proxy configuration provided in the Reach Helm Chart. If the
cloud account is configured to use the PCG, the proxy configuration will be inherited by the workload clusters deployed
through Palette.

## Validate

To validate the Reach service is deployed and the proxy configuration is enabled for the PCG, use the following steps.

1. Open a terminal session.

2. Issue the following command command against the Kubernetes cluster where the PCG is deployed to verify the Reach
   service pod is active.

   ```shell
   kubectl get pods --namespace reach-system
   ```

   The output should display the Reach service pods in a healthy state.

   ```shell hideClipboard
   NAME                                                READY   STATUS    RESTARTS   AGE
   reach-controller-manager-995c74db5-frb5j            2/2     Running   0          2m
   ```

3. After you configure you configure your cloud account to use the PCG. You can verify deployed clusters inherit the
   proxy configuration from the PCG. To verify the proxy configuration is inherited by the workload clusters, deploy a
   workload cluster through Palette. SSH into a node in the workload cluster and issue the following command to verify
   the proxy configuration is inherited.

   ```shell
   cat /etc/systemd/system/containerd.service.d/http-proxy.conf
   ```

   The output will display the proxy configuration details. Below is an example of the output.

   ```shell hideClipboard
   [Service]
   Environment="HTTP_PROXY=http://172.16.0.4:1080"
   Environment="HTTPS_PROXY=https://172.16.0.4:1080"
   Environment="NO_PROXY=.aks.io,.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,.privatelink.eastus.azmk8s.io,.azure.com,.aks.io,.capz.io,.spectrocloud.com,gcr.io,windows.net,.windows.net,.microsoftonline.com,.amazonaws.com,.gcr.io,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net"
   ```
