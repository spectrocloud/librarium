---
sidebar_label: "gRPC and Proxies"
title: "gRPC and Proxies"
description: "Learn about gRPC and how a proxy is used to communicate between the management platform and the workload cluster."
hide_table_of_contents: false
sidebar_position: 30
sidebar_custom_props:
          icon: ""
---
 


Palette uses [gRPC](https://grpc.io) to communicate between the management platform and the workload cluster. gRPC is a high-performance, open-source universal Remote Procedure Call (RPC) framework. It is used to build distributed applications and services. gRPC is based on HTTP/2 and uses protocol buffers ([protobuf](https://protobuf.dev/)) as the underlying data serialization framework. 


:::info

Refer to the [Network Ports](networking-ports.md) documentation for a detailed network architecture diagram with gRPC and to learn more about the ports used for communication.

:::


When gRPC is used with network proxies, the proxy servers may or may not support gRPC or require additional configuration to allow gRPC traffic to pass through. The following table summarizes the different scenarios and whether or not the proxy server supports gRPC.


| **Scenario** | **Description** | **Proxy Supported** |
|:-------------|:----------------|:--------------------|
| gRCP with HTTP/HTTPS - No SSL bump| gRPC traffic is sent over HTTP/HTTPS, and the proxy does not perform a Secure Socket Layer (SSL) bump. This is universally supported. | ✅ |
| gRPC with HTTP/HTTPS - SSL bump | gRPC traffic is sent over HTTP/HTTPS, and the proxy performs an SSL bump. Support varies by vendor. | ⚠️ |
| gRPC with [Squid](https://wiki.squid-cache.org) Open Source Proxy | gRPC traffic is sent over HTTP/HTTPS, and the proxy performs an SSL bump. Supported in some scenarios but requires additional configuration. | ❌ or ⚠️ |


The following sections provide more information about gRPC and proxies.


## Proxy Without SSL Bump

Because gRPC is based on HTTP/2, any proxy server that supports the [HTTP CONNECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT) method can be used to forward gRPC traffic. No configuration is required for this scenario. The exception is when the proxy server performs an SSL bump, discussed in the [Proxy With SSL Bump](#proxy-with-ssl-bump) section.


:::info

SSL bump is a technique used to decrypt and inspect HTTPS traffic. When SSL bump is enabled, the proxy server terminates the Transport Layer Security (TLS) connection and establishes a new TLS connection to the destination server. In this scenario, the proxy server must support gRPC and may require additional configuration.   

:::

## Proxy With SSL Bump

Several vendors provide proxy servers that support gRPC. Some of the vendors may require additional configurations or the use of a specific version of the proxy server. We encourage you to review your proxy server documentation for more information.

When you review the vendor documentation, search for information about gRPC and HTTP/2. We provide the following links to some vendors' documentation that addresses HTTP/2 and gRPC support.


- [F5](https://my.f5.com/manage/s/article/K47440400)


- [Palo Alto](https://knowledgebase.paloaltonetworks.com/KCSArticleDetail?id=kA10g000000CmdQCAS)


- [Fortinet](https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/710924/https-2-support-in-proxy-mode-ssl-inspection)


- [Check Point](https://support.checkpoint.com/results/sk/sk116022)


## Squid Proxy With SSL Bump

A common open-source proxy server is [Squid](https://wiki.squid-cache.org). Squid is a caching proxy for the Web supporting HTTP, HTTPS, FTP, and more. Squid supports gRPC but requires additional configuration. gRPC with SSL bump does not work with all versions of Squid, such as versions 5 and 6. Review the [SSL Bump issue](https://bugs.squid-cache.org/show_bug.cgi?id=5245) to learn more about the issue and track the progress of the fix.

If you are using a Squid version not affected by the issue, you can configure Squid with SSL bump to support gRPC. Use the [Configuring SSL Bumping in the Squid service](https://support.kaspersky.com/KWTS/6.1/en-US/166244.htm) guide to learn how to configure Squid with SSL bump. Additionally, you may have to configure exclusion rules when using SSL bumping with gRPC. Refer to the [Adding exclusions for SSL Bumping](https://support.kaspersky.com/KWTS/6.1/en-US/193664.htm) to learn more.
