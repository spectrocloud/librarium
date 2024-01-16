---
sidebar_label: "IP Addresses"
title: "IP Addresses"
description: "Palette's public IP Addresses."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
---

In this section, you can find the public IP addresses that support Spectro Cloud SaaS operations. These IP addresses are essential to ensure seamless communication between your infrastructure and our platform.

## IP Address Ranges

Allow the following IP address ranges in your network configuration to enable traffic to and from the Spectro Cloud SaaS platform.

| **IP Address** | **Region**      |
| -------------- | --------------- |
| 44.232.106.120 | North West U.S. |
| 44.233.247.65  | North West U.S. |
| 52.35.163.177  | North West U.S. |
| 13.52.68.206   | South West U.S. |
| 18.144.153.171 | South West U.S. |
| 52.6.49.233    | North East U.S. |
| 54.158.209.13  | North East U.S. |
| 54.80.29.137   | North East U.S. |

## Palette Domains

Palette uses the following domains for communication between the management platform and the workload cluster.

<br />

:::warning

NATS and the associated port, 4222, are deprecated and will be removed in a future release. Starting with Palette 4.0.0, gRPC is used for all communication between the management platform and the workload cluster.

:::

| Domain                                        | Ports     |
| :-------------------------------------------- | :-------- |
| api.spectrocloud.com                          | 443       |
| api1.spectrocloud.com                         | 443       |
| api2.spectrocloud.com                         | 443       |
| api3.spectrocloud.com                         | 443       |
| message.spectrocloud.com                      | 443, 4222 |
| message1.spectrocloud.com                     | 443, 4222 |
| message2.spectrocloud.com                     | 443, 4222 |
| message3.spectrocloud.com                     | 443, 4222 |
| msg.spectrocloud.com                          | 443       |
| msg1.spectrocloud.com                         | 443       |
| msg2.spectrocloud.com                         | 443       |
| msg3.spectrocloud.com                         | 443       |
| console.spectrocloud.com                      | 443       |
| proxy.console.spectrocloud.com                | 443       |
| registry.spectrocloud.com                     | 443       |
| saas-repo.console.spectrocloud.com            | 443       |
| registry.spectrocloud.com                     | 443       |
| maasgoldenimage-console.s3.amazonaws.com      | 443       |
| openstackgoldenimage-console.s3.amazonaws.com | 443       |
| edgegoldenimage-console.s3.amazonaws.com      | 443       |
| vmwaregoldenimage-console.s3.amazonaws.com    | 443       |
| registry1.spectrocloud.com                    | 443       |
| registry2.spectrocloud.com                    | 443       |
| registry3.spectrocloud.com                    | 443       |
| 415789037893.dkr.ecr.us-east-1.amazonaws.com  | 443       |
| 415789037893.dkr.ecr.us-west-2.amazonaws.com  | 443       |

<br />
