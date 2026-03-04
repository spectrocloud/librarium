---
sidebar_label: "Enable and Manage Proxy Configurations"
title: "Enable and Manage Proxy Configurations"
description:
  "Learn how to add and manage proxy configurations for a Private Cloud Gateway (PCG) deployed into an existing
  Kubernetes cluster."
hide_table_of_contents: false
sidebar_position: 14
tags: ["pcg", "proxy"]
---

You can add and manage proxy configurations for a Private Cloud Gateway (PCG) deployed into an
[existing Kubernetes cluster](../deploy-pcg-k8s.md). By default, a PCG deployed to an existing Kubernetes cluster does
not have a proxy configuration. If your infrastructure environment requires a proxy configuration, use the instructions
in this guide to add and manage proxy configurations for a PCG deployed in a Kubernetes cluster and to ensure workload
clusters deployed through Palette inherit the proxy configuration from the PCG cluster. The PCG is not used as a network
proxy for deployed workload clusters and does not provide internet connectivity for the workload clusters. Individual
workload clusters must have their own proxy configurations to access the internet.

:::warning

This guide applies only to PCGs deployed to an [existing Kubernetes cluster](../deploy-pcg-k8s.md). If you deployed a
PCG through the [Palette CLI](../pcg.md#supported-environments), the Reach system and `cert-manager` are automatically
installed during PCG provisioning. Refer to the respective platform installation guide for
[MAAS](../deploy-pcg/maas.md), [VMware vSphere](../deploy-pcg/vmware.md), or
[Apache CloudStack](../deploy-pcg/cloudstack.md) for instructions on how to configure proxy settings during the CLI
installation process.

:::

## How the Reach System Works

The Reach system is a Kubernetes
[mutating admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)
that automatically injects configuration into pods at creation time. When deployed, it creates the following resources
in the `reach-system` namespace:

- Two Custom Resource Definitions (CRDs): **ClusterPodPreset** (cluster-scoped) and **PodPreset** (namespace-scoped).
  These resources define the environment variables, volumes, and volume mounts to inject into matching pods.

- A **MutatingWebhookConfiguration** that intercepts pod creation requests and applies the preset configurations.

When Palette configures the Reach system with proxy settings, it creates ClusterPodPreset resources that inject the
`HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables into all matching pods across the cluster.
Namespace-scoped PodPreset resources are also created to append namespace-specific entries to the `NO_PROXY` list, so
that in-cluster service discovery traffic bypasses the proxy.

The Reach system also supports injecting volumes and volume mounts into pods. This is used to mount Certificate
Authority (CA) certificates into pods so they can trust the proxy server. For more information about configuring proxy
CA certificates for workload clusters, refer to
[Configure Proxy CA Certificates for Workload Clusters](#configure-proxy-ca-certificates-for-workload-clusters).

Use the following steps to add and manage proxy configurations for a PCG.

## Prerequisites

- A PCG is deployed into an active and healthy Kubernetes cluster. Refer to
  [Deploy a PCG to an Existing Kubernetes Cluster](../deploy-pcg-k8s.md) for additional guidance.

- The kubeconfig file for the Kubernetes cluster where the PCG is deployed. The kubeconfig file is used to authenticate
  with the Kubernetes cluster and deploy the Reach service.

- Admin access to the Kubernetes cluster where the PCG is deployed. The Reach Helm Chart will create a namespace,
  service accounts, and roles in the cluster.

- The extract utilities `zip` and `tar` are installed in the system you are using to deploy the Helm chart.

- Palette tenant administrator access.

- Proxy configuration details, such as the proxy URL, port, and authentication credentials.

- The deployed PCG must have network connectivity to the proxy server.

- The Kubernetes cluster where the PCG is deployed must have the proxy configuration. This includes any Certificate
  Authority (CA) certificates that are required to authenticate with the proxy server. This step varies depending on the
  platform where the Kubernetes cluster is deployed. Some platforms, such as managed Kubernetes services, may require
  additional steps. Below is a list of helpful links to set up proxy configurations for some common Kubernetes
  platforms:

  - [Amazon EKS](https://repost.aws/knowledge-center/eks-http-proxy-containerd-automation)
  - [Azure AKS](https://learn.microsoft.com/en-us/azure/aks/http-proxy)
  - [vSphere](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere-supervisor/8-0/installing-and-configuring-vsphere-supervisor/configuring-and-managing-a-supervisor-cluster/configuring-http-proxy-settings-in-vsphere-with-tanzu.html)

    :::warning

    This feature has only been tested on AWS, Azure, and VMware vSphere. If you are using a different cloud provider,
    contact our support team for additional guidance.

    :::

- If the proxy server uses a CA certificate, the certificate file must be named `ca.crt` and be in PEM format.

- Download the Reach Helm Chart provided by our support team. The Reach Helm Chart is used to deploy the Reach service
  into the Kubernetes cluster where the PCG is deployed. The Reach service is used to manage proxy configurations for
  the PCG. Contact our support team to obtain the Reach Helm Chart.

- `cert-manager` is not already deployed in the Kubernetes cluster where the PCG is deployed. The reason for this is
  that you will deploy `cert-manager` as part of the enablement steps.

  :::info

  If `cert-manager` is already deployed, you can continue to use the service but make sure you edit the deployment to
  use the `- --feature-gates=AdditionalCertificateOutputFormats=true` flag. Otherwise, the Reach service cannot manage
  the proxy configurations.

  :::

## Enable Proxy

1. Open a terminal session and navigate to the folder where you downloaded the Reach Helm Chart zip file.

2. Unzip the zip file you received from the support team.

   ```shell
   unzip release-*.zip -d palette
   ```

3. Navigate to the release folder.

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

6. Open the **reach-system/values.yaml** file in a text editor. Fill out the following YAML fields with the proxy
   configuration details:

   | Field Name                              | Description                                                                                                                                                                                                                                                                                                                                      |
   | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `reachSystem.enabled`                   | Set this field to `true` to enable the Reach service.                                                                                                                                                                                                                                                                                            |
   | `reachSystem.proxySettings.http_proxy`  | The HTTP proxy URL, including the port number.                                                                                                                                                                                                                                                                                                   |
   | `reachSystem.proxySettings.https_proxy` | The HTTPS proxy URL, including the port number.                                                                                                                                                                                                                                                                                                  |
   | `reachSystem.proxySettings.no_proxy`    | A comma-separated list of URLs that should bypass the proxy.                                                                                                                                                                                                                                                                                     |
   | `reachSystem.proxySettings.ca_crt_path` | The path to the CA certificate file used to authenticate the proxy server. Make sure the CA certificate is in the PEM format. If you do not have a CA certificate, leave this field empty.                                                                                                                                                       |
   | `reachSystem.scheduleOnControlPlane`    | Specifies whether to schedule the reach system on the control plane. Due to node affinity configurations, you must set `scheduleOnControlPlane: false` for managed clusters deployed to [Azure AKS](../../public-cloud/azure/aks.md), [AWS EKS](../../public-cloud/aws/eks.md), and [GCP GKE](../../public-cloud/gcp/create-gcp-gke-cluster.md). |

   <br />

   :::info

   A note on the `no_proxy` field: The `no_proxy` field is a comma-separated list of URLs that should bypass the proxy.
   Depending on your environment, you may need to add additional URLs to this list. The list provided in the code
   snippet below is a generic list that should work for most environments. The IP address `169.254.169.254,` is required
   to be added to the `no_proxy` list. Otherwise, pods will not be able to start up successfully.

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

Once the Reach service is deployed, the PCG will use the proxy configuration in the Reach Helm Chart. If the cloud
account is configured to use the PCG, the proxy configuration will be inherited by the workload clusters deployed
through Palette.

## Configure Proxy CA Certificates for Workload Clusters

When your proxy server uses a CA certificate for TLS inspection, workload cluster nodes and pods need access to the CA
certificate to establish trusted connections through the proxy. The Reach system handles injecting proxy environment
variables into pods automatically, but the CA certificate must be configured separately.

Proxy CA certificates provided during PCG installation are propagated to the PCG cluster nodes but are not automatically
propagated to workload cluster nodes. You must configure the CA certificate at either the tenant level or the cluster
profile level in the OS layer. Refer to the [PCG Architecture](../architecture.md#palette-cli) page for more information
about proxy CA certificate propagation.

If you deployed your PCG through the Palette CLI, the CLI installation guide includes steps for propagating proxy CA
certificates to workload clusters at the tenant level or cluster profile level. Refer to the appropriate platform
installation guide for [MAAS](../deploy-pcg/maas.md), [OpenStack](../deploy-pcg/openstack.md),
[VMware vSphere](../deploy-pcg/vmware.md), or [Apache CloudStack](../deploy-pcg/cloudstack.md).

### Mount Proxy CA Certificates into Pods

Adding a proxy CA certificate to the cluster profile OS layer places the certificate on each workload cluster node and
adds it to the node trust store. However, applications running inside pods do not automatically inherit the node trust
store. To make the CA certificate available inside pods, use the `podMount` configuration in the `kubeadmconfig.files`
section of the OS layer. The `podMount` configuration instructs Palette to mount the specified host file into pods
through the Reach system.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select the cluster profile used by your workload clusters and select the OS layer.

4. In the OS layer pack values, add a `podMount` entry to an existing `files` entry, or add a new `files` entry under
   the `kubeadmconfig` section. The `targetPath` field specifies the path on the host node where the CA certificate is
   located, and the `podMount.targetPath` field specifies the mount path inside pods.

   ```yaml
   kubeadmconfig:
     files:
       - targetPath: /usr/local/share/ca-certificates/ca.crt
         targetOwner: "root:root"
         targetPermissions: "0644"
         content: |
           -----BEGIN CERTIFICATE-----
           <your-proxy-ca-certificate-content>
           -----END CERTIFICATE-----
         podMount:
           allowed: true
           targetPath: /etc/ssl/certs/ca-certificates.crt
   ```

   The following table describes the fields in the configuration.

   | Field                 | Description                                                                                                                                                                      |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `targetPath`          | The path on the host node where the CA certificate file is written. The certificate file must be named `ca.crt`.                                                                 |
   | `targetOwner`         | The file ownership in the format `user:group`.                                                                                                                                   |
   | `targetPermissions`   | The file permissions in octal notation.                                                                                                                                          |
   | `content`             | The PEM-encoded CA certificate content. If the file already exists on the host node, you can omit this field.                                                                    |
   | `podMount.allowed`    | Set to `true` to enable mounting the host file into pods through the Reach system.                                                                                               |
   | `podMount.targetPath` | The path inside pods where the file is mounted. Use `/etc/ssl/certs/ca-certificates.crt` to make the certificate available to most applications that use the system trust store. |

5. **Save** your changes to the cluster profile.

6. If you have existing workload clusters using this profile, apply the updated profile to trigger a cluster update.

## Validate

Use the following steps to validate that the Reach service is deployed and that the proxy configuration is enabled for
the PCG.

1. Open a terminal session.

2. Issue the following command against the Kubernetes cluster where the PCG is deployed. Verify that the pods are active
   and healthy.

   ```shell
   kubectl get pods --namespace reach-system
   ```

   The output should display the Reach service pods in the **Running** status.

   ```shell hideClipboard
   NAME                                                READY   STATUS    RESTARTS   AGE
   reach-controller-manager-995c74db5-frb5j            2/2     Running   0          2m
   ```

3. After configuring your cloud account to use the PCG, you can verify that the deployed workload clusters inherit the
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
