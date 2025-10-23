---
sidebar_label: "Build FIPS-Compliant Edge Artifacts"
title: "Build FIPS-Compliant Edge Artifacts"
description: "Learn how to build Edge Installer ISO and provider images to install FIPS-compliant Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge supports
[Federal Information Processing Standards](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips)
(FIPS)-compliant Edge clusters. To deploy a FIPS-compliant Edge cluster, you need to build FIPS-enabled Edge artifacts.
Both the Edge Installer ISO and the provider images must be FIPS-compliant.

This page guides you through the process of building FIPS-compliant Edge Installer ISO and provider images.

## Limitations

- FIPS-compliant Edge installer does not work with secure boot. You need to disable secure boot first before installing
  Palette on your device. The process to disable secure boot varies by device, but generally, you can press F2 upon
  powering up the Edge host, and find the option to disable secure boot in the Basic Input/Output System (BIOS)
  interface.

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 150 GB storage. If you plan on using a content bundle, the actual storage will depend on the size of the content
    bundle you will use to build the Edge installer ISO image.

- Depending on the Operating System (OS) you want to use on your Edge host, you will need the following subscription
  credentials:

  - Red Hat Enterprise Linux (RHEL): RHEL subscription token.
  - Ubuntu Pro: Ubuntu Pro subscription token.

  Contact your system administrator for access to the subscription credentials.

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

