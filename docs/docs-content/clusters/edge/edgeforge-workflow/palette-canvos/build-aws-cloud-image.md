---
sidebar_label: "Build AWS Cloud Images"
title: "Build AWS Cloud Images"
description: "Learn how to build EdgeForge images for AWS Cloud."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

In this guide, you will use the CanvOS utility to build provider images that enable deploying Edge clusters on
[Amazon EC2](https://aws.amazon.com/ec2/). The `aws-cloud-image` target takes a CanvOS raw disk image and imports it
into AWS, creating and registering an Amazon Machine Image (AMI) that can be used to launch EC2 instances. This target
automates the workflow from raw image creation through AMI registration in AWS.

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

- An [Amazon S3](https://aws.amazon.com/s3/) bucket for image storage and the credentials to access it. Refer to the
  [Getting started with Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) guide
  for further information on S3 usage. Your AWS credentials must have the following permissions:

        - `s3:PutObject`
        -`s3:GetObject`
        - `s3:ListBucket`
        - `ec2:ImportSnapshot`
        - `ec2:DescribeImportSnapshotTasks`
        - `ec2:DescribeSnapshots`
        - `ec2:RegisterImage`
        - `ec2:DescribeImages`
        - `ec2:CreateTags`

## Build AWS Cloud Images

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

    ```bash
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Change to the `CanvOS` directory.

    ```bash
    cd CanvOS
    ```

3.  View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

    ```bash
    git tag
    ```

4.  Check out the newest available tag. This guide uses the tag **v4.8.5** as an example.

    ```shell
    git checkout v4.8.5
    ```

5.  Review the files relevant for this guide.

    - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.

    - `Earthfile` - Contains a series of commands to create target artifacts.

    - `earthly.sh` - Script to invoke the Earthfile, and generate target artifacts.

6.  Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
    uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
    `CUSTOM_TAG` argument.

    ```bash
    export CUSTOM_TAG=palette-learn
    ```

7.  Use the command below to save the image registry hostname in the `IMAGE_REGISTRY` argument. Before you execute the
    command, replace `[REGISTRY-HOSTNAME]` in the declaration below with your Docker ID. Your image registry hostname
    must comply with standard DNS rules and may not contain underscores.

    ```bash
    export IMAGE_REGISTRY=[REGISTRY-HOSTNAME]
    ```

8.  Issue the following command to use the Ubuntu OS distribution and use the 24.04 version.

    ```bash
    export OS_DISTRIBUTION=ubuntu
    export OS_VERSION=24.04
    ```

9.  Issue the following command to use the PXK-E Kubernetes distribution and use the 1.33.5 version.

    ```bash
    export K8S_DISTRIBUTION=kubeadm
    export K8S_VERSION=1.33.5
    ```

10. Use the command below to save the image S3 bucket region in the `REGION` argument and the S3 bucket name in the
    `S3_BUCKET` argument. Before you execute the command, replace `[S3-BUCKET-REGION]` with your bucket region and
    `[S3-BUCKET-NAME]` with your bucket name.

    ```bash
    export REGION=[S3-BUCKET-REGION]
    export S3_BUCKET=[S3-BUCKET-NAME]
    ```

11. Optionally, you can set an S3 object key for your image. Replace the `[IMAGE-KEY]` with a custom image key and
    execute the command. If you do not set a key, the image tag you set in **Step 6** will be used.

    ```bash
    export S3_KEY=[IMAGE-KEY]
    ```

12. Use the command below to save your AWS access key in the `AWS_ACCESS_KEY_ID` argument and the AWS secret access key
    in the `AWS_SECRET_ACCESS_KEY` argument. Before you execute the command, replace `[ACCESS-KEY]` with your access key
    and `[SECRET_ACCESS_KEY]` with your secret access key.

    ```bash
    export AWS_ACCESS_KEY_ID=[ACCESS-KEY]
    export AWS_SECRET_ACCESS_KEY=[SECRET_ACCESS_KEY]
    ```

13. Issue the command below to create an `.arg` file. The `.arg` file uses the default values for the remaining
    arguments.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=$IMAGE_REGISTRY
    OS_DISTRIBUTION=$OS_DISTRIBUTION
    OS_VERSION=$OS_VERSION
    IMAGE_REPO=$OS_DISTRIBUTION
    CUSTOM_TAG=$CUSTOM_TAG
    K8S_DISTRIBUTION=$K8S_DISTRIBUTION
    K8S_VERSION=$K8S_VERSION
    ARCH=amd64
    HTTPS_PROXY=
    HTTP_PROXY=
    PROXY_CERT_PATH=
    UPDATE_KERNEL=false
    REGION=$REGION
    S3_BUCKET=$S3_BUCKET
    S3_KEY=$S3_KEY
    EOF
    ```

    Refer to [Edge Artifact Build Configurations](./arg.md) for all available configuration parameters.

14. (Optional) If you want to build multiple versions of provider images using different Kubernetes versions, remove the
    `K8S_VERSION` argument from the `.arg` file. Open the `k8s_version.json` file in the `CanvOS` directory. Remove the
    Kubernetes versions that you don't need from the JSON object corresponding to your Kubernetes distribution.

15. Issue the command below to create a `.secret` file containing your AWS credentials.

    ```bash
    cat << EOF > .secret
    AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
    EOF
    ```

16. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

    ```bash
    ./earthly.sh +aws-cloud-image --ARCH=amd64
    ```

    ```hideClipboard bash {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

## Validate

1. Sign in to the AWS Management Console.

2. Navigate to **Amazon S3**.

3. Open the bucket you configured in **Step 10**.

4. Verify that the file appears in the object list.
