---
sidebar_label: "Configuration Reference"
title: "Configuration Reference"
description: "Learn about the configuration options available for the CAPI Image Builder project."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["operating system", "byoos", "capi image builder"]
---

The CAPI Image Builder utility is configured using a configuration file that includes the parameters documented below.
Review these parameters to understand how to tailor the CAPI Image Builder to your specific use case.

:::warning

At this time, VMware vSphere is the only supported infrastructure provider for the CAPI Image Builder.

:::

## Operating System Configuration

| Parameter                | Description                                                                                                                                                                                              | Required |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `os_versions`            | A list of operating system versions to build. Available options are `rhel-8`, `rhel-9`, `rockylinux-8`, `rockylinux-9`.                                                                                  | Yes      |
| `image_type`             | The type of image to build. Available options are `standard` or `fips`.                                                                                                                                  | Yes      |
| `rhel_subscription_user` | The RHEL subscription username to use when building the image. No value is required if creating a RHEL image in an airgapped environment (`airgap=true`) with CAPI Image Builder version 4.6.0 or later. | No       |
| `rhel_subscription_pass` | The RHEL subscription password to use when building the image. No value is required if creating a RHEL image in an airgapped environment (`airgap=true`) with CAPI Image Builder version 4.6.0 or later. | No       |

## Image Configuration

| Parameter    | Description                                                                                      | Required |
| ------------ | ------------------------------------------------------------------------------------------------ | -------- |
| `image_name` | The name of the image to build.                                                                  | Yes      |
| `cloud_type` | The cloud type to build the image for. Available options are `aws`, `azure`, `gcp` and `vmware`, | Yes      |

## Kubernetes Configuration

Refer to the [CAPI Image Builder Compatibility Matrix](./comp-matrix-capi-builder.md) file for a list of supported
Kubernetes versions and the corresponding compatible versions of its dependencies.

| Parameter            | Description                                                                   | Required |
| -------------------- | ----------------------------------------------------------------------------- | -------- |
| `k8s_version`        | The Kubernetes version to use when building the image.                        | Yes      |
| `cni_version`        | The Container Network Interface (CNI) version to use when building the image. | Yes      |
| `containerd_version` | The containerd version to use when building the image.                        | Yes      |
| `crictl_version`     | The crictl version to use when building the image.                            | Yes      |

## ISO Configuration

| Parameter      | Description                                                                                                                       | Required |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `iso_name`     | The name of the ISO file to use when building the image. The ISO file is expected to be located inside the **output** folder.     | Yes      |
| `iso_checksum` | The SHA256 checksum of the ISO file to use when building the image. The checksum is used to verify the integrity of the ISO file. | Yes      |

## Infrastructure Configuration

Fill out the parameters below for the infrastructure provider for which you are building the image. These parameters are
required for authenticating with the provider and uploading the image. Do not fill in the parameters for any other
providers.

:::info

Only one infrastructure provider can be used at a time. If you need to build images for multiple providers, you need to
create a separate configuration file for each.

:::

### AWS

| Parameter        | Description                                        | Required |
| ---------------- | -------------------------------------------------- | -------- |
| `aws_access_key` | The AWS access key to use when building the image. | Yes      |
| `aws_secret_key` | The AWS secret key to use when building the image. | Yes      |

### Azure

| Parameter               | Description                                               | Required |
| ----------------------- | --------------------------------------------------------- | -------- |
| `azure_client_id`       | The Azure client ID to use when building the image.       | Yes      |
| `azure_client_secret`   | The Azure client secret to use when building the image.   | Yes      |
| `azure_subscription_id` | The Azure subscription ID to use when building the image. | Yes      |
| `azure_location`        | The Azure location to use when building the image.        | Yes      |
| `azure_storage_account` | The Azure storage account to use when building the image. | Yes      |
| `azure_resource_group`  | The Azure resource group to use when building the image.  | Yes      |

### GCP

| Parameter          | Description                                                                         | Required |
| ------------------ | ----------------------------------------------------------------------------------- | -------- |
| `google_app_creds` | The path to the Google Application Credentials file to use when building the image. | Yes      |
| `gcp_project_id`   | The GCP project ID to use when building the image.                                  | Yes      |

### VMware

| Parameter               | Description                                                                                                              | Required |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| `vcenter_server`        | The vCenter server to use when building the image. Provide either a Fully Qualified Domain Name (FQDN) or an IP address. | Yes      |
| `vcenter_user`          | The vCenter user to use when building the image.                                                                         | Yes      |
| `vcenter_password`      | The vCenter password to use when building the image.                                                                     | Yes      |
| `vcenter_datacenter`    | The vCenter data center to use when building the image.                                                                  | Yes      |
| `vcenter_datastore`     | The vCenter datastore to use when building the image.                                                                    | Yes      |
| `vcenter_network`       | The vCenter network to use when building the image.                                                                      | Yes      |
| `vcenter_folder`        | The vCenter folder to use when building the image.                                                                       | Yes      |
| `vcenter_cluster`       | The vCenter cluster to use when building the image.                                                                      | Yes      |
| `vcenter_resource_pool` | The vCenter resource pool to use when building the image.                                                                | Yes      |

## Airgap Configuration

Fill out the parameters below if you are building the image in an air-gapped environment. Otherwise, you can skip this
section.

| Parameter   | Description                                                                                                                                                                                                                                                                                                                                                                                                | Required |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `airgap`    | Set to `true` if you are building the image in an air-gapped environment.                                                                                                                                                                                                                                                                                                                                  | Yes      |
| `airgap_ip` | The IP address or hostname of the airgap support VM that has the required dependencies. Refer to the [self-hosted Palette](../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/airgap.md) and [Palette Vertex](../../self-hosted-setup/vertex/supported-environments/vmware/setup/airgap/airgap.md) Environment Setup pages for instructions on how to deploy an airgap support VM. | Yes      |

## Example Configuration

```text
os_version=rhel-8
image_type=standard
rhel_subscription_user='demo@spectrocloud.com'
rhel_subscription_pass='***********'


image_name=rhel-8-custom
cloud_type=vmware


k8s_version=1.28.9
cni_version=1.2.0
containerd_version=1.7.13
crictl_version=1.26.0


iso_name=rhel-8.8-x86_64-dvd.iso
iso_checksum=517abcc67ee3b7212f57e180f5d30be3e8269e7a99e127a3399b7935c7e00a09


vcenter_server=example.vcenter.dev
vcenter_user=demo@vsphere.local
vcenter_password='***********'
vcenter_datacenter=Datacenter
vcenter_datastore=vsanDatastorePrimary
vcenter_network=NETOWRK-1
vcenter_folder=teamA
vcenter_cluster=teamA-cluster
vcenter_resource_pool=teamA-resource-pool
```
