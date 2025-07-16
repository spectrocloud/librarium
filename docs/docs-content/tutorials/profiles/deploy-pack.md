---
sidebar_label: "Deploy a Custom Pack"
title: "Deploy a Custom Pack"
description:
  "Learn how to deploy applications to a Kubernetes cluster using Palette's custom packs, hosted in either the Spectro
  registry or an OCI registry."
sidebar_position: 0
toc_max_heading_level: 2
tags: ["packs", "tutorial"]
category: ["tutorial"]
---

Custom add-on packs allow you to deploy Kubernetes applications in clusters and reuse them in multiple deployments. This
ensures uniformity across your clusters. The primary use cases for creating custom packs are:

- Aggregated configuration and application dependencies simplify deployment and consumption.

- Open source contributors can add new Kubernetes applications to a custom add-on pack for the community.

- Enterprises can add proprietary Kubernetes applications to a custom add-on pack.

In this tutorial, you will create a custom add-on pack to package a sample Kubernetes application,
[Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe), and deploy the application to a
cluster. You will learn to create the pack in two ways - using manifest files and Helm charts.

After defining the custom pack, you will set up a new registry server or leverage an existing Open Container Initiative
(OCI) registry. Then, you will publish the pack to the registry and configure the registry server in Palette. Lastly,
you will create a cluster profile that contains your custom pack and apply the profile to a cluster using either Palette
or Terraform.

The following diagram illustrates the sequential steps required to successfully complete this tutorial.

![Architecture Diagram of the Deploy a Custom Pack Tutorial](/tutorials/deploy-pack/registries-and-packs_deploy-pack_architecture-diagram.webp)

## Prerequisites {#prerequisites}

To complete this tutorial, ensure you have the following prerequisites in place:

