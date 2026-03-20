---
sidebar_label: "Install on EKS with ECR"
title: "Install Palette on EKS with ECR Mirroring"
description:
  "Learn how to install self-hosted Palette on an AWS EKS cluster in an airgap environment using ECR as your artifact
  registry."
icon: ""
hide_table_of_contents: false
tags: ["self-hosted", "enterprise", "airgap", "kubernetes", "eks", "ecr"]
keywords: ["self-hosted", "enterprise", "eks", "ecr", "airgap"]
---

This guide walks you through installing self-hosted Palette on an Amazon Elastic Kubernetes Service (EKS) cluster in an
airgapped environment. All container images, packs, and manifest artifacts are mirrored from Spectro Cloud's registry
into your own Amazon Elastic Container Registry (ECR) so that your cluster never needs to reach external registries.

## Prerequisites

### EKS Infrastructure

- An AWS account with permissions to create ECR repositories.

- An EKS cluster with three worker nodes with an instance type of `t3a.2xlarge` or larger.

- A Container Storage Interface (CSI) driver installed and running on the EKS cluster, such as the AWS EBS CSI driver.

- A custom domain you control with the ability to create wildcard DNS records.

- A jump host with network access to the EKS cluster.

### Jump Host Tools

- The following tools installed on your jump host with network access to your EKS cluster:

  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — Required to interact
    with AWS ECR and EKS.

  - [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) — Required to connect to and manage your EKS cluster. Use
    the following command to add your EKS cluster details to your kubeconfig at `$HOME/.kube/config`. Replace
    `<region-code>` with the region of your cluster and `cluster-name` with the name of your cluster.

        ```
        aws eks update-kubeconfig --region <region-code> --name <cluster-name>
        ```

  - [Helm 3](https://helm.sh/docs/intro/install/) — Required to install the Palette Helm charts.

  - [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) — Required to copy container
    images between registries without a local Docker daemon.

- The following artifacts from our support team:

  - Palette Helm charts, received as a `charts.zip` file. Refer to
    [Access Palette](../../../enterprise-version.md#access-palette) for instructions on how to request access.

  - The following artifact list files that correspond with your `<palette-version>`. If you require additional packs for
    your workload clusters beyond what is supplied, contact our support team to receive updated files containing
    additional packs and images.

        - `packs.txt` — List of pack names to mirror.
        - `images.txt` — List of all container images to mirror.

### Spectro Cloud ECR Credentials

- The following Spectro Cloud ECR details from our support team. These values are used throughout the guide.

  | **Detail**               | **Placeholder**              |
  | ------------------------ | ---------------------------- |
  | Spectro Cloud ECR URL    | `<spectro-ecr-registry-url>` |
  | Spectro Cloud ECR region | `<spectro-ecr-region>`       |
  | Spectro Cloud base path  | `<spectro-base-path>`        |
  | AWS Access Key           | `<spectro-access-key>`       |
  | AWS Secret Key           | `<spectro-secret-key>`       |
  | Palette version          | `<palette-version>`          |

## Set Up Registries

Create two base repositories: one for images (always public) and one for packs (public or private).

| **Option**      | **Use when**                                        | **Authentication**                       |
| --------------- | --------------------------------------------------- | ---------------------------------------- |
| **Private ECR** | You want packs restricted to your AWS account       | Long-lived IAM Access Key and Secret Key |
| **Public ECR**  | No compliance requirement, or you prefer simplicity | Not required                             |

### Create Public ECR and Mirror Images

:::info

Public ECR is globally accessible for pulls without authentication. However, AWS centralizes the management API in
`us-east-1`. All `aws ecr-public` commands must use `--region us-east-1`, regardless of where your cluster runs.

:::

1. On your jump host, ensure your AWS CLI is configured with an identity that has permissions to create and push to ECR.

   ```shell
   aws sts get-caller-identity
   ```

   Verify the output displays an identity with ECR permissions. If you use AWS IAM Identity Center, you can configure a
   named profile with `aws configure sso`.

   ```json title="Example output" hideClipboard
   {
     "UserId": "ABCD1234EFGH5678:user@spectrocloud.com",
     "Account": "012345678901",
     "Arn": "arn:aws:sts::012345678901:assumed-role/AWSReservedSSO_AdministratorAccess_abcd1234efgh/user@spectrocloud.com"
   }
   ```

2. Retrieve your public ECR alias. This value is unique per AWS account.

   ```shell
   ECR_PUBLIC_ALIAS=$(aws ecr-public describe-registries --region us-east-1 \
     --query 'registries[0].aliases[0].name' --output text)
   ```

3. Create the base repository. Replace `<image-base-path>` with a namespace prefix for your images, such as
   `spectro-images`.

   ```shell
   IMAGE_BASE_PATH="<image-base-path>"
   aws ecr-public create-repository \
     --repository-name $IMAGE_BASE_PATH \
     --region us-east-1
   ```

4. Set the source and destination variables for Spectro Cloud's ECR. Replace each placeholder with the values provided
   by our support team in the [Spectro Cloud ECR Credentials](#spectro-cloud-ecr-credentials) section.

   :::info

   Do not include the protocol in the `SPECTRO_ECR` URL.

   :::

   ```shell
   SPECTRO_ECR="<spectro-ecr-registry-url>"
   SPECTRO_REGION="<spectro-ecr-region>"
   SPECTRO_BASE="<spectro-base-path>"
   SPECTRO_ACCESS_KEY="<spectro-access-key>"
   SPECTRO_SECRET_KEY="<spectro-secret-key>"
   IMAGE_DEST_ECR="public.ecr.aws/$ECR_PUBLIC_ALIAS"
   ```

5. Authenticate to the Spectro Cloud ECR.

   ```shell
   crane auth login "$SPECTRO_ECR" \
     --username AWS \
     --password "$(AWS_ACCESS_KEY_ID=$SPECTRO_ACCESS_KEY AWS_SECRET_ACCESS_KEY=$SPECTRO_SECRET_KEY \
     aws ecr get-login-password --region "$SPECTRO_REGION")"
   ```

   ```shell title="Example output" hideClipboard
   2026/03/19 11:54:57 logged in via /Users/ubuntu/.docker/config.json
   ```

6. Authenticate with your newly created public ECR.

   ```shell
   crane auth login public.ecr.aws \
     --username AWS \
     --password "$(aws ecr-public get-login-password --region us-east-1)"
   ```

   ```shell title="Example output" hideClipboard
   2026/03/19 11:55:38 logged in via /Users/ubuntu/.docker/config.json
   ```

7. Navigate to the directory containing the `images.txt` and `packs.txt` files received from our support team.

   ```shell
   cd <images-and-packs-location>
   ```

8. Mirror the images from the Spectro Cloud ECR to your public ECR. The following loop reads each image from the
   `images.txt` file in the current directory, creates the target repository in your public ECR, and copies the image
   from its original public registry.

   ```shell
   while IFS= read -r img; do
     [[ -z "$img" || "$img" == \#* ]] && continue

     repo="${img%%:*}"
     tag="${img##*:}"

     aws ecr-public create-repository \
       --repository-name "$IMAGE_BASE_PATH/spectro-images/$repo" \
       --region us-east-1 2>/dev/null || true

     (
       crane copy --platform linux/amd64 \
         "$img" \
         "$IMAGE_DEST_ECR/$IMAGE_BASE_PATH/spectro-images/$img" \
       && echo "OK: $img" || echo "FAIL: $img"
     ) &

     while (( $(jobs -r | wc -l) >= 5 )); do sleep 1; done

   done < images.txt
   wait
   echo "All done"
   ```

9. Verify the mirror completed by spot-checking a few images.

   ```shell title="Example command"
   aws ecr-public describe-images \
     --repository-name "$IMAGE_BASE_PATH/spectro-images/us-docker.pkg.dev/palette-images/palette/crony" \
     --region us-east-1
   ```

   ```json hideClipboard title="Example output"
   {
     "imageDetails": [
       {
         "registryId": "123456789",
         "repositoryName": "palette/spectro-images/us-docker.pkg.dev/palette-images/palette/crony",
         "imageDigest": "sha256:694efe36e5e3221d73261a6c6db4fc82c758d7750e0ced9468e6b2a9ccc072ca",
         "imageTags": ["4.8.6"],
         "imageSizeInBytes": 28822852,
         "imagePushedAt": "2026-03-17T18:29:36.777000-04:00",
         "imageManifestMediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "artifactMediaType": "application/vnd.docker.container.image.v1+json"
       }
     ]
   }
   ```

### Create Pack Registry and Mirror Packs and Manifest

Choose one of the following options depending on whether you want to use a private or public ECR for packs.

<Tabs groupId="eks-pack-ecr">

<TabItem label="Public ECR" value="public-ecr">

1.  If using a public ECR for packs, issue the following command. Replace `<pack-base-path>` with the repository name
    for your packs, such as `spectro-packs`.

    ```shell
    PACK_BASE_PATH=<pack-base-path>
    aws ecr-public create-repository \
      --repository-name $PACK_BASE_PATH \
      --region us-east-1
    ```

    ```json title="Example output" hideClipboard
    {
      "repository": {
        "repositoryArn": "arn:aws:ecr-public::12345789:repository/palette-packs",
        "registryId": "12345789",
        "repositoryName": "palette-packs",
        "repositoryUri": "public.ecr.aws/a1b2c3d4/palette-packs",
        "createdAt": "2026-03-19T14:34:56.862000-04:00"
      },
      "catalogData": {}
    }
    ```

2.  Set the destination variables. Replace `<palette-version>` with the version of your Palette installation.

    ```shell
    PACK_DEST_ECR="public.ecr.aws/$ECR_PUBLIC_ALIAS"
    PALETTE_VERSION="<palette-version>"
    ```

3.  Mirror the packs.

    ```shell
    while IFS= read -r pack; do
      [[ -z "$pack" || "$pack" == \#* ]] && continue
      aws ecr-public create-repository \
        --repository-name "$PACK_BASE_PATH/spectro-packs/archive/${pack%%:*}" \
        --region us-east-1 2>/dev/null || true
      crane copy \
        "$SPECTRO_ECR/$SPECTRO_BASE/spectro-packs/archive/$pack" \
        "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-packs/archive/$pack"
    done < packs.txt
    wait
    echo "All done"
    ```

4.  Verify the pack mirroring completed by spot-checking a few packs.

    ```shell title="Example command"
    aws ecr-public describe-images \
      --repository-name "$PACK_BASE_PATH/spectro-packs/archive/ubuntu-aws" \
      --region us-east-1
    ```

    ```json title="Example output" hideClipboard
    {
      "imageDetails": [
        {
          "registryId": "123456789",
          "repositoryName": "spectro-packs/spectro-packs/archive/ubuntu-aws",
          "imageDigest": "sha256:c134ae8b14bbdae1fa9a821ed0729f35a7875b5a69b31cb6000c7616f42fd977",
          "imageTags": ["22.04"],
          "imageSizeInBytes": 5774,
          "imagePushedAt": "2026-03-18T12:03:20.549000-04:00",
          "imageManifestMediaType": "application/vnd.oci.image.manifest.v1+json",
          "artifactMediaType": "application/vnd.unknown.config.v1+json"
        },
        {
          "registryId": "123456789",
          "repositoryName": "spectro-packs/spectro-packs/archive/ubuntu-aws",
          "imageDigest": "sha256:e5982cf244ea436923524ec7453880633b14f77fe2457973f65428c97c5bbfe0",
          "imageTags": ["24.04"],
          "imageSizeInBytes": 6198,
          "imagePushedAt": "2026-03-18T12:03:23.773000-04:00",
          "imageManifestMediaType": "application/vnd.oci.image.manifest.v1+json",
          "artifactMediaType": "application/vnd.unknown.config.v1+json"
        }
      ]
    }
    ```

5.  Mirror the manifest.

    ```shell
    aws ecr-public create-repository \
      --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
      --region us-east-1 2>/dev/null || true
    crane copy \
      "$SPECTRO_ECR/$SPECTRO_BASE/spectro-manifests/manifest:$PALETTE_VERSION" \
      "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-manifests/manifest:$PALETTE_VERSION"
    ```

6.  Verify the manifest mirroring completed.

    ```shell title="Example command"
    aws ecr-public describe-images \
      --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
      --region us-east-1
    ```

    ```json title="Example output" hideClipboard
    {
      "imageDetails": [
        {
          "registryId": "123456789",
          "repositoryName": "spectro-packs/spectro-manifests/manifest",
          "imageDigest": "sha256:f03ad0fc7d8ce4f38b49277343563f72b63c5263794e00908f5023678b8b2972",
          "imageTags": ["4.8.37"],
          "imageSizeInBytes": 1681032,
          "imagePushedAt": "2026-03-18T12:05:56.714000-04:00",
          "imageManifestMediaType": "application/vnd.oci.image.manifest.v1+json",
          "artifactMediaType": "application/vnd.unknown.config.v1+json"
        }
      ]
    }
    ```

</TabItem>

<TabItem label="Private ECR" value="private-ecr">

1. If using a private ECR for packs, issue the following command. Replace `<pack-base-path>` with the repository name
   for your packs, such as `spectro-packs`, and `<your-region>` with your AWS ECR region.

   ```shell
   PACK_BASE_PATH="<pack-base-path>"
   PACK_REGION="<your-region>"
   aws ecr create-repository \
     --repository-name $PACK_BASE_PATH \
     --region $PACK_REGION
   ```

   ```json title="Example output" hideClipboard
   {
     "repository": {
       "repositoryArn": "arn:aws:ecr:us-east-1:123456789:repository/palette",
       "registryId": "123456789",
       "repositoryName": "palette",
       "repositoryUri": "123456789.dkr.ecr.us-east-1.amazonaws.com/palette",
       "createdAt": "2026-03-19T14:33:13.545000-04:00",
       "imageTagMutability": "MUTABLE",
       "imageScanningConfiguration": {
         "scanOnPush": false
       },
       "encryptionConfiguration": {
         "encryptionType": "AES256"
       }
     }
   }
   ```

2. Set the following variables. Replace `<your-account-id>` with your AWS account ID and `<palette-version>` with the
   version of your Palette installation.

   ```shell
   PACK_DEST_ECR="<your-account-id>.dkr.ecr.$PACK_REGION.amazonaws.com"
   PALETTE_VERSION="<palette-version>"
   ```

3. Authenticate to your private ECR.

   ```shell
   crane auth login "$PACK_DEST_ECR" \
     --username AWS \
     --password "$(aws ecr get-login-password --region "$PACK_REGION")"
   ```

   ```shell title="Example output" hideClipboard
   2026/03/19 14:39:04 logged in via /Users/ubuntu/.docker/config.json
   ```

4. Mirror the packs.

   ```shell
   while IFS= read -r pack; do
     [[ -z "$pack" || "$pack" == \#* ]] && continue
     aws ecr create-repository \
       --repository-name "$PACK_BASE_PATH/spectro-packs/archive/${pack%%:*}" \
       --region "$PACK_REGION" 2>/dev/null || true
     crane copy \
       "$SPECTRO_ECR/$SPECTRO_BASE/spectro-packs/archive/$pack" \
       "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-packs/archive/$pack"
   done < packs.txt
   wait
   echo "All done"
   ```

5. Verify the pack mirroring completed by spot-checking a few packs.

   ```shell title="Example command"
   aws ecr list-images \
     --repository-name "$PACK_BASE_PATH/spectro-packs/archive/ubuntu-aws" \
     --region "$PACK_REGION"
   ```

   ```json title="Example output" hideClipboard
   {
     "imageIds": [
       {
         "imageDigest": "sha256:c134ae8b14bbdae1fa9a821ed0729f35a7875b5a69b31cb6000c7616f42fd977",
         "imageTag": "22.04"
       },
       {
         "imageDigest": "sha256:e5982cf244ea436923524ec7453880633b14f77fe2457973f65428c97c5bbfe0",
         "imageTag": "24.04"
       }
     ]
   }
   ```

6. Mirror the manifest.

   ```shell
   aws ecr create-repository \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region "$PACK_REGION" 2>/dev/null || true
   crane copy \
     "$SPECTRO_ECR/$SPECTRO_BASE/spectro-manifests/manifest:$PALETTE_VERSION" \
     "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-manifests/manifest:$PALETTE_VERSION"
   ```

7. Verify the manifest mirror completed.

   ```shell
   aws ecr list-images \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region "$PACK_REGION"
   ```

   ```json title="Example output" hideClipboard
   {
     "imageIds": [
       {
         "imageDigest": "sha256:f03ad0fc7d8ce4f38b49277343563f72b63c5263794e00908f5023678b8b2972",
         "imageTag": "4.8.37"
       }
     ]
   }
   ```

</TabItem>

</Tabs>

## Install Palette

Once your registries are set up and populated with the necessary images and packs, you are ready to install Palette on
your EKS cluster. The installation process requires several Helm charts, some which must be installed before others.
Following is the recommended installation order:

1. **Cert-Manager** - TLS certificate management, required by Palette. Must be installed before Image Swap.
2. **Image Swap** - Webhook that rewrites image references to your public ECR at pod admission time. Must be installed
   before the Palette Management Plane.
3. **Spectro-Mgmt-Crds** - Chart that contains Custom Resource Definitions (CRDs) required by Palette. Must be installed
   before the Palette Management Plane. Can be installed at any point before the Palette Management Plane, as it
   registers API types only and does not deploy pods.
4. **Palette Management Plane** - The main Palette application. Must be installed last.

### Verify Environment Setup

1. Confirm all nodes are in `Ready` state.

   ```shell
   kubectl get nodes
   ```

   ```shell hideClipboard title="Example output"
    NAME                            STATUS   ROLES    AGE   VERSION
    ip-172-31-15-154.ec2.internal   Ready    <none>   25h   v1.33.8-eks-f69f56f
    ip-172-31-47-72.ec2.internal    Ready    <none>   25h   v1.33.8-eks-f69f56f
    ip-172-31-87-121.ec2.internal   Ready    <none>   25h   v1.33.8-eks-f69f56f
   ```

2. Confirm a CSI driver is installed.

   ```shell
   kubectl get csidrivers
   ```

   ```shell title="Example output" hideClipboard
   NAME              ATTACHREQUIRED   PODINFOONMOUNT   STORAGECAPACITY   TOKENREQUESTS   REQUIRESREPUBLISH   MODES        AGE
   ebs.csi.aws.com   true             false            false             <unset>         false               Persistent   24h
   efs.csi.aws.com   false            false            false             <unset>         false               Persistent   25h
   ```

3. Confirm the CSI driver pods are running.

   ```shell
   kubectl get pods --namespace kube-system | grep csi
   ```

   ```shell title="Example output" hideClipboard
    ebs-csi-controller-549989b6f8-9zd68   6/6     Running   0          24h
    ebs-csi-controller-549989b6f8-t5tsm   6/6     Running   0          24h
    ebs-csi-node-8rddx                    3/3     Running   0          24h
    ebs-csi-node-wrw4c                    3/3     Running   0          24h
    ebs-csi-node-zb8mp                    3/3     Running   0          24h
   ```

   :::info

   If the AWS EBS CSI driver is not installed, you can add it as an EKS add-on. Issue the following command, replacing
   `<your-eks-cluster-name>` and `<your-region>` with the appropriate values.

   ```shell
   aws eks create-addon \
     --cluster-name <your-eks-cluster-name> \
     --addon-name aws-ebs-csi-driver \
     --region <your-region>
   ```

   :::

### Install Cert-Manager

Cert-Manager is installed first because Palette depends on it for TLS. Because Image Swap is not yet running,
Cert-Manager image references must be explicitly set to their full public ECR paths in `values.yaml`.

1. Open `charts/extras/cert-manager/values.yaml` in a text editor and update all four image fields to their full public
   ECR paths. Replace `<your-public-alias>` and `<image-base-path>` with your values. Do not change the existing
   `<image-tag>`, as it corresponds to the Palette version used for the Palette images in your public ECR.

   :::tip

   Use the following command to retrieve your AWS public alias.

   ```shell
   aws ecr-public describe-registries --region us-east-1 \
     --query 'registries[0].aliases[0].name' --output text
   ```

   :::

   ```yaml
   image:
     cainjectorImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:<image-tag>"
     controllerImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:<image-tag>"
     webhookImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:<image-tag>"
     amceResolverImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:<image-tag>"
   ```

   ```yaml title="Example Cert-Manager configuration" hideClipboard
   image:
     cainjectorImage: "public.ecr.aws/a1b2c3d4/palette/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:v1.19.3-spectro-4.8.b"
     controllerImage: "public.ecr.aws/a1b2c3d4/palette/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:v1.19.3-spectro-4.8.b"
     webhookImage: "public.ecr.aws/a1b2c3d4/palette/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:v1.19.3-spectro-4.8.b"
     amceResolverImage: "public.ecr.aws/a1b2c3d4/palette/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:v1.19.3-spectro-4.8.b"
   ```

2. Install Cert-Manager on your EKS cluster using the following command.

   ```shell
   helm upgrade --install cert-manager \
     charts/extras/cert-manager/cert-manager-*.tgz \
     --namespace cert-manager \
     --create-namespace \
     --values charts/extras/cert-manager/values.yaml \
     --wait --timeout 10m
   ```

3. Verify all Cert-Manager pods are running.

   ```shell
   kubectl get pods --namespace cert-manager
   ```

   ```shell hideClipboard title="Example Output"
    NAME                                       READY   STATUS    RESTARTS   AGE
    cert-manager-5d87667c6c-dzv2d              1/1     Running   0          5m49s
    cert-manager-cainjector-78df6d579b-pfp7b   1/1     Running   0          5m49s
    cert-manager-webhook-7b9fc85668-sv6dp      1/1     Running   0          5m49s
   ```

### Install Image Swap

Image Swap is a
[Kubernetes admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/).
Once running, it intercepts every pod creation and rewrites image references to point to your public ECR. This means the
Palette chart requires no image path changes.

1. Open `charts/extras/image-swap/image-swap/values.yaml` in a text editor and configure the following sections with the
   necessary values. Do not change the existing `<image-tag>`, as it corresponds to the Palette version used for the
   Palette images in your public ECR.

   ```yaml
   config:
     imageSwapImages:
       imageSwapInitImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-<image-tag>"
       imageSwapImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-<image-tag>"

     imageSwapConfig:
       isEKSCluster: true

     ociImageRegistry:
       endpoint: "public.ecr.aws/<your-public-alias>"
       name: "<your-registry-name>"
       username: ""
       password: ""
       baseContentPath: "<image-base-path>/spectro-images"
       insecureSkipVerify: false
       caCert: ""
       mirrorRegistries: "us-docker.pkg.dev::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev,gcr.io::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/gcr.io,registry.k8s.io::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/registry.k8s.io"

     imagePullSecret:
       create: false
       dockerConfigJson: ""
   ```

2. Install Image Swap using the following command.

   ```shell
   helm upgrade --install image-swap \
     charts/extras/image-swap/image-swap-*.tgz \
     --values charts/extras/image-swap/image-swap/values.yaml \
     --wait --timeout 10m
   ```

3. Verify all Image Swap pods are running.

   ```shell
   kubectl get pods --namespace imageswap-system
   ```

   ```shell hideClipboard title="Example output"
    NAME                         READY   STATUS    RESTARTS   AGE
    imageswap-55f97c9fdd-7whm9   1/1     Running   0          56s
    imageswap-55f97c9fdd-hm47s   1/1     Running   0          56s
   ```

4. Confirm the webhook is registered.

   ```shell
   kubectl get mutatingwebhookconfigurations | grep imageswap
   ```

   ```shell title="Example output" hideClipboard
   imageswap-webhook               1          65s
   ```

### Install Custom Resource Definitions

The `spectro-mgmt-crds` chart contains the CRDs required by Palette, including Traefik CRDs, and must be installed
before the main Palette Helm chart. When the chart is installed, the custom resource types are registered with the
Kubernetes API server; no pods are deployed.

    ```shell
    helm upgrade --install spectro-mgmt-crds \
      charts/extras/spectro-mgmt-crds/spectro-mgmt-crds-*.tgz \
      --values charts/extras/spectro-mgmt-crds/values.yaml \
      --wait --timeout 10m
    ```

### Install Palette

Next, install Palette. Image Swap handles all image rewriting automatically, so no changes to image fields in
`values.yaml` are needed.

1. Open `charts/palette/values.yaml` in a text editor and update the following sections. Do not change any other fields
   unless instructed by our support team.

2. Set the installation mode to airgap.

   ```yaml
   config:
     installationMode: "airgap"
   ```

3. Set the root domain. A wildcard DNS record `*.<your-root-domain>` must point to your ingress load balancer.

   ```yaml
   env:
     rootDomain: "<your-root-domain>"
   ```

4. Set the MongoDB storage class. First, check what storage classes are available on your cluster.

   ```shell
   kubectl get storageclass
   ```

   ```shell title="Example output" hideClipboard
   NAME   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   gp2    kubernetes.io/aws-ebs   Delete          WaitForFirstConsumer   false                  26h
   ```

   Use the name of your preferred storage class in the following configuration.

   ```yaml
   mongo:
     storageClass: "<your-storage-class>"
   ```

5. Configure the pack registry. This points to your ECR where you mirrored the packs and manifest.

   <Tabs groupId="eks-pack-ecr">

   <TabItem label="Public ECR" value="public-ecr">

   ```yaml
   ociPackEcrRegistry:
     endpoint: "public.ecr.aws/<your-public-alias>"
     name: "<your-pack-registry-name>"
     accessKey: ""
     secretKey: ""
     baseContentPath: "<pack-base-path>"
     isPrivate: false
     insecureSkipVerify: false
     caCert: ""
   ```

   </TabItem>

   <TabItem label="Private ECR" value="private-ecr">

   ```yaml
   ociPackEcrRegistry:
     endpoint: "<your-account-id>.dkr.ecr.<your-region>.amazonaws.com"
     name: "<your-pack-registry-name>"
     accessKey: "<your-access-key>"
     secretKey: "<your-secret-key>"
     baseContentPath: "<pack-base-path>"
     isPrivate: true
     insecureSkipVerify: false
     caCert: ""
   ```

   </TabItem>

   </Tabs>

6. Configure the Image Swap section. These values must match what is configured in
   `charts/extras/image-swap/image-swap/values.yaml`.

   ```yaml
   imageSwapImages:
     imageSwapInitImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-<image-tag>"
     imageSwapImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-<image-tag>"

   imageSwapConfig:
     isEKSCluster: true
   ```

7. Copy the `ociImageRegistry` section from `charts/extras/image-swap/image-swap/values.yaml` and replace the commented
   out `ociImageRegistry` section in `charts/palette/values.yaml`.

   ```yaml
   ociImageRegistry:
     endpoint: "public.ecr.aws/<your-public-alias>"
     name: "<your-registry-name>"
     username: ""
     password: ""
     baseContentPath: "<image-base-path>/spectro-images"
     insecureSkipVerify: false
     caCert: ""
     mirrorRegistries: "us-docker.pkg.dev::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev,gcr.io::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/gcr.io,registry.k8s.io::public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/registry.k8s.io"
   ```

8. Install Palette using the following command.

   ```shell
   helm upgrade --install palette \
     charts/palette/spectro-mgmt-plane-*.tgz \
     --namespace spectro-mgmt-plane \
     --create-namespace \
     --values charts/palette/values.yaml \
     --wait --timeout 20m
   ```

9. Monitor the installation. Watch pods come up across all namespaces.

   ```shell
   kubectl get pods --all-namespaces --watch
   ```

10. Verify the installation is complete. Installation is complete when all pods in the `cp-system`, `hubble-system`,
    `ingress-nginx`, `ingress-traefik`, `jet-system`, and `ui-system` namespaces are all in `Running` or `Completed`
    state.

    ```shell
    kubectl get pods --all-namespaces | grep -E '(cp-system|hubble-system|ingress-nginx|ingress-traefik|jet-system|ui-system)'
    ```

    ```shell title="Example output" hideClipboard
    cp-system          spectro-cp-ui-54bd94cc75-2g67f               1/1     Running     0               8m36s
    hubble-system      auth-b995974d-55djq                          1/1     Running     0               8m35s
    hubble-system      auth-b995974d-8x2jn                          1/1     Running     0               8m34s
    hubble-system      cloud-67496d8476-j978v                       1/1     Running     0               8m33s
    hubble-system      cloud-67496d8476-l5mk7                       1/1     Running     0               8m34s
    hubble-system      configserver-64ccbdb879-2l5bc                1/1     Running     0               8m32s
    hubble-system      event-8647fc6599-4f5zw                       1/1     Running     0               8m32s
    hubble-system      event-8647fc6599-4zp2x                       1/1     Running     0               8m31s
    hubble-system      event-8647fc6599-znx6r                       1/1     Running     0               8m31s
    hubble-system      foreq-5b756dd89c-hxbzf                       1/1     Running     0               8m30s
    hubble-system      hashboard-5d757476fd-t8ss7                   1/1     Running     0               8m29s
    hubble-system      hashboard-5d757476fd-x22j7                   1/1     Running     0               8m29s
    hubble-system      hutil-7bd9b87dbb-fzbpj                       1/1     Running     0               8m28s
    hubble-system      hutil-7bd9b87dbb-nd79p                       1/1     Running     0               8m28s
    hubble-system      memstore-7bb7b88cb9-g8gsh                    1/1     Running     0               8m27s
    hubble-system      mgmt-765d456b8f-57lpk                        1/1     Running     0               50m
    hubble-system      mongo-0                                      2/2     Running     0               5m17s
    hubble-system      mongo-1                                      2/2     Running     0               6m32s
    hubble-system      mongo-2                                      2/2     Running     0               8m17s
    hubble-system      mongodb-key-manager-helm-7tbqj               0/1     Completed   0               8m24s
    hubble-system      msgbroker-0                                  1/1     Running     0               8m23s
    hubble-system      msgbroker-1                                  1/1     Running     0               8m12s
    hubble-system      oci-proxy-7db57df545-f9rgx                   1/1     Running     0               50m
    hubble-system      specman-0                                    1/1     Running     0               50m
    hubble-system      spectro-tunnel-65f76dc8bc-z6m9m              1/1     Running     0               50m
    hubble-system      spectrocluster-bb6c497b5-5gxhm               1/1     Running     0               8m21s
    hubble-system      spectrocluster-bb6c497b5-t7kwl               1/1     Running     0               8m21s
    hubble-system      spectrocluster-bb6c497b5-zwn4q               1/1     Running     0               8m22s
    hubble-system      spectrocluster-jobs-6697cd8bf5-xt5km         1/1     Running     0               8m20s
    hubble-system      spectrocluster-reconciler-6976b69644-gtmq9   1/1     Running     0               8m19s
    hubble-system      spectroclusterop-7b8856c7c5-9fbmz            1/1     Running     0               8m19s
    hubble-system      spectroclusterop-7b8856c7c5-cmxcz            1/1     Running     0               8m18s
    hubble-system      spectrossh-6f66c865bd-kr6bm                  1/1     Running     0               8m17s
    hubble-system      system-77b6f5fc9b-8pldv                      1/1     Running     1 (6m19s ago)   8m16s
    hubble-system      system-77b6f5fc9b-pt28f                      1/1     Running     1 (6m23s ago)   8m16s
    hubble-system      timeseries-55b4dd666-hflc5                   1/1     Running     0               8m14s
    hubble-system      timeseries-55b4dd666-k8x8f                   1/1     Running     0               8m15s
    hubble-system      timeseries-55b4dd666-lkw6r                   1/1     Running     0               8m14s
    hubble-system      user-78dc58468d-cm2hk                        1/1     Running     0               8m13s
    hubble-system      user-78dc58468d-hqbzm                        1/1     Running     0               8m13s
    ingress-nginx      ingress-nginx-controller-bgfcw               1/1     Running     1 (7m ago)      8m12s
    ingress-nginx      ingress-nginx-controller-cb5zs               1/1     Running     0               8m11s
    ingress-nginx      ingress-nginx-controller-z4x4w               1/1     Running     0               8m11s
    ingress-traefik    traefik-ingress-controller-9dmzq             1/1     Running     0               51m
    ingress-traefik    traefik-ingress-controller-tpwtf             1/1     Running     0               51m
    ingress-traefik    traefik-ingress-controller-xz4jf             1/1     Running     0               51m
    jet-system         jet-655d48d7bf-bjrrd                         1/1     Running     0               6m16s
    ui-system          spectro-ui-54c9f46dc9-bxtns                  1/1     Running     0               8m9s
    ```

### Create DNS Records

Palette requires two DNS records that point to the load balancer endpoint. You need both a wildcard record for
organization subdomains (tenants) and a root domain record for the
[system console](../../../system-management/system-management.md#access-the-system-console). The following steps use
Route 53 as an example.

1.  Get the load balancer endpoint.

    ```shell
    kubectl get service traefik-ingress-controller \
      --namespace ingress-traefik \
      --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    ```shell title="Example output" hideClipboard
    ad909b53ea79047609ac980dd18f6775-35422349.us-east-1.elb.amazonaws.com
    ```

2.  Finding the hosted zone ID of `<your-root-domain>`.

    ```shell
    aws route53 list-hosted-zones \
      --query "HostedZones[?Name=='<your-root-domain>.']" \
      --output json
    ```

    The hosted zone ID follows `/hostedzone/` in the `Id` field. In the following example, the hosted zone ID is
    `ABCD1234EFGH5678`.

    ```json title="Example output" hideClipboard {3}
    [
      {
        "Id": "/hostedzone/ABCD1234EFGH5678",
        "Name": "docs-test.spectrocloud.com.",
        "CallerReference": "b71eaaab-e387-49d9-97e1-d3a47e9515eb",
        "Config": {
          "Comment": "A domain for the docs and education team to conduct testing",
          "PrivateZone": false
        },
        "ResourceRecordSetCount": 3
      }
    ]
    ```

3.  Create the wildcard CNAME record for organization subdomains using the `<hosted-zone-id>`, `<your-root-domain>`, and
    `<load-balancer-hostname>`.

    ```shell
    aws route53 change-resource-record-sets \
      --hosted-zone-id <hosted-zone-id> \
      --change-batch '{
        "Changes": [{
          "Action": "UPSERT",
          "ResourceRecordSet": {
            "Name": "*.<your-root-domain>",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [{"Value": "<load-balancer-hostname>"}]
          }
        }]
      }'
    ```

    ```json title="Example output" hideClipboard
    {
      "ChangeInfo": {
        "Id": "/change/123456789ABCDEFGHIJK",
        "Status": "PENDING",
        "SubmittedAt": "2026-03-18T19:26:58.547000+00:00"
      }
    }
    ```

4.  Next, create the root domain record for the zone apex (the same as the hosted zone name) or a subdomain within a
    larger zone.

    <Tabs groupId="root-domain-record">

    <TabItem label="Zone Apex (A Alias)" value="zone-apex">

    If `<your-root-domain>` is the zone apex (for example, `docs-test.spectrocloud.com` in a hosted zone for
    `docs-test.spectrocloud.com`), you cannot use a CNAME record, as DNS does not allow CNAMEs at the zone apex.
    Instead, create a Route 53 **A** (Alias) record that points directly to the load balancer.

    1.  Find the load balancer's canonical hosted zone ID.

        ```shell
        aws elbv2 describe-load-balancers \
          --query "LoadBalancers[?DNSName=='<load-balancer-hostname>'].[CanonicalHostedZoneId]" \
          --output text
        ```

        ```shell title="Example output" hideClipboard
        HBDJNJ19D0277D
        ```

    2.  Create the Alias record

        ```shell
        aws route53 change-resource-record-sets \
          --hosted-zone-id <hosted-zone-id> \
          --change-batch '{
            "Changes": [{
              "Action": "UPSERT",
              "ResourceRecordSet": {
                "Name": "<your-root-domain>",
                "Type": "A",
                "AliasTarget": {
                  "HostedZoneId": "<load-balancer-hosted-zone-id>",
                  "DNSName": "<load-balancer-hostname>",
                  "EvaluateTargetHealth": false
                }
              }
            }]
          }'
        ```

        ```json title="Example output" hideClipboard
        {
          "ChangeInfo": {
            "Id": "/change/C0669446V5KE9GEIJFGW",
            "Status": "PENDING",
            "SubmittedAt": "2026-03-18T19:47:53.855000+00:00"
          }
        }
        ```

    </TabItem>

    <TabItem label="Subdomain (CNAME)" value="subdomain">

    If `<your-root-domain>` is _not_ the zone apex (for example, `palette.example.com` in a hosted zone for
    `example.com`), you can use a standard CNAME record.

    1.  Create a CNAME record for the root domain.

        ```shell
        aws route53 change-resource-record-sets \
          --hosted-zone-id <hosted-zone-id> \
          --change-batch '{
            "Changes": [{
              "Action": "UPSERT",
              "ResourceRecordSet": {
                "Name": "<your-root-domain>",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "<load-balancer-hostname>"}]
              }
            }]
          }'
        ```

        ```json title="Example output" hideClipboard
        {
          "ChangeInfo": {
            "Id": "/change/C08234719ABCDEF12345",
            "Status": "PENDING",
            "SubmittedAt": "2026-03-18T19:50:12.123000+00:00"
          }
        }
        ```

    </TabItem>

    </Tabs>

## Validate

After creating your DNS records, wait a few minutes for the records to propagate to the DNS server. Then open a browser
and navigate to the Palette system console at `https://<your-root-domain>/system`, and log in with the default username
(`admin`) and password (`admin`). You must change your password upon logging in for the first time.

