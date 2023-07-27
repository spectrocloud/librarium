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

  -  The SSL certificate file in base64 format.

  - The SSL certificate key file in base64 format.

  - The SSL certificate authority file in base64 format. This file is optional.
  

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

  The first time you visit the Palette VerteX system console, you may see a warning message about the SSL certificate. This is expected, as you have not yet uploaded the SSL certificate to Palette VerteX. You can safely ignore this warning message. Depending on your browser, accept the message and proceed to the page.

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



<!-- </Tabs.TabPane> 

<Tabs.TabPane tab="AWS EKS" key="aws-eks">

1. Ensure the AWS CLI is configured with your credentials. You can use the following command to configure your credentials. Refer to the [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) guide for additional help.

    <br />

    ```shell
    aws configure
    ```

2. Next, create an EKS cluster.

    <br />

    ```shell
    eksctl create cluster \
     --name palette-selfhost \
     --node-type m5.xlarge \
     --nodes 3 \
     --nodes-min 3 \
     --nodes-max 4 \
     --region eu-west-2 \
     --kubeconfig ~/Downloads/palette-selfhost.kubeconfig
    ```

    Change `--region` and `--nodes` as required. You can also change the instance size. 
    
    Note that the [minimum instance requirement](https://aws.amazon.com/ec2/instance-types/) is three nodes with a least  4 CPUs and 12 GB of Memory per node. 


3. When the cluster is available, go ahead and configure the OpenID Connect (OIDC) for the cluster to use Palette as the Identity Provider (IDP).

    <br />

    ```shell
    eksctl utils associate-iam-oidc-provider --cluster=palette-selfhost --approve
    ```

4. Next, add the EBS Container Storage Interface (CSI) driver IAM role. Replace the `<AWS_ACCOUNT_ID>` with your AWS account ID.

    <br />

    ```shell
    eksctl create addon --name aws-ebs-csi-driver \ 
     --cluster palette-selfhost \ 
     --service-account-role-arn arn:aws:iam::<AWS_ACCOUNT_ID>:role/AmazonEKS_EBS_CSI_DriverRole \
     --force
    ```

5. Log in to the [AWS console](https://console.aws.amazon.com) and navigate to the EKS Dashboard.



6. Select the **palette-selfhost** cluster to access its details page. 



7. From the cluster details page, click on **Compute** > **Node Group**. Next, click on **Node IAM role ARN link**. 

    ![A view of the cluster details page with the Node IAM role ARN highlighted](/enterprise-version_deploying-palette-with-helm_aws-iam-role.png)


8. From the **Permissions** tab, click on the **Add Permissions** button, and select **Attach Policies**.


9. Search for the **AmazonEBSCSIDriverPolicy** policy and add it to the role. 

    <br />

    <InfoBox>

    You can find additional guidance about Amazon EBS CSI drivers and requirements by reviewing the [EBS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) and the [Manage EBS with EKS](https://github.com/awsdocs/amazon-eks-user-guide/blob/master/doc_source/managing-ebs-csi.md) guide.

    </InfoBox>

10. Extract the Helm Chart files from the compressed asset we provided to you. Replace the file path and version place holder as needed.

    <br />

    ```shell
    tar xzvf path/to-file/spectro-mgmt-helm-charts-X.X.tar.gz 
    ```

11. Navigate to the **spectro-mgmt-helm-charts-X.X** folder.

    <br />

    ```shell
    cd spectro-mgmt-helm-charts-X.X
    ```

12. Review the **values.yaml** . You must populate the `env.rootDomain` parameter to the domain you will use for the installation. In addition, add the same `rootDomain` with port `:4222` to the `natsUrl` in the `nats` section of the YAML. Example: `env.rootDomain: my-domain.com:4222`.

    All other parameter values are optional, and you can reset or change them with a Helm upgrade operation.

    <br />
    
 13. If you wish to use [AWS ACM for SSL Certs](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html), instead of the default self-signed certificate that the Nginx *ingress controller* generates, you can add it to the `annotations` under `ingress`.

    <br />

    ```yaml
    ingress:
      ingress:
        # Whether to front NGINX Ingress Controller with a cloud
        # load balancer (internal == false) or use host network
        internal: false

        # Default SSL certificate and key for NGINX Ingress Controller (Optional)
        # A wildcard cert for config.env.rootDomain, e.g., *.myfirstpalette.spectrocloud.com
        # If left blank, the NGINX ingress controller will generate a self-signed cert (when terminating TLS upstream of ingress-nginx-controller)
        # certificate: ""
        # key: ""

        annotations:
        # AWS example
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "<ARN:ACM>"
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
        ingressStaticIP: ""
        # Used to terminate HTTPS traffic at the load balancer versus passing through the load balancer. This parameter is available in Palette 3.3 or greater.
        terminateHTTPSAtLoadBalancer: true
    ```
 
 14. Download the kubeconfig file for the EKS cluster. Ensure you can interact with the target cluster. You can validate by issuing a `kubectl` command. For additional guidance, refer to the [kubeconfig file for an Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) guide.



15. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the Palette Helm Chart.

  <br />

  ```shell
  helm install palette /path/to/chart.tgz --file /path/to/values.yaml
  ```

16. Monitor the deployment using the command below. Palette is ready when the deployments in namespaces `cp-system`, `hubble-system`, `jet-system` , and `ui-system` reach the *Ready* state.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

17. Create a DNS record mapped to the load balancer created by the Palette service `ingress-nginx-controller` . You can use the following command to retrieve the load balancer IP address.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the **values.yaml** file as you will need it for future upgrades.

<br />

</Tabs.TabPane> 


</Tabs>

# Validation

You can validate that the installation of Palette is successful by visiting the custom domain you assigned to the 
`env.rootDomain` parameter in the **values.yaml**.

<br />


<WarningBox>

If you notice that the pods in the `hubble-system` namespace are not initializing as expected, it might be due to a delay in adding the DNS records for the rootDomain. The workaround is to terminate all pods except the pods related to `mongo-db` in the `hubble-system` namespace to trigger a redeployment of the pods.

  <br />

  ```shell
  kubectl delete pods --namespace hubble-system --selector=role!=mongo
  ```

</WarningBox>


# Upgrade Palette



To upgrade Palette with a new Helm release, use the following steps. <br /> <br />

1. Download the new version of the Helm Chart.



2. Extract the new **values.yaml** file from the Helm Chart with the following command:

    <br />

    ```shell
    tar xzvf /path/to/chart.tgz spectro-mgmt-plane/values.yaml
    ```


3. Compare the new **values.yaml** against the original **values.yaml** you used for the initial Palette installation. Address any new parameters added to the values file.




4. Issue the following command to upgrade Palette. Use the same **values.yaml** file you used for the Palette installation. 

    <br />

    ```shell
    helm upgrade palette /path/to/chart.tgz --file /path/to/orginal_values.yaml
    ```
 

## Post-Install Configuration Values

The values you specified in the **values.yaml** file all fall under the parameter section `values.config` and are stored in the `configserver` ConfigMap. 

After the installation, if you need to change any configuration values under `values.config` in the **values.yaml** file, you must use the Palette API.
When you use the `helm upgrade` command, internal system configurations stored in the Kubernetes ConfigMap `configserver` will display as updated, but Palette will not apply the new values. Palette only accepts changes to these configuration values if they are submitted via API.

If you find yourself in this scenario, contact our support team by emailing us at support@spectrocloud.com for additional guidance.



# Next Steps

Start exploring the Palette system dashboard so that you become familiar with the available actions you can take as an administrator. Check out the [System Console Dashboard](/enterprise-version/system-console-dashboard) resource to learn more.


<br /> -->