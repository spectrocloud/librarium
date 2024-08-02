---
sidebar_label: "Bring Your Own OS (BYOOS)"
title: "Bring your own OS (BYOOS)"
description: "Bring Your Own OS (BYOOS) pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ["operating system", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image.webp"
tags: ["packs", "byoos", "operating system"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.0.x" value="1.0.x">

## Reference Custom Image

Different infrastructure providers have different ways of referencing custom images. The following table provides
examples of how to reference custom images for different infrastructure providers.

| Provider       | Example Image ID                                            | osImageOverride Value                                       | Notes                                                                                                                |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| AWS            | `ami-0f4804aff4cf9c5a2`                                     | `ami-0f4804aff4cf9c5a2`                                     | Ensure the AMI is available in the same region as the workload cluster.                                              |
| Azure          | `https://docs.blob.core.windows.net/vhds/ubuntu20-1243.vhd` | `https://docs.blob.core.windows.net/vhds/ubuntu20-1243.vhd` | You must reference the Azure blob URL of a Virtual Hard Disk (VHD). Image Gallery ID reference is not supported.     |
| Vmware vSphere | `r_u-2004-0-k-1243-0-new.ova`                               | `path/to/template/r_u-2004-0-k-1243-0-new.ova`              | Point to the path to where the custom template is located. Palette and VerteX expect OVAs to have the `r_u-` prefix. |
| Vmware vSphere | `rhel-8-kube-v1.27.11`                                      | `path/to/template/rhel-8-kube-v1.27.11`                     | Point to the path to where the custom template is located.                                                           |

Image creation tools are available to help you create custom OS images for the infrastructure provider you are using.
The following is a list of commonly used tools for creating a custom OS:

- [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/).

- [Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview?tabs=azure-powershell).

- [HashiCorp Packer](https://developer.hashicorp.com/packer).

- [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html).

</TabItem>
</Tabs>

## Terraform

You can retrieve details about the BYOOS pack by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "generic-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
