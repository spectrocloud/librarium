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

This section contains documentation and guides essential for automating tasks with Palette. These resources cover the
Palette CLI, Palette Terraform provider, and Palette Crossplane provider.

The [Palette CLI](./palette-cli/palette-cli.md) has multiple functionalities that allow users to interact with Palette
and create and manage resources, such as projects, virtual clusters, and more. The Palette CLI is the primary method for
installing a self-hosted Palette instance and deploying a Private Cloud Gateway. You can leverage the Palette CLI in
Continuous Delivery/Continuous Deployment (CI/CD) pipelines and other automation tasks.

Palette also supports Infrastructure as Code (IaC) tools and workflows. We expose two providers to help you start
managing Palette resources through automation. You can use our [Palette Terraform provider](./terraform/terraform.md) or
our [Palette Crossplane provider](./crossplane/crossplane.md) to get started with IaC workflows. Use either provider to
deploy and manage Palette resources such as cluster profiles, cloud accounts, clusters, and more.

## Resources

- [Palette CLI](./palette-cli/install-palette-cli.md)
- [Terraform Support](./terraform/terraform.md)
- [Crossplane Support](./crossplane/crossplane.md)
