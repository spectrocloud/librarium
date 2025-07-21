---
sidebar_label: "Upload Cluster Images to Registry with Palette Edge CLI"
title: "Upload Cluster Images to Registry with Palette Edge CLI"
description: "Guide to uploading all images required by a cluster to an external registry."
hide_table_of_contents: false
sidebar_position: 70
tags: ["edge"]
---

Palette Edge allows you to deploy a cluster using an external private registry. When you deploy a cluster using an
external registry, all images required by the cluster are expected to be in the registry before deployment starts.

It can be error-prone to upload the images manually one by one. Therefore, we recommend you use the Palette Edge CLI to
download the images and upload them to the external registry.

## Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.

- Palette API key. Refer to the
  [User Authentication](../../../../user-management/authentication/api-key/create-api-key.md) resource to learn how to
  create a Palette API key.

- An Edge Native cluster profile. Refer to [Create Edge Native Cluster Profile](../model-profile.md) guide to learn how
  to create an Edge Native cluster profile. You may also have other add-on profiles that you wish to attach to your
  cluster.

- Content tags in your profiles highlight the exact location of container images to be downloaded.

- Edge content bundles created with Edge CLI version greater than `4.5.5`, are incompatible with Palette agent versions
  before `4.5.4` due to a new format schema. If you are using an older version of the Palette agent, use the Edge CLI
  version `4.5.3` or earlier to create content bundles. To download the latest version of the Edge CLI, visit the
  [Downloads](../../../../downloads/cli-tools.md#palette-edge-cli) page.

## Upload Cluster Images to Registry

1. Download the Palette Edge CLI. Refer to the [Palette Components CLI Matrix](../../../../downloads/cli-tools.md) to
   find a compatible CLI version and replace `<palette-edge-cli-version>` with the selected version.

   ```shell
   VERSION=<palette-edge-cli-version>
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Log in to [Palette](https://console.spectrocloud.com).

3. Select the project you want to deploy the Edge host to and copy down the **Project ID**. You can find the project id
   at the top right side corner of the landing page below the **User drop-down Menu**.

4. Navigate to the left **Main Menu** and select **Profiles**.

5. Click on the cluster profile you want to include in the content bundle.

6. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
   value in the URL. Repeat this step for all the cluster profiles whose images you want to include in the content
   bundle.

7. If you are downloading images from public image or Helm registries only, skip this step.

   Prepare a JSON file that includes the credentials to your image or Helm registries.

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

8. Issue the following command to download the images as a content bundle. The command produces a ZST file as output.
   Replace the `******` after the `--api-key` flag with your Palette API key. Replace `project-ID` with the ID of your
   project in Palette, `palette-api-endpoint` with your Palette API endpoint, and `profile-ID` with the ID of your
   profile.

   ```shell
    ./palette-edge build --api-key ****** \
    --project-id project-ID \
    --cluster-profile-ids profile-ID \
    --palette-endpoint palette-API-endpoint \
    --outfile output-file-name \
    --cred-file-path registry-creds.json \
    --include-palette-content
   ```

9. Issue the following command to upload the images to the external registry. Replace `path-to-content-bundle` with the
   path to the content bundle you downloaded in the previous step. Replace `registry-URL` with the URL of your external
   registry. Replace `username` and `******` with the username and password used to access the external registry.

   ```shell
   ./palette-edge deploy --export path-to-content-bundle --url registry-URL \
    --username username --password ******
   ```

## Validate

Go to your external registry and verify that all the images referenced in the cluster profile are uploaded to the
external registry.
