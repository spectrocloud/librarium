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
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";
import Tabs from 'shared/components/ui/Tabs';

# Overview

Use the Palette VerteX Helm Chart to install Palette VerteX in a multi-node Kubernetes cluster in your production environment. Palette VerteX is a FIPS-compliant product that must be installed in a FIPS-compliant environment. This means that Operating System (OS) the Kubernetes cluster you are installing Palette VerteX into must be FIPS-compliant. 

Review our [architecture diagrams](/architecture/networking-ports) to ensure your Kubernetes cluster has the necessary network connectivity for Palette to operate successfully. 

# Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.



- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using `kubectl` commands and have sufficient permissions to install Palette VerteX. We recommend using a role with cluster-admin permissions to install Palette VerteX.


- [Helm](https://helm.sh/docs/intro/install/) is installed and available.


- The Kubernetes cluster must have the following minimum resources:

    - 4 CPUs per node.

    - 12 GB Memory per node.

    - 100 GB Disk Space per node.
    
    - A Container Storage Interface (CSI) for persistent data.

    - A minimum of three worker nodes or three untainted control plane nodes.


- The following network ports must be accessible for Palette VerteX to operate successfully.

  - TCP/443: Inbound and outbound to and from the Palette VerteX management cluster. 

  - TCP/6443: Outbound traffic from the Palette VerteX management cluster to the deployed clusters' Kubernetes API server.


- Ensure [Cert Manager](https://cert-manager.io/docs) v1.11.0 or greater is installed in the Kubernetes cluster. Use the official Cert Manager [installation guide](https://cert-manager.io/docs/installation/) for additional guidance.


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

The following instructions are written agnostic to the Kubernetes distribution you are using. Depending on the underlying infrastructure provider and the Kubernetes distribution you are using, you may need to modify the instructions to match your environment. Reach out to our support team if you need assistance.

</InfoBox>


1. Open a terminal session and navigate to the directory where you downloaded the Palette VerteX Helm Chart.



2.  Extract the **values.yaml** from the Helm Chart with the following command. Replace the path in the command to match your local path of the downloaded Palette VerteX Helm Chart. Use the command below as a reference.

    <br />

    ```shell hideClipboard
    tar xzvf /path/to/spectro-mgmt-plane-0.0.0.tgz spectro-mgmt-plane/values.yaml
    ``` 


3. Open the **values.yaml** with a text editor of your choice. The **values.yaml** contains the default values for the Palette VerteX installation parameters but there are a few parameters you must populate before installing Palette VerteX. 

    <br />

    | **Parameter** | **Description** | **Type** |
    | --- | --- | --- |
    | `mongo.password` | A base64 encoded password for the MongoDB database. | string |
    | `env.rootDomain` | The the domain name you will use for the Palette VerteX installation. | string |
    | `ociRegistry` | The OCI registry credentials for Palette VerteX images. Use the parameter `ociEcrRegistry` if deploying Palette VerteX in an AWS environment. These credentials are provided by our support team.| object |
    | `scar` | The SCAR credentials for Palette VerteX images. These credentials are provided by our support team. | object |



4. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the Palette VerteX Helm Chart. 

    <br />

    ```shell
    helm upgrade --values values.yaml hubble spectro-mgmt-plane-0.0.0.tgz --install
    ```


5. Monitor the deployment using the command below. Palette VerteX is ready when the deployments in the namespaces `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` reach the *Ready* state. The installation process can take up to 20 - 30 minutes to complete. Use the following command to track the installation process.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```


6. Create a DNS CNAME record that is mapped to the Palette VerteX `ingress-nginx-controller` load balancer. You can use the following command to retrieve the load balancer IP address. You may require the assistance of your network administrator to create the DNS record.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace ingress-nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```


7. Use the custom domain name or the IP address of the load balancer to visit the Palette VerteX system console. To access the system console, open a web browser and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. 

  <br />

  <InfoBox>

  The first time you visit the Palette VerteX system console, you may see a warning message about the SSL certificate. This is expected, as you have not yet uploaded the SSL certificate to Palette VerteX. You can safely ignore this warning message.

  </InfoBox>

  <br />

  ![A view of the Palette System Console login screen.](/vertex_install-on-kubernetes_install_system-console.png)


8. Log in to the system console using the provided credentials you received from our support team. After login in, you will be prompted to create a new password. Enter a new password and save yor changes. You will be redirected to the Palette VerteX system console.


You now have a self-hosted instance of Palette VerteX installed in a Kubernetes cluster. Make sure you retain the **values.yaml** file as you may need it for future upgrades.


# Validate

Use the following steps to validate the Palette VerteX installation.


1. Open up a web browser and navigate to the Palette VerteX system console. To access the system console, open a web browser and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. 



2. Log in using the credentials you received from our support team. After login in, you will be prompted to create a new password. Enter a new password and save yor changes. You will be redirected to the Palette VerteX system console.


3. Open a terminal session and issue the following command to verify the Palette VerteX installation. The command should return a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` namespaces.

    <br />

    ```shell
    kubectl get deployments --all-namespaces
    ```

    Your output should look similar to the following.

    ```shell hideClipboard
    NAMESPACE       NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
    cert-manager    cert-manager                  1/1     1            1           2d2h
    cert-manager    cert-manager-cainjector       1/1     1            1           2d2h
    cert-manager    cert-manager-webhook          1/1     1            1           2d2h
    cp-system       spectro-cp-ui                 1/1     1            1           44h
    hubble-system   auth                          2/2     2            2           44h
    hubble-system   cloud                         2/2     2            2           44h
    hubble-system   configserver                  1/1     1            1           44h
    hubble-system   event                         2/2     2            2           44h
    hubble-system   foreq                         1/1     1            1           44h
    hubble-system   hashboard                     2/2     2            2           44h
    hubble-system   hutil                         2/2     2            2           44h
    hubble-system   mgmt                          1/1     1            1           44h
    hubble-system   mongodb-enterprise-operator   1/1     1            1           44h
    hubble-system   msgbroker                     1/1     1            1           44h
    hubble-system   oci-proxy                     1/1     1            1           44h
    hubble-system   spectrocluster                3/3     3            3           44h
    hubble-system   system                        2/2     2            2           44h
    hubble-system   timeseries                    3/3     3            3           44h
    hubble-system   user                          2/2     2            2           44h
    jet-system      jet                           1/1     1            1           44h
    kube-system     coredns                       2/2     2            2           2d2h
    kube-system     ebs-csi-controller            2/2     2            2           2d
    ui-system       spectro-ui                    1/1     1            1           44h
    ```


# Next Steps