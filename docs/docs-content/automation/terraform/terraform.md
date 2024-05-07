---
sidebar_label: "Terraform"
title: "Terraform"
description: "Learn how to use Terraform with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["terraform"]
---

Palette supports the Infrastructure as Code (IaC) software tool, [Terraform](https://www.terraform.io/), to provide
consistent CLI workflow support to multiple cloud providers.

Terraform organizes cloud APIs into declarative configuration files, allowing users to define their infrastructure as
code. Terraform validates configuration files and checks whether the execution plan for a configuration matches
expectations before deployment, and applies the changes to managed resources accordingly.

## Spectro Cloud Provider

Palette and Palette VerteX API can be used with the Spectro Cloud Terraform provider. The provider is available in the
HashiCorp Terraform registry as the
[Spectro Cloud Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Release Notes

Information about the latest changes in the Spectro Cloud provider can be found in the
[release notes](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Provider Documentation

Detailed documentation on supported data sources and resources are available in the Terraform Spectro Cloud Provider
[documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) page.

### Modules

Two modules are available to help you provision Spectro Cloud infrastructure resources.

- [Palette Edge Native Terraform Module](https://registry.terraform.io/modules/spectrocloud/edge/spectrocloud/latest)
- [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest)

Refer to the
[Spectro Cloud Modules](https://github.com/spectrocloud/terraform-spectrocloud-modules#module-resources--requirements)
README file to learn more about supported provider versions and other essential requirements.

## Get Started

For an end-to-end cluster provisioning example, refer to the
[Deploy a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md) tutorial and the
[end-to-end examples](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/e2e) available
in the Spectro Cloud Terraform Provider GitHub repository.

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
