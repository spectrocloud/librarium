---
sidebar_label: "Offline Documentation"
title: "Offline Documentation"
description: "Learn how to use the Palette Vertex documentation offline."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["vertex", "enterprise", "airgap", "kubernetes", "offline"]
keywords: ["self-hosted", "vertex"]
---


If you are in an environment that requires the Palette Vertex documentation to be available offline, you can use our offline Docker image to serve the documentation locally. The image is updated nightly to ensure that the latest documentation is available. When you start the container, the documentation is available at `http://localhost:8080` and you can access it using your browser.

### Limitations

The following limitations apply when using the offline documentation:

- Only the latest version of the documentation is available.

- The search functionality is not available.

- The documentation AI helper is not available.


### Prerequisites

The following software must be installed on your system:


- A Linux environment in an AMD64 or ARM64 architecture. The Docker image is only available for Linux AMD64 and ARM64 architectures.


- [Docker](https://docs.docker.com/get-docker/) - The offline documentation is provided as a Docker image.

- A web browser.

- [tar](https://www.gnu.org/software/tar/) - This is only required if you need to deploy the offline documentation to a device without internet access.


## Deploy the Offline Documentation

1. Download and start the offline documentation container. Use the following command to start the container.

    ```shell
    docker run --publish 8080:80 --publish 2019:2019 --rm ghcr.io/spectrocloud/librarium:nightly
    ```

    :::note

    If another process is using port `8080`, you can change the port mapping to use a different port. For example, to use port `8081`, use the following command:

    ```shell
    docker run --publish 8081:80 --publish 2019:2019 --rm ghcr.io/spectrocloud/librarium:nightly
    ```

    :::

2. Open a browser and navigate to `http://localhost:8080` to view the documentation.


3. If you need to deploy the offline documentation to a device without internet access, you can use the following command to save the container image to a tar file.

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

## Validation

To validate that the offline documentation is working, open a browser and navigate to `http://localhost:8080`. The documentation should be displayed in the browser.