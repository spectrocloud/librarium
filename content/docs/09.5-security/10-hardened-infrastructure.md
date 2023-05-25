---
title: "Hardened Infrastructure"
metaTitle: "Infrastructure Security"
metaDescription: "Learn how Palette provides infrastructure security."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette has security controls for the operating system, containers, and Kubernetes. Data is protected with secure keys, encryption, secure communication, standard authentication and authorization, and API security. Audit logs record actions taken on the platform. Review the [Audit Logs](/audit-logs) guide to learn how to access and use them.

<br />

## Hardened Operating System

Palette provides Ubuntu or CentOS images for supported cloud environments. Images that are hardened according to Center for Internet Security (CIS) Benchmarks are used to launch control planes and worker nodes for the Kubernetes cluster hosting Palette. 

Palette's OS hardening utility performs the following tasks:

<br />

- Applies the latest available security updates.


- Hardens SSH server parameters, network parameters (sysctl), and system files by ensuring proper file permissions are set.


- Removes legacy services and graphical user interface (GUI) packages.

Palette allows you to set up OS patching policies. You can patch the base OS when you deploy the cluster. Refer to the [OS Patching](/clusters/cluster-management/os-patching) documentation to learn more.

<br />

## Hardened Containers

Container images for various application services are built using distroless images, which have significantly fewer packages and improve security by reducing attack surface.

All container images are scanned for vulnerability using Palo Alto Networks Prisma Cloud (Twistlock) Defender before being published to a repository or deployed to the SaaS platform.

<br />

## Hardened Kubernetes

Spectro Cloud has a fully automated Kubernetes verification system that adds the newest patch version of Kubernetes to its public repository. All Kubernetes packs are hardened according to CIS Benchmarks.

We assess major Kubernetes versions based on the extent of changes.

Kubernetes run-time security support is achieved through a variety of add-on packages, such as Sysdig Falco and Twistlock.

Kubernetes cluster authentication can be optionally integrated with Kubelogin using OpenID Connect (OIDC) authentication and authorization against an external Identity Provider (IDP).

You can set a schedule to start Kubernetes conformance and compliance tests using kube-bench, kube-hunter, and Sonobuoy. These tests ensure tenant clusters are secure, compliant, and up to date.

<br />

## Secure Keys 

The following encryption keys are unique and generated for each installation:

<br />

- **Root Key**: Encrypts the tenant-specific encryption key.


- **JSON Web Token (JWT) signature key**: Used to sign the JWT token.


- **Hash Salt**: Used to hash the user password and email ID.


- **Tenant key**: A 64-bit cryptographically secure tenant key encrypts tenant data stored in the management cluster, such as user account name, user email ID, and tenant cloud credentials.


In self-managed deployments, keys are generated during installation and stored as secrets in the management cluster’s etcd key-value store.


<br />

## Data Encryption

In SaaS deployments, backup snapshots of MongoDB cluster storage volumes are encrypted to secure cluster data on disk. In tenant clusters, Palette ensures security for data at rest and data in transit. Refer to [Tenant Cluster Security](/security/saas-operation#tenantclustersecurity) to learn how Palette applies data security.

In self-hosted deployments, the administrator can set up a disk encryption policy for management cluster VMs if required. Refer to [Self-Hosted Operation](/security/self-hosted-operation) for details.

<br />

## Secure Communications

Palette secures data in transit using an encrypted Transport Layer Security (TLS) communication channel for all internal and external interactions. Review [Tenant Cluster Security](/security/saas-operation#tenantclustersecurity) to learn how Palette applies security to data in transit.

Public certificates are created using a certificate manager for external API and UI communication. For self-hosted deployment, you can import an optional certificate and private key to match the management cluster Fully Qualified Domain Name (FQDN).

Services in the management cluster communicate over HTTPS with self-signed certificates and are signed using a Rivest–Shamir–Adleman (RSA) 2048-bit key.

The database connection from Palette internal services active in the management cluster to MongoDB is protected by TLS with Authentication enabled. 

Static Network Address Translation (NATS) messages are exchanged using TLS protocol, and each tenant cluster uses dedicated credentials to connect a message bus facilitated and managed by Palette. Authentication and Authorization policies are enforced in the NATS deployment to ensure message and data isolation across tenants. 

<br />

## Authentication and Authorization

Palette fully supports Role-Based Access Control (RBAC) and two authentication modes:

<br />

- *Local authentication* and *password policy* <br />

    With local authentication, a user email serves as the ID, and a password is compared with the one-way hash stored in the database to authenticate users to a tenant. The platform administrator can set password policy to control the requirements for password length, rule, and expiration.


- *Single Sign-On (SSO)* and *Multi-Factor Authentication (MFA)* <br />

    In these modes, the tenant is configured to have Security Assertion Markup Language (SAML) 2.0 IDP integrations. If the IDP requires MFA, you are redirected to the IDP’s authentication page. SSO can also map a user to one or more user groups in the tenant automatically.


## API Security

Palette uses JWT-based authentication and authorization for REST API access over HTTPS. 

The authentication token is valid for a limited time. If the token is about to expire, you can request a token refresh before making other API calls. 

Palette has a common API gateway validation service that ensures there are no incorrect parameter values or potential vulnerabilities, such as SQL injection or cross-site scripting.

You can use the gateway validation service log to trace APIs with a unique ID, Tenant UID, or Session UID. To avoid revealing unnecessary information, all UIDs are 48-bit random hex strings.

Refer to the [API Authentication](https://docs.spectrocloud.com/api/v1/auth/) guide for details.

<br />

<br />

<br />

<br />
