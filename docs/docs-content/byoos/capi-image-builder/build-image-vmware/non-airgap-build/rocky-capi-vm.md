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

- An existing VM with an OS of Rocky Linux 8 or 9 installed. This VM will be used as the base of your image and must
  meet the following requirements:

  - The following tools installed:

    - `conntrack-tools`
    - `cloud-init`
    - `cloud-utils-growpart`
    - `iptables`
    - `python2-pip`
    - `python3`

  - A user of `builder` with a password of `builder`. This is required by the
    [vsphere-clone-builder](https://image-builder.sigs.k8s.io/capi/providers/vsphere#vsphere-clone-builder). The
    `builder` user must be granted passwordless sudo privileges.

    <details>

    <summary> `builder` user and password privileges </summary>

            1. On your Rocky Linux VM, add a `builder` user.

                ```shell
                sudo useradd builder
                ```

            2. Set the password for the `builder` user to `builder`.

                ```shell
                echo 'builder:builder' | sudo chpasswd
                ```

            3. Assign passwordless sudo privileges to the `builder` user and assign the appropriate permissions.

                ```shell
                echo 'builder ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builder
                sudo chmod 0440 /etc/sudoers.d/builder
                ```

    </details>

  - SSH password authentication enabled in `/etc/ssh/sshd_config` by setting `PasswordAuthentication` to `yes`. You must
    either restart `sshd` or reboot your system for the changes to take effect.

  - SSH password authentication enabled for `cloud-init` by setting `ssh_pwauth` to `true`. This is required to prevent
    `cloud-init` from overwriting `PasswordAuthentication yes` in `/etc/ssh/sshd_config` when booting the cloned VM. We
    recommend creating a separate file that explicitly sets `ssh_pwauth: true`.

        ```shell
        sudo tee /etc/cloud/cloud.cfg.d/99-enable-ssh-pwauth.cfg << EOF
        ssh_pwauth: true
        EOF
        ```

  - [IPv4 packet forwarding](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#prerequisite-ipv4-forwarding-optional)
    enabled.

  - `firewalld` disabled.

        <details>

            <summary> Check `firewalld` status </summary>

              1. Check the status of `firewalld`. Note the `Active` status.

                 ```shell
                 systemctl status firewalld
                 ```

                 ```shell title="Example output" hideClipboard {3}
                 ● firewalld.service - firewalld - dynamic firewall daemon
                     Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset>
                     Active: active (running) since Wed 2025-11-12 20:04:57 EST; 17min ago
                         Docs: man:firewalld(1)
                     Main PID: 960 (firewalld)
                         Tasks: 2 (limit: 100604)
                     Memory: 45.3M
                     CGroup: /system.slice/firewalld.service
                             └─960 /usr/libexec/platform-python -s /usr/sbin/firewalld --nofork --nopid
                 ```

              2. If you have a status of `Active: active`, disable `firewalld`.

                 ```shell
                 sudo systemctl disable --now firewalld
                 ```

                 ```shell title="Example output" hideClipboard
                 Removed /etc/systemd/system/multi-user.target.wants/firewalld.service.
                 Removed /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.
                 ```

              3. Confirm `firewalld` has a status of `Active: inactive`.

                 ```shell
                 systemctl status firewalld
                 ```

                 ```shell title="Example output" hideClipboard {3}
                 ● firewalld.service - firewalld - dynamic firewall daemon
                     Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
                     Active: inactive (dead)
                         Docs: man:firewalld(1)
                 ```

        </details>

  - `/tmp` mounted to execute binaries and scripts.

          <details>
          <summary> Check `/tmp` status </summary>

          1. Check the mount status of `/tmp`. Look for a status of `noexec`.

              ```shell
              mount | grep '/tmp'
              ```

              ```shell title="Example output" hideClipboard
              tmpfs on /tmp type tmpfs (rw,nosuid,nodev,noexec,relatime,size=2G)
              ```

              :::tip

              If you receive an error, where `/tmp` is not displayed in the mount output, it is likely because it is a regular directory on the filesystem and not a separate mount.

              Issue the following command to confirm the mount point of `/tmp`. If the `Mounted on` location is `/`, no action is required.

              ```shell
              df --human-readable /tmp
              ```

              ```shell title="Example output" hideClipboard
              Filesystem           Size  Used Avail Use% Mounted on
              /dev/mapper/rl-root   70G  3.7G   67G   6% /
              ```

              :::

          2. If `/tmp` has a status of `noexec`, use your preferred text editor to edit the file `/etc/fstab` and set `/tmp` to `exec`.

              ```shell
              vi /etc/fstab
              ```

              ```shell title="Example output" hideClipboard {9}
              #
              # Created by anaconda on Thu Nov  6 13:15:55 2025
              #
              /dev/mapper/rl-root                         /                       xfs     defaults                            0 0
              UUID=3b068723-b40a-4c10-ac6d-00271cd4d3a4   /boot                   xfs     defaults                            0 0
              UUID=F867-A7CE                              /boot/efi               vfat    umask=0077,shortname=winnt          0 2
              /dev/mapper/rl-home                         /home                   xfs     defaults                            0 0
              /dev/mapper/rl-swap                         none                    swap    defaults                            0 0
              tmpfs                                       /tmp                    tmpfs   defaults,nosuid,nodev,exec,size=2G  0 0
              ```

          3. Remount all filesystems in `/etc/fstab`.

              ```shell
              sudo mount --all
              ```

          4. Confirm the mount status of `/tmp` is set to `exec`.

              ```shell
              mount | grep '/tmp'
              ```

              ```shell title="Example output" hideClipboard
              tmpfs on /tmp type tmpfs (rw,nosuid,nodev,exec,relatime,size=2G)
              ```

          </details>

  - If your system has been hardened using a Security Technical Implementation Guide (STIG) policy, you may need to
    remediate the following:

            - SELinux may prevent binaries from executing, including `cloud-init` scripts. We recommend setting the SELinux
              status to `permissive` or `disabled` until the image building process is complete.

              <details>

              <summary> Check SELinux status </summary>

                1.  Check the status of SELinux.

                    ```shell
                    getenforce
                    ```

                    ```shell title="Example output" hideClipboard
                    Enforcing
                    ```

                2.  If the status is `Enforcing`, use your preferred text editor to open the SELinux config file and set `SELINUX`
                    to either `permissive` or `disabled`.

                        ```shell
                        vi /etc/selinux/config
                        ```

                        ```shell title="Example output" hideClipboard {6}
                        # This file controls the state of SELinux on the system.
                        # SELINUX= can take one of these three values:
                        #     enforcing - SELinux security policy is enforced.
                        #     permissive - SELinux prints warnings instead of enforcing.
                        #     disabled - No SELinux policy is loaded.
                        SELINUX=permissive
                        # SELINUXTYPE= can take one of these three values:
                        #     targeted - Targeted processes are protected,
                        #     minimum - Modification of targeted policy. Only selected processes are protected.
                        #     mls - Multi Level Security protection.
                        SELINUXTYPE=targeted
                    ```

              </details>

    - `fapolicyd` may prevent certain applications from executing, such as `containerd-shim-runc-v2`. We recommend
      disabling `fapolicyd` until the image building process is complete.

            <details>

            <summary> Check `fapolicyd` status </summary>

              1. Check the status of `fapolicyd`. Note the `Active` status.

                 ```shell
                 systemctl status fapolicyd
                 ```

                 ```shell "Example output" hideClipboard {3}
                 ● fapolicyd.service - File Access Policy Daemon
                     Loaded: loaded (/usr/lib/systemd/system/fapolicyd.service; enabled; vendor preset: disabled)
                     Active: active (running) since Sat 2025-11-15 08:39:30 EST; 2s ago
                         Docs: man:fapolicyd(8)
                     Process: 33431 ExecStart=/usr/sbin/fapolicyd (code=exited, status=0/SUCCESS)
                     Process: 33406 ExecStartPre=/usr/sbin/fagenrules (code=exited, status=0/SUCCESS)
                     Main PID: 33432 (fapolicyd)
                         Tasks: 4 (limit: 100604)
                     Memory: 54.0M
                     CGroup: /system.slice/fapolicyd.service
                             └─33432 /usr/sbin/fapolicyd
                 ```

              2. If you have a status of `Active: active`, disable `fapolicyd`.

                 ```shell
                 sudo systemctl disable --now fapolicyd
                 ```

                 ```shell title="Example output" hideClipboard
                 Removed /etc/systemd/system/multi-user.target.wants/fapolicyd.service.
                 ```

              3. Confirm `fapolicyd` has a status of `Active: inactive`.

                 ```shell
                 systemctl status firewalld
                 ```

                 ```shell title="Example output" hideClipboard {3}
                 ● fapolicyd.service - File Access Policy Daemon
                    Loaded: loaded (/usr/lib/systemd/system/fapolicyd.service; disabled; vendor preset: disabled)
                    Active: inactive (dead)
                        Docs: man:fapolicyd(8)
                 ```

            </details>

  - A snapshot of your VM created once all other prerequisites are met. This is required by the
    [vsphere-clone-builder](https://image-builder.sigs.k8s.io/capi/providers/vsphere#vsphere-clone-builder).

</TabItem>

</Tabs>

## Build Custom Image

<Tabs groupId="image-base">

<TabItem label="Rocky ISO" value="iso">

1.  Open a terminal session on your Linux machine and set your CAPI Image Builder version tag as a variable. This guide
    uses version 4.6.23 as an example. Refer to the CAPI Image Builder
    [Downloads](../../../../downloads/capi-image-builder.md) page for the latest version.

        ```shell
        CAPI_IMAGE_BUILDER_VERSION=<capi-image-builder-version-tag>
        echo CAPI Image Builder version: $CAPI_IMAGE_BUILDER_VERSION
        ```

        ```shell title="Example output"
        CAPI Image Builder version: v4.6.23
        ```

2.  Download the CAPI Image Builder image.

    <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
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
        podman pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
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

3.  Create an `output` directory to store the image files and set the required permissions.

    ```shell
    mkdir /home/$USER/output
    chmod a+rwx /home/$USER/output
    ```

4.  Navigate to the `output` directory.

    ```shell
    cd /home/$USER/output
    ```

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

8.  Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. For a complete
    list of parameters, refer to the [Configuration Reference](../../config-reference.md) page. Additionally, refer to
    the [Compatibility Matrix](../../comp-matrix-capi-builder.md) for a list of supported Kubernetes versions and their
    corresponding dependencies.

    The `imageconfig` file is the file used to personalize the base CAPI image for your cluster, which you can alter to
    fit your needs. This includes specifying the OS type, Kubernetes version, whether the image should be FIPS
    compliant, and more.

    The following example configuration configures a Rocky 8 CAPI image from a Rocky ISO. Use the SHA256 checksum of the
    Rocky ISO from step 6 of this guide for `<iso-checksum>`. Additionally, replace the VMware-related placeholders with
    the values from your VMware vSphere environment.

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
    vSphere environment using the `image_name` defined in `imageconfig`. For this guide, the VM is named `rocky-8`. The
    tool will then generate a Rocky 8 CAPI image from the VM and save it to the `output` directory.

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

11. Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. If you
    added any custom scripts in step 8, the output will be displayed in the build log.

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

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

12. Once the build is complete, the Rocky 8 CAPI image will be downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. For this example, the image is `rocky-8`.

    Issue the command below to confirm that the build files are present in the `output` directory, replacing `rocky-8`
    with your specified `image_name`, if different.

        ```shell
        ls rocky-8
        ```

        ```text hideClipboard title="Example output"
        packer-manifest.json  rockylinux-8-kube-v1.30.4.mf  rockylinux-8-kube-v1.30.4.ovf rocky-8-disk-0.vmdk  rockylinux-8-kube-v1.30.4.ova  rocky-8.ovf rockylinux-8-kube-v1.30.4.ova.sha256
        ```

13. Locate the new Rocky VM in your VMware vSphere environment. Right-click the VM and select **Clone > Clone to
    Template**.

    :::info

    The locations and resources specified in the following steps do not have to match those defined in the `imageconfig`
    file.

    :::

14. Enter a **VM template name**, choose a location for the template, and select **Next**.

15. Choose a compute resource and select **Next**.

16. Choose a storage location and select **Next**.

17. Review your template configurations and select **Finish** to convert the VM into a Rocky image template that you can
    reference while creating your cluster profile.

</TabItem>

<TabItem label="Rocky VM" value="vm">

1.  Open a terminal session on your Linux machine and set your CAPI Image Builder version tag as a variable. This guide
    uses version 4.6.23 as an example. Refer to the CAPI Image Builder
    [Downloads](../../../../downloads/capi-image-builder.md) page for the latest version.

        ```shell
        CAPI_IMAGE_BUILDER_VERSION=<capi-image-builder-version-tag>
        echo CAPI Image Builder version: $CAPI_IMAGE_BUILDER_VERSION
        ```

        ```shell title="Example output"
        CAPI Image Builder version: v4.6.23
        ```

2.  Download the CAPI Image Builder image.

    <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```shell
        docker pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
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
        podman pull us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION
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

3.  Create an `output` directory to store the image files and set the required permissions.

    ```shell
    mkdir /home/$USER/output
    chmod a+rwx /home/$USER/output
    ```

4.  Navigate to the `output` directory.

    ```shell
    cd /home/$USER/output
    ```

5.  Download the `imageconfig` template file.

    ```shell
    curl https://software.spectrocloud.com/tools/capi-image-builder/imageconfig --output imageconfig
    ```

6.  Open the `imageconfig` template file in an editor of your choice and fill in the required parameters. For a complete
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

8.  Issue the command below to start the CAPI Image Builder container and assign the container ID to the `BUILD_ID`
    variable. The tool will create and configure a VM with Dynamic Host Configuration Protocol (DHCP) in your VMware
    vSphere environment using the `image_name` defined in `imageconfig`. For this guide, the VM is named `rocky-8`. The
    tool will then generate a Rocky 8 CAPI image from the VM and save it to the `output` directory.

        <Tabs groupId="container-tech">

        <TabItem value="Docker" label="Docker">

        ```bash
        BUILD_ID=$(docker run --net=host --volume /home/$USER/output:/home/imagebuilder/output  --detach  us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION)


        # Sleep keeps packer from triggering the build until the RH line is removed
        BUILD_ID=$(docker run --net=host \
        --volume /home/$USER/output:/home/imagebuilder/output \
        --detach \
        us-docker.pkg.dev/palette-images/palette/imagebuilder/capi-builder:$CAPI_IMAGE_BUILDER_VERSION\
        sleep infinity)

        # Patch the Ansible playbook to delete the task that checks for RHSM environment variables
        docker exec $BUILD_ID bash -c 'sed -i "/Fail if RHSM_USER or RHSM_PASS/,/lookup.*RHSM_PASS.*length == 0/d" /home/imagebuilder/ansible/roles/setup/tasks/redhat.yml'

        # Trigger the build
        docker exec $BUILD_ID make build-node-ova-vsphere-clone-rockylinux-8
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

9.  Execute the following command to view the CAPI Image Builder container logs and monitor the build progress. If you
    added any custom scripts in step 8, the output will be displayed in the build log.

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

    :::info

    It may take a few minutes for the logs to start being displayed, and the build takes several minutes to complete.

    :::

10. Once the build is complete, the Rocky 8 CAPI image will be downloaded to the `output` directory as the `image_name`
    specified in the `imageconfig` file. For this example, the image is `rocky-8`.

    Issue the command below to confirm that the build files are present in the `output` directory, replacing `rocky-8`
    with your specified `image_name`, if different.

        ```shell
        ls rocky-8
        ```

        ```text hideClipboard title="Example output"
        packer-manifest.json  rockylinux-8-kube-v1.30.4.mf  rockylinux-8-kube-v1.30.4.ovf rocky-8-disk-0.vmdk  rockylinux-8-kube-v1.30.4.ova  rocky-8.ovf rockylinux-8-kube-v1.30.4.ova.sha256
        ```

11. Locate the new Rocky VM in your VMware vSphere environment. Right-click the VM and select **Clone > Clone to
    Template**.

    :::info

    The locations and resources specified in the following steps do not have to match those defined in the `imageconfig`
    file.

    :::

12. Enter a **VM template name**, choose a location for the template, and select **Next**.

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
