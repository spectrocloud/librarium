---
sidebar_label: "Prepare Network"
title: "Prepare Network"
description: "Learn how to prepare your network for Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 1
---

Preparing your network for Amazon EKS Hybrid Nodes involves configuring both the AWS and remote network environments.
You will also need a secure inter-site connection to enable communication between the edge hosts and your Amazon EKS
cluster.

The three main areas you need to configure are:

1. AWS Region
2. Remote Network Environment
3. Inter-Site Connectivity

This section provides common steps and example configurations for each of these areas. The following diagram provides a
high-level example of a networking setup for Amazon EKS Hybrid Nodes.

![Example Amazon EKS Hybrid Nodes network architecture](/eks-hybrid_prepare-environment_prepare-network_network-example.webp)

## AWS Region

This section provides the steps and example configuration for your AWS network as described in the following AWS
documentation:

- [AWS Virtual Private Cloud (VPC) and subnet setup](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-vpc)
- [Cluster security group configuration](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-cluster-sg)

### Prerequisites

- An AWS account with permissions to view, create, and modify the following resources:

  - VPC
  - Classless Inter-Domain Routing (CIDR) blocks
  - Subnets
  - Route tables
  - Internet gateways
  - Network Address Translation (NAT) gateways
    - Elastic IPs
  - Transit gateways
  - Virtual private gateways
  - Security groups

  Refer to [Amazon VPC policy examples](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-policy-examples.html) for
  guidance on Identity and Access Management (IAM) permissions.

### Configure AWS Network

1. [Create a VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html) where the Amazon EKS cluster will be
   located, for example, `us-east-1`. The following table is an example configuration for the VPC.

   | Setting             | Example Value          |
   | ------------------- | ---------------------- |
   | **Name tag**        | `eks-hybrid-vpc`       |
   | **IPv4 CIDR block** | IPv4 CIDR manual input |
   | **IPv4 CIDR**       | `10.100.0.0/16`        |
   | **IPv6 CIDR block** | No IPv6 CIDR block     |
   | **Tenancy**         | Default                |

2. [Edit your VPC settings](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html) and enable the
   following options in **DNS settings**:

   - **Enable DNS resolution**
   - **Enable DNS hostnames**

