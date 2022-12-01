---
title: "Infrastructure Security"
metaTitle: "Infrastructure"
metaDescription: "Infrastructure security for platform, tenant clusters, control plane, and worker nodes"
icon: ""
hideToC: true
fullWidth: false
---

# Infrastructure Security

Spectro Cloud has security controls for the operating system, containers, and Kubernetes. Data is also protected with secure keys, encryption, secure communication, standard authentication/authorization, and API security. Audit logs record actions taken on the platform.

## Hardened Operating System

Spectro Cloud provides an Ubuntu or CentOS image for all supported cloud environments. Images hardened according to Center for Internet Security (CIS) Benchmarks are used to launch control planes and worker nodes for the Kubernetes cluster hosting Spectro Cloud platform. Spectro Cloud’s OS hardening utility performs the following tasks:

- Applies the latest available security updates.
- Hardens SSH server parameters, network parameters (sysctl), and system files by ensuring proper file permissions are set.
- Removes legacy services and graphical user interface (GUI) packages.

Spectro Cloud allows you to set up OS patching policies. You can patch the base OS when you deploy the cluster.

## Hardened Containers

Container images for various application services are built using distroless images, which have significantly fewer packages and improve security by reducing attack surface.

All container images are scanned for vulnerability using Palo Alto Networks Prisma Cloud (Twistlock) Defender before being published to a repository or deployed to the SaaS platform.

## Hardened Kubernetes

Spectro Cloud has a fully automated Kubernetes verification system that adds the newest patch version of Kubernetes to its public repository. All Kubernetes packs are hardened according to CIS Benchmarks.

A major Kubernetes version generally runs more rigorous compatibility tests and is available after 30 days from its release.

Kubernetes run-time security support is done through a variety of add-on packages such as Sysdig Falco and Twistlock.

Kubernetes cluster authentication can be optionally integrated with Kubelogin with openID connect (OIDC)-based authentication/authorization against an external identity provider (IDP).

You can set a schedule to run Kubernetes conformance and compliance tests with Kubebench, Kubehunter, Sonobuoy. These tests ensure tenant clusters are secure, compliant, and up to date.

## Secure Keys 

The following encryption keys are unique and generated for each installation:

- Root Key to encrypt the tenant-specific encryption key
- JSON web token (JWT) signature key to sign the JWT token
- Hash Salt to hash the user password and email ID

Tenant data is encrypted using a 64-bit cryptographically secure tenant key. A unique tenant key is generated for each tenant and encrypts the following:

- User account name and email ID
- Tenant's cloud credentials
- Tenant's private registry password
- Tenant's GitHub access token

In self-managed deployments, the keys are generated during installation and stored as secrets in the management cluster’s etc directory (etcd).

## Data Encryption

In SaaS deployments, backup snapshots of MongoDB cluster storage volumes are encrypted to secure cluster data on disk.

In self-managed deployments, the administrator can set up a disk encryption policy for management cluster VMs if required.

## Secure Communications

Spectro Cloud secures data in motion using an encrypted transport layer security (TLS) communication channel for all internal and external interactions. 

Public certificates are created using a cert-manager for external API/UI communication. For on-prem deployment, you can import an optional certificate and private key to match the management cluster fully qualified domain name (FQDN).

Services in the management cluster communicate over HTTPS with self-signed certificates and RSA 2048-bit key.

The database connection from application services running in the management cluster to MongoDB is protected by TLS with Authentication enabled. 

NATS messages are exchanged using TLS protocol, and each tenant cluster uses dedicated credentials to connect to the message bus. Authentication and Authorization policies are enforced in the NATS deployment to ensure message and data isolation across tenants.  

## Authentication and Authorization

Spectro Cloud platform fully supports role based access control (RBAC) and supports two authentication modes:

- Local authentication and password policy 
<br />
In this mode, a user email serves as the ID and a password is compared with the one-way hash stored in the database to authenticate users to a tenant. 
The platform administrator can set password policy to control the requirements for password length, rule, and expiration.
<br />
- Single sign-on (SSO) and multi-factor authentication (MFA)
<br />
In this mode, the tenant is configured to have security assertion markup language (SAML) 2.0 IDP integrations. If the IDP requires MFA, you will be redirected to the IDP’s authentication page. SSO can also automatically map a user to one or more user groups in the tenant.

## API Security

Spectro Cloud uses JWT-based authentication/authorization for REST API access over HTTPS.  Spectro Cloud's [API Authentication](https://docs.spectrocloud.com/api/v1/auth/) document provides more details.

The authentication token is valid for 15 minutes. If the token is about to expire, you can make a token refresh request before making other API calls. 

The Spectro Cloud backend has a common API gateway validation service that ensures there are no invalid parameter values or potential vulnerabilities, such as SQL injection or cross-site scripting.

Since API requests are made through a common API gateway service, you can use the service log to trace APIs with a unique ID, Tenant UID, or Session UID. To avoid revealing unnecessary information, all UIDs are 48-bit random hex strings.
<br />
