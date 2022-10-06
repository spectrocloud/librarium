---
title: "Palette Cloud Platform Security"
metaTitle: "Spectro Cloud Palette Platform Security"
metaDescription: "Modern micro services-based architecture where product functionality is broken down logically into services that are isolated into containers."
icon: "cloud"
hideToC: false
fullWidth: false
hideToCSidebar: false
---

import SecurityWP from "shared/components/common/SecurityWP";
import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Spectro Cloud Platform Security

This section describes the architecture and features implemented in the Spectro Cloud platform related to security.

<br />

## Deployment Architecture

Spectro Cloud is built using modern micro services-based architecture, where product functionality is broken down logically into services that are isolated into containers. These containers are deployed into a Kubernetes Cluster called Management Cluster, which can be hosted and managed by Spectro Cloud (SaaS mode), or it can be hosted and managed by the customer (self-managed mode).

<br />
 

### SaaS Deployment Architecture

In a SaaS deployment, Spectro Cloud multi-tenant SaaS can manage Kubernetes clusters (tenant clusters) in any supported public clouds and private clouds.

![image2](/security-images/image2.png "#width=500px")

For public clouds like AWS, Azure, or GCP, the SaaS platform will directly talk to the cloud API endpoint for cloud access, based on the cloud credentials, specified in the tenant. The tenant clusters can be deployed within a virtual private network (VPC) in the cloud.<p></p><br />
Each tenant cluster has a Spectro Cloud Management Agent running as a Pod. This agent will have an outgoing internet connection to the Spectro Cloud SaaS, using network address translation (NAT) over the Transport Layer Security (TLS) protocol to periodically report health heartbeat and stat and connect to the Spectro Cloud public repository over HTTPS for any out-of-box integration packs. <p></p><br />
All outgoing internet connections are over TLS v1.2 or higher with a hardened cipher suite.

 ![image3](/security-images/image3.png)

For SaaS to manage private clouds like VMware or vSphere, a Private Cloud Gateway (PCG) component is deployed to the on-premise environment.<p></p><br />
This PCG is deployed as a virtual appliance (OVA) to be automatically paired with a tenant, based on a randomly generated pairing code, similar to the Bluetooth pairing process. The PCG acts as a proxy between the Spectro Cloud SaaS and the private cloud endpoint (e.g, vCenter). 

It only needs an outgoing internet connection to the SaaS using NATS over TLS protocol to allow SaaS controller to:<p></p><br />

1. Dynamically query cloud placement resources (for example: datacenter, resource pool, datastore, port group, or folder, and so on).<p></p><br />
   
2. Act as an orchestrator to interact with vCenter to initiate deployments when requested y SaaS controller.<p></p><br />
   
Similar to Kubernetes clusters deployed in public clouds, each tenant cluster will have a Spectro Cloud Management Agent running as a Pod. This agent has an outgoing internet connection to Spectro Cloud SaaS, using NATS over TLS protocol to periodically report health heartbeat and stats and connect to the Spectro Cloud public repository over HTTPS for any out-of-box integration packs.<br />

All outgoing internet connections are over TLS v1.2 or higher with a hardened cipher suite. If the on-premise environment requires a connection to the internet using the proxy, both the PC and the management agent support SOCKS5 or HTTPS proxy.<p></p><br />

<br />


### On-Premise Installation Deployment Architecture

In addition to multi-tenant SaaS deployment mode, Spectro Cloud also supports a self-managed mode, where the Spectro Cloud management platform can be deployed behind the firewall in an on-premise environment.

 ![image4](/security-images/image4.png)

For on-premise installation deployment mode, the Spectro Cloud management platform is deployed as a virtual appliance (OVA) in on-premise environment. This OVA can act as a standalone mode for quick POC or enterprise mode which will launch a 3-node High Availability (HA) cluster as the Spectro Cloud Management Cluster.<p></p><br />

The management cluster will provide a browser-based UI to allow the administrator to set up the tenant and provision/manage tenant clusters. Each tenant cluster will have a Spectro Cloud Management Agent running as a Pod. This agent will connect to the Spectro Cloud Management Cluster, using NATS over TLS protocol, to periodically report health heartbeats and stats, and connect to the Spectro Cloud public repository over HTTPS for any out-of-box integration packs. 

The management cluster will also connect to the Spectro Cloud public repository to check if there are any Spectro Cloud platform updates available. 

