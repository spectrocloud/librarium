---
sidebar_label: "Edge Artifact Build Configurations"
title: "Edge Artifact Build Configurations"
description: "A reference document of the parameters using in the Edge artifact build process. "
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["edge"]
---

During the EdgeForge process, you provide an **.arg** document that contains a list of parameters to configure the build
of both the provider images and the Edge Installer ISO. This page lists the parameters available in the **.arg** file.

| **Argument**                  | **Description**                                                                                                                                                     | **Allowed Values**                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ARCH`                        | Architecture of the image. Required.                                                                                                                                | `amd64`, `arm64`.                                                                               |
| `AUTO_ENROLL_SECUREBOOT_KEYS` | Determines whether to auto enroll keys used for Trusted Boot.                                                                                                       | `true`, `false`. Default is `false`.                                                            |
| `CUSTOM_TAG`                  | A custom tag for the provider images. This custom tag will be appended to the `IMAGE_REGISTRY` and `IMAGE_REPO` parameters to form the full image tag.              | Lowercase alphanumeric string without spaces.                                                   |
| `FIPS_ENABLED`                | Whether to generate FIPS compliant binaries.                                                                                                                        | `true`, `false.` Default is `false`                                                             |
| `HTTP_PROXY`                  | URL of the HTTP Proxy server.                                                                                                                                       | URL string.                                                                                     |
| `HTTPS_PROXY`                 | URL of the HTTPS Proxy server.                                                                                                                                      | URL string.                                                                                     |
| `IMAGE_REGISTRY`              | The image registry to use for tagging the generated provider images. Required.                                                                                      | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud. |
| `IMAGE_REPO`                  | The image repository to use for tagging the generated provider images. Required.                                                                                    | Your image repository name.                                                                     |
| `INCLUDE_MS_SECUREBOOT_KEYS`  | Whether to include Microsoft's secure boot keys in the set of keys to enroll in your device for secure boot. Almost every machine requires these keys.              | `true`, `false`. Default is `true`.                                                             |
| `ISO_NAME`                    | Name of the Installer ISO file. Required.                                                                                                                           | Lowercase alphanumeric string without spaces. The characters `-` and `_` are allowed.           |
| `IS_UKI`                      | Determines whether to build a Unified Kernel Image (UKI) to enabled Trusted Boot. Refer to [Trusted Boot](../../trusted-boot/trusted-boot.md) for more information. | `true`, `false`. Default is `false`.                                                            |
| `K8S_DISTRIBUTION`            | Kubernetes distribution.                                                                                                                                            | ` k3s`, `rke2`, `kubeadm`, `kubeadm-fips`.                                                      |
| `NO_PROXY`                    | URLS that should be excluded from the proxy.                                                                                                                        | Comma-separated URL string.                                                                     |
| `OS_DISTRIBUTION`             | OS distribution.                                                                                                                                                    | `ubuntu`, `opensuse-leap`, `rhel`.                                                              |
| `OS_VERSION`                  | OS version. This applies to Ubuntu only.                                                                                                                            | `20`, `22`.                                                                                     |
| `PROXY_CERT_PATH`             | Absolute path of the SSL Proxy certificate in the PEM format.                                                                                                       | Absolute path string.                                                                           |
| `UKI_SELF_SIGNED_KEYS`        | Determines whether to use exported keys during Trusted Boot key generation. If you want to use exported keys, you must set this argument to `false`.                | `true`, `false`. Default is `true`.                                                             |
| `UPDATE_KERNEL`               | Determines whether to upgrade the Kernel version to the latest from the upstream OS provider.                                                                       | `true`, `false`.                                                                                |
