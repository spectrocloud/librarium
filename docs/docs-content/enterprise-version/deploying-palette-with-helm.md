---
sidebar_label: "Install using Helm Chart"
title: "Install using Helm Chart"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
---





# Helm Chart Mode

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment.

This installation method is common in secure environments with restricted network access that prohibits using Palette SaaS. Review our [architecture diagrams](/architecture/networking-ports) to ensure your Kubernetes cluster has the necessary network connectivity for Palette to operate successfully. 


Depending on what version of Palette you are using, the available parameters will be different. Select the tab below that corresponds to the version of Palette you are using.

<br />

<Tabs>
<TabItem label="4.0.0 or greater" value="gRPC">

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.


- [Helm](https://helm.sh/docs/intro/install/) is installed and available.


- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using `kubectl` commands and have sufficient permissions to install Palette. We recommend using a role with cluster-admin permissions to install Palette.


- The Kubernetes cluster must be set up on a supported version of Kubernetes, which includes versions v1.25 to v1.27.



- Ensure the Kubernetes cluster does not have Cert Manager installed. Palette requires a unique Cert Manager configuration to be installed as part of the installation process. If Cert Manager is already installed, you must uninstall it before installing Palette.


- The Kubernetes cluster must have a Container Storage Interface (CSI) installed and configured. Palette requires a CSI to store persistent data. You may install any CSI that is compatible with your Kubernetes cluster.



- We recommended the following resources for Palette VerteX. Refer to the [Palette VerteX size guidelines](/enterprise-version/on-prem-system-requirements#hardwarerequirements) for additional sizing information.

    - 8 CPUs per node.

    - 16 GB Memory per node.

    - 100 GB Disk Space per node.
    
    - A Container Storage Interface (CSI) for persistent data.

    - A minimum of three worker nodes or three untainted control plane nodes.


- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound and outbound to and from the Palette management cluster. 

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed clusters' Kubernetes API server.


- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.
  

- Ensure the OS and Kubernetes cluster you are installing Palette onto is FIPS-compliant. Otherwise, Palette and its operations will not be FIPS-compliant.


- A custom domain and the ability to update Domain Name System (DNS) records. You will need this to enable HTTPS encryption for Palette.


- Access to the Palette Helm Charts. Refer to the [Access Palette](/enterprise-version#downloadpaletteinstaller) for instructions on how to request access to the Helm Chart



<br />

:::caution

Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette agent and Palette-created Kubernetes resources that will interfere with the installation of Palette.

:::


## Install Palette

Use the following steps to install Palette on Kubernetes.

<br />

:::info

The following instructions are written agnostic to the Kubernetes distribution you are using. Depending on the underlying infrastructure provider and your Kubernetes distribution, you may need to modify the instructions to match your environment. Reach out to our support team if you need assistance.

:::


1. Open a terminal session and navigate to the directory where you downloaded the Palette Helm Charts provided by our support. We recommend you place all the downloaded files into the same directory. You should have the following Helm Charts:
    
    <br />

    - Spectro Management Plane Helm Chart.

    <br />

    - Cert Manager Helm Chart.


2. Extract each Helm Chart into its directory. Use the commands below as a reference. Do this for all the provided Helm Charts.

    <br />

    ```shell
    tar xzvf spectro-mgmt-plane-*.tgz
    ``` 

    <br />

    ```yaml
    tar xzvf cert-manager-*.tgz
    ```


3. Install Cert Manager using the following command. Replace the actual file name of the Cert Manager Helm Chart with the one you downloaded, as the version number may be different.

    <br />

    ```shell
     helm upgrade --values cert-manager/values.yaml cert-manager cert-manager-1.11.0.tgz --install
    ```

    <br />

    :::info

    The Cert Manager Helm Chart provided by our support team is configured for Palette. Do not modify the **values.yaml** file unless instructed to do so by our support team. 

    :::


4. Open the **values.yaml** in the **spectro-mgmt-plane** folder with a text editor of your choice. The **values.yaml** contains the default values for the Palette installation parameters, however, you must populate the following parameters before installing Palette. 

    <br />

    | **Parameter** | **Description** | **Type** |
    | --- | --- | --- |
    | `env.rootDomain` | The URL name or IP address you will use for the Palette installation. | string |
    | `ociPackRegistry` or `ociPackEcrRegistry` | The OCI registry credentials for Palette FIPS packs.| object |
    | `scar` | The Spectro Cloud Artifact Repository (SCAR) credentials for Palette FIPS images. These credentials are provided by our support team. | object |

  
    Save the **values.yaml** file after you have populated the required parameters mentioned in the table.

     <br />

    :::info
    
    You can learn more about the parameters in the **values.yaml** file in the [Helm Configuration Reference](/enterprise-version/deploying-palette-with-helm) page.

    :::



5. Install the Palette Helm Chart using the following command.

    <br />

    ```shell
    helm upgrade --values spectro-mgmt-plane/values.yaml hubble spectro-mgmt-plane-0.0.0.tgz --install
    ```


6. Track the installation process using the command below. Palette is ready when the deployments in the namespaces `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` reach the *Ready* state. The installation takes between two to three minutes to complete.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```


7. Create a DNS CNAME record that is mapped to the Palette `ingress-nginx-controller` load balancer. You can use the following command to retrieve the load balancer IP address. You may require the assistance of your network administrator to create the DNS record.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace ingress-nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    <br />

    :::info

    As you create tenants in Palette, the tenant name is prefixed to the domain name you assigned to Palette. For example, if you create a tenant named `tenant1` and the domain name you assigned to Palette is `palette.example.com`, the tenant URL will be `tenant1.palette.example.com`. You can create an additional wildcard DNS record to map all tenant URLs to the Palette load balancer.

    :::


8. Use the custom domain name or the IP address of the load balancer to visit the Palette system console. To access the system console, open a web browser and paste the custom domain URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. Alternatively, you can use the load balancer IP address with the appended value `/system` to access the system console.

  <br />

  :::info

  The first time you visit the Palette system console, a warning message about an untrusted SSL certificate may appear. This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning message and proceed.

  :::

  <br />

  ![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.png)


9. Log in to the system console using the following default credentials. 

    <br />

    | **Parameter** | **Value** |
    | --- | --- |
    | Username | `admin` |
    | Password | `admin` |

    <br />

  After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to the Palette system console.

<br />

10. After login, a summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority files to Palette. You can upload the files using the Palette system console. Refer to the [Configure HTTPS Encryption](/vertex/system-management/ssl-certificate-management) page for instructions on how to upload the SSL certificate files to Palette.


<br />

:::caution

If you plan to deploy host clusters into different networks, you may require a reverse proxy. Check out the [Configure Reverse Proxy](/enterprise-version/reverse-proxy) guide for instructions on how to configure a reverse proxy for Palette VerteX.

:::


You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the **values.yaml** file as you may need it for future upgrades.


## Validate

Use the following steps to validate the Palette installation.

<br />


1. Open up a web browser and navigate to the Palette system console. To access the system console, open a web browser and paste the following URL in the address bar and append the value `/system`. Replace the domain name in the URL with your custom domain name or the IP address of the load balancer. 



2. Log in using the credentials you received from our support team. After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to the Palette system console.


3. Open a terminal session and issue the following command to verify the Palette installation. The command should return a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` namespaces.

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

You have successfully installed Palette in a Kubernetes cluster. Your next steps are to configure Palette for your organization. Start by creating the first tenant to host your users. Use the [Create a Tenant](/vertex/system-management/tenant-management#createatenant) page for instructions on how to create a tenant.




</TabItem>
<TabItem label="3.4.0 or earlier" value="nats">

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed.


- Configure a Container Storage Interface (CSI) for persistent data.


- Have at least three worker nodes or three untainted control plane nodes.


- [Cert Manager](https://cert-manager.io/docs) v1.11.0 or greater installed in the Kubernetes cluster. Use the official Cert Manager [installation guide](https://cert-manager.io/docs/installation/) for additional guidance.



- Allocate a minimum of 4 CPUs and 12 GB of Memory per node.


- A custom domain and the ability to update Domain Name System (DNS) records.



- Access to the Palette Helm Chart. Contact support@spectrocloud.com to gain access to the Helm Chart.


- For AWS EKS, ensure you have the [AWS CLI](https://aws.amazon.com/cli/) and the [kubectl CLI](https://github.com/weaveworks/eksctl#installation) installed. 

<br />

:::caution

Palette cannot manage the cluster that it is installed onto due to component conflicts. Consider using a managed Kubernetes service to minimize management overhead. The Palette Helm Chart is not tied to any particular managed Kubernetes service.


:::


## Install Palette

Choose the installation steps for your target environment. The steps in the generic tab apply to all Kubernetes clusters. Steps in other tabs have instructions explicitly tailored to the target environment.

<br />

<Tabs>

<TabItem label="Generic Kubernetes" value="generic-k8s">

1. Download the kubeconfig file for the Kubernetes cluster where you will deploy Palette. Ensure you can interact with the target cluster. You can validate by issuing a `kubectl` command.

    <br />

    ```shell
    kubectl get pods -A
    ```


2.  Extract the **values.yaml** from the Helm Chart with the following command: 

    <br />

    ```shell
    tar xzvf /path/to/chart.tgz spectro-mgmt-plane/values.yaml
    ``` 


3. Review the **values.yaml** . You must populate the `env.rootDomain` parameter to the domain you will use for the installation. All other parameter values are optional, and you can reset or change them with a Helm upgrade operation.

    <br />

    :::caution

      Do not use a wildcard in the root domain value for the `env.rootDomain` parameter. Use a complete domain name when assigning a root domain name value.

    :::


4. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the Palette Helm Chart.

    <br />

    ```shell
    helm install palette /path/to/chart.tgz -f /path/to/values.yaml
    ```


5. Monitor the deployment using the command below. Palette is ready when the deployments in namespaces `cp-system`, `hubble-system`, `jet-system` , and `ui-system` reach the *Ready* state.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

6. Create a DNS record that is mapped to the Palette `ingress-nginx-controller` load balancer. You can use the following command to retrieve the load balancer IP address.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the **values.yaml** file as you will need it for future upgrades.

  <br />

</TabItem> 

<TabItem label="AWS EKS" value="aws-eks">

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

    :::info

    You can find additional guidance about Amazon EBS CSI drivers and requirements by reviewing the [EBS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) and the [Manage EBS with EKS](https://github.com/awsdocs/amazon-eks-user-guide/blob/master/doc_source/managing-ebs-csi.md) guide.

    :::

10. Extract the Helm Chart files from the compressed asset we provided to you. Replace the file path and version placeholder as needed.

    <br />

    ```shell
    tar xzvf path/to-file/spectro-mgmt-helm-charts-X.X.tar.gz 
    ```

11. Navigate to the **spectro-mgmt-helm-charts-X.X** folder.

    <br />

    ```shell
    cd spectro-mgmt-helm-charts-X.X
    ```

12. Review the **values.yaml** . You must populate the `env.rootDomain` parameter to the domain you will use for the installation. In addition, add the same `rootDomain` with port `:4222` to the `natsUrl` in the `nats` section of the YAML. Example: `env.rootDomain: my-domain.com:4222`. All other parameter values are optional, and you can reset or change them with the Palette API.

    <br />

    :::caution

      Do not use a wildcard in the root domain value for the `env.rootDomain` parameter. Use a complete domain name when assigning a root domain name value.

    :::
    
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
  helm install palette /path/to/chart.tgz -f /path/to/values.yaml
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

</TabItem> 


</Tabs>

# Validate

You can validate that the installation of Palette is successful by visiting the custom domain you assigned to the 
`env.rootDomain` parameter in the **values.yaml**.

<br />


:::caution

If you notice that the pods in the `hubble-system` namespace are not initializing as expected, it might be due to a delay in adding the DNS records for the rootDomain. The workaround is to terminate all pods except the pods related to `mongo-db` in the `hubble-system` namespace to trigger a redeployment of the pods.

  <br />

  ```shell
  kubectl delete pods --namespace hubble-system --selector=role!=mongo
  ```

:::


## Upgrade Palette



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
 

### Post-Install Configuration Values

The values you specified in the **values.yaml** file all fall under the parameter section `values.config` and are stored in the `configserver-cm` ConfigMap. 

After the installation, if you need to change any configuration values under `values.config` in the **values.yaml** file, you must use the Palette API.
When you use the `helm upgrade` command, internal system configurations stored in the Kubernetes ConfigMap `configserver-cm` will display as updated, but Palette will not apply the new values. Palette only accepts changes to these configuration values if they are submitted via API.

If you find yourself in this scenario, contact our support team by emailing us at support@spectrocloud.com for additional guidance.



## Next Steps

Start exploring the Palette system dashboard so that you become familiar with the available actions you can take as an administrator. Check out the [System Console Dashboard](/enterprise-version/system-console-dashboard) resource to learn more.


<br />


</TabItem>
</Tabs>

<br />