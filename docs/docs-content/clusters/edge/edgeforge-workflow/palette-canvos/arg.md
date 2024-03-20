---
sidebar_label: "Edge Artifact Build Configurations"
title: "Edge Artifact Build Configurations"
description: "A reference document of the parameters using in the Edge artifact build process. "
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["edge"]
---

During the EdgeForge process, you provide an **args** document that contains a list of parameters to configure the build
of both the provider images and the Edge Installer ISO. This page lists the parameters available in the **.arg** file.

| **Argument**       | **Description**                                                                              | **Allowed Values**                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `CUSTOM_TAG`       | Tag for the provider images.                                                                 | Lowercase alphanumeric string without spaces.                                                  |
| `IMAGE_REGISTRY`   | Image registry name.                                                                         | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud |
| `OS_DISTRIBUTION`  | OS Distribution.                                                                             | ubuntu, opensuse-leap                                                                          |
| `IMAGE_REPO`       | Image repository name. It is the same as the OS distribution.                                | Your image repository name.                                                                    |
| `OS_VERSION`       | OS version. This only applies to Ubuntu.                                                     | 20, 22                                                                                         |
| `K8S_DISTRIBUTION` | Kubernetes distribution.                                                                     | k3s, rke2, kubeadm                                                                             |
| `ISO_NAME`         | Name of the Installer ISO file.                                                              | Lowercase alphanumeric string without spaces. The characters `-` and `_` are allowed.          |
| `ARCH`             | Architecture of the image.                                                                   | `amd64`, `arm64`                                                                               |
| `FIPS_ENABLED`     | Where to generate FIPS compliant binaries `true`or`false`                                    | `true`, `false`                                                                                |
| `HTTP_PROXY`       | URL of the HTTP Proxy server.                                                                | URL string                                                                                     |
| `HTTPS_PROXY`      | URL of the HTTPS Proxy server.                                                               | URL string                                                                                     |
| `NO_PROXY`         | URLS that should be excluded from the proxy.                                                 | Comma separated URL string                                                                     |
| `PROXY_CERT_PATH`  | Absolute path of the SSL Proxy certificate in PEM format.                                    | Absolute path string                                                                           |
| `UPDATE_KERNEL`    | Determines whether to upgrade the Kernel version to the latest from the upstream OS provider | `true`, `false`                                                                                |