3. [Create two subnets](https://docs.aws.amazon.com/vpc/latest/userguide/create-subnets.html) for the VPC that you
   created. The following table is an example configuration for the subnets.

   | Setting                    | Example Value for Subnet 1               | Example Value for Subnet 2               |
   | -------------------------- | ---------------------------------------- | ---------------------------------------- |
   | **VPC ID**                 | `vpc-0518d3603257bf85d (eks-hybrid-vpc)` | `vpc-0518d3603257bf85d (eks-hybrid-vpc)` |
   | **Subnet name**            | `eks-hybrid-subnet-1`                    | `eks-hybrid-subnet-2`                    |
   | **Availability Zone**      | `us-east-1a`                             | `us-east-1b`                             |
   | **IPv4 VPC CIDR block**    | `10.100.0.0/16`                          | `10.100.0.0/16`                          |
   | **IPv4 subnet CIDR block** | `10.100.0.0/24`                          | `10.100.1.0/24`                          |

4. If you plan to deploy AWS worker nodes to a public subnet,
   [edit the subnet settings](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html) and enable the
   **Enable auto-assign public IPv4 address** option.

5. If you want any of your subnets to be public,
   [create and attach an internet gateway](http://docs.aws.amazon.com/vpc/latest/userguide/working-with-igw.html) to the
   VPC that you created.

6. For any subnets that you want to keep private,
   [create a NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html#nat-gateway-creating)
   for those subnets. The following table is an example configuration for the NAT gateway.

   | Setting                      | Example Value for Subnet 1                       |
   | ---------------------------- | ------------------------------------------------ |
   | **Name**                     | `eks-hybrid-private-subnet-gateway`              |
   | **Subnet**                   | `subnet-0cdebdb570d3ca783 (eks-hybrid-subnet-1)` |
   | **Connectivity type**        | Public                                           |
   | **Elastic IP allocation ID** | `eipalloc-05e4fdafb32b05447`                     |

   The NAT gateway requires an Elastic IP address when setting **Connectivity type** to **Public**. Ensure you have
   already allocated one in the same region as your VPC and subnet. Refer to
   [Allocate an Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/working-with-eips.html#using-instance-addressing-eips-allocating)
   for guidance.

7. Edit the main route table depending on whether your subnets will be private or public. The main route table is
   created automatically for the subnets within the VPC.

   If you are wanting one private subnet _and_ one public subnet, follow the steps to edit the main route table for your
   private subnet first. Then,
   [create a custom route table](https://docs.aws.amazon.com/vpc/latest/userguide/WorkWithRouteTables.html#CustomRouteTable)
   for your VPC and configure it for your public subnet.

   <Tabs queryString="subnet-type">

   <TabItem label="Private" value="private">

   - [Associate the subnet or subnets with your route table](https://docs.aws.amazon.com/vpc/latest/userguide/WorkWithRouteTables.html#AssociateSubnet)
     explicitly.
   - [Add a route](https://docs.aws.amazon.com/vpc/latest/userguide/WorkWithRouteTables.html#AddRemoveRoutes) to your
     NAT gateway.
   - Ensure that a `local` route exists for your VPC CIDR.
   - (Optional) Provide a **Name** tag for your route table, for example, `eks-hybrid-private-subnet-rt`.

   <br />

   <details>

   <summary> Example route table </summary>

   | Destination     | Target                  | Status | Propagated |
   | --------------- | ----------------------- | ------ | ---------- |
   | `0.0.0.0/0`     | `nat-0327bf58440ab78b9` | Active | No         |
   | `10.100.0.0/16` | `local`                 | Active | No         |

   </details>

   </TabItem>

   <TabItem label="Public" value="public">

   - [Associate the subnet or subnets with your route table](https://docs.aws.amazon.com/vpc/latest/userguide/WorkWithRouteTables.html#AssociateSubnet)
     explicitly.
   - [Add a route](https://docs.aws.amazon.com/vpc/latest/userguide/WorkWithRouteTables.html#AddRemoveRoutes) to your
     internet gateway.
   - Ensure that a `local` route exists for your VPC CIDR.
   - (Optional) Provide a **Name** tag for your route table, for example, `eks-hybrid-public-subnet-rt`.

   <br />

   <details>

   <summary> Example route table </summary>

   | Destination     | Target                  | Status | Propagated |
   | --------------- | ----------------------- | ------ | ---------- |
   | `0.0.0.0/0`     | `igw-0ddc77da7524bf133` | Active | No         |
   | `10.100.0.0/16` | `local`                 | Active | No         |

   </details>

   </TabItem>

   </Tabs>

8. [Create a security group](https://docs.aws.amazon.com/vpc/latest/userguide/creating-security-groups.html) for your
   VPC that contains the
   [necessary rules](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-cluster-sg)
   to allow communication with your remote environment. This security group is added as an additional security group
   when creating your EKS cluster as guided during the
   [Prepare EKS Cluster](./prepare-eks-cluster.md#create-the-eks-cluster) steps.

   The following tables are an example configuration for the security group.

   <Tabs queryString="cluster-security-group">

   <TabItem label="Basic Details" value="basic-details">

   | Setting                    | Example Value                                 |
   | -------------------------- | --------------------------------------------- |
   | **Security group name**    | `eks-hybrid-remote-rules-sg`                  |
   | **Description (optional)** | "EKS Hybrid remote environment communication" |
   | **VPC**                    | `vpc-0518d3603257bf85d (eks-hybrid-vpc)`      |
   | **Tags (optional)**        | `Name` = `eks-hybrid-remote-rules-sg`         |

   </TabItem>

   <TabItem label="Inbound Rules" value="inbound-rules">

   | Type      | Protocol | Port Range | Source           | Description (optional)     |
   | --------- | -------- | ---------- | ---------------- | -------------------------- |
   | **HTTPS** | TCP      | 443        | `10.200.0.0/16`  | "Remote Node CIDR Inbound" |
   | **HTTPS** | TCP      | 443        | `192.168.0.0/16` | "Remote Pod CIDR Inbound"  |

   </TabItem>

   <TabItem label="Outbound Rules" value="outbound-rules">

   | Type           | Protocol | Port Range | Destination      | Description (optional)             |
   | -------------- | -------- | ---------- | ---------------- | ---------------------------------- |
   | **Custom TCP** | TCP      | `10250`    | `10.200.0.0/16`  | "Remote Node CIDR Outbound"        |
   | **HTTPS**      | TCP      | 443        | `192.168.0.0/16` | "Remote Pod CIDR Webhook Outbound" |

   </TabItem>

   </Tabs>

### Validate

1. Log in to [AWS](https://console.aws.amazon.com/).

2. Check that your created network resources have a **State** of **Available** or **Attached** in your chosen region. A
   list of the expected resources is as follows:

   - AWS VPC for your Amazon EKS cluster.
   - Two subnets within the AWS VPC.
   - Internet gateways for your public subnets.
   - NAT gateways for your private subnets.

3. Check that you have created the following additional resources:

   - Route tables for your subnets.
   - Default security group for your VPC and custom security group for your remote environment rules.
   - Elastic IPs for your NAT gateways, if any.

## Remote Network Environment

This section provides a high-level overview and example configuration for your remote network environment as described
in the AWS documentation under
[On-premises networking configuration](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).

### Prerequisites

- Access to your on-prem/remote core network devices with sufficient privileges to create and modify network
  configurations. This includes the following:

  - Permissions to define or adjust IP address allocations in the on-premises environment to avoid CIDR overlap with AWS
    VPCs.

  - Permissions to configure or update firewall rules and NAT settings.

### Configure Remote Network

1. Configure your Virtual Local Area Network (VLAN) or subnet definitions to a suitable IP range for your hybrid nodes.
   See
   [On-premises node and pod CIDRs](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem)
   for AWS requirements on CIDR blocks in remote networks.

   - Example hybrid node CIDR block = `10.200.0.0/16`
     - Example hybrid node subnets = `10.200.0.0/24`, `10.200.1.0/24`
   - Example pod CIDR block = `192.168.0.0/16`

2. Configure your NAT settings to allow outbound internet access from your hybrid nodes or, at a minimum, access to the
   necessary AWS services for
   [hybrid node installation and upgrade](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).

   The following tables are an example list of enabled URLs in the `us-east-1` region. All endpoints are accessed with
   the `HTTPS` protocol on port `443`.

   <Tabs queryString="on-prem-nat-example">

   <TabItem label="AWS Service Manager (SSM)" value="ssm">

   | Service                              | Endpoint URL                                            |
   | ------------------------------------ | ------------------------------------------------------- |
   | Amazon EKS                           | https://hybrid-assets.eks.amazonaws.com                 |
   | Amazon EKS                           | https://eks.us-east-1.amazonaws.com                     |
   | Amazon ECR                           | https://api.ecr.us-east-1.amazonaws.com                 |
   | Amazon EKS ECR                       | https://602401143452.dkr.ecr.us-east-1.amazonaws.com    |
   | AWS Systems Manager (SSM)            | https://amazon-ssm-us-east-1.s3.us-east-1.amazonaws.com |
   | AWS Systems Manager (SSM)            | https://ssm.us-east-1.amazonaws.com                     |
   | (Optional) AWS Systems Manager (SSM) | https://ec2messages.us-east-1.amazonaws.com             |
   | (Optional) Amazon CloudWatch Logs    | https://logs.us-east-1.amazonaws.com                    |
   | (Optional) Amazon S3                 | https://s3.us-east-1.amazonaws.com                      |

   </TabItem>

   <TabItem label="AWS IAM Roles Anywhere" value="iam-ra">

   | Service                                     | Endpoint URL                                         |
   | ------------------------------------------- | ---------------------------------------------------- |
   | Amazon EKS                                  | https://hybrid-assets.eks.amazonaws.com              |
   | Amazon EKS                                  | https://eks.us-east-1.amazonaws.com                  |
   | Amazon ECR                                  | https://api.ecr.us-east-1.amazonaws.com              |
   | Amazon EKS ECR                              | https://602401143452.dkr.ecr.us-east-1.amazonaws.com |
   | AWS IAM Roles Anywhere                      | https://rolesanywhere.amazonaws.com                  |
   | AWS IAM Roles Anywhere                      | https://rolesanywhere.us-east-1.amazonaws.com        |
   | (Optional) AWS IAM                          | https://iam.amazonaws.com                            |
   | (Optional) AWS Security Token Service (STS) | https://sts.us-east-1.amazonaws.com                  |
   | (Optional) Amazon CloudWatch Logs           | https://logs.us-east-1.amazonaws.com                 |
   | (Optional) Amazon S3                        | https://s3.us-east-1.amazonaws.com                   |

   </TabItem>

   </Tabs>

3. Configure your firewall rules to allow node and pod communication with necessary AWS services as described in
   [Access required for ongoing cluster operations](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).

   The following tables are example on-prem firewall rules for AWS services.

   <Tabs queryString="on-prem-firewall-aws">

   <TabItem label="Inbound Rules" value="inbound-rules">

   | Protocols | Port Range | Source           | Destination      |
   | --------- | ---------- | ---------------- | ---------------- |
   | TCP       | 10250      | `10.100.0.0/16`  | `10.200.0.0/16`  |
   | TCP       | 443        | `10.100.0.0/16`  | `192.168.0.0/16` |
   | TCP, UDP  | 53         | `192.168.0.0/16` | `192.168.0.0/16` |
   | TCP, UDP  | 443        | `192.168.0.0/16` | `192.168.0.0/16` |

   </TabItem>

   <TabItem label="Outbound Rules" value="outbound-rules">

   | Protocols | Port Range | Source           | Destination                                     |
   | --------- | ---------- | ---------------- | ----------------------------------------------- |
   | TCP       | 443        | `10.200.0.0/16`  | `10.100.0.0/16`                                 |
   | TCP       | 443        | `192.168.0.0/16` | `10.100.0.0/16`                                 |
   | TCP       | 443        | `10.200.0.0/16`  | `https://ssm.us-east-1.amazonaws.com`           |
   | TCP       | 443        | `10.200.0.0/16`  | `https://rolesanywhere.us-east-1.amazonaws.com` |
   | TCP       | 443        | `192.168.0.0/16` | `https://sts.us-east-1.amazonaws.com`           |
   | TCP       | 443        | `10.200.0.0/16`  | `https://eks.us-east-1.amazonaws.com`           |
   | TCP, UDP  | 53         | `192.168.0.0/16` | `192.168.0.0/16`                                |
   | TCP, UDP  | 443        | `192.168.0.0/16` | `192.168.0.0/16`                                |

   </TabItem>

   </Tabs>

4. Cilium is used as the Container Network Interface (CNI) for hybrid nodes and requires
   [additional firewall rules](https://docs.cilium.io/en/stable/operations/system_requirements/#firewall-rules) to allow
   health checks, Virtual Extensible LAN (VXLAN) overlay, and etcd access.

   The following tables are example on-prem firewall rules for Cilium and assumes that hybrid nodes will act as worker
   nodes with no VXLAN overlay.

   <Tabs queryString="on-prem-firewall-cilium">

   <TabItem label="Ingress Rules" value="ingress-rules">

   | Protocols | Port Range       | Source          | Destination     | Description                                      |
   | --------- | ---------------- | --------------- | --------------- | ------------------------------------------------ |
   | TCP       | 4240             | `10.100.0.0/16` | `10.200.0.0/16` | AWS to hybrid `cilium-health` monitoring.        |
   | TCP       | 4240             | `10.200.0.0/16` | `10.200.0.0/16` | Hybrid to hybrid `cilium-health` monitoring.     |
   | ICMP      | Type 0/8, Code 0 | `10.100.0.0/16` | `10.200.0.0/16` | AWS to hybrid node pings for `cilium-health`.    |
   | ICMP      | Type 0/8, Code 0 | `10.200.0.0/16` | `10.200.0.0/16` | Hybrid to hybrid node pings for `cilium-health`. |

   </TabItem>

   <TabItem label="Egress Rules" value="egress-rules">

   | Protocols | Port Range       | Source          | Destination     | Description                                      |
   | --------- | ---------------- | --------------- | --------------- | ------------------------------------------------ |
   | TCP       | 4240             | `10.200.0.0/16` | `10.100.0.0/16` | Hybrid to AWS `cilium-health` monitoring.        |
   | TCP       | 4240             | `10.200.0.0/16` | `10.200.0.0/16` | Hybrid to hybrid `cilium-health` monitoring.     |
   | ICMP      | Type 0/8, Code 0 | `10.200.0.0/16` | `10.100.0.0/16` | Hybrid to AWS node pings for `cilium-health`.    |
   | ICMP      | Type 0/8, Code 0 | `10.200.0.0/16` | `10.200.0.0/16` | Hybrid to hybrid node pings for `cilium-health`. |
   | TCP       | 2379-2380        | `10.200.0.0/16` | `10.100.0.0/16` | Hybrid to AWS etcd access.                       |

   </TabItem>

   </Tabs>

### Validate

1. Log in to your on-prem network management tool.

2. Check that the following network resources have been configured for hybrid nodes.

   - VLAN or subnets defined for appropriate IP ranges for hybrid nodes.
   - NAT settings for outbound access to AWS services.
   - Firewall rules for AWS services and Cilium operations.

3. (Optional) If you have an available host deployed within the VLAN or subnet, SSH into the host, and verify the host
   can connect to the required AWS and Spectro Cloud services.

   For example, if you have [netcat](https://linux.die.net/man/1/nc) installed, issue the following command on the edge
   host to check whether the `eks.us-east-1.amazonaws.com` domain is accessible on port `443`.

   ```bash
   nc -z --verbose eks.us-east-1.amazonaws.com 443
   ```

   Example output, if successful.

   ```shell
   Connection to eks.us-east-1.amazonaws.com port 443 [tcp/https] succeeded!
   ```

## Inter-Site Connectivity

### Prerequisites

- Access to your on-prem/remote core network devices with sufficient privileges to create and modify network
  configurations. This includes the following:

  - Permissions to configure or update VPN/security policies.

  - Permissions to adjust or introduce Border Gateway Protocol (BGP) or manage static routes that control traffic to and
    from AWS.

  - If using an IPsec VPN or similar encrypted connection, permissions to generate, install, and rotate certificates or
    keys on the local network equipment.

### Configure Inter-Site Connectivity

<!-- Provide details on typical VPN or AWS Direct Connect setups, including routing, BGP settings, and required IP address blocks. -->

1. Depending on your AWS networking requirements, create either a
   [virtual private gateway](https://docs.aws.amazon.com/directconnect/latest/UserGuide/create-virtual-private-gateway.html)
   or [transit gateway](https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html), and attach it to your VPC. Virtual
   private gateways are attached to a single VPC, whereas transit gateways can facilitate multiple VPCs.

   :::important

   If you are planning to use AWS Direct Connect, ensure that you create the gateway in the
   [AWS Direct Connect console](https://console.aws.amazon.com/directconnect/v2/home). If using AWS Site-to-Site VPN,
   create the gateway in the [AWS VPC console](https://console.aws.amazon.com/vpc/).

   :::

2. TBD

### Validate

1. If you have an available host deployed within the VLAN or subnet, SSH into the host, and attempt to reach
   your AWS VPC gateway.

   Replace `<awsVpcGateway>` with the IP address of your AWS VPC gateway, for example, `10.100.0.1`.

   ```shell
   ping <awsVpcGateway>
   ```

   Check that the ping statistics from the output show a healthy connection.

   Example healthy output.

   ```shell hideClipboard
   PING 10.100.0.1 (10.100.0.1) 56(84) bytes of data.
   64 bytes from 10.100.0.1: icmp_seq=1 ttl=64 time=27.5 ms
   64 bytes from 10.100.0.1: icmp_seq=2 ttl=64 time=28.2 ms
   64 bytes from 10.100.0.1: icmp_seq=3 ttl=64 time=29.1 ms
   64 bytes from 10.100.0.1: icmp_seq=4 ttl=64 time=27.9 ms
   --- 10.100.0.1 ping statistics ---
   4 packets transmitted, 4 received, 0% packet loss, time 3999ms
   rtt min/avg/max/mdev = 27.5/28.2/29.1/0.6 ms
   ```

2. If you have an EC2 instance available that has been deployed in your AWS VPC, attempt to reach an
   available host deployed within the on-prem VLAN or subnet.

   Replace `<hostIpAddress>` with the IP address of your on-prem host, for example, `10.200.1.23`.

   ```shell
   ping <hostIpAddress>
   ```

   Check that the ping statistics from the output show a healthy connection.

   Example healthy output.

   ```shell hideClipboard
   PING 10.200.1.23 (10.200.1.23) 56(84) bytes of data.
   64 bytes from 10.200.1.23: icmp_seq=1 ttl=64 time=27.5 ms
   64 bytes from 10.200.1.23: icmp_seq=2 ttl=64 time=28.2 ms
   64 bytes from 10.200.1.23: icmp_seq=3 ttl=64 time=29.1 ms
   64 bytes from 10.200.1.23: icmp_seq=4 ttl=64 time=27.9 ms
   --- 10.200.1.23 ping statistics ---
   4 packets transmitted, 4 received, 0% packet loss, time 3999ms
   rtt min/avg/max/mdev = 27.5/28.2/29.1/0.6 ms
   ```

## Next Steps

Complete the remaining sections as highlighted in [Prepare Environment](./prepare-environment.md).
