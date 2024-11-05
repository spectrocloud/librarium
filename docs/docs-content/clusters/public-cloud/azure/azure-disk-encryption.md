---
sidebar_label: "Azure Disk Encryption"
title: "Azure Disk Encryption"
description:
  "How to enable disk encryption on your Azure IaaS cluster using Disk Encryption Sets with customer-managed keys"
icon: ""
hide_table_of_contents: false
tags: ["public cloud", "azure", "encryption", "security"]
sidebar_position: 12
---

Palette supports disk encryption of your Azure Kubernetes cluster using
[Disk Encryption Sets with customer-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys).

By default, Azure encrypts all managed disks with
[platform-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#platform-managed-keys),
however, customer-managed keys enable you to have greater control over your key management.

<!-- prettier-ignore -->
You can use Disk Encryption Sets to encrypt your nodes' Operating System and data disks by selecting a preset in the <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack.

## Limitations

- Azure Disk Encryption is only supported on Azure IaaS clusters.

<!-- prettier-ignore -->
- Azure Disk Encryption is only supported when using the <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack.

- If a key expires in your Key Vault, your cluster may experience operation failures. To resolve this, generate a new
  key in Key Vault and update your Disk Encryption Set to reference the new key.

  - No changes are needed in Palette, as the Palette eXtended Kubernetes pack configuration references the URI of your
    Disk Encryption Set, which remains unchanged.

  <!-- prettier-ignore -->
  - We recommend enabling
    [**Auto key rotation**](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#automatic-key-rotation-of-customer-managed-keys)
    on your Disk Encryption Set so it can automatically use new key versions from your Key Vault.

- Changing the Disk Encryption Set URI in the Palette eXtended Kubernetes pack configuration in
  Palette will trigger a node repave.

## New Cluster Profile

### Prerequisites {#prerequisites-new-cluster-profile}

- An Azure user account with the following roles to create the Azure Key Vault and Disk Encryption Set with the
  necessary Key Vault access policies.

  | Task                                                                          | Required Role                            |
  | ----------------------------------------------------------------------------- | ---------------------------------------- |
  | Create Key Vault and Key                                                      | Key Vault Contributor                    |
  | Create Disk Encryption Set & Assign Key Vault Key                             | Key Vault Administrator                  |
  | Assign Key Vault Access Policies (GET, WRAP KEY, UNWRAP KEY)                  | Key Vault Crypto Service Encryption User |
  | (Optional) Assign User-Assigned Identity to Key Vault and Disk Encryption Set | Managed Identity Operator                |

  For more information, visit
  [Azure built-in roles for Key Vault data plane operations](https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations).

<!-- prettier-ignore -->
- An [Azure Key Vault](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)
  with the following configuration:

  - Resource access: **Azure Virtual Machines for deployment**
  - Purge protection: **Enable purge protection**

<!-- prettier-ignore -->
- A [Disk Encryption Set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
  with the encryption type set to **Encryption at-rest with a customer-managed key**.

<!-- prettier-ignore -->
- The Azure Key Vault must have the following [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal) assigned to
  the Disk Encryption Set that you want to use:

  - Key Management Operations: **Get**
  - Cryptographic Operations: **Unwrap Key**, **Wrap Key**

  If you have designated a user-assigned identity to the Disk Encryption Set, assign the same access policies to the user-assigned identity in the Azure Key Vault.

### Enable Disk Encryption {#enable-disk-encryption-new-cluster-profile}

Use the following steps to enable disk encryption on a
[new cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

4. Fill out the **Basic Information** and ensure **Type** is not set to **Add-on**. Click **Next**.

5. In **Cloud Type**, under **Infrastructure provider**, select **Azure IaaS**. Click **Next**.

6. Select your base OS pack and configure it to your liking. Select **Next layer** when complete.

7. Select the **Palette eXtended Kubernetes** pack as your Kubernetes pack.

8. In **Configure Pack**, select **Values** in pack details, and click the **\</\>** button to show the YAML editor.

9. On the right-hand side, click the **Presets drop-down Menu**, and select the **Enable Encryption Using
   Customer-Managed Key** option.

10. Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

11. Fill in the `diskEncryptionSetID` with the Resource ID URI of your Disk Encryption Set.

    <!-- prettier-ignore -->
    <details>
    <summary> How to find the Resource ID URI of your Disk Encryption Set </summary>

    1. Log in to the [Azure Portal](https://portal.azure.com/).

    2. Click on the search bar, and enter **Disk Encryption Sets**. Click on the service when found.

    3. Find your Disk Encryption Set from the list and click on it to view details.

    4. On the **Overview** page, click **JSON View** in the **Essentials** section. The Resource ID for the Disk
       Encryption Set is displayed at the top.

    5. Click the **Copy to clipboard** icon for the Resource ID and paste it into the `diskEncryptionSetID` field in the
       Palette YAML editor.

    </details>

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

12. Make any other changes that you need and click **Next layer**.

13. Select the remaining profile layers to finish the configuration.

You can now [create a new Azure IaaS cluster](./create-azure-cluster.md) with disk encryption enabled using this cluster
profile. Once the cluster is created, you can [validate disk encrypytion enablement](#validate-new-cluster-profile).

### Validate {#validate-new-cluster-profile}

Follow these steps to validate the enablement of customer-managed key encryption on your Azure VM disks.

1. Log in to the [Azure Portal](https://portal.azure.com/).

2. In the search bar, look for **Disks**. Click on the service when found.

3. Find your cluster's disks by using the search filters provided. You can use the cluster name as the cluster resources
   contain the cluster name at the beginning, for example: `<clusterName>-e3c0-f7ljd_OSDisk`.

4. Once identified, click on a disk name to view its details.

5. Scroll down to view the **Properties** tab and check that the **Encryption** section shows **Customer-managed key**
   for **Encryption type**. Your Disk Encryption Set name is also shown for the **Encryption key**.

6. Repeat steps 4 and 5 for each disk in your cluster.

## Active Cluster

### Prerequisites {#prerequisites-active-cluster}

- An Azure user account with the following roles to create the Azure Key Vault and Disk Encryption Set with the
  necessary Key Vault access policies.

  | Task                                                                          | Required Role                            |
  | ----------------------------------------------------------------------------- | ---------------------------------------- |
  | Create Key Vault and Key                                                      | Key Vault Contributor                    |
  | Create Disk Encryption Set & Assign Key Vault Key                             | Key Vault Administrator                  |
  | Assign Key Vault Access Policies (GET, WRAP KEY, UNWRAP KEY)                  | Key Vault Crypto Service Encryption User |
  | (Optional) Assign User-Assigned Identity to Key Vault and Disk Encryption Set | Managed Identity Operator                |

<!-- prettier-ignore -->
- An [Azure Key Vault](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)
  with the following configuration:

  - Resource access: **Azure Virtual Machines for deployment**
  - Purge protection: **Enable purge protection**

<!-- prettier-ignore -->
- A [Disk Encryption Set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
  with the encryption type set to **Encryption at-rest with a customer-managed key**.

<!-- prettier-ignore -->
- The Azure Key Vault must have the following [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal) assigned to
  the Disk Encryption Set that you want to use:

  - Key Management Operations: **Get**
  - Cryptographic Operations: **Unwrap Key**, **Wrap Key**

  If you have designated a user-assigned identity to the Disk Encryption Set, assign the same access policies to the user-assigned identity in the Azure Key Vault.

### Enable Disk Encryption {#enable-disk-encryption-active-cluster}

Use the following steps to enable disk encryption on an active cluster by modifying an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md).

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click the cluster profile that you want to edit.

4. Create a new version of your cluster profile. Click the version **drop-down Menu** next to the cluster profile name,
   and click **Create new version**.

5. Fill the **Version** field with a new version number.

6. Click **Confirm**.

7. Select the Kubernetes layer to view the **Edit Pack** drawer.

8. In **Values**, click the **\</\>** button to show the YAML editor.

9. On the right-hand side, click the **Presets drop-down Menu**, and select the **Enable Encryption Using
   Customer-Managed Key** option.

10. Scroll to the bottom of the YAML editor to view the additional configuration that was added.

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: ""
    ```

11. Fill in the `diskEncryptionSetID` with the Resource ID URI of your Disk Encryption Set.

    <!-- prettier-ignore -->
    <details>
    <summary> How to find the Resource ID URI of your Disk Encryption Set </summary>

    1. Log in to the [Azure Portal](https://portal.azure.com/).

    2. Click on the search bar, and enter **Disk Encryption Sets**. Click on the service when found.

    3. Find your Disk Encryption Set from the list and click on it to view details.

    4. On the **Overview** page, click **JSON View** in the **Essentials** section. The Resource ID for the Disk
       Encryption Set is displayed at the top.

    5. Click the **Copy to clipboard** icon for the Resource ID and paste it into the `diskEncryptionSetID` field in the
       Palette YAML editor.

    </details>

    ```yaml title="Example"
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Compute/diskEncryptionSets/diskEncryptionSet"
    ```

12. Click **Confirm updates**.

13. Click **Save Changes**.

14. From the left **Main Menu**, select **Clusters**.

15. Find the cluster that you want to update and click on it.

16. Click the **Profile** tab.

17. Click the version **drop-down Menu** in **Infrastructure Layers** and select the version that has disk encryption
    enabled.

18. Click **Review & Save**, then click **Review changes in Editor** in the Changes Summary box.

19. Review the changes and click **Update**.

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before
[validating the disk encryption enablement](#validate-active-cluster).

### Validate {#validate-active-cluster}

Follow these steps to validate the enablement of customer-managed key encryption on your Azure VM disks.

1. Log in to the [Azure Portal](https://portal.azure.com/).

2. In the search bar, look for **Disks**. Click on the service when found.

3. Find your cluster's disks by using the search filters provided. You can use the cluster name as the cluster resources
   contain the cluster name at the beginning, for example: `<clusterName>-e3c0-f7ljd_OSDisk`.

4. Once identified, click on a disk name to view its details.

5. Scroll down to view the **Properties** tab and check that the **Encryption** section shows **Customer-managed key**
   for **Encryption type**. Your Disk Encryption Set name is also shown for the **Encryption key**.

6. Repeat steps 4 and 5 for each disk in your cluster.

## Disable Disk Encryption on an Active Cluster

### Prerequisites

- An Azure user account with access to view disks in your resource group where the cluster resources are created, for
  example, **Reader** role.

### Disable Disk Encryption

Use the following steps to disable disk encryption on an active cluster by modifying an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md).

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click the cluster profile that you want to edit.

4. Create a new version of your cluster profile. Click the version **drop-down Menu** next to the cluster profile name,
   and click **Create new version**.

5. Fill the **Version** field with a new version number.

6. Click **Confirm**.

7. Select the Kubernetes layer to view the **Edit Pack** drawer.

8. In **Values**, click the **\</\>** button to show the YAML editor.

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

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before
[validating the disk encryption disablement](#validate).

### Validate

Follow these steps to validate the disablement of customer-managed key encryption on your Azure VM disks.

1. Log in to the [Azure Portal](https://portal.azure.com/).

2. In the search bar, look for **Disks**. Click on the service when found.

3. Find your cluster's disks by using the search filters provided. You can use the cluster name as the cluster resources
   contain the cluster name at the beginning, for example: `<clusterName>-e3c0-f7ljd_OSDisk`.

4. Once identified, click on a disk name to view its details.

5. Scroll down to view the **Properties** tab and check that the **Encryption** section shows **Platform-managed key**
   for **Encryption type**.

6. Repeat steps 4 and 5 for each disk in your cluster.

## Resources

- [Encryption at host](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption?source=recommendations#encryption-at-host---end-to-end-encryption-for-your-vm-data)

- [Customer-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys)

- [Create an Azure Key Vault and disk encryption set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell#create-an-azure-key-vault-and-disk-encryption-set)

- [Azure Disk Encryption and auto-rotation](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/disk-encryption-key-vault?wt.mc_id=knwlserapi_inproduct_azportal&tabs=azure-portal#azure-disk-encryption-and-auto-rotation)
