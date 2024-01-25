---
sidebar_label: "Terraform Support"
title: "Terraform Support"
description: "Learn how to use Terraform with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 200
sidebar_custom_props:
  icon: "terraform"
tags: ["terraform"]
---

Palette supports the open-source Infrastructure as Code (IaC) software tool, [Terraform](https://www.terraform.io/), to
provide consistent CLI workflow support to multiple cloud services.

Terraform organizes cloud APIs into declarative, configuration files. Terraform supports the ability to write
configuration files, checks whether the execution plan for a configuration matches your expectations (before
deployment), and applies the changes to all the managed resources.

## Spectro Cloud Provider

Palette and Palette VerteX API can be used with the Spectro Cloud Terraform provider. The provider is available in the
HashiCorp Terraform registry as
[Spectro Cloud Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

<br />

### Release Notes

Information about the latest changes in the Spectro Cloud provider can be found in the
[release notes](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

<br />

### Provider Documentation

Detailed documentation on supported data sources and resources are available in the Terraform Spectro Cloud Provider
[documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) page.

<br />

## Usage

For an end-to-end cluster provisioning example, check out the
[end-to-end examples](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/e2e).

You can find resource examples in the
[resource directory](https://registry.terraform.io/providers/spectrocloud/spectrocloud).

## Modules

There are two modules available to help you provision Spectro Cloud infrastructure resources.

- [Palette Edge Native Terraform Module](https://registry.terraform.io/modules/spectrocloud/edge/spectrocloud/latest)
- [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest)

Review the
[Spectro Cloud modules readme](https://github.com/spectrocloud/terraform-spectrocloud-modules#module-resources--requirements)
document to learn more about supported provider versions and other requirements.
