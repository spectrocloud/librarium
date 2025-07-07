---
sidebar_label: "Build Content Bundle"
title: "Build Content Bundle"
description: "Learn about building your edge content bundles in order to optimize cluster deployments"
hide_table_of_contents: false
sidebar_position: 45
tags: ["edge"]
---

Content bundles are archives of all the required container images required for one or more cluster profiles. The content
bundle includes Helm charts, Packs, and manifest files needed to deploy your Edge host cluster. In addition to core
container images, the content bundle can include artifacts from your applications that you wish to deploy to the Edge
cluster. [Cluster Profiles](../../../../profiles/cluster-profiles/cluster-profiles.md) are the primary source for
creating these content bundles, which can be built using either the Palette CLI or the Palette Edge CLI.

:::warning

Currently, the content bundles include Helm charts and Packs. However, keep in mind that the container images of the
Helm Charts and Packs are extracted and pre-deployed into the container runtime [containerd](https://containerd.io/) for
optimization.

:::

The diagram below displays the overarching steps to build the Edge installer ISO using a content bundle. The diagram
also highlights the primary prerequisites to create a content bundle.

![An overarching diagram displaying the workflow in the current guide.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_overarching.webp)

## Benefits of Content Bundle

Creating a content bundle provides several benefits that may address common use cases related to deploying Edge hosts.

- Preloading required software dependencies removes the need to download assets during cluster deployment.

- If connectivity to a container registry is unstable or bandwidth limited, preloading the software dependencies can
  address these concerns.

- Preloading required software dependencies optimizes the Edge host deployment process when the Edge host is in an
  internet bandwidth-constrained environment.

- Organizations that want better control over the software used by their Edge hosts can use content bundles to ensure
  that only approved software is consumed.

## Limitation

:::warning

If your cluster uses the legacy **Harbor Edge-Native Config** pack, you cannot use the Palette CLI to build content
bundles or export cluster definitions. You must use the Palette Edge CLI.

Refer to
[Migrate From Harbor Edge-Native Config Pack](../../site-deployment/deploy-custom-registries/migrate-edge-native-config.md)
to learn how to migrate from the legacy pack to the **Registry Connect** pack.

:::

<!-- prettier-ignore-start -->
- You can configure built-in registry packs or your own custom OCI registry. Both configurations require the **Registry
  Connect** pack. The **Registry Connect** pack does not
require a local Harbor registry. Built-in registries must be configured using either the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack or the <VersionedLink text="Zot" url="/integrations/packs/?pack=zot" /> pack. Custom registries allow you to configure [custom packs](../../../../registries-and-packs/add-custom-packs.md). For more information, refer to [Deploy Cluster with External Registry](../../site-deployment/deploy-custom-registries/deploy-external-registry.md)
  and [Deploy with Primary Registry](../../site-deployment/deploy-custom-registries/deploy-primary-registry.md).

<!-- prettier-ignore-end -->

- Edge content bundles created with Edge CLI version greater than `4.5.5`, are incompatible with Palette agent versions
  before `4.5.4` due to a new format schema. If you are using an older version of the Palette agent, use the Edge CLI
  version `4.5.3` or earlier to create content bundles. To download the latest version of the Edge CLI, visit the
  [Downloads](../../../../downloads/cli-tools.md#palette-edge-cli) page.

- Content bundles built with the Palette Edge CLI versions earlier than `4.5.20` cannot be used to provision multi-node
  clusters. Download the latest version of the Palette Edge CLI from the
  [Downloads](../../../../downloads/cli-tools.md#palette-edge-cli) page to build the content bundle instead.

## Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.

- Palette API key. Refer to the
  [User Authentication](../../../../user-management/authentication/api-key/create-api-key.md) resource to learn how to
  create a Palette API key.

- An Edge Native cluster profile. Refer to [Create Edge Native Cluster Profile](../../site-deployment/model-profile.md)
  guide to learn how to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to
  attach to your cluster.

- Content tags in your profiles highlight the exact location of container images to be downloaded.

## Create Content Bundle

<Tabs>

<TabItem value="Palette CLI" label="Palette CLI">

1. Download the Palette CLI. Refer to the [Palette CLI Compatibility Matrix](../../../../downloads/cli-tools.md) to find
   a compatible CLI version and replace `<palette-cli-version>` with the selected version.

   ```shell
   VERSION=<palette-cli-version>
   wget https://software.spectrocloud.com/palette-cli/v$VERSION/linux/cli/palette
   chmod +x palette
   ```

2. Use the following command to move the `palette` binary to the **/usr/local/bin** directory to make the binary
   available in your system $PATH. This will allow you to issue the `palette` command from any directory in your
   development environment.

   ```bash
   mv palette /usr/local/bin
   ```

3. Verify that the Palette CLI is part of your system path by issuing the Palette CLI `version` command.

   ```bash
   palette version
   ```

   ```hideClipboard text
   Palette CLI version: [version number]
   ```

4. Authenticate with Palette using the `login` command. Replace `<your-api-key>` with your Palette API key.

   ```shell
   palette login --api-key <your-api-key> --console-url https://console.spectrocloud.com/
   ```

5. Log in to the [Palette](https://console.spectrocloud.com) console.

6. Select the project you want to deploy the Edge host to and copy the project ID. You can find the project ID at the
   top right side corner of the landing page below the user drop-down menu.

7. Navigate to the left main menu and select **Profiles**.

8. Use the **Cloud Types** drop-down menu and select **Edge Native**.

9. Click on the cluster profile you want to include in the content bundle.

10. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
    value in the URL. Repeat this step for all the cluster profiles whose images you want to include in the content
    bundle.

11. (Optional) If your cluster profile uses images or Helm charts that are hosted on private registries that require
    authentication, you must use the `content registry-login` command to authenticate with each one of the registries.
    Replace `<registry-address>`, `<registry-username>`, and `<registry-password>` with your registry credentials. Refer
    to the [content registry-login](../../../../automation/palette-cli/commands/content.md#registry-login) CLI command
    page for more information.

    ```shell
    palette content registry-login --registry <registry-address> \
    --username <registry-username> \
    --password <registry-password>
    ```

12. Issue the following command to create the content bundle. Replace the placeholder values with your actual values.

    ```shell
    palette content build --arch <bundle-architecture> \
     --project-id <project-id> \
     --profiles <cluster-profile-id1,cluster-profile-id2...> \
     --name <bundle-name>
    ```
    :::warning

    If your registry enforces image signature verification, we recommend omitting the `--arch` option.  
    This is because image signatures are tied to the image's digest, and that digest depends on the manifest type.

    When you sign a multi-architecture image, the signature is generated on its index manifest.  
    If you later specify `--arch`, the CLI resolves each image to a single-architecture manifest, which produces a
    different digest.

    As a result, Cosign will fail to verify the signature if it was originally created for the multi-arch image.
    However, if you omit `--arch`, the Palette CLI will pull the image as-is, preserving their existing signature.

    :::


    The result is a `.tar.zst` content bundle that you can use to preload into your installer. The bundle is generated
    in the `<current-directory>/output/content-bundle/` folder by default. For more information about how to use content
    bundles, refer to [Build Installer ISO](./build-installer-iso.md) or

    [Upload Content Bundle through Local UI](../../local-ui/cluster-management/upload-content-bundle.md).

    :::tip

    You can use the `--existing-bundles` flag with the `build` command to include existing `.tar.zst` bundle archives as
    part of the content bundle build. This avoids the need to redownload images, charts, and raw files that are already
    present in local bundles. Refer to the [content build](../../../../automation/palette-cli/commands/content.md#build)
    CLI command page for a complete list of available flags and examples.

    :::

13. (Optional) You can download the cluster definition and the content bundle in a single step. A cluster definition
    contains one or more cluster profiles, including the profile variables used in the profiles. In local Edge
    deployments, cluster definitions are required to provision a cluster from Local UI. For more information, refer to
    [Create a Cluster with Local UI](../../local-ui/cluster-management/create-cluster.md).

    To download the cluster definition together with the content bundle, provide the following flags to the build
    command.

    ```shell
    palette content build --arch <bundle-architecture> \
     --project-id <project-id> \
     --profiles <cluster-profile-id1,cluster-profile-id2...> \
     --cluster-definition-name <cluster-definition-name> \
     --cluster-definition-profile-ids <cluster-definition-profile-ids> \
     --name <bundle-name>
    ```

    Compared with the previous command, this command has two additional flags.

    | Flag                               | Description                                                           |
    | ---------------------------------- | --------------------------------------------------------------------- |
    | `--cluster-definition-name`        | Filename of the cluster definition tgz file.                          |
    | `--cluster-definition-profile-ids` | List of cluster profile IDs to be included in the cluster definition. |

    This command will generate a `.tgz` cluster definition file in the `<current-directory>/output/` folder, and a
    content bundle in the `<current-directory>/output/content-bundle/` folder by default. When you create a cluster
    definition and content bundle using a single `build` command, the cluster definition is also embedded into the
    content bundle.

</TabItem>

<TabItem value="Palette Edge CLI" label="Palette Edge CLI">

1. Download the Palette Edge CLI. Refer to the [Palette CLI Compatibility Matrix](../../../../downloads/cli-tools.md) to
   find a compatible CLI version and replace `<palette-edge-cli-version>` with the selected version.

   ```shell
   VERSION=<palette-edge-cli-version>
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Use the following command to move the palette-edge binary to the **/usr/local/bin** directory to make the binary
   available in your system $PATH. This will allow you to issue the `palette-edge` command from any directory in your
   development environment.

   ```bash
   mv palette-edge /usr/local/bin
   ```

3. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display a list of
   available commands and flags for the CLI.

   ```bash
   palette-edge --help
   ```

   ```hideClipboard bash
    Usage:
      palette-edge-cli [command]

    Available Commands:
      build            Build the content
      build-from-local
      deploy
      help             Help about any command
      show             Display all the preset default values and supported OS and K8S flavors
      upload

    Flags:
          --config string    config file (default is $HOME/.palette-edge-cli.yaml)
          --debug            set to enable debug logging [default: false]
      -h, --help             help for palette-edge-cli
          --logfile string   log file name
          --trace            set to enable trace logging [default: false]

    Use "palette-edge-cli [command] --help" for more information about a command.
   ```

4. Log in to [Palette](https://console.spectrocloud.com).

5. Select the project you want to deploy the Edge host to and copy down the project ID. You can find the project ID at
   the top right side corner of the landing page below the user drop-down menu.

6. Navigate to the left main menu and select **Profiles**.

7. Use the **Cloud Types** drop-down menu and select **Edge Native**.

8. Click on the cluster profile you want to include in the content bundle.

9. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
   value in the URL. Refer to the [Project](../../../../tenant-settings/projects/projects.md#project-id) page for
   details. Repeat this step for all the cluster profiles you want to specify in the content bundle.

   ```text
   https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
   ```

10. (Optional) If your cluster profile uses images or helm charts that are hosted on private registries that require
    authentication, you must provide a JSON file that contains the necessary credentials to access the registry.

    <Tabs>

    <TabItem value="helm" label="Helm">

    For authenticated access to Helm charts, your must provide credentials with the following schema. Use a key at the
    root level of the JSON object named "helm" and set its value to a list. The list is a list of credentials for each
    Helm chart repository. For each set of credentials, use an object in the list with the keys "endpoint", "username",
    and "password".

    ```json
    {
      "helm": [
          {
            "endpoint": <Registry URL>,
            "username": <Registry username>,
            "password": <Password>
          }
      ]
    }
    ```

    For example, the following JSON code is a valid set of credentials.

    ```json
    {
      "helm": [
        {
          "endpoint": "harbor.abcd.com",
          "username": "admin",
          "password": "xxxxxxxx"
        }
      ]
    }
    ```

    </TabItem>

    <TabItem value="image" label="Image">

    For image registries, you must provide credentials with the following schema. Provide a key at the root level of the
    JSON object named "image" and set its value to a list. The list is a list of credentials for each Helm chart
    repository. For each set of credentials, use an object in the list with the keys "endpoint", "username", and
    "password".

    ```json
    {
      "image": [
          {
            "endpoint": <Registry URL>,
            "username": <Registry username>,
            "password": <Password>
          }
      ]
    }
    ```

    For example, the following JSON code provides access to two registries `ttl.sh` and `docker.io` with two
    username-password pairs.

    ```json
    {
      "image": [
        {
          "endpoint": "ttl.sh",
          "username": "admin",
          "password": "*********"
        },
        {
          "endpoint": "docker.io",
          "username": "username",
          "password": "*********"
        }
      ]
    }
    ```

    For Google Container Registry (GCR) access, you need to set the username field to `"_json_key"` and set the password
    to an JSON object containing the following fields.

    | Field                         | Description                                                                                         |
    | ----------------------------- | --------------------------------------------------------------------------------------------------- |
    | `type`                        | The type of credential, which is `service_account` for Google Cloud service accounts.               |
    | `project_id`                  | The project ID associated with your Google Cloud project. For example, `spectro-images`.            |
    | `private_key_id`              | A unique identifier for the private key associated with the service account.                        |
    | `private_key`                 | The private key that is used to authenticate to Google Cloud services, encapsulated in a PEM block. |
    | `client_email`                | The email address associated with the service account, used for authentication.                     |
    | `client_id`                   | The client ID associated with the service account.                                                  |
    | `auth_uri`                    | The URI for the authentication provider, typically Google's OAuth 2.0 server.                       |
    | `token_uri`                   | The URI for obtaining tokens from Google's OAuth 2.0 server.                                        |
    | `auth_provider_x509_cert_url` | The URL of the public x509 certificate for the authentication provider.                             |
    | `client_x509_cert_url`        | The URL of the public x509 certificate for the client (service account).                            |

    For example, the following is a valid set of credentials for a GCR registry.

    ```json
    {
      "image": [
        {
          "endpoint": "gcr.io",
          "username": "_json_key",
          "password": {
            "type": "service_account",
            "project_id": "spectro-images",
            "private_key_id": "847c09190xxxxxxxxxxxxc4ebc",
            "private_key": "-----BEGIN KEY-----MIIEvQIBADA ... -----Shortened for brevity",
            "client_email": "xxx.iam.gserviceaccount.com",
            "client_id": "115830xxxxxxx340453",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/spectro-images-viewer%40spectro-images.iam.gserviceaccount.com"
          }
        }
      ]
    }
    ```

    </TabItem>

    </Tabs>

    After creating the file, use the `-cred-file-path filepath` flag to include the credentials in the command.

11. Navigate back to your terminal window and issue the following command to create the content bundle. Replace the
    placeholder values with your actual values.

    ```shell
    ./palette-edge build --api-key <API_KEY> \
     --project-id <PROJECT_ID> \
     --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
     --palette-endpoint <PALETTE_API_ENDPOINT> \
     --outfile <BUNDLE_NAME> \
     --cred-file-path <FILE_PATH> \
     --private-key <PRIVATE_KEY_PATH>
    ```

    | Flag                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `--api-key`                  | Your Palette API key.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | `--cluster-profile-ids`      | Comma-separated list of cluster profile IDs to download content for. Ensure that between all the profiles you include in the content bundle, only one infrastructure layer exists. For example, you can have one infrastructure profile and many add-on files, or one full profile and many add-on files, but you cannot have multiple infrastructure and full-on profiles. For more information about the types of profiles, refer to [Cluster Profile](../../../../profiles/profiles.md). |
    | `--cred-file-path`           | Path to the JSON file storing registry credentials if you are using a private registry.                                                                                                                                                                                                                                                                                                                                                                                                     |
    | `--include-core-images-only` | Whether to include images for the Palette agent that are necessary for cluster creation only. By default, content bundles include images to support both cluster creation and cluster management. In the case of installations of locally managed Edge hosts, we recommend using this option to reduce the size of the content bundle, as Local UI currently does not offer native backup and support features.                                                                             |
    | `--outfile`                  | Name of your content bundle. The final file name should have the following pattern: `core-<bundle-name>-random-string`.                                                                                                                                                                                                                                                                                                                                                                     |
    | `--palette-endpoint`         | API endpoint for your Palette instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | `--project-id`               | The ID of your Palette project.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | `--private-key`              | The path to the private key used to sign the content bundle and cluster definition if it is present. This is necessary if your Edge host has an embedded corresponding public key. For more information, refer to [Embed Public Key in Edge Artifacts](./signed-content.md).                                                                                                                                                                                                                |

    The result is a content bundle that you can use to preload into your installer. The content bundle will be a `.zst`
    file in a folder that starts with **content-** followed by a random string. For more information about how to use a
    content bundles, [Build Installer ISO](./build-installer-iso.md) or
    [Upload Content Bundle through Local UI](../../local-ui/cluster-management/upload-content-bundle.md).

    Alternatively, you can use the ISO version of the content bundle and transfer it to a USB drive to be used
    separately at the time of Edge host installation using the `-iso` flag in your build command. Doing so will override
    the file extension you provide using the `--outfile` flag.

12. (Optional) You can download the cluster definition and the content bundle in a single step. A cluster definition
    contains one or more cluster profiles, including the profile variables used in the profiles. In air-gapped Edge
    deployments, cluster definitions are required to provision a cluster from Local UI. For more information, refer to
    [Create a Cluster with Local UI](../../local-ui/cluster-management/create-cluster.md).

    To download the cluster definition together with content bundle, provide the following flags to the build command.

    ```
     ./palette-edge build --api-key <API_KEY> \
     --project-id <PROJECT_ID> \
     --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
     --palette-endpoint <PALETTE_API_ENDPOINT> \
     --outfile <BUNDLE_NAME> \
     --cred-file-path <FILE_PATH> \
     --cluster-definition-name <CLUSTER_DEFINITION_FILENAME> \
     --cluster-definition-profile-ids <CLUSTER_PROFILE_IDS>
    ```

    Compared with the previous command, this command has two additional flags.

    | Flag                               | Description                                                           |
    | ---------------------------------- | --------------------------------------------------------------------- |
    | `--cluster-definition-name`        | Filename of the cluster definition tgz file.                          |
    | `--cluster-definition-profile-ids` | List of cluster profile IDs to be included in the cluster definition. |

    This command will produce another document named **CLUSTER_DEFINITION_FILENAME.tgz** at the root directory of
    CanvOS. This is the cluster definition file. Your content bundle will not be affected by the additional flags and
    will still be at the same location.

</TabItem>
</Tabs>

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.

## Next Steps

Your next step is to build the Edge artifacts so that you can deploy an Edge host. To create an Edge artifacts, check
out the [Build Images](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide.