- A Palette account.
- Tenant admin access to Palette for the purpose of adding a new registry server.
- An Amazon Web Services (AWS) account added to your Palette project settings. Refer to the
  [Add an AWS Account to Palette](https://docs.spectrocloud.com/clusters/public-cloud/aws/add-aws-accounts) guide for
  instructions.
- An SSH key available in the region where you plan to deploy the cluster.
- [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/docs/installation) installed on your local
  machine to start the tutorial container.
- Basic knowledge of containers and Kubernetes manifest file attributes. Refer to the
  [Docker Get Started](https://docs.docker.com/get-started/) guide and the
  [Learn Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) tutorial to start learning.

If you choose to use an OCI registry, you will need the following item.

- An active OCI registry such as [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) or
  [Harbor](https://goharbor.io/).

If you opt for an ECR OCI registry, you will require the following.

- An AWS Identity and Access Management (IAM) user with the following permissions.

  - `ecr:CreateRepository`
  - `ecr:InitiateLayerUpload`
  - `ecr:CompleteLayerUpload`
  - `ecr:InitiateLayerUpload`
  - `ecr:PutImage`
  - `ecr:UploadLayerPart`
  - `ecr:BatchCheckLayerAvailability`
  - `ecr:ListImages`
  - `ecr:DescribeImages`
  - `ecr:BatchDeleteImage`
  - `ecr:DeleteRepository`

:::warning

AWS expenses are associated with this tutorial. An estimated hourly cost is provided by Palette during the cluster
creation step. After completing the tutorial, make sure to delete the infrastructure to avoid additional charges.

:::

## Set Up the Tutorial Environment

In this tutorial, you will work in a container pre-configured with the necessary tools. Alternatively, you can choose to
follow along with the tutorial in any `linux/amd64` or `x86_64` environment by installing the
[required tools](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#docker) and cloning the
[GitHub repository](https://github.com/spectrocloud/tutorials/) that contains the tutorial files. To initialize the
tutorial container, follow the steps described below.

<Tabs>

<TabItem label="Docker" value="Docker">

Start Docker Desktop on your local machine and ensure that the Docker daemon is available by issuing a command to list
the currently active containers.

```bash
docker ps
```

Use the following command to download the `ghcr.io/spectrocloud/tutorials:1.1.7` image to your local machine. This
Docker image includes the necessary tools.

```bash
docker pull ghcr.io/spectrocloud/tutorials:1.1.7
```

Next, start the container and open a bash session into it.

```bash
docker run --name tutorialContainer --publish 7000:5000 --interactive --tty ghcr.io/spectrocloud/tutorials:1.1.7 bash
```

</TabItem>

<TabItem label="Podman" value="Podman">

Ensure that Podman is available by issuing a command to list the currently active containers.

```bash
podman ps
```

Use the following command to download the `ghcr.io/spectrocloud/tutorials:1.1.7` image to your local machine. This image
includes the necessary tools.

```bash
podman pull ghcr.io/spectrocloud/tutorials:1.1.7
```

Next, start the container and open a bash session into it.

```bash
podman run --name tutorialContainer --publish 7000:5000 --interactive --tty ghcr.io/spectrocloud/tutorials:1.1.7 bash
```

</TabItem>

</Tabs>

If the port 7000 on your local machine is unavailable, you can use any other port of your choice.

:::warning

Do not exit the container until the tutorial is complete. Otherwise, you may lose your progress.

:::

## Build a Pack

Building a custom pack involves defining specific files. As outlined in the
[Adding Add-on Packs](../../registries-and-packs/adding-add-on-packs.md) guide, there are two ways to define a custom
pack: using manifest files or Helm charts. The file structure differs for manifest-based packs and Helm chart-based
packs. Below is the reference file structure for each.

<Tabs>

<TabItem label="Manifests-based pack" value="add_on_packs_manifests">

```bash hideClipboard
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory.
├── manifests           # Mandatory.
    ├── manifest-1.yaml
    ├── manifest-2.yaml
│   └── manifest-3.yaml
├── logo.png            # Mandatory.
└── README.md           # Optional.
```

</TabItem>

<TabItem label="Helm charts-based pack" value="add_on_packs_helm_charts">

```bash hideClipboard
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory. Pack-level values.yaml file.
├── charts              # Mandatory.
│   ├── chart-1         # Can have nested charts.
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   │   ├── template-1.yaml
│   │   │   └── template-2.yaml
│   │   └── values.yaml # Chart-level values.yaml file.
│   ├── chart-1.tgz
│   ├── chart-2
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   │   ├── template-1.yaml
│   │   │   └── template-2.yaml
│   │   └── values.yaml # Chart-level values.yaml file.
│   └── chart-2.tgz
├── logo.png            # Mandatory.
└── README.md           # Optional.
```

</TabItem>

</Tabs>

For your convenience, we provide you with the manifest-based pack files for the Hello Universe application. These files
are located in the **packs/hello-universe-pack** folder.

Navigate to the **packs/hello-universe-pack** directory and list its files.

```bash
cd /packs/hello-universe-pack && ls -ll
```

Ensure you have the following files in the current directory.

```bash hideClipboard
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory.
├── manifests           # Mandatory.
│   └── hello-universe.yaml
├── logo.png            # Mandatory.
└── README.md           # Optional.
```

### Pack File Structure

Review each of the following five files in the **hello-universe-pack** folder.

- **pack.json** - This file contains the pack metadata such as `addonType`, `cloudTypes`, and the `kubeManifests` array.
  The array consists of a list of manifest files: `layer`, `name`, and `version`. Refer to the
  [JSON Schema](../../registries-and-packs/add-custom-packs.md#json-schema) for a list of attributes and respective data
  types. The schema validation happens when you push a pack to the registry.

  ```json
  {
    "addonType": "app services",
    "annotations": {
      "source": "community",
      "contributor": "spectrocloud",
    }
    "cloudTypes": ["all"],
    "displayName": "Hello Universe",
    "kubeManifests": ["manifests/hello-universe.yaml"],
    "layer": "addon",
    "name": "hellouniverse",
    "version": "1.2.0"
  }
  ```

- **values.yaml** - This file contains configurable parameters you can define while adding the current pack to a cluster
  profile. In the **values.yaml** file for this tutorial, the `pack/namespace` attribute specifies the namespace on the
  target cluster to deploy the pack. If the **values.yaml** specifies a namespace value, then Palette first checks to
  confirm if the namespace has been created. If so, Palette uses the existing namespace. If the namespace has not yet
  been created, Palette creates a new one using the value specified in the YAML file.

  Keep in mind that if the **values.yaml** does not specify a namespace value, Palette will deploy the application to
  the default namespace.

  The `manifests` section exposes the configurable parameters for each manifest file listed in the **manifests**
  directory. For example, in the sample code snippet below, the `hello-universe` attribute exposes the `registry`,
  `repository`, and `tag` parameters.

  ```yaml
  pack:
    namespace: "hello-universe"
  manifests:
    hello-universe:
      registry: ghcr.io
      repository: spectrocloud/hello-universe
      tag: 1.2.0
  ```

  Optionally, you can define _presets_, which are pack configuration values predefined in a file called **presets.yaml**
  within the pack. Once defined, the **Presets** field becomes visible in both the **Clusters** and **Profile** sections
  of the Palette UI. Users can select any preset from the available pack presets, and upon selection, the predefined
  values of the chosen preset are applied to the pack. Refer
  to [Pack Presets](../../registries-and-packs/pack-constraints.md#preset-attributes) for details and examples of how to
  define presets.

  The example below shows the parameters you can configure in the **values.yaml** file for the `hello-universe` manifest
  during the creation of the cluster profile.

![Screenshot of the configurable parameters in the values.yaml file.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-values-yaml.webp)

- **manifests** - This directory contains the manifest files for your Kubernetes application. This tutorial has only one
  manifest, **hello-universe.yaml**. Note that the **values.yaml** file has a corresponding `manifests/hello-universe`
  element with the same name as the YAML file.

- **logo.png** - This file contains a logo that displays when you create a cluster profile.

- **README.md** - This file may contain the pack description, purpose, authors, and other relevant information. The
  README in the current example introduces the application used in the pack.

After completing the review of all files in the pack directory, the next step is to set up a registry server, publish
the pack to the registry, and configure the registry in Palette.

## Set Up the Registry Server

You can set up a registry server using either the Spectro registry or an OCI-compliant registry. Palette supports all
OCI-compliant registries.

:::info

We recommend using an OCI registry to store and maintain your packs. Refer to the
[OCI registry](../../registries-and-packs/registries/oci-registry/oci-registry.md) section for more information.

:::

The tutorial environment already includes the Spectro registry service and other necessary tools. For OCI registries, as
per the [Prerequisites](#prerequisites) section, ensure you have an active OCI registry. Two types of OCI authentication
are available: **Amazon (ECR)** and **Basic**. To learn more about Amazon ECR, consult the
[What is ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) user guide.

For Basic OCI Authentication, this tutorial uses a [Harbor registry](https://goharbor.io/) as an example. However, you
have the flexibility to opt for the OCI registry of your choice. Learn how to set up a Harbor registry server using the
[Harbor Installation and Configuration](https://goharbor.io/docs/2.9.0/install-config/) guide.

The following sections will guide you through starting the registry server, authenticating, pushing your custom add-on
pack, and, finally, configuring the registry server in Palette. Select the tab below corresponding to the registry type
you want to use.

### Start the Registry Server

<Tabs groupId="registry-server">

<TabItem label="Basic" value="Basic_Registry">

Once you have an active Harbor registry server, access its domain on your web browser and log in using your Harbor
credentials. If you have kept the default credentials, the username and password are **admin** and **Harbor12345**,
respectively.

![Screenshot of Harbor login](/tutorials/deploy-pack/registries-and-packs_deploy-pack_harbor-login.webp)

In the **Projects** section, click on **New Project**. A project in Harbor contains all repositories of an application.
This tutorial uses **spectro-oci-registry** as the project name. Keep the default settings for the remaining
configuration options and proceed by clicking **OK**.

![Screenshot of Harbor project](/tutorials/deploy-pack/registries-and-packs_deploy-pack_harbor-project.webp)

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

The initial step to creating the pack's repository in the ECR registry is to export your AWS credentials as environment
variables for authentication.

In the tutorial container bash session initialized in the
[Set Up the Tutorial Environment](#set-up-the-tutorial-environment) section, export the following variables. This
tutorial utilizes **us-east-1** as the default region.

```bash
export AWS_ACCESS_KEY_ID=<Your_Access_Key_ID>
export AWS_SECRET_ACCESS_KEY=<Your_Secret_Access_Key>
export AWS_DEFAULT_REGION=<Your_Default_Region>
```

Next, export the variables below, which you will use later to create the ECR repository and push the pack.

- `REGISTRY_NAME` - the name of your ECR registry. This tutorial uses **spectro-oci-registry**.
- `NAME` - the pack's name, which must match the name in the **pack.json** file.
- `VERSION` - the pack's version, which must match the version in the **pack.json** file.
- `ACCOUNT_ID` - your AWS account ID, containing only numerical digits and no dashes.

:::warning

Ensure that the variables `NAME` and `VERSION` match the pack name and version in the **pack.json** file. This is a
requirement for the pack to be correctly pushed to the registry.

:::

```bash
export REGISTRY_NAME=spectro-oci-registry
export NAME=hellouniverse
export VERSION=1.0.0
export ACCOUNT_ID=<Your_AWS_Account_ID>
```

Create a base path repository to store your pack repositories using the AWS CLI, which is already installed in the
tutorial container. Follow the provided structure below.

```bash
aws ecr create-repository --repository-name $REGISTRY_NAME/spectro-packs/archive --region $AWS_DEFAULT_REGION
```

Next, create the repository to store the Hello Universe pack.

```bash
aws ecr create-repository --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
```

:::warning

Make sure to include the **spectro-packs/archive** path in _all_ your repositories to meet Palette's requirements.

:::

This configuration sets up the required environment and repositories for pushing the Hello Universe pack to your ECR
Registry.

</TabItem>

<TabItem label="Spectro Registry" value="Spectro_Registry">

Start the registry server by issuing the following command from the tutorial container bash session initialized in the
[Set Up the Tutorial Environment](#set-up-the-tutorial-environment) section.

```bash
registry serve /etc/spectro/config.yml > /var/log/registry.log 2>&1 &
```

The registry server starts in HTTP mode. If you want to deploy an HTTPS registry server, refer to the
[Add a Custom Registry](../../registries-and-packs/adding-a-custom-registry.md) guide.

Next, make the registry server accessible to the public using [Ngrok](https://ngrok.com/) reverse proxy so that you can
configure it later in Palette. Execute the command below to expose the registry server listening on port 5000 via an
HTTP tunnel.

```bash
ngrok http 5000 --log-level debug
```

This command reserves the current bash session and displays the status of each HTTP request made to the Ngrok server.
The image below shows the registry server successfully exposed via Ngrok.

![Screenshot of registry server exposed via Ngrok](/tutorials/deploy-pack/registries-and-packs_deploy-pack_ngrok-start.webp)

Check if the registry server is accessible from outside the tutorial container by visiting the `/health` endpoint. Open
your browser and go to `https://Your-URL-Here/health`, replacing the base URL with the Ngrok URL output. You should get
a `{"status":"UP"}` response.

</TabItem>

</Tabs>

### Log in to the Registry Server

<Tabs groupId="registry-server">

<TabItem label="Basic" value="Basic_Registry">

After creating the projects, proceed with the Harbor authentication. In the tutorial container bash session, export the
`HARBOR_ADDRESS` variable, which will store your Harbor address. Do not include the "https://" prefix.

```bash
export HARBOR_ADDRESS=<Your_Harbor_Address>
```

Now, issue the command `oras login`. [ORAS](https://oras.land/docs/) is a CLI tool to push and pull OCI artifacts to and
from OCI registries.

:::warning

If you are not using the tutorial container, ensure you have ORAS version `1.0.0` installed. This version is explicitly
required for pushing packs to OCI registries.

:::

```bash
oras login $HARBOR_ADDRESS
```

You will be prompted for your Harbor username and password. If the login is successful, you will receive the following
confirmation message.

```hideClipboard
Username: admin
Password:
Login Succeeded
```

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

After you have created the repositories, authenticate to your ECR registry using the `aws ecr get-login-password`
command. The ECR authorization token is then passed to the `oras login` command with **AWS** as username and the
registry Uniform Resource Identifier (URI). [ORAS](https://oras.land/docs/) is a CLI tool to push and pull OCI artifacts
to and from OCI registries.

:::warning

If you are not using the tutorial container, ensure you have ORAS version `1.0.0` installed. This version is explicitly
required for pushing packs to OCI registries.

:::

```bash
aws ecr get-login-password --region $AWS_DEFAULT_REGION | oras login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
```

If the login is successful, you will receive the following confirmation message.

```hideClipboard
Login Succeeded
```

</TabItem>

<TabItem label="Spectro Registry" value="Spectro_Registry">

Once the `/health` endpoint of the registry server displays an `UP` status, proceed to the authentication step. In a new
terminal window, start another bash session in the tutorial container.

<Tabs>

<TabItem label="Docker" value="Docker">

```bash
docker exec -it tutorialContainer bash
```

</TabItem>

<TabItem label="Podman" value="Podman">

```bash
podman exec -it tutorialContainer bash
```

</TabItem>

</Tabs>

Log in to the registry server using the Ngrok public URL assigned to you. Issue the following command, replacing the URL
with your Ngrok URL. The `--insecure` flag indicates that the connection to the Spectro registry will be made without
verifying the TLS certificate. The command below uses these credentials to log in to the registry server:
`{username: admin, password: admin}`.

```bash
spectro registry login  --insecure --default --username admin --password admin \
58ec-174-119-143-38.ngrok-free.app
```

:::warning

Do not include the "https://" or "http://" prefixes in the Ngrok URL. Using either of these prefixes will result in an
authorization issue.

:::

You will receive a `Login Succeeded` response upon successful login.

```bash hideClipboard
# Output condensed for readability
WARNING! Your password will be stored unencrypted in /root/.spectro/config.json.
Login Succeeded
```

</TabItem>

</Tabs>

### Push the Pack to the Registry Server

<Tabs groupId="registry-server">

<TabItem label="Basic" value="Basic_Registry">

Once you are authenticated to your Harbor registry, export the following variables, which you will use to create the
Harbor repository and push the pack.

- `HARBOR_PROJECT` - the name of your Harbor project. This tutorial uses **spectro-oci-registry**.
- `NAME` - the pack's name, which must match the name in the **pack.json** file.
- `VERSION` - the pack's version, which must match the version in the **pack.json** file.

:::warning

Ensure that the variables `NAME` and `VERSION` match the pack name and version in the **pack.json** file. This is a
requirement for the pack to be correctly pushed to the registry.

:::

```bash
export HARBOR_PROJECT=spectro-oci-registry
export NAME=hellouniverse
export VERSION=1.0.0
```

Next, navigate to the **packs** directory, which contains the pack folder, **hello-universe-pack**.

```bash
cd /packs
```

Before pushing the pack to the registry, compress the contents of the pack folder into an archive file. Issue the
command below to create the archive file.

```bash
tar -czvf $NAME-$VERSION.tar.gz hello-universe-pack
```

Harbor creates a repository when the user pushes an artifact to a project. Create a base path repository to store your
pack repositories.

```bash
oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive
```

Now, proceed to create the pack repository and push the Hello Universe pack to the Harbor registry.

```bash
oras push $HARBOR_ADDRESS/$HARBOR_PROJECT/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
```

To confirm the presence of the pack in the repository, open your web browser, access your Harbor address, click on
**Projects**, select the **spectro-oci-registry** project, and then click on the
**spectro-oci-registry/spectro-packs/archive/hellouniverse** repository. You should verify the pushed artifact, as shown
in the image below.

![Screenshot of the Hello Universe Harbor Repository](/tutorials/deploy-pack/registries-and-packs_deploy-pack_harbor-repository.webp)

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

Once you are authenticated to your ECR registry, navigate to the **packs** directory, which contains the pack folder,
**hello-universe-pack**.

```bash
cd /packs
```

Before pushing the pack to the registry, compress the contents of the pack folder into an archive file. Issue the
command below to create the archive file.

```bash
tar -czvf $NAME-$VERSION.tar.gz hello-universe-pack
```

Now, proceed to push the **Hello Universe** pack to the ECR registry.

```bash
oras push $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REGISTRY_NAME/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
```

You can use the `aws ecr describe-images` command to check if the pushed pack is listed in your ECR repository.

```bash
aws ecr describe-images --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
```

The snippet below displays the output of the `aws ecr describe-images` command, confirming the presence of the Hello
Universe pack in the repository.

```plainText {5-8} hideClipboard
{
    "imageDetails": [
        {
            "registryId": "<YourRegistryId>
            "repositoryName": "spectro-oci-registry/spectro-packs/archive/hellouniverse",
            "imageDigest": "sha256:<YourImageSha>",
            "imageTags": [
                "1.0.0"
	        ],
            "imageSizeInBytes": 19059,
            "imagePushedAt": "2023-11-06T11:19:48+00:00",
            "imageManifestMediaType": "application/vnd.oci.image.manifest.v1+json",
            "artifactMediaType": "application/vnd.unknown.config.v1+json",
            "lastRecordedPullTime": "2023-11-17T00:00:48.649000+00:00"
		    }
	  ]
}
```

</TabItem>

<TabItem label="Spectro Registry" value="Spectro_Registry">

Once you are logged in, push the pack to the registry server using the following command.

```bash
spectro pack push /packs/hello-universe-pack/
```

To confirm that the pack is now in the registry, use the `ls` command. This command lists all packs available in the
registry.

```bash
spectro pack ls
```

Check if the pushed pack is listed, as shown in the image below.

![Screenshot of spectro pack ls](/tutorials/deploy-pack/registries-and-packs_deploy-pack_pack-push.webp)

For assistance with Spectro CLI commands, refer to the
[Spectro CLI Commands](../../registries-and-packs/spectro-cli-reference.md#commands) guide.

</TabItem>

</Tabs>

### Configure the Registry Server in Palette

<Tabs groupId="registry-server">

<TabItem label="Basic" value="Basic_Registry">

After pushing the pack to the Harbor registry, follow the next steps to log in to Palette and add the Harbor registry to
it.

Log in to [Palette](https://console.spectrocloud.com) and switch to the **Tenant Admin** view.

![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.webp)

Navigate to the **Tenant Settings** > **Registries** > **OCI Registries** section and click on **Add New OCI Registry**.
Palette will open a pop-up window prompting you for the required fields to configure an OCI registry.

![A screenshot highlighting the fields to configure an OCI registry.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_basic-oci-registry.webp)

Provide the registry name. For consistency, we suggest using the registry name **harbor-registry**. Choose **Pack** as
the provider and select **Basic** as the OCI authentication type. Complete the **Endpoint** field with your Harbor
registry address. Ensure to include "https://" as the prefix.

Next, set the base content path as **spectro-oci-registry**, which corresponds to your Harbor project name. Then, enter
your Harbor credentials in the **Username** and **Password** fields.

Last, click on **Validate** to ensure the provided URL and credentials are correct. After validation, click on
**Confirm** to complete the Harbor registry configuration.

![Screenshot of OCI registry fields in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_basic-oci-registry-edit.webp)

Palette automatically syncs the registry. However, you can sync it manually by clicking the **three-dot Menu** next to
the registry name and selecting **Sync**.

![Screenshot of OCI registry sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_basic-oci-registry-sync.webp)

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

After pushing the pack to the ECR registry, follow the next steps to log in to Palette and add the ECR registry to it.

Log in to [Palette](https://console.spectrocloud.com) and switch to the **Tenant Admin** view.

![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.webp)

Navigate to the **Tenant Settings** > **Registries** > **OCI Registries** section and click on **Add New OCI Registry**.
Palette will open a pop-up window prompting you for the required fields to configure an OCI registry.

![A screenshot highlighting the fields to configure an OCI registry. ](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry.webp)

Provide the registry name. For consistency, we suggest using the registry name **ecr-registry**. Choose **Pack** as the
provider and select **ECR** as the OCI authentication type. Complete the **Endpoint** field with your ECR registry URI.
The URI follows the structure `123456.dkr.ecr.us-east-1.amazonaws.com`. Replace **123456** with your AWS account ID and
**us-east-1** with your AWS default region.

Next, set the base content path as **spectro-oci-registry**, which is your ECR registry name. Toggle the **Protected**
option, choose **Credentials** as the AWS authentication method, and specify your AWS access and secret access keys.

Last, click on **Validate** to ensure the provided URL and credentials are correct. After validation, click on
**Confirm** to finish the ECR registry configuration.

![Screenshot of OCI registry fields in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry-edit.webp)

Palette automatically syncs the registry. However, you can sync it manually by clicking the **three-dot Menu** next to
the registry name and selecting **Sync**.

![Screenshot of OCI registry sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry-sync.webp)

</TabItem>

<TabItem label="Spectro Registry" value="Spectro_Registry">

After pushing the pack to the registry server, follow the next steps to log in to Palette and add the registry server to
it.

Log in to [Palette](https://console.spectrocloud.com) and switch to the **Tenant Admin** view.

![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.webp)

Navigate to the **Tenant Settings** > **Registries** > **Pack Registries** section and click on **Add New Pack
Registry**. Palette will open a pop-up window prompting you for the required fields to configure a custom pack registry.

![A screenshot highlighting the fields to configure a custom pack registry. ](/tutorials/deploy-pack/registries-and-packs_adding-a-custom-registry-tls_certificate.webp)

Provide the pack registry name, endpoint, and user credentials in the pop-up window. For consistency, we suggest using
the registry name **spectro-pack-registry**. Use your Ngrok URL as the pack registry endpoint. Ensure to add "https://"
as the prefix in the pack registry endpoint. Set both the username and password as **admin**.

In the **TLS Configuration** section, select the **Insecure Skip TLS Verify** checkbox. This tutorial does not establish
a secure HTTPS connection between Palette and your pack registry server. Therefore, you can skip the TLS verification.
Instead, this tutorial uses an unencrypted HTTP connection. However, in a production environment, you can upload your
certificate in the **TLS Configuration** section if you need Palette to establish a secure HTTPS connection while
communicating with the pack registry server.

Click on **Validate** to ensure the provided URL and credentials are correct, then click on **Confirm** to finish the
registry server configuration.

![Screenshot of registry server edit option in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-edit.webp)

Palette automatically syncs the registry server. However, you can sync it manually by clicking the **three-dot Menu**
next to the registry server name and selecting **Sync**.

![Screenshot of registry server sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-sync.webp)

</TabItem>

</Tabs>

## Create a Cluster Profile and Deploy a Cluster

Once you have configured the registry, create a cluster profile and apply the profile to a cluster in Palette. This
tutorial provides two workflows from which you can choose: Palette User Interface (UI) or Terraform.

<Tabs groupId="deploy-cluster">

<TabItem label="UI Workflow" value="UI_Workflow">

### Create a Cluster Profile

Switch to the **Default** project scope for creating a cluster profile.

![Screenshot of the Palette Default scope.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.webp)

Next, select the **Profiles** section in the left **Menu** to create a cluster profile that combines the core
infrastructure and add-on layers. Click on the **Add Cluster Profile** button.

#### Basic Information

Complete the wizard using the values provided below.

| **Field**   | **Value**                                                              |
| ----------- | ---------------------------------------------------------------------- |
| Name        | pack-tutorial-profile                                                  |
| Version     | `1.0.0`                                                                |
| Description | Cluster profile as part of the Deploy a Custom Pack tutorial.          |
| Type        | Full                                                                   |
| Tags        | `spectro-cloud-education, app:hello-universe, terraform_managed:false` |

Click on **Next** to continue.

#### Cloud Type

In the **Cloud Type** section, select AWS as the infrastructure provider, and click on **Next** at the bottom to proceed
to the next section.

:::info

If you choose a different cloud provider, note that the options for core infrastructure layers, as outlined in the
**Profile Layers** section below, will differ from those presented in this tutorial.

:::

#### Profile Layers

In the **Profile Layers** section, add the following core infrastructure layers.

| **Pack Type** | **Registry** | **Pack Name**               | **Pack Version** |
| ------------- | ------------ | --------------------------- | ---------------- |
| OS            | Public Repo  | Ubuntu                      | `22.04`    |
| Kubernetes    | Public Repo  | Palette eXtended Kubernetes | `1.32.3`         |
| Network       | Public Repo  | Calico                      | `3.29.3`         |
| Storage       | Public Repo  | Amazon EBS CSI              | `1.41.0`         |

As you add each layer, click on the **Next layer** button. After adding the **Storage** layer, click on the **Confirm**
button to complete the core infrastructure stack. Palette displays the newly created infrastructure profile as a layered
diagram. You can select any layer to make further edits or change the version if desired.

Next, proceed to include the add-on layers. Click on the **Add New Pack** button.

<!-- prettier-ignore -->
Add the Spectro Proxy pack to enable a reverse proxy to connect to the cluster's API. Adding this pack is _optional_,
but it will help connect your local machine to the cluster's API for debugging. Refer to the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> guide for more details.

| **Pack Type**  | **Registry** | **Pack Name** | **Pack Version** |
| -------------- | ------------ | ------------- | ---------------- |
| Authentication | Public Repo  | Spectro Proxy | `1.4.x`          |

Click on the **Confirm & Create** button to finish adding the Spectro Proxy pack.

Now, click on the Kubernetes layer and add the following certificate Subject Alternative Name (SAN) value under the
`apiServer` parameter section to configure the Spectro Proxy pack.

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

![Screenshot of the certificate Subject Alternative Name.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-certsan.webp)

Finally, add the Hello Universe pack. Click on **Add New Pack** and select the registry you created earlier in this
tutorial. The table below specifies the registry name corresponding to the registry type. For example, if you created an
ECR registry, select **ecr-registry**.

| **Pack Type** | **Registry Type** | **Registry Name**     | **Pack Name**  | **Pack Version** |
| ------------- | ----------------- | --------------------- | -------------- | ---------------- |
| App Services  | Spectro Registry  | spectro-pack-registry | Hello Universe | `1.2.0`          |
| App Services  | ECR               | ecr-registry          | Hello Universe | `1.2.0`          |
| App Services  | Basic             | harbor-registry       | Hello Universe | `1.2.0`          |

Click on the **Confirm & Create** button to finish adding the Hello Universe pack.

If there are no errors or compatibility issues, Palette displays the cluster profile. Verify the layers you added, and
click **Next**.

![Screenshot of the Profile Layers success.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-layer.webp)

#### Review

Review the cluster layers and click on **Finish Configuration** to complete the creation of the cluster profile.

### Create a Cluster

Navigate to the **Profiles** page and select the recently created cluster profile. Click on the **Deploy** button to
start the deployment of a new cluster.

#### Basic Information

For the first section, **Basic information**, use the following values.

| **Field**     | **Value**                                                              |
| ------------- | ---------------------------------------------------------------------- |
| Cluster name  | pack-tutorial-cluster                                                  |
| Description   | Cluster as part of the Deploy a Custom Pack tutorial.                  |
| Tags          | `spectro-cloud-education, app:hello-universe, terraform_managed:false` |
| Cloud Account | Select the cloud you have registered in Palette for AWS                |

Click **Next** to proceed.

#### Parameters

The **Parameters** section allows you to change the profile configurations. For example, by clicking on the **Hello
Universe 1.0.x** layer, you can configure the `registry`, `repository`, and `tag` parameters defined in the
**values.yaml** file.

![Screenshot of the Cluster layers.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-layers.webp)

Keep the default values and click **Next**.

#### Cluster config

In the **Cluster config** section, make sure to uncheck the **Static Placement** field. If it is checked, the **Static
Placement** will deploy the cluster within an existing Virtual Private Cloud (VPC), and you will need to provide the
[Amazon Resource Names](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html) (ARNs) for the existing
subnets, roles, and other resources. This tutorial will use dynamic placement, allowing Palette to create a new VPC
along with all necessary resources for the cluster.

In the **Region** field, choose the region of your preference. This tutorial will deploy the cluster in the
**us-east-1** region. For the **SSH Key Pair Name** field, select the SSH key pair name available in the chosen region.
Ensure that you have already created an SSH key in the AWS region where you plan to deploy the cluster.

Click **Next** to continue.

#### Nodes config

In the **Nodes config** section, provide the details for the control plane and worker pools. For this tutorial, you can
use the following minimal configuration:

| **Field**                   | **Value for the control-plane-pool** | **Value for the worker-pool**                                      |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Node pool name              | control-plane-pool                   | worker-pool                                                        |
| Number of nodes in the pool | `1`                                  | `1`                                                                |
| Allow worker capability     | Checked                              | Not applicable                                                     |
| Enable Autoscaler           | Not applicable                       | No                                                                 |
| Rolling update              | Not applicable                       | Expand First. Launch a new node first, then shut down the old one. |

Keep the **Cloud Configuration** the same for both control plane and worker pools.

| **Field**          | **Value**                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Instance Type      | General purpose `m4.xlarge` A minimum allocation of four CPU cores is required for the control plane node. |
| Availability zones | Choose any _one_ availability zone. This tutorial uses the `us-east-1a` availability zone.                 |
| Disk size          | 60 GiB                                                                                                     |

Click **Next** to continue.

#### Settings

The **Settings** section displays options for OS patching, scheduled scans, scheduled backups, and cluster role binding.
Use the default values, and click on the **Validate** button.

#### Review

Review all configurations in this section. The **Review** page displays the cluster name, tags, cloud account name, node
pools, layers, and an estimated hourly cost. If everything is correct, click on the **Finish Configuration** button to
complete the cluster deployment, which may take up to _20 minutes_.

While the deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the
cluster to finish deploying, you can explore the various tabs on the cluster page, such as **Overview**, **Workloads**,
and **Events**.

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform_Workflow">

The [Spectro Cloud Terraform Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
allows you to create and manage Palette resources using Infrastructure as Code (IaC). This approach offers several
advantages, including automating infrastructure, facilitating collaboration, documenting infrastructure, and keeping a
single source of truth for all infrastructure.

### Starter Code

Return to your tutorial container bash session to locate the starter Terraform files. If you have closed the terminal
session, you can open another bash session in the tutorial container using the following command.

<Tabs>

<TabItem label="Docker" value="Docker">

```bash
docker exec -it tutorialContainer bash
```

</TabItem>

<TabItem label="Podman" value="Podman">

```bash
podman exec -it tutorialContainer bash
```

</TabItem>

</Tabs>

Navigate to the **/terraform/pack-tf** directory, which contains the Terraform code for this tutorial.

```bash
cd /terraform/pack-tf
```

### Set Up the Spectro Cloud API Key

To get started with Terraform code, you need a Palette API key to authenticate and interact with the Palette API
endpoint. To add a new API key, log in to Palette, click on the **User Menu** at the top right, and select **My API
Keys**, as shown in the screenshot below. Visit the
[Create API Key](../../user-management/authentication/api-key/create-api-key.md) guide for more information.

![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.webp)

Below are the steps to add and export an API key:

1. Fill in the required fields, such as the API key name and expiration date, and confirm your changes.

2. Copy the key value to your clipboard and switch back to the tutorial container environment.

3. In your tutorial container bash session, export the API key as an environment variable. This step allows the
   Terraform code to authenticate with the Palette API.

```bash
export SPECTROCLOUD_APIKEY=<Your-Spectro-Cloud-API-key>
```

### Review the Terraform Files

Ensure you have the following files in the current working directory.

```bash hideClipboard
.
├── profile.tf		# Resource
├── cluster.tf		# Resource
├── data.tf			  # Spectro Cloud data resources
├── inputs.tf		  # Input variables
├── terraform.tfvars  # Variable definitions file
├── outputs.tf		# Output variables
└── provider.tf		# Spectro Cloud Terraform provider
```

:::warning

Note that the Terraform code will deploy the resources to **AWS**.

:::

We recommend that you explore all Terraform files. Below is a high-level overview of each file.

- **profile.tf** - contains the configuration for the `spectrocloud_cluster_profile` resource. Review the core
  infrastructure layers that make up the `spectrocloud_cluster_profile` resource.

- **cluster.tf** - contains the configuration for the `spectrocloud_cluster_aws` resource. The cluster resource depends
  on the `spectrocloud_cluster_profile` resource.

- **data.tf** - contains the configuration for the resources to retrieve data from Palette dynamically. The table below
  lists the pack details required for each pack layer in order to deploy the `spectrocloud_cluster_profile` resource.

  | **Pack Type** | **Registry** | **Pack Name**   | **Tag**       | **Version** |
  | ------------- | ------------ | --------------- | ------------- | ----------- |
  | OS            | Public Repo  | `ubuntu-aws`    | `LTS__22.4.x` | `22.04`     |
  | Kubernetes    | Public Repo  | `kubernetes`    | `1.28.x`      | `1.32.3`    |
  | Network       | Public Repo  | `cni-calico`    | `3.26.x`      | `3.29.3`    |
  | Storage       | Public Repo  | `csi-aws-ebs`   | `1.22.x`      | `1.41.0`    |
  | App Services  | Private Repo | `hellouniverse` | `1.0.x`       | `1.2.0`     |

- **inputs.tf** - contains the variables used in the tutorial, such as the names of cluster profile, cluster, cloud
  account, SSH key name, AWS region, pack name, and registry server.

  Some variables have a default value, but you _must_ provide the values for the `cluster_cloud_account_aws_name`,
  `aws_region_name`, `ssh_key_name`, and `private_pack_registry` variables. You will find a `#ToDo` tag next to each
  variable that needs updating. Provide the values for these variables in a separate file, **terraform.tfvars**. Use the
  default values for the remaining variables.

- **terraform.tfvars** - contains the variable definitions. The list of variables is outlined in the code block below.
  You _must_ specify the values for all variables marked as `"REPLACE ME"`. Read the inline comments below to understand
  each variable.

  - For example, the value for `cluster_cloud_account_aws_name` should be the name of the cloud account added to your
    Palette project settings.
  - For `aws_region_name`, you can choose any
    [AWS region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) for
    your deployment. This tutorial uses the **us-east-1** region.

  - For `aws_az_names`, you should specify the AWS availability zone (AZ) name in which you want the cluster to be
    available. By default, this tutorial uses the first available AZ in the region.
  - The value for `ssh_key_name` should be the name of the AWS SSH key pair available in the region where you will
    deploy the cluster.
  - Next, provide your registry server name for the `spectro_pack_registry` variable. For example, you can use the
    **spectro-pack-registry** as the value if you have followed this tutorial's naming convention and used the Spectro
    registry. If you used an ECR registry, set the registry server name to **ecr-registry**. Lastly, if you used a
    Harbor registry, set the registry server name to **harbor-registry**.

  - Lastly, set the value of the `use_oci_registry` variable to either true or false. For instance, if you are not using
    an OCI registry, set this value to false. The default value is set to true.

  ```bash
  cluster_cloud_account_aws_name = "REPLACE ME"   # Name of the cloud account added to your Palette project settings.
  aws_region_name = "REPLACE ME"                  # Use "us-east-1" or any other AWS region.
  aws_az_names = []                               # Specify the AWS availability zone name in which you want the cluster to be available. By default, only one AZ will be selected. For example: ['us-east-1a', 'us-east-1b', 'us-east-1c'].
  ssh_key_name = "REPLACE ME"                     # Name of the SSH key available in the region where you will deploy the cluster.
  private_pack_registry = "REPLACE ME"            # Your registry server name. This tutorial uses "spectro-pack-registry".
  use_oci_registry = true                         # Set the use of OCI registry to true or false. The default value is set to true.
  ```

- **outputs.tf** - contains the output variables to expose information.

- **provider.tf** - contains the provider configuration and version.

### Deploy Terraform

After updating the **terraform.tfvars** file and carefully reviewing the other files, initialize the Terraform provider.

```bash
terraform init
```

The `init` command downloads the plugins and providers from the **provider.tf** file. Next, use the `plan` command to
preview the resources that Terraform will create.

```bash
terraform plan
```

The output displays the resources that Terraform will create in an actual implementation.

```bash hideClipboard
# Output condensed for readability
Plan: 2 to add, 0 to change, 0 to destroy.
```

Complete the creation of all the resources.

```bash
terraform apply -auto-approve
```

It can take up to 20 minutes to provision the cluster. Once the cluster provisioning is complete, the following message
displays.

```bash hideClipboard
# Output condensed for readability
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

You can monitor the progress of the cluster deployment in the Palette interface.

#### Check the In-Progress Deployment

Log in to [Palette](https://console.spectrocloud.com/) and navigate to the **Clusters** section in the left **Main
Menu**. Locate the **pack-tutorial-cluster** and check its status, which should appear as **Provisioning** according to
the provided screenshot.

![Screenshot of the successful Profile in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_verify-cluster.webp)

</TabItem>

</Tabs>

## Validate

In Palette, navigate to the left **Main Menu** and select **Clusters**. Next, select your cluster to display the
cluster's **Overview** page and monitor the provisioning progress.

![Screenshot of the cluster health.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-health.webp)

Once the cluster status displays **Running** and **Healthy**, you can access the application through the exposed service
URL along with the displayed port number. For the Hello Universe application, port 8080 is exposed. Click on the
**Services** URL to access the application.

:::warning

We recommend waiting for one to three minutes before clicking on the service URL. This allows DNS to properly resolve
the public load balancer URL, preventing the browser from caching an unresolved DNS request.

:::

![Screenshot of the successful accessing the application using the load balancer URL.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_success.webp)

You can also look at real-time metrics, such as CPU and memory consumption, in the cluster's **Overview** tab in
Palette.

![Screenshot of the cluster metrics.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-metrics.webp)

By using your custom pack, you have successfully deployed the **Hello Universe** application to the cluster.

## Cleanup

The following steps will guide you in cleaning up your environment. Follow the Palette-specific steps if you used
Palette to deploy the cluster. Alternatively, use Terraform commands to delete the cluster if you used Terraform for
deployment.

<Tabs groupId="deploy-cluster">

<TabItem label="Palette UI" value="palette_ui_delete">

#### Delete the Cluster and Cluster Profile

Navigate to the **Cluster** section in Palette's left **Main Menu** and access the details page for the
**pack-tutorial-cluster**. To delete the cluster, click on the **Settings** button to expand the **drop-down Menu**, and
select the **Delete Cluster** option. Palette will prompt you to enter the cluster name and confirm the deletion.

![Screenshot of deleting the cluster in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_delete-cluster.webp)

The cluster status will display **Deleting**, and the deletion may take up to 10 minutes.

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for force deletion. Navigate to the
cluster's details page and click on **Settings**. Select **Force Delete Cluster**. Palette automatically removes
clusters that are stuck in the deletion phase for over 24 hours.

:::

After deleting the cluster, proceed to delete the cluster profile. In the left **Main Menu**, click on **Profiles** and
select the profile you want to delete. Next, click on the **Delete** option in the **three-dot Menu**.

![Screenshot of deleting the profile in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_delete-profile.webp)

Wait for the resources to complete cleanup and ensure they are successfully deleted.

</TabItem>

<TabItem label="Terraform" value="terraform_ui_delete">

#### Delete the Cluster and Cluster Profile

If you deployed the cluster using Terraform, switch back to the tutorial container and issue the following command
within the **/terraform/pack-tf** directory.

```bash
terraform destroy -auto-approve
```

Wait for the resources to complete cleanup. Deleting the Terraform resources may take up to 10 minutes.

```bash hideClipboard
# Output condensed for readability
Destroy complete! Resources: 2 destroyed.
```

</TabItem>

</Tabs>

#### Delete the Registry Server

After deleting the cluster and cluster profile, navigate to the **Tenant Settings** > **Registries** > **Pack
Registries** section in Palette to remove the registry configuration.

![Screenshot of registry server delete in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-delete.webp)

Now, delete the registry server. If you used the Spectro registry, stop the registry server by closing the tutorial
container bash session that serves the Ngrok reverse proxy server. If you used the ECR registry, you must first remove
the pack from the repository before deleting it.

Execute the following command to delete the pack from your ECR repository.

```bash
aws ecr batch-delete-image --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --image-ids imageDigest=$(aws ecr describe-images --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION --query 'imageDetails[0].imageDigest' --output text)
```

The snippet below displays the output of the `aws ecr batch-delete-image` command, confirming the deletion of the Hello
Universe pack.

```plainText {4-5} hideClipboard
{
    "imageIds": [
        {
            "imageDigest": "sha256:<YourImageSha>",
            "imageTag": "1.0.0"
        }
    ],
    "failures": []
}
```

Next, proceed to delete the repositories.

```bash
aws ecr delete-repository --repository-name $REGISTRY_NAME/spectro-packs/archive
aws ecr delete-repository --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME
```

The output should provide information regarding the deleted repositories.

```plainText {5,14} hideClipboard
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:<YourAccountId>:repository/spectro-oci-registry/spectro-packs/archive",
        "registryId": "<YourRegistryId>",
        "repositoryName": "spectro-oci-registry/spectro-packs/archive",
        "repositoryUri": "<YourAccountId>.dkr.ecr.us-east-1.amazonaws.com/spectro-oci-registry/spectro-packs/archive",
        "createdAt": "2023-11-28T16:23:20+00:00",
        "imageTagMutability": "MUTABLE"
    }

    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:<YourAccountId>:repository/spectro-oci-registry/spectro-packs/archive/hellouniverse",
        "registryId": "<YourRegistryId>",
        "repositoryName": "spectro-oci-registry/spectro-packs/archive/hellouniverse",
        "repositoryUri": "<YourAccountId>.dkr.ecr.us-east-1.amazonaws.com/spectro-oci-registry/spectro-packs/archive/hellouniverse",
        "createdAt": "2023-11-28T16:23:29+00:00",
        "imageTagMutability": "MUTABLE"
    }
}
```

Last, if you used a Basic registry, such as Harbor, make sure to delete your Harbor registry server.

At this point, you can close all the bash sessions. To remove the container and the image from your local machine, issue
the following commands.

<Tabs>

<TabItem label="Docker" value="Docker">

<PartialsComponent category="tutorials" name="stop-tutorials-container-docker" />

</TabItem>

<TabItem label="Podman" value="Podman">

<PartialsComponent category="tutorials" name="stop-tutorials-container-podman" />

</TabItem>

</Tabs>

## Wrap-Up

In this tutorial, you learned how to create a custom pack using manifest files. You packaged up an application in a
custom pack that you pushed to a registry server and added to Palette.

Next, you created a cluster profile that included all the core infrastructure layers, such as the OS, Kubernetes
distribution, and more. Additionally, you added your custom pack to the cluster profile, enabling your application to be
deployed to a Kubernetes cluster.

Packs are the building blocks of cluster profiles, allowing you to customize your Kubernetes clusters. Palette enables
you to use different packs to create multiple cluster profiles, each for specific purposes. As a result, you can ensure
all Kubernetes deployments contain all the required dependencies and applications without developing complicated
deployment scripts. All you need to do is maintain the cluster profiles.

To learn more about packs in Palette, we encourage you to check out the reference resources below.

- <VersionedLink text="Custom OS Pack" url="/integrations/packs/?pack=generic-byoi" />

- [Add-on Packs](../../registries-and-packs/adding-add-on-packs.md)

- [Pack Constraints](../../registries-and-packs/pack-constraints.md)

- [OCI Registry](../../registries-and-packs/registries/oci-registry/oci-registry.md)
