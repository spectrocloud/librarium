---
title: "Architecture Overview"
metaTitle: "Spectro Cloud Architecture"
metaDescription: "Spectro Cloud Architecture Overview"
icon: ""
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Deployment Architecture Overview

Spectro Cloud supports three flexible deployment models:

* **Multi-tenant SaaS:** The management plane is hosted in AWS across three regions (us-east-1, us-west-1, us-west-2) and managed by Spectro Cloud. Each customer will occupy a tenant. Spectro Cloud operation team controls when to upgrade the management plane.
* **Dedicated SaaS:** The management plane is hosted in a cloud/region specified by the customer in Spectro Cloud’s cloud account with a dedicated instance managed by Spectro Cloud. The customer can decide when to upgrade the management plane.
* **Self-hosted:** The management plane is hosted in the customer’s environment. It can be the customer’s on-prem VMware vSphere, OpenStack, bare metal, or in a public cloud using the customer’s cloud account.


## SaaS Architecture and Data Flow
The Spectro Cloud SaaS platform can manage public clouds (AWS, Azure, GCP) and private clouds (VMware, OpenStack, Bare Metal). The architecture and data flow slightly differ based on whether the target environment is a public or private cloud.

### SaaS to Public Clouds
The following diagram illustrates the data flow for Spectro Cloud SaaS to manage the EKS cluster using the user's cloud account in AWS:



![spectro_cloud](/dfd_saas_to_aws.png)

There are two main data flows represented in provisioning flow (red) and monitoring flow (green).

* **Provisioning data flow:** A tenant user from the browser or API client (e.g., Terraform provider) to configure Cluster Profile, Cloud Configuration (e.g., which cloud account to use, cloud-specific placement settings like VPC, subnet), and cluster specifications (e.g., cluster size, node instance type, etc.). This information is sent to Spectro Cloud SaaS. In turn, Spectro Cloud SaaS platform will invoke the cloud API to talk to the cloud endpoint using the cloud credentials specified to provision the EKS cluster. Once the cluster is provisioned, a Spectro Cloud management agent will be pushed and installed in the cluster. This agent will receive the Cluster Profile and Cluster Specifications as the desired state from SaaS. The agent will further inspect the desired state and pull additional add-on integrations from Spectro Cloud's public package registry, or optionally a private package registry hosted by the tenant user. Once all required add-on integrations are installed, the agent will send a message to SaaS to indicate the full-stack K8s provisioning is completed.
* **Monitoring data flow:** The agent will periodically report the cluster health status back to the SaaS. The agent will also stay in the watch loop to check if the cluster's stat matches the declared desired state. If there is any deviation (e.g. a worker node is accidentally shut down by a user directly from the cloud console), the agent can either send an alert message or based on the policy, do auto reconciliation/self-healing to bring the cluster back to match with the desired state. If there is an updated Cluster Profile or Cluster Spec, the agent will receive the updated and desired state from SaaS. It will then enforce the desired state by making cluster configuration changes accordingly.


### SaaS to Private Clouds / Data Center / Bare Metal
For private clouds like VMware, since Spectro Cloud SaaS does not have direct access to the private cloud endpoint (e.g., vCenter), there is one extra component, Spectro Cloud Private Cloud Gateway, to be deployed in a private cloud environment to act as the local orchestrator and the proxy between Spectro Cloud’s SaaS and cloud endpoint. The following diagram illustrates the data flow for Spectro Cloud SaaS to manage an on-prem VMware private cloud:



![spectro_cloud](/dfd_saas_to_vmware.png)


## Self-hosted Architecture and Data Flow
Although Spectro Cloud SaaS fully supports both public and private clouds, for some customers, especially with regulated industry or air-gapped environments, they may prefer to install the Spectro Cloud management platform in their own environment behind the firewall, so that they can control the platform upgrade cycles and ensure no sensitive data send to or are accessible by SaaS. For these use cases, Spectro Cloud supports the self-hosted on-prem installation. The platform updates and add-on integration contents can be optionally downloaded from an on-prem private repository instead of pulling from Spectro Cloud's hosted public repository

![spectro_cloud](/dfd_on_prem_vmware.png)