All outgoing internet connections are over TLS v1.2 or higher with a hardened cipher suite. If the on-premise environment requires connecting to the internet using proxy, both the management cluster and the management agent support SOCKS5 or HTTPS proxy. If it is in a strict air-gapped environment without any outgoing internet connection, the Spectro Cloud public repository content can be replicated to a private repository setup behind the firewall.
 
<br /> 
<br />

## Platform Security

Based on the deployment model, the Spectro Cloud Platform is composed with a multi-layer deployment stack like the one shown below.

![image5](/security-images/image5.png)

Spectro Cloud follows defense in depth principles that prescribe securing each layer in a multi-layer deployment stack to ensure maximum security.

For the SaaS deployment model, Cloud and Virtual Machine (VM) security is taken care of by the SaaS platform operation security controls, which we will cover later. For on-premise deployment models, the Cloud and VM security is typically taken care of by the customer's data center infrastructure/platform team. This section will discuss the security controls of the remaining layers. 

<br /> 
<br />

### Operating System

The Operating System used for instances that form the Spectro Cloud Management Platform Kubernetes cluster is Canonical Ubuntu 18.04 LTS. SpectroCloud follows the Center for Internet Security® (CIS) standard—*CIS Ubuntu Linux 18.04 LTS Benchmark version 2.0* to harden the operating system. This is done by running Spectro Cloud's OS hardening utility on an Ubuntu-base image, provided by the Cloud Provider. These hardened images are used to launch control planes and worker nodes for the Kubernetes cluster hosting Spectro Cloud platform. The following tasks are performed by the Spectro Cloud OS hardening utility.

-   Apply the latest security updates available.

-   Harden SSH server parameters.

-   Harden network parameters using `sysctl`

-   Harden system files by ensuring proper file permissions are set.

-   Remove legacy services and GUI packages.

<br /> 
<br />

### Container Security

Spectro Cloud uses *containerd* for container runtime. *Containerd* is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. It runs as a daemon on the Ubuntu instances.

Container images for various application services are built using distroless images which have significantly less packages and improve security by reducing the attack surface.

All base OS and container images are scanned for vulnerability using Nesus, Vuls, and Trivy (Aqua) prior to being published to a repository or deployed to the SaaS platform.

<br /> 
<br />

### Kubernetes Hardening

The Kubernetes version used for Spectro Cloud's platform is the latest patch version of 1.19.X, and it is secured as per the *CIS Kubernetes Benchmark version 1.5.0*. See below for the rules enforced on the different components.

**API Server**

-   API Server audit & logging through policy is enforced.

-   Authorization mode is set to *RBAC, Node to control the level of access different entities has on the objects in the cluster*.

-   Unsecured ports are disabled so that unauthorized users don't have access to the master nodes.

-   Only stronger TLS cipher suites are used.

-   Pod security policy is enabled.

-   Admission control policy is enabled and only the following plug-ins are allowed:

    -   AlwaysPullImages

    -   DenyEscalatingExec

    -   NamespaceLifecycle

    -   ServiceAccount

    -   NodeRestriction

    -   PodSecurityPolicy

-   Below unsafe admission control plug-ins are disabled:

    -   AlwaysAdmit

**Controller Manager**

-   Profiling is disabled.

-   Threshold for Terminated pod GC is set to 25.

-   Use of Service Account credentials is enabled.

-   Kubelet Server Certificate rotation is enabled.

**Scheduler**

-   Profiling is disabled.

**Kubelet**

-   Read only port is disabled.

-   Event Queries-per-second (QPS) is disabled.

-   Kubelet Server Certificate rotation is enabled

-   Kernel default protection is enabled

-   Only stronger TLS cipher suites are used

<br />

### Pod Security Policies

Pod Security Policy controls security sensitive aspects of the pod specification. It defines a set of conditions that a pod must run, in order to be accepted into the system. This allows Kubernetes administrators to have fine-grained control over pod creation and update.

Pod Security Policy allows us to limit only specific users/service accounts to have permissions of the following:

-   Create privileged pods

-   Access host namespaces

-   Access host networking

-   Access host filesystems

-   Root privileges escalation

-   Specify container user/group ID

-   Container selinux context

-   Linux capabilities

<br />
<br />

## Data Encryption

### Keystores

The following encryption keys are unique and generated for each installation:<p></p><br />

-   **Root Key** - The root key is used to encrypt the tenant specific encryption key.<p></p><br />
 
