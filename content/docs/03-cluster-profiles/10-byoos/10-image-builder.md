---
title: "Create Images with Image Builder"
metaTitle: "Create Images with Image Builder"
metaDescription: "Learn how to use the Image Builder project to create images for Palette"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

You can create and deploy custom images to most infrastructure providers using various tools. Many infrastructure providers have tools that you can use to create custom images for the platform, such as [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/) for AWS or [Azure VM Image Builder](https://azure.microsoft.com/en-us/products/image-builder) for Azure. You can also use platform agnostic tools, such as [HashiCorp Packer](https://developer.hashicorp.com/packer), or something more tailored to Kubernetes, such as the [Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) project.


## Kubernetes Image Builder

The Kubernetes Image Builder (KIB) is a project designed to help users create images for various platforms. The project is a consolidation of multiple tools that together work to create an artifact, or in simpler terms, a custom image. 

You can use the custom images created by KIB with Palette, assuming the infrastructure provider is supported in Palette. Use the following diagram to understand how you can use KIB to create custom images that you can use with Palette.

![A diagram displaying the steps for creating a custom image](/cluster-profiles_byoos_image-builder_workflow-diagram.png) <br />

1. You will download the KIB project and configure the image builder's **packer.json** file.


2. Use the `make` command to create a custom image containing a specific Operating System (OS) version and flavor.


3. The custom image is created and distributed to the target regions you specified in the **packer.json** file.


4. Create a cluster profile pointing to your custom image.


5. Deploy a host cluster using your cluster profile containing the custom image.


This guide will teach you how to use the Kubernetes Image Builder to create images for your infrastructure provider so that you can use the custom image in a cluster profile.

# Prerequisites


* Palette v3.4.0 or greater.


* [Git](https://git-scm.com/downloads) v2.39.1 or greater.


* Access credentials to the target infrastructure provider. KBI, through the help of Packer, deploys a compute instance to the target environment during the image creation process.


* The cloud provider you choose may have different requirements. Review the KIB [documentation](https://image-builder.sigs.k8s.io/capi/capi.html) for your provider to learn more about the provider prerequisites.


* [HashiCorp Packer](https://developer.hashicorp.com/packer/tutorials/docker-get-started/get-started-install-cli) installed v1.8.6 or greater. 

<br />

<WarningBox>

To use a commercial OS, you must provide the license before starting the image creation process.

</WarningBox>

# Create an Image

The following steps will guide you through creating your image. You will create a custom Red Hat Enterprise Linux (RHEL) for Amazon Web Services (AWS). RHEL is a commercial product, so you will need license subscription credentials, but you can use the same steps for a non-RHEL image. The critical point to take away in this guide is using KIB to create the image. 

<br />

1. Clone the KIB repository.

    <br />

    ```shell
    git@github.com:snehala27/image-builder.git
    ```

    <InfoBox>

    A modified KIB repository is used to address GitHub issue [#1141](https://github.com/kubernetes-sigs/image-builder/issues/1132). This guide will be updated to point back to the community repository once the [pull request](https://github.com/kubernetes-sigs/image-builder/pull/1141) addressing the issue is accepted and merged into the code base.

    </InfoBox>

2. Switch the directory into the image builder folder.

    <br />

    ```shell
    cd image-builder/images/capi
    ```

3. Check out the following git branch.

  <br />

  ```shell
  git fetch && git checkout rhelIssueAWSCLI
  ```


4. Open up the image builder [documentation site](https://image-builder.sigs.k8s.io/introduction.html) in your web browser and review the steps for the infrastructure provider you want to build an image for.



5. If you are using a commercial OS such as RHEL, set the required environment variables per the KIB documentation. For RHEL, the following environment variables are required. Replace the placeholder values with your actual credentials.

    <br />

    ```shell
    export RHSM_USER=REPLACE_ME 
    export RHSM_PASS=REPLACE_ME
    ```

    If you want to debug the Packer compute instance in case of an error, set the following environment variable. The Packer flag will allow you to remote connect to the instance versus Packer's default behavior of terminating the instance.

    <br />

    ```shell
    export PACKER_FLAGS=-on-error=ask
    ```

6. Navigate to the **packer** folder and open up the folder for the target infrastructure provider. Review the file **packer.json**. Make any configuration changes you desire, such as the Kubernetes version, cloud credentials, network settings, instance size, image regions etc. You must make changes in the file's `variables` section. Only a condensed version of the 'variables' object below is used for illustrative purposes to enhance the reader's experience. 

    <br />

    ```json
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

    <br />

    <InfoBox>

    The file **packer.json** contains many user variables use can use to customize the image. We recommend you review the KIB [documentation](https://image-builder.sigs.k8s.io/capi/capi.html) for your provider as it explains each variable.

    </InfoBox>



7. Set the credentials for your infrastructure provider. Each infrastructure provider supports different methods for providing credentials to Packer. You can review each infrastructure provider's authentication section by visiting the [Packer plugins site](https://developer.hashicorp.com/packer/plugins) and selecting your provider on the left **Main Menu**.



8. Next, find the `make` command for your provider. You can use the following command to get a list of all available RHEL options. Replace the `grep` filter with the provider you are creating an image for.

    <br />

    ```shell
    make | grep rhel 
    ```

    Output:
    ```shell
    build-ami-rhel-8                     Builds RHEL-8 AMI
    build-azure-sig-rhel-8               Builds RHEL 8 Azure managed image in Shared Image Gallery
    build-azure-vhd-rhel-8               Builds RHEL 8 VHD image for Azure
    build-node-ova-local-rhel-7          Builds RHEL 7 Node OVA w local hypervisor
    build-node-ova-local-rhel-8          Builds RHEL 8 Node OVA w local hypervisor
    ... 
    ```

9. Issue the `make` command that aligns with your target provider. In this example, `build-ami-rhel-8 ` is the correct command for an RHEL AWS AMI creation.

    <br />

    ```shell
    make build-ami-rhel-8 
    ```

    Output:
    ```shell
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

10. Once the build process is complete, note the image ID.

    <br />

    ```shell
     Build 'amazon-ebs.{{user `build_name`}}' finished after 22 minutes 29 seconds.

     ==> Wait completed after 22 minutes 29 seconds

     ==> Builds finished. The artifacts of successful builds are:
     --> amazon-ebs.{{user `build_name`}}: AMIs were created:
     us-east-1: ami-0f4804aff4cf9c5a2

     --> amazon-ebs.{{user `build_name`}}: AMIs were created:
     us-east-1: ami-0f4804aff4cf9c5a2
    ```


11. Login to [Palette](https://console.spectrocloud.com).



12. Navigate to the left **Main Menu** and select **Profiles**. 



13. Click on the **Add Cluster Profile** to create a new cluster profile that uses your new custom image.



14. Fill out the inputs fields for **Name**, **Description**, **Type** and **Tags**. Select the type **Full** and click on **Next**.


15. Select your infrastructure provider. In this example, **AWS** is selected.



16. Select the **BYOOS** pack. Use the following information to find the BYOOS pack.

* Pack Type: OS
* Registry: Public Repo
* Pack Name: Bring Your Own OS (BYO-OS)
* Pack Version: 1.0.x or higher

17. Update the pack YAML to point to your custom image. You can use the tag values Packer assigns to the image to help you identify the correct value to provide the pack YAML. In the example output below, the tag values `distribution_version` and `distribution` are used to determine the correct values for the YAML.

    <br />

    ```
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

    In this example, the YAML is updated to point to the RHEL image created earlier. Use the table below to learn more about each variable.

    <br />

    | Parameter | Description | Type | 
    |---|----|----|
    | `osImageOverride` | The ID of the image to use as the base OS layer. This is the image ID as assigned in the infrastructure environment it belongs to. Example: `ami-0f4804aff4cf9c5a2`. | string|
    | `osName` | The name of the OS distribution. Example: `rhel`. | string |
    | `osVersion`| The version of the OS distribution. Example: `8` | string|

    <br />

    ```yaml
    pack:
      osImageOverride: "ami-0f4804aff4cf9c5a2"
      osName: "rhel"
      osVersion: "8"
    ```


  ![View of the cluster profile wizard](/clusters_byoos_image-builder_cluster-profile-byoos-yaml.png)


18. Click on **Next layer** to add the Kubernetes layer.


19. Select the desired Kubernetes distribution and version. Click on the **</\>** button to reveal the YAML editor.


20. Complete the remainder of the cluster profile creation wizard by selecting the next cluster profile layers.

You now have a cluster profile that uses the custom image you created using the [Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) project. 

<br />

<WarningBox>

When deploying a host cluster, choosing the appropriate cloud provider and region where the image was distributed is critical to successfully launching a cluster using a custom image in the cluster profile. Failure to do so may result in Palette's inability to launch a cluster.

</WarningBox>

# Validation

Use the following steps to validate your custom image.

1. You can validate that the custom image is working correctly by deploying a compute instance in the respective infrastructure provider you created the image in using the custom image. Review the compute instance logs to learn more about the problems if you encounter any issues.


2. Next, deploy a host cluster that uses the cluster profile you created containing the custom image. Verify the cluster is deployed correctly and without any issues. If you encounter any problems, review the event logs of the cluster to gain more details about the issue. Check out the [Deploy a Cluster](/clusters/public-cloud/deploy-k8s-cluster/) tutorial for additional guidance on deploying a host cluster.