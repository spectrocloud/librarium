---
sidebar_label: "System Address Management"
title: "System Address Management"
description: "Manage system address and SSL certificates in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["palette", "management"]
keywords: ["self-hosted", "enterprise"]
---

Palette uses Secure Sockets Layer (SSL) certificates to secure internal and external communication with Hypertext
Transfer Protocol Secure (HTTPS). External Palette endpoints, such as the
[system console](../system-management/system-management.md#system-console),
[Palette dashboard](../../getting-started/dashboard.md), Palette API, and gRPC endpoints, are enabled by default with
HTTPS using an auto-generated self-signed certificate.

## Update System Address and Certificates

The Palette system console allows you to replace the self-signed certificate with a custom SSL certificate to secure
these endpoints. Additionally, you can update the system address, which is the Fully Qualified Domain Name (FQDN) that
you use to access your Palette installation. The system address and certificates may be updated simultaneously.

:::info

Palette validates the combination of system address, certificate, key, and Certificate Authority (CA). Ensure that the
certificate is not expired, as well as that it is valid for the CA and the system address. Additionally, the system
address must be accessible from the system console.

:::

:::warning

You can swap out the external endpoint certificate at any time without affecting the system functionality. However,
updating the system address may require manual reconciliation on deployed clusters.

:::

### Prerequisites

- Access to the Palette system console.

- You need to have an x509 certificate and a key file in PEM format. The certificate file must contain the full
  certificate chain. Reach out to your network administrator or security team if you do not have these files.

- Ensure the certificate is created for the custom domain name you specified for your Palette installation. If you did
  not specify a custom domain name, the certificate must be created for the Palette system console's IP address. You can
  also specify a load balancer's IP address if you are using a load balancer to access Palette.

### Enablement

You can update your Palette system address and SSL certificates by using the following steps.

1. Log in to the Palette system console.

2. Navigate to the left **Main Menu** and select **Administration**.

3. Select the **System Address** tab.

4. Update your Palette domain in the **System Address (UI and API)** field.

5. Copy and paste the certificate into the **Certificate** field.

6. Copy and paste the certificate key into the **Key** field.

7. Copy and paste the certificate authority into the **Certificate Authority** field.

   ![A view of the certificate upload screen](/palette_system-management_ssl-certificate-management_system-address.webp)

8. Click **Update** to save your changes.

9. If you have any clusters deployed, you may need to reconcile the updated system address for each cluster. Refer to
   [Reconcile System Address on Deployed Clusters](#reconcile-system-address-on-deployed-clusters) for more information.

You will receive an error message if the provided values are not valid. Once the certificate is uploaded successfully,
Palette will refresh its listening ports and start using the newly configured values.

### Validate

You can validate that your certificate is uploaded correctly by using the following steps.

1.  Log out of the Palette system console. If you are already logged in, log out and close your browser session.
    Browsers cache connections and may not use the newly enabled HTTPS connection. Closing your existing browser session
    avoids issues related to your browser caching an HTTP connection.

2.  Log back into the Palette system console. Ensure the connection is secure by checking the URL. The URL should start
    with `https://`.

Palette is now using your uploaded certificate to create a secure HTTPS connection with external clients. Users can now
securely access the system console, Palette dashboard, the gRPC endpoint, and the Palette API endpoint.

## Reconcile System Address on Deployed Clusters

Once you have updated your system address, the clusters that were deployed before the update will not be able to
automatically reconnect to Palette if the old system address is no longer available. You will need to manually update
the API endpoint on each cluster if this the case. This enables the Palette agent to reconnect to the API at the newly
configured system address.

### Prerequisites

- Palette access with a configured cloud account.

- A cluster deployed prior to the system address update. Refer to the [Clusters](../../clusters/clusters.md) section for
  further guidance.

- `kubectl` installed. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) page for further
  guidance.

### Enablement

1. Log into Palette using the configured system address.

2. Navigate to the left **Main Menu** and select **Clusters**. Palette displays your deployed clusters. The clusters
   that have the **Unknown** status need to be manually updated.

3. Select your cluster from the **Clusters** list. The cluster **Overview** tab displays.

4. Download the kubeconfig file. This file allows you to connect to your deployed cluster. Check out the
   [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) page to learn more.
5. Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

6. Execute the following command in your terminal to view the cluster namespaces. Make a note of the cluster namespace
   that Palette has created. Its name follows the pattern **cluster-id**.

   ```shell
   kubectl get namespaces
   ```

7. Palette uses ConfigMaps to save its configuration and environment variables. Update the `apiEndpoint` value in the
   `hubble-info` ConfigMap to use the newly configured system address.

   ```shell
   kubectl edit configmap hubble-info --namespace <cluster-id>
   ```

8. Save your changes and exit the editor.

Repeat these steps for each cluster that has the **Unknown** status.

### Validate

1. Log into Palette using the configured system address.

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Palette successfully displays the status of your clusters. None of your clusters has the **Unknown** status.