-   **JWT Signature Key** - The JWT signature key which is used to sign the JWT token.<p></p><br />

-   **Hash Salt** - Salt for the hashing algorithm, used for hashing the user password & email ID.<p></p><br />

For a SaaS deployment, SaaS Ops lead manages the key creation, and these keys are stored in the Management Cluster's etcd as secrets. DevOps keeps
these keys in the vault service (keepersecurity.com) for recovery.

For an on-premise deployment, the keys are generated during the installation and stored as secrets in Management Cluster's etcd.

<br />
<br />

### At Rest

**Tenant Specific Encryption Key Generation**

![image6](/security-images/image6.png)

Tenant data is encrypted using a 64-bytes cryptographically-secure, random key known as the tenant key. A unique tenant key is generated for every tenant in the system. The tenant key is encrypted using the system root key and stored in the database. The system root key is stored in the cluster's etcd.

**Data Encryption Using Tenant Key**

![image7](/security-images/image7.png)

The following steps describe the process of encrypting sensitive tenant data.<p></p><br />

1.  Sensitive Data is sent to secure persistence service.<p></p><br />

2.  Encrypted tenant key is retrieved from the database.<p></p><br />

3.  The encrypted tenant key is decrypted using the root key.<p></p><br />

4.   Sensitive Data is encrypted using the decrypted tenant key and persisted in the database.<p></p><br />

**Sensitive Data**

Following sensitive information is encrypted using the tenant encryption key: <p></p><br />

-   User account name and email ID (PII Data) <p></p><br />

-   Tenant's cloud credentials <p></p><br />

-   Tenant's private registry password <p></p><br />

-   Tenant's GitHub access token  <br />

User account password is one-way hashed using the bcrypt adaptive hashing algorithm with salt. PII Data will be removed in the database if a user account is deleted, only the user's Unique Id will be remaining to keep internal reference for historical data. To avoid revealing unnecessary information, Unique ID (UID) is a 48-bit random hex string, not incremental integers.<p></p><br />

**Database**

For SaaS deployment:<p></p><br />

-   MongoDB cluster storage volumes are encrypted to secure all the cluster data on disk.<p></p><br />

-   MongoDB backup snapshots are encrypted. <br />

For on-premise installation, vCenter admin can set disk encryption policy for management cluster VMs if it requires full disk encryption at rest.

<br /> 
<br />

### In Motion

Spectro Cloud secures data in motion by using an encrypted TLS communication channel for all internal and external interactions.<p></p><br />

**End User Communication**

Public certificates are created using Cert manager for external API/UI communication. An optional certificate and private key can be imported for on-premise deployment to match with the management cluster FQDN.

**Inter-Service Communication**

Services within the Spectro Cloud management cluster are communicating over HTTPS with self-signed certificates and RSA 2048-bit key.

**Database Communication**

Database connection from application services, running in the management cluster, to MongoDB is also protected by TLS with Authentication enabled.

**Message Bus**

NATS message bus is used for asynchronous communication between Spectro Cloud Management Cluster/SaaS and tenant clusters. NATS messages are exchanged over TLS and each tenant cluster uses dedicated credentials to connect to the message bus. Authentication and Authorization policies are enforced in the NATS deployment to ensure message/data isolation across tenants.

<br /> 
<br />

## Authentication and Authorization
<br />

### Authentication

**Local authentication & password policy**<br />

In this mode, a user email is used as the ID and a password compared against the one-way hash stored in the database is used to authenticate the user to a tenant. Users can authenticate using the common login URL (e.g., console.spectrocloud.com), or the tenant specific URL (e.g., tenant-abc.console.spectrocloud.com). 

The platform admininistrator can set password policy to control the requirements for password length, rule, and expiration duration.<p></p><br />

**Single Sign-on & Multifactor Authentication** <br />

In this mode, the tenant is configured to have SAML 2.0 based identity provider (IdP) integrations, such as ADFS, Okta, Ping Identity, and the like. A user can log in via the common login URL (e.g., console.spectrocloud.com) or the tenant-specific URL (e.g., tenant-abc.console.spectrocloud.com) and supply the user email. 

The platform will automatically authenticate against the tenant IdP.<p></p><br /> 
If the IdP requires Multifactor Authentication (MFA), the user will be redirected to the IdP's authentication page with required multi-factor authentication information. SSO can also automatically map the user into team(s).

