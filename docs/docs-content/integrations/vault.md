---
sidebar_label: 'Vault'
title: 'Vault'
description: 'Integration of the Vault add on into Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['security', 'amd64', 'arm64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/vault/blobs/sha256:1abda0173be1fd4ddfeccd2ff15089edd38a25e433ad7bb562a770d92992c7af?type=image/png'
tags: ['packs', 'vault', 'security']
---

[Vault](https://www.vaultproject.io/) helps secure, store, and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets, and other sensitive data using a UI, CLI, or HTTP API.

Vault integration has the following components:

* Vault server
* UI (optional).
* [Agent injector](https://www.vaultproject.io/docs/platform/k8s/injector/) (optional).

## Versions Supported

<Tabs queryString="versions">

<TabItem label="0.22.x" value="0.22.x">

### Prerequisites

- A Kubernetes cluster with Kubernetes version 1.22 or later.

### Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameters | Description | Default |
-------------|-------------|---------|
|`charts.server.ingress` | Enable ingress traffic to the Vault server. If you want to enable ingress traffic, make sure that `charts.server.serviceType` is set to `"ClusterIP"` or is left empty. | `false` |
|`charts.global.tlsDisable` | Disable TLS for end-to-end encrypted transport. | `true` |
|`charts.agent.enabled` | Enable vault agent injection to inject secrets into the pods. | `-` |
|`charts.server.ha` | Enable high-availability mode to protect against outages by running multiple Vault servers. For more information, refer to [Vault documentation](https://developer.hashicorp.com/vault/docs/internals/high-availability). |  `false` |
|`charts.server.dataStorage`| Controls the size, location, storage class of the persistent storage used by the Vault. | |

:::caution

When using Vault with the RKE2 distribution of Kubernetes in Palette Edge, you must explicitly specify a storage class for the Vault server. To specify a storage class, change the value of the field  `charts.vault.server.dataStorage.storageClass` in `values.yaml` for the Vault pack in your cluster profile from `null` to a storage class that meets your needs. Refer to [Kubernetes documentation on storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) for more details. 

:::

### Usage

HashiCorp provides many uses cases for Vault. For examples, refer to [HashiCorp Vault documentation](https://developer.hashicorp.com/vault/docs/use-cases). 


#### Initialize and Unseal Vault

If you did not configure Vault to automatically initialize in the cluster profile, you need to initialize the first root token and keys that can be used to unseal Vault.
You can do so by following these steps:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that has Vault installed to view its details page.

4. Download the cluster **kubeconfig** file. 

5. Set up your local kubectl environment to use the **kubeconfig** file you downloaded. Review the [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance. 

6. You need to get the Vault namespace and application name. Issue the following command to get the unique values.

    <br />

    ```shell
    VAULT_NAMESPACE=$(kubectl get pods --selector app.kubernetes.io/name=vault --all-namespaces --output jsonpath='{.items[0].metadata.namespace}') && \
    APP_NAME=$(echo "$VAULT_NAMESPACE" | sed 's/-ns$//')
    ```

7. Set up port forwarding by issuing the following command so you can access the Vault UI:

    ```
    kubectl port-forward $APP_NAME 8200:8200 --namespace $VAULT_NAMESPACE
    ```

8. Open your browser and access the [Vault UI](https://localhost:8200/ui. You will receive a warning due to using a self-signed certificate, but you can ignore this warning. Follow the prompts on the UI to initialize your root token.

:::tip

If you don't want to use the Vault UI, you can also initialize and unseal Vault using the Vault CLI or API. For more information, refer to [Vault documentation](https://developer.hashicorp.com/vault/docs/platform/k8s/helm/run#initialize-and-unseal-vault).  

:::

</TabItem>

<TabItem label="Deprecated" value="Deprecated">

:::caution

All versions of the manifest-based pack less than v0.22.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

</TabItem>

</Tabs>



## References

- [Vault Agent injector](https://www.vaultproject.io/docs/platform/k8s/injector/)


- [Injecting Vault Secrets Into Kubernetes Pods via a Sidecar - Blog](https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar/)


- [Vault Agent Injector Examples](https://www.vaultproject.io/docs/platform/k8s/injector/examples/)


- [Vault on Kubernetes Guide](https://www.vaultproject.io/docs/platform/k8s/helm/run)
