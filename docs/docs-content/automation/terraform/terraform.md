---
sidebar_label: "Terraform"
title: "Terraform"
description: "Learn how to use Terraform with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["terraform"]
---

Palette supports the Infrastructure as Code (IaC) software tool, [Terraform](https://developer.hashicorp.com/terraform),
to provide consistent CLI workflow support to multiple cloud providers.

Terraform organizes cloud APIs into declarative configuration files, allowing users to define their infrastructure as
code. Terraform validates configuration files and checks whether the execution plan for a configuration matches
expectations before deployment, and applies the changes to managed resources accordingly.

## Spectro Cloud Provider

Palette and Palette VerteX API can be used with the Spectro Cloud Terraform provider. The provider is available in the
HashiCorp Terraform registry and offers detailed
[documentation](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) on supported data sources
and resources.

### Limitations

The provider does not support resource management across different contexts within a single provider configuration. For
example, it is not possible to create a cluster profile within the Tenant scope and a cluster that uses this profile
within the Project scope using the same provider initialization. Separate providers must be used to manage resources
across different scopes.

### Release Notes

Information about the latest changes in the Spectro Cloud provider can be found in the
[release notes](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Government Cloud Support

The Spectro Cloud Terraform provider supports deploying resources to government clouds that meet strict security and
compliance requirements:

- [AWS GovCloud](https://aws.amazon.com/govcloud-us/) - To leverage the government partition, set `partition` as
  `aws-us-gov` when creating an
  [AWS cloud account](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_aws).

- [Azure Government](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome) - To
  leverage the government partition, set `cloud` as `AzureUSGovernmentCloud` when creating an
  [Azure cloud account](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cloudaccount_azure).

### Modules

Two modules are available to help you provision Spectro Cloud infrastructure resources.

- [Palette Edge Native Terraform Module](https://registry.terraform.io/modules/spectrocloud/edge/spectrocloud/latest)
- [Spectro Cloud Terraform Modules](https://registry.terraform.io/modules/spectrocloud/modules/spectrocloud/latest)

Refer to the
[Spectro Cloud Modules](https://github.com/spectrocloud/terraform-spectrocloud-modules#module-resources--requirements)
README file to learn more about supported provider versions and other essential requirements.

## Get Started

For an end-to-end cluster provisioning example, refer to the [Getting Started](/getting-started/) tutorials and the
[end-to-end examples](https://github.com/spectrocloud/terraform-provider-spectrocloud/tree/main/examples/e2e) available
in the Spectro Cloud Terraform Provider GitHub repository.

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
