---
sidebar_label: "Offline Documentation"
title: "Offline Documentation"
description: "Learn how to use the Palette Vertex documentation offline."
hide_table_of_contents: false
sidebar_position: 60
sidebar_custom_props:
  icon: "book"
tags: ["vertex", "enterprise", "airgap", "kubernetes", "offline", "downloads"]
keywords: ["self-hosted", "vertex"]
---

If you are in an environment that requires the Spectro Cloud documentation to be available offline, you can use our
offline Docker image to serve the documentation locally. The image is updated nightly to ensure that the latest
documentation is available. When you start the container, the documentation is available at `http://localhost:8080` and
you can access it using your browser.

:::tip

You can use the Palette CLI to download and start the offline documentation container with a single command. Check out
the Palette CLI `docs` command [page](../automation/palette-cli/commands/docs.md) for more information.

:::

## Limitations

The following limitations apply when using the offline documentation:

- Only the latest version of the documentation is available.

- The search functionality is not available.

- The documentation AI helper is not available.

## Prerequisites

The following software must be installed on your system:

- A Linux environment in an AMD64 or ARM64 architecture. The Docker image is only available for Linux AMD64 and ARM64
  architectures.

- [Docker](https://docs.docker.com/get-docker/) - The offline documentation is provided as a Docker image.

- A web browser.

- [tar](https://www.gnu.org/software/tar/) - This is only required if you need to deploy the offline documentation to a
  device without internet access.

- [cosign](https://docs.sigstore.dev/cosign/system_config/installation/) - Not required unless you want to verify the
  authenticity of the container image. Review the [Container Image Authenticity](#container-image-authenticity) section
  for more information.

## Deploy the Offline Documentation

1. Download and start the offline documentation container. Use the following command to start the container.

   ```shell
   docker run --publish 8080:80 --publish 2019:2019 --rm ghcr.io/spectrocloud/librarium:nightly
   ```

   :::info

   If another process is using port `8080`, you can change the port mapping to use a different port. For example, to use
   port `8081`, use the following command:

   ```shell
   docker run --publish 8081:80 --publish 2019:2019 --rm ghcr.io/spectrocloud/librarium:nightly
   ```

   :::

2. Open a browser and navigate to `http://localhost:8080` to view the documentation.

3. If you need to deploy the offline documentation to a device without internet access, you can use the following
   command to save the container image to a tar file.

   ```shell
   docker save ghcr.io/spectrocloud/librarium:nightly > docs.tar
   ```

4. Copy the **docs.tar** file to the device without internet access.

5. Once the **docs.tar** file is on the target device, you can load the container image using the following command.

   ```shell
   docker load < docs.tar
   ```

   ```shell hideClipboard
   5f4d9fc4d98d: Loading layer [==================================================>]  7.949MB/7.949MB
   1a76f1c3e1ac: Loading layer [==================================================>]  1.369MB/1.369MB
   810693419710: Loading layer [==================================================>]  28.67kB/28.67kB
   ba48f3160731: Loading layer [==================================================>]  39.59MB/39.59MB
   9097de2c1f3e: Loading layer [==================================================>]  523.2MB/523.2MB
   0ca22615467b: Loading layer [==================================================>]  3.072kB/3.072kB
   Loaded image: ghcr.io/spectrocloud/librarium:nightly
   ```

6. You can then start the container using the same command from step 1.

```shell
docker run --publish 8080:80 --publish 2019:2019 --rm ghcr.io/spectrocloud/librarium:nightly
```

7. Open a browser and navigate to `http://localhost:8080`. The documentation should be displayed in the browser.

## Deploy the Offline Documentation with Custom Logos

You can provide your own custom logos to the Spectro Cloud documentation. The documentation provides two color schemes,
one for light mode and one for dark mode.

:::info

We recommend that you provide two logos, one for dark mode and one for light mode. The files must be in SVG format.

:::

1. Clone the Spectro Cloud Docs [GitHub repository](https://github.com/spectrocloud/librarium) to your local machine.
   Navigate to the root of the repository.

   ```shell
   git clone https://github.com/spectrocloud/librarium.git \
   cd librarium
   ```

2. Download the logos you want to configure to your local machine.

3. Replace the placeholders in the following command with the path to your logo files. Then, execute the command in your
   terminal to save the location of the files to two environment variables.

   ```shell
   export LIGHT_LOGO_PATH=path/to/light/custom/logo/file \
   export DARK_LOGO_PATH=path/to/dark/custom/logo/file
   ```

4. Execute the following script from the root of the cloned Docs GitHub repository to build a customized Docker image.

   ```shell
   ./scripts/build-custom-offline-docker.sh
   ```

   The script creates a Docker image named `spectrocloud/librarium:custom` and a `.env` file with all the required
   environment variables.

   ```shell title="Successful output"
   ✅ Docker image built successfully: spectrocloud/librarium:custom

   ℹ️  Use the following command to run the Docker container:
   ⏭️  docker run --env-file=.env --publish 9000:9000 --rm spectrocloud/librarium:custom
   ```

   :::info

   The Docker image contains a copy of your configured custom logos. Any changes made to the external files after the
   image has been built will not be reflected in the image.

   Additionally, the image contains the documentation at the time that you cloned the repository and will not receive
   any updates from Spectro Cloud. You should update your local copy of the Spectro Cloud Docs
   [GitHub repository](https://github.com/spectrocloud/librarium) and rebuild the Docker container if you want to update
   the content.

   :::

5. Execute the following command to start a container using the built Docker image.

   ```shell
   docker run --env-file=.env --publish 9000:9000 --rm spectrocloud/librarium:custom
   ```

6. Open a browser and navigate to `http://localhost:9000` to view the documentation. The navigation bar displays your
   custom configured logos.

   Alternatively, you can push your Docker image to a registry and host your offline documentation using a third-party
   static site hosting provider. The generated `.env` file contains all the environment variables that you must
   configure.

## Container Image Authenticity

The offline documentation container image is signed using [Sigstore's](https://sigstore.dev/) Cosign. The container
image is signed using a cryptographic key pair that is private and stored internally. The public key is available in the
documentation repository at
[**static/cosign.pub**](https://raw.githubusercontent.com/spectrocloud/librarium/master/static/cosign.pub). Use the
public key to verify the authenticity of the container image. You can learn more about the container image signing
process by reviewing the [Signing Containers](https://docs.sigstore.dev/cosign/signing/signing_with_containers/)
documentation page.

:::info

Cosign generates a key pair that uses the ECDSA-P256 algorithm for the signature and SHA256 for hashes. The keys are
stored in PEM-encoded PKCS8 format.

:::

Use the following command to verify the authenticity of the container image.

```shell
cosign verify --key https://raw.githubusercontent.com/spectrocloud/librarium/master/static/cosign.pub \
ghcr.io/spectrocloud/librarium:nightly
```

If the container image is valid, the following output is displayed. The example output is formatted using `jq` to
improve readability.

```shell hideClipboard
Verification for ghcr.io/spectrocloud/librarium:nightly --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The signatures were verified against the specified public key
[
  {
    "critical": {
      "identity": {
        "docker-reference": "ghcr.io/spectrocloud/librarium"
      },
      "image": {
        "docker-manifest-digest": "sha256:285a95a8594883b3748138460182142f5a1b74f80761e2fecb1b86d3c9b9d191"
      },
      "type": "cosign container image signature"
    },
    "optional": {
      "Bundle": {
        "SignedEntryTimestamp": "MEYCIQCZ6FZzNB5wA9+W/lF57jx0qTaszZhg5FxJiBmgIFxPVwIhANnoQQ5gqjr1h93LCq1Td8BohqrxxIvfrXTnT1tYR4i7",
        "Payload": {
          "body": "eyJhcGlWZXJzaW9uIjoiMC4wLjEiLCJraW5kIjoiaGFzaGVkcmVrb3JkIiwic3BlYyI6eyJkYXRhIjp7Imhhc2giOnsiYWxnb3JpdGhtIjoic2hhMjU2IiwidmFsdWUiOiI0MzU0MzFjNjY1Y2Y2ZGZjYzM0NzI2YWRkNjAzMDVjYjZlMzhlNjVkZmJlMWQ0NWU2ZGVkM2IzNzg3NTYwY2MxIn19LCJzaWduYXR1cmUiOnsiY29udGVudCI6Ik1FVUNJUUM0TFFxYVFDclhOc0VzdkI0ZE84bmtZSWg0L3o5UzdScGVEdUZnUDJwbDJ3SWdOdEJsNElDaHBmT3RnVDBlNW5QTmRMYWt4RTJHcnFFK0tjV1JXSGZPTnpnPSIsInB1YmxpY0tleSI6eyJjb250ZW50IjoiTFMwdExTMUNSVWRKVGlCUVZVSk1TVU1nUzBWWkxTMHRMUzBLVFVacmQwVjNXVWhMYjFwSmVtb3dRMEZSV1VsTGIxcEplbW93UkVGUlkwUlJaMEZGV1VoeVl6SlhTVVV6WVhCTFRHMWplR3hHUmtoNVZsRkRVVnBYYUFveUsyRnNOVmN2Vmsxc1VISXpkVFJGV2k5V0wwZFBRbTAySzFrNVowWXpWWE16ZEhkMVpWaFpaMlJaWlVadk5XODNRbFZ1TnpCTlVGQjNQVDBLTFMwdExTMUZUa1FnVUZWQ1RFbERJRXRGV1MwdExTMHRDZz09In19fX0=",
          "integratedTime": 1702758491,
          "logIndex": 57230483,
          "logID": "c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d"
        }
      },
      "owner": "Spectro Cloud",
      "ref": "e597f70be238369ce4f0e5778492a155e23fec17",
      "repo": "spectrocloud/librarium",
      "workflow": "Nighly Docker Build"
    }
  }
]
```

:::danger

Do not use the container image if the authenticity cannot be verified. Verify you downloaded the correct public key and
that the container image is from `ghcr.io/spectrocloud/librarium:nightly`.

:::

If the container image is not valid, an error is displayed. The following example shows an error when the container
image is not valid.

```shell hideClipboard
cosign verify --key https://raw.githubusercontent.com/spectrocloud/librarium/master/static/cosign.pub \
ghcr.io/spectrocloud/librarium:nightly
```

```shell hideClipboard
Error: no matching signatures: error verifying bundle: comparing public key PEMs, expected -----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEheVfGYrVn2mIUQ4cxMJ6x09oXf82
zFEMG++p4q8Mf+y2gp7Ae4oUaXk6Q9V7aVjjltRVN6SQcoSASxf2H2EpgA==
-----END PUBLIC KEY-----
, got -----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEYHrc2WIE3apKLmcxlFFHyVQCQZWh
2+al5W/VMlPr3u4EZ/V/GOBm6+Y9gF3Us3twueXYgdYeFo5o7BUn70MPPw==
-----END PUBLIC KEY-----

main.go:69: error during command execution: no matching signatures: error verifying bundle: comparing public key PEMs, expected -----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEheVfGYrVn2mIUQ4cxMJ6x09oXf82
zFEMG++p4q8Mf+y2gp7Ae4oUaXk6Q9V7aVjjltRVN6SQcoSASxf2H2EpgA==
-----END PUBLIC KEY-----
, got -----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEYHrc2WIE3apKLmcxlFFHyVQCQZWh
2+al5W/VMlPr3u4EZ/V/GOBm6+Y9gF3Us3twueXYgdYeFo5o7BUn70MPPw==
-----END PUBLIC KEY-----
```
