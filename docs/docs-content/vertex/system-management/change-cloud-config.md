---
sidebar_label: "Modify Cloud Provider Configuration"
title: "Modify Cloud Provider Configuration"
description: "Learn how to modify the system-level cloud provider configuration in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 130
tags: ["vertex", "management", "clouds"]
keywords: ["self-hosted", "vertex"]
---

Different cloud providers use different image formats to create virtual machines. Amazon Web Services (AWS), for
example, uses Amazon Machine Images (AMI), while Azure uses Virtual Hard Disks (VHDs). We provide public images for each
cloud provider that contains the desired Operation System (OS) and Kubernetes binaries specified in a cluster profile.
We make these infrastructure provider images available to you by ensuring the images are available in the required cloud
provider regions.

When you deploy a cluster using VerteX, it automatically selects the correct infrastructure provider image that contains
the desired Operation System (OS) and Kubernetes binaries specified in the cluster profile.

<!-- prettier-ignore-start -->
The exception to this process is when you are using a custom image, in which case you must provide the image yourself through the <VersionedLink text="Bring Your Own OS (BYOOS) " url="/integrations/packs/?pack=generic-byoi"  /> pack.
<!-- prettier-ignore-end -->

In the event you need to enable new cloud providers, or rotate the credentials used to access our infrastructure
provider images, you can do so through the [System API](/api/v1/system/). Use the following steps to modify the cloud
provider configuration for your self-hosted VerteX instance.

## Prerequisites

- System administrator permissions, either a Root Administrator or Operations Administrator. Refer to the
  [System Administrators](../system-management/account-management/account-management.md#system-administrators) page to
  learn more about system administrator roles.

- You need cloud credentials from us to download the required infrastructure provider images. Reach out to our support
  team at [support@spectrocloud.com](mailto:support@spectrocloud.com) to obtain these credentials.

- `curl` or similar tool to make API requests.

## Update Cloud Provider Configuration

1.  Open a terminal session.

2.  Log in to the VerteX System API by using the `/v1/auth/syslogin` endpoint. Use the curl command below and replace
    the `example.com` placeholder URL with the URL of your VerteX instance. Ensure you replace the credentials below
    with your system console credentials.

        ```shell
        TOKEN=$(curl --insecure --location 'https://example.com/v1/auth/syslogin' \
        --header 'Content-Type: application/json' \
        --data '{
          "password": "**********",
          "username": "**********"
        }')
        ```

        The response will contain the authentication token that you will use in the next request.

3.  Next, prepare a payload for the cloud provider you want to enable or update. Select the tab for details on the
    expected payload for each cloud provider.

    Replace the placeholders in the payload below with the configuration values provided by our support team.

        <!-- prettier-ignore -->

        <Tabs groupId="provider">

    <TabItem value="Azure" label="Azure">

    ```json
    CONFIG_JSON=$(cat <<EOF
    {
      "spec": {
        "clientId": "**************",
        "clientSecret": "**************",
        "tenantId": "**************",
        "subscriptionId": "**************"
      }
    }
    EOF
    )
    ```

        </TabItem>

        <TabItem value="AWS" label="AWS">

    ```json
    CONFIG_JSON=$(cat <<EOF
    {
      "spec": {
        "accessKey": "**************",
        "secretKey": "**************"
      }
    }
    EOF
    )
    ```

        </TabItem>

        <TabItem value="GCP" label="GCP">

    ```json
    CONFIG_JSON=$(cat <<EOF
    {
      "spec": {
        "json": "**************"
      }
    }
    EOF
    )
    ```

        </TabItem>

        </Tabs>

4.  Use the `/v1/system/config/:provider/account` endpoint to update the cloud provider configuration. Select the tab
    for the cloud provider you want to update and issue the corresponding curl command. Replace the `example.com`
    placeholder URL with the URL of your VerteX instance.

    <!-- prettier-ignore -->
    <Tabs groupId="provider">

    <TabItem value="Azure" label="Azure">

    ```shell
    curl --insecure --request PUT --location 'https://example.com/v1/system/config/azure/account' \
    --header "Authorization: $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "$CONFIG_JSON"
    ```

    </TabItem>

    <TabItem value="AWS" label="AWS">

    ```shell
    curl --insecure --request PUT --location 'https://vertex.example.com/v1/system/config/aws/account' \
    --header "Authorization: $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "$CONFIG_JSON"
    ```

    </TabItem>

    <TabItem value="GCP" label="GCP">

    ```shell
    curl --insecure --request PUT --location 'https://vertex.example.com/v1/system/config/gcp/account' \
    --header "Authorization: $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "$CONFIG_JSON"
    ```

    </TabItem>

    </Tabs>

You have successfully updated the cloud provider configuration for your self-hosted VerteX instance.

## Validate

Use the following steps to validate the cloud provider configuration update.

1.  Open a terminal session.

2.  Log in to the VerteX System API by using the `/v1/auth/syslogin` endpoint. Use the curl command below and replace
    the `example.com` placeholder URL with the URL of your VerteX instance. Ensure you replace the credentials below
    with your system console credentials.

        ```shell
        TOKEN=$(curl --insecure --location 'https://example.com/v1/auth/syslogin' \
        --header 'Content-Type: application/json' \
        --data '{
          "password": "**********",
          "username": "**********"
        }')
        ```

        The response will contain the authentication token that you will use in the next request.

3.  Use the `/v1/system/config/:provider/account` endpoint to get the cloud provider configuration. Select the tab for
    the cloud provider you want to update and issue the corresponding curl command. Replace the `example.com`
    placeholder URL with the URL of your VerteX instance.

        <!-- prettier-ignore -->
        <Tabs groupId="provider">
        <TabItem value="Azure" label="Azure">

        ```shell
        curl --insecure --request GET --location 'https://example.com/v1/system/config/azure/account' \
        --header "Authorization: $TOKEN" \
        --header 'Content-Type: application/json'
        ```

        </TabItem>

    <TabItem value="AWS" label="AWS">

        ```shell
        curl --insecure --request GET --location 'https://vertex.example.com/v1/system/config/aws/account' \
        --header "Authorization: $TOKEN" \
        --header 'Content-Type: application/json'
        ```

        </TabItem>

        <TabItem value="GCP" label="GCP">

        ```shell
        curl --insecure --request GET --location 'https://vertex.example.com/v1/system/config/gcp/account' \
        --header "Authorization: $TOKEN" \
        --header 'Content-Type: application/json'
        ```

        </TabItem>

        </Tabs>

4.  The response will contain the cloud provider configuration details. Verify that the configuration values match the
    values you provided in the payload.