If there are one or more teams created in the tenant whose names are matched with the user group names that this user belongs to in IdP, this user will automatically become a member of the matching team(s).<br /><br />

### Authorization

Spectro Cloud platform fully supports role based access control (RBAC).

**Permissions**

Permissions determine what operations are allowed on a resource. Permissions can be defined in the format: *component.operation* like *cluster.create*, *cluster.edit*, *cluster.activate*, etc.

**Roles**

A role is a collection of permissions. Each role has a scope, which can be either *tenant* or *project*. Based on the role's scope, the permissions will be restricted to the applicable permissions. For example: e.g., a *project* scope role cannot have *user.list* permission. 

Spectro Cloud has a set of out-of-box roles but also allows admin to create custom roles.

**Role Assignment and RBAC**

Role(s) can be assigned to user(s) and/or team(s). One or more *tenant* scope roles can be assigned for Tenant Roles, and one or more *project* scope roles can be assigned for each individual Project.<p></p><br />
If a user belongs to multiple teams, this user will get all roles assigned to these teams. <p></p><br />
The combined permissions of all roles this user has, become the effective permission for this user.

<br />
<br />

### API Security

**Authentication / Authorization**

Spectro Cloud uses JSON Web Token (JWT)-based authentication/authorization for REST API access over HTTPS. Please refer to the authentication section [here](https://docs.spectrocloud.com/api/v1/auth/) in API docs for more details. <p></p><br />
Essentially, the user invokes a login API to authenticate, and if successful, the server will return an authentication token that is valid for 15 minutes. Users can then keep the authentication token in the cookie and make subsequent REST API calls. <p></p><br />
All APIs will go through a common API gaeway service to perform authorization in the backend to ensure the user has the proper permission to invoke the API. If the authentication token is about to expire, the caller should make a special API invocation to refresh the authentication token before making other API calls.

**Parameter Validation**

The Spectro Cloud backend has a common API gateway service to perform parameter validation to ensure there are no invalid parameter values or potential vulnerabilities such as SQL Injection, cross-site scripting, and the like.

**Log Traceability**

Because all API invocation is going through the common API gateway service, this service's log can be used to trace APIs with unique User UID, Tenant UID, SessionID. To avoid revealing unnecessary information, all Unique IDs (UID) are 48-bit random hex strings, not incremental integers.

<br /> 
<br />

## SaaS Tenant Isolation

Spectro Cloud is a multi-tenant SaaS system where every tenant represents a customer. Tenant isolation is ensured through the following design principles and techniques: <p></p><br />

-   **Network Isolation** - Tenant clusters are created into tenant's own public cloud accounts or private data centers. There is no opportunity for a customer to intercept network traffic of other customer's tenant clusters. Access to the tenant cluster APIs, through the cluster's `kubeconfig` file, is restricted within the tenant. Users can only get access to `kubeconfig` files for clusters in their own tenants. <p></p><br />

-   **Data isolation** - Spectro Cloud provides comprehensive role-based access control to provide granular control over APIs that can be invoked by a user thereby controlling access to data. An overarching principle followed by Spectro Cloud besides applying RBAC policies, is to apply a tenant filter to every operation to ensure user access is restricted to data within their own tenant. <p></p><br />

-   **Tenant Data Encryption** - Sensitive tenant data is encrypted using dedicated tenant encryption key. All message communication uses tenant specific channels. <p></p><br />

-   **Audit Policies** - Spectro Cloud records all actions taken on the platform and provides a comprehensive report for tracking purposes. <p></p><br />

-   **Prevention from Noisy Neighbor issues** - Spectro Cloud uses AWS Load Balancers or CloudFront for all its public facing services. These frameworks benefit from automatic protections of AWS Shield Standard which defends against most common, frequently occurring network and transport layer DDoS attacks that target applications. This ensures excessive calls from a tenant do not adversely affect another tenant from utilizing the platform. <p></p><br />

## Audit Logs

All activities will be recorded in the audit log. The project level audit log contains activities within the project and is only accessible for users with *audit.list* (for listing) and *audit.get* (for get audit item details) permissions in user's project role. The tenant level audit log contains activities within the tenant across all projects. Again, the tenant level audit log is only accessible for users with *audit.list* and *audit.get* permissions in user's tenant role. Audit logs can be filtered and downloaded as CSV files for offline archiving or analytics.

<br />
<br />
