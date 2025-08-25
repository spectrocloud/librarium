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

<!-- prettier-ignore -->
This guide teaches you how to use the [CAPI Image Builder](../../capi-image-builder.md) tool in an airgapped environment to create a custom Red Hat
Enterprise Linux (RHEL) image with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for clusters that target VMware vSphere.

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
  utilized to deploy the airgapped instance of Palette or Vertex.

- The following artifacts must be available in the root home directory of the airgap support VM. You can download the
  files in a system with internet access and then transfer them to your airgap environment.

  - CAPI Image Builder compressed archive file. Contact your Palette support representative to obtain the latest version
    of the tool. This guide uses version 4.6.23 as an example.

  - [RHEL ISO](https://developers.redhat.com/products/rhel/download) version `8.8`. Ensure you download the
    `x86_64-dvd.iso` file and not the `x86_64-boot.iso` file, and make sure you have its SHA256 checksum available. This
    guide uses RHEL 8.8 as an example. Refer to the [Configuration Reference](../../config-reference.md) page for
    details on supported operating systems.
  - Airgap Kubernetes pack binary of the version for which the image will be generated. This guide uses version `1.28.9`
    as an example. Refer to the
    [Additional Packs](../../../../enterprise-version/install-palette/airgap/supplemental-packs.md) page for
    instructions on how to download the binary. Additionally, check the supported Kubernetes versions in the
    [Compatibility Matrix](../../comp-matrix-capi-builder.md).

## Build Custom Image

1.  Open a terminal window and SSH into the airgap support VM using the command below. Replace `/path/to/private_key`
    with the path to the private SSH key and `palette.example.com` with the IP address or hostname of the airgap support
    VM.

    ```shell
    ssh -i /path/to/private_key ubuntu@palette.example.com
    ```

2.  Switch to the `root` user account to complete the remaining steps.

    ```shell
    sudo --login
    ```

3.  Ensure all the artifacts listed in the [Prerequisites](#prerequisites) section are available in the root home
    directory of the airgap support VM.

    ```shell
    ls
    ```

    ```text hideClipboard
    airgap-pack-kubernetes-1.28.9.bin  bin  capi-image-builder-v4.4.4.tgz  prep  rhel-8.8-x86_64-dvd.iso  snap
    ```

    :::warning

    The following steps will use these file names as an example. Adjust the commands if you downloaded the artifacts
    with different names.

    :::

4.  Extract the CAPI Image Builder file.

    ```shell
    tar --extract --gzip --file=capi-image-builder-v4.4.4.tgz
    ```

5.  Update the permissions of the `output` folder to allow the CAPI Builder tool to create directories and files within
    it.

    ```shell
    chmod a+rwx output
    ```

6.  Move the RHEL ISO file to the `output` folder.

    ```shell
    mv rhel-8.8-x86_64-dvd.iso output/
    ```

7.  Copy the `ks.cfg.rhel8` file from the `kickstart` folder to the `output` folder as `ks.cfg`.

    ```shell
    cp kickstart/ks.cfg.rhel8 output/ks.cfg
    ```

8.  Copy the `server.crt` file from the `/opt/spectro/ssl/` directory to the `rpmrepo` folder.

    ```bash
    cp /opt/spectro/ssl/server.crt rpmrepo/
    ```

9.  Open the `imageconfig` template file located in the `output` folder and fill in the required parameters. For a
    complete list of parameters, refer to the [Configuration Reference](../../config-reference.md) page. Additionally,
    refer to the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported Kubernetes versions
    and their corresponding dependencies.

    The `imageconfig` is the file you use to set up the CAPI Image Builder according to your requirements. This includes
    specifying the OS type, Kubernetes version, whether the image should be FIPS compliant, and more.

    Use the example configuration below for building a RHEL 8 CAPI image in an airgapped environment. Replace
    `<rhel-subscription-email>` and `<rhel-subscription-password>` with your RHEL subscription credentials. Replace
    `<iso-checksum>` with the RHEL ISO checksum. Update the VMware-related placeholders with the values from your VMware
    vSphere environment. Additionally, replace `<airgap-vm-hostname>` with the hostname or IP address of your airgap
    support VM.

    :::warning

    If you used the airgap support VM hostname during the execution of the `airgap-setup.sh` script, ensure to enter the
    VM hostname in the `airgap_ip` parameter. The same applies if you used the VM IP address.

    :::

    ```text {4-5,9,13,19-22,26-27,30-31,38-46,64-65}
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
     k8s_version=1.28.9
     cni_version=1.2.0
     containerd_version=1.7.13
     crictl_version=1.26.0

     # Define RHEL subscription credentials(if $image_type=rhel)
     # used while image creation to use package manager
     rhel_subscripocky-8user='<rhel-subscription-email>'
     rhel_subscription_pass='<rhel-subscription-password>'

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

    Once you are done making the alterations, save and exit the file.

10. Load the CAPI Image Builder container image with the command below.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```shell
        docker load < capi-builder-v4.4.4.tar
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman load < capi-builder-v4.4.4.tar
        ```

        </TabItem>
        </Tabs>

11. Load the Yum container image with the command below. The Yum container is used to serve the packages required by the
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

12. Confirm that both container images were loaded correctly.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```shell
        docker images
        ```
        ```text hideClipboard
        REPOSITORY                                              TAG         IMAGE ID      CREATED       SIZE
        gcr.io/spectro-images-public/imagebuilder/capi-builder  v4.4.4      34ae97fee5e3  10 days ago   2.59 GB
        gcr.io/spectro-images-public/imagebuilder/yum-repo      v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```shell
        podman images
        ```
        ```text hideClipboard
        REPOSITORY                                              TAG         IMAGE ID      CREATED       SIZE
        gcr.io/spectro-images-public/imagebuilder/capi-builder  v4.4.4      34ae97fee5e3  10 days ago   2.59 GB
        gcr.io/spectro-images-public/imagebuilder/yum-repo      v1.0.0      b03879039936  6 weeks ago   603 MB
        ```

        </TabItem>
        </Tabs>

13. Start the Yum container and assign its ID to the `BUILD_ID_YUM` variable.

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

14. Execute the command below to visualize the Yum container logs.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```shell
        docker logs --follow $BUILD_ID_YUM
        ```

        Monitor the output until a `Pool finished` message appears, indicating that the process has completed successfully.

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

        Monitor the output until you see a `Pool finished` message, which indicates that the process has completed successfully.

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

15. Issue the following command to upload the airgap Kubernetes pack to the airgap registry.

    ```shell
    chmod +x airgap-pack-kubernetes-1.28.9.bin && \
    ./airgap-pack-kubernetes-1.28.9.bin
    ```

16. Start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI` variable. The tool will
    create and configure a VM named `rhel-8` with Dynamic Host Configuration Protocol (DHCP) in your VMware vSphere
    environment. It will then generate a RHEL 8 CAPI image from the VM and save it to the `output` folder.

        <Tabs>
        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach gcr.io/spectro-images-public/imagebuilder/capi-builder:v4.4.4)
        ```

        </TabItem>
        <TabItem value="Podman" label="Podman">

        ```bash
        BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach gcr.io/spectro-images-public/imagebuilder/capi-builder:v4.4.4)
        ```

        </TabItem>
        </Tabs>

    If you need the VM to use static IP placement instead of DHCP, follow the steps described below.

    <!-- prettier-ignore -->
        <details>
        <summary>CAPI Image Builder with Static IP Placement </summary>

        1. Open the `ks.cfg` file located in the output folder. Find and replace the network line
            `network --bootproto=dhcp --onboot=on --ipv6=auto --activate --hostname=capv.vm` with the configuration below.

            ```text
            network --bootproto=static --ip=<vcenter-static-ip-address> --netmask=<vcenter-netmask> --gateway=<vcenter-gateway> --nameserver=<vcenter-nameserver>
            ```

            Then, replace `<vcenter-static-ip-address>` with a valid IP address from your VMware vSphere environment. Similarly, replace `<vcenter-netmask>`, `<vcenter-gateway>`, and `<vcenter-nameserver>` with the correct values from your environment. The `<vcenter-netmask>` parameter must be specified in dotted decimal notation, for example, `--netmask=255.255.255.0`.

            Once you are finished doing the alterations, save and exit the file.

        2.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID_CAPI`
            variable. The tool will use the `imageconfig` file to create and configure a VM with static IP placement in
            your VMware vSphere environment.

            <Tabs>
            <TabItem value="Docker" label="Docker">

             ```bash
             BUILD_ID_CAPI=$(docker run --net=host --volume /root/output:/home/imagebuilder/output --detach gcr.io/spectro-images-public/imagebuilder/capi-builder:v4.4.4)
             ```
            </TabItem>

            <TabItem value="Podman" label="Podman">

             ```bash
             BUILD_ID_CAPI=$(podman run --net=host --volume /root/output:/home/imagebuilder/output --detach gcr.io/spectro-images-public/imagebuilder/capi-builder:v4.4.4)
             ```

            </TabItem>
            </Tabs>

        </details>

17. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress.
    <!-- prettier-ignore -->
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

    <!-- prettier-ignore -->
    </TabItem>
    </Tabs>

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

18. Once the build is complete, the RHEL 8 CAPI image will be downloaded to a folder named `rhel-8` within the output
    directory on your airgap support VM, and the CAPI Image Builder VM will be deleted from VMware vSphere. Issue the
    command below to confirm that the build files are present in the output directory.

        ```shell
        ls output/rhel-8
        ```

        ```text hideClipboard
        packer-manifest.json  rhel-8-kube-v1.28.9.mf  rhel-8-kube-v1.28.9.ova.sha256  rhel-8.ovf rhel-8-disk-0.vmdk  rhel-8-kube-v1.28.9.ova  rhel-8-kube-v1.28.9.ovf
        ```

19. Copy the `rhel-8-kube-v1.28.9.ova` file to the home directory of the airgap support VM.

    ```shell
    cp /root/output/rhel-8/rhel-8-kube-v1.28.9.ova /home/ubuntu/
    ```

    Next, open a new terminal window on your local machine and use the `scp` command to copy the
    `rhel-8-kube-v1.28.9.ova` file. Replace `/path/to/private_key` with the path to the private SSH key and
    `palette.example.com` with the IP address or hostname of the airgap support VM.

    ```shell
    scp -i /path/to/private_key ubuntu@palette.example.com:/home/ubuntu/rhel-8-kube-v1.28.9.ova .
    ```

20. To make the image available in VMware vSphere, log in to your environment and locate the `vcenter_folder` you
    defined in step **10** of this guide.

    :::info

    You can also use the following steps to make the image available in a VMware vSphere environment that is not
    connected to the one you used for building the image.

    :::

21. Right-click the folder and select **Deploy OVF Template** to deploy a VM using the RHEL 8 OVA file that was built in
    step **16** of this guide.

22. In the **Deploy OVF Template** wizard, click **Local File**, then **Upload Files**, and select the
    `rhel-8-kube-v1.28.9.ova` file from the folder on your local machine. Click **Next** to continue.

23. Assign a name to the virtual machine, such as `rhel-8-kube-v1.28.9`, and select the folder you created previously as
    the target location. Click **Next** to proceed.

24. Select a compute resource and click **Next**.

25. Review the VM configuration, accept the license agreements, and click **Next**.

26. Select the storage location and network configuration and click **Next**. Then, click **Finish** to deploy the VM.

    :::warning

    It takes a while for the VM to deploy, approximately 45 minutes or more. The download of the OVA file takes up the
    majority of the time. You can monitor the progress of this process in VMware vSphere by looking at the **Recent
    Tasks** tab and filtering the **Task Name** column by `Deploy OVF Template`.

    :::

27. Once the VM is created, right-click it and select **Convert to Template**. This will convert the VM into a RHEL 8
    image template that you can reference during the cluster profile creation.

## Create Cluster Profile

The RHEL 8 image is now built and available in the VMware vSphere environment. You can use it to create a cluster
profile and deploy a VMware vSphere host cluster.

19. Log in to your airgapped instance of Palette or VerteX and select **Profiles** from the left **Main Menu**.

20. Click **Add Cluster Profile** and follow the wizard to create a new profile.

21. In the **Basic Information** section, assign the cluster profile a name and a brief description, and select the type
    as **Full**. Click **Next**.

22. In the **Cloud Type** section, select **VMware** and click **Next**.

23. The **Profile Layers** section is where you specify the packs that compose the profile. This guide uses the
    following packs as an example.

    | Pack Name                   | Version | Layer            |
    | --------------------------- | ------- | ---------------- |
    | BYOOS                       | 1.0.0   | Operating System |
    | Palette eXtended Kubernetes | 1.28.9  | Kubernetes       |
    | Calico                      | 3.28.0  | Network          |
    | vSphere CSI                 | 3.2.0   | Storage          |

    <!-- prettier-ignore -->
    Reference the custom RHEL 8 image template path in your VMware vSphere environment when populating the pack details
    for the <VersionedLink text="BYOOS" url="/integrations/packs/?pack=generic-byoi" /> layer. For example, in the code snippet below, `/Datacenter/vm/sp-docs/rhel-8-kube-v1.28.9` is the vSphere path to the image.

    ```yaml
    pack:
      osImageOverride: "/Datacenter/vm/sp-docs/rhel-8-kube-v1.28.9"
      osName: "rhel"
      osVersion: "8"
    ```

    As you fill out the information for each layer, click **Next** to proceed.

    :::warning

    The Palette eXtended Kubernetes pack version must match the Kubernetes version specified in the `imageconfig` file.

    :::

24. Review the profile layers and click **Finish Configuration** to create the cluster profile.

25. Deploy a VMware host cluster using the created cluster profile. Refer to the
    [Create and Manage VMware Clusters](../../../../clusters/data-center/vmware/create-manage-vmware-clusters.md) guide
    for instructions on deploying a VMware host cluster.

## Validate

1. Log in to the VMware vSphere environment and navigate to the **Inventory** view.

2. Select the **VMs and Templates** tab and verify the custom RHEL 8 image is available.
