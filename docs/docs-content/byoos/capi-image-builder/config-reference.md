---
sidebar_label: "Configuration Reference"
title: "Configuration Reference"
description: "Learn about the configuration options available for the CAPI Image Builder project."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["operating system", "byoos", "capi iamge builder"]
---

The CAPI Image Builder utility is configured through a configuration file. The configuration file is made up of the
following parameters. Review the parameters below to understand how to configure the CAPI Image Builder for your use
case.

## Operating System Configurations

| Parameter                | Description                                                                                                             | Required |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| `os_versions`            | A list of operating system versions to build. Available options are `rhel-8`, `rhel-9`, `rockylinux-8`, `rockylinux-9`. | Yes      |
| `image_type`             | The type of image to build. Available options `standard` or `fips`.                                                     | Yes      |
| `rhel_subscription_user` | The RHEL subscription username to use when building the image.                                                          | No       |
| `rhel_subscription_pass` | The RHEL subscription password to use when building the image.                                                          | No       |

## Image Configurations

| Parameter    | Description                                                                                      | Required |
| ------------ | ------------------------------------------------------------------------------------------------ | -------- |
| `image_name` | The name of the image to build.                                                                  | Yes      |
| `cloud_type` | The cloud type to build the image for. Available options are `aws`, `azure`, `gcp` and `vmware`, | Yes      |

## Kubernetes Configurations

| Parameter            | Description                                                                          | Required |
| -------------------- | ------------------------------------------------------------------------------------ | -------- |
| `k8s_version`        | The version of Kubernetes to use when building the image.                            | Yes      |
| `cni_version`        | The version of the Container Network Interface (CNI) to use when building the image. | Yes      |
| `containerd_version` | The version of containerd to use when building the image.                            | Yes      |
| `crictl_version`     | The version of crictl to use when building the image.                                | Yes      |

## ISO Configurations

| Parameter      | Description                                                                                                                       | Required |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `iso_name`     | The name of the ISO file to use when building the image. The ISO file is expected to be located inside the **output** folder.     | Yes      |
| `iso_checksum` | The SHA256 checksum of the ISO file to use when building the image. The checksum is used to verify the integrity of the ISO file. | Yes      |

## Infrastructure Configurations

Fill out the parameters below for the cloud provider you are building the image for. The parameters are used to
authenticate with the cloud provider and to upload the image to the cloud provider.

:::info

Only one cloud provider can be used at a time. If you are building the image for multiple cloud providers, you need to
create separate configurations for each cloud provider. Only the parameters for the selected cloud provider are
required.

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
| `vcenter_datacenter`    | The vCenter datacenter to use when building the image.                                                                   | Yes      |
| `vcenter_datastore`     | The vCenter datastore to use when building the image.                                                                    | Yes      |
| `vcenter_network`       | The vCenter network to use when building the image.                                                                      | Yes      |
| `vcenter_folder`        | The vCenter folder to use when building the image.                                                                       | Yes      |
| `vcenter_cluster`       | The vCenter cluster to use when building the image.                                                                      | Yes      |
| `vcenter_resource_pool` | The vCenter resource pool to use when building the image.                                                                | Yes      |

## Airgap Configurations

Fill out the parameters below if you are building the image in an air-gapped environment. Otherwise, you can skip this
section.

| Parameter           | Description                                                                      | Required |
| ------------------- | -------------------------------------------------------------------------------- | -------- |
| `airgap`            | Set to `true` if you are building the image in an air-gapped environment.        | Yes      |
| `airgap_ip`         | The IP address of the machine that has the required dependencies.                | Yes      |
| `k8s_rpm_key`       | The GPG key to use when installing the Kubernetes RPMs.                          | Yes      |
| `k8s_rpm_server`    | The IP address or FQDN of the server to use when installing the Kubernetes RPMs. | Yes      |
| `containerd_url`    | The URL to use when downloading the containerd binary.                           | Yes      |
| `crictl_url`        | The URL to use when downloading the crictl binary.                               | Yes      |
| `k8s_container_reg` | The URL of the container registry to use when downloading the Kubernetes images. | Yes      |
| `cert_url`          | The URL to use when downloading the certificate file.                            | Yes      |

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
