---
sidebar_label: "Secure Product Architecture"
title: "Secure Product Architecture"
description: "Learn about the integrity of Palette's secure architecture."
icon: ""
hide_table_of_contents: false
tags: ["security"]
---

In addition to the security principles we adhere to and our secure development lifecycle, we provide a cohesive security
architecture for Palette.

## Secure Product Architecture

Palette uses a microservices-based architecture, and we take steps to ensure each service is secured. Product
functionality is broken down logically into isolated services within containers. Containers are deployed in a Kubernetes
cluster, called a management cluster, which Palette hosts and manages in Software as a Service (SaaS) mode or that users
can host and manage in a self-hosted environment.

Palette supports three architecture models: multi-tenant SaaS, dedicated SaaS, and self-hosted, which includes support
for air-gapped environments. These flexible deployment models allow us to adapt to existing requirements in terms of
separating responsibilities and network restrictions.

<br />

- **Multi-tenant SaaS**: The management plane is hosted in AWS across three regions that we manage: us-east-1,
  us-west-1, and us-west-2. Each customer occupies a tenant in our multi-tenant cloud environment. Our Operations team
  controls when to upgrade the management plane.

- **Dedicated SaaS**: The management plane is hosted in a cloud or region that you specify in our Spectro Cloud cloud
  account with a dedicated instance that we manage. In this scenario, you decide when to upgrade the management plane.

- **Self-hosted**: The management plane is hosted in your environment. It can be on-prem VMware vSphere, OpenStack, bare
  metal, in a public cloud that manages your compute instances, or a managed Kubernetes cluster such as Amazon Elastic
  Kubernetes Service (EKS), Azure Kubernetes Service (AKS), and Google Kubernetes Engine (GKE).

<br />

![A diagram of Palette deployment models](/architecture_architecture-overview-deployment-models.png)

<br />

Palette’s robust security measures safeguard your data and ensure the integrity of our services. We adhere to
industry-leading standards and continuously refine our practices to provide the highest level of security. Palette
infrastructure safeguards data in your Kubernetes production environment with its zero-trust architecture, granular
Role-Based Access Control (RBAC), immutable Linux distributions ([Kairos](https://kairos.io/)), and hardened clusters
and Kubernetes packs.

Palette's security controls ensure data protection in SaaS operation at the management platform level and the
[tenant](../../glossary-all.md#tenant) cluster level. To learn more, refer to [SaaS Operation](saas-operation.md). In
self-hosted operation, you must ensure security controls in your environment. Find out more about self-hosted deployment
in [Self-Hosted Operation](self-hosted-operation.md).

## Multi-tenancy

Palette is a multi-tenant SaaS platform in which every tenant represents a customer. We ensure tenant isolation through
the following design principles and techniques:

<br />

- **Network isolation**: Tenant clusters are created in the tenant’s public cloud accounts or in private data centers.
  Customers cannot intercept network traffic in other tenant clusters. Access to tenant cluster APIs through the
  cluster’s kubeconfig file is restricted to the tenant.

- **Data isolation**: Palette applies a tenant filter to every operation to ensure users' access is restricted to their
  own tenant.

- **Tenant Data Encryption**: Tenant data is encrypted, and all message communication uses tenant-specific channels.

- **Audit Policies**: We record all actions taken on the platform and provide a comprehensive report for tracking
  purposes.

- **Noisy Neighbor Prevention**: In the SaaS deployment model, we use AWS Load Balancers and AWS CloudFront with a web
  application firewall (WAF) for all our public-facing services. These services benefit from the protections of AWS
  Shield Standard, which defends against the most common and frequently occurring network and transport layer
  Distributed Denial-of-Service (DDoS) attacks that target applications. This ensures that excessive calls from a tenant
  do not adversely affect other tenants' use of the platform.

## Palette Authentication & Authorization

Palette fully supports RBAC and two authentication modes:

<br />

- _Local authentication_ and _password policy_ <br />

  With local authentication, a user email serves as the ID, and a password is compared with the one-way hash stored in
  the database to authenticate users to a tenant. The platform administrator can set password policy to control the
  requirements for password length, rule, and expiration.

- _Single Sign-On (SSO)_ and _Multi-Factor Authentication (MFA)_ <br />

  In these modes, the tenant is configured to have Security Assertion Markup Language (SAML) 2.0 Identify Provider (IDP)
  integrations. If the IDP requires MFA, you are redirected to the IDP’s authentication page. SSO can also automatically
  map a user to one or more user groups in the tenant.

## API Security

Palette uses JSON Web Token (JWT)-based authentication and authorization for Representational State Transfer (REST) API
access over HTTPS.

The authentication token is valid for a limited time. If the token is about to expire, you can request a token refresh
before making other API calls.

Palette has a common API gateway validation service that ensures there are no incorrect parameter values or potential
vulnerabilities, such as Structured Query Language (SQL) injection or cross-site scripting.

You can use the gateway validation service log to trace APIs with a unique ID, Tenant UID, or Session UID. To avoid
revealing unnecessary information, all UIDs are 48-bit random hex strings.

Refer to the [API Key Authentication](../../user-management/user-authentication.md#api-key) guide for details.
