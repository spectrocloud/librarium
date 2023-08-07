---
title: "Instructions"
metaTitle: "Install VerteX"
metaDescription: "Learn how to install Palette VerteX on VMware vSphere."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';

# Overview

Use the Palette VerteX Helm Chart to install Palette VerteX in a multi-node Kubernetes cluster in your production environment. Palette VerteX is a FIPS-compliant product that must be installed in a FIPS-compliant environment. This means that Operating System (OS) the Kubernetes cluster you are installing Palette VerteX into must be FIPS-compliant. 

Review our [architecture diagrams](/architecture/networking-ports) to ensure your Kubernetes cluster has the necessary network connectivity for Palette to operate successfully. 

# Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.


- [Helm](https://helm.sh/docs/intro/install/) is installed and available.


- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using `kubectl` commands and have sufficient permissions to install Palette VerteX. We recommend using a role with cluster-admin permissions to install Palette VerteX.


- The Kubernetes cluster must be set up on a supported version of Kubernetes, which includes version v1.25 to v1.27.



- The Kubernetes cluster must have a Container Storage Interface (CSI) installed and configured. Palette VerteX requires a CSI to store persistent data. You may install any CSI that is compatible with your Kubernetes cluster.



- The Kubernetes cluster must have the following minimum resources:

    - 8 CPUs per node.

    - 16 GB Memory per node.

    - 120 GB Disk Space per node.
    
    - A Container Storage Interface (CSI) for persistent data.

    - A minimum of three worker nodes or three untainted control plane nodes.


- The following network ports must be accessible for Palette VerteX to operate successfully.

  - TCP/443: Inbound and outbound to and from the Palette VerteX management cluster. 

  - TCP/6443: Outbound traffic from the Palette VerteX management cluster to the deployed clusters' Kubernetes API server.


- Ensure [Cert Manager](https://cert-manager.io/docs) v1.12.0 or greater is installed in the Kubernetes cluster. Use the official Cert Manager [installation guide](https://cert-manager.io/docs/installation/) for additional guidance.


- Ensure you have an SSL certificate that matches the domain name you will assign to Palette VerteX. You will need this to enable HTTPS encryption for Palette VerteX. Reach out to your network administrator or security team to obtain the SSL certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.
  

- Ensure the OS and Kubernetes cluster you are installing Palette VerteX onto is FIPS-compliant. Otherwise, Palette VerteX and its operations will not be FIPS-compliant.


- A custom domain and the ability to update Domain Name System (DNS) records. You will need this to enable HTTPS encryption for Palette VerteX.


- Access to the Palette Helm Chart. Refer to the [Access Palette VerteX](/vertex#accesspalettevertex) for instructions on how to request access to the Helm Chart



<br />

<WarningBox>

Do not use a Palette-managed Kubernetes cluster when installing Palette VerteX. Palette-managed clusters contain the Palette agent and Palette-created Kubernetes resources that will interfere with the installation of Palette VerteX.

</WarningBox>


# Install Palette VerteX

Use the following steps to install Palette VerteX on Kubernetes.

<br />

<InfoBox>

The following instructions are written agnostic to the Kubernetes distribution you are using. Depending on the underlying infrastructure provider and your Kubernetes distribution, you may need to modify the instructions to match your environment. Reach out to our support team if you need assistance.

</InfoBox>


1. Open a terminal session and navigate to the directory where you downloaded the Palette VerteX Helm Chart.



2.  Extract the **values.yaml** from the Helm Chart with the following command. Replace the path in the command to match your local path to the downloaded Palette VerteX Helm Chart. Use the command below as a reference.

    <br />

    ```shell hideClipboard
    tar xzvf /path/to/spectro-mgmt-plane-0.0.0.tgz spectro-mgmt-plane/values.yaml
    ``` 


3. Open the **values.yaml** with a text editor of your choice. The **values.yaml** contains the default values for the Palette VerteX installation parameters, but you must populate a few parameters before installing Palette VerteX. Refer to the [Helm Configuration Reference](/vertex/install-palette-vertex/install-on-kubernetes/vertex-helm-ref) page for a complete list of parameters and their descriptions.

    <br />

    | **Parameter** | **Description** | **Type** |
    | --- | --- | --- |
    | `env.rootDomain` | The URL name or IP address you will use for the Palette VerteX installation. | string |
    | `ociRegistry` or `ociEcrRegistry` | The OCI registry credentials for Palette VerteX FIPS packs.| object |
    | `scar` | The Spectro Cloud Artifact Repository (SCAR) credentials for Palette VerteX FIPS images. These credentials are provided by our support team. | object |

    <br />

    <InfoBox>
    
    You can learn more about the parameters in the **values.yaml** file in the [Helm Configuration Reference](/vertex/install-palette-vertex/install-on-kubernetes/vertex-helm-ref) page.

    </InfoBox>



4. Install the Helm Chart using the following command. Replace the path in the command to match your local path to the Palette VerteX Helm Chart. 

    <br />

    ```shell
    helm upgrade --values values.yaml hubble spectro-mgmt-plane-0.0.0.tgz --install
    ```


5. Track the installation process using the command below. Palette VerteX is ready when the deployments in the namespaces `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` reach the *Ready* state. The installation process can take 20 - 30 minutes to complete.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```


6. Create a DNS CNAME record that is mapped to the Palette VerteX `ingress-nginx-controller` load balancer. You can use the following command to retrieve the load balancer IP address. You may require the assistance of your network administrator to create the DNS record.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace ingress-nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    <br />

    <InfoBox>

    As you create tenants in Palette VerteX, the tenant name is prefixed to the domain name you assigned to Palette VerteX. For example, if you create a tenant named `tenant1` and the domain name you assigned to Palette VerteX is `vertex.example.com`, the tenant URL will be `tenant1.vertex.example.com`. You can create an additional wildcard DNS record to map all tenant URLs to the Palette VerteX load balancer.

    </InfoBox>


7. Use the custom domain name or the IP address of the load balancer to visit the Palette VerteX system console. To access the system console, open a web browser and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. 

  <br />

  <InfoBox>

  The first time you visit the Palette VerteX system console, a warning message about an untrusted SSL certificate may appear. This is expected, as you have not yet uploaded your SSL certificate to Palette VerteX. You can ignore this warning message and proceed.

  </InfoBox>

  <br />

  ![A view of the Palette System Console login screen.](/vertex_install-on-kubernetes_install_system-console.png)


8. Log in to the system console using the credentials you received from our support team. After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to the Palette VerteX system console.


9. Configure HTTPS encryption for Palette VerteX. To configure HTTPS encryption, you must upload the SSL certificate, SSL certificate key, and SSL certificate authority files to Palette VerteX. You can upload the files using the Palette VerteX system console. Refer to the [Configure HTTPS Encryption](/vertex/system-management/ssl-certificate-management) page for instructions on how to upload the SSL certificate files to Palette VerteX.


You now have a self-hosted instance of Palette VerteX installed in a Kubernetes cluster. Make sure you retain the **values.yaml** file as you may need it for future upgrades.


# Validate

Use the following steps to validate the Palette VerteX installation.

<br />


1. Open up a web browser and navigate to the Palette VerteX system console. To access the system console, open a web browser and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. 



2. Log in using the credentials you received from our support team. After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to the Palette VerteX system console.


3. Open a terminal session and issue the following command to verify the Palette VerteX installation. The command should return a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` namespaces.

    <br />

    ```shell
    kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
    | grep -E '^(cp-system|hubble-system|ingress-nginx|jet-system|ui-system)\s'
    ```

    Your output should look similar to the following.

    ```shell hideClipboard
    cp-system       spectro-cp-ui-67847957-8rqpb                   Running
    hubble-system   auth-5797cf677d-rc5v6                          Running
    hubble-system   auth-5797cf677d-xdzzc                          Running
    hubble-system   cloud-5bbf77786b-5pfq2                         Running
    hubble-system   cloud-5bbf77786b-l9bv7                         Running
    hubble-system   configserver-84594b5586-6tx6c                  Running
    hubble-system   event-64676974c7-49hgz                         Running
    hubble-system   event-64676974c7-7t2rm                         Running
    hubble-system   foreq-644f9645b6-4bdnk                         Running
    hubble-system   hashboard-696656644-l5qfd                      Running
    hubble-system   hashboard-696656644-ztr5j                      Running
    hubble-system   hutil-664bbc47d8-28glx                         Running
    hubble-system   hutil-664bbc47d8-4b8fs                         Running
    hubble-system   mgmt-7695c774c6-86qt7                          Running
    hubble-system   mongo-0                                        Running
    hubble-system   mongo-1                                        Running
    hubble-system   mongo-2                                        Running
    hubble-system   mongodb-enterprise-operator-5749cd6d5c-bqvp2   Running
    hubble-system   mongoops-0                                     Running
    hubble-system   mongoops-db-0                                  Running
    hubble-system   mongoops-db-1                                  Running
    hubble-system   mongoops-db-2                                  Running
    hubble-system   msgbroker-69ff688569-llkn9                     Running
    hubble-system   oci-proxy-745797f84d-hb55v                     Running
    hubble-system   packsync-28182360-tv4zf                        Succeeded
    hubble-system   spectrocluster-7648978fdb-6jcfb                Running
    hubble-system   spectrocluster-7648978fdb-klk2g                Running
    hubble-system   spectrocluster-7648978fdb-wjtl5                Running
    hubble-system   system-5c7db5d788-nwwgr                        Running
    hubble-system   system-5c7db5d788-w86w2                        Running
    hubble-system   timeseries-6fc87b7d88-fbmbs                    Running
    hubble-system   timeseries-6fc87b7d88-hssd4                    Running
    hubble-system   timeseries-6fc87b7d88-wstng                    Running
    hubble-system   user-cdfb8bcb6-j2vnl                           Running
    hubble-system   user-cdfb8bcb6-knzz9                           Running
    ingress-nginx   ingress-nginx-admission-create-qjbvp           Succeeded
    ingress-nginx   ingress-nginx-admission-patch-rh6vp            Succeeded
    ingress-nginx   ingress-nginx-controller-4sclg                 Running
    ingress-nginx   ingress-nginx-controller-dllvg                 Running
    ingress-nginx   ingress-nginx-controller-tjfzt                 Running
    jet-system      jet-549656486c-2dnft                           Running
    ui-system       spectro-ui-66648bfbb8-r25x2                    Running
    ```


# Next Steps

You have successfully installed Palette VerteX in a Kubernetes cluster. Your next steps are to configure Palette VerteX for your organization. Start by creating the first tenant to host your users. Use the [Create a Tenant](/vertex/system-management/tenant-management#createatenant) page for instructions on how to create a tenant.