- Access to an image registry and permissions to push images. This page uses
  a public [Docker Hub](https://www.docker.com/products/docker-hub/) registry as an example. If you need to use a private registry, refer
  to the
  [Deploy Cluster with a Private Provider Registry](../../site-deployment/deploy-custom-registries/deploy-private-registry.md)
  guide for instructions on how to configure the credentials.

- A [VerteX](/docs/docs-content/vertex/vertex.md) or Palette account. Refer to
  [Palette VerteX](/docs/docs-content/vertex/vertex.md#access-palette-vertex) for information on how to set up a VerteX
  account.

- VerteX registration token for pairing Edge hosts with VerteX or a Palette registration token. You will need tenant
  admin access to VerteX to generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

:::warning

You can deploy a FIPS-compliant Edge host to Palette, but this solution will not be FIPS-compliant end-to-end because
Palette is not FIPS compliant. If you need a FIPS-compliant solution, you need to use VerteX.

:::

## Build FIPS-Enabled Edge Artifacts

### Clone CanvOS Repository

<PartialsComponent category="palette-edge-canvos-version" name="canvos-version" />

5. If you are using a self-hosted instance of Palette and have determined a specific CanvOS version, checkout out the
   corresponding tag.

   Otherwise, check out the newest available tag. This guide uses `v4.4.12` as an example.

   ```bash
   git tag
   git checkout v4.4.12
   ```

### Build FIPS-Compliant Base OS Image

Before you can build the Edge Installer ISO or the provider images, you need to build a FIPS-compliant OS base image
with the Kairos framework. This base image is then used to build the final Edge artifacts.

Palette supports the RHEL and Ubuntu for FIPS-compliant base OS images. Choose the OS that you want to build the base
image with.

<Tabs>

<TabItem label="Red Hat Enterprise Linux" value="rhel">

:::warning

When you create a cluster with an Edge host that operates the FIPS-compliant RHEL Operating System (OS), you may
encounter an error where the `systemd-resolved.service` service enters the **failed** state. This prevents the
nameserver from being configured, which will result in cluster deployment failure. Refer to
[TroubleShooting](../../../../troubleshooting/edge/edge.md#scenario---systemd-resolvedservice-enters-failed-state) for a
workaround.

:::

6. Change into the `rhel-fips` directory.

7. In the file `Dockerfile`, provide your RHEL subscription username and password.

   ```text
   ARG USERNAME=name@spectrocloud.com
   ARG PASSWORD=***********
   ```

8. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

   :::info

   If you experience issues with the script not recognizing the RHEL credentials, try searching **Dockerfile** for the
   following line and replacing the credentials directly:

   ```dockerfile
   RUN rm /etc/rhsm-host && subscription-manager register --username 'your-username' --password '*******' \
   ```

   :::

9. When the build finishes, issue `docker images` and confirm there is an image named `rhel-byoi-fips:latest`. This is
   the base image that you will use to build provider images and the Edge installer ISO later on.

10. Tag the image with a repository in a registry that is accessible by your Linux machine. For example, the following
    command uses a Docker registry named `spectrocloud` and the `rhel/rhel-byoi-fips` repository.

    ```shell
    docker tag rhel-byoi-fips:latest spectrocloud/rhel/rhel-byoi-fips:latest
    ```

11. Log in to your container registry. Provide your credentials when prompted. The example below provides a Docker login
    command.

    ```shell
    docker login
    ```

12. Once authenticated, push the provider image to the registry so that your Edge host can download it during the
    cluster deployment.

    ```shell
    docker push spectrocloud/rhel/rhel-byoi-fips:latest
    ```

</TabItem>

<TabItem label="Ubuntu" value="ubuntu">

6. Change into the `ubuntu-fips` directory.

7. In the file `pro-attach-config.yaml`, provide your Ubuntu Pro subscription token.

   ```yaml
   token: *******
   ```

8. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

9. When the build finishes, issue `docker images` and confirm there is an image named `ubuntu-focal-fips:latest`. This
   is the base image that you will use to build provider images and the Edge installer ISO later on.

10. Tag the image with a repository in a registry that is accessible by your Linux machine. For example, the following
    command uses a Docker registry named `spectrocloud` and the `ubuntu-focal-fips` repository.

    ```shell
    docker tag ubuntu-focal-fips:latest spectrocloud/ubuntu-focal-fips:latest
    ```

11. Log in to your container registry. Provide your credentials when prompted. The example below provides a Docker login
    command.

    ```shell
    docker login
    ```

12. Once authenticated, push the provider image to the registry so that your Edge host can download it during the
    cluster deployment.

    ```shell
    docker push spectrocloud/ubuntu-focal-fips:latest
    ```

</TabItem>

</Tabs>

### Build Edge Installer ISO

12. Return to the `CanvOS` directory.

    ```shell
    cd ..
    ```

13. Create a file named `.arg`. This file will contain parameters that customize the Edge Installer ISO build.

14. In the `.arg` file, provide the following required information. Refer to [Edge Artifact Build Configuration](arg.md)
    for more information.

    | Argument         | Description                                                                                                                                                                                                                      |
    | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | IMAGE_REGISTRY   | The image registry to use for tagging the generated provider images.                                                                                                                                                             |
    | OS_DISTRIBUTION  | The OS distribution in your provider image.                                                                                                                                                                                      |
    | IMAGE_REPO       | The image repository to use for tagging the generated provider images.                                                                                                                                                           |
    | OS_VERSION       | The OS version in your provider image. This applies to Ubuntu only.                                                                                                                                                              |
    | K8S_DISTRIBUTION | The Kubernetes distribution for your provider image. Allowed values are `rke2` (RKE2) and `kubeadm-fips` (PXK-E). The other distributions are not FIPS-compliant.                                                                |
    | K8S_VERSION      | Kubernetes version. The available versions vary depending on the specified `K8S_DISTRIBUTION`. Review the `k8s_version.json` file in the [CanvOS](https://github.com/spectrocloud/CanvOS) repository for all supported versions. |
    | FIPS_ENABLED     | Whether to enable FIPS compliance. This parameter must be set to `true`.                                                                                                                                                         |
    | ARCH             | The architecture of the image. Allowed values are `amd64` and `arm64`.                                                                                                                                                           |
    | BASE_IMAGE       | The base image used by EdgeForge to build the Edge Installer and provider images. This must be the same image that you build in the previous step.                                                                               |
    | ISO_NAME         | The file name of the ISO file that will be generated.                                                                                                                                                                            |

15. (Optional) This step is only required if your builds occur in a proxied network environment, and your proxy servers
    require client certificates or if your base image is in a registry that requires client certificates.

    You can provide the base-64 encoded certificates in PEM format in the **certs** folder at the root directory of the
    **CanvOS** repository. You can provide as many certificates as you need in the folder.

    If you are using a CanvOS tag that is earlier than `4.5.15`, you need to use the `PROXY_CERT_PATH` build argument to
    provide a path to the certificate. This approach only allows you to specify one certificate. For more information,
    refer to [Earthly Build Arguments](../../edgeforge-workflow/palette-canvos/arg.md).

    :::warning

    These proxy settings are only configured for the build process itself, when your builder machine needs to pull
    certain images to build the Edge artifacts. These certificates will not be present on the host after it has been
    deployed. To configure the proxy network settings for a host, refer to
    [Configure HTTP Proxy](../../local-ui/host-management/configure-proxy.md) or
    [Configure Proxy in User Data](../prepare-user-data.md#configure-proxy-settings-optional).

    :::

16. Create a file named `user-data`. It must have the `#cloud-init` header at the top of the file. Ensure you have the
    following blocks at the root level of the **user-data** file. Replace the value for `edgeHostToken` with your VerteX
    registration token, and replace the value `paletteEndPoint` with the URL of your Palette instance. Replace the user
    `kairos` and its password with your desired username and password.

    ```yaml
    #cloud-config
    install:
       grub_options:
         extra_cmdline: "fips=1 selinux=0"

    stylus:
       site:
         edgeHostToken: ********
         paletteEndpoint: https://vertex.palette-devx.spectrocloud.com
         projectName: Default

    stages:
       initramfs:
          - name: "Core system setup"
            users:
               kairos:
                  groups:
                    - admin
                  passwd: kairos
    ```

    :::tip

    You can also [edit user data in Local UI](../../local-ui/host-management/edit-user-data.md) after installation.
    However, we recommend providing user data during EdgeForge for production workloads, as not all user data fields can
    be updated in Local UI.

    :::

    The command in the `install` block is required for FIPS installations. Configurations in the `stylus` block provide
    the Edge Host with the registration token and the Palette endpoint. And the configurations in the `stage` block
    create a system user that you can use to log in to the Operating System (OS).

17. Add further customization to the `user-data` file as needed. This file configures the Edge Installer. Refer to
    [Installer Reference](../../edge-configuration/installer-reference.md) for more information.

18. Issue the following command to build the Edge Installer ISO.

    <Tabs group="earthly">

    <TabItem value="Earthly Installed">

    ```bash
    earthly +iso
    ```

    </TabItem>

    <TabItem value="Earthly Not Installed">

    ```bash
    sudo ./earthly.sh +iso
    ```

    </TabItem>

    </Tabs>

    When the build finishes, the ISO file will be generated in the **build** directory under the name you specified in
    your **.arg** file.

### Build Provider Images

Provider images are Kairos-based container images for a supported OS and Kubernetes distribution combination.
FIPS-complaint provider images are built on top of the base OS image you have built previously.

19. (Optional) If you want to build multiple versions of a provider image using different Kubernetes versions, remove
    the `K8S_VERSION` argument from the `.arg` file. Open the `k8s_version.json` file in the `CanvOS` directory. Remove
    the Kubernetes versions that you don't need from the JSON object corresponding to your Kubernetes distribution.

20. Review the `.arg` file again to ensure the parameters are correct. Issue the following command to build the provider
    images.

    ```shell
      ./earthly.sh +build-provider-images-fips
    ```

    :::warning

    For the Kubernetes distribution set in your **.arg** file, only `rke2` and `kubeadm-fips` will produce
    FIPS-compliant provider images.

    :::

## Validate

1. Follow the [Site Installation](../../site-deployment/stage.md) guide to install the Palette Edge on your Edge host.

2. Press the **FN + CTRL + CMD + F1** or **CTRL + CMD + F1** keys on a Mac keyboard and provide user credentials to log
   in to the OS.

3. Issue the following command and ensure that the output is `1`. This means the OS is FIPS enabled.

   ```shell
   cat /proc/sys/crypto/fips_enabled
   ```
