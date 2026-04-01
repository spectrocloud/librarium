---
sidebar_label: "Rocky and PXK"
title: "Rocky and Palette eXtended Kubernetes"
description:
  "Learn how to build a custom Rocky with PXK image for VMware vSphere in an airgapped environment and use it to deploy
  a Kubernetes cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["operating system", "byoos", "profiles", "pxk", "vmware", "airgap"]
---

<!-- prettier-ignore-start -->
This guide teaches you how to use the [CAPI Image Builder](../../capi-image-builder.md) tool in an airgapped environment to create a custom
[Rocky Linux](https://rockylinux.org/) image with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for VMware vSphere and use the image to create a cluster profile. You can use either a Rocky Linux boot ISO or an existing Rocky Linux VM to create your image.

<!-- prettier-ignore-end -->

:::preview

:::

## Prerequisites

<Tabs groupId="image-base">

<TabItem label="Rocky ISO" value="iso">

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- An airgapped instance of
  [self-hosted Palette](../../../../self-hosted-setup/palette/supported-environments/vmware/install/install.md) or
  [Palette VerteX](../../../../self-hosted-setup/vertex/supported-environments/vmware/install/install.md) deployed in
  VMware vSphere.

- SSH access to the VMware vSphere
  [airgap support VM for self-hosted Palette](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/airgap.md)
  or [Palette Vertex](../../../../self-hosted-setup/vertex/supported-environments/vmware/setup/airgap/airgap.md).

- The following artifacts must be available in the root home directory of the airgap support VM. You can download the
  files on a system with internet access and then transfer them to your airgap environment.

  - CAPI Image Builder compressed archive file. Contact your Palette support representative to obtain the latest version
    of the tool. This guide uses version 4.6.24 as an example.

  - [Rocky Linux ISO](https://download.rockylinux.org/pub/rocky/8/isos/x86_64/Rocky-8-latest-x86_64-dvd.iso) version 8
    or 9. Ensure you download the `x86_64-dvd.iso` file and not the `x86_64-boot.iso` file, and make sure you have its
    SHA256 checksum available. This guide uses Rocky 8 as an example. Refer to the
    [Configuration Reference](../../config-reference.md) page for details on supported operating systems.

  - Airgap Kubernetes pack binary of the version for which the image will be generated. This guide uses version `1.30.4`
    as an example. Refer to the [Additional Packs](../../../../downloads/self-hosted-palette/additional-packs.md) page
    for instructions on how to download the binary. Additionally, check the supported Kubernetes versions in the
    [Compatibility Matrix](../../comp-matrix-capi-builder.md).

  - (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your Rocky image. Custom
    scripts are supported beginning with CAPI Image Builder version 4.6.23.

</TabItem>

<TabItem label="Rocky VM" value="vm">

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- An airgapped instance of
  [Palette](../../../../self-hosted-setup/palette/supported-environments/vmware/install/airgap.md) or
  [VerteX](../../../../self-hosted-setup/vertex/supported-environments/vmware/install/airgap.md) deployed in VMware
  vSphere.

- SSH access to the VMware vSphere
  [airgap support VM](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/airgap.md) used
  to deploy the airgapped instance of Palette or Vertex.

- The following artifacts must be available in the root home directory of the airgap support VM. You can download the
  files on a system with internet access and then transfer them to your airgap environment.

  - CAPI Image Builder compressed archive file. Contact your Palette support representative to obtain the latest version
    of the tool. This guide uses version 4.6.24 as an example.

  - Airgap Kubernetes pack binary of the version for which the image will be generated. This guide uses version `1.30.4`
    as an example. Refer to the [Additional Packs](../../../../downloads/self-hosted-palette/additional-packs.md) page
    for instructions on how to download the binary and upload it to your registry. Additionally, check the supported
    Kubernetes versions in the [Compatibility Matrix](../../comp-matrix-capi-builder.md).

  - (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your Rocky image. Custom
    scripts are supported beginning with CAPI Image Builder version 4.6.23.

<PartialsComponent category="capi-image-builder" name="vm-prerequisites" />

</TabItem>

</Tabs>

## Build Custom Image

<Tabs groupId="image-base">

<TabItem label="Rocky ISO" value="iso">

1.  Open a terminal window and SSH into the airgap support VM using the command below. Replace `<path-to-private-key>`
    with the path to the private SSH key, `<vm-username>` with your airgap support VM username, and
    `<airgap-vm-hostname>` with the IP address or Fully Qualified Domain Name (FQDN) of the airgap support VM (for
    example, `example-vm.palette.dev`).

    :::info

    Whether you use the IP address or FQDN depends on the hostname used when setting up your airgap support VM. If you
    used an
    [existing RHEL VM](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/rhel-vm.md) to
    set up your VM, this is always the FQDN; if you used an
    [OVA](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/rhel-vm.md), it depends on
    the hostname used when invoking the command `/bin/airgap-setup.sh <airgap-vm-hostname>`.

    :::

    ```shell
    ssh -i <path-to-private-key> <vm-username>@<airgap-vm-hostname>
    ```

2.  Switch to the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

3.  Ensure all artifacts listed in the [Prerequisites](#prerequisites) section are available in the `root` home
    directory of the airgap support VM.

    ```shell
    ls -l
    ```

    ```text hideClipboard title="Example output" {1,3,5}
    -rw-r--r-- 1 root root  183310952 Nov 17 23:59 airgap-pack-kubernetes-1.30.4.bin
    drwx------ 2 root root       4096 Jun 30 14:37 bin
    -rw-r--r-- 1 root root 3973587887 Oct 21 12:02 capi-image-builder-v4.6.24.tgz
    drwxr-xr-x 2 root root       4096 Apr 12  2024 prep
    -rw-r--r-- 1 root root 1086324736 Nov 17 22:03 rocky-8-latest-x86_64-dvd.iso
    drwx------ 3 root root       4096 Apr  1  2024 snap
    ```

4.  Upload the airgap Kubernetes pack to the airgap registry. Replace `<version>` with your Kubernetes version.

    ```shell
    chmod +x airgap-pack-kubernetes-<version>.bin && \
    ./airgap-pack-kubernetes-<version>.bin
    ```

5.  Set your CAPI Image Builder version tag as a variable. The version must match the `capi-image-builder` compressed
    TAR file.

    ```shell
    CAPI_IMAGE_BUILDER_VERSION=<capi-image-builder-version-tag>
    echo CAPI Image Builder version: $CAPI_IMAGE_BUILDER_VERSION
    ```

    ```shell title="Example output"
    CAPI Image Builder version: v4.6.24
    ```

6.  Extract the CAPI Image Builder file.

    ```shell
    tar --extract --gzip --file=capi-image-builder-$CAPI_IMAGE_BUILDER_VERSION.tgz
    ```

    The `root` home directory of your airgap support VM should now contain the following artifacts.

    ```shell
    ls -l
    ```

    ```shell hideClipboard title="Example output"
    -rw-rw-r-- 1 ubuntu ubuntu        928 Apr  8  2025 README
    -rwxr-xr-x 1 root   root    183310952 Nov 17 23:59 airgap-pack-kubernetes-1.30.4.bin
    drwx------ 2 root   root         4096 Jun 30 14:37 bin
    -rw-rw-r-- 1 ubuntu ubuntu 2471340032 May 16  2025 capi-builder-v4.6.24.tar
    -rw-r--r-- 1 root   root   3973587887 Oct 21 12:02 capi-image-builder-v4.6.24.tgz
    drwxrwxr-x 2 ubuntu ubuntu       4096 Aug 13  2024 kickstart
    drwxrwxr-x 3 ubuntu ubuntu       4096 Apr  8  2025 output
    drwxr-xr-x 2 root   root         4096 Apr 12  2024 prep
    -rw-r--r-- 1 root   root   1086324736 Nov 17 22:03 rocky-8-latest-x86_64-dvd.iso
    drwxr-xr-x 3 ubuntu ubuntu      12288 Oct 21 11:51 rpmrepo
    drwx------ 3 root   root         4096 Apr  1  2024 snap
    -rw-rw-r-- 1 ubuntu ubuntu  602989568 Apr  1  2025 yum-repo-v1.0.0.tar
    ```

7.  Update the permissions of the `output` folder to allow the CAPI Builder tool to create directories and files within
    it.

    ```shell
    chmod a+rwx output
    ```

8.  Move the Rocky Linux ISO file to the `output` folder.

    ```shell
    mv rocky-8-latest-x86_64-dvd.iso output/
    ```

9.  Copy the `ks.cfg.rocky8` or `ks.cfg.rocky9` file from the `kickstart` folder to the `output` folder as `ks.cfg`.
    Replace `<version>` with `8` or `9`, depending on the OS version of your Rocky VM.

    ```shell
    cp kickstart/ks.cfg.rocky<version> output/ks.cfg
    ```

10. Copy the `server.crt` file from the `/opt/spectro/ssl/` directory to the `rpmrepo` folder.

    ```bash
    cp /opt/spectro/ssl/server.crt rpmrepo/
    ```

11. Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. The
    `imageconfig` file is used to personalize the base CAPI image for your cluster, which you can alter to fit your
    needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS compliant, and
    more.

    The following example configuration configures a Rocky 8 CAPI image in an airgapped environment. Replace all
    VMware-related placeholders in the `Define Vmware infra details` section with values from your VMware vSphere
    environment. Additionally, replace `<airgap-vm-hostname>` with the hostname or IP address of your airgap support VM.

    For a complete list of parameters, refer to the [Configuration Reference](../../config-reference.md) page.
    Additionally, refer to the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported
    Kubernetes versions and their corresponding dependencies.

    :::warning

    If you used the airgap support VM hostname during the execution of the `airgap-setup.sh` script, ensure you enter
    the VM hostname in the `airgap_ip` parameter. The same applies if you used the VM IP address.

    :::

    ```shell
    vi ./output/imageconfig
    ```

    ```shell hideClipboard title="Example imageconfig file" {4-5,9,13,19-22,30-31,38-46,64-65}
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
     # rhel_subscription_user=
     # rhel_subscription_pass=

     # Define ISO url(if image is rhel or rockylinux)
     iso_name=rocky-8-latest-x86_64-dvd.iso
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
     airgap=true
     airgap_ip=<airgap-vm-hostname>
    ```

    :::tip

    To build a FIPS-compliant image, keep the `image_type` set to `fips`.

    :::

    Once you are finished making changes, save and exit the file.

12. (Optional) You can add custom Bash scripts (`.sh` files) to run before or after the build process. This feature is
    available beginning with CAPI Image Builder version 4.6.23. If any scripts are found in the relevant directories,
    they are copied to an Ansible playbook.

    Move any scripts that you want to be executed _before_ the build process to the `output/custom_scripts/pre`
    directory. Move any scripts that you want to be executed _after_ the build process to the
    `output/custom_scripts/post` directory. Ensure the scripts are executable.

    Below is an example of moving a pre-install script to the appropriate `pre` directory and making it executable.

    ```bash hideClipboard title="Example of moving a script and modifying permissions"
    mv sample-script.sh output/custom_scripts/pre/sample-script.sh
    chmod +x custom_scripts/pre/sample-script.sh
    ```

13. Load the CAPI Image Builder container image with the command below.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker load < capi-builder-$CAPI_IMAGE_BUILDER_VERSION.tar
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman load < capi-builder-$CAPI_IMAGE_BUILDER_VERSION.tar
        ```

        </TabItem>
        </Tabs>

14. Load the Yum container image with the command below. The Yum container is used to serve the packages required by the
    CAPI Image Builder.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker load < yum-repo-v1.0.0.tar
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman load < yum-repo-v1.0.0.tar
        ```

        </TabItem>
        </Tabs>

15. Tag the CAPI Image Builder and Yum containers.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker tag localhost/v1.0.0:latest localhost/yum-repo:v1.0.0
        docker tag localhost/$CAPI_IMAGE_BUILDER_VERSION:latest localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman tag localhost/v1.0.0:latest localhost/yum-repo:v1.0.0
        podman tag localhost/$CAPI_IMAGE_BUILDER_VERSION:latest localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
        ```

        </TabItem>
        </Tabs>

16. Confirm that both container images were loaded and tagged correctly.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                          TAG         IMAGE ID      CREATED       SIZE
        localhost/capi-builder              v4.6.24     2adff15eee2d  7 days ago    2.09GB
        localhost/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                          TAG         IMAGE ID      CREATED       SIZE
        localhost/capi-builder              v4.6.24     2adff15eee2d  7 days ago    2.09GB
        localhost/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        </Tabs>

17. Start the Yum container and assign its ID to the `BUILD_ID_YUM` variable. The following command mounts the
    `/root/rpmrepo` directory on your airgap support VM to the `/var/www/html/rpmrepo` directory of the Yum container,
    runs the container on port 9000 of your VM, and detaches the container's output from the terminal.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        BUILD_ID_YUM=$(docker run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach localhost/yum-repo:v1.0.0)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        BUILD_ID_YUM=$(podman run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach localhost/yum-repo:v1.0.0)
        ```

        </TabItem>
        </Tabs>

18. Execute the command below to visualize the Yum container logs.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID_YUM
        ```

        Monitor the output until a `Pool finished` message appears, indicating that the process was completed successfully.

        ```text hideClipboard {7}
        # Output condensed for readability
        Directory walk started
        Directory walk done - 53 packages
        Temporary output repo path: /var/www/html/rpmrepo/.repodata/
        Preparing sqlite DBs
        Pool started (with 5 workers)
        Pool finished
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID_YUM
        ```

        Monitor the output until you see a `Pool finished` message, which indicates that the process was completed successfully.

        ```text hideClipboard {7}
        # Output condensed for readability
        Directory walk started
        Directory walk done - 53 packages
        Temporary output repo path: /var/www/html/rpmrepo/.repodata/
        Preparing sqlite DBs
        Pool started (with 5 workers)
        Pool finished
        ```
        </TabItem>
        </Tabs>

19. Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
    variable. This command starts the container on the same network as your airgap support VM, mounts the `/root/output`
    directory of your VM to the `/home/imagebuilder/output` directory of the CAPI Image Builder container, and detaches
    the container's output from the terminal.

    The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware vSphere
    environment using the `image_name` defined in `imageconfig`. The tool will then generate a Rocky image from the VM
    and save it to the `output` directory.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```bash
        BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>
        </Tabs>

    If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

        <details>
        <summary>CAPI Image Builder with Static IP Placement </summary>

        1. Open the `ks.cfg` file located in the output folder. Find and replace the network line
            `network --bootproto=dhcp --onboot=on --ipv6=auto --activate --hostname=capv.vm` with the configuration below.

            ```text
            network --bootproto=static --ip=<vcenter-static-ip-address> --netmask=<vcenter-netmask> --gateway=<vcenter-gateway> --nameserver=<vcenter-nameserver>
            ```

            Replace `<vcenter-static-ip-address>` with a valid IP address from your VMware vSphere environment and
            `<vcenter-netmask>`, `<vcenter-gateway>`, and `<vcenter-nameserver>` with the correct values from your VMware vSphere
            environment. The `<vcenter-netmask>` parameter must be specified in dotted decimal notation, for example, `--netmask=255.255.255.0`.

            Once you are finished making changes, save and exit the file.

        2.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
            variable. This command starts the container on the same network as your airgap support VM, mounts the `/root/output`
            directory of your VM to the `/home/imagebuilder/output` directory of the CAPI Image Builder container, and detaches
            the container's output from the terminal.

            The tool will use the `imageconfig` file to create and configure a VM with static IP placement in
            your VMware vSphere environment.

            <Tabs groupId="container-tech">
            <TabItem value="Docker" label="Docker">

             ```bash
             BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
             ```
            </TabItem>

            <TabItem value="Podman" label="Podman">

             ```bash
             BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
             ```

            </TabItem>
            </Tabs>

        </details>

20. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. If you
    added any custom scripts in step 11, the output will be displayed in the build log.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID_CAPI
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID_CAPI
        ```

        </TabItem>

        </Tabs>

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

21. Once the build is complete, the Rocky CAPI image is downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. Issue the following command to confirm that the build files are present in the
    `output` directory.

        ```shell
        ls -l output/<image_name>
        ```

        ```shell hideClipboard title="Example output"
        -rw-r--r-- 1 ubuntu ubuntu       1203 Nov 18 02:48 packer-manifest.json
        -rw-r--r-- 1 ubuntu ubuntu 3571576320 Nov 18 02:48 rocky-8-disk-0.vmdk
        -rw-r--r-- 1 ubuntu ubuntu       9507 Nov 18 02:48 rocky-8.ovf
        -rw-r--r-- 1 ubuntu ubuntu        212 Nov 18 02:48 rockylinux-8-kube-v1.30.4.mf
        -rw-r--r-- 1 ubuntu ubuntu 3571630080 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova
        -rw-r--r-- 1 ubuntu ubuntu         64 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova.sha256
        -rw-r--r-- 1 ubuntu ubuntu      41044 Nov 18 02:48 rockylinux-8-kube-v1.30.4.ovf
        ```

22. <PartialsComponent category="capi-image-builder" name="ssh-vm" />

23. Enter a **VM template name**, choose a location for the template, and select **Next**.

    :::info

    The name and location do not have to match those defined in the `imageconfig` file. The same applies to the
    remaining locations and resources specified in the following steps.

    :::

24. Choose a compute resource and select **Next**.

25. Choose a storage location and select **Next**.

26. Review your template configurations and select **Finish** to convert the VM into a Rocky image template that you can
    reference while creating your cluster profile.

</TabItem>

<TabItem label="Rocky VM" value="vm">

1.  Open a terminal window and SSH into the airgap support VM using the command below. Replace `<path-to-private-key>`
    with the path to the private SSH key, `<vm-username>` with your airgap support VM username, and
    `<airgap-vm-hostname>` with the IP address or Fully Qualified Domain Name (FQDN) of the airgap support VM (for
    example, `example-vm.palette.dev`).

    :::info

    Whether you use the IP address or FQDN depends on the hostname used when setting up your airgap support VM. If you
    used an
    [existing RHEL VM](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/rhel-vm.md) to
    set up your VM, this is always the FQDN; if you used an
    [OVA](../../../../self-hosted-setup/palette/supported-environments/vmware/setup/airgap/ova.md), it depends on the
    hostname used when invoking the command `/bin/airgap-setup.sh <airgap-vm-hostname>`.

    :::

    ```shell
    ssh -i <path-to-private-key> <vm-username>@<airgap-vm-hostname>
    ```

2.  Switch to the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

3.  Ensure all artifacts listed in the [Prerequisites](#prerequisites) section are available in the `root` home
    directory of the airgap support VM.

    ```shell
    ls -l
    ```

    ```text hideClipboard title="Example output" {1,3}
    -rw-r--r-- 1 root root  183310952 Nov 17 23:59 airgap-pack-kubernetes-1.30.4.bin
    drwx------ 2 root root       4096 Jun 30 14:37 bin
    -rw-r--r-- 1 root root 3973587887 Oct 21 12:02 capi-image-builder-v4.6.24.tgz
    drwxr-xr-x 2 root root       4096 Apr 12  2024 prep
    drwx------ 3 root root       4096 Apr  1  2024 snap
    ```

4.  Upload the airgap Kubernetes pack to the airgap registry. Replace `<version>` with your Kubernetes version.

    ```shell
    chmod +x airgap-pack-kubernetes-<version>.bin && \
    ./airgap-pack-kubernetes-<version>.bin
    ```

5.  Set your CAPI Image Builder version tag as a variable. The version must match the `capi-image-builder` compressed
    TAR file.

    ```shell
    CAPI_IMAGE_BUILDER_VERSION=<capi-image-builder-version-tag>
    echo CAPI Image Builder version: $CAPI_IMAGE_BUILDER_VERSION
    ```

    ```shell title="Example output"
    CAPI Image Builder version: v4.6.24
    ```

6.  Extract the CAPI Image Builder file.

    ```shell
    tar --extract --gzip --file=capi-image-builder-$CAPI_IMAGE_BUILDER_VERSION.tgz
    ```

    The `root` home directory of your airgap support VM should now contain the following artifacts.

    ```shell
    ls -l
    ```

    ```shell hideClipboard title="Example output"
    -rw-rw-r-- 1 ubuntu ubuntu        928 Apr  8  2025 README
    -rwxr-xr-x 1 root   root    183310952 Nov 17 23:59 airgap-pack-kubernetes-1.30.4.bin
    drwx------ 2 root   root         4096 Jun 30 14:37 bin
    -rw-rw-r-- 1 ubuntu ubuntu 2471340032 May 16  2025 capi-builder-v4.6.24.tar
    -rw-r--r-- 1 root   root   3973587887 Oct 21 12:02 capi-image-builder-v4.6.24.tgz
    drwxrwxr-x 2 ubuntu ubuntu       4096 Aug 13  2024 kickstart
    drwxrwxr-x 3 ubuntu ubuntu       4096 Apr  8  2025 output
    drwxr-xr-x 2 root   root         4096 Apr 12  2024 prep
    drwxr-xr-x 3 ubuntu ubuntu      12288 Oct 21 11:51 rpmrepo
    drwx------ 3 root   root         4096 Apr  1  2024 snap
    -rw-rw-r-- 1 ubuntu ubuntu  602989568 Apr  1  2025 yum-repo-v1.0.0.tar
    ```

7.  Update the permissions of the `output` folder to allow the CAPI Builder tool to create directories and files within
    it.

    ```shell
    chmod a+rwx output
    ```

8.  Copy the `ks.cfg.rocky8` or `ks.cfg.rocky9` file from the `kickstart` folder to the `output` folder as `ks.cfg`.
    Replace `<version>` with `8` or `9`, depending on the OS version of your Rocky VM.

    ```shell
    cp kickstart/ks.cfg.rocky<version> output/ks.cfg
    ```

9.  Copy the `server.crt` file from the `/opt/spectro/ssl/` directory to the `rpmrepo` folder.

    ```bash
    cp /opt/spectro/ssl/server.crt rpmrepo/
    ```

10. Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. The
    `imageconfig` file is used to personalize the base CAPI image for your cluster, which you can alter to fit your
    needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS compliant, and
    more.

    The following example configuration configures a Rocky 8 CAPI image from an existing Rocky 8 VM in VMware vSphere.
    Replace all VMware-related placeholders in the `Define Vmware infra details` section with values from your VMware
    vSphere environment. Additionally, for `vcenter_template`, enter the full datacenter path to the Rocky VM that you
    want to use as a base for your CAPI image. Replace `<airgap-vm-hostname>` with the hostname or IP address of your
    airgap support VM.

    For a complete list of parameters, refer to the [Configuration Reference](../../config-reference.md) page.
    Additionally, refer to the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported
    Kubernetes versions and their corresponding dependencies.

    :::warning

    If you used the airgap support VM hostname during the execution of the `airgap-setup.sh` script, ensure you enter
    the VM hostname in the `airgap_ip` parameter. The same applies if you used the VM IP address.

    :::

    ```shell
    vi ./output/imageconfig
    ```

    ```shell hideClipboard title="Example imageconfig file" {4-5,9,13,19-22,38-46,49,64-65}
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
     # rhel_subscription_user=
     # rhel_subscription_pass=

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
     airgap=true
     airgap_ip=<airgap-vm-hostname>
    ```

    :::tip

    To build a FIPS-compliant image, keep the `image_type` set to `fips`.

    :::

    Once you are finished making changes, save and exit the file.

11. (Optional) You can add custom Bash scripts (`.sh` files) to run before or after the build process. This feature is
    available beginning with CAPI Image Builder version 4.6.23. If any scripts are found in the relevant directories,
    they are copied to an Ansible playbook.

    Move any scripts that you want to be executed _before_ the build process to the `output/custom_scripts/pre`
    directory. Move any scripts that you want to be executed _after_ the build process to the
    `output/custom_scripts/post` directory. Ensure the scripts are executable.

    Below is an example of moving a pre-install script to the appropriate `pre` directory and making it executable.

    ```bash hideClipboard title="Example of moving a script and modifying permissions"
    mv sample-script.sh output/custom_scripts/pre/sample-script.sh
    chmod +x custom_scripts/pre/sample-script.sh
    ```

12. Load the CAPI Image Builder container image with the command below.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker load < capi-builder-$CAPI_IMAGE_BUILDER_VERSION.tar
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman load < capi-builder-$CAPI_IMAGE_BUILDER_VERSION.tar
        ```

        </TabItem>
        </Tabs>

13. Load the Yum container image with the command below. The Yum container is used to serve the packages required by the
    CAPI Image Builder.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker load < yum-repo-v1.0.0.tar
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman load < yum-repo-v1.0.0.tar
        ```

        </TabItem>
        </Tabs>

14. Tag the CAPI Image Builder and Yum containers.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker tag localhost/v1.0.0:latest localhost/yum-repo:v1.0.0
        docker tag localhost/$CAPI_IMAGE_BUILDER_VERSION:latest localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman tag localhost/v1.0.0:latest localhost/yum-repo:v1.0.0
        podman tag localhost/$CAPI_IMAGE_BUILDER_VERSION:latest localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
        ```

        </TabItem>
        </Tabs>

15. Confirm that both container images were loaded and tagged correctly.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                          TAG         IMAGE ID      CREATED       SIZE
        localhost/capi-builder              v4.6.24     2adff15eee2d  7 days ago    2.09GB
        localhost/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                          TAG         IMAGE ID      CREATED       SIZE
        localhost/capi-builder              v4.6.24     2adff15eee2d  7 days ago    2.09GB
        localhost/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        </Tabs>

16. Start the Yum container and assign its ID to the `BUILD_ID_YUM` variable. The following command mounts the
    `/root/rpmrepo` directory on your airgap support VM to the `/var/www/html/rpmrepo` directory of the Yum container,
    runs the container on port 9000 of your VM, and detaches the container's output from the terminal.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        BUILD_ID_YUM=$(docker run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach localhost/yum-repo:v1.0.0)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        BUILD_ID_YUM=$(podman run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach localhost/yum-repo:v1.0.0)
        ```

        </TabItem>
        </Tabs>

17. Execute the command below to visualize the Yum container logs.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID_YUM
        ```

        Monitor the output until a `Pool finished` message appears, indicating that the process was completed successfully.

        ```text hideClipboard {7}
        # Output condensed for readability
        Directory walk started
        Directory walk done - 53 packages
        Temporary output repo path: /var/www/html/rpmrepo/.repodata/
        Preparing sqlite DBs
        Pool started (with 5 workers)
        Pool finished
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID_YUM
        ```

        Monitor the output until you see a `Pool finished` message, which indicates that the process was completed successfully.

        ```text hideClipboard {7}
        # Output condensed for readability
        Directory walk started
        Directory walk done - 53 packages
        Temporary output repo path: /var/www/html/rpmrepo/.repodata/
        Preparing sqlite DBs
        Pool started (with 5 workers)
        Pool finished
        ```
        </TabItem>
        </Tabs>

18. Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
    variable. This command starts the container on the same network as your airgap support VM, mounts the `/root/output`
    directory of your VM to the `/home/imagebuilder/output` directory of the CAPI Image Builder container, and detaches
    the container's output from the terminal.

    The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware vSphere
    environment using the `image_name` defined in `imageconfig`. The tool will then generate a Rocky image from the VM
    and save it to the `output` directory.

        <Tabs groupId="container-tech">
        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```bash
        BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach localhost/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
        ```

        </TabItem>
        </Tabs>

    If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

        <details>
        <summary>CAPI Image Builder with Static IP Placement </summary>

        1. Open the `ks.cfg` file located in the output folder. Find and replace the network line
            `network --bootproto=dhcp --onboot=on --ipv6=auto --activate --hostname=capv.vm` with the configuration below.

            ```text
            network --bootproto=static --ip=<vcenter-static-ip-address> --netmask=<vcenter-netmask> --gateway=<vcenter-gateway> --nameserver=<vcenter-nameserver>
            ```

            Replace `<vcenter-static-ip-address>` with a valid IP address from your VMware vSphere environment and
            `<vcenter-netmask>`, `<vcenter-gateway>`, and `<vcenter-nameserver>` with the correct values from your VMware vSphere
            environment. The `<vcenter-netmask>` parameter must be specified in dotted decimal notation, for example, `--netmask=255.255.255.0`.

            Once you are finished making changes, save and exit the file.

        2.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
            variable. This command starts the container on the same network as your airgap support VM, mounts the `/root/output`
            directory of your VM to the `/home/imagebuilder/output` directory of the CAPI Image Builder container, and detaches
            the container's output from the terminal.

            The tool will use the `imageconfig` file to create and configure a VM with static IP placement in
            your VMware vSphere environment.

            <Tabs groupId="container-tech">
            <TabItem value="Docker" label="Docker">

             ```bash
             BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
             ```
            </TabItem>

            <TabItem value="Podman" label="Podman">

             ```bash
             BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)
             ```

            </TabItem>
            </Tabs>

        </details>

19. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. If you
    added any custom scripts in step 11, the output will be displayed in the build log.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID_CAPI
        ```

        </TabItem>

        <TabItem value="Podman" label="Podman">

        ```shell
        podman logs --follow $BUILD_ID_CAPI
        ```

        </TabItem>

        </Tabs>

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

20. Once the build is complete, the Rocky CAPI image is downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. Issue the following command to confirm that the build files are present in the
    `output` directory.

        ```shell
        ls -l output/<image_name>
        ```

        ```shell hideClipboard title="Example output"
        -rw-r--r-- 1 ubuntu ubuntu       1203 Nov 18 02:48 packer-manifest.json
        -rw-r--r-- 1 ubuntu ubuntu 3571576320 Nov 18 02:48 rocky-8-disk-0.vmdk
        -rw-r--r-- 1 ubuntu ubuntu       9507 Nov 18 02:48 rocky-8.ovf
        -rw-r--r-- 1 ubuntu ubuntu        212 Nov 18 02:48 rockylinux-8-kube-v1.30.4.mf
        -rw-r--r-- 1 ubuntu ubuntu 3571630080 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova
        -rw-r--r-- 1 ubuntu ubuntu         64 Nov 18 02:49 rockylinux-8-kube-v1.30.4.ova.sha256
        -rw-r--r-- 1 ubuntu ubuntu      41044 Nov 18 02:48 rockylinux-8-kube-v1.30.4.ovf
        ```

21. <PartialsComponent category="capi-image-builder" name="ssh-vm" />

22. Enter a **VM template name**, choose a location for the template, and select **Next**.

    :::info

    The name and location do not have to match those defined in the `imageconfig` file. The same applies to the
    remaining locations and resources specified in the following steps.

    :::

23. Choose a compute resource and select **Next**.

24. Choose a storage location and select **Next**.

25. Review your template configurations and select **Finish** to convert the VM into a Rocky image template that you can
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
[Create and Manage VMware Clusters](../../../../clusters/data-center/vmware/create-manage-vmware-clusters.md) guide for
instructions on deploying a VMware host cluster.
