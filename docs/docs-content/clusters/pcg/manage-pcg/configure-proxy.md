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
not have a proxy configuration. If your infrastructure environment requires a proxy configuration, you must manually add
and configure it using the [Reach system](../architecture.md#reach-system) Helm chart, which is included in the umbrella
Palette Helm chart. This ensures workload clusters deployed through Palette inherit proxy configurations from the PCG
cluster.

:::warning

This guide applies only to PCGs deployed to an [existing Kubernetes cluster](../deploy-pcg-k8s.md). If you deployed a
PCG through the [Palette CLI](../pcg.md#supported-environments), the Reach system and Cert Manager are automatically
installed during PCG provisioning. Refer to the respective platform installation guide for
[MAAS](../deploy-pcg/maas.md), [VMware vSphere](../deploy-pcg/vmware.md), or
[Apache CloudStack](../deploy-pcg/cloudstack.md) for instructions on how to configure proxy settings during the CLI
installation process.

:::

## Prerequisites

- An existing PCG deployed into an active and healthy Kubernetes cluster. Refer to
  [Deploy a PCG to an Existing Kubernetes Cluster](../deploy-pcg-k8s.md) for additional guidance.

- The kubeconfig file for the Kubernetes cluster where the PCG is deployed.

- Admin access to the Kubernetes cluster where the PCG is deployed.

- The extract utilities `zip` and `tar` installed on the system you are using to deploy the Helm chart.

- Proxy configuration details, such as the proxy URL, port, and authentication credentials.

- The deployed PCG must have network connectivity to the proxy server.

- The Kubernetes cluster where the PCG is deployed must have the proxy configuration. This includes any Certificate
  Authority (CA) certificates required to authenticate with the proxy server. This step varies by platform. Below is a
  list of helpful links to set up proxy configurations for some common Kubernetes platforms:

  - [AWS EKS](https://repost.aws/knowledge-center/eks-http-proxy-containerd-automation)
  - [AKS](https://learn.microsoft.com/en-us/azure/aks/http-proxy)

    :::warning

    This feature has only been tested on AWS and Azure. If you are using a different cloud provider, contact our Support
    team for additional guidance.

    :::

- If the proxy server uses a CA certificate, the certificate file must be named `ca.crt` and be in Privacy-Enhanced Mail
  (PEM) format.

- Access to the Palette Helm chart compatible with your Palette version. Refer to
  [Access Palette](../../../self-hosted-setup/palette/palette.md#access-palette) for instructions on how to request
  access to the Palette Helm chart.

## Enable Proxy

1. Open a terminal session and navigate to the directory where you downloaded the Palette Helm chart.

2. Unzip the Palette Helm chart.

   ```shell
   unzip charts.zip -d palette
   ```

3. Navigate to the `cert-manager` folder.

   ```shell
   cd extras/cert-manager/
   ```

4. Deploy the `cert-manager` Helm chart to the Kubernetes cluster where the PCG is deployed.

   ```shell
   helm upgrade --values values.yaml \
   cert-manager cert-manager-*.tgz --install
   ```

   ```shell hideClipboard title="Example output"
   Release "cert-manager" does not exist. Installing it now.
   NAME: cert-manager
   LAST DEPLOYED: Mon Mar  9 13:34:02 2026
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   ```

5. Next, navigate to the `reach-system` folder and extract the Reach Helm chart.

   ```shell
   cd ../reach-system/ && tar -xvzf reach-system-*.tgz
   ```

   ```shell hideClipboard title="Example output"
   x reach-system/
   x reach-system/crds/
   x reach-system/Chart.yaml
   x reach-system/.helmignore
   x reach-system/templates/
   x reach-system/values.yaml
   x reach-system/templates/webhooks.yaml
   x reach-system/templates/deployment.yaml
   x reach-system/templates/service.yaml
   x reach-system/templates/certificates.yaml
   x reach-system/templates/rbac.yaml
   x reach-system/templates/namespace.yaml
   x reach-system/templates/configmap.yaml
   x reach-system/templates/secret.yaml
   x reach-system/crds/reach-system.yaml
   ```

6. Open the `reach-system/values.yaml` file in a text editor. Configure the following YAML fields with your proxy
   details.

   | Field Name                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
   | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `reachSystem.enabled`                   | Set to `true` to enable the Reach service.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
   | `reachSystem.proxySettings.http_proxy`  | The HTTP proxy URL, including the port number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
   | `reachSystem.proxySettings.https_proxy` | The HTTPS proxy URL, including the port number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | `reachSystem.proxySettings.no_proxy`    | A comma-separated list of URLs that should bypass the proxy. The IP address `169.254.169.254` is required; otherwise, pods cannot start.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | `reachSystem.proxySettings.ca_crt_path` | (Optional) Provide the filepath on the installer host to the proxy’s CA certificate file. This certificate must be present at the indicated filepath on each node of the PCG cluster in order to be added to the node trust store. The CA certificate file _must_ be named `ca.crt`. Example: `/usr/local/share/ca-certificates/ca.crt`. <br /><br /> **NOTE**: Proxy CA certificates are _not_ automatically propagated to workload clusters using the PCG; these certificates must be added at either the tenant level or cluster profile OS layer. Refer to the [Configure Proxy CA Certificates for Workload Clusters](./configure-proxy-ca-certs.md) guide for more information. |
   | `reachSystem.scheduleOnControlPlane`    | Specifies whether to schedule the Reach system on the control plane. Due to node affinity configurations, you must set `scheduleOnControlPlane: false` for managed clusters deployed to [AKS](../../public-cloud/azure/aks.md), [AWS EKS](../../public-cloud/aws/eks.md), and [GCP GKE](../../public-cloud/gcp/create-gcp-gke-cluster.md).                                                                                                                                                                                                                                                                                                                                            |

   :::tip

   The `no_proxy` list provided in the following code snippet is a generic list that works for most environments.
   Depending on your environment, you may need to add additional URLs to this list. The IP address `169.254.169.254` is
   required; otherwise, pods cannot start.

   ```
   .aks.io,.amazonaws.com,.eks.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,gcr.io,windows.net,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net
   ```

   :::

   ```yaml hideClipboard title="Example values.yaml file"
   reachSystem:
     enabled: true
     proxySettings:
       http_proxy: "http://172.16.0.4:1080"
       https_proxy: "https://172.16.0.4:1080"
       no_proxy: ".aks.io,.amazonaws.com,.eks.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,gcr.io,windows.net,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net"
       ca_crt_path: "/usr/local/share/ca-certificates/ca.crt"
     manager:
       image: "us-docker.pkg.dev/palette-images/palette/spectro-reach:4.8.2"
     kube_rbac_proxy:
       image: "us-docker.pkg.dev/palette-images-fips/palette/kube-rbac-proxy:v0.19.1-spectro-4.7.0"
     scheduleOnControlPlane: true

     imagePullSecret:
       create: false # Set it as true if using  ImagePullSecret for Private registry Authentication
       dockerConfigJson: "" # Provide base64 encoded dockerconfigjson value here
   ```

7. Save the `values.yaml` file.

8. Deploy the Reach service into the Kubernetes cluster where the PCG is deployed using the `reach-system` Helm chart.

   ```shell
   helm upgrade --values reach-system/values.yaml reach-system reach-system-*.tgz --install
   ```

   ```shell hideClipboard title="Example output"
   Release "reach-system" does not exist. Installing it now.
   NAME: reach-system
   LAST DEPLOYED: Mon Mar  9 14:05:55 2026
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   ```

Once the Reach service is deployed, the PCG uses the proxy configuration in the Reach Helm chart. If the cloud account
is configured to use the PCG, the workload cluster deployed through the PCG inherits the PCG the proxy configuration.

:::info

If your proxy server uses a CA certificate, workload cluster nodes and pods need additional configuration to trust the
proxy. Refer to [Configure Proxy CA Certificates for Workload Clusters](./configure-proxy-ca-certs.md) for instructions
on configuring node-level and pod-level CA certificate trust.

:::

## Validate

Use the following steps to validate that the Reach service is deployed and that the proxy configuration is enabled for
the PCG.

1. Open a terminal session and run the following command on the Kubernetes cluster where the PCG is deployed. Verify
   that the pods are active and healthy.

   ```shell
   kubectl get pods --namespace reach-system
   ```

   ```shell hideClipboard title="Example output"
   NAME                                                READY   STATUS    RESTARTS   AGE
   reach-controller-manager-995c74db5-frb5j            2/2     Running   0          2m
   ```

2. If you have not already, add your [AWS](../../public-cloud/aws/add-aws-accounts/add-aws-accounts.md),
   [Azure](../../public-cloud/azure/azure-cloud.md), or
   [Nutanix](../../data-center/nutanix/add-nutanix-cloud-account.md) cloud account to Palette with the **Connect Private
   Cloud Gateway** option toggled and your self-hosted PCG selected.

3. Deploy a workload cluster through the PCG. Refer to the appropriate guide for information on deploying clusters to
   your environment:

   - [AWS IaaS](../../public-cloud/aws/create-cluster.md)
   - [AWS EKS](../../public-cloud/aws/eks.md)
   - [Azure](../../public-cloud/azure/create-azure-cluster.md)
   - [AKS](../../public-cloud/azure/aks.md)
   - [Nutanix](../../data-center/nutanix/create-manage-nutanix-cluster.md)

4. SSH into a node in the workload cluster. Refer to the [SSH Keys](../../cluster-management/ssh/ssh-keys.md) and
   [SSH Usernames](../../cluster-management/ssh/ssh-usernames.md) guides for information on accessing cluster nodes.

   ```shell
   ssh -i <private-key-path> <username>@<dns-or-ip-address>
   ```

   ```shell hideClipboard title="Example command"
   ssh -i ~/.ssh/spectro2026.pem ubuntu@10.10.149.37
   ```

5. Run the following command to verify that the workload cluster inherited the proxy configuration.

   ```shell
   cat /etc/systemd/system/containerd.service.d/http-proxy.conf
   ```

   ```shell hideClipboard title="Example output"
   [Service]
   Environment="HTTP_PROXY=http://172.16.0.4:1080"
   Environment="HTTPS_PROXY=https://172.16.0.4:1080"
   Environment="NO_PROXY=..aks.io,.amazonaws.com,.eks.amazonaws.com,.azure.com,.capz.io,.cluster.local,.gcr.io,.hubble-system,.kube-system,.kvdb,.microsoftonline.com,.privatelink.eastus.azmk8s.io,.spectrocloud.com,.spectrocloud.dev,.svc,.windows.net,10.0.0.0/8,10.10.128.10,10.10.192.1/18,10.96.0.0/12,127.0.0.1,169.254.169.254,gcr.io,windows.net,192.168.0.0/16,gcr.io,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,windows.net"
   ```
