---
sidebar_label: "Configure HTTP-Proxy in EMC"
title: "Configure HTTP-Proxy in EMC"
description: "Instructions for configuring HTTP proxy in Edge Management Console."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

EMC is only available in a disconnected installations of Palette Edge, and often times the Edge host is in a restricted
network environment such as most corporate networks. In such environments, you often need a proxy to access external
networks such as the internet.

You can configure your Edge hosts to use an HTTP/HTTPS proxy for secure internet access from Edge Management Console
(EMC).

:::preview

:::

## Prerequisites

- An Edge host deployed with Edge Installer 4.3 or later.

- The Edge host does not have a connection to a Palette instance and the installation is conducted with the
  `installationMode` parameter set to `airgap`. For more information, refer to
  [Installer Configuration](../../edge-configuration/installer-reference.md).

- An active HTTP proxy server.

## Configure HTTP Proxy

1. Log in to Edge Management Console. You should be directed to the **Edge Host** page after signing in. If not, click
   on **Edge Host** from the **Main Menu** to navigate to the page.

2. On the **Edge Host** page, click on the pencil icon next to **HTTP Proxy**.

3. Supply the proxy server information.

   | Field           | Description                                                                                                                                                               |
   | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | HTTP Endpoint   | The address where the HTTP proxy server is located. It's used to route HTTP traffic through the proxy.                                                                    |
   | HTTPS Endpoint  | The address where the HTTPS proxy server is located. It's used to route HTTPS traffic through the proxy.                                                                  |
   | No Proxy        | Specifies exceptions to the proxy rules. It lists addresses or domains that should bypass the proxy and connect directly, useful for local or internal network resources. |
   | CA Certificates | CA certificates that are used to authenticate the proxy server.                                                                                                           |

4. Click **Confirm**. Updating the HTTP proxy settings causes HTTP/HTTPS services on the Edge host to restart, so you
   will not be able to access the console for a short duration .

## Validate

1. Log in to your Edge Host via SSH.

2. Make a curl request from the command-line to any domain that only the proxy server would have access to. For example,
   if your Edge deployment is airgapped and does not have access to the internet except through the proxy server, you
   can make a curl call to Google.

   ```shell
   curl https://www.google.com
   ```

   If you can get HTML code in response containing the Google search home page, the proxy configuration is working as
   expected.
