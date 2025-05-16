---
sidebar_label: "Network Diagnostic Tools"
title: "Network Diagnostic Tools"
description: "Instructions for using diagnostic tools within Local UI."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

Local UI includes the ping and traceroute diagnostic tools. These tools have the same functionality as the command-line
tools, but are accessible through a web interface. You can use these diagnostic tools to help troubleshoot network
issues without having to establish an SSH connection to your Edge host.

In air-gapped environments, you can use these tools to verify the connection to an endpoint within the network. For
locally managed clusters with proxy or in connected environments, you can use these tools to verify the connection to an
endpoint outside the network, based on the scope of the connectivity. For example, these tools are useful to check if
the Edge Host can connect to the internet or an external registry or to make sure there is no external connectivity in
an air-gapped environment.

## Use Ping to Test Network Connection

### Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Use Ping to Check Connection to a Specific Endpoint

1. Log in to [Local UI](./access-console.md).

2. From the left **Main Menu**, click **Diagnostics**.

3. From the **Diagnostics** page, click on the **Connectivity** tab.

4. Click on **Ping**.

5. In the **endpoint** field, enter the endpoint you would like to test the connection to. For example, if you want to
   make sure your Edge host has connection to a image registry within your network at 10.10.153.43:8000, you would enter
   10.10.153.43:8000.

6. Click **Run**.

7. If ping produces output similar to the following, you are connected to the endpoint.

   ```
   64 bytes from 10.10.153.43: icmp_seq=0 ttl=112 time=13.208 ms
   64 bytes from 10.10.153.43: icmp_seq=1 ttl=112 time=7.184 ms
   64 bytes from 10.10.153.43: icmp_seq=2 ttl=112 time=7.748 ms
   64 bytes from 10.10.153.43: icmp_seq=3 ttl=112 time=6.724 ms
   64 bytes from 10.10.153.43: icmp_seq=4 ttl=112 time=6.394 ms
   64 bytes from 10.10.153.43: icmp_seq=5 ttl=112 time=8.540 ms
   64 bytes from 10.10.153.43: icmp_seq=6 ttl=112 time=7.160 ms
   ```

   If ping produces output containing messages such as "Destination Host Unreachable" or "100% packet loss," then you
   are not connected to the endpoint.

### Validate

Depending on the endpoint you are trying to test, you can use other tools to validate the results of ping. For example,
if you are trying to reach a REST API endpoint, you can use curl to make an HTTP request to the endpoint to validate the
results of ping.

## Use Traceroute to Test Network Connection

The traceroute diagnostic tool is similar to ping, but it produces more detailed output in that it displays the route to
a destination. Traceroute is useful for you to determine at which point along the path the packets are being delayed or
lost.

### Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Use Traceroute to Check Connection to a Specific Endpoint

1. Log in to [Local UI](./access-console.md).

2. From the left **Main Menu**, click **Diagnostics**.

3. From the **Diagnostics** page, click on the **Connectivity** tab.

4. Click on **Traceroute**.

5. In the **endpoint** field, enter the endpoint you would like to test the connection to. For example, if you are
   having DNS issues and want to test your connection to your DNS server at 203.0.113.4, you would input 203.0.113.4.

6. Click **Run**.

7. If traceroute produces output similar to the following, you can tell from the response which part of the network is
   having issues.

   ```
   traceroute to 203.0.113.4 (203.0.113.4), 30 hops max, 60 byte packets
    1  192.168.1.1 (192.168.1.1)  1.242 ms  1.013 ms  1.004 ms
    2  10.245.32.1 (10.245.32.1)  11.123 ms  10.896 ms  10.876 ms
    3  100.64.0.2 (100.64.0.2)  20.455 ms  20.431 ms  20.409 ms
    4  172.16.0.1 (172.16.0.1)  30.678 ms  30.654 ms  30.635 ms
    5  * * *
    6  * * *
    7  * * *
    8  * 203.0.113.4 (203.0.113.4)  100.123 ms *
   ```

   Hops one through four produced normal responses, possibly indicating that the network between the host and your
   Internet Service Provider (ISP) has no issues. Hops five through seven received no response. Finally, hop eight
   received only one response out of three requests, and the one response took significantly longer. This often
   indicates that there are some network issues at or near the DNS server.

### Validate

Depending on the endpoint you are trying to reach, you can use different methods to validate the results. For example,
if you are observing issues near the DNS server, you can try to specify a well-known DNS server such as 8.8.8.8 (Google
Public DNS) to test if it improves the connection. If it does, this can help validate the initial traceroute results
pointed towards a DNS issue.
