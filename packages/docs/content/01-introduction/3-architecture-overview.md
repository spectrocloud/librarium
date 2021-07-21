---
title: "Architecture Overview"
metaTitle: "Spectro Cloud Architecture"
metaDescription: "Spectro Cloud Architecture Overview"
icon: ""
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# SaaS Architecture and Data Flow Diagram

The Spectro Cloud SaaS platform can manage both public clouds (AWS, Azure, GCP), private clouds (VMware, OpenStack, Bare Metal). Depends on the target environment is public cloud or private cloud, the architecture and data flow is slightly different.

## SaaS to Public Clouds
The foloowing diagram illustrates the data flow for Spectro Cloud SaaS to manage EKS cluster using user's own cloud account in AWS:

![spectro_cloud](/dfd_saas_to_aws.png)

There are two main data flows. 

**1. Provisioning data flow:** A tenant user from the browser or API client (e.g., Terraform provider) to configure Cluster Profile, Cloud Configuration (e.g., which cloud account to use, cloud specific placement settings like VPC, subnet), and cluster specifications (e.g., cluster size, node instance type, etc.). These information are sent to Spectro Cloud SaaS. Spectro Cloud SaaS platform will in turn invoke cloud API to talk to the cloud endpoint using the cloud credentials specified to provision the EKS cluster. Once the cluster is provisioned, a Spectro Cloud management agent will be pushed and installed in the cluster. This agent will receive the Cluster Profile and Cluster Specifications as desired state from SaaS. The agent will further inspect the desired state and pull additional add-on integrations from Spectro Cloud's public package registry, or optionally a private package registry hosted by the tenant user. Once all required add-on integrations are installed, the agent will send message to SaaS to indicate the full-stack K8s provisioning is completed.

**2. Monitoring data flow:** The agent will periodically report the cluster health status back to the SaaS. The agent will also stay in watch loop to check if the cluster's stat matches with the declared desired state. If there is any diviation (e.g., a worker node is accidentally shutdown by user directly from the cloud console), the agent can either send alert message or based on the policy, doing auto reconciliation / self-healing to bring the cluster back to match with the desired state. If there is an updated Cluster Profile or Cluster Spec, the agent will receive the updated desired state from SaaS, and it will then enforce the desired state by making cluster configuration changes accordingly.

## SaaS to Private Clouds
For private clouds like VMware, since Spectro Cloud SaaS does not have direct access to the private cloud endpoint (e.g., vCenter), there is one extra component, Spectro Cloud Private Cloud Gateway, to be deployed in private cloud environment to act as the local orchestrator and the proxy between SaaS and cloud endpoint. The following diagram illustrates the data flow for Spectro CLoud SaaS to manage an on-prem VMware private cloud:

![spectro_cloud](/dfd_saas_to_vmware.png)

# Self-hosted On-prem Installation Architecture

Although Spectro Cloud SaaS fully supports both public and private clouds, for some customers, especially with regulated industry or air-gapped environments, they would prefer to install Spectro Cloud management platform on-prem so that they can control the platform upgrade cycles and ensure no sensitive data send to or accessible by SaaS. For these use cases, Spectro Cloud supports self-hosted on-prem installation. The platform updates and add-on integration contents can be optionally downloaded from an on-prem private repository instead of pulling from Spectro Cloud's hosted public repository.

![spectro_cloud](/dfd_on_prem_vmware.png)
