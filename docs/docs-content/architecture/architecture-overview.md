---
sidebar_label: "Overview"
title: "Deployment Architecture Overview"
description: "Spectro Cloud Architecture Overview"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
---

Palette is available in three flexible deployment models:

- **Multi-tenant SaaS**: The management plane is hosted in AWS across three regions (us-east-1, us-west-1, us-west-2)
  and managed by Spectro Cloud. Each customer will occupy a tenant. The Spectro Cloud operation team controls when to
  upgrade the management plane.

- **Dedicated SaaS**: The management plane is hosted in a cloud/region specified by the customer in Spectro Cloud’s
  cloud account with a dedicated instance managed by Spectro Cloud. The customer can decide when to upgrade the
  management plane.

- **Self-hosted**: The management plane is hosted in the customer’s environment. It can be the customer’s on-prem VMware
  vSphere, OpenStack, bare metal, or in a public cloud using the customer’s cloud account.

![A diagram of Palette deployment models eager-load](/architecture_architecture-overview-deployment-models.webp)

<br />

## Product Security

At Spectro Cloud, we recognize the importance of robust security measures in today's rapidly evolving digital landscape.
As the provider of our cutting-edge SaaS and self-hosted Palette product, our commitment to safeguarding your data and
ensuring the integrity of our services is paramount. Learn more about Palette security by reviewing the
[Security](../security/security.md) section.

<br />

## SaaS Architecture and Data Flow

The Palette SaaS platform can manage public clouds (AWS, Azure, Google Cloud) and on-premises data center (VMware,
OpenStack, bare metal). The architecture and data flow slightly differ based on whether the target environment is a
public or an on-premises data center.

### SaaS to Public Clouds

The following diagram illustrates the data flow for the Palette SaaS platform to manage the EKS cluster using the user's
cloud account in AWS:

![A diagram of the Palette SaaS architecture eager-load](/architecture_architecture-overview_saas.webp)

There are two main data flows represented in the provisioning flow (red) and monitoring flow (green).

- **Provisioning data flow**: A tenant user from the browser or API client (e.g., Terraform provider) to configure
  Cluster Profile, Cloud Configuration (e.g., which cloud account to use, cloud-specific placement settings like VPC,
  subnet), and cluster specifications (e.g., cluster size, node instance type, etc.). This information is sent to
  Palette. In turn, Palette will invoke the cloud API to talk to the cloud endpoint using the cloud credentials
  specified to provision the Kubernetes cluster. Once the cluster is provisioned, a Palette management agent will be
  pushed and installed in the cluster. This agent will receive the Cluster Profile and Cluster Specifications as the
  desired state from SaaS. The agent will further inspect the desired state and pull additional add-on integrations from
  Palette's public package registry, or optionally a private package registry hosted by the tenant user. Once all
  required add-on integrations are installed, the agent will send a message to SaaS to indicate the full-stack K8s
  provisioning is completed.

- **Monitoring data flow**: The agent will periodically report the cluster health status back to the Palette SaaS
  platform. The agent will also stay in the watch loop to check if the cluster's stat matches the declared desired
  state. If there is any deviation (e.g. a worker node is accidentally shut down by a user directly from the cloud
  console), the agent can either send an alert message or based on the policy, do auto reconciliation/self-healing to
  bring the cluster back to match with the desired state. If there is an updated Cluster Profile or Cluster Spec, the
  agent will receive the updated and desired state from SaaS. It will then enforce the desired state by making cluster
  configuration changes accordingly.

### SaaS to Private Clouds / Data Center / Bare Metal

For private clouds like VMware, since the Palette SaaS platform does not have direct access to the private cloud
endpoint (e.g., vCenter), there is one extra component, Palette
[Private Cloud Gateway](../clusters/pcg/architecture.md), to be deployed in a private cloud environment to act as the
local orchestrator and the proxy between Palette’s SaaS platform and cloud endpoint. The following diagram illustrates
the data flow for the Palette SaaS platform to manage an on-prem VMware private data center:

![Palette SaaS architecture diagram with connections to private data centers](/architecture_architecture-overview_on-prem.webp)

## Self-Hosted Architecture and Data Flow

Although the Palette SaaS platform fully supports both public clouds and data centers, some customers, especially with
regulated industry or air-gapped environments, may prefer to install Palette in their own environment behind the
firewall, so that they can control the platform upgrade cycles and ensure no sensitive data are exposed. For these use
cases, Palette supports a self-hosted on-premises installation. The platform updates and add-on integration contents can
be optionally downloaded from a self-hosted private repository instead of pulling from Palette’s hosted public
repository.

![Self-hosted Palette architecture diagram](/architecture_architecture-on-prem-detailed.webp)

### Message Brokers

Palette’s internal microservices require a stable, secure, and scalable way to exchange information quickly. To support
this, Palette uses a [gRPC](https://grpc.io/)-based message broker service that manages communication between services
using a publish-subscribe model. The message broker acts as a central hub that routes messages between services. Each
service can publish messages or subscribe to messages on specific topics, and the broker ensures that messages are
delivered reliably, securely, and in real time.

To handle communication across large-scale, distributed environments, the message broker runs as multiple pod replicas
within each management plane cluster. This provides the following benefits:

- **Load distribution** - Incoming gRPC connections are automatically balanced across replicas to optimize resource
  usage and prevent message broker pods from becoming overloaded.

- **High availability** - If a message broker pod fails, others continue handling traffic without interruption. By
  default, each management plane includes two broker replicas.

- **Cluster quorum** - Message brokers automatically detect each other and form a cluster, allowing them to coordinate
  message delivery and maintain consistent performance as the system scales.

- **Security** - All communication between message broker pods is encrypted and authenticated using secondary
  certificates to ensure secure message exchange.

To inspect the message brokers of your self-hosted Palette or Palette VerteX management plane cluster,
[connect to your management plane cluster with the kubectl CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli),
and execute the following command.

```bash
kubectl get statefulset msgbroker --namespace hubble-system
```

```bash title="Example output" hideClipboard
NAME        READY   AGE
msgbroker   2/2     97d
```
