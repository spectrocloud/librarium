---
title: 'Vault'
metaTitle: 'Vault Integration with Spectro Cloud'
metaDescription: 'Integration of the Vault add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['security']
logoUrl: 'https://raw.githubusercontent.com/docker-library/docs/fab4b16599d1424cee888d47af850e0ba07e6a37/vault/logo.svg?sanitize=true'
---

# Vault

[Vault](https://www.vaultproject.io/docs/platform/k8s/injector) is an [injector](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) for Kubernetes that makes the handling of *"[secrets](https://kubernetes.io/docs/concepts/configuration/secret/)"* easier.

## Overview

Vault helps secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API. This page aims to capture Vault integration support provided by Spectro Cloud.

### Supported use cases

* Injecting application secrets from an external Vault into pods (client-only)
* Provision and manage a Vault server in the Kubernetes cluster

## Setup

<Limitations>Only supported on K8s 1.17+</Limitations>
<Limitation>Only supported on AWS clusters / cluster profiles</Limitation>
<Constraints> ..... </Constraints>

### Notable Parameters

| code | function |
| --- | --- |
| `vault.ha` | Enable multiple replicas of the Vault control plane |
| `vault.unseal` | Automatically enable automatic unsealing support |
| `vault.namespace` | Namespaces to monitor |

## Usage

In Kubernetes clusters where the Vault injector is integrated, secrets can be injected into the application pods by adding the following annotations:

`vault.hashicorp.com/agent-inject-secret-<unique-name>: /path/to/secret`

More information on consuming Vault secrets available on the [Vault K8s injector](https://www.vaultproject.io/docs) docs page.

## Troubleshooting

Ensure Vault server integration is successfully running: kubectl -n vault-system logs vault-pod. 

Additional information on Vault integration: [Vault K8s Injector](https://www.vaultproject.io/docs/platform/k8s/injector).

Need help? Contact Spectro Cloud support.

## Changes

* Version 0.3.2 released with critical bug fix X
