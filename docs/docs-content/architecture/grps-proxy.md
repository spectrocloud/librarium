---
sidebar_label: "gRPC and Proxies"
title: "gRPC and Proxies"
description:
  "Learn about gRPC and how a proxy is used to communicate between the management platform and the workload cluster."
hide_table_of_contents: false
sidebar_position: 30
sidebar_custom_props:
  icon: ""
---

Palette uses [gRPC](https://grpc.io) to communicate between the management platform and the workload cluster. gRPC is a
high-performance, open source universal Remote Procedure Call (RPC) framework. It is used to build distributed
applications and services. gRPC is based on HTTP/2 protocol and uses protocol buffers
([protobuf](https://protobuf.dev/)) as the underlying data serialization framework.

:::tip

Refer to the [Network Ports](networking-ports.md) documentation for a detailed network architecture diagram with gRPC
and to learn more about the ports used for communication.

:::

## gRPC and WebSocket

The Palette agent will automatically attempt to connect to the management plane using gRPC through HTTPS using the
HTTP/2 protocol. In some environments, the network configuration may not allow gRPC traffic to pass through. A common
scenario is when the network is behind a proxy server that does not support HTTP/2. In this scenario, the Palette agent
will first attempt to connect to the management plane using HTTP/2. After several failed attempts, the agent will fall
back to using WebSocket over HTTPS with HTTP/1.1.

The fallback to WebSocket with transcoding occurs automatically and does not require any additional configuration.

### gRPC Transcode

Behind the scenes, when the Palette agent fails to connect with the management plane after a maximum of ten connection
attempts, the agent initiates the failover to a WebSocket connection and transcodes the gRPC messages with the HTTP/1.1
protocol.

The Palette agent directs gRPC messages to a freshly started in-memory proxy service, which takes the original gRPC
request, transcodes it to HTTP/1.1 protocol, and sends it over the WebSocket connection to the management plane. The
management plane's WebSocket handler will then accept the WebSocket message and transcode it back to the HTTP/2 protocol
before forwarding it to the gRPC handler. The server will then respond with a gRPC message, which will be transcoded to
HTTP/1.1 and sent back to the agent over the WebSocket. The agent's in-memory proxy will read the message and transcode
it back to HTTP/2 and pass it to the agent.

![An architecture diagram of the gRPC over WebSocket flow from a network perspective. Agent to agent proxy, to WebSocket handler, who then forwards the message to the server gRPC handler.](/architecture_grps-proxy_grpc-websocket.webp)

Below is a high-level overview of the order of operations when the Palette agent falls back to using WebSocket:

1. The agent initiates a new gRPC request to the management plane servers that is picked up by the in-memory proxy
   service.
2. The agent's in-memory proxy creates a WebSocket connection with the management plane servers.
3. The management plane server accepts the WebSocket connection
4. The agent in-memory proxy transcodes the gRPC request on-demand and sends it via the WebSocket connection.
5. The server's WebSocker handler reads the request off the WebSocket connection and forwards it to the server's gRPC
   handler.
6. The gRPC handler processes the request and responds via the same connection. The WebSocket handler sends the response
   from the gRPC handler back to the agent.
7. The agent's in-memory proxy reads the response off the WebSocket connection and transcodes it back to HTTP/2 and
   passes it to the agent.

A more straightforward way to think about the WebSocket transcoding architecture is that network traffic between the
Palette agent and the management plane uses the WebSocket connection and the HTTP/1.1 protocol. The agent and server are
still communicating using gRPC, but the messages are transcoded to the HTTP/1.1 protocol between the two entities. Using
WebSocket and HTTP/1.1 removes issues due to application firewalls or network proxies not supporting the HTTP/2
protocol. Once the gRPC message is internal to the agent or the server, the HTTP/2 protocol is used for communication.

## gRPC and Proxies

:::info

The following sections provide information about using gRPC with network proxies. These issues are addressed by using
WebSocket and the HTTP/1.1 protocol as a fallback mechanism. However, if you want to better understand the reasons for
falling back to a WebSocket connection, the following sections provide more information about challenges with gRPC and
network proxies. If you want to learn more about gRPC and transcoding, check out the Red Hat article
[gRPC Anywhere](https://www.redhat.com/en/blog/grpc-anywhere).

:::

When gRPC is used with network proxies, the proxy servers may or may not support gRPC or require additional
configuration to allow gRPC traffic to pass through. The following table summarizes the different scenarios and whether
or not the proxy server supports gRPC. Keep in mind that should the gRPC connection fail, the agent will automatically
fall back to using WebSocket.

| **Scenario**                                                      | **Description**                                                                                                                              | **Proxy Supported** |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| gRCP with HTTP/HTTPS - No SSL bump                                | gRPC traffic is sent over HTTP/HTTPS, and the proxy does not perform a Secure Socket Layer (SSL) bump. This is universally supported.        | ✅                  |
| gRPC with HTTP/HTTPS - SSL bump                                   | gRPC traffic is sent over HTTP/HTTPS, and the proxy performs an SSL bump. Support varies by vendor.                                          | ⚠️                  |
| gRPC with [Squid](https://wiki.squid-cache.org) Open Source Proxy | gRPC traffic is sent over HTTP/HTTPS, and the proxy performs an SSL bump. Supported in some scenarios but requires additional configuration. | ❌ or ⚠️            |

The following sections provide more information about gRPC and proxies.

### Proxy Without SSL Bump

Because gRPC is based on HTTP/2, any proxy server that supports the
[HTTP CONNECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT) method can be used to forward gRPC
traffic. No configuration is required for this scenario. The exception is when the proxy server performs an SSL bump,
discussed in the [Proxy With SSL Bump](#proxy-with-ssl-bump) section.

:::info

SSL bump is a technique used to decrypt and inspect HTTPS traffic. When SSL bump is enabled, the proxy server terminates
the Transport Layer Security (TLS) connection and establishes a new TLS connection to the destination server. In this
scenario, the proxy server must support gRPC and may require additional configuration.

:::

### Proxy With SSL Bump

Several vendors provide proxy servers that support gRPC. Some of the vendors may require additional configurations or
the use of a specific version of the proxy server. We encourage you to review your proxy server documentation for more
information.

When you review the vendor documentation, search for information about gRPC and HTTP/2. We provide the following links
to some vendors' documentation that addresses HTTP/2 and gRPC support.

- [F5](https://my.f5.com/manage/s/article/K47440400)

- [Palo Alto](https://knowledgebase.paloaltonetworks.com/KCSArticleDetail?id=kA10g000000CmdQCAS)

- [Fortinet](https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/710924/https-2-support-in-proxy-mode-ssl-inspection)

- [Check Point](https://support.checkpoint.com/results/sk/sk116022)

### Squid Proxy With SSL Bump

A common open source proxy server is [Squid](https://wiki.squid-cache.org). Squid is a caching proxy for the Web
supporting HTTP, HTTPS, FTP, and more. Squid supports gRPC but requires additional configuration. gRPC with SSL bump
does not work with all versions of Squid, such as versions 5 and 6. Review the
[SSL Bump issue](https://bugs.squid-cache.org/show_bug.cgi?id=5245) to learn more about the issue and track the progress
of the fix.

If you are using a Squid version not affected by the issue, you can configure Squid with SSL bump to support gRPC. Use
the [Configuring SSL Bumping in the Squid service](https://support.kaspersky.com/KWTS/6.1/en-US/166244.htm) guide to
learn how to configure Squid with SSL bump. Additionally, you may have to configure exclusion rules when using SSL
bumping with gRPC. Refer to the
[Adding exclusions for SSL Bumping](https://support.kaspersky.com/KWTS/6.1/en-US/193664.htm) to learn more.
