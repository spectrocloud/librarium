---
sidebar_label: "Add a Container"
title: "Add a Container"
description: "Learn how to create an app profile that deploys a container in your Palette Virtual Clusters."
hide_table_of_contents: false
sidebar_position: 10
tags: ["devx", "app mode", "pde", "app profiles"]
---

Palette App Mode supports the use of containers, a standard unit of software that packages code and all its dependencies
to run applications quickly and reliably from one computing environment to another. Containers contain all the required
executables, binary codes, libraries, and configuration files. As a result, containers are lightweight and portable with
less overhead. To add a container layer to a Palette Dev Engine app profile, follow the steps below.

## Prerequisite

- Access to Palette Dev Engine App Mode.

## Add Container to an App Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** in the left **Main Menu** and click on the **New App Profile** button.

4. Provide the following basic information for your app profile and click **Next**.

   | **Parameter**        | **Description**                                                                                                                                                                                           |
   | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **App Profile Name** | A custom name for the app profile.                                                                                                                                                                        |
   | **Version**          | You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`.                                                                            |
   | **Description**      | Use the description to provide context about the profile.                                                                                                                                                 |
   | **Tag**              | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when apps are created from this app profile. Example: `owner` or `region`. |

   To learn how to create multiple profile versions that use the same name, check out
   [Version an App Profile](../modify-app-profiles/version-app-profile.md).

5. Select **Container Deployment** to start configuring your app profile.

6. Provide the following configuration information for the container.

   **General Settings**

   | **Parameter**      | **Description**                                                                                                                                                                                                                                                  |
   | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Container Name** | A custom name for the container.                                                                                                                                                                                                                                 |
   | **Registry**       | The registry from which the image will be downloaded. If specifying a non-Docker Hub registry, ensure you provide the full URL of the image.                                                                                                                     |
   | **Image**          | The container image container to deploy.                                                                                                                                                                                                                         |
   | **Replicas**       | The number of application instances to deploy. This option follows the same behavior as a [_ReplicaSet_](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) in the Kubernetes configuration file. Palette supports a maximum of 10 replicas. |

   :::info

   When adding a container image from a public [DockerHub registry](https://hub.docker.com/), you can skip the registry
   hostname. For instance, to download the Nginx image, specify `nginx` and it will be downloaded correctly during the
   provisioning process.

   :::

   **Network Access**

   | **Parameter** | **Description**                                                             |
   | ------------- | --------------------------------------------------------------------------- |
   | **Private**   | Establishes connectivity to a container service through a private network.  |
   | **Public**    | Establishes connectivity to a container service through the public network. |
   | **Ports**     | Exposes the container for external communication.                           |

   **Environment Variables**

   | **Parameter**             | **Description**   |
   | ------------------------- | ----------------- |
   | **Environment Variables** | A key-value pair. |

   **Volume**

   | **Parameter**  | **Description**                                   |
   | -------------- | ------------------------------------------------- |
   | **Volume**     | To persist data the container generates and uses. |
   | **Name**       | A custom name for the volume.                     |
   | **Size**       | Volume size in GiB.                               |
   | **Mount Path** | A path to access the volume.                      |

7. The command and arguments you provide for **Runtime Settings** will override the default command and arguments that
   the container image provides.

8. When you have provided the required configuration information for the container, click **Review**. Your app profile
   is now created and can be deployed.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, switch to **App Mode**.

3. Click on **App Profiles** in the left **Main Menu**, and select the app profile you created to review its details.

4. Hover your cursor over each profile layer to learn more about them, including the service name, version, and
   registry.

   ![A view of a cursor triggering the info box for each app profile layer.](/profiles_app-profiles_create-app-profiles_container-infobox.webp)

   :::info

   Use the tool-tip that displays when you select a layer to gather information required for creating Terraform
   templates for app profiles. Check out our Terraform registry for
   [Application Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/application_profile).

   :::
