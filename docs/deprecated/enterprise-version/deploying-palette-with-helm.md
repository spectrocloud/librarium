---
sidebar_label: "Install using Helm Chart"
title: "Install using Helm Chart"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "enterprise"]
---

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment.

This installation method is common in secure environments with restricted network access that prohibits using Palette
SaaS. Review our [architecture diagrams](../architecture/networking-ports.md) to ensure your Kubernetes cluster has the
necessary network connectivity for Palette to operate successfully.

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed.

- Configure a Container Storage Interface (CSI) for persistent data.

- Have at least three worker nodes or three untainted control plane nodes.

- [Cert Manager](https://cert-manager.io/docs) v1.11.0 or greater installed in the Kubernetes cluster. Use the official
  Cert Manager [installation guide](https://cert-manager.io/docs/installation/) for additional guidance.

- Allocate a minimum of 4 CPUs and 12 GB of Memory per node.

- A custom domain and the ability to update Domain Name System (DNS) records.

- Access to the Palette Helm Chart. Contact support@spectrocloud.com to gain access to the Helm Chart.

- For AWS EKS, ensure you have the [AWS CLI](https://aws.amazon.com/cli/) and the
  [kubectl CLI](https://github.com/weaveworks/eksctl#installation) installed.

<br />

:::warning

Palette cannot manage the cluster that it is installed onto due to component conflicts. Consider using a managed
Kubernetes service to minimize management overhead. The Palette Helm Chart is not tied to any particular managed
Kubernetes service.

:::

# Install Palette

Choose the installation steps for your target environment. The steps in the generic tab apply to all Kubernetes
clusters. Steps in other tabs have instructions explicitly tailored to the target environment.

<br />

<Tabs>

<TabItem label="Generic Kubernetes" value="generic-k8s">

1. Download the kubeconfig file for the Kubernetes cluster where you will deploy Palette. Ensure you can interact with
   the target cluster. You can validate by issuing a `kubectl` command.

   <br />

   ```shell
   kubectl get pods -A
   ```

2. Extract the **values.yaml** from the Helm Chart with the following command:

   <br />

   ```shell
   tar xzvf /path/to/chart.tgz spectro-mgmt-plane/values.yaml
   ```

3. Review the **values.yaml** . You must populate the `env.rootDomain` parameter to the domain you will use for the
   installation. All other parameter values are optional, and you can reset or change them with a Helm upgrade
   operation.

   <br />

   :::warning

   Do not use a wildcard in the root domain value for the `env.rootDomain` parameter. Use a complete domain name when
   assigning a root domain name value.

   :::

4. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the
   Palette Helm Chart.

   <br />

   ```shell
   helm install palette /path/to/chart.tgz -f /path/to/values.yaml
   ```

5. Monitor the deployment using the command below. Palette is ready when the deployments in namespaces `cp-system`,
   `hubble-system`, `jet-system` , and `ui-system` reach the _Ready_ state.

   <br />

   ```shell
   kubectl get pods --all-namespaces --watch
   ```

6. Create a DNS record that is mapped to the Palette `ingress-nginx-controller` load balancer. You can use the following
   command to retrieve the load balancer IP address.

   <br />

   ```shell
   kubectl get service ingress-nginx-controller --namespace nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
   ```

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the
**values.yaml** file as you will need it for future upgrades.

{" "}

<br />

</TabItem>

<TabItem label="AWS EKS" value="aws-eks">

1. Ensure the AWS CLI is configured with your credentials. You can use the following command to configure your
   credentials. Refer to the
   [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) guide for
   additional help.

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

   Note that the [minimum instance requirement](https://aws.amazon.com/ec2/instance-types/) is three nodes with a least
   4 CPUs and 12 GB of Memory per node.

3. When the cluster is available, go ahead and configure the OpenID Connect (OIDC) for the cluster to use Palette as the
   Identity Provider (IDP).

   <br />

   ```shell
   eksctl utils associate-iam-oidc-provider --cluster=palette-selfhost --approve
   ```

4. Next, add the EBS Container Storage Interface (CSI) driver IAM role. Replace the `<AWS_ACCOUNT_ID>` with your AWS
   account ID.

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

   You can find additional guidance about Amazon EBS CSI drivers and requirements by reviewing the
   [EBS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) and the
   [Manage EBS with EKS](https://github.com/awsdocs/amazon-eks-user-guide/blob/master/doc_source/managing-ebs-csi.md)
   guide.

   :::

10. Extract the Helm Chart files from the compressed asset we provided to you. Replace the file path and version
    placeholder as needed.

    <br />

    ```shell
    tar xzvf path/to-file/spectro-mgmt-helm-charts-X.X.tar.gz
    ```

11. Navigate to the **spectro-mgmt-helm-charts-X.X** folder.

    <br />

    ```shell
    cd spectro-mgmt-helm-charts-X.X
    ```

12. Review the **values.yaml** . You must populate the `env.rootDomain` parameter to the domain you will use for the
    installation. In addition, add the same `rootDomain` with port `:4222` to the `natsUrl` in the `nats` section of the
    YAML. Example: `env.rootDomain: my-domain.com:4222`. All other parameter values are optional, and you can reset or
    change them with the Palette API.

    <br />

    :::warning

    Do not use a wildcard in the root domain value for the `env.rootDomain` parameter. Use a complete domain name when
    assigning a root domain name value.

    :::

13. If you wish to use [AWS ACM for SSL Certs](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html),
    instead of the default self-signed certificate that the Nginx _ingress controller_ generates, you can add it to the
    `annotations` under `ingress`.

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

14. Download the kubeconfig file for the EKS cluster. Ensure you can interact with the target cluster. You can validate
    by issuing a `kubectl` command. For additional guidance, refer to the
    [kubeconfig file for an Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) guide.

15. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the
    Palette Helm Chart.

{" "}

<br />

```shell
helm install palette /path/to/chart.tgz -f /path/to/values.yaml
```

16. Monitor the deployment using the command below. Palette is ready when the deployments in namespaces `cp-system`,
    `hubble-system`, `jet-system` , and `ui-system` reach the _Ready_ state.

    <br />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

17. Create a DNS record mapped to the load balancer created by the Palette service `ingress-nginx-controller` . You can
    use the following command to retrieve the load balancer IP address.

    <br />

    ```shell
    kubectl get service ingress-nginx-controller --namespace nginx --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the
**values.yaml** file as you will need it for future upgrades.

<br />

</TabItem>

</Tabs>

# Validate

You can validate that the installation of Palette is successful by visiting the custom domain you assigned to the
`env.rootDomain` parameter in the **values.yaml**.

<br />

:::warning

If you notice that the pods in the `hubble-system` namespace are not initializing as expected, it might be due to a
delay in adding the DNS records for the rootDomain. The workaround is to terminate all pods except the pods related to
`mongo-db` in the `hubble-system` namespace to trigger a redeployment of the pods.

{" "}

<br />

```shell
kubectl delete pods --namespace hubble-system --selector=role!=mongo
```

:::

## Upgrade Palette

To upgrade Palette with a new Helm release, use the following steps.

1. Download the new version of the Helm Chart.

2. Extract the new **values.yaml** file from the Helm Chart with the following command:

   <br />

   ```shell
   tar xzvf /path/to/chart.tgz spectro-mgmt-plane/values.yaml
   ```

3. Compare the new **values.yaml** against the original **values.yaml** you used for the initial Palette installation.
   Address any new parameters added to the values file.

4. Issue the following command to upgrade Palette. Use the same **values.yaml** file you used for the Palette
   installation.

   <br />

   ```shell
   helm upgrade palette /path/to/chart.tgz --file /path/to/orginal_values.yaml
   ```

## Post-Install Configuration Values

The values you specified in the **values.yaml** file all fall under the parameter section `values.config` and are stored
in the `configserver-cm` ConfigMap.

After the installation, if you need to change any configuration values under `values.config` in the **values.yaml**
file, you must use the Palette API. When you use the `helm upgrade` command, internal system configurations stored in
the Kubernetes ConfigMap `configserver-cm` will display as updated, but Palette will not apply the new values. Palette
only accepts changes to these configuration values if they are submitted via API.

If you find yourself in this scenario, contact our support team by emailing us at support@spectrocloud.com for
additional guidance.

## Next Steps

Start exploring the Palette system dashboard so that you become familiar with the available actions you can take as an
administrator. Check out the [System Console Dashboard](system-console-dashboard.md) resource to learn more.
