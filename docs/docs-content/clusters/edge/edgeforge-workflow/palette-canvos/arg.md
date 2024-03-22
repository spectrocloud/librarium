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

| **Argument**       | **Description**                                                                                                                                        | **Allowed Values**                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `ARCH`             | Architecture of the image.                                                                                                                             | `amd64`, `arm64`                                                                               |
| `CUSTOM_TAG`       | A custom tag for the provider images. This custom tag will be appended to the `IMAGE_REGISTRY` and `IMAGE_REPO` parameters to form the full image tag. | Lowercase alphanumeric string without spaces                                                   |
| `FIPS_ENABLED`     | Whether to generate FIPS compliant binaries.                                                                                                           | `true`, `false`                                                                                |
| `HTTP_PROXY`       | URL of the HTTP Proxy server.                                                                                                                          | URL string                                                                                     |
| `HTTPS_PROXY`      | URL of the HTTPS Proxy server.                                                                                                                         | URL string                                                                                     |
| `IMAGE_REGISTRY`   | Image registry name.                                                                                                                                   | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud |
| `IMAGE_REPO`       | Image repository name. It is the same as the OS distribution.                                                                                          | Your image repository name.                                                                    |
| `ISO_NAME`         | Name of the Installer ISO file.                                                                                                                        | Lowercase alphanumeric string without spaces. The characters `-` and `_` are allowed.          |
| `K8S_DISTRIBUTION` | Kubernetes distribution.                                                                                                                               | k3s, rke2, kubeadm                                                                             |
| `NO_PROXY`         | URLS that should be excluded from the proxy.                                                                                                           | Comma separated URL string                                                                     |
| `OS_DISTRIBUTION`  | OS distribution.                                                                                                                                       | ubuntu, opensuse-leap, rhel                                                                    |
| `OS_VERSION`       | OS version. This only applies to Ubuntu.                                                                                                               | 20, 22                                                                                         |
| `PROXY_CERT_PATH`  | Absolute path of the SSL Proxy certificate in PEM format.                                                                                              | Absolute path string                                                                           |
| `UPDATE_KERNEL`    | Determines whether to upgrade the Kernel version to the latest from the upstream OS provider                                                           | `true`, `false`                                                                                |
