---
sidebar_label: "Build FIPS-Enabled Edge Artifacts"
title: "Build FIPS-Enabled Edge Artifacts"
description: "Learn how to build Edge Installer ISO and provider images to install FIPS-compliant Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge supports Federal Information Processing Standards (FIPS)-compliant Edge clusters. To deploy a
FIPS-compliant Edge cluster, you need to build FIPS-enabled Edge artifacts. Both the Edge Installer ISO and the provider
images must be FIPS-enabled.

This page guides you through the process of building FIPS-enabled Edge artifacts.

## Prerequisites

## Build FIPS-Enabled Edge Artifacts

### Clone CanvOS Repository

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

2. Change to the **CanvOS/** directory.

```bash
cd CanvOS
```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

```bash
git tag
```

4. Check out the newest available tag. This guide uses the tag **v4.3.0** as an example.

```shell
git checkout v4.3.0
```

### Build FIPS-Enabled Provider Image

Palette supports the Operating Systems (OS) Red Hat Enterprise Linux (RHEL) and Ubuntu for FIPS-enabled provider image.
Choose the OS that you want to build the provider image with.

<Tabs>

<TabItem label="Red Hat Enterprise Linux" value="rhel">

5. Change into the **rhel-fips** directory.

6. In the file **Dockerfile**, provide your RHEL subscription username and password.

   ```text
   ARG USERNAME=name@spectrocloud.com
   ARG PASSWORD=***********
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

8. When the build finishes, issue `docker images` and look for an image named `rhel-byoi-fips:latest`.

9. Tag the image with a remote repository and push the provider image to the repository where it can be access by the
   Edge host during installation. For example, the following command tags the image and pushes the image to the
   **ttl.sh** registry in the **spectro-images** repository.

   ```shell
   docker tag rhel-byoi-fips:latest ttl.sh/spectro-images/rhel-byoi-fips:latest
   docker push ttl.sh/spectro-images/rhel-byoi-fips:latest
   ```

</TabItem>

<TabItem label="Ubuntu" value="ubuntu">

5. Change into the **ubuntu-fips** directory.

6. In the file **pro-attach-config.yaml**, provide your Ubuntu Pro subscription token.

   ```yaml
   token: *******
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

8. When the build finishes, issue `docker images` and look for an image named `ubuntu-focal-fips:latest`.

9. Tag the image with a remote repository and push the provider image to the repository where it can be access by the
   Edge host during installation. For example, the following command tags the image and pushes the image to the
   **ttl.sh** registry in the **spectro-images** repository.

   ```shell
   docker tag ubuntu-focal-fips:latest ttl.sh/spectro-images/ubuntu-focal-fips:latest
   docker push ttl.sh/spectro-images/ubuntu-focal-fips:latest
   ```

</TabItem>

### Build Edge Installer ISO

10. Return to the **CanvOS** directory.

    ```shell
    cd ..
    ```

11. Create a file named **.arg**. This file will contain parameters that customize the Edge Installer ISO build.

12. In the **.arg** file, provide the following required information. Refer to
    [Edge Artifact Build Configuration](arg.md) for more information.

    | Argument         | Description                                                                                                                                                               |
    | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | IMAGE_REGISTRY   | The image registry that the Edge Installer will pull provider images from. This must be the same registry where you pushed the provider images in the previous steps.     |
    | OS_DISTRIBUTION  | The OS distribution in your provider image.                                                                                                                               |
    | IMAGE_REPO       | The image repository that the Edge Installer will pull provider images from. This must be the same repository where you pushed the provider images in the previous steps. |
    | OS_VERSION       | The OS version in your provider image. This only applies to Ubuntu.                                                                                                       |
    | K8S_DISTRIBUTION | The Kubernetes distribution [TBD]                                                                                                                                         |
    | FIPS_ENABLED     | Whether to enable FIPS compliance. This parameter must be set to `true`.                                                                                                  |
    | ARCH             | The architecture of the image. This parameter must be set to `amd64`.                                                                                                     |

13. Create a file named **user-data**, This file configures the Edge Installer. Refer to
    [Installer Reference](../../edge-configuration/installer-reference.md) for more information.

14. Add the following block to the **user-data** file. `install` is at the root level of the YAML file.

    ```yaml
    install:
      grub_options:
        extra_cmdline: "fips=1"
    ```

15. Issue the following command to build the Edge Installer ISO.

    ```shell
    ./earthly +iso
    ```

    When the build finishes, the ISO file will be provided in the **build** directory under the name you specified in
    your **.arg** file.

## Validate

1. Follow the [Site Installation](../../site-deployment/stage.md) guide to install the Palette Edge on your Edge host.

2. Issue the following command and ensure that the output is `1`. This means the OS is FIPS enabled.

   ```shell
   cat /proc/sys/crypto/fips_enabled
   ```
