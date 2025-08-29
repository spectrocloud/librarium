---
sidebar_label: "Register and Manage MAAS Cloud Accounts"
title: "Register and Manage MAAS Cloud Accounts"
description: "Learn how to register and manage your MAAS cloud accounts in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "maas"]
---

When you install the Private Cloud Gateway (PCG), a cloud account is auto-created in every project in Palette. You can
use this cloud account to create clusters at either the tenant or the project level. If desired, you can create
additional cloud accounts that reference specific PCGs.

## Prerequisites

- An installed PCG if you do not have a direct connection to the MAAS environment. Review
  [Deploy to MAAS](../../pcg/deploy-pcg/maas.md) for guidance.

  If are self-hosting Palette and have a direct connection to the MAAS environment, you can select **Use System Private
  Gateway**. To learn more about when you would use Palette's PCG or the System Private Gateway, refer to the
  [PCG Architecture](../../pcg/architecture.md#pcg-deployment-options) page.

- An active [MAAS API key](https://maas.io/docs/api) which can be generated in the MAAS web console under **My
  Preferences**, and selecting **API keys**.

For details, refer to the MAAS document on
[how to add an API key](https://canonical.com/maas/docs/how-to-enhance-maas-security#p-9102-manage-api-keys).

## Register a MAAS Cloud Account

Follow these steps to create additional MAAS cloud accounts.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main Menu** and select **Tenant Settings > Cloud Accounts**.

3. Locate **MAAS** on the **Cloud Accounts** page and click **Add MAAS Account**.

4. In the next window that displays, enter values for properties listed in the following table.

   In a self-hosted environment where Palette has direct network access to MAAS, you can register a MAAS cloud account
   without installing the PCG. Note the **Use System Private Gateway** setting listed in the table. refer to the System
   Private Gateway section in the [Architecture](architecture.md) page to learn more about System Private Gateway.

Refer to the Deploy with PCG and system PCG in the [Architecture](architecture.md) page to learn more about system PCG.

<br />

:::info

For the self-hosted Palette instance, MAAS is reachable on port 5240.

:::

<br />

| Property                     | Description                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Account Name                 | Custom name for the cloud name.                                                                                          |
| Use System Private Gateway   | This setting is for self-hosted environments that do not require a PCG. Toggle this option to bypass installing the PCG. |
| Select Private Cloud Gateway | Select your MAAS cloud gateway from the **drop-down Menu**.                                                              |
| API Endpoint                 | API endpoint of the gateway.                                                                                             |
| API Key                      | The MAAS API key.                                                                                                        |

5. Click **Confirm** to register your MAAS cloud account.

## Validate

You can validate your MAAS cloud account is registered by reviewing the **Cloud Accounts** page. Ensure your account is
listed under **MAAS**.

## Next Steps

Deploy a Kubernetes cluster to one of your MAAS accounts. Check out
[Create and Manage MAAS Cluster](create-manage-maas-clusters.md) for guidance.
