---
sidebar_label: "Rocky and PXK"
title: "Rocky and Palette eXtended Kubernetes"
description:
  "Learn how to build a custom Rocky with PXK image for VMware vSphere and use it to deploy a Kubernetes cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["operating system", "byoos", "profiles", "pxk", "vmware"]
---

<!-- prettier-ignore-start -->

This guide teaches you how to use the [CAPI Image Builder](../../capi-image-builder.md) tool to create a custom
[Rocky Linux](https://rockylinux.org/) image with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for VMware vSphere and use the image to create a cluster profile. You can use either a Rocky Linux boot ISO or an existing Rocky Linux VM to create your image.

<!-- prettier-ignore-end -->

:::preview

:::

## Prerequisites

<Tabs groupId="image-base">

<TabItem label="Rocky ISO" value="iso">

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- An existing Linux device used to execute commands and build your Rocky image. This device must have the following
  resources available and the following software installed:

  - 4 CPUs
  - 8 GB of RAM
  - 50 GB of free disk space
  - [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/docs/installation)
  - [curl](https://curl.se/docs/install.html)
  - (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your Rocky image. Custom
    scripts are supported beginning with CAPI Image Builder version 4.6.23.

</TabItem>

<TabItem label="Rocky VM" value="vm">

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- An existing Linux device used to execute commands and build your Rocky image. This device must have the following
  resources available and the following software installed:

  - 4 CPUs
  - 8 GB of RAM
  - 50 GB of free disk space
  - [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/docs/installation)
  - [curl](https://curl.se/docs/install.html)
  - (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your Rocky image. Custom
    scripts are supported beginning with CAPI Image Builder version 4.6.23.

<PartialsComponent category="capi-image-builder" name="vm-prerequisites" />

</TabItem>

</Tabs>

## Build Custom Image

<Tabs groupId="image-base">

<TabItem label="Rocky ISO" value="iso">

<PartialsComponent category="capi-image-builder" name="build-custom-image-intro" />

5.  Download the [Rocky Linux ISO file](https://download.rockylinux.org/pub/rocky/) into the `output` directory. Ensure
    you download a `x86_64-dvd.iso` file and not a `x86_64-boot.iso` file.

    This guide uses Rocky 8 as an example. Refer to the [Configuration Reference](../../config-reference.md) page for
    details on supported operating systems.

    ```shell
    curl https://download.rockylinux.org/pub/rocky/8/isos/x86_64/Rocky-8-latest-x86_64-dvd.iso --output Rocky-8-latest-x86_64-dvd.iso
    ```

6.  Calculate the SHA256 checksum for the Rocky ISO you downloaded. The calculation might take a few minutes. Save the
    output, as you will need it later.

    ```shell
    sha256sum Rocky-8-latest-x86_64-dvd.iso
    ```

    The output should be similar to the sample output displayed below.

    ```text hideClipBoard title="Example Rocky SHA"
    642ada8a49dbeca8cca6543b31196019ee3d649a0163b5db0e646c7409364eeb  Rocky-8-latest-x86_64-dvd.iso
    ```

7.  Download the `imageconfig` template file.

    ```shell
    curl https://software.spectrocloud.com/tools/capi-image-builder/imageconfig --output imageconfig
    ```

8.  Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. The
    `imageconfig` file is the file used to personalize the base CAPI image for your cluster, which you can alter to fit
    your needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS compliant,
    and more.

    The following example configuration configures a Rocky 8 CAPI image from a Rocky ISO using the SHA256 checksum of
    the Rocky ISO from step 6 of this guide. Replace all VMware-related placeholders in the
    `Define Vmware infra details` section with values from your VMware vSphere environment.

    For a complete list of parameters, refer to the [Configuration Reference](../../config-reference.md) page.
    Additionally, refer to the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported
    Kubernetes versions and their corresponding dependencies.

    ```text {4-5,9,13,19-22,30-31,38-46,64}
     # Define the OS type and version here
     # os_version=rhel-8 | rhel-9 | rockylinux-8 | rockylinux-9
     # image_type=standard | fips
     os_version=rockylinux-8
     image_type=standard

     # Define the image name
     # image_name=<Final Image Name to create>
     image_name=rocky-8

     # Define the Cloud type
     # cloud_type=vmware
     cloud_type=vmware

     # Define the Component Versions
     #
     # containerd crictl and cni version update should be done
     #   only if the images are available in the upstream repositories
     k8s_version=1.30.4
     cni_version=1.3.0
     containerd_version=1.7.13
     crictl_version=1.28.0

     # Define RHEL subscription credentials(if $image_type=rhel)
     # used while image creation to use package manager
     #rhel_subscription-user=
     #rhel_subscription_pass=

     # Define ISO url(if image is rhel or rockylinux)
     iso_name=Rocky-8-latest-x86_64-dvd.iso
     iso_checksum=<iso-checksum>

     # Define AWS infra details
     aws_access_key=
     aws_secret_key=

     # Define Vmware infra details
     vcenter_server=<vcenter-server>
     vcenter_user=<vcenter-user>
     vcenter_password=<vcenter-password>
     vcenter_datacenter=<vcenter-datacenter>
     vcenter_datastore=<vcenter-datastore>
     vcenter_network=<vcenter-network>
     vcenter_folder=<vcenter-folder>
     vcenter_cluster=<vcenter-cluster>
     vcenter_resource_pool=<vcenter-resource-pool>

     # Optional: for OVA based builds
     vcenter_template=

     # Define Azure infra details
     azure_client_id=
     azure_client_secret=
     azure_subscription_id=
     azure_location=
     azure_storage_account=
     azure_resource_group=

     # Define GCE infra details
     google_app_creds=
     gcp_project_id=

     # Airgap Configuration
     airgap=false
     airgap_ip=""
     k8s_rpm_key=
     k8s_rpm_server=
     containerd_url=
     crictl_url=
     k8s_container_reg=
     cert_url=
    ```

    :::tip

    To build a FIPS-compliant image, keep the `image_type` set to `fips`.

    :::

    Once you are finished making changes, save and exit the file.

9.  (Optional) You can add custom Bash scripts (`.sh` files) to run before or after the build process. This feature is
    available beginning with CAPI Image Builder version 4.6.23. If any scripts are found in the relevant directories,
    they are copied to an Ansible playbook. If you do not want to add custom scripts, skip this step.

    <details>

    <summary>Add Pre- and Post-Install Bash Scripts</summary>

    1. In the `output` directory, create the directories `custom_scripts/pre` and `custom_scripts/post`.

       ```bash
       mkdir -p custom_scripts/pre custom_scripts/post
       ```

    2. Move any scripts that you want to be executed _before_ the build process to the `pre` directory. Move any scripts
       that you want to be executed _after_ the build process to the `post` directory. Ensure the scripts are
       executable.

       Below is an example of moving a pre-install script to the appropriate `pre` directory and making it executable.

       ```bash hideClipboard title="Example of moving a script and modifying permissions"
       mv sample-script.sh custom_scripts/pre/sample-script.sh
       chmod +x custom_scripts/pre/sample-script.sh
       ```

    </details>

10. Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
    variable. The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware
    vSphere environment using the `image_name` defined in `imageconfig`. The tool will then generate a Rocky image from
    the VM and save it to the `output` directory.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```bash
        BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>

        </Tabs>

        If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

            <details>
            <summary>CAPI Image Builder with Static IP Placement </summary>

            1. Download the Rocky 8 `ks.cfg` file from the [Image Builder](https://github.com/kubernetes-sigs/image-builder)
                GitHub repository directly into the output folder.

                ```shell
                curl --location https://github.com/kubernetes-sigs/image-builder/raw/main/images/capi/packer/ova/linux/rockylinux/http/8/ks.cfg.tmpl --output ks.cfg
                ```

            2. Open the `ks.cfg` file in an editor of your choice. Locate and replace the network line
                `network --bootproto=dhcp --onboot=on --ipv6=auto --activate --hostname=capv.vm` with the configuration below.

                ```text
                network --bootproto=static --ip=<vcenter-static-ip-address> --netmask=<vcenter-netmask> --gateway=<vcenter-gateway> --nameserver=<vcenter-nameserver>
                ```

                Replace `<vcenter-static-ip-address>` with a valid IP address from your VMware vSphere environment and
                `<vcenter-netmask>`, `<vcenter-gateway>`, and `<vcenter-nameserver>` with the correct values from your VMware vSphere
                environment. The `<vcenter-netmask>` parameter must be specified in dotted decimal notation, for example, `--netmask=255.255.255.0`.

                Once you are finished making changes, save and exit the file.

            3.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
                variable. The tool will use the `imageconfig` file to create and configure a VM with static IP placement in
                your VMware vSphere environment.

                <Tabs groupId="container-tech">
                <TabItem value="Docker" label="Docker">

                 ```bash
                 BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
                 ```
                </TabItem>

                <TabItem value="Podman" label="Podman">

                 ```bash
                 BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
                 ```

                </TabItem>
                </Tabs>

            </details>

11. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. It may
    take a few minutes for the logs to start being displayed, and the build takes several minutes to complete. If you
    added any custom scripts in step 9, the output will be displayed in the build log.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID
        ```

        </TabItem>

        </Tabs>

12. Once the build is complete, the Rocky CAPI image is downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. Issue the following command to confirm that the build files are present in the
    `output` directory.

        ```shell
        ls -l <image_name>
        ```

        ```text hideClipboard title="Example output"
        -rw-r--r-- 1 ubuntu ubuntu       1203 Nov 18 02:48 packer-manifest.json
        -rw-r--r-- 1 ubuntu ubuntu 3571576320 Nov 18 02:48 rocky-8-disk-0.vmdk
        -rw-r--r-- 1 ubuntu ubuntu       9507 Nov 18 02:48 rocky-8-fips.ovf
        -rw-r--r-- 1 ubuntu ubuntu        212 Nov 18 02:48 rockylinux-8-kube-v1.30.4.mf
        -rw-r--r-- 1 ubuntu ubuntu 3571630080 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova
        -rw-r--r-- 1 ubuntu ubuntu         64 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova.sha256
        -rw-r--r-- 1 ubuntu ubuntu      41044 Nov 18 02:48 rockylinux-8-kube-v1.30.4.ovf
        ```

13. <PartialsComponent category="capi-image-builder" name="ssh-vm" />

14. Enter a **VM template name**, choose a location for the template, and select **Next**.

    :::info

    The name and location do not have to match those defined in the `imageconfig` file. The same applies to the
    remaining locations and resources specified in the following steps.

    :::

15. Choose a compute resource and select **Next**.

16. Choose a storage location and select **Next**.

17. Review your template configurations and select **Finish** to convert the VM into a Rocky image template that you can
    reference when creating your cluster profile.

</TabItem>

<TabItem label="Rocky VM" value="vm">

<PartialsComponent category="capi-image-builder" name="build-custom-image-intro" />

5.  Download the `imageconfig` template file.

    ```shell
    curl https://software.spectrocloud.com/tools/capi-image-builder/imageconfig --output imageconfig
    ```

6.  Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. The
    `imageconfig` file is the file used to personalize the base CAPI image for your cluster, which you can alter to fit
    your needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS compliant,
    and more.

    The following example configuration configures a Rocky 8 CAPI image from an existing Rocky 8 VM in VMware vSphere.
    Replace all VMware-related placeholders in the `Define Vmware infra details` section with values from your VMware
    vSphere environment. Additionally, for `vcenter_template`, enter the full datacenter path to the Rocky VM that you
    want to use as a base for your CAPI image.

    For a complete list of parameters, refer to the [Configuration Reference](../../config-reference.md) page.
    Additionally, refer to the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported
    Kubernetes versions and their corresponding dependencies.

    ```text {4-5,9,13,19-22,38-46,49,64}
     # Define the OS type and version here
     # os_version=rhel-8 | rhel-9 | rockylinux-8 | rockylinux-9
     # image_type=standard | fips
     os_version=rockylinux-8
     image_type=standard

     # Define the image name
     # image_name=<Final Image Name to create>
     image_name=rocky-8

     # Define the Cloud type
     # cloud_type=vmware
     cloud_type=vmware

     # Define the Component Versions
     #
     # containerd crictl and cni version update should be done
     #   only if the images are available in the upstream repositories
     k8s_version=1.30.4
     cni_version=1.3.0
     containerd_version=1.7.13
     crictl_version=1.28.0

     # Define RHEL subscription credentials(if $image_type=rhel)
     # used while image creation to use package manager
     #rhel_subscription-user=
     #rhel_subscription_pass=

     # Define ISO url(if image is rhel or rockylinux)
     iso_name=
     iso_checksum=

     # Define AWS infra details
     aws_access_key=
     aws_secret_key=

     # Define Vmware infra details
     vcenter_server=<vcenter-server>
     vcenter_user=<vcenter-user>
     vcenter_password=<vcenter-password>
     vcenter_datacenter=<vcenter-datacenter>
     vcenter_datastore=<vcenter-datastore>
     vcenter_network=<vcenter-network>
     vcenter_folder=<vcenter-folder>
     vcenter_cluster=<vcenter-cluster>
     vcenter_resource_pool=<vcenter-resource-pool>

     # Optional: for OVA based builds
     vcenter_template=<vcenter-datacenter-path-to-VM>

     # Define Azure infra details
     azure_client_id=
     azure_client_secret=
     azure_subscription_id=
     azure_location=
     azure_storage_account=
     azure_resource_group=

     # Define GCE infra details
     google_app_creds=
     gcp_project_id=

     # Airgap Configuration
     airgap=false
     airgap_ip=""
     k8s_rpm_key=
     k8s_rpm_server=
     containerd_url=
     crictl_url=
     k8s_container_reg=
     cert_url=
    ```

    :::tip

    To build a FIPS-compliant image, keep the `image_type` set to `fips`.

    :::

    Once you are finished making changes, save and exit the file.

7.  (Optional) You can add custom Bash scripts (`.sh` files) to run before or after the build process. This feature is
    available beginning with CAPI Image Builder version 4.6.23. If any scripts are found in the relevant directories,
    they are copied to an Ansible playbook. If you do not want to add custom scripts, skip this step.

    <details>

    <summary>Add Pre- and Post-Install Bash Scripts</summary>

    1. In the `output` directory, create the directories `custom_scripts/pre` and `custom_scripts/post`.

       ```bash
       mkdir -p custom_scripts/pre custom_scripts/post
       ```

    2. Move any scripts that you want to be executed _before_ the build process to the `pre` directory. Move any scripts
       that you want to be executed _after_ the build process to the `post` directory. Ensure the scripts are
       executable.

       Below is an example of moving a pre-install script to the appropriate `pre` directory and making it executable.

       ```bash hideClipboard title="Example of moving a script and modifying permissions"
       mv sample-script.sh custom_scripts/pre/sample-script.sh
       chmod +x custom_scripts/pre/sample-script.sh
       ```

    </details>

8.  Issue the commands below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
    variable.

    The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware vSphere
    environment using the `image_name` defined in `imageconfig`. The tool will then generate a Rocky image from the VM
    and save it to the `output` directory.

    :::info

    The following commands provide a workaround for an existing issue by temporarily suspending the build and removing
    an erroneous task that checks for Red Hat Subscription Management (RHSM) credentials. For the final command, replace
    `<os_version>` with the Rocky `os_version` referenced in the `imageconfig` file (`rockylinux-8` or `rocklinux-9`).

    :::

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```bash {4}
        BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION sleep infinity)
        docker exec $BUILD_ID bash --command 'sed --in-place "/Fail if RHSM_USER or RHSM_PASS/,/lookup.*RHSM_PASS.*length == 0/d" /home/imagebuilder/ansible/roles/setup/tasks/redhat.yml'
        docker exec $BUILD_ID make build-node-ova-vsphere-clone-<os_version>
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```bash {4}
        BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION sleep infinity)
        docker exec $BUILD_ID bash --command 'sed --in-place "/Fail if RHSM_USER or RHSM_PASS/,/lookup.*RHSM_PASS.*length == 0/d" /home/imagebuilder/ansible/roles/setup/tasks/redhat.yml'
        docker exec $BUILD_ID make build-node-ova-vsphere-clone-<os_version>
        ```

        </TabItem>

        </Tabs>

        If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

            <details>
            <summary>CAPI Image Builder with Static IP Placement </summary>

            1. Download the Rocky 8 `ks.cfg` file from the [Image Builder](https://github.com/kubernetes-sigs/image-builder)
                GitHub repository directly into the output folder.

                ```shell
                curl --location https://github.com/kubernetes-sigs/image-builder/raw/main/images/capi/packer/ova/linux/rockylinux/http/8/ks.cfg.tmpl --output ks.cfg
                ```

            2. Open the `ks.cfg` file in an editor of your choice. Locate and replace the network line
                `network --bootproto=dhcp --onboot=on --ipv6=auto --activate --hostname=capv.vm` with the configuration below.

                ```text
                network --bootproto=static --ip=<vcenter-static-ip-address> --netmask=<vcenter-netmask> --gateway=<vcenter-gateway> --nameserver=<vcenter-nameserver>
                ```

                Replace `<vcenter-static-ip-address>` with a valid IP address from your VMware vSphere environment and
                `<vcenter-netmask>`, `<vcenter-gateway>`, and `<vcenter-nameserver>` with the correct values from your VMware vSphere
                environment. The `<vcenter-netmask>` parameter must be specified in dotted decimal notation, for example, `--netmask=255.255.255.0`.

                Once you are finished making changes, save and exit the file.

            3.  Issue the commands below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
                variable. The tool will use the `imageconfig` file to create and configure a VM with static IP placement in
                your VMware vSphere environment.

                Note that the following commands provide a workaround for an existing issue by temporarily suspending the build and removing an erroneous task that checks for Red Hat Subscription Management (RHSM) credentials. For the final command, replace `<os_version>` with the Rocky `os_version` referenced in the `imageconfig` file (`rockylinux-8` or `rocklinux-9`).

                <Tabs groupId="container-tech">
                <TabItem value="Docker" label="Docker">

                 ```bash {4}
                    BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
                    BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION sleep infinity)
                    docker exec $BUILD_ID bash --command 'sed --in-place "/Fail if RHSM_USER or RHSM_PASS/,/lookup.*RHSM_PASS.*length == 0/d" /home/imagebuilder/ansible/roles/setup/tasks/redhat.yml'
                    docker exec $BUILD_ID make build-node-ova-vsphere-clone-<os_version>
                 ```
                </TabItem>

                <TabItem value="Podman" label="Podman">

                 ```bash
                    BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
                    BUILD_ID=$(podman run --net=host --volume /home/$USER/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION sleep infinity)
                    docker exec $BUILD_ID bash --command 'sed --in-place "/Fail if RHSM_USER or RHSM_PASS/,/lookup.*RHSM_PASS.*length == 0/d" /home/imagebuilder/ansible/roles/setup/tasks/redhat.yml'
                    docker exec $BUILD_ID make build-node-ova-vsphere-clone-<os_version>
                 ```

                </TabItem>
                </Tabs>

            </details>

9.  Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. It may
    take a few minutes for the logs to start being displayed, and the build takes several minutes to complete. If you
    added any custom scripts in step 7, the output will be displayed in the build log.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID
        ```

        </TabItem>

        </Tabs>

10. Once the build is complete, the Rocky CAPI image is downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. Issue the following command to confirm that the build files are present in the
    `output` directory.

        ```shell
        ls -l <image_name>
        ```

        ```text hideClipboard title="Example output"
        -rw-r--r-- 1 ubuntu ubuntu       1203 Nov 18 02:48 packer-manifest.json
        -rw-r--r-- 1 ubuntu ubuntu 3571576320 Nov 18 02:48 rocky-8-disk-0.vmdk
        -rw-r--r-- 1 ubuntu ubuntu       9507 Nov 18 02:48 rocky-8-fips.ovf
        -rw-r--r-- 1 ubuntu ubuntu        212 Nov 18 02:48 rockylinux-8-kube-v1.30.4.mf
        -rw-r--r-- 1 ubuntu ubuntu 3571630080 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova
        -rw-r--r-- 1 ubuntu ubuntu         64 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova.sha256
        -rw-r--r-- 1 ubuntu ubuntu      41044 Nov 18 02:48 rockylinux-8-kube-v1.30.4.ovf
        ```

11. <PartialsComponent category="capi-image-builder" name="ssh-vm" />

12. Enter a **VM template name**, choose a location for the template, and select **Next**.

    :::info

    The name and location do not have to match those defined in the `imageconfig` file. The same applies to the
    remaining locations and resources specified in the following steps.

    :::

13. Choose a compute resource and select **Next**.

14. Choose a storage location and select **Next**.

15. Review your template configurations and select **Finish** to convert the VM into a Rocky image template that you can
    reference while creating your cluster profile.

</TabItem>

</Tabs>

## Create Cluster Profile

The Rocky image is now built and available in the VMware vSphere environment. You can use it to create a cluster profile
and deploy a VMware host cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles > Add Cluster Profile**.

3. In the **Basic Information** section, assign the cluster profile a **Name**, brief **Description**, and **Tags**.
   Choose **Full** or **Infrastructure** for the profile **Type**, and select **Next**.

4. In the **Cloud Type** section, choose **VMware vSphere**, and select **Next**.

<!-- prettier-ignore-start -->

5. Select the <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi" /> pack and
   provide the following values in the YAML configuration editor. Proceed to the **Next** layer when finished.

   | **Field**         | **Description**                                                                                                                                   | **Example** |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
   | `osImageOverride` | The path to your Rocky Linux image template in your VMware vSphere environment.                  | `/Datacenter/vm/sp-docs/rockylinux-8-kube-v1.30.4` |
   | `osName`          | The type of operating system used in your image.                                                                                    | `rockylinux` | 
   | `osVersion`       | The version of your operating system. Enter `8` or `9` depending on the Rocky Linux `os_version` referenced in the `imageconfig` file. | `8` | 

   ```yaml hideClipboard title="Example YAML configuration"
   pack:
     osImageOverride: "/Datacenter/vm/sp-docs/rockylinux-8-kube-v1.30.4"
     osName: "rockylinux"
     osVersion: "8"
   ```

6. Select the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" />
   pack. Ensure the **Pack Version** matches the `k8s_version` specified in the `imageconfig` file. Proceed to the
   **Next** layer.

<!-- prettier-ignore-end -->

7. Complete the remaining profile layers, making any changes necessary. When finished, select **Finish Configuration**
   to create your cluster profile. For additional information on creating cluster profiles, refer to our
   [Create an Infrastructure Profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
   and [Create a Full Profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md)
   guides.

## Next Steps

After you have created an OS image with CAPI Image Builder and have it referenced in a cluster profile, you can deploy a
VMware host cluster using the created cluster profile. Refer to the
[Deploy App Workloads with a PCG](../../../../tutorials/clusters/pcg/deploy-app-pcg.md) tutorial for instructions on
deploying a VMware host cluster.
