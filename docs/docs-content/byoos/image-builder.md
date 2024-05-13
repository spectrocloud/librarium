---
sidebar_label: "Create Images with Image Builder"
title: "Create Images with Image Builder"
description: "Learn how to use the Image Builder project to create images for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["operating system", "byoos", "profiles", "cluster profiles"]
---

You can create and deploy custom images to most infrastructure providers using various tools. Many infrastructure
providers have tools that you can use to create custom images for the platform, such as
[AWS EC2 Image Builder](https://aws.amazon.com/image-builder/) for AWS or
[Azure VM Image Builder](https://azure.microsoft.com/en-us/products/image-builder) for Azure. You can also use platform
agnostic tools, such as [HashiCorp Packer](https://developer.hashicorp.com/packer), or something more tailored to
Kubernetes, such as the [Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) (KIB) project.

## Kubernetes Image Builder

KIB is a project designed to help users create images for various platforms. The project is a consolidation of multiple
tools that together work to create an artifact, or in simpler terms, a custom image.

You can use the custom images created by KIB with Palette, assuming the infrastructure provider is supported in Palette.
Use the following diagram to understand how you can use KIB to create custom images that you can use with Palette.

![A diagram displaying the steps for creating a custom image](/cluster-profiles_byoos_image-builder_workflow-diagram.webp)

<br />

1. Download the KIB project and configure the image builder's **packer.json** file.

2. Use the `make` command to create a custom image containing a specific Operating System (OS) version and flavor.

3. The custom image is created and distributed to the target regions you specified in the **packer.json** file.

4. Create a cluster profile that points to your custom image.

5. Deploy a host cluster using your cluster profile that contains the custom image.

This guide will teach you how to use KIB to create images for your infrastructure provider so that you can use the
custom images in a Palette cluster profile.

### Prerequisites

- Palette v3.4.0 or greater.

- [Git](https://git-scm.com/downloads) v2.39.1 or greater.

- Access credentials to the target infrastructure provider. KBI, through the help of Packer, deploys a compute instance
  to the target environment during the image creation process.

- The cloud provider you choose may have different requirements. Review the KIB
  [documentation](https://image-builder.sigs.k8s.io/capi/capi.html) for your provider to learn more about the provider
  prerequisites.

- [HashiCorp Packer](https://developer.hashicorp.com/packer/tutorials/docker-get-started/get-started-install-cli)
  installed v1.8.6 or greater.

<br />

:::warning

To use a commercial OS, you must provide the license before starting the image creation process.

:::

### Create an Image

The following steps guide you through creating your image. You will create a custom Red Hat Enterprise Linux (RHEL)
image for Amazon Web Services (AWS). RHEL is a commercial product, so you will need license subscription credentials,
but you can use the same steps for a non-RHEL image. The critical point to take away in this guide is using KIB to
create the image.

1.  Clone the KIB repository.

    <Tabs>

    <TabItem label="HTTPS" value="https">

    ```shell
    git clone https://github.com/kubernetes-sigs/image-builder.git
    ```

          </TabItem>

    <TabItem label="SSH" value="ssh">

    ```shell
    git clone git@github.com:kubernetes-sigs/image-builder.git
    ```

    </TabItem>

    </Tabs>

2.  Switch the directory into the image builder folder.

    <br />

    ```shell
    cd image-builder/images/capi
    ```

3.  Open up the image builder [documentation site](https://image-builder.sigs.k8s.io/introduction.html) in your web
    browser, and review the steps to build an image for your specific infrastructure provider.

4.  If you are using a commercial OS such as RHEL, set the required environment variables per the KIB documentation. For
    RHEL, the following environment variables are required. Replace the placeholder values with your actual credentials.

    <br />

    ```shell
    export RHSM_USER=REPLACE_ME
    export RHSM_PASS=REPLACE_ME
    ```

    If you want to debug the Packer compute instance in case of an error, set the following environment variable. The
    Packer flag will allow you to remote connect to the instance versus Packer's default behavior of terminating the
    instance.

    <br />

    ```shell
    export PACKER_FLAGS=-on-error=ask
    ```

5.  Navigate to the **packer** folder and open the folder for the target infrastructure provider. Review the
    **packer.json** file. Make the desired configuration changes, such as the Kubernetes version, cloud credentials,
    network settings, instance size, image regions, and more. You must make changes in the file's `variables` section.
    The following example shows a condensed version of the `variables` object.

    ```json hideClipboard
     "variables": {
    ...
    "ami_groups": "",
    "ami_regions": "us-east-1, us-west-2",
    "ami_users": "",
    "ansible_common_vars": "",
    "ansible_extra_vars": "",
    "ansible_scp_extra_args": "",
    "ansible_user_vars": "",
    "aws_access_key": "",
    "aws_profile": "",
    "aws_region": "us-east-1",
    "aws_secret_key": "",
    "aws_security_group_ids": "",
    "aws_session_token": "",
    "build_timestamp": "{{timestamp}}",
    "builder_instance_type": "m5.xlarge",
    ....
    },
    ```

    :::info

    The file **packer.json** contains many variables you can use to customize the image. We recommend you review the KIB
    [documentation](https://image-builder.sigs.k8s.io/capi/capi.html) for your provider as it explains each variable.

    :::

6.  Set the credentials for your infrastructure provider. Each infrastructure provider supports different methods for
    providing credentials to Packer. You can review each infrastructure provider's authentication section by visiting
    the [Packer plugins site](https://developer.hashicorp.com/packer/plugins) and selecting your provider on the left
    **Main Menu**.

7.  Next, find the `make` command for your provider. You can use the following command to get a list of available RHEL
    options. Replace the `grep` filter with your target provider.

    <br />

    ```shell
    make | grep rhel
    ```

    Output:

    ```shell hideClipboard
    build-ami-rhel-8                     Builds RHEL-8 AMI
    build-azure-sig-rhel-8               Builds RHEL 8 Azure managed image in Shared Image Gallery
    build-azure-vhd-rhel-8               Builds RHEL 8 VHD image for Azure
    build-node-ova-local-rhel-7          Builds RHEL 7 Node OVA w local hypervisor
    build-node-ova-local-rhel-8          Builds RHEL 8 Node OVA w local hypervisor
    ...
    ```

8.  Issue the `make` command that aligns with your target provider. In this example, `build-ami-rhel-8 ` is the correct
    command for an RHEL AWS AMI creation.

    <br />

    ```shell
    make build-ami-rhel-8
    ```

    Output:

    ```shell hideClipboard
    amazon-ebs.{{user `build_name`}}: output will be in this color.

    ==> amazon-ebs.{{user `build_name`}}: Prevalidating any provided VPC information
    ==> amazon-ebs.{{user `build_name`}}: Prevalidating AMI Name: capa-ami-rhel-8-v1.24.11-1683320234
        amazon-ebs.{{user `build_name`}}: Found Image ID: ami-0186f9012927dfa39
    ==> amazon-ebs.{{user `build_name`}}: Creating temporary keypair: packer_64556dab-95d3-33e6-bede-f49b6ae430cb
    ==> amazon-ebs.{{user `build_name`}}: Creating temporary security group for this instance: packer_64556dae-fb5a-3c7d-2106-1c8960c6d60e
    ==> amazon-ebs.{{user `build_name`}}: Authorizing access to port 22 from [0.0.0.0/0] in the temporary security groups...
    ==> amazon-ebs.{{user `build_name`}}: Launching a source AWS instance...
        amazon-ebs.{{user `build_name`}}: Instance ID: i-06a8bf22b66abc698
    ....
    ```

9.  When the build process completes, note the image ID.

    <br />

    ```shell hideClipboard
     Build 'amazon-ebs.{{user `build_name`}}' finished after 22 minutes 29 seconds.

     ==> Wait completed after 22 minutes 29 seconds

     ==> Builds finished. The artifacts of successful builds are:
     --> amazon-ebs.{{user `build_name`}}: AMIs were created:
     us-east-1: ami-0f4804aff4cf9c5a2

     --> amazon-ebs.{{user `build_name`}}: AMIs were created:
     us-east-1: ami-0f4804aff4cf9c5a2
    ```

10. Log in to [Palette](https://console.spectrocloud.com).

11. Navigate to the left **Main Menu** and select **Profiles**.

12. Click on the **Add Cluster Profile** button.

13. Fill out the input fields for **Name**, **Description**, **Type** and **Tags**. Select **Full** as the profile type,
    and click **Next**.

14. Select your infrastructure provider. This example uses **AWS**.

15. Select the **BYOOS** pack. Use the following information to find the BYOOS pack.

    - Pack Type: OS
    - Registry: Public Repo
    - Pack Name: Bring Your Own OS (BYOOS)
    - Pack Version: 1.0.x or higher

16. Update the pack YAML to point to your custom image. You can use the tag values that Packer assigns to the image to
    help you identify the correct value to provide. In the example output below, the tag values `distribution_version`
    and `distribution` are used to determine the correct values for the YAML.

    ```shell hideClipboard
    ==> amazon-ebs.{{user `build_name`}}: Creating AMI tags
    amazon-ebs.{{user `build_name`}}: Adding tag: "build_date": "2023-05-10T17:19:37Z"
    amazon-ebs.{{user `build_name`}}: Adding tag: "build_timestamp": "1683739177"
    amazon-ebs.{{user `build_name`}}: Adding tag: "kubernetes_cni_version": "v1.2.0"
    amazon-ebs.{{user `build_name`}}: Adding tag: "source_ami": ""
    amazon-ebs.{{user `build_name`}}: Adding tag: "containerd_version": "1.6.20"
    amazon-ebs.{{user `build_name`}}: Adding tag: "distribution_release": "Enterprise"
    + amazon-ebs.{{user `build_name`}}: Adding tag: "distribution": "rhel"
    amazon-ebs.{{user `build_name`}}: Adding tag: "image_builder_version": ""
    amazon-ebs.{{user `build_name`}}: Adding tag: "kubernetes_version": "v1.24.11"
    + amazon-ebs.{{user `build_name`}}: Adding tag: "distribution_version": "8
    ```

    In this example, the YAML is updated to point to the RHEL image created earlier. Use the table below to learn more
    about each variable.

    | **Parameter**     | **Description**                                                                                                                                                      | **Type** |
    | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
    | `osImageOverride` | The ID of the image to use as the base OS layer. This is the image ID as assigned in the infrastructure environment it belongs to. Example: `ami-0f4804aff4cf9c5a2`. | string   |
    | `osName`          | The name of the OS distribution. Example: `rhel`.                                                                                                                    | string   |
    | `osVersion`       | The version of the OS distribution. Example: `8`                                                                                                                     | string   |

    ```yaml
    pack:
      osImageOverride: "ami-0f4804aff4cf9c5a2"
      osName: "rhel"
      osVersion: "8"
    ```

    :::info

    Depending on what platform you are targeting, the value you provide for `osImageOverride` may differ. For example,
    for AWS, the value is the AMI ID. For vSphere, the value is VM template path and name. Refer to the
    [Reference Custom Image](../integrations/byoos.md?edge-non-edge=Non-Edge#reference-custom-image) section of the
    BYOOS page for examples.

    :::

![View of the cluster profile wizard](/clusters_byoos_image-builder_cluster-profile-byoos-yaml.webp)

17. Click on **Next layer** to add the Kubernetes layer.

18. Select the desired Kubernetes distribution and version. Click on the **\</\>** button to display the YAML editor.

19. Complete the remainder of the cluster profile creation wizard by selecting the next cluster profile layers.

You now have a cluster profile that uses the custom image you created using the
[Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) project.

:::warning

When deploying a host cluster, choosing the appropriate cloud provider and region where the image was distributed is
critical to successfully launching a cluster using a custom image in the cluster profile. Failure to do so may result in
Palette's inability to launch a cluster.

:::

### Validate

Use the following steps to validate your custom image is working correctly.

1. Deploy a compute instance in the respective infrastructure provider using your custom image. Review the compute
   instance logs to learn more about any issues you may encounter.

2. Next, deploy a host cluster using the cluster profile you created that contains the custom image. Verify the cluster
   is deployed correctly and without any issues. If you encounter any problems, review the cluster's event log to gain
   more details about the issue. Check out the [Deploy a Cluster](/clusters/public-cloud/deploy-k8s-cluster/) tutorial
   for additional guidance on deploying a host cluster.
