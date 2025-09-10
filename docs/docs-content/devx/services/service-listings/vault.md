---
sidebar_label: "Vault"
title: "Vault"
description: "Learn how to use Vault with Palette Dev Engine."
hide_table_of_contents: false
type: "appTier"
category: ["security"]
hiddenFromNav: false
sidebar_position: 40
logoUrl: "/assets/icons/lock.svg"
---

## Vault

Palette Dev Engine (PDE) users can deploy Vault onto their virtual cluster using the out-of-the-box Vault offering.
Vault deployed through PDE is using Banzai Cloud Bank-Vaults. Bank-Vaults is a wrapper for the official
[Vault](https://www.vaultproject.io/) client. Vault is a tool that helps you securely manage and protect sensitive
information, like passwords, API keys, and encryption keys. The Bank-Vaults client enhances the official Vault client by
adding automatic token renewal, built-in Kubernetes support, and a dynamic database credential provider.

Vault keeps these secrets safe by locking them in a virtual "vault" and only allows authorized users to access them.
Vault also tracks who has accessed which secrets and when, making it easier to maintain security. You can use Vault to
govern access to secrets, automate application delivery, and consume secrets programmatically.

Vault is deployed behind the scenes through the use of the
[Bank-Vaults Vault Operator Helm Chart](https://github.com/bank-vaults/bank-vaults).

<br />

:::info

Vault is deployed as a single container in the virtual cluster, and the container is not tied to any particular node.

:::

## Deploy Vault

Use the following steps to learn how to deploy Vault to your virtual cluster.

### Prerequisites

- A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

- A Virtual Cluster with at least the following minimum resources.

  - 4 CPU
  - 6 GB Memory
  - 6 GB Storage

- Kubernetes 1.6.x or greater.

<br />

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the **User Menu** at top right, and select **Switch to App Mode**.

3. Navigate to the left **Main Menu** and click on **App Profiles** to create a new
   [app profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md). Provide the following basic
   information and click **Next**.

| Parameter                | Description                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Application Profile Name | A custom name for the app profile.                                                                                   |
| Version (optional)       | The default value is 1.0.0. You can create multiple versions of an app profile using the format `major.minor.patch`. |
| Description (optional)   | Description of the app profile.                                                                                      |
| Tag (optional)           | Assign tags to the app profile.                                                                                      |

4. Select the **Vault** service and start the configuration.

5. Provide the following information to the wizard:

- **Name:** The application name.
- **PersistentVolumeClaim Size (GiB):** Select the volume as per the storage volume available in the cluster group and
  virtual clusters. Ensure you do not exceed the maximum storage size for your virtual cluster.

6. Save your changes.

7. Deploy the app profile to a Palette Virtual Cluster. Use the
   [Deploy a Virtual Cluster](../../../clusters/palette-virtual-clusters/deploy-virtual-cluster.md) guide for additional
   guidance or check out the [Deploy an Application using Palette Dev Engine](../../../tutorials/pde/deploy-app.md)
   tutorial.

### Validate

You can validate the Vault instance deployed successfully by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Apps**.

3. Select your application that contains Vault to view its details page.

4. Ensure the **Status** is **Deployed** and that the **Vault** service has a green dot next to it.

5. Next, click on the **Virtual Cluster** link in the App details page.

6. Click the URL to download the **kubeconfig**.

7. Set up your local kubectl environment to use the **kubeconfig** file you downloaded. Review the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

8. Export the following environment variables to prepare your environment to interact with Vault.

   <br />

   ```shell
   export VAULT_ADDR=https://127.0.0.1:8200
   ```

   <br />

   ```shell
   export VAULT_SKIP_VERIFY=true
   ```

9. Configure port forwarding between your local workstation and the pod hosting Vault. Use the following commands to
   configure the port forward.

   <br />

   ```shell
   VAULT_NAMESPACE=$(kubectl get pods --selector app.kubernetes.io/name=vault --all-namespaces --output jsonpath='{.items[0].metadata.namespace}') && \
   kubectl port-forward $(kubectl get pods --selector app.kubernetes.io/name=vault --all-namespaces --output jsonpath='{.items[0].metadata.name}') 8200:8200 --namespace $VAULT_NAMESPACE
   ```

   <br />

   ```shell
   kubectl port-forward $(kubectl get pods --selector app.kubernetes.io/name=vault --all-namespaces --output jsonpath='{.items[0].metadata.name}') 8200:8200 --namespace $VAULT_NAMESPACE
   ```

10. Open your browser and visit `https://localhost:8200/ui` to access the Vault UI. You will receive a warning due to
    the usage of a self-signed certificate but you can ignore this warning.

To acquire the Vault root token, review the [Vault Credentials](#vault-credentials) section.

## Output Variables

The exposed output variables. Use these variables when connecting higher-level services with Vault:

| Parameter        | Output Variable                                                              | Description                                                 |
| ---------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Vault Root Token | `{{.spectro.app.$appDeploymentName.<service-name>.VAULT_ROOT_TOKEN}}`        | The root token of the Vault instance.                       |
| Service Hostname | `{{.spectro.app.$appDeploymentName.<service-name>.VAULTMSTR_SVC}}`           | The Kubernetes service hostname for the Vault service.      |
| Service Port     | `{{.spectro.app.$appDeploymentName.<service-name>.VAULTMSTR_SVC_PORT}}`      | The exposed port for the Vault service.                     |
| Namespace        | `{{.spectro.app.$appDeploymentName.<service-name>.VAULTMSTR_SVC_NAMESPACE}}` | The Kubernetes namespace the Vault instance is deployed to. |

## Vault Credentials

The Vault root token and the unseal keys are stored as a Kubernetes secret inside the virtual cluster. You can retrieve
the Vault root token by following these steps. <br /> <br />

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that has Vault installed to view its details page.

4. Download the cluster **kubeconfig** file.

5. Set up your local kubectl environment to use the **kubeconfig** file you downloaded. Review the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

6. You need to get the Vault namespace and application name. Issue the following command to get the unique values.

   <br />

   ```shell
   VAULT_NAMESPACE=$(kubectl get pods --selector app.kubernetes.io/name=vault --all-namespaces --output jsonpath='{.items[0].metadata.namespace}') && \
   APP_NAME=$(echo "$VAULT_NAMESPACE" | sed 's/-ns$//')
   ```

7. Next, issue the command below to retrieve the Vault root token.

   <br />

   ```shell
   kubectl get secret $APP_NAME-unseal-keys --output jsonpath='{.data.vault-root}' --namespace $VAULT_NAMESPACE | base64 --decode
   ```

8. To acquire all five unseal keys, use the following command.

   <br />

   ```shell
   kubectl get secret $APP_NAME-unseal-keys --namespace $VAULT_NAMESPACE --output  json \
   | jq -r '.data | to_entries | .[] | select(.key | startswith("vault-unseal-")) | .value | @base64d + "\n"'
   ```

## Next Steps

You can add Vault to your application profile and start integrating Vault with your applications. To learn more about
integrating Vault with your applications, check out the
[Vault App Integrations](https://developer.hashicorp.com/vault/tutorials/app-integration) tutorials from HashiCorp.

## Resources

- [Vault Documentation](https://developer.hashicorp.com/vault/docs)

- [HashiCorp Vault Tutorial](https://developer.hashicorp.com/vault/tutorials)

- [Bank-Vaults Vault Operator Helm Chart](https://github.com/bank-vaults/vault-helm-chart)
