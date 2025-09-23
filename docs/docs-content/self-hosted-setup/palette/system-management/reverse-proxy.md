---
sidebar_label: "Configure Reverse Proxy"
title: "Configure Reverse Proxy"
description: "Learn how to configure a reverse proxy for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["palette", "management"]
keywords: ["self-hosted", "enterprise"]
---

You can configure a reverse proxy for Palette. The reverse proxy can be used by host clusters deployed in a private
network. Host clusters deployed in a private network are not accessible from the public internet or by users in
different networks. You can use a reverse proxy to access the cluster's Kubernetes API server from a different network.

<!-- prettier-ignore -->
When you configure reverse proxy server for Palette, clusters that use the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack will use the reverse proxy server address in the kubeconfig file. Clusters not using the Spectro Proxy pack will use the default cluster address in the kubeconfig file.

Use the following steps to configure a reverse proxy server for Palette.

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.

- [Helm](https://helm.sh/docs/intro/install/) is installed and available.

- Access to the kubeconfig file of the Palette Kubernetes cluster. You can download the kubeconfig file from the Palette
  system console. Navigate to **Enterprise System Migration**, select the Palette cluster, and click the **Download
  Kubeconfig** button for the cluster.

- A domain name that you can use for the reverse proxy server. You will also need access to the DNS records for the
  domain so that you can create a CNAME DNS record for the reverse proxy server load balancer.

- Ensure you have an SSL certificate that matches the domain name you will assign to Spectro Proxy. You will need this
  to enable HTTPS encryption for the Spectro Proxy. Contact your network administrator or security team to obtain the
  SSL certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.

- The Spectro Proxy server must have internet access and network connectivity to the private network where the
  Kubernetes clusters are deployed.

## Enablement

1. Open a terminal session and navigate to the directory where you stored the **values.yaml** for the Palette
   installation.

2. Use a text editor and open the **values.yaml** file. Locate the `frps` section and update the following values in the
   **values.yaml** file. Refer to the
   [Spectro Proxy Helm Configuration](../install-palette/install-on-kubernetes/palette-helm-ref.md#spectro-proxy) to
   learn more about the configuration options.

<br />

| **Parameter**     | **Description**                                                                                     | **Type** |
| ----------------- | --------------------------------------------------------------------------------------------------- | -------- |
| `enabled`         | Set to `true` to enable the Spectro Proxy server.                                                   | boolean  |
| `frps.frpHostURL` | The domain name you will use for the Spectro Proxy server. For example, `frps.palette.example.com`. |
| `server.crt`      | The x509 SSL certificate file in base64 format.                                                     |
| `server.key`      | The x509 SSL certificate key file in base64 format.                                                 |
| `ca.crt`          | The x509 SSL certificate authority file in base64 format.                                           |

<br />

The following is an example of the `frps` section in the **values.yaml** file. The SSL certificate files are truncated
for brevity.

<br />

```yaml
frps:
  frps:
    enabled: true
    frpHostURL: "frps.palette.example.com"
    server:
      crt: "LS0tLS1CRU...........tCg=="
      key: "LS0tLS1CRU...........tCg=="
    ca:
      crt: "LS0tLS1CRU...........tCg=="
```

3. Issue the `helm upgrade` command to update the Palette Kubernetes configuration. The command below assumes you in the
   folder that contains the **values.yaml** file and the Palette Helm chart. Change the directory path if needed.

<br />

```bash
helm upgrade --values values.yaml hubble spectro-mgmt-plane-0.0.0.tgz --install
```

4. After the new configurations are accepted, use the following command to get the Spectro Proxy server's load balancer
   IP address.

<br />

```bash
kubectl get svc --namespace proxy-system spectro-proxy-svc
```

5. Update the DNS records for the domain name you used for the Spectro Proxy server. Create a CNAME record that points
   to the Spectro Proxy server's load balancer IP address.

6. Log in to the Palette System API by using the `/v1/auth/syslogin` endpoint. Use the `curl` command below and replace
   the URL with the custom domain URL you assigned to Palette or use the IP address. Ensure you replace the credentials
   below with your system console credentials.

<br />

```bash
curl --insecure --location 'https://palette.example.com/v1/auth/syslogin' \
 --header 'Content-Type: application/json' \
 --data '{
  "password": "**********",
  "username": "**********"
 }'
```

Output

```json hideClipboard
{
  "Authorization": "**********.",
  "IsPasswordReset": true
}
```

7. Using the output you received, copy the authorization value to your clipboard and assign it to a shell variable.
   Replace the authorization value below with the value from the output.

<br />

```shell hideClipboard
TOKEN=**********
```

8. Next, prepare a payload for the`/v1/system/config/` endpoint. This endpoint is used to configure Palette to use a
   reverse proxy. The payload requires the following parameters:

<br />

| **Parameter** | **Description**                                                                                                                                 | **Type** |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `caCert`      | The x509 SSL certificate authority file in base64 format.                                                                                       | string   |
| `clientCert`  | The x509 SSL certificate file in base64 format.                                                                                                 | string   |
| `clientKey`   | The x509 SSL certificate key file in base64 format.                                                                                             | string   |
| `port`        | The port number for the reverse proxy server. We recommend using port `443`.                                                                    | integer  |
| `protocol`    | The protocol to use for the reverse proxy server. We recommend using `https`.                                                                   | string   |
| `server`      | The domain name you will use for the Spectro Proxy server. For example, `frps.palette.example.com`. Don't include the HTTP schema in the value. | string   |

The following is an example payload. The SSL certificate files are truncated for brevity.

<br />

```json hideClipboard
{
  "caCert": "-----BEGIN CERTIFICATE-----\n.............\n-----END CERTIFICATE-----",
  "clientCert": "-----BEGIN CERTIFICATE-----\n..........\n-----END CERTIFICATE-----",
  "clientKey": "-----BEGIN RSA PRIVATE KEY-----\n........\n-----END RSA PRIVATE KEY-----",
  "port": 443,
  "protocol": "https",
  "server": "frps.palette.example.com.com"
}
```

:::info

You can save the payload to a file and use the `cat` command to read the file contents into the `curl` command. For
example, if you save the payload to a file named `payload.json`, you can use the following command to read the file
contents into the `curl` command. You can also save the payload as a shell variable and use the variable in the `curl`
command.

:::

<br />

9. Issue a PUT request using the following `curl` command. Replace the URL with the custom domain URL you assigned to
   Palette or use the IP address. You can use the `TOKEN` variable you created earlier for the authorization header.
   Ensure you replace the payload below with the payload you created in the previous step.

<br />

```bash
  curl --insecure --silent --include --output /dev/null -w "%{http_code}" --location --request PUT 'https://.example.com/v1/system/config/reverseproxy' \
  --header "Authorization: $TOKEN" \
  --header 'Content-Type: application/json' \
  --data '    {
      "caCert": "-----BEGIN CERTIFICATE-----\n................\n-----END CERTIFICATE-----\n",
      "clientCert": "-----BEGIN CERTIFICATE-----\n.............\n-----END CERTIFICATE-----",
      "clientKey": "-----BEGIN RSA PRIVATE KEY-----\n............\n-----END RSA PRIVATE KEY-----\n",
      "port": 443,
      "protocol": "https",
      "server": "frps.palette.example.com.com"
  }'
```

A successful response returns a `204` status code.

Output

```shell hideClipboard
204
```

<!-- prettier-ignore -->
You now have a Spectro Proxy server that you can use to access Palette clusters deployed in a different network. Make
sure you add the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack to the clusters you want to access using the Spectro
Proxy server.

## Validate

Use the following command to validate that the Spectro Proxy server is active.

<br />

1. Open a terminal session.

2. Log in to the Palette System API by using the `/v1/auth/syslogin` endpoint. Use the `curl` command below and replace
   the URL with the custom domain URL you assigned to Palette or use the IP address. Ensure you replace the credentials
   below with your system console credentials.

<br />

```bash
curl --insecure --location 'https://palette.example.com/v1/auth/syslogin' \
 --header 'Content-Type: application/json' \
 --data '{
  "password": "**********",
  "username": "**********"
 }'
```

Output

```json hideClipboard
{
  "Authorization": "**********.",
  "IsPasswordReset": true
}
```

3. Using the output you received, copy the authorization value to your clipboard and assign it to a shell variable.
   Replace the authorization value below with the value from the output.

<br />

```shell hideClipboard
TOKEN=**********
```

4. Query the system API endpoint `/v1/system/config/reverseproxy` to verify the current reverse proxy settings applied
   to Palette. Use the `curl` command below and replace the URL with the custom domain URL you assigned to Palette or
   use the IP address. You can use the `TOKEN` variable you created earlier for the authorization header.

<br />

```bash
curl --location --request GET 'https://palette.example.com/v1/system/config/reverseproxy' \
 --header "Authorization: $TOKEN"
```

If the proxy server is configured correctly, you will receive an output similar to the following containing your
settings. The SSL certificate outputs are truncated for brevity.

<br />

```json hideClipboard
{
  "caCert": "-----BEGIN CERTIFICATE-----\n...............\n-----END CERTIFICATE-----\n",
  "clientCert": "-----BEGIN CERTIFICATE-----\n...........\n-----END CERTIFICATE-----",
  "clientKey": "-----BEGIN RSA PRIVATE KEY-----\n........\n-----END RSA PRIVATE KEY-----\n",
  "port": 443,
  "protocol": "https",
  "server": "frps.palette.example.com"
}
```
