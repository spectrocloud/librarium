---
title: 'Vault'
metaTitle: 'Vault Integration with Spectro Cloud'
metaDescription: 'Integration of the Vault add on into Spectro Cloud'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['security', 'amd64', 'arm64']
logoUrl: 'https://registry.spectrocloud.com/v1/vault/blobs/sha256:1abda0173be1fd4ddfeccd2ff15089edd38a25e433ad7bb562a770d92992c7af?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Vault

[Vault](https://www.vaultproject.io/) helps secure, store, and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets, and other sensitive data using a UI, CLI, or HTTP API.

## Versions Supported

<Tabs>

<Tabs.TabPane tab="0.22.x" key="0.22.x">

* **0.22.0**

</Tabs.TabPane>

<Tabs.TabPane tab="0.20.x" key="0.20.x">

* **0.20.1**

</Tabs.TabPane>
<Tabs.TabPane tab="0.11.x" key="0.11.x">

* **0.11.0**

</Tabs.TabPane>

<Tabs.TabPane tab="0.9.x" key="0.9.x">

  * **0.9.0**

</Tabs.TabPane>


<Tabs.TabPane tab="0.6.x" key="0.6.x">

* **0.6.0**

</Tabs.TabPane>

<Tabs.TabPane tab="0.3.x" key="0.3.x">

* **0.3.1**

</Tabs.TabPane>
</Tabs>


## Components

Vault integration has the following components:

* Vault server.
* UI (Optional).
* [Agent injector](https://www.vaultproject.io/docs/platform/k8s/injector/) (Optional).



## Supported Use cases

1. Running a Vault Service:
    * Vault is set up to run in **Dev mode** by default and so, Vault will be unsealed and initialized.
    * For production use cases, we recommend disabling Dev mode and enable HA.
    * Also, see [Production Checklist](https://www.vaultproject.io/docs/platform/k8s/helm/run#architecture) recommendations.
1. Injecting application secrets from an external Vault into pods (**Agent Injector**).
    * For running agent injector alone in the cluster, use v0.6.0 of Vault pack.
    * Make sure to set `injector.externalVaultAddr` to point to the external Vault server.

## How secrets are injected in deployments?

In Kubernetes clusters with Vault integrated, secrets can be injected into the application pods by adding the following annotations:

```yaml
vault.hashicorp.com/agent-inject: "true"
vault.hashicorp.com/agent-inject-secret-<unique_name>: /path/to/secret
vault.hashicorp.com/role: "<role using which the secret can be fetced>"
```

More information on consuming Vault secrets can be found in [Vault docs](https://www.vaultproject.io/docs/platform/k8s/injector)

# Ingress

Follow below steps to configure Ingress on Vault Server

1. Make sure serviceType is not set for Vault Server. That way, serviceType will default to ClusterIP
   * Version 0.6.0 - line #289
   * Version 0.3.1 - line #96
2. Ingress
   * Enable Ingress ; Change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts etc.
   * Version 0.6.0 - line #146
   * Version 0.3.1 - line #96

With these config changes, you can access Vault service on the Ingress Controller LoadBalancer hostname / IP

## References

* [Vault Agent injector](https://www.vaultproject.io/docs/platform/k8s/injector/).
* Injecting Vault Secrets Into Kubernetes Pods via a Sidecar - [Blog](https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar/).
* Vault Agent injector - [Examples](https://www.vaultproject.io/docs/platform/k8s/injector/examples/).
* https://www.vaultproject.io/docs/platform/k8s/helm/run
