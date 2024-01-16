---
sidebar_label: "Data Encryption"
title: "Data Encryption"
description: "Learn about Palette security controls for data and communications."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["security"]
---

Palette has security controls for the operating system, containers, and Kubernetes. Data is protected with secure keys, encryption, and secure communication, standard authentication and authorization, and API security. Audit logs record actions taken on the platform. Review the [Audit Logs](../../audit-logs/audit-logs.md) guide to learn how to access and use them.

<br />

## Data At Rest Encryption

Tenant data is encrypted using a 64-bit cryptographically secure tenant key. A unique tenant key is generated for each tenant. The tenant key is encrypted using the system root key and is stored in the database. The system root key is stored in the cluster’s etcd key-value store. All message communication uses tenant-specific channels.

The following secure keys are unique and generated for each installation:

<br />

- **Root Key**: Encrypts the tenant-specific encryption key.

- **JSON Web Token (JWT) signature key**: Used to sign the JWT token.

- **Hash Salt**: Used to hash the user password and email ID.

- **Tenant key**: A 64-bit cryptographically secure tenant key encrypts tenant data stored in the management cluster, such as user account name, user email ID, and tenant cloud credentials.

In self-managed deployments, secure keys are generated during installation and stored as secrets in the management cluster’s etcd key-value store.

<br />

## Data In Transit Encryption

Palette secures data in motion using an encrypted Transport Layer Security (TLS) communication channel for all internal and external interactions.<br /><br />

- **End User Communication**: Public certificates are created using a cert-manager for external API/UI communication. In self-hosted deployments, you can import an optional certificate and private key to match the Fully Qualified Domain Name (FQDN) management cluster.

- **Inter-Service Communication**: Services in the management cluster communicate over HTTPS with self-signed certificates and an Rivest–Shamir–Adleman (RSA) 2048-bit key.

- **Database Communication**: The database connection between Palette internal services that are active in the management cluster and MongoDB is protected by TLS with Authentication enabled.

- **Message Bus**: A Secure Network Address Translation (NATS) message bus is used for asynchronous communication between Palette management clusters and tenant clusters. NATS messages are exchanged using TLS protocol, and each tenant cluster uses dedicated credentials to connect to the message bus. Authentication and authorization policies are enforced in the NATS deployment to ensure message and data isolation across tenants.
