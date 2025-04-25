---
sidebar_label: "CAPI Image Builder Downloads"
title: "CAPI Image Builder Downloads"
description: "Download links relating to the CAPI Image Builder."
hide_table_of_contents: false
draft: true
sidebar_position: 60
sidebar_custom_props:
  icon: "cubes"
tags: ["downloads", "byoos", "vmware", "airgap"]
---

## Download CAPI Image Builder

The following sections provide links to download the CAPI Image Builder depending on your environment.

### Non-Airgap

Download the CAPI Image Builder repository using either Docker or Podman.

<Tabs>
<TabItem value="Docker" label="Docker">

```shell
docker pull gcr.io/spectro-images-public/imagebuilder/capi-builder:v1.5.0
```

Confirm that the image was downloaded correctly.

```shell
docker images
```

```text hideClipboard
REPOSITORY                                               TAG       IMAGE ID       CREATED      SIZE
gcr.io/spectro-images-public/imagebuilder/capi-builder   v1.5.0    1d891fc2e8da   6 days ago   2.5GB
```

</TabItem>

<TabItem value="Podman" label="Podman">

```shell
podman pull gcr.io/spectro-images-public/imagebuilder/capi-builder:v1.5.0
```

Confirm that the image was downloaded correctly.

```shell
podman images
```

```text hideClipboard
REPOSITORY                                               TAG       IMAGE ID       CREATED      SIZE
gcr.io/spectro-images-public/imagebuilder/capi-builder   v1.5.0    1d891fc2e8da   6 days ago   2.5GB
```

</TabItem>
</Tabs>

### Airgap

Download the CAPI Image Builder compressed archive file using the following link.

```shell
<url-pending>/capi-image-builder-v4.6.0.tgz
```

## Compatibility Matrix for Kubernetes Versions

The following table lists the supported Kubernetes versions for the CAPI Image Builder, along with the compatible
versions of its dependencies. You can also refer to this when choosing the airgap Kubernetes pack binary of the version
for which the image will be generated. You can find the airgapped Kubernetes packs on the
[Additional Packs for Airgap Environments](./additional-packs.md) page.

| Kubernetes Version | Dependencies Version                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| 1.27.13            | `cni_version` = 1.2.0 <br /> `containerd_version` = 1.7.13 <br /> `crictl_version` = 1.26.0 |
| 1.28.9             | `cni_version` = 1.2.0 <br /> `containerd_version` = 1.7.13 <br /> `crictl_version` = 1.26.0 |
| 1.29.4             | `cni_version` = 1.3.0 <br /> `containerd_version` = 1.7.13 <br /> `crictl_version` = 1.28.0 |
| 1.30.4             | `cni_version` = 1.3.0 <br /> `containerd_version` = 1.7.13 <br /> `crictl_version` = 1.28.0 |
