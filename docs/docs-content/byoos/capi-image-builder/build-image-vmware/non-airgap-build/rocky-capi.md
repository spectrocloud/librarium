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
[Rocky Linux](https://rockylinux.org/) image with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for VMware vSphere and use the image to create a cluster profile.

<!-- prettier-ignore-end -->

:::preview

:::

## Prerequisites

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- The machine executing the commands must have the following hardware resources available:

  - 4 CPU
  - 8 GB of RAM
  - 50 GB of free disk space

- The following software installed:

  - [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/docs/installation)
  - [curl](https://curl.se/docs/install.html)

- (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your Rocky image. Custom
  scripts are supported beginning with CAPI Image Builder version 4.6.23.

## Build Custom Image

1.  Open up a terminal session on your Linux machine and download the CAPI Image Builder image, replacing `<tag>` with
    your desired CAPI Image Builder version. This guide uses version 4.6.23 as an example. Refer to the CAPI Image
    Builder [Downloads](../../../../downloads/capi-image-builder.md) page for the latest version.

    <Tabs>

        <TabItem value="Docker" label="Docker">

        ```shell
        docker pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>
        ```

        Confirm that the image was downloaded correctly.

        ```shell
        docker images
        ```

        ```text hideClipboard title="Example output"
        REPOSITORY                                                           TAG        IMAGE ID       CREATED       SIZE
        us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder   v4.6.23    2adff15eee2d   7 days ago    2.47 GB
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>
        ```

        Confirm that the image was downloaded correctly.

        ```shell
        podman images
        ```

        ```text hideClipboard title="Example output"
        REPOSITORY                                                           TAG        IMAGE ID       CREATED       SIZE
        us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder   v4.6.23    2adff15eee2d   7 days ago    2.47 GB
        ```

        </TabItem>

    </Tabs>

2.  Create an `output` directory to store the image files and set the required permissions. Replace `<username>` with
    your Linux username.

    ```shell
    mkdir /home/<username>/output
    chmod a+rwx /home/<username>/output
    ```

3.  Navigate to the `output` directory. Replace `<username>` with your Linux username.

    ```shell
    cd /home/<username>/output
    ```

4.  Download the [Rocky Linux ISO file](https://download.rockylinux.org/pub/rocky/) into the `output` directory. Ensure
    you download a `x86_64-dvd.iso` file and not a `x86_64-boot.iso` file.

    This guide uses Rocky 8 as an example. Refer to the [Configuration Reference](../../config-reference.md) page for
    details on supported operating systems.

    ```shell
    curl https://download.rockylinux.org/pub/rocky/8/isos/x86_64/Rocky-8-latest-x86_64-dvd.iso --output Rocky-8-latest-x86_64-dvd.iso
    ```

5.  Calculate the SHA256 checksum for the Rocky ISO you downloaded. The calculation might take a few minutes. Save the
    output, as you will need it later.

    ```shell
    sha256sum Rocky-8-latest-x86_64-dvd.iso
    ```

    The output should be similar to the sample output displayed below.

    ```text hideClipBoard title="Example Rocky SHA"
    642ada8a49dbeca8cca6543b31196019ee3d649a0163b5db0e646c7409364eeb  Rocky-8-latest-x86_64-dvd.iso
    ```

6.  Download the `imageconfig` template file.

    ```shell
    curl https://software.spectrocloud.com/tools/capi-image-builder/imageconfig --output imageconfig
    ```

7.  Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. For a complete
    list of parameters, refer to the [Configuration Reference](../../config-reference.md) page. Additionally, refer to
    the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported Kubernetes versions and their
    corresponding dependencies.

    The `imageconfig` file is the file used to personalize the base CAPI image for your cluster, which you can alter to
    fit your needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS
    compliant, and more.

    Use the example configuration below to configure a Rocky 8 CAPI image. Use the SHA256 checksum of the Rocky ISO from
    step 5 of this guide for `<iso-checksum>`. Additionally, replace the VMware-related placeholders with the values
    from your VMware vSphere environment.

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

    To build a FIPS-compliant image, set `image_type` to `fips`.

    :::

    Once you are finished making changes, save and exit the file.

8.  (Optional) You can add custom Bash scripts (`.sh` files) to run before or after the build process. This feature is
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

9.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
    variable. The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware
    vSphere environment using the `image_name` defined in `imageconfig`. For this guide, the VM is named `rocky-8`. The
    tool will then generate a Rocky 8 CAPI image from the VM and save it to the `output` directory.

    Replace `<username>` with your Linux username and `<tag>` with your CAPI Image Builder version.

        <Tabs>

        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID=$(docker run --net=host --volume /home/<username>/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>)
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```bash
        BUILD_ID=$(podman run --net=host --volume /home/<username>/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>)
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
                your VMware vSphere environment. Replace `<username>` with your Linux username and `<tag>` with your CAPI Image Builder version.

                <Tabs>
                <TabItem value="Docker" label="Docker">

                 ```bash
                 BUILD_ID=$(docker run --net=host --volume /home/<username>/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>)
                 ```
                </TabItem>

                <TabItem value="Podman" label="Podman">

                 ```bash
                 BUILD_ID=$(podman run --net=host --volume /home/<username>/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:<tag>)
                 ```

                </TabItem>
                </Tabs>

            </details>

10. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. If you
    added any custom scripts in step 8, the output will be displayed in the build log.

        <Tabs>

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

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

11. Once the build is complete, the Rocky 8 CAPI image will be downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. For this example, the image is `rocky-8`. Once the image is created, the VM is
    deleted from VMware vSphere.

    Issue the command below to confirm that the build files are present in the `output` directory, replacing `rocky-8`
    with your specified `image_name`, if different.

        ```shell
        ls rocky-8
        ```

        ```text hideClipboard title="Example output"
        packer-manifest.json  rockylinux-8-kube-v1.30.4.mf  rockylinux-8-kube-v1.30.4.ovf rocky-8-disk-0.vmdk  rockylinux-8-kube-v1.30.4.ova  rocky-8.ovf rockylinux-8-kube-v1.30.4.ova.sha256
        ```

12. To make the image available in VMware vSphere, log in to your environment and locate the `vcenter_folder` defined in
    the `imageconfig` in step 7 of this guide.

    :::tip

    You can also use the following steps to make the image available in a VMware vSphere environment that is not
    connected to the one you used for building the image.

    :::

13. Right-click the folder and select **Deploy OVF Template** to deploy a VM using the Rocky 8 OVA file that was built
    in step 9 of this guide.

14. In the **Deploy OVF Template** wizard, select **Local File > Upload Files**, and choose the OVA file located in the
    `output` folder on your local machine. This guide uses `rockylinux-8-kube-v1.30.4.ova` as an example. Select
    **Next** to continue.

15. Assign a name to the virtual machine, such as `rockylinux-8-kube-v1.30.4`, and choose the folder you created
    previously as the target location. Select **Next** to proceed.

16. Choose a compute resource and select **Next**.

17. Review the VM configuration, accept the license agreements, and select **Next**.

18. Choose the storage location and network configuration and select **Next**. Then, select **Finish** to deploy the VM.

    :::warning

    It takes a while for the VM to deploy, approximately 45 minutes or more, depending on your internet connection. The
    download of the OVA file takes the majority of the time. You can monitor the progress of this process in VMware
    vSphere by looking at the **Recent Tasks** tab and filtering the **Task Name** column by `Deploy OVF Template`.

    :::

19. Once the VM is created, right-click it and select **Convert to Template**. This will convert the VM into a Rocky 8
    image template that you can reference during the cluster profile creation.

### Validate

1. Log in to the VMware vSphere environment and navigate to the **Inventory** view.

2. Select the **VMs and Templates** tab and verify the custom Rocky 8 image is available.

## Create Cluster Profile

The Rocky 8 image is now built and available in the VMware vSphere environment. You can use it to create a cluster
profile and deploy a VMware host cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).
2. From the left main menu, select **Profiles > Add Cluster Profile**.

3. In the **Basic Information** section, assign the cluster profile a **Name**, brief **Description**, and **Tags**.
   Choose **Full** for the profile **Type** and select **Next**.

4. In the **Cloud Type** section, choose **VMware vSphere** and select **Next**.

5. The **Profile Layers** section is where you specify the packs that compose the profile. For this guide, use the
   following packs.

   | Pack Name                   | Version | Layer            |
   | --------------------------- | ------- | ---------------- |
   | BYOOS                       | 1.0.0   | Operating System |
   | Palette eXtended Kubernetes | 1.30.4  | Kubernetes       |
   | Cilium                      | 1.15.3  | Network          |
   | vSphere CSI                 | 3.2.0   | Storage          |

    <!-- prettier-ignore-start -->

   Reference the custom Rocky 8 image template path in your VMware vSphere environment when populating the pack details
   for the <VersionedLink text="BYOOS" url="/integrations/packs/?pack=generic-byoi" /> layer.

    <!-- prettier-ignore-end -->

   ```yaml hideClipboard title="Example YAML configuration"
   pack:
     osImageOverride: "/Datacenter/vm/sp-docs/rockylinux-8-kube-v1.30.4"
     osName: "rockylinux"
     osVersion: "8"
   ```

   As you fill out the information for each layer, select **Next** to proceed.

   :::warning

   The Palette eXtended Kubernetes pack version must match the `k8s_version` specified in the `imageconfig` file.

   :::

6. Review the profile layers and select **Finish Configuration** to create the cluster profile.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**. Verify that your new cluster profile is available.

## Next Steps

After you have created an OS image with CAPI Image Builder and have it referenced in a cluster profile, you can deploy a
VMware host cluster using the created cluster profile. Refer to the
[Deploy App Workloads with a PCG](../../../../tutorials/clusters/pcg/deploy-app-pcg.md) tutorial for instructions on
deploying a VMware host cluster.
