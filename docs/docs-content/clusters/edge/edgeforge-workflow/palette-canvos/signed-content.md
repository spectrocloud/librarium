---
sidebar_label: "Embed a Public Key in Edge Artifacts"
title: "Embed a Public Key in Edge Artifacts"
description: "Learn how to embed a public key in Edge artifacts to ensure the authenticity of all uploaded content."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

EdgeForge gives you the option to embed public keys in the installer ISO and provider images. When an Edge host has an
embedded public keys, all content uploaded to the Edge host, including content bundles and cluster definitions must
contain a signature from the corresponding private key. This allows you to be confident that all content uploaded to
your Edge hosts come from a trusted source. For more information about content bundles and cluster definitions, refer to
[Build Content Bundle](./build-content-bundle.md) and
[Export Cluster Definition](../../local-ui/cluster-management/export-cluster-definition.md).

## Limitations

- This feature is only available to locally managed Edge hosts without a connection to Palette.

## Prerequisites

- Embedding public keys is part of the EdgeForge process. Become familiar with EdgeForge before proceeding with this
  guide. For more information, refer to [EdgeForge](../edgeforge-workflow.md).

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [OpenSSL](https://www.openssl.org/docs). You can ensure OpenSSL installation by issuing the `openssl --help` command.

- An RSA key pair. Both the public and private key must be in PEM format. You can use OpenSSL to convert keys from other
  formats into PEM. For more information, refer to
  [OpenSSL documentation](https://www.openssl.org/docs/manmaster/man1/openssl.html).

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

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

## Embed a Public Key in Edge Artifacts

<PartialsComponent category="palette-edge-canvos-version" name="canvos-version" />

5. If you are using a self-hosted instance of Palette and have determined a specific CanvOS version, check out the
   corresponding tag.

   Otherwise, check out the newest available tag. This guide uses the tag v4.4.4 as an example.

   ```
   git checkout v4.4.4
   ```

6. In `CanvOS`, create a file named `edge_custom_config.yaml`.

7. Populate the YAML file with the following content. Replace the value for `base64EncodedValue` with the base64 encoded
   value of your public key. You can convert your PEM file to base64 using this command replacing `sample.pem` with your
   filename.

   ```bash
   base64 -w 0 sample-key.pem
   ```

   ```yaml
   content:
       signing:
           publicKey:
             base64EncodedValue: *******
             description: "This is a public key used for verifying content bundles and cluster definitions." 
   ```

8. In your `.arg` file, add the following parameter `EDGE_CUSTOM_CONFIG` and provide the path to your
   `.edge_custom_config.yaml` file.

   ```text {12}
    CUSTOM TAG=demo
    IMAGE_REGISTRY=spectrocloud
    OS_DISTRIBUTION=ubuntu
    IMAGE REPO=$0S_DISTRIBUTION
    OS_VERSION=22.04
    K8S_DISTRIBUTION=k35
    ISO_NAME=palette-edge-installer
    ARCH=amd64
    UPDATE KERNEL=false
    CLUSTERCONFIG=spc.tgz
    CIS HARDENING=false
    EDGE_CUSTOM_CONFIG=.edge-custom-config.yaml
   ```

9. Finish the rest of the EdgeForge process to build either the installer ISO or provider images. For more information,
   refer to [Build Installer ISO](./build-installer-iso.md) and [Build Provider Images](./build-provider-images.md).

   :::info

   When building the installer ISO, you must set the `managementMode` parameter to `local` in your Edge installer
   configuration user data. This ensures that your Edge host does not try to register itself with Palette, as this
   feature is not available to centrally managed clusters. For more information, refer to
   [Installer Reference](../../edge-configuration/installer-reference.md#palette-agent-parameters).

   :::

## Rotate or Remove Key

10. (Optional) To rotate or remove the public key used by your Edge host, build a new provider image with the new key or
    with no keys, and then create a cluster with that provider image.

    If a cluster is created with a provider image with a new key, the new key will replace the old key. If a cluster is
    created with a provider image with no keys, then the existing key will be removed.

    :::warning

    In the process of rotating the keys, you will need to build a new content bundle with the provider image that
    contains the new key. When you build this content bundle, you still need to sign it with the existing key, which
    secures the key rotation process. If you need to create a new cluster definition, you will also need to sign it with
    the existing key. The new key will only take effect after the cluster is operational with the new provider image.

    :::

## Validate

Depending on the Edge artifact you have built, the validation steps are slightly different.

<Tabs>

<TabItem value="ISO">

1. Install Palette Edge on your Edge host using your Installer ISO. For more information, refer to
   [Installation](../../site-deployment/stage.md).

2. Power up the Edge host and access Local UI. For more information, refer to
   [Access Local UI](../../local-ui/host-management/access-console.md).

3. From the left **Main Menu**, click on **Settings**.

4. If the key is embedded successfully, the **Signing Public Key** tab will be displayed.

5. Upload a content bundle or cluster definition to the Edge host. Verify that only items that are signed with the
   corresponding private key will be accepted. For more information, refer to
   [Upload Content Bundle](../../local-ui/cluster-management/upload-content-bundle.md) and
   [Create Local Cluster](../../local-ui/cluster-management/create-cluster.md).

</TabItem>

<TabItem value="Provider Image">

1. Create a cluster with the provider image. For more information, refer to
   [Create Local Cluster](../../local-ui/cluster-management/create-cluster.md).

2. If the key is embedded successfully, the **Signing Public Key** tab will be displayed. If you removed the key with
   the new provider image, the **Signing Public Key** tab will not be displayed and you've confirmed that the key has
   been removed.

3. Upload a content bundle or cluster definition to the Edge host. Verify that only items that are signed with the
   corresponding private key will be accepted. For more information, refer to
   [Upload Content Bundle](../../local-ui/cluster-management/upload-content-bundle.md) and
   [Create Local Cluster](../../local-ui/cluster-management/create-cluster.md).

</TabItem>

</Tabs>
