---
sidebar_label: "Prepare Environment"
title: "Prepare Environment"
description: "Learn how to prepare your AWS Outposts enviroment."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 20
---

Your AWS Outposts server requires you to configure your capacity and a subnet before you can use it with Palette.

## Prerequisites

- An installed [AWS Outposts server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html). AWS
  manages the delivery and initial configuration of the AWS outposts server at your site.

- An active Palette account.

- Access to the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

- A Virtual Private Cloud (VPC) configured for use with AWS Outposts.

## Configure the Capacity

Perform the following steps to set your AWS Outposts server capacity.

1. Log in to the [AWS Console](https://console.aws.amazon.com). Select the **AWS Outposts** service.

2. Select your Outposts server.

3. Select **Capacity tasks** from the left main menu. Click **Create capacity task**.

4. Select the **Resource ID** corresponding to your Outpost server.

5. Select the **Asset ID** corresponding to the **C6id** instance family. Click **Next**.

6. Set the **Instance size** to **c6id.metal** and the **Instance quantity** to **1**. Click **Next**.

   ![AWS Outposts Capacity configuration](/aws_outposts-capacity-config.webp "Capacity configuration example")

7. Review your changes and create the capacity task.

The capacity creation may take a few hours.

## Create a Subnet

1. Log in to the [AWS Console](https://console.aws.amazon.com). Select the **AWS Outposts** service.

2. Select your AWS Outposts server.

3. From the **Actions** menu, select **Create a subnet**.

4. Select the **VPC ID** corresponding to your Outposts instance.

5. Fill in a CIDR block corresponding to your environment in the **IPv4 subnet CIDR block** field.

6. Select **Create subnet**.

7. In the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html), execute the
   following command to enable the subnet as a Local Network Interface (LNI) for anything with device index 1, allowing
   Palette Edge to communicate with your server.

   ```bash
   aws ec2 modify-subnet-attribute
   --subnet-id <subnet-id>
   --enable-lni-at-device-index 1
   ```

   :::info

   Make a note of your new subnet name. It is required to create your Edge host.

   :::

## Next steps

- [Deploy Edge on AWS Outposts](./configure-edge-on-aws-outpost.md)
