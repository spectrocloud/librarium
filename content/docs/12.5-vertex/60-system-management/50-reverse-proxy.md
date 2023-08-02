---
title: "Reverse Proxy"
metaTitle: "Reverse Proxy"
metaDescription: "Learn how to configure a reverse proxy for Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

You can configure a reverse proxy for Palette VerteX. The reverse proxy can be used by host clusters deployed in a private network. Host clusters deployed in a private network are not accessible from the public internet or by users in different networks. You can use a reverse proxy to access the cluster's Kubernetes API server from a different network.

When you provide a custom reverse proxy server, clusters that use the [Spectro Proxy pack](/integrations/frp) will use the reverse proxy server address in the kubeconfig file. Clusters not using the Spectro Proxy pack will use the default cluster address in the kubeconfig file

You can deploy and maintain your own Spectro Proxy server. The Spectro Proxy server is designed to be deployed in a Kubernetes cluster. Use the instructions below to deploy a Spectro Proxy server.

# Prerequisites

- A Kubernetes cluster with sufficient resources to host the Spectro Proxy server. The Spectro Proxy server requires 1 CPU and 256 MB of memory.


- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.


- [Helm](https://helm.sh/docs/intro/install/) is installed and available.


- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using `kubectl` commands and have sufficient permissions to install Palette VerteX. We recommend using a role with cluster-admin permissions to install Palette VerteX.


- A domain name that you can use for the reverse proxy server. You will also need access to the DNS records for the domain so that you can create a CNAME DNS record for the reverse proxy server load balancer.


- Ensure you have an SSL certificate that matches the domain name you will assign to Spectro Proxy. You will need this to enable HTTPS encryption for the Spectro Proxy. Contact your network administrator or security team to obtain the SSL certificate. You need the following files:
  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.

- The Spectro Proxy server must have internet access and network connectivity to the private network where the Kubernetes clusters are deployed.


# Enablement

1. Open up a terminal session and navigate to the directory where you want to download the Spectro Proxy Helm chart.


2. Download the Spectro Proxy Helm chart. Use the following command to download the Helm chart.

  <br />

  ```bash
  wget https://s3.amazonaws.com/manifests.spectrocloud.com/frps/v1.1.0/frps.tgz
  ```

3. Extract the Helm chart. Use the following command to extract the Helm chart.

  <br />

  ```bash
  tar -xvf frps.tgz && cp frps/values.yaml .
  ```


4. Use your preferred text editor and update the **values.yaml** file. Update the following values in the **values.yaml** file.

  <br />

  | **Parameter** | **Description** |
  | --- | --- |
  | `frps.frpHostURL`| The domain name you will use for the Spectro Proxy server. For example, `frps.example.com`. |
  | `server.crt`| The x509 SSL certificate file in base64 format. |
  | `server.key`| The x509 SSL certificate key file in base64 format. |
  | `ca.crt`| The x509 SSL certificate authority file in base64 format. |

  <br />

5. After you have updated the values, use the following command to install the Spectro Proxy server.

  <br />

  ```bash
  helm install --values values.yaml proxy-system frps.tgz
  ```

6. After the installation, use the following command to get the Spectro Proxy server's load balancer IP address.

  <br />

  ```bash
  kubectl get svc --namespace proxy-system spectro-proxy-svc
  ```
7. Update the DNS records for the domain name you used for the Spectro Proxy server. Create a CNAME record that points to the Spectro Proxy server's load balancer IP address.


You now have a Spectro Proxy server that you can use for Palette VerteX clusters deployed in a private network. 


# Validate

Use the following command to validate that the Spectro Proxy server is active.

1. Open up a terminal session.


2. Verify the Spectro Proxy pod is up and available.

  <br />

  ```bash
  kubectl get pods --namespace proxy-system
  ```

  Your output should look similar to the following.

  <br />

  ```shell hideClipboard
  NAME                            READY   STATUS    RESTARTS   AGE
  spectro-proxy-9568fcdc9-pngr8   1/1     Running   0          3h25m
  ```