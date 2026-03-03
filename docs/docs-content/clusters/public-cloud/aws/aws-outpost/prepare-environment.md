---
sidebar_label: "Prepare Environment"
title: "Prepare Environment"
description: "Learn how to prepare your AWS Outposts enviroment."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 20
---

Your AWS Outposts server requires you to configure your capacity and a subnet before you can convert it to an Edge
instance.

:::info

You only need to configure your AWS Outposts once for each Outpost.

:::

## Prerequisites

- An active Palette account.
- An installed [AWS Outposts server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html).
- Access to the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
- An AWS [EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html).

## Configure the Outpost's capacity

Perform the following steps to set your AWS Outposts server capacity. It may take several hours for your server to
configure your chosen capacity.

1. Log in to the [AWS Outposts console](https://console.aws.amazon.com/outposts).
2. Select your Outposts server.
3. [Create a capacity task](https://docs.aws.amazon.com/outposts/latest/userguide/modify-instance-capacity.html). Set
   the **Instance size** to **c6id.metal** and the **Instance quantity** to **1**.

   :::info

   Palette only supports AWS Outposts servers with one instance.

   :::

4. **Remove** any previously created instances.

   ![AWS Outposts Capacity configuration](/aws_outposts-capacity-config.webp "Capacity configuration example")

## Create a subnet

1. Log in to the [AWS Outposts console](https://console.aws.amazon.com/outposts).
2. Select your AWS Outposts server.
3. [Create a subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet)
   for your Outpost.

4. In the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html), enable the new
   subnet for your local network. You must set the secondary instance to a value of **1**. This ensures that Palette
   Edge can communicate properly with your server.

   ```bash

   aws ec2 modify-subnet-attribute
   --subnet-id <subnet-id>
   --enable-lni-at-device-index 1

   ```

   :::info

   Make a note of your new subnet name. It is required to create your Edge host.

   :::

Refer to [Configure Edge on AWS Outposts](./configure-edge-on-aws-outpost.md) to configure your edge host.