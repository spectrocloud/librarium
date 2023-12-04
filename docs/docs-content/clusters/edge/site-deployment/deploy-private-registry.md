---
sidebar_label: "Deploy Cluster with a Private Registry"
title: "Deploy Cluster with a Private Registry"
description: "Instructions for creating an Edge Native Cluster Profile"
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

Palette Edge supports authentication with private image registries, which allows your cluster to pull images from a private registry during deployment. You can configure your cluster to pull images from a private registry for both cluster creation and cluster repave. To configure a cluster to pull images from a private image registry, provide the registry URL and the credentials needed to authenticate with the registry in the cluster profile. 

:::caution
If you have specified registry credentials in the `registryCredentials` field in the user data file during the EdgeForge process, the credentials provided in the cluster profile will be ignored.  For more information, refer to [EdgeForge - Build Artifacts](../edgeforge-workflow/palette-canvos.md).
:::

## Limitations

- A cluster cannot pull images from more than one private registry.

- If your private registry has TLS enabled, you can only configure a new cluster to use a TLS certificate with a private registry. You cannot configure an existing cluster with a TLS certificate to communicate with your private registry. 

- Palette Edge supports basic username/password authentication. Token authentication schemes used by services such as AWS ECR and Google Artifact Registry are not supported. 

## Prerequisites

- At least one Edge host with an x86_64 or AMD64 processor architecture. 

- A private image registry.

- A provider image you created in the EdgeForge process stored in your private image registry. For more information, refer to [Build Artifacts](../edgeforge-workflow/palette-canvos.md).

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. If you already have a cluster profile you want to deploy the cluster with, select that profile and select **Create new version** to create a new version of the profile to save your changes.

   Otherwise, click **Add new profile** to create a new cluster profile. 

4. Select the OS layer of your cluster profile. If you are creating a new profile, you will get to configuring the OS layer after filling out **Basic Information** and **Cloud Type**. 

5. Update the `system.uri` parameter in the pack editor for your OS layer. Use the custom OS image you created in the EdgeForge process. Refer to the EdgeForge [Build Images](../edgeforge-workflow/palette-canvos.md) guide if you are missing a custom OS image. The following is an example configuration using a custom OS image.

  ```yaml
  pack:
  content:
    images: 
      - image: '{{.spectro.pack.edge-native-byoi.options.system.uri}}'
      # - image: example.io/my-other-images/example:v1.0.0 
      # - image: example.io/my-super-other-images/example:v1.0.0
      
  options: 
    system.uri: example.io/my-images/example-custom-os:v1.4.5
  ```

6. At the root level of YAML for your OS layer, add the `providerCredentials` field to provide the credentials you need to authenticate with your registry. The `providerCredentials.password` field will be masked when you provide it in the YAML file:

  ```yaml {7-16}
  pack:
  content:
    images: 
      - image: '{{.spectro.pack.edge-native-byoi.options.system.uri}}'
      # - image: example.io/my-other-images/example:v1.0.0 
      # - image: example.io/my-super-other-images/example:v1.0.0
  providerCredentials:
    registry: domain/project
    user: user
    password: ******
    certificates: |
      -----BEGIN CERTIFICATE-----
      MIIDVzCCAj+gAwIBAgIRANtGPo/hFkZtYRNw0KaeW54wDQYJKoZIhvcNAQELBQAw
      ----------------------------------------------------------------
      7OicCaV35lje5FSl0owu74ghAlCgMyAdKsJf615g1kKO4V5E2BMErd9Ibw==
      -----END CERTIFICATE-----
      
  options: 
    system.uri: example.io/my-images/example-custom-os:v1.4.5
  ```

7. If you are updating an existing profile, click **Confirm changes**, and then click **Save changes** to publish the new version of your cluster profile. If you are creating a new profile, click **Next layer** and finish configuring the remaining layers. 

8. If you already have an active cluster that is using the original version of the cluster profile, update the cluster so that it uses the new version of the cluster profile you just published. For more information about updating clusters, refer to [Update a Cluster](../../cluster-management/cluster-updates.md). This will trigger a full cluster repave since it includes an update to the OS layer of the cluster. To learn more about cluster repave behavior, refer to [Repave Behavior and Configuration](../../cluster-management/node-pool.md#repave-behavior-and-configuration).

   If you don't have an active cluster yet, deploy a new cluster with the profile you just created, and the cluster will pull images from the private registry you specified. 

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that is using the profile with the registry credentials. 

4. Navigate to the **Profile** tab of the cluster to confirm that the cluster is pulling images the private registry. 