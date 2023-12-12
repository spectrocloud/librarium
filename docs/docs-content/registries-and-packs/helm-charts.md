---
sidebar_label: "Helm Registries"
title: "Helm Registries"
description: "Learn how to add your own Helm Registries to Palette"
hide_table_of_contents: false
sidebar_position: 60
---

A Helm Chart is a collection of pre-configured Kubernetes resources that define, install, and upgrade applications on a Kubernetes cluster. Additionally, Helm Chart repositories serve as centralized locations to store and share these packaged charts for streamlined deployment and management. 

You can utilize Helm Charts in your cluster profiles and specify your own Helm Chart repository or other third-party Helm repositories in Palette. 

:::info

You can add a private OCI based Helm Chart registry to Palette. For more information, refer to the [Add OCI Registry](./oci-registry/oci-registry.md) guide.

:::


## Synchronization Behavior

When you add a Helm Chart registry to Palette, you can choose whether to synchronize the Helm Chart registry metadata with Palette. The synchronization behavior depends on whether the Helm Chart registry is hosted on a server accessible from Palette's management plane. The metadata is downloaded from the Helm Chart registry and stored internally in Palette. 

If the Helm Chart registry is hosted on a server that will not be accessible from the Palette regularly, we recommend you do not enable synchronization. Palette will download the Helm Charts registry metadata and store it internally. This will allow you to use the Helm Charts in your cluster profiles even if the Helm Chart registry is inaccessible.

When synchronization is disabled, you must manually synchronize the Helm Chart registry with Palette when you want to update the Helm Charts in Palette. You can use the Helm Charts from the registry in your cluster profiles if the Helm Chart registry is inaccessible. Additionally, you will not be able to search for Helm Charts in during the cluster profile creation process, nor will you be able to view the details of the Helm Charts, such as the **values.yaml** file, version, and description. You must manually specify the Helm Chart name and version to use a Helm Chart as a pack layer.


:::info

To manually synchronize the Helm Chart registry with Palette, identify the row of the Helm Chart registry in the Helm Chart registry table and click the **three-dot Menu** button. Select **Synchronize** from the expanded menu.

:::

If the Helm Chart registry is hosted on a server that is accessible from Palette, we recommend you enable synchronization. Palette will continuously synchronize the Helm Chart registry and ensure it has the latest Helm Chart registry metadata. When synchronization is enabled, you can search for Helm Charts when creating a pack layer of the type Helm Chart in your cluster profiles. Additionally, you can view the metadata details of the Helm Charts, such as the **values.yaml** file, versions available, and the description.

The table below summarizes the synchronization behavior.

| **Synchronization** | **Behavior** | **Search Available** | **Metadata Displayed** |
| --- | --- | --- | --- |
| Enabled | Palette will continuously synchronize the list of available Helm Charts from the registry. Helm Charts from the registry are searchable during the cluster profile creation. Helm Chart details, including the **values.yaml** and available versions are displayed.  | ✅ | ✅ |
| Disabled | Palette will not synchronize the list of available Helm Charts from the registry post registration. During the initial registration of the Helm Chart registry, Palette will download the Helm Chart metadata from the registry and store it internally. Helm Charts from the registry will not be searchable during the cluster profile creation. You must specify the Helm Chart name and version to use a Helm Chart as a pack layer. | ❌  | ❌  |

### When to Disable Synchronization?

You should disable synchronization if the Helm Chart registry is hosted on a server that may not always be accessible from Palette's management plane. For example, if the Helm Chart registry is hosted on a server that is only accessible from a private network that only deployed clusters have access to, you should disable synchronization. Although Palette may not be able to synchronize the Helm Chart registry, your clusters will be able to download the Helm Charts from the Helm Chart registry.


:::caution

The clusters you deploy will always require network access to the Helm Chart registry to download the Helm Charts.

:::


## Add a Helm Chart Registry

Use the following steps to add a Helm Chart repository to Palette.

## Prerequisite

- The Helm Chart repository must use Helm version 3.7.0 or higher.

- Tenant administrator permissions are required to add a Helm Chart repository to Palette.

- Credentials are required to access a protected Helm Chart repository.

## Add a Registry

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator. 

2. From the left **Main Menu**, click on **Tenant Settings**.

3. From the **Tenant Settings Menu**, Select **Registries**.

4. Click on the **Helm Registries** tab.

5. Click **Add New Helm Registry**.

6. Fill out the following input fields. 

   | **Field** | **Description** |
   | --- | --- |
   | Name | The name of your Helm Chart registry. |
   | Endpoint | The URL of your Helm Chart registry. |
   | Synchronization| Choose whether to synchronize your Helm Chart registry with Palette. Enabling synchronization allows Palette to display Helm Charts during the cluster profile creation process when choosing a pack layer of Helm Chart. Disable synchronization if the Helm Chart registry is unreachable. Refer to the [Synchronization Behavior](#synchronization-behavior) section for more information. |
   | No Authentication | Toggle this option to the enabled state if your Helm Chart registry does not require authentication. Otherwise, credentials are required. |
   | Username | The username for your Helm Chart registry. |
   | Password | The password for your Helm Chart registry. |
   | Certificate | You can upload the 509 server X certificate to your Helm Chart registry. |
   | Insecure Skip TLS Verify | Skip server TLS certificate validation. Check this box if your Helm Chart registry uses a self-signed certificate or if the server certificate is not signed by a trusted CA. |


7. Click **Confirm**. If the credentials are valid and the Palette is able to connect to the Helm Chart registry, the registry is added to Palette. Otherwise, an error message is displayed. 

   :::tip

   If you are encountering issues with adding a Helm Chart registry, review the endpoint URL and ensure that it is accessible from the Palette. Verify the credentials and try again. Lastly, if the Helm Chart registry is hosted on a server using a self-signed certificate, upload the certificate to Palette and skip TLS verification.
   :::


You now have a Helm Chart registry added to Palette. You can use the Helm Charts from this registry in your cluster profiles when creating a pack layer of the type Helm Chart.


## Validate


To validate that the Helm Chart registry is added to Palette correctly, ensure you are able to complete the steps above. Additionally, you can use the following steps to validate that the Helm Chart registry is added to Palette correctly.

1. Log in to [Palette](https://console.spectrocloud.com).


2. From the left **Main Menu**, click on **Profiles**.


3. Click **Add Cluster Profile**.


4. Provide a name and select the type **Add-on**.


5. In the following screen, click **Add Helm Chart** and select either **public** or **private**. Select **public** if you added Helm Chart registry that does not require authentication. Select **private** if you added a Helm Chart registry that requires authentication. 

6. If you selected **public**, you can search for Helm Charts in the Helm Chart registry. If you selected **private**, you must specify the Helm Chart name and version to use a Helm Chart as a pack layer.
