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

- An EKS cluster with three worker nodes with an instance type of `t3a.2xlarge` or larger.

- A Container Storage Interface (CSI) driver installed and running on the EKS cluster, such as the AWS EBS CSI driver.

- A custom domain you control with the ability to create wildcard DNS records.

- A jump host VM with network access to the EKS cluster.

### Jump Host Tools

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — Required to interact
  with AWS ECR and EKS.

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) — Required to connect to and manage the EKS cluster.

- [Helm 3](https://helm.sh/docs/intro/install/) — Required to install the Palette Helm charts.

- [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) — Required to copy container
  images between registries without a local Docker daemon.

### Access

- An AWS account with permissions to create ECR repositories.

- Helm charts provided by Spectro Cloud, downloaded and available under a `charts/` directory.

## Mirror Artifacts to Your ECR

In this activity, you copy all Palette container images, packs, and the manifest from Spectro Cloud's registry into your
own AWS ECR. Spectro Cloud will provide you with access credentials and the list of artifacts to mirror.

### Request Access to the Spectro Cloud Registry

Before any mirroring can happen, Spectro Cloud needs to provision access to their ECR registry for you.

1. Share your organization or company name with your Spectro Cloud Support contact.

2. After Spectro Cloud has provisioned access, they will share the following information with you. Record each value for
   use throughout this guide.

   | **Detail**                        | **Placeholder**              |
   | --------------------------------- | ---------------------------- |
   | Spectro Cloud ECR registry URL    | `<spectro-ecr-registry-url>` |
   | Spectro Cloud ECR registry region | `<spectro-ecr-region>`       |
   | Spectro Cloud base path           | `<spectro-base-path>`        |
   | AWS Access Key                    | `<spectro-access-key>`       |
   | AWS Secret Key                    | `<spectro-secret-key>`       |
   | Palette version                   | `<palette-version>`          |

3. Request the following artifact list files for your release:

   - `packs.txt` — List of pack names to mirror.
   - `images.txt` — List of all container images to mirror.

   :::info

   If you require additional packs for your workload clusters beyond what is supplied, contact Spectro Cloud Support.
   They will provide you with updated `images.txt` and `packs.txt` files containing the additional artifacts to mirror.

   :::

### Set Up Your ECR Registries

Create two base repositories — one for images (always public) and one for packs (public or private).

| **Option**      | **Use when**                                        | **Authentication**                       |
| --------------- | --------------------------------------------------- | ---------------------------------------- |
| **Private ECR** | You want packs restricted to your AWS account       | Long-lived IAM Access Key and Secret Key |
| **Public ECR**  | No compliance requirement, or you prefer simplicity | Not required                             |

#### Create Public ECR Repository for Images

:::info

Public ECR is globally accessible for pulls without authentication. However, AWS centralizes the management API in
`us-east-1`. All `aws ecr-public` commands must use `--region us-east-1`, regardless of where your cluster runs.

:::

1. Ensure your AWS CLI is configured with an identity that has permissions to create and push to ECR repositories. If
   your default AWS profile does not have these permissions, configure a named profile and append
   `--profile <your-profile>` to all `aws ecr-public` and `aws ecr` commands in this guide.

   ```shell
   aws sts get-caller-identity
   ```

   Verify the output displays an identity with ECR permissions. If you use AWS IAM Identity Center, you can configure a
   named profile with `aws configure sso`.

2. Retrieve your public ECR alias and save it as a variable. This value is unique per AWS account.

   ```shell
   ECR_PUBLIC_ALIAS=$(aws ecr-public describe-registries --region us-east-1 \
     --query 'registries[0].aliases[0].name' --output text)
   ```

3. Create the base repository. Replace `<image-base-path>` with a namespace prefix for your images, such as `palette`.
   Do not use `spectro-images` because the mirroring loop appends `spectro-images` as a sub-path automatically.

   ```shell
   IMAGE_BASE_PATH=<image-base-path>
   aws ecr-public create-repository \
     --repository-name $IMAGE_BASE_PATH \
     --region us-east-1
   ```

#### Create Pack Repository

Choose one of the following options depending on whether you want to use a private or public ECR for packs.

<Tabs groupId="eks-pack-ecr">

<TabItem label="Public ECR" value="public-ecr">

If using public ECR for packs, issue the following command. Replace `<pack-base-path>` with the repository name for your
packs, such as `spectro-packs`.

```shell
PACK_BASE_PATH=<pack-base-path>
aws ecr-public create-repository \
  --repository-name $PACK_BASE_PATH \
  --region us-east-1
```

</TabItem>

<TabItem label="Private ECR" value="private-ecr">

If using a private ECR for packs, issue the following command. Replace `<pack-base-path>` with the repository name for
your packs, such as `spectro-packs`, and `<your-region>` with your AWS region.

```shell
PACK_BASE_PATH=<pack-base-path>
PACK_REGION=<your-region>
aws ecr create-repository \
  --repository-name $PACK_BASE_PATH \
  --region $PACK_REGION
```

</TabItem>

</Tabs>

### Mirror Images to Public ECR

1. Set the source and destination variables. Replace each placeholder with the values provided by the Support team in
   the [Request Access to the Spectro Cloud Registry](#request-access-to-the-spectro-cloud-registry) section.

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

2. Authenticate to the Spectro Cloud ECR and your public ECR.

   ```shell
   crane auth login "$SPECTRO_ECR" \
     --username AWS \
     --password "$(AWS_ACCESS_KEY_ID=$SPECTRO_ACCESS_KEY AWS_SECRET_ACCESS_KEY=$SPECTRO_SECRET_KEY \
     aws ecr get-login-password --region "$SPECTRO_REGION")"
   ```

   ```shell
   crane auth login public.ecr.aws \
     --username AWS \
     --password "$(aws ecr-public get-login-password --region us-east-1)"
   ```

   :::warning

   The `crane auth login` command for `public.ecr.aws` must use AWS credentials that have ECR push permissions. The
   token generated carries the permissions of the AWS identity that created it. If your default profile does not have
   push access, include `--profile <your-profile>` in the `aws ecr-public get-login-password` command.

   :::

3. Navigate to the directory containing the `images.txt` and `packs.txt` files received from the Support team.

4. Mirror the images. The following loop reads each image from the `images.txt` file in the current directory, creates
   the target repository in your public ECR, and copies the image from its original public registry.

   ```shell
   while IFS= read -r img; do
     [[ -z "$img" || "$img" == \#* ]] && continue
     aws ecr-public create-repository \
       --repository-name "$IMAGE_BASE_PATH/spectro-images/${img%%:*}" \
       --region us-east-1 2>/dev/null || true
     crane copy \
       "$img" \
       "$IMAGE_DEST_ECR/$IMAGE_BASE_PATH/spectro-images/$img"
   done < images.txt
   ```

   :::info

   The source for container images is the original public registry listed in `images.txt` (for example,
   `registry.k8s.io` or `us-docker.pkg.dev`), not the Spectro Cloud ECR. The Spectro Cloud ECR is used for packs and the
   manifest only.

   :::

5. Verify the mirror completed by spot-checking a few images.

   ```shell
   aws ecr-public describe-images \
     --repository-name "$IMAGE_BASE_PATH/spectro-images/us-docker.pkg.dev/palette-images/palette/crony" \
     --region us-east-1
   ```

### Mirror Packs and the Manifest

Set your pack destination variables based on your registry choice.

<Tabs groupId="eks-pack-ecr">

<TabItem label="Public ECR" value="public-ecr">

1. Set the destination variables.

   ```shell
   PACK_DEST_ECR="public.ecr.aws/<your-public-alias>"
   PACK_BASE_PATH="<pack-base-path>"
   PALETTE_VERSION="<palette-version>"
   ```

2. Authenticate to your public ECR. Skip this step if you already authenticated in the image mirroring section.

   ```shell
   crane auth login public.ecr.aws \
     --username AWS \
     --password "$(aws ecr-public get-login-password --region us-east-1)"
   ```

3. Mirror the packs.

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
   ```

4. Mirror the manifest.

   ```shell
   aws ecr-public create-repository \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region us-east-1 2>/dev/null || true
   crane copy \
     "$SPECTRO_ECR/$SPECTRO_BASE/spectro-manifests/manifest:$PALETTE_VERSION" \
     "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-manifests/manifest:$PALETTE_VERSION"
   ```

5. Verify the mirror completed.

   ```shell
   aws ecr-public describe-images \
     --repository-name "$PACK_BASE_PATH/spectro-packs/archive/ubuntu-aws" \
     --region us-east-1
   ```

   ```shell
   aws ecr-public describe-images \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region us-east-1
   ```

</TabItem>

<TabItem label="Private ECR" value="private-ecr">

1. Set the destination variables.

   ```shell
   PACK_DEST_ECR="<your-account-id>.dkr.ecr.<your-region>.amazonaws.com"
   PACK_REGION="<your-region>"
   PALETTE_VERSION="<palette-version>"
   ```

2. Authenticate to your private ECR.

   ```shell
   crane auth login "$PACK_DEST_ECR" \
     --username AWS \
     --password "$(aws ecr get-login-password --region "$PACK_REGION")"
   ```

3. Mirror the packs.

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
   ```

4. Mirror the manifest.

   ```shell
   aws ecr create-repository \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region "$PACK_REGION" 2>/dev/null || true
   crane copy \
     "$SPECTRO_ECR/$SPECTRO_BASE/spectro-manifests/manifest:$PALETTE_VERSION" \
     "$PACK_DEST_ECR/$PACK_BASE_PATH/spectro-manifests/manifest:$PALETTE_VERSION"
   ```

5. Verify the mirror completed.

   ```shell
   aws ecr list-images \
     --repository-name "$PACK_BASE_PATH/spectro-packs/archive/ubuntu-aws" \
     --region "$PACK_REGION"
   ```

   ```shell
   aws ecr list-images \
     --repository-name "$PACK_BASE_PATH/spectro-manifests/manifest" \
     --region "$PACK_REGION"
   ```

</TabItem>

</Tabs>

### Placeholder Reference

The following table lists all placeholder values used in Activity 1 for quick reference.

| **Placeholder**              | **Description**                                                     |
| ---------------------------- | ------------------------------------------------------------------- |
| `<spectro-ecr-registry-url>` | Spectro Cloud ECR registry URL provided by Support                  |
| `<spectro-ecr-region>`       | AWS region of the Spectro Cloud ECR, provided by Support            |
| `<spectro-base-path>`        | Base path in the Spectro Cloud registry, provided by Support        |
| `<spectro-access-key>`       | AWS Access Key provided by Spectro Cloud Support                    |
| `<spectro-secret-key>`       | AWS Secret Key provided by Spectro Cloud Support                    |
| `<palette-version>`          | Palette version provided by Spectro Cloud Support, such as `4.8.39` |
| `<your-public-alias>`        | Your public ECR alias, retrieved during ECR setup                   |
| `<image-base-path>`          | Public ECR namespace prefix for images, such as `palette`           |
| `<pack-base-path>`           | ECR repository name for packs, such as `spectro-packs`              |
| `<your-account-id>`          | Your AWS account ID (private packs only)                            |
| `<your-region>`              | Your AWS region (private packs only)                                |

## Install Palette

In this activity, you install three Helm charts onto your EKS cluster in the following order:

1. **Cert-Manager** — TLS certificate management, required by Palette.
2. **Image Swap** — Webhook that rewrites image references to your public ECR at pod admission time.
3. **Palette Management Plane** — The main Spectro Cloud management application.

:::warning

Ensure Activity 1 is complete and all artifacts are in your ECR before you begin.

:::

### Prepare for Installation

Copy the Helm charts ZIP file to the jump host and ensure connectivity to `public.ecr.aws` is working from the jump
host.

### Verify Cluster Readiness

1. Confirm all nodes are in `Ready` state.

   ```shell
   kubectl get nodes
   ```

   Your output should display all three nodes in `Ready` state, similar to the following.

   ```shell hideClipboard title="Example Output"
   NAME                             STATUS   ROLES    AGE   VERSION
   ip-xx-xx-xx-xx.ec2.internal      Ready    <none>   x     v1.xx.x
   ip-xx-xx-xx-xx.ec2.internal      Ready    <none>   x     v1.xx.x
   ip-xx-xx-xx-xx.ec2.internal      Ready    <none>   x     v1.xx.x
   ```

2. Confirm a CSI driver is installed and running.

   ```shell
   kubectl get csidrivers
   ```

   ```shell
   kubectl get pods --namespace kube-system | grep csi
   ```

   At least one CSI driver should be listed and its pods should display `Running`.

   :::info

   If the AWS EBS CSI driver is not installed, you can add it as an EKS add-on. Issue the following command, replacing
   `<your-eks-cluster-name>` and `<your-region>` with the appropriate values.

   ```shell
   aws eks create-addon \
     --cluster-name <your-eks-cluster-name> \
     --addon-name aws-ebs-csi-driver \
     --region <your-region>
   ```

   Verify the driver is running with `kubectl get pods --namespace kube-system --selector app=ebs-csi-controller` and
   `kubectl get daemonset ebs-csi-node --namespace kube-system`.

   :::

### Install Cert-Manager

Cert-Manager is installed first because Palette depends on it for TLS. Because Image Swap is not yet running,
Cert-Manager image references must be explicitly set to their full public ECR paths in `values.yaml`.

1. Open the file `charts/extras/cert-manager/values.yaml` in a text editor and update all four image fields to their
   full public ECR paths. Replace `<your-public-alias>` and `<image-base-path>` with your values.

   ```yaml
   image:
     cainjectorImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:v1.19.3-spectro-4.8.b"
     controllerImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:v1.19.3-spectro-4.8.b"
     webhookImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:v1.19.3-spectro-4.8.b"
     amceResolverImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:v1.19.3-spectro-4.8.b"

   imagePullSecret:
     create: false
     dockerConfigJson: ""
   ```

2. Install Cert-Manager using the following command.

   ```shell
   helm upgrade --install cert-manager \
     charts/extras/cert-manager/cert-manager-1.19.3.tgz \
     --namespace cert-manager \
     --create-namespace \
     --values charts/extras/cert-manager/values.yaml \
     --wait --timeout 10m
   ```

3. Verify all Cert-Manager pods are running.

   ```shell
   kubectl get pods --namespace cert-manager
   ```

   Your output should display all pods in `Running` state, similar to the following.

   ```shell hideClipboard title="Example Output"
   NAME                                        READY   STATUS    RESTARTS   AGE
   cert-manager-xxxxxxxxx-xxxxx                1/1     Running   0          x
   cert-manager-cainjector-xxxxxxxxx-xxxxx     1/1     Running   0          x
   cert-manager-webhook-xxxxxxxxx-xxxxx        1/1     Running   0          x
   ```

### Install Image Swap

Image Swap is a Kubernetes admission webhook. Once running, it intercepts every pod creation and rewrites image
references to point to your public ECR. This means the Palette chart in the next step requires no image path changes.

:::info

Like Cert-Manager, Image Swap cannot rewrite its own images during installation. The `imageSwapInitImage` and
`imageSwapImage` fields must be explicitly set to their full public ECR paths.

:::

1. Open the file `charts/extras/image-swap/values.yaml` in a text editor and configure the following sections. Replace
   all placeholders with your values.

   ```yaml
   config:
     imageSwapImages:
       imageSwapInitImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.8.b"
       imageSwapImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.8.b"

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

   :::info

   The `mirrorRegistries` format maps a source registry to its path in your ECR using `::` as a separator. Image Swap
   uses this map to rewrite image references at pod admission time. Add any additional source registries your
   environment requires using the same format.

   :::

2. Install Image Swap using the following command.

   ```shell
   helm upgrade --install image-swap \
     charts/extras/image-swap/image-swap-v1.5.3-spectro-4.8.b.tgz \
     --values charts/extras/image-swap/values.yaml \
     --wait --timeout 10m
   ```

3. Verify all Image Swap pods are running.

   ```shell
   kubectl get pods --namespace imageswap-system
   ```

   Your output should display all pods in `Running` state, similar to the following.

   ```shell hideClipboard title="Example Output"
   NAME                          READY   STATUS    RESTARTS   AGE
   imageswap-xxxxxxxxx-xxxxx     2/2     Running   0          x
   imageswap-xxxxxxxxx-xxxxx     2/2     Running   0          x
   ```

4. Confirm the webhook is registered.

   ```shell
   kubectl get mutatingwebhookconfigurations | grep imageswap
   ```

### Install Palette Management Plane

With Cert-Manager and Image Swap running, install the Palette Management Plane. Image Swap handles all image rewriting
automatically, so no changes to image fields in `values.yaml` are needed.

1. Open the file `charts/palette/values.yaml` in a text editor and update the following sections. Leave all other fields
   at their defaults unless instructed by Spectro Cloud Support.

   Set the installation mode to airgap.

   ```yaml
   config:
     installationMode: "airgap"
   ```

   Set the root domain. A wildcard DNS record `*.<your-root-domain>` must point to your ingress load balancer.

   ```yaml
   env:
     rootDomain: "<your-root-domain>"
   ```

   Set the MongoDB storage class. First, check what storage classes are available on your cluster.

   ```shell
   kubectl get storageclass
   ```

   Use the name of your preferred storage class in the following configuration.

   ```yaml
   mongo:
     storageClass: "<your-storage-class>"
   ```

   Disable the image pull secret because images are on public ECR.

   ```yaml
   global:
     imagePullSecret:
       create: false
       dockerConfigJson: ""
   ```

   Configure ingress. Optionally provide a certificate and key that resolve to your root domain. You can also configure
   this after installation through the system admin console.

   ```yaml
   ingress:
     internal: false
     certificate: ""
     key: ""
   ```

   Configure the pack registry. This points to your ECR where packs and the manifest were mirrored in Activity 1.

   <!-- prettier-ignore -->
   <Tabs>

   <TabItem label="Private ECR for Packs" value="private-packs">

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

   <TabItem label="Public ECR for Packs" value="public-packs">

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

   </Tabs>

   Configure the Image Swap section. These values must match what was set in the Image Swap step.

   ```yaml
   imageSwapImages:
     imageSwapInitImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.8.b"
     imageSwapImage: "public.ecr.aws/<your-public-alias>/<image-base-path>/spectro-images/us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.8.b"

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
   ```

2. Install Palette using the following command.

   ```shell
   helm upgrade --install palette \
     charts/palette/spectro-mgmt-plane-4.8.39.tgz \
     --namespace spectro-mgmt-plane \
     --create-namespace \
     --values charts/palette/values.yaml \
     --wait --timeout 20m
   ```

3. Monitor the installation. Watch pods come up across all namespaces.

   ```shell
   kubectl get pods --all-namespaces --watch
   ```

   Installation is complete when pods in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system`, and
   `ui-system` namespaces are all in `Running` or `Completed` state.

   ```shell
   kubectl get pods --all-namespaces | grep -E '(cp-system|hubble-system|ingress-nginx|jet-system|ui-system)'
   ```

### Access Palette

1. Get the load balancer endpoint.

   ```shell
   kubectl get service ingress-nginx-controller \
     --namespace ingress-nginx \
     --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
   ```

2. Create a DNS wildcard CNAME record that maps `*.<your-root-domain>` to the load balancer hostname from the previous
   step.

3. Once DNS propagates, open a browser and navigate to `https://<your-root-domain>/system`.

4. Log in with the default credentials.

   | **Parameter** | **Value** |
   | ------------- | --------- |
   | Username      | `admin`   |
   | Password      | `admin`   |

   :::danger

   Change the default password immediately on first login.

   :::

5. After login, navigate to **Admin** > **Settings** > **System Address** and upload your SSL certificate files (x509
   certificate, key, and CA — all base64 encoded) to replace the default self-signed certificate. Refer to the
   [Configure HTTPS Encryption](../../../system-management/ssl-certificate-management.md) page for detailed
   instructions.

## Validate

Use the following steps to validate the Palette installation.

1. Open a web browser and navigate to `https://<your-root-domain>/system`. Verify you can log in to the system console.

2. Open a terminal session and issue the following command to verify all Palette pods are running.

   ```shell
   kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
     | grep -E '^(cp-system|hubble-system|ingress-nginx|jet-system|ui-system)\s'
   ```

3. Verify the Image Swap webhook is registered and running.

   ```shell
   kubectl get pods --namespace imageswap-system
   ```

   ```shell
   kubectl get mutatingwebhookconfigurations | grep imageswap
   ```

4. Verify Cert-Manager pods are running.

   ```shell
   kubectl get pods --namespace cert-manager
   ```

## Troubleshooting

| **Symptom**                                        | **Likely Cause**                                                         | **Fix**                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `ImagePullBackOff` on Cert-Manager pods            | Image path in Cert-Manager `values.yaml` is incorrect                    | Verify the full public ECR path is set for all four image fields.                                       |
| `ImagePullBackOff` on Palette pods                 | Image Swap webhook is not running or `mirrorRegistries` is misconfigured | Check `kubectl get pods --namespace imageswap-system` and `kubectl get mutatingwebhookconfigurations`.  |
| Pod stuck in `Pending`                             | No matching storage class or insufficient node capacity                  | Verify storage classes with `kubectl get storageclass` and node capacity with `kubectl describe nodes`. |
| Helm install times out                             | Slow image pull or large chart                                           | Increase `--timeout` and re-run with `helm upgrade --install`.                                          |
| Cert-Manager webhook errors during Palette install | Cert-Manager is not fully ready                                          | Wait for all Cert-Manager pods to reach `Running` state, then re-run the Palette install.               |
| Cannot access `https://<your-root-domain>/system`  | DNS has not propagated or the load balancer is not ready                 | Verify the DNS record and check `kubectl get service --namespace ingress-nginx`.                        |

## Next Steps

With Palette running, you can now proceed with the following tasks:

- **Create your first tenant** — Navigate to `/system` and set up a tenant organization.

- **Activate your installation** — Required within 30 days. Refer to the
  [Spectro Cloud documentation](https://docs.spectrocloud.com) for guidance.

- **Configure an AWS Cloud Account with STS** — When creating an STS-based AWS cloud account, ensure the following IAM
  policies are attached to the IAM user in addition to the standard permissions:

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": "ec2:DescribeRegions",
        "Resource": "*"
      }
    ]
  }
  ```

  ```json
  {
    "Version": "2012-10-17",
    "Statement": {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "*"
    }
  }
  ```

- **Launch a workload cluster** — We recommend launching a two-node EKS workload cluster so that Pod Disruption Budgets
  are respected during Kubernetes upgrades, as Palette performs rolling upgrades. Refer to the
  [Amazon EKS managed node group update](https://docs.aws.amazon.com/eks/latest/userguide/update-managed-node-group.html)
  documentation for more information.

- **Review upgrade procedures** — Retain your `values.yaml` files. They are required for future upgrades.

## Resources

- [Helm Configuration Reference](../palette-helm-ref.md)

- [Configure HTTPS Encryption](../../../system-management/ssl-certificate-management.md)

- [Spectro Cloud Documentation](https://docs.spectrocloud.com)