## Next Steps

Once you have Palette installed, we recommend taking the following actions:

- **Provide Trusted SSL Certificate** - By default, self-hosted Palette uses a self-signed SSL certificate. If you are
  using a custom SSL certificate, you can
  [add your SSL certificate files](../../../system-management/ssl-certificate-management.md), including your x509
  certificate, key, and Certificate Authority (CA), through the system console.

- **Set Up Tenants** — Tenants are isolated environments in Palette that contain their own clusters, users, and
  resources. You must [set up a tenant](../../../system-management/tenant-management.md) before you can deploy workload
  clusters.

- **Activate Installation** — Required within 30 days. Refer to
  [Activate Palette](../../../activate-installation/activate-installation.md) for guidance.

- **Configure an AWS Cloud Account** - Add your AWS account to Palette to deploy IaaS and EKS clusters through your AWS
  environment. EKS clusters support using
  [EKS Pod Identity](../../../../clusters/public-cloud/aws/add-aws-accounts.md#eks-pod-identity) for authentication in
  addition to IAM users and dynamic Security Token Service (STS) credentials.

- **Launch a Workload Cluster** — Refer to
  [Create and Manage AWS EKS Cluster](../../../../clusters/public-cloud/aws/eks.md) for guidance on deploying EKS
  clusters in Palette. We recommend launching a two-node EKS workload cluster so that Pod Disruption Budgets are
  respected during Kubernetes upgrades, as Palette performs rolling upgrades. Refer to the
  [Amazon EKS managed node group update](https://docs.aws.amazon.com/eks/latest/userguide/update-managed-node-group.html)
  documentation for more information.
