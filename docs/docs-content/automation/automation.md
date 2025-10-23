---
sidebar_label: "Automation"
title: "Automation"
description: "Learn how to use automation tools with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "terminal"
tags: ["automation"]
---

This section contains documentation and guides for tools essential in automating tasks with Palette:

- Palette CLI - Enables users to interact with Palette and create and manage resources, such as projects, virtual
  clusters, and more. The Palette CLI is the primary method for installing
  [self-hosted Palette](../self-hosted-setup/palette/palette.md) and
  [Palette VerteX](../self-hosted-setup/vertex/vertex.md), as well as deploying a
  [Private Cloud Gateway](../clusters/pcg/pcg.md).

- Palette Go SDK - Enables developers to interact with Palette APIs for automated resource management using Go.

- Palette Terraform Provider - Allows users to use [Terraform](https://developer.hashicorp.com/terraform) for automating
  the deployment and management of Palette resources such as cluster profiles, cloud accounts, clusters, and more.

- Palette Crossplane Provider - Allows users to use [Crossplane](https://docs.crossplane.io/) to provision and manage
  Palette resources through standard Kubernetes APIs.

## Resources

- [Palette CLI](./palette-cli/palette-cli.md)
- [Palette Go SDK](./palette-sdk/palette-sdk.md)
- [Palette Terraform Provider](./terraform/terraform.md)
- [Palette Crossplane Provider](./crossplane/crossplane.md)
