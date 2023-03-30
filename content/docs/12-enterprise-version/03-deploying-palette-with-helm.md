---
title: "Enterprise Mode"
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

The Palette Helm Chart Mode is a multi-node, highly-available installation of the Palette platform suitable for production purposes. Installation involves instantiating a Kubernetes cluster, and using Helm to install the Palette chart.

# Requirements

Palette SaaS in Helm Chart mode does not have specific requirements on Kubernetes, beyond requiring a currently GA'ed version of Kubernetes. This cluster can *not* be managed by Palette because some of the components are shared and will conflict. We recommend using a managed Kubernetes offering to reduce the management overhead for the cluster. The Palette Helm Chart does not depend on any specific managed Kubernetes offering. We recommend the cluster consist of at least 3 worker nodes, or 3 controlplane nodes without taints, so the application can be deployed across nodes for high availability. The cluster must have a container storage interface configured for persistent data. It is common practice to use this installation method in highly secure environments where firewall rules are restricting access to hosted installations of Palette SaaS. Be sure to consult our [architecture diagrams](/architecture/networking-ports) to ensure the cluster you deploy the Palette Helm Chart has the required connectivity to both resources on the public internet, and to the clusters that your hosted installation of Palette will manage. 


# Install Palette via Helm on a Kubernetes cluster

1. Create a DNS record which will be mapped to the Palette ingress-nginx-controller load balancer. How this is accomplished will be determined by your DNS provider. This hostname will be used later
2. Download the kubeconfig for the Kubernetes cluster where you will deploy Palette. How this is accomplished will be determined by the type of cluster you build; refer to the documentation for your cluster provider. 
3. Download the Palette Helm Chart - To gain access to the helm chart, contact our sales team at [sales@spectrocloud.com](mailto:sales@spectrocloud.com).
4. Populate a values.yaml for the Helm Chart. You can extract the values.yaml from the helm chart with the command: `tar xzvf /path/to/chart.tgz spectro-mgmt-plane/values.yaml`. You must set env.rootDomain to the hostname created in step 1. All other values are optional, and all values can be reset or changed with a helm upgrade operation.
5. Install the chart with the command `helm install palette /path/to/chart.tgz -f /path/to/values.yaml`
6. Monitor the deployment with the command `kubectl get po -A -w`. Palette is ready when the deployments in namespaces cp-system, hubble-syste, jet-system and ui-system reach Ready state.
7. To upgrade Palette with a new helm release, or to modify the values for the helm installation, use the command `helm upgrade palette /path/to/chart.tgz -f /path/to/values.yaml`
