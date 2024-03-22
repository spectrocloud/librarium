---
sidebar_label: "Instructions"
title: "Instructions"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "enterprise"]
---

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment.

This installation method is common in secure environments with restricted network access that prohibits using Palette
SaaS. Review our [architecture diagrams](../../../architecture/networking-ports.md) to ensure your Kubernetes cluster
has the necessary network connectivity for Palette to operate successfully.

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.

- [Helm](https://helm.sh/docs/intro/install/) is installed and available.

- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using
  `kubectl` commands and have sufficient permissions to install Palette. We recommend using a role with cluster-admin
  permissions to install Palette.

- The Kubernetes cluster must be set up on a supported version of Kubernetes, which includes versions v1.25 to v1.27.

- Ensure the Kubernetes cluster does not have Cert Manager installed. Palette requires a unique Cert Manager
  configuration to be installed as part of the installation process. If Cert Manager is already installed, you must
  uninstall it before installing Palette.

- The Kubernetes cluster must have a Container Storage Interface (CSI) installed and configured. Palette requires a CSI
  to store persistent data. You may install any CSI that is compatible with your Kubernetes cluster.

- We recommended the following resources for Palette. Refer to the
  [Palette size guidelines](../install-palette.md#size-guidelines) for additional sizing information.

  - 8 CPUs per node.

  - 16 GB Memory per node.

  - 100 GB Disk Space per node.
  - A Container Storage Interface (CSI) for persistent data.

  - A minimum of three worker nodes or three untainted control plane nodes.

- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound and outbound to and from the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed clusters' Kubernetes API server.

- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to
  enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL
  certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.

- Ensure the OS and Kubernetes cluster you are installing Palette onto is FIPS-compliant. Otherwise, Palette and its
  operations will not be FIPS-compliant.

- A custom domain and the ability to update Domain Name System (DNS) records. You will need this to enable HTTPS
  encryption for Palette.

- Access to the Palette Helm Charts. Refer to the [Access Palette](../../enterprise-version.md#access-palette) for
  instructions on how to request access to the Helm Chart

<br />

:::warning

Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette
agent and Palette-created Kubernetes resources that will interfere with the installation of Palette.

:::

## Install Palette

Use the following steps to install Palette on Kubernetes.

:::info

The following instructions are written agnostic to the Kubernetes distribution you are using. Depending on the
underlying infrastructure provider and your Kubernetes distribution, you may need to modify the instructions to match
your environment. Reach out to our support team if you need assistance.

:::

1. Open a terminal session and navigate to the directory where you downloaded the Palette Helm Charts provided by our
   support. We recommend you place all the downloaded files into the same directory. You should have the following Helm
   Charts:

   - Spectro Management Plane Helm Chart.

   - Cert Manager Helm Chart.

2. Extract each Helm Chart into its directory. Use the commands below as a reference. Do this for all the provided Helm
   Charts.

   <br />

   ```shell
   tar xzvf spectro-mgmt-plane-*.tgz
   ```

   <br />

   ```yaml
   tar xzvf cert-manager-*.tgz
   ```

3. Install Cert Manager using the following command. Replace the actual file name of the Cert Manager Helm Chart with
   the one you downloaded, as the version number may be different.

   <br />

   ```shell
    helm upgrade --values cert-manager/values.yaml cert-manager cert-manager-1.11.0.tgz --install
   ```

   <br />

   :::info

   The Cert Manager Helm Chart provided by our support team is configured for Palette. Do not modify the **values.yaml**
   file unless instructed to do so by our support team.

   :::

4. Open the **values.yaml** in the **spectro-mgmt-plane** folder with a text editor of your choice. The **values.yaml**
   contains the default values for the Palette installation parameters, however, you must populate the following
   parameters before installing Palette.

   <br />

   | **Parameter**                             | **Description**                                                                                                                       | **Type** |
   | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | `env.rootDomain`                          | The URL name or IP address you will use for the Palette installation.                                                                 | string   |
   | `ociPackRegistry` or `ociPackEcrRegistry` | The OCI registry credentials for Palette FIPS packs.                                                                                  | object   |
   | `scar`                                    | The Spectro Cloud Artifact Repository (SCAR) credentials for Palette FIPS images. These credentials are provided by our support team. | object   |

   Save the **values.yaml** file after you have populated the required parameters mentioned in the table.

   <br />

   :::info

   You can learn more about the parameters in the **values.yaml** file in the
   [Helm Configuration Reference](palette-helm-ref.md) page.

   :::

5. Install the Palette Helm Chart using the following command.

   <br />

   ```shell
   helm upgrade --values spectro-mgmt-plane/values.yaml hubble spectro-mgmt-plane-0.0.0.tgz --install
   ```

6. Track the installation process using the command below. Palette is ready when the deployments in the namespaces
   `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` reach the _Ready_ state. The
   installation takes between two to three minutes to complete.

   <br />

   ```shell
   kubectl get pods --all-namespaces --watch
   ```

7. Create a DNS CNAME record that is mapped to the Palette `ingress-nginx-controller` load balancer. You can use the
   following command to retrieve the load balancer IP address. You may require the assistance of your network
   administrator to create the DNS record.

   <br />

   ```shell
   kubectl get service ingress-nginx-controller --namespace ingress-nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
   ```

   <br />

   :::info

   As you create tenants in Palette, the tenant name is prefixed to the domain name you assigned to Palette. For
   example, if you create a tenant named `tenant1` and the domain name you assigned to Palette is `palette.example.com`,
   the tenant URL will be `tenant1.palette.example.com`. You can create an additional wildcard DNS record to map all
   tenant URLs to the Palette load balancer.

   :::

8. Use the custom domain name or the IP address of the load balancer to visit the Palette system console. To access the
   system console, open a web browser and paste the custom domain URL in the address bar and append the value `/system`.
   Replace the domain name in the URL with your custom domain name or the IP address of the load balancer.
   Alternatively, you can use the load balancer IP address with the appended value `/system` to access the system
   console.

<br />

:::info

The first time you visit the Palette system console, a warning message about an untrusted SSL certificate may appear.
This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning message and
proceed.

:::

<br />

![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.webp)

9. Log in to the system console using the following default credentials.

   <br />

   | **Parameter** | **Value** |
   | ------------- | --------- |
   | Username      | `admin`   |
   | Password      | `admin`   |

   <br />

After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be
redirected to the Palette system console.

<br />

10. After login, a summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a
    different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority
    files to Palette. You can upload the files using the Palette system console. Refer to the
    [Configure HTTPS Encryption](../../system-management/ssl-certificate-management.md) page for instructions on how to
    upload the SSL certificate files to Palette.

<br />

:::warning

If you plan to deploy host clusters into different networks, you may require a reverse proxy. Check out the
[Configure Reverse Proxy](../../system-management/reverse-proxy.md) guide for instructions on how to configure a reverse
proxy for Palette.

:::

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the
**values.yaml** file as you may need it for future upgrades.

## Validate

Use the following steps to validate the Palette installation.

<br />

1. Open up a web browser and navigate to the Palette system console. To access the system console, open a web browser
   and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL
   with your custom domain name or the IP address of the load balancer.

2. Log in using the credentials you received from our support team. After login, you will be prompted to create a new
   password. Enter a new password and save your changes. You will be redirected to the Palette system console.

3. Open a terminal session and issue the following command to verify the Palette installation. The command should return
   a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system`
   namespaces.

   <br />

   ```shell
   kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
   | grep -E '^(cp-system|hubble-system|ingress-nginx|jet-system|ui-system)\s'
   ```

   Your output should look similar to the following.

   ```shell hideClipboard
   cp-system       spectro-cp-ui-689984f88d-54wsw             Running
   hubble-system   auth-85b748cbf4-6drkn                      Running
   hubble-system   auth-85b748cbf4-dwhw2                      Running
   hubble-system   cloud-fb74b8558-lqjq5                      Running
   hubble-system   cloud-fb74b8558-zkfp5                      Running
   hubble-system   configserver-685fcc5b6d-t8f8h              Running
   hubble-system   event-68568f54c7-jzx5t                     Running
   hubble-system   event-68568f54c7-w9rnh                     Running
   hubble-system   foreq-6b689f54fb-vxjts                     Running
   hubble-system   hashboard-897bc9884-pxpvn                  Running
   hubble-system   hashboard-897bc9884-rmn69                  Running
   hubble-system   hutil-6d7c478c96-td8q4                     Running
   hubble-system   hutil-6d7c478c96-zjhk4                     Running
   hubble-system   mgmt-85dbf6bf9c-jbggc                      Running
   hubble-system   mongo-0                                    Running
   hubble-system   mongo-1                                    Running
   hubble-system   mongo-2                                    Running
   hubble-system   msgbroker-6c9b9fbf8b-mcsn5                 Running
   hubble-system   oci-proxy-7789cf9bd8-qcjkl                 Running
   hubble-system   packsync-28205220-bmzcg                    Succeeded
   hubble-system   spectrocluster-6c57f5775d-dcm2q            Running
   hubble-system   spectrocluster-6c57f5775d-gmdt2            Running
   hubble-system   spectrocluster-6c57f5775d-sxks5            Running
   hubble-system   system-686d77b947-8949z                    Running
   hubble-system   system-686d77b947-cgzx6                    Running
   hubble-system   timeseries-7865bc9c56-5q87l                Running
   hubble-system   timeseries-7865bc9c56-scncb                Running
   hubble-system   timeseries-7865bc9c56-sxmgb                Running
   hubble-system   user-5c9f6c6f4b-9dgqz                      Running
   hubble-system   user-5c9f6c6f4b-hxkj6                      Running
   ingress-nginx   ingress-nginx-controller-2txsv             Running
   ingress-nginx   ingress-nginx-controller-55pk2             Running
   ingress-nginx   ingress-nginx-controller-gmps9             Running
   jet-system      jet-6599b9856d-t9mr4                       Running
   ui-system       spectro-ui-76ffdf67fb-rkgx8                Running
   ```

## Next Steps

You have successfully installed Palette in a Kubernetes cluster. Your next steps are to configure Palette for your
organization. Start by creating the first tenant to host your users. Use the
[Create a Tenant](../../system-management/tenant-management.md) page for instructions on how to create a tenant.
