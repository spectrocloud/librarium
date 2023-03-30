---
title: "Helm Chart Mode"
metaTitle: "Installing Palette with Helm"
metaDescription: "Using an existing Kubernetes cluster to deploy Palette SaaS"
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Helm Chart Mode

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster that is highly available and suitable for production environments. The installation involves setting up a Kubernetes cluster and using the Helm Chart to install Palette.

This installation pattern is common in secure environments with restricted network access that prohibits the usage of the Palette SaaS environment. Review our [architecture diagrams](/architecture/networking-ports) to ensure your Kubernetes cluster has the necessary network connectivity for Palette to operate successfully. 

# Prerequisites



- Configure a Container Storage Interface (CSI) for persistent data.


- Have at least three worker nodes or three untainted control plane nodes.


- Allocate a minimum of 4 CPUs and 12 GB Memory per node.


- A custom domain and the ability to updated Domain Name System (DNS) records.


- Access to the Palette Helm Chart. Contact suppport@spectrocloud.com to gain access to the Helm Chart.


<br />

<WarningBox>

Palette cannot manage the cluster its installed onto due to component conflicts. Consider using a managed Kubernetes service to minimize management overhead. The Palette Helm Chart not tied to any particular managed Kubernetes service.


</WarningBox>


# Install Palette


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


3. Review the **values.yaml** .You must populate the parameter `env.rootDomain` to the custom domain you will use for the installation. All other parameter values are optional and can be reset or changed with a Helm upgrade operation.


4. Install the Helm Chart using the following command. Replace the path in the command to match your local path of the Palette Helm Chart.

    <br />

    ```shell
    helm install palette /path/to/chart.tgz --file /path/to/values.yaml
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

You now have a self-hosted instance of Palette installed in a Kubernetes cluster.

<br />

<InfoBox>

To upgrade Palette with a new Helm release, or to modify the values used in the installation, use the following command. 

<br />

```shell
helm upgrade palette /path/to/chart.tgz --file /path/to/values.yaml
```

</InfoBox>

# Validation

You can validate that the installation of Palette is successful by visiting the custom domain you assigned to the parameter
`env.rootDomain` in the **values.yaml**.


# Next Steps

Start exploring the Palette system dashboard so that you become familiar with the available actions you can make as an administrator. Check out the [System Console Dashboard](/enterprise-version/system-console-dashboard) resource to learn more.


<br />


