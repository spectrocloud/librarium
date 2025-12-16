---
sidebar_label: "Add CloudStack Accounts"
title: "Add CloudStack Accounts to Palette"
description: "Learn how to register and manage your CloudStack accounts in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "cloudstack"]
---

:::preview

:::

You can register Apache CloudStack accounts in Palette to create and manage Kubernetes clusters in your CloudStack
environment.

## Prerequisites

- An installed [Private Cloud Gateway (PCG)](../../pcg/pcg.md) that connects to your CloudStack environment. Review
  [Deploy a PCG in CloudStack](../../pcg/deploy-pcg/cloudstack.md) for guidance.

  :::info

  If you have a self-hosted Palette or VerteX instance with network connectivity to the CloudStack environment, you can
  use a System Private Gateway to add CloudStack accounts. Refer to the
  [System Private Gateway](../../pcg/architecture.md#system-private-gateway) guide to learn more.

  :::

- A CloudStack user account with the required permissions to deploy workload clusters in the CloudStack environment.
  Review [Required Permissions for CloudStack](required-permissions.md) to learn more about the required permissions.

- Access to your CloudStack environment with the following information:

  - The CloudStack API endpoint URL. For example, `https://cloudstack.example.com:8443/client/api` or
    `https://management-server-ip:8080/client/api`.

  - A CloudStack API key and Secret key for the user account that will be used to deploy workload clusters. Refer to the
    [Using API Key and Secret Key based Authentication](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#using-api-key-and-secret-key-based-authentication)
    guide about API and Secret keys.

  - The [CloudStack domain](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#domains) name for the
    user account that will be used to deploy workload clusters.

  - The Certificate Authority (CA) certificate for your CloudStack environment if it uses a custom or self-signed TLS
    certificate.

## Register a CloudStack Account

1. Log in to Palette as a tenant admin.

2. From the left main menu, select **Tenant Settings > Infrastructure > Cloud Accounts**.

3. Locate **CloudStack** and click **Add CloudStack Account**.

4. Fill out the following input values and click **Confirm** to continue.

   | **Field**                        | **Description**                                                                                                                                                                          |
   | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Account name**                 | A custom name for the CloudStack account. This is used by Palette to identify the account.                                                                                               |
   | **select private cloud gateway** | Select the PCG from the list of deployed PCGs in your setup.                                                                                                                             |
   | **API URL**                      | Enter the CloudStack API endpoint URL. For example, `https://cloudstack.example.com:8443/client/api` or `https://management-server-ip:8080/client/api`.                                  |
   | **API Key**                      | Enter the CloudStack API key for the user account that has permissions to deploy workload clusters.                                                                                      |
   | **Secret Key**                   | Enter the CloudStack Secret key for the user account that has permissions to deploy workload clusters. Click **Validate** to verify the connection.                                      |
   | **Domain**                       | Enter the CloudStack [domain](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#domains) name for the user account that has permissions to deploy workload clusters. |
   | **Allow Insecure Connection**    | Enable this option if you want to skip TLS certificate verification for your CloudStack environment.                                                                                     |

5. After filling out the required information, click **Confirm** to add the CloudStack account to Palette.

## Validate

1. Log in to Palette as a tenant admin.

2. From the left main menu, select **Tenant Settings > Infrastructure > Cloud Accounts**.

3. Verify that the CloudStack account you added appears in the CloudStack accounts list.

## Next Steps

- Learn how to [Create and Manage CloudStack Clusters](create-manage-cloudstack-clusters.md) in Palette.
