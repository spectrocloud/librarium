---
sidebar_label: "Build Content Bundle"
title: "Build Content Bundle"
description: "Learn about building your edge content bundles in order to optimize cluster deployments"
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

Content bundles are archives of all the required container images required for one or more cluster profiles. The content
bundle includes Helm charts, Packs, and manifest files needed to deploy your Edge host cluster. In addition to core
container images, the content bundle can include artifacts from your applications that you wish to deploy to the Edge
cluster. [Cluster Profiles](../../../../profiles/cluster-profiles/cluster-profiles.md) are the primary source for
building these content bundles.

:::warning

Currently, the content bundles include Helm charts and Packs. However, keep in mind that the container images of the
Helm Charts and Packs are extracted and predeployed into the container runtime [containerd](https://containerd.io/) for
optimization. In the future, Palette will include a built-in OCI registry to host Helm Charts and other artifacts to
avoid downloading these from the internet if included in a content bundle

:::

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

- You cannot use content bundles with an external registry if you do not enable the local Harbor registry on your Edge
  host. If you specify a external registry without enabling the local Harbor registry, the images will be downloaded
  from the external registry even if you provide a content bundle, and deployment will fail if the necessary images
  cannot be located in the external registry. For more information, refer to
  [Deploy Cluster with External Registry](../../site-deployment/deploy-custom-registries/deploy-external-registry.md)
  and [Enable Local Harbor Registry](../../site-deployment/deploy-custom-registries/local-registry.md).

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

1. Download Palette Edge Content CLI and assign the executable bit to the CLI.

   ```shell
   VERSION=4.1.2
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Log in to [Palette](https://console.spectrocloud.com).

3. Select the project you want to deploy the Edge host to and copy down the **Project ID**. You can find the project id
   at the top right side corner of the landing page below the **User drop-down Menu**.

4. Navigate to the left **Main Menu** and select **Profiles**.

5. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

6. Click on the cluster profile you want to include in the content bundle.

7. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
   value in the URL. Repeat this step for all the cluster profiles you want to specify in the content bundle.

   ```text
   https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
   ```

8. (Optional) If your cluster profile uses images or helm charts that are hosted on private registries that require
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

9. Navigate back to your terminal window and issue the following command to create the content bundle. Replace the
   placeholder values with your actual values.

   :::info

   There are several Spectro Cloud CLI flags that you can use to customize the content bundle. Use the command
   `./palette-edge build --help` to learn more about the available flags.

   :::

   ```shell
   ./palette-edge build --api-key <API_KEY> \
    --project-id <PROJECT_ID> \
    --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
    --palette-endpoint <Palette API Endpoint> \
    --outfile <bundle-name> \
    --cred-file-path <file-path> \
    --include-palette-content \
   ```

   | Flag                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `--api-key`                 | Your Palette API key.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | `--cluster-profile-ids`     | Comma-separated list of cluster profile IDs to download content for. Ensure that between all the profiles you include in the content bundle, only one infrastructure layer exists. For example, you can have one infrastructure profile and many add-on files, or one full profile and many add-on files, but you cannot have multiple infrastructure and full-on profiles. For more information about the types of profiles, refer to [Cluster Profile](../../../../profiles/profiles.md) |
   | `--cred-file-path`          | Path to the JSON file storing registry credentials if you are using a private registry.                                                                                                                                                                                                                                                                                                                                                                                                    |
   | `--include-palette-content` | Whether to include content necessary for Palette itself. Required for airgap installations.                                                                                                                                                                                                                                                                                                                                                                                                |
   | `--outfile`                 | Name of your content bundle. The final file name should have the following pattern: `core-<bundle-name>-random-string`.                                                                                                                                                                                                                                                                                                                                                                    |
   | `--palette-endpoint`        | API endpoint for your Palette instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | `--project-id`              | The ID of your Palette project.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

   The result is a content bundle that you can use to preload into your installer. For more information, refer to
   [Build Edge Artifacts with Content Bundle](./build-artifacts.md) or [Build Installer ISO](./build-installer-iso.md).
   Our Tech Preview feature [local UI](../../local-ui/local-ui.md) also allows you to upload content bundles to a
   disconnected Edge deployment.

   Alternatively, you can use the ISO version of the content bundle and transfer it to a USB drive to be used separately
   at the time of Edge host installation using the `-iso` flag in your build command. Doing so will override the file
   extension you provide using the `--outfile` flag.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.

## Next Steps

Your next step is to build the Edge artifacts so that you can deploy an Edge host. To create an Edge artifacts, check
out the [Build Images](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide.
