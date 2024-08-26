---
sidebar_label: "Vault"
title: "Vault"
description: "Integration of the Vault add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/vault/blobs/sha256:1abda0173be1fd4ddfeccd2ff15089edd38a25e433ad7bb562a770d92992c7af?type=image.webp"
tags: ["packs", "vault", "security"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="0.27.x" value="0.27.x">

HashiCorp provides documentation for many uses cases for Vault. For examples, refer to
[HashiCorp Vault documentation](https://developer.hashicorp.com/vault/docs/use-cases).

#### Initialize and Unseal Vault

If you enabled dev server mode, you do not need to initialize Vault and it is already unsealed. Use the root token you
configured in the `values.yaml` file to sign in to Vault directly.

Before any operation can be performed on Vault, you need to initialize the first root token and keys that can be used to
unseal Vault. You can do so by following these steps:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that has Vault installed to view its details page.

4. Download the cluster **kubeconfig** file.

5. Set up your local kubectl environment to use the **kubeconfig** file you downloaded. Review the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

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

8. Open your browser and access the Vault UI at `https://localhost:8200/ui`. You will receive a warning due to using a
   self-signed certificate, but you can ignore this warning. Follow the prompts on the UI to initialize your root token.

:::tip

If you do not want to use the Vault UI, you can also initialize and unseal Vault using the Vault CLI or API. For more
information, refer to
[Vault documentation](https://developer.hashicorp.com/vault/docs/platform/k8s/helm/run#initialize-and-unseal-vault).

:::

#### Storage

In a production Vault server, backend storage is on a data persistent layer, is untrusted and only stores encrypted
data. In a dev mode Vault server, all data is stored in-memory and will be erased when Vault restarts.

##### RKE2

When using Vault with the RKE2 distribution of Kubernetes in Palette Edge, you must explicitly specify a storage class
for the Vault server. To specify a storage class, change the value of the field
`charts.vault.server.dataStorage.storageClass` in `values.yaml` for the Vault pack in your cluster profile from `null`
to a storage class that meets your needs. Refer to
[Kubernetes documentation on storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) for more
details.

</TabItem>

<TabItem label="0.22.x" value="0.22.x">

HashiCorp provides documentation for many uses cases for Vault. For examples, refer to
[HashiCorp Vault documentation](https://developer.hashicorp.com/vault/docs/use-cases).

#### Initialize and Unseal Vault

If you enabled dev server mode, you do not need to initialize Vault and it is already unsealed. Use the root token you
configured in the `values.yaml` file to sign in to Vault directly.

Before any operation can be performed on Vault, you need to initialize the first root token and keys that can be used to
unseal Vault. You can do so by following these steps:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that has Vault installed to view its details page.

4. Download the cluster **kubeconfig** file.

5. Set up your local kubectl environment to use the **kubeconfig** file you downloaded. Review the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

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

8. Open your browser and access the Vault UI at `https://localhost:8200/ui`. You will receive a warning due to using a
   self-signed certificate, but you can ignore this warning. Follow the prompts on the UI to initialize your root token.

:::tip

If you do not want to use the Vault UI, you can also initialize and unseal Vault using the Vault CLI or API. For more
information, refer to
[Vault documentation](https://developer.hashicorp.com/vault/docs/platform/k8s/helm/run#initialize-and-unseal-vault).

:::

#### Storage

In a production Vault server, backend storage is on a data persistent layer, is untrusted and only stores encrypted
data. In a dev mode Vault server, all data is stored in-memory and will be erased when Vault restarts.

##### RKE2

When using Vault with the RKE2 distribution of Kubernetes in Palette Edge, you must explicitly specify a storage class
for the Vault server. To specify a storage class, change the value of the field
`charts.vault.server.dataStorage.storageClass` in `values.yaml` for the Vault pack in your cluster profile from `null`
to a storage class that meets your needs. Refer to
[Kubernetes documentation on storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) for more
details.

</TabItem>

</Tabs>

### Terraform

Use the following Terraform code snippet to reference the Vault pack.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "pack-info" {
  name         = "vault"
  version      = "0.27.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
