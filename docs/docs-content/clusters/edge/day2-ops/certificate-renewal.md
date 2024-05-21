---
sidebar_label: "Renew Certificates for Air-gap Clusters"
title: "Renew Certificates for Air-gap Clusters"
description: "Learn how to renew certificates for different Kubernetes components in your cluster."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge", "architecture"]
---

Kubernetes uses certificates to secure the communication between different components of a cluster. Using these
certificates allows Kubernetes to secure API connections, verifying the authenticity of the nodes, and encrypting
connections. All certificates have an expiry date, and need to be renewed periodically.

This page guides you through the different methods used to renew certificates in an air-gapped Palette Edge cluster. An
air-gapped cluster means a cluster that has no connection to a Palette instance.

## Limitations

- The procedure described in this guide only renews certificates for control plane nodes.
- You cannot provide your own certificates for certificate renewal.

## Automatic Renewal

Palette Edge will automatically renew all certificates used by your cluster for you 30 days before they expire. You can
follow the steps below to check when the next automatic renewal will happen.

### Prerequisite

- You have an active cluster in a air-gapped Edge host.
- You have access to the local UI for the Edge host. For more information, refer to
  [Access Local UI](../local-ui/host-management/access-console.md).

### Check Next Auto Renewal Time

1. Log in to local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Select the **Overview** tab on the **Cluster** page.

4. In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
   certificates currently in use by your cluster.

5. The next renewal time, which is 30 days before the expiry date, for your certificates is at the top of the pop-up
   box.

### Validate

In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
certificates currently in use by your cluster. You can confirm that the certificates have been renewed by looking at the
issue date of certificates.

## Manual Renewal

You can also manually renew your certificates whenever you want. You can do this through the local UI or through the
Edge Management API.

### Prerequisite

- You have an active cluster in a air-gapped Edge host.
- You have access to the local UI for the Edge host. For more information, refer to
  [Access Local UI](../local-ui/host-management/access-console.md).

### Manually Renew Certificates

<Tabs group="methods">

<TabItem label="Local UI" value="ui">

1. Log in to local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Select the **Overview** tab on the **Cluster** page.

4. In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
   certificates currently in use by your cluster.

5. Click **Renew** to renew all certificates used by the cluster.

</TabItem>

<TabItem label="API" value="api">

1. Issue the following command to call the Edge Management authentication API. Replace `edge-host-ip` with the IP of
   your Edge host and replace `os-username` and `os-password` with your Operating System (OS) user credentials.

   ```shell
   curl --location 'https://edge-host-ip:5080/v1/users/default/login' \
   --header 'Content-Type: application/json' \
   --data '{
      "username": "os-username",
      "password": "os-password"
   }'
   ```

   This will return an authentication token.

   ```json
   {
     "Token": {
       "Authorization": "******"
     }
   }
   ```

2. Issue the following command to call the endpoint to renew your control plane node certificates. Put the
   authentication token you obtained in the previous step in the header.

   ```shell
   curl -X POST "https://example.com/v1/edge-mgmt/cluster/renew-certificates" \
     -H "Cookie: Authorization=*******"
   ```

</Tabs>

### Validate

In **Overview**, click **View Certificates** in the **Kubernetes Certificates** row. This will display all the
certificates currently in use by your cluster. You can confirm that the certificates have been renewed by looking at the
issue date of certificates.
