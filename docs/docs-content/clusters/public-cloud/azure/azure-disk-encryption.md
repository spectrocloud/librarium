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

Palette supports disk encryption of your Azure Kubernetes cluster using Disk Encryption Sets with
[customer-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys).

By default, Azure encrypts all managed disks with
[platform-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#platform-managed-keys),
however, customer-managed keys enable you to have greater control over your key management.

You can use Disk Encryption Sets to encrypt your nodes' Operating System (OS) and data disks by including a preset
option in the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" />
pack.

## Limitations

- Azure Disk Encryption is available from [4.5.a](../../../release-notes/release-notes.md) onwards.

- Azure Disk Encryption is only supported on Azure IaaS clusters.

- Azure Disk Encryption is only supported when using the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack.

- If a key expires in your Key Vault, your cluster may experience operation failures. To resolve this, generate a new
  key in Key Vault and update your Disk Encryption Set to reference the new key.
  
  - No changes are needed in Palette, as the Palette eXtended Kubernetes pack configuration references the URI of
    your Disk Encryption Set, which remains unchanged.

  - We recommend enabling
    [**Auto key rotation**](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#automatic-key-rotation-of-customer-managed-keys)
    on your Disk Encryption Set so it can automatically use new key versions from your Key Vault.

- Changing the Disk Encryption Set URI (`diskEncryptionSetID`) in the Palette eXtended Kubernetes pack configuration in
  Palette will trigger a node repave.

## Prerequisites

- To create the Azure Key Vault and Disk Encryption Set, you will need an Azure user account with the **Contributor** or
  **Owner** role on the resource group or subscription.

- Create an
  [Azure Key Vault](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)
  with the following necessary configuration:

  - Resource access:

    - :white_check_mark: **Azure Virtual Machines for deployment**

  - Purge protection:
    - :white_check_mark: **Enable purge protection**

- Create a
  [Disk Encryption Set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set)
  with the encryption type as **Encryption at-rest with a customer-managed key**.

- In the Azure Key Vault, assign the following
  [access policies](https://learn.microsoft.com/en-us/azure/key-vault/general/assign-access-policy?tabs=azure-portal) to
  the Disk Encryption Set that you want to use:

  - Key Management Operations:

    - :white_check_mark: **Get**

  - Cryptographic Operations:

    - :white_check_mark: **Unwrap Key**
    - :white_check_mark: **Wrap Key**

  - If you have designated a user-assigned identity to the Disk Encryption Set, add the same access policies to the
    user-assigned identity in the Azure Key Vault.

## Enable Disk Encryption

### New Cluster Profile

Use the following steps to enable disk encryption on a
[new cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

4. Fill out the **Basic Information** and ensure **Type** is not set to **Add-on**. Click **Next**.

5. In **Cloud Type**, under **Infrastructure provider**, select **Azure IaaS**. Click **Next**.

6. Select your base OS pack and configure it to your liking. Select **Next layer** when complete.

7. Select the **Palette eXtended Kubernetes** pack as your base Kubernetes pack.

8. In **Configure Pack**, select **Values** in pack details, and click the **\</\>** button to show the YAML editor.

9. On the right-hand side, click the **Presets** drop-down menu, and select the **Enable Encryption Using
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

    2. In the search bar, look for **Disk Encryption Sets**. Click on the service when found.

    3. Find your Disk Encryption Set from the list and click on it to view details.

    4. On the **Overview** page, click **JSON View** in the **Essentials** section. The Resource ID for the Disk
       Encryption Set is displayed at the top.

    5. Click the **Copy to clipboard** icon for the Resource ID and paste it into the `diskEncryptionSetID` field in the
       Palette YAML editor.

    </details>

    ```yaml
    cloud:
      azure:
        diskEncryptionSetID: "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/diskEncryptionSets/<diskEncryptionSet>"
    ```

12. Make any other changes that you need and click **Next layer**.

13. Select the remaining profile layers to finish the configuration.

You can now [create a new Azure IaaS cluster](./create-azure-cluster.md) with disk encryption enabled using this cluster
profile.

### Existing Cluster Profile

#### Enable Disk Encryption on a Cluster Profile

Use the following steps to enable disk encryption on an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md).

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click the cluster profile that you want to edit.

4. Create a new version of your cluster profile:

   1. Click the version drop-down menu next to the cluster profile name, and click **Create new version**.
   2. Fill the **Version** field with a new version number.
   3. Click **Confirm**.

5. Select the Kubernetes layer to view the **Edit Pack** drawer.

   :::warning

   Ensure that you are using

   <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> as the Azure
   Disk Encryption option is only available to this pack.

   :::

6. In **Values**, click the **\</\>** button to show the YAML editor.

7. On the right-hand side, click the **Presets** drop-down menu, and select the **Enable Encryption Using
   Customer-Managed Key** option.

8. Scroll to the bottom of the YAML editor to view the additional configuration that was added.

   ```yaml
   cloud:
     azure:
       diskEncryptionSetID: ""
   ```

9. Fill in the `diskEncryptionSetID` with the Resource ID URI of your Disk Encryption Set.

   <!-- prettier-ignore -->
   <details>
   <summary> How to find the Resource ID URI of your Disk Encryption Set </summary>

   1. Log in to the [Azure Portal](https://portal.azure.com/).

   2. In the search bar, look for **Disk Encryption Sets**. Click on the service when found.

   3. Find your Disk Encryption Set from the list and click on it to view details.

   4. On the **Overview** page, click **JSON View** in the **Essentials** section. The Resource ID for the Disk
      Encryption Set is displayed at the top.
   5. Click the **Copy to clipboard** icon for the Resource ID and paste it into the `diskEncryptionSetID` field in the
      Palette YAML editor.

   </details>

   ```yaml
   cloud:
     azure:
       diskEncryptionSetID: "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/diskEncryptionSets/<diskEncryptionSet>"
   ```

10. Click **Confirm updates**.

11. Click **Save Changes**.

#### Enable Disk Encryption on an Active Cluster

Use the following steps to enable disk encryption on an active cluster using the
[updated cluster profile](#enable-disk-encryption-on-a-cluster-profile).

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. From the left **Main Menu**, select **Clusters**.

2. Find the cluster that you want to update and click on it.

3. Click the **Profile** tab.

4. Click the version drop-down menu in **Infrastructure Layers** and select the version that has disk encryption
   enabled.

5. Click **Review & Save**, then click **Review changes in Editor** in the Changes Summary box.

6. Review the changes and click **Update**.

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before
[validating the disk encryption enablement](#validate-after-enablement).

## Disable Disk Encryption

### Disable Disk Encryption on a Cluster Profile

Use the following steps to disable disk encryption on an
[existing cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md).

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Profiles** and click the cluster profile that you want to edit.

4. Create a new version of your cluster profile:

   1. Click the version drop-down menu next to the cluster profile name, and click **Create new version**.
   2. Fill the **Version** field with a new version number.
   3. Click **Confirm**.

5. Select the Kubernetes layer to view the **Edit Pack** drawer.

6. In **Values**, click the **\</\>** button to show the YAML editor.

7. On the right-hand side, click the **Presets** drop-down menu, and select the **Disable Encryption Using
   Customer-Managed Key** option.

8. Click **Confirm updates**.

9. Click **Save Changes**.

### Disable Disk Encryption on an Active Cluster

Use the following steps to disable disk encryption on an active cluster using the
[updated cluster profile](#disable-disk-encryption-on-a-cluster-profile).

:::warning

Performing these steps will cause a
[full cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

1. From the left **Main Menu**, select **Clusters**.

2. Find the cluster that you want to update and click on it.

3. Click the **Profile** tab.

4. Click the version drop-down menu in **Infrastructure Layers** and select the version that has disk encryption
   disabled.

5. Click **Review & Save**, then click **Review changes in Editor** in the Changes Summary box.

6. Review the changes and click **Update**.

Your cluster will now update and a full cluster repave will occur. Wait until the update has completed before
[validating the disk encryption disablement](#validate-after-disablement).

## Validate

### Validate after Enablement

Follow these steps to validate enablement of customer-managed key encryption on your Azure VM disks.

1. Log in to the [Azure Portal](https://portal.azure.com/).

2. In the search bar, look for **Disks**. Click on the service when found.

3. Find your cluster's disks by using the search filters provided. You can use the cluster name as the cluster resources
   contain the cluster name at the beginning (for example: `<clusterName>-e3c0-f7ljd_OSDisk`).

4. Once identified, click on a disk name to view its details.

5. Scroll down to view the **Properties** tab and check that the **Encryption** section shows **Customer-managed key**
   for **Encryption type**. Your Disk Encryption Set name is also shown for the **Encryption key**.

6. Repeat steps 4-5 for each disk in your cluster.

### Validate after Disablement

Follow these steps to validate disablement of customer-managed key encryption on your Azure VM disks.

1. Log in to the [Azure Portal](https://portal.azure.com/).

2. In the search bar, look for **Disks**. Click on the service when found.

3. Find your cluster's disks by using the search filters provided. You can use the cluster name as the cluster resources
   contain the cluster name at the beginning (for example: `<clusterName>-e3c0-f7ljd_OSDisk`).

4. Once identified, click on a disk name to view its details.

5. Scroll down to view the **Properties** tab and check that the **Encryption** section shows **Platform-managed key**
   for **Encryption type**.

6. Repeat steps 4-5 for each disk in your cluster.

## Resources

- [Encryption at host](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption?source=recommendations#encryption-at-host---end-to-end-encryption-for-your-vm-data)

- [Customer-managed keys](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption#customer-managed-keys)

- [Create an Azure Key Vault and disk encryption set](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-host-based-encryption-portal?tabs=azure-powershell#create-an-azure-key-vault-and-disk-encryption-set)

- [Azure Disk Encryption and auto-rotation](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/disk-encryption-key-vault?wt.mc_id=knwlserapi_inproduct_azportal&tabs=azure-portal#azure-disk-encryption-and-auto-rotation)
