---
sidebar_label: "Azure Disk Encryption"
title: "Azure Disk Encryption"
description:
  "How to enable disk encryption on your Azure IaaS cluster using Server-Side Encryption with customer-managed keys or
  Encryption at Host, independently or together"
icon: ""
hide_table_of_contents: false
tags: ["public cloud", "azure", "encryption", "security", "disk"]
sidebar_position: 12
---

Palette supports disk encryption for Azure IaaS clusters using Azure Disk Storage
[server-side encryption (SSE)](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption) and Azure
[encryption at host (EAH)](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data).
By default, Azure encrypts all SSE-managed disks with PMK
[platform-managed keys (PMK)](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#platform-managed-keys);
however, you can use
[customer-managed keys (CMK)](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys)
through
[Azure Disk Encryption Sets (DES)](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
instead of PMK, giving you greater control of your key-management.

<!-- prettier-ignore-start -->
SSE does not encrypt [temporary disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview#temporary-disk) or disk caches. To ensure end-to-end encryption, use EAH. SSE and EAH can be used independently or alongside one another. To leverage either or both encryption methods, you must use the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack.
<!-- prettier-ignore-end -->

The following table highlights use cases for each encryption method.

| **Feature**               | **Server Side Encryption (SSE)**                                                                                                                                                                                                                                                                                                                                                                         | **Encryption at Host (EAH)**                                                                                                                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Encryption Method**     | Encrypts your data stored on Azure-managed [OS](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview#os-disk) and [data disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview#data-disk). Does not encrypt [temporary disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview#temporary-disk) or disk caches. | - **EAH only** - Encrypts temporary disks but not disk cache. <br /> - **EAH + SSE** - Encrypts temporary disks and disk cache, as well as [managed disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview). |
| **Management Keys**       | Supports CMK via DES.                                                                                                                                                                                                                                                                                                                                                                                    | Uses PMK for temporary disks and disk cache. Can use DES for managed disks when used with SSE.                                                                                                                                               |
| **Special Requirements**  | -                                                                                                                                                                                                                                                                                                                                                                                                        | Requires VM SKUs that support `EncryptionAtHost` capability.                                                                                                                                                                                 |
| **Default Configuration** | Enabled by default with PMK. Can opt to provide CMK via DES in `AzureMachineTemplate`.                                                                                                                                                                                                                                                                                                                   | Disabled by default.                                                                                                                                                                                                                         |

## Limitations

:::warning

[Azure Disk Encryption for Virtual Machines and Virtual Machine Scale Sets](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/disk-encryption-overview)
is not supported for any Azure cluster.

:::

- SSE and EAH are not supported for AKS clusters.

- <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> must be used in
  the Kubernetes layer of your cluster profile to use SSE or EAH.

- If a key expires in [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview), your
  cluster may experience operation failures. To resolve this, generate a new key in Azure Key Vault and update your disk
  encryption set to reference the new key. We recommend enabling
  [auto key rotation](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#automatic-key-rotation-of-customer-managed-keys)
  on your disk encryption set so it can automatically use new key versions from Azure Key Vault.

  :::info

  No changes are needed in Palette when a new key is created, as the PXK pack references the Uniform Resource Identifier
  (URI) of your disk encryption set, which remains unchanged.

  :::

- (EAH only) Azure VMs compatible with EAH.

      <details>

  <summary>Azure CLI command to validate EAH VM compatibility</summary>

          Use the following command to validate which VMs are compatible with EAH. Replace `<region-code>` with the region you will deploy your cluster in.

          ```shell
          az vm list-skus --location <region-code> --all \
          --resource-type virtualMachines \
          --query "[?capabilities[?name=='EncryptionAtHostSupported' && value=='True']].{VMName:name, EncryptionAtHost:capabilities[?name=='EncryptionAtHostSupported'].value | [0]}" \
          --output table
          ```

          To limit your output to a specific [VM family type](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview), append `-grep --ignore-case <VM-family>` to the above command. Replace `<VM-family>` with the applicable family type.

      </details>

## New Cluster Profile

Take the following steps to create a cluster profile with SSE or EAH enabled.

### Prerequisites

- An Azure user account with the following roles to create the Azure Key Vault and disk encryption set with the
  necessary Azure Key Vault access policies. For more information, visit
  [Azure built-in roles for Key Vault data plane operations](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations).

  | **Task**                                                                                    | **Required Role**                        |
  | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
  | Create Azure Key Vault and key                                                              | Key Vault Contributor                    |
  | Create disk encryption set and assign Azure Key Vault key                                   | Key Vault Administrator                  |
  | Assign Azure Key Vault access policies (GET, WRAP KEY, UNWRAP KEY)                          | Key Vault Crypto Service Encryption User |
  | (Optional) Assign user-assigned managed identity to Azure Key Vault and disk encryption set | Managed Identity Operator                |

- An
  [Azure Key Vault](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)
  with the following configuration:

  - Resource access: **Azure Virtual Machines for deployment**
  - Purge protection: **Enable purge protection**

- A
  [disk encryption set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
  with the encryption type set to **Encryption at-rest with a customer-managed key**.

- [EAH](https://learn.microsoft.com/en-in/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell)
  enabled on Azure when using **Encryption at Host**.

- The Azure Key Vault must have the following
  [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal)
  assigned to the disk encryption set that you want to use:

  - Key Management Operations: **Get**
  - Cryptographic Operations: **Unwrap Key**, **Wrap Key**

  If you have designated a user-assigned managed identity to the disk encryption set, assign the same access policies to
  the user-assigned managed identity in the Azure Key Vault.

### Enable Disk Encryption

Use the following steps to enable disk encryption on a
[new cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Profiles**, then **Add Cluster Profile**.

4. Fill out the **Basic Information** for your cluster profile. Choose a cluster profile **Type** of **Full** or
   **Infrastructure**. Select **Next**.

5. Choose **Azure IaaS** for your **Infrastructure Provider** and select **Next**.

6. Choose your base OS pack and make any necessary modifications. Select **Next layer** when complete.

<!-- prettier-ignore-start -->

7. Select <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> as your
Kubernetes pack.

<!-- prettier-ignore-end -->

8. On the **Configure Pack** drawer, below **Pack Details**, select **Values**, and click the **\</\>** button to
   display the YAML editor. Make the appropriate modifications based on your encryption method.

<Tabs groupId="adding-encrypt">

<TabItem value="sse" label="SSE Only" default>

9.  On the right side of the editor, expand the **Presets** drop-down menu, and select **Enable Encryption Using
    Customer-Managed Key** to use CMK with SSE.

10. Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

11. Fill in the `diskEncryptionSetID` with the Resource ID URI of your disk encryption set.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

          <details>

          <summary> How to find the Resource ID URI of your disk encryption set </summary>

          1. Log in to the [Azure Portal](https://portal.azure.com/).

          2. Use the search bar to locate and select the **Disk Encryption Sets** resource.

          3. On the **Overview** page, in the **Essentials** section, select **JSON View** to display the Resource ID for the disk
            encryption set.

          4. Select the **Copy to clipboard** icon for the Resource ID and paste the ID into the `diskEncryptionSetID` field in the
            Palette YAML editor.

        </details>

12. Make any other necessary changes and select **Next**.

13. Add the remaining storage and networking layers to your cluster profile, making changes where necessary. If you
    selected **Full** for your cluster profile **Type**, you have the option to add add-on layers as well.

14. Select **Finish Configuration** to save your cluster profile. For more information on creating cluster profiles,
    refer to our
    [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
    guide.

</TabItem>

<TabItem value="both" label="SSE + EAH">

9.  On the right side of the editor, expand the **Presets** drop-down menu, and select **Enable Encryption Using
    Customer-Managed Key** to use CMK with SSE.

10. Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

11. Fill in the `diskEncryptionSetID` with the Resource ID URI of your Disk Encryption Set.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

          <details>

          <summary> How to find the Resource ID URI of your disk encryption set </summary>

          1. Log in to the [Azure Portal](https://portal.azure.com/).

          2. Use the search bar to locate and select the **Disk Encryption Sets** resource.

          3. On the **Overview** page, in the **Essentials** section, select **JSON View** to display the Resource ID for the disk
            encryption set.

          4. Select the **Copy to clipboard** icon for the Resource ID and paste the ID into the `diskEncryptionSetID` field in the
            Palette YAML editor.

        </details>

12. In the YAML editor, add a line after `diskEncryptionSetID` that has `encryptionAtHost: true` to enable EAH.

    ```yaml {4}
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
        encryptionAtHost: true
    ```

13. Make any other necessary changes and select **Next**.

14. Add the remaining storage and networking layers to your cluster profile, making changes where necessary. If you
    selected **Full** for your cluster profile **Type**, you have the option to add add-on layers as well.

15. Select **Finish Configuration** to save your cluster profile. For more information on creating cluster profiles,
    refer to our
    [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
    guide.

</TabItem>

<TabItem value="eah" label="EAH Only">

9. In the YAML editor, add `encryptionAtHost: true` at the bottom of the manifest to enable EAH.

   ```yaml
   cloud:
     azure:
       encryptionAtHost: true
   ```

10. Make any other necessary changes and select **Next**.

11. Add the remaining storage and networking layers to your cluster profile, making changes where necessary. If you
    selected **Full** for your cluster profile **Type**, you have the option to add add-on layers as well.

12. Select **Finish Configuration** to save your cluster profile. For more information on creating cluster profiles,
    refer to our
    [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
    guide.

</TabItem>

</Tabs>

You can now [create a new Azure IaaS cluster](./create-azure-cluster.md) with disk encryption enabled using this cluster
profile. Once the cluster is created, you can [validate disk encryption enablement](#validate-new-cluster-profile).

### Validate {#validate-new-cluster-profile}

Follow these steps to confirm that encryption is enabled on your Azure VM disks.

<PartialsComponent category="clusters" name="cluster-azure-disk-encrypt-validate" />

## Active Cluster

### Prerequisites

- An Azure user account with the following roles to create the Azure Key Vault and disk encryption set with the
  necessary Azure Key Vault access policies. For more information, visit
  [Azure built-in roles for Key Vault data plane operations](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations).

  | **Task**                                                                                    | **Required Role**                        |
  | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
  | Create Azure Key Vault and key                                                              | Key Vault Contributor                    |
  | Create disk encryption set and assign Azure Key Vault key                                   | Key Vault Administrator                  |
  | Assign Azure Key Vault access policies (GET, WRAP KEY, UNWRAP KEY)                          | Key Vault Crypto Service Encryption User |
  | (Optional) Assign user-assigned managed identity to Azure Key Vault and disk encryption set | Managed Identity Operator                |

- An
  [Azure Key Vault](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)
  with the following configuration:

  - Resource access: **Azure Virtual Machines for deployment**
  - Purge protection: **Enable purge protection**

- A
  [disk encryption set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
  with the encryption type set to **Encryption at-rest with a customer-managed key**.

- [EAH](https://learn.microsoft.com/en-in/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell)
  enabled on Azure when using **Encryption at Host**.

- The Azure Key Vault must have the following
  [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal)
  assigned to the disk encryption set that you want to use:

  - Key Management Operations: **Get**
  - Cryptographic Operations: **Unwrap Key**, **Wrap Key**

  If you have designated a user-assigned managed identity to the disk encryption set, assign the same access policies to
  the user-assigned managed identity in the Azure Key Vault.

### Enable Disk Encryption

Use the following steps to enable disk encryption on an active cluster by modifying an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md).

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main Menu, select **Profiles**. Locate and select the cluster profile to edit.

4. Expand the version drop-down menu next to the cluster profile name, and select **Create new version**.

5. Enter a new semantic **Version** for the cluster profile. Select **Confirm**.

6. Select the PXK layer to view the **Edit Pack** drawer.

7. On the **Edit Pack** drawer, below **Pack Details**, select **Values**, and click the **\</\>** button to display the
   YAML editor. Make the appropriate modifications based on your encryption method.

<Tabs groupId="adding-encrypt">

<TabItem value="sse" label="SSE Only" default>

8.  On the right side of the editor, expand the **Presets** drop-down menu, and select **Enable Encryption Using
    Customer-Managed Key** to use CMK with SSE.

9.  Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

10. Fill in the `diskEncryptionSetID` with the Resource ID URI of your disk encryption set.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

          <details>

          <summary> How to find the Resource ID URI of your disk encryption set </summary>

          1. Log in to the [Azure Portal](https://portal.azure.com/).

          2. Use the search bar to locate and select the **Disk Encryption Sets** resource.

          3. On the **Overview** page, in the **Essentials** section, select **JSON View** to display the Resource ID for the disk
            encryption set.

          4. Select the **Copy to clipboard** icon for the Resource ID and paste the ID into the `diskEncryptionSetID` field in the
            Palette YAML editor.

        </details>

11. Make any other necessary changes and select **Confirm updates > Save Changes**.

12. From the left main menu, select **Clusters**.

13. Locate and select the cluster you want to update.

14. On the **Profile** tab, expand the version drop-down menu, and under **Infrastructure Layers**, select the new
    version of your cluster profile that has disk encryption enabled.

15. **Review & Save** your changes, then select **Review changes in Editor**. If no additional changes are needed,
    **Update** your cluster.

</TabItem>

<TabItem value="both" label="SSE + EAH">

8.  On the right side of the editor, expand the **Presets** drop-down menu, and select **Enable Encryption Using
    Customer-Managed Key** to use CMK with SSE.

9.  Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

10. Fill in the `diskEncryptionSetID` with the Resource ID URI of your Disk Encryption Set.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

          <details>

          <summary> How to find the Resource ID URI of your disk encryption set </summary>

          1. Log in to the [Azure Portal](https://portal.azure.com/).

          2. Use the search bar to locate and select the **Disk Encryption Sets** resource.

          3. On the **Overview** page, in the **Essentials** section, select **JSON View** to display the Resource ID for the disk
            encryption set.

          4. Select the **Copy to clipboard** icon for the Resource ID and paste the ID into the `diskEncryptionSetID` field in the
            Palette YAML editor.

        </details>

11. In the YAML editor, add a line after `diskEncryptionSetID` that has `encryptionAtHost: true` to enable EAH.

    ```yaml {4}
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
        encryptionAtHost: true
    ```

12. Make any other necessary changes and select **Confirm updates > Save Changes**.

13. From the left main menu, select **Clusters**.

14. Locate and select the cluster you want to update.

15. On the **Profile** tab, expand the version drop-down menu, and under **Infrastructure Layers**, select the new
    version of your cluster profile that has disk encryption enabled.

16. **Review & Save** your changes, then select **Review changes in Editor**. If no additional changes are needed,
    **Update** your cluster.

</TabItem>

<TabItem value="eah" label="EAH Only">

8. In the YAML editor, add `encryptionAtHost: true` at the bottom of the manifest to enable EAH.

   ```yaml
   cloud:
     azure:
       encryptionAtHost: true
   ```

9. Make any other necessary changes and select **Confirm updates > Save Changes**.

10. From the left main menu, select **Clusters**.

11. Locate and select the cluster you want to update.

12. On the **Profile** tab, expand the version drop-down menu, and under **Infrastructure Layers**, select the new
    version of your cluster profile that has disk encryption enabled.

13. **Review & Save** your changes, then select **Review changes in Editor**. If no additional changes are needed,
    **Update** your cluster.

</TabItem>

</Tabs>

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before confirming
that disk encryption is enabled.

### Validate

Follow these steps to confirm that encryption is enabled on your Azure VM disks.

<PartialsComponent category="clusters" name="cluster-azure-disk-encrypt-validate" />

## Disable Disk Encryption on an Active Cluster

### Prerequisites

- An Azure user account with access to view disks in your resource group where the cluster resources are created (for
  example, **Reader** role).

### Disable Disk Encryption

Use the following steps to disable disk encryption on an active cluster by modifying an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md). The
process to disable disk encryption is the same regardless of the encryption method used.

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main Menu, select **Profiles**. Locate and select the cluster profile to edit.

4. Expand the version drop-down menu next to the cluster profile name, and select **Create new version**.

5. Fill the **Version** field with a new version number.

6. Click **Confirm**.

7. Select the Kubernetes layer to view the **Edit Pack** drawer.

8. In **Values**, click the **\</\>** button to show the YAML editor.

<Tabs groupId="adding-encrypt">

<TabItem value="sse" label="SSE Only" default>

9. On the right-hand side, click the **Presets drop-down Menu**, and select the **Disable Encryption Using
   Customer-Managed Key** option.

10. Click **Confirm updates**.

11. Click **Save Changes**.

12. From the left **Main Menu**, select **Clusters**.

13. Find the cluster that you want to update and click on it.

14. Click the **Profile** tab.

15. Click the version **drop-down Menu** in **Infrastructure Layers** and select the version that has disk encryption
    disabled.

16. Click **Review & Save**, then click **Review changes in Editor** in the Changes Summary box.

17. Review the changes and click **Update**.

</TabItem>

<TabItem value="both" label="SSE + EAH">

9.  On the right-hand side, click the **Presets drop-down Menu**, and select the **Disable Encryption Using
    Customer-Managed Key** option.

10. In the YAML editor change `encryptionAtHost: true` to encryptionAtHost: false`.

        ```yaml
        cloud:
          azure:
            encryptionAtHost: false
        ```

11. Click **Confirm updates**.

12. Click **Save Changes**.

13. From the left **Main Menu**, select **Clusters**.

14. Find the cluster that you want to update and click on it.

15. Click the **Profile** tab.

16. Click the version **drop-down Menu** in **Infrastructure Layers** and select the version that has disk encryption
    disabled.

17. Click **Review & Save**, then click **Review changes in Editor** in the Changes Summary box.

18. Review the changes and click **Update**.

</TabItem>

<TabItem value="eah" label="EAH Only">

9. In the YAML editor change `encryptionAtHost: true` to encryptionAtHost: false`.

10. Click **Confirm updates**.

11. Click **Save Changes**.

12. From the left **Main Menu**, select **Clusters**.

13. Locate and select the cluster you want to update.

14. On the **Profile** tab, expand the version drop-down menu, and under **Infrastructure Layers**, select the new
    version of your cluster profile that has disk encryption enabled.

15. **Review & Save** your changes, then select **Review changes in Editor**. If no additional changes are needed,
    **Update** your cluster.

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before confirming
that disk encryption is disabled.

### Validate

Follow these steps to validate the disablement of customer-managed key encryption on your Azure VM disks.

<PartialsComponent category="clusters" name="cluster-azure-disk-encrypt-validate" />

## Resources

- [Encryption at host](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption?source=recommendations#encryption-at-host---end-to-end-encryption-for-your-vm-data)

- [Customer-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys)

- [Create an Azure Key Vault and disk encryption set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell#create-an-azure-key-vault-and-disk-encryption-set)

- [Azure Disk Encryption and auto-rotation](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/disk-encryption-key-vault?wt.mc_id=knwlserapi_inproduct_azportal&tabs=azure-portal#azure-disk-encryption-and-auto-rotation)
<!-- prettier-ignore-end -->
