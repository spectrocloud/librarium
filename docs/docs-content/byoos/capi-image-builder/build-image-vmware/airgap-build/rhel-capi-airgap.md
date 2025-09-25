---
sidebar_label: "RHEL and PXK"
title: "RHEL and Palette eXtended Kubernetes"
description:
  "Learn how to build a custom RHEL with PXK image for VMware vSphere in an airgapped environment and use it to deploy a
  Kubernetes cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["operating system", "byoos", "profiles", "pxk", "vmware", "airgap"]
---

<!-- prettier-ignore-start -->

This guide teaches you how to use the [CAPI Image Builder](../../capi-image-builder.md) tool in an airgapped environment to create a custom [Red Hat Enterprise Linux (RHEL)](https://developers.redhat.com/) image with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for VMware vSphere and use the image to create a cluster profile.

<!-- prettier-ignore-end -->

:::preview

:::

## Prerequisites

- Access to the VMware vSphere environment, including credentials and permission to create virtual machines.

- A valid [RHEL subscription](https://www.redhat.com/en/store/linux-platforms) and access to the
  [Red Hat Developer Portal](https://developers.redhat.com/products/rhel/download).

- An airgapped instance of
  [Palette](../../../../enterprise-version/install-palette/install-on-vmware/airgap-install/install.md) or
  [VerteX](../../../../vertex/install-palette-vertex/install-on-vmware/airgap-install/install.md) deployed in VMware
  vSphere.

- SSH access to the VMware vSphere
  [airgap support VM](../../../../enterprise-version/install-palette/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions.md)
  used to deploy the airgapped instance of Palette or Vertex.

- The following artifacts must be available in the root home directory of the airgap support VM. You can download the
  files on a system with internet access and then transfer them to your airgap environment.

  - CAPI Image Builder compressed archive file. Contact your Palette support representative to obtain the latest version
    of the tool. This guide uses version 4.6.23 as an example.

  - [RHEL ISO](https://developers.redhat.com/products/rhel/download) version `8.8`. Ensure you download the
    `x86_64-dvd.iso` file and not the `x86_64-boot.iso` file, and make sure you have its SHA256 checksum available. This
    guide uses RHEL 8.8 as an example. Refer to the [Configuration Reference](../../config-reference.md) page for
    details on supported operating systems.

  - Airgap Kubernetes pack binary of the version for which the image will be generated. This guide uses version `1.30.5`
    as an example. Refer to the [Additional Packs](../../../../downloads/self-hosted-palette/additional-packs.md) page
    for instructions on how to download the binary. Additionally, check the supported Kubernetes versions in the
    [Compatibility Matrix](../../comp-matrix-capi-builder.md).

  - (Optional) Any custom Bash scripts (`.sh` files) that you want to execute when creating your RHEL image. Custom
    scripts are supported beginning with CAPI Image Builder version 4.6.23.

## Build Custom Image

1.  Open a terminal window and SSH into the airgap support VM using the command below. Replace `<path-to-private-key>`
    with the path to the private SSH key, `<vm-username>` with your airgap support VM username, and
    `<airgap-vm-hostname>` with the IP address or Fully Qualified Domain Name (FQDN) of the airgap support VM (for
    example, `example-vm.palette.dev`).

    :::info

    Whether you use the IP address or FQDN depends on the hostname used when setting up your airgap support VM. If you
    used an
    [existing RHEL VM](../../../../enterprise-version/install-palette/install-on-vmware/airgap-install/environment-setup/env-setup-vm.md)
    to set up your VM, this is always the FQDN; if you used an
    [OVA](../../../../enterprise-version/install-palette/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions.md),
    it depends on the hostname used when invoking the command `/bin/airgap-setup.sh <airgap-vm-hostname>`.

    :::

    ```shell
    ssh -i <path-to-private-key> <vm-username>@<airgap-vm-hostname>
    ```

2.  Switch to the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

3.  Set your CAPI Image Builder version tag as a variable.

    ```shell
    CAPI_IMAGE_BUILDER_VERSION=<capi-image-builder-version-tag>
    echo CAPI Image Builder version: $CAPI_IMAGE_BUILDER_VERSION
    ```

    ```shell title="Example output"
    CAPI Image Builder version: v4.6.23
    ```

4.  Ensure all artifacts listed in the [Prerequisites](#prerequisites) section are available in the `root` home
    directory of the airgap support VM.

    ```shell
    ls
    ```

    ```text hideClipboard title="Example output"
    airgap-pack-kubernetes-1.30.5.bin  bin  capi-image-builder-v4.6.23.tgz  prep
    rhel-8.8-x86_64-dvd.iso  snap
    ```

    :::warning

    The following steps use the preceding file names as an example. Adjust the commands if your artifacts have different
    names.

    :::

5.  Extract the CAPI Image Builder file.

    ```shell
    tar --extract --gzip --file=capi-image-builder-$CAPI_IMAGE_BUILDER_VERSION.tgz
    ```

    The `root` home directory of your airgap support VM should now contain the following artifacts.

    ```shell
    ls
    ```

    ```shell hideClipboard title="Example output"
    README  airgap-pack-kubernetes-1.30.5.bin  bin  capi-builder-v4.6.23.tar
    capi-image-builder-v4.6.23.tgz  kickstart  output  prep  rhel-8.8-x86_64-dvd.iso
    rpmrepo  snap  yum-repo-v1.0.0.tar
    ```

6.  Update the permissions of the `output` folder to allow the CAPI Image Builder tool to create directories and files
    within it.

    ```shell
    chmod a+rwx output
    ```

7.  Move the RHEL ISO file to the `output` folder.

    ```shell
    mv rhel-8.8-x86_64-dvd.iso output/
    ```

8.  Copy the `ks.cfg.rhel8` file from the `kickstart` folder to the `output` folder as `ks.cfg`.

    ```shell
    cp kickstart/ks.cfg.rhel8 output/ks.cfg
    ```

9.  Copy the `server.crt` file from the `/opt/spectro/ssl/` directory to the `rpmrepo` folder.

    ```bash
    cp /opt/spectro/ssl/server.crt rpmrepo/
    ```

10. Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. This example
    uses Vi.

    The `imageconfig` file is the file used to personalize the base CAPI image for your cluster, which you can alter to
    fit your needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS
    compliant, and more.

    Use the example configuration below to build a RHEL 8 CAPI image in an airgapped environment. Replace
    `<rhel-subscription-email>` and `<rhel-subscription-password>` with your RHEL subscription credentials if your CAPI
    Image Builder version is earlier than `4.6.0`. Replace `<iso-checksum>` with the RHEL ISO checksum. Update the
    VMware-related placeholders with the values from your VMware vSphere environment. Additionally, replace
    `<airgap-vm-hostname>` with the hostname or IP address of your airgap support VM.

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

    ```shell hideClipboard title="Example imageconfig file" {4-5,9,13,19-22,26-27,30-31,38-46,64-65}
     # Define the OS type and version here
     # os_version=rhel-8 | rhel-9 | rockylinux-8 | rockylinux-9
     # image_type=standard | fips
     os_version=rhel-8
     image_type=standard

     # Define the image name
     # image_name=<Final Image Name to create>
     image_name=rhel-8

     # Define the Cloud type
     # cloud_type=vmware
     cloud_type=vmware

     # Define the Component Versions
     #
     # containerd crictl and cni version update should be done
     #   only if the images are available in the upstream repositories
     k8s_version=1.30.5
     cni_version=1.3.0
     containerd_version=1.7.13
     crictl_version=1.28.0

     # Define RHEL subscription credentials(if $image_type=rhel)
     # used while image creation to use package manager
     rhel_subscription-user=<rhel-subscription-email-if-CAPI-version-is-earlier-than-4.6.0>
     rhel_subscription_pass=<rhel-subscription-password-if-CAPI-version-is-earlier-than-4.6.0>

     # Define ISO url(if image is rhel or rockylinux)
     iso_name=rhel-8.8-x86_64-dvd.iso
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

    To build a FIPS-compliant image, set `image_type` to `fips`.

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

        <Tabs>
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

        <Tabs>
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

14. Confirm that both container images were loaded correctly.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```shell
        docker images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                                                          TAG         IMAGE ID      CREATED       SIZE
        us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder  v4.6.23     2adff15eee2d  7 days ago    2.47 GB
        gcr.io/spectro-images-public/imagebuilder/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman images
        ```
        ```text hideClipboard title="Example output"
        REPOSITORY                                                          TAG         IMAGE ID      CREATED       SIZE
        us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder  v4.6.23     2adff15eee2d  7 days ago    2.47 GB
        gcr.io/spectro-images-public/imagebuilder/yum-repo                  v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        </Tabs>

15. Start the Yum container and assign its ID to the `BUILD_ID_YUM` variable. The following command mounts the
    `/root/rpmrepo` directory on your airgap support VM to the `/var/www/html/rpmrepo` directory of the Yum container,
    runs the container on port 9000 of your VM, and detaches the container's output from the terminal.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```shell
        BUILD_ID_YUM=$(docker run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach gcr.io/spectro-images-public/imagebuilder/yum-repo:v1.0.0)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        BUILD_ID_YUM=$(podman run --volume /root/rpmrepo:/var/www/html/rpmrepo --publish 9000:80 --detach gcr.io/spectro-images-public/imagebuilder/yum-repo:v1.0.0)
        ```

        </TabItem>
        </Tabs>

16. Execute the command below to visualize the Yum container logs.

        <Tabs>
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

17. Issue the following command to upload the airgap Kubernetes pack to the airgap registry.

    ```shell
    chmod +x airgap-pack-kubernetes-1.30.5.bin && \
    ./airgap-pack-kubernetes-1.30.5.bin
    ```

18. Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
    variable. This command starts the container on the same network as your airgap support VM, mounts the `/root/output`
    directory of your VM to the `/home/imagebuilder/output` directory of the CAPI Image Builder container, and detaches
    the container's output from the terminal.

    The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware vSphere
    environment using the `image_name` defined in `imageconfig`. For this guide, the VM is named `rhel-8`. The tool will
    then generate a RHEL 8 CAPI image from the VM and save it to the `output` directory.

        <Tabs>
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

    If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

        <details>
        <summary>CAPI Image Builder with Static IP Placement </summary>

        1. Open the `ks.cfg` file located in the output folder. Locate and replace the network lines
            `network --bootproto=dhcp --device=link --activate` and `network --hostname=rhel8` with the configuration below.

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

            <Tabs>
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

        <Tabs>

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

20. Once the build is complete, the RHEL 8 CAPI image will be downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. For this example, the image is `rhel-8`. Once the image is created, the VM is
    deleted from VMware vSphere.

    Issue the command below to confirm that the build files are present in the `output` directory, replacing `rhel-8`
    with your specified `image_name`, if different.

        ```shell
        ls output/rhel-8
        ```

        ```text hideClipboard title="Example output"
        packer-manifest.json  rhel-8-kube-v1.30.5.mf  rhel-8-kube-v1.30.5.ova.sha256  rhel-8.ovf rhel-8-disk-0.vmdk  rhel-8-kube-v1.30.5.ova  rhel-8-kube-v1.30.5.ovf
        ```

21. Copy the `rhel-8-kube-v1.30.5.ova` file to the home directory of the airgap support VM. Replace `<vm-username>` with
    your airgap support VM username.

    ```shell
    cp /root/output/rhel-8/rhel-8-kube-v1.30.5.ova /home/<vm-username>/
    ```

    Next, open a new terminal window on your local machine and use the `scp` command to copy the
    `rhel-8-kube-v1.30.5.ova` file. Replace `<path-to-private-key>` with the path to the private SSH key,
    `<vm-username>` with your airgap support VM username, and `<airgap-vm-hostname>` with the IP address or hostname of
    the airgap support VM.

    ```shell
    scp -i <path-to-private-key> <vm-username>@<airgap-vm-hostname>:/home/<vm-username>/rhel-8-kube-v1.30.5.ova .
    ```

22. To make the image available in VMware vSphere, log in to your environment and locate the `vcenter_folder` you
    defined in step 10 of this guide.

    :::tip

    You can also use the following steps to make the image available in a VMware vSphere environment that is not
    connected to the one you used for building the image.

    :::

23. Right-click the folder and select **Deploy OVF Template** to deploy a VM using the RHEL 8 OVA file that was built in
    step 18 of this guide.

24. In the **Deploy OVF Template** wizard, select **Local File > Upload Files**, and choose the OVA file located in the
    `output` folder on your local machine. This guide uses `rhel-8-kube-v1.30.5.ova` as an example. Select **Next** to
    continue.

25. Assign a name to the virtual machine, such as `rhel-8-kube-v1.30.5`, and choose the folder you created previously as
    the target location. Select **Next** to proceed.

26. Choose a compute resource and select **Next**.

27. Review the VM configuration, accept the license agreements, and select **Next**.

28. Choose the storage location and network configuration and select **Next**. Then, select **Finish** to deploy the VM.

    :::warning

    It takes a while for the VM to deploy, approximately 45 minutes or more, depending on your internet connection. The
    download of the OVA file takes the majority of the time. You can monitor the progress of this process in VMware
    vSphere by looking at the **Recent Tasks** tab and filtering the **Task Name** column by `Deploy OVF Template`.

    :::

29. Once the VM is created, right-click it and select **Convert to Template**. This will convert the VM into a RHEL 8
    image template that you can reference during the cluster profile creation.

### Validate

1. Log in to the VMware vSphere environment and navigate to the **Inventory** view.

2. Select the **VMs and Templates** tab and verify the custom RHEL 8 image is available.

## Create Cluster Profile

The RHEL 8 image is now built and available in the VMware vSphere environment. You can use it to create a cluster
profile and deploy a VMware vSphere host cluster.

1. Log in to your airgapped instance of Palette or VerteX.

2. From the left main menu, select **Profiles > Add Cluster Profile**.

3. In the **Basic Information** section, assign the cluster profile a **Name**, brief **Description**, and **Tags**.
   Choose **Full** for the profile **Type** and select **Next**.

4. In the **Cloud Type** section, choose **VMware vSphere** and select **Next**.

5. The **Profile Layers** section is where you specify the packs that compose the profile. For this guide, use the
   following packs.

   | Pack Name                   | Version | Layer            |
   | --------------------------- | ------- | ---------------- |
   | BYOOS                       | 1.0.0   | Operating System |
   | Palette eXtended Kubernetes | 1.30.5  | Kubernetes       |
   | Cilium                      | 1.15.3  | Network          |
   | vSphere CSI                 | 3.2.0   | Storage          |

    <!-- prettier-ignore-start -->

   Reference the custom RHEL 8 image template path in your VMware vSphere environment when populating the pack details
   for the <VersionedLink text="BYOOS" url="/integrations/packs/?pack=generic-byoi" /> layer.

    <!-- prettier-ignore-end -->

   ```yaml hideClipboard title="Example YAML configuration"
   pack:
     osImageOverride: "/Datacenter/vm/sp-docs/rhel-8-kube-v1.30.5"
     osName: "rhel"
     osVersion: "8"
   ```

   As you fill out the information for each layer, select **Next** to proceed.

   :::warning

   The Palette eXtended Kubernetes pack version must match the `k8s_version` specified in the `imageconfig` file.

   :::

6. Review the profile layers and select **Finish Configuration** to create the cluster profile.

### Validate

1. Log in to your airgapped instance of Palette or VerteX.

2. From the left main menu, select **Profiles**. Verify that your new cluster profile is available.

## Next Steps

After you have created an OS image with CAPI Image Builder and have it referenced in a cluster profile, you can deploy a
VMware host cluster using the created cluster profile. Refer to the
[Create and Manage VMware Clusters](../../../../clusters/data-center/vmware/create-manage-vmware-clusters.md) guide for
instructions on deploying a VMware host cluster.
