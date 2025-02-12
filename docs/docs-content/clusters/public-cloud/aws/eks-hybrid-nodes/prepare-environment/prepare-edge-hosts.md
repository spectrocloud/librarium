---
sidebar_label: "Prepare Edge Hosts"
title: "Prepare Edge Hosts"
description: "Learn how to prepare your edge hosts to be used as Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 3
---

This guide explains how to prepare on-premises edge hosts for use as Amazon EKS Hybrid Nodes within the Spectro Cloud ecosystem. There are two available methods to register these hosts:

- [Agent Mode](../../../../../deployment-modes/agent-mode/agent-mode.md)
- [Appliance Mode](../../../../../deployment-modes/appliance-mode.md) using the [EdgeForge Workflow](../../../../edge/edgeforge-workflow/edgeforge-workflow.md).

Agent Mode installs a lightweight agent on existing systems, and Appliance Mode deploys a fully managed operating system (OS) and stack. Choose the approach that aligns best with your operational and security requirements.

## Agent Mode

In Agent Mode, you install the Palette agent on your existing host OS. This agent communicates with Palette in connected mode to manage configurations, updates, and workloads.

The key benefits of Agent Mode are:

- Minimal overhead on the host OS.
- Easier to integrate with custom OS configurations.
- Agent updates can be rolled out seamlessly from the Spectro Cloud console.

### Prerequisites

#### Infrastructure

- You have physical or virtual servers ready to be used as edge hosts.

- The physical or virtual server resources for each edge host meet the [Minimum Device Requirements](../../../../../deployment-modes/agent-mode/architecture.md#minimum-device-requirements).

- The edge host has at least one static IP address assigned.

#### OS and Dependencies

- You must have a supported OS installed on your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.

  - The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL).

- Ensure the following software is installed and available:

  - [bash](https://www.gnu.org/software/bash/)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [rsync](https://github.com/RsyncProject/rsync)
  - [systemd](https://systemd.io/)
  - [systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html). This is
    required if you want Palette to manage Network Time Protocol (NTP). If you don't want Palette to manage NTP, you can
    skip this requirement.
  - [systemd-resolved](https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html). This is
    required if you want Palette to manage Domain Name System (DNS). If you don't want Palette to manage DNS, you can
    skip this requirement.
  - [systemd-networkd](https://www.freedesktop.org/software/systemd/man/latest/systemd-networkd.html). This requirement
    is specific for clusters that use static IP addresses. You also need this if you want Palette to manage the Edge
    host network.
  - [iptables](https://linux.die.net/man/8/iptables)
  - [rsyslog](https://github.com/rsyslog/rsyslog). This is required for audit logs.

  <br />

  :::warning

  Avoid installing [Docker](https://www.docker.com/) on the host where you want to install the agent. Docker is a heavyweight tool that could
  interfere with the Palette agent.

  :::

- Ensure that the host has `Bash` configured as the default shell.

#### Palette Registration Token

- You will need a Palette tenant registration token. Refer to the [Create a Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token.md) guide for instructions on how to create a token.

### Register Edge Host in Agent Mode

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to your private SSH key, `<ssh-user>` with the SSH username, and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> <ssh-user>@<host-ip-or-domain>
   ```

2. Export your Palette registration token. Replace `<your-palette-registration-token>` with your token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. _(Optional)_  If you are installing the agent on a host that accesses the internet through a network proxy, export the proxy configurations in your current terminal session.

   We recommend exporting the variables both in uppercase and lowercase to ensure compatibility. Replace `<http-proxy-address>` and `<https-proxy-address>` with the address and port to your HTTP and HTTPS proxy servers, respectively.

   ```shell
   export http_proxy=<http-proxy-address>
   export https_proxy=<https-proxy-address>
   export HTTP_PROXY=<http-proxy-address>
   export HTTPS_PROXY=<https-proxy-address>
   ```

4. Issue the command below to create the **user-data** file and configure your host declaratively.

   The following configuration includes a Palette registration token and the default Palette endpoint, specifies a
   Palette project, and sets up the `kairos` user. Note the following:

   - If your host needs a proxy to access the internet, you need to provide the proxy configurations in the user data as well. For more information, refer to [Site Network Parameters](../../../../../clusters/edge/edge-configuration/installer-reference.md#site-network-parameters).
   - The host will not shut down and will instead reboot after the agent is installed, with
     [kube-vip](../../../../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and VMware
     vSphere deployments. If your environment does not require kube-vip, set `skipKubeVip` to `true`. Refer to the
     [Prepare User Data](../../../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide to learn more about user
     data configuration.
   - The `projectName` parameter is not required if the associated Palette
     [registration token](../../../../../clusters/edge/site-deployment/site-installation/create-registration-token.md) has been configured with a default project.

   <br />

   ```shell
   cat << EOF > user-data
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     skipKubeVip: false
     site:
       edgeHostToken: $TOKEN
       paletteEndpoint: api.spectrocloud.com
       projectName: Default
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   EOF
   ```

   Confirm that the file was created correctly.

   ```shell
   cat user-data
   ```

   The output should contain the value of your Palette registration token assigned to the `edgeHostToken` parameter, as
   displayed in the example output below.

   ```text hideClipboard
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     skipKubeVip: false
     site:
       edgeHostToken: ****************
       paletteEndpoint: api.spectrocloud.com
       projectName: Default
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   ```

5. Export the path to your user data file.

   ```shell
   export USERDATA=./user-data
   ```

6. Download the latest version of the Palette agent installation script. There is a FIPS-compliant script, if needed.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

   <details>

   <summary>Dedicated or On-Premises Palette Instance</summary>

   If you have a dedicated or on-premises instance of Palette, you need to identify the correct agent version and then
   download the corresponding version of the agent installation script. Use the command below and replace
   `<palette-endpoint>` with your Palette endpoint and `<api-key>` with your Palette API key to identify the version.

   ```shell
   curl --location --request GET 'https://<palette-endpoint>/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: <api-key>'  | jq --raw-output '.spec.latestVersion.content | match("version: ([^\n]+)").captures[0].string'
   ```

   Example output.

   ```text hideClipboard
   4.6.0
   ```

   Issue the following command to download the version of the Palette agent for your dedicated or on-prem instance.
   Replace `<stylus-version>` with your output from the previous step.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

   </details>

7. Grant execution permissions to the installation script.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   chmod +x ./palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   chmod +x ./palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

8. Issue the following command to install the agent on your host.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   sudo --preserve-env ./palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

   The termination of the SSH connection, as shown in the example below, confirms that the script has completed its
   tasks.

   ```text hideClipboard
   Connection to 192.168.1.100 closed by remote host.
   Connection to 192.168.1.100 closed.
   ```

Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for automatic registration with Palette. The host will be registered in the same project where the registration token was created.

### Validate

Use the following sections to help check that your edge host is ready to be used as an Amazon EKS Hybrid Node.

#### Palette Edge Host Registration

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the table.

#### Network Connectivity

- Verify that you can connect to the edge host through SSH using your private key.

- Verify that the edge host has outbound access to the internet.

- Verify that the edge host has outbound connectivity to Spectro Cloud [services](../../../../../architecture/palette-public-ips.md) and [ports](../../../../../architecture/networking-ports.md#network-ports).

- Verify that the edge host has outbound connectivity to the required [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).
  - Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster operations** sections for listed guidance.

#### Package Manager Index

- Verify that your edge host package manager has an up-to-date package index. This is to ensure that dependency packages for
[`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully downloaded
and installed when [creating hybrid node pools](../create-hybrid-node-pools.md#create-hybrid-node-pool).

  For example, on Ubuntu, you would issue the following command.

  ```shell
  sudo apt-get update
  ```

  Adjust to your operating system and package manager on your edge host.

## Appliance Mode

In Appliance Mode, you follow the EdgeForge workflow to provision your edge hosts. The EdgeForge workflow requires a provider image and an installer ISO to be built. The provider image is a [Kairos-based image](https://kairos.io/) that provides an immutable OS and Kubernetes runtime components for a specified Kubernetes version. The installer ISO partitions the disk, installs required dependencies including the Palette agent, registers the host with Palette, and sets up user and security configurations. Once these artifacts are built, you can use them to provision your edge hosts on existing hardware.

The key benefits of Appliance Mode are:

- Consistent and controlled runtime environment.
- Streamlined updates since OS and Palette agent are managed as a single appliance.
- Potentially less configuration drift across multiple edge sites.

### Prerequisites

Appliance mode requires the following components:

- A host to build the required [Edge artifacts](../../../../edge/edgeforge-workflow/edgeforge-workflow.md#edge-artifacts).
- Physical or virtual servers ready to be used as edge hosts.

<Tabs>

<TabItem label="Prerequisites for Build Host" value="build-host-prereqs">

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  - If you do not install Earthly, you must install Docker.

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token) guide.

- An account with an image registry that will store the provider image, for example, [Docker Hub](https://hub.docker.com/).

  In the [Register Edge Host in Appliance Mode](#register-edge-host-in-appliance-mode) steps, the example uses the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does not require a sign-up. Images pushed to _ttl.sh_ are ephemeral and will expire after the 24 hrs time limit.

</TabItem>

<TabItem label="Prerequisites for Edge Hosts" value="edge-hosts-prereqs">

- The physical or virtual server resources for each edge host meet the [Minimum Requirements](../../../../edge/hardware-requirements.md#minimum-requirements).

- The edge host has at least one static IP address assigned.

- You must build a supported OS for your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.

</TabItem>

</Tabs>

### Register Edge Host in Appliance Mode

Use the following instructions on your build host to customize the arguments and Dockerfile, and then create all the required Edge artifacts.

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the newest available tag. This guide uses **v4.5.15** tag as an example.

   ```shell
   git checkout v4.5.15
   ```

5. Review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.
   - **k8s_version.json** - Lists all supported Kubernetes versions for each Kubernetes distribution.
   - **Dockerfile** - Embeds the arguments and other configurations in the image.
   - **Earthfile** - Contains a series of commands to create target artifacts.
   - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
   - **user-data.template** - A sample user-data file.

6. Issue the following command to create the **.arg** file with the customizable arguments. Adjust the parameters to your requirements. Refer to the [Edge Artifact Build Configurations](../../../../edge/edgeforge-workflow/palette-canvos/arg.md) table for descriptions of all the parameters you can use.

   :::info

   - You must specify a supported OS for your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.
   - If specifying a Docker Hub registry, your `IMAGE_REGISTRY` value should be entered as `docker.io/<docker-id>`. Replace `<docker-id>` with your Docker ID. This ensures the final artifact name conforms to the Docker Hub image name syntax - `[HOST]/[DOCKER-ID]/[REPOSITORY]:[TAG]`.
   - The `K8S_DISTRIBUTION` argument must be set to `nodeadm` to ensure compatibility with EKS Hybrid Nodes.
   - For `K8S_VERSION`, review the `k8s_version.json` file for supported versions for `nodeadm`.

   :::

   ```bash
   cat << EOF > .arg
   CUSTOM_TAG=<custom-tag>
   IMAGE_REGISTRY=<image-registry>
   OS_DISTRIBUTION=<os-distribution>
   IMAGE_REPO=<image-repository-name>
   OS_VERSION=<os-version>
   K8S_DISTRIBUTION=nodeadm
   K8S_VERSION=<kubernetes-version>
   ISO_NAME=<installer-iso-file-name>
   ARCH=<image-architecture>
   UPDATE_KERNEL=false
   EOF
   ```

   View the newly created file to ensure the customized arguments are set correctly.

   ```bash
   cat .arg
   ```

   Example output.

   ```bash hideClipboard
   CUSTOM_TAG=nodeadm-1.30.0-v4.5.15-eks-hybrid
   IMAGE_REGISTRY=ttl.sh
   OS_DISTRIBUTION=ubuntu
   IMAGE_REPO=ubuntu
   OS_VERSION=22
   K8S_DISTRIBUTION=nodeadm
   K8S_VERSION=1.30.0
   ISO_NAME=palette-edge-installer
   ARCH=amd64
   UPDATE_KERNEL=false
   ```

   Based on the arguments defined in the **.arg** file, the final provider image name will have the following naming pattern, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. Using the example output, the image name would be `ttl.sh/ubuntu:nodeadm-1.30.0-v4.5.15-eks-hybrid`.

7. _(Optional)_ This step is only required if your builds occur in a proxied network environment, and your proxy servers require client certificates, or if your base image is in a registry that requires client certificates.

   You can provide the base-64 encoded certificates in PEM format in the **certs** folder at the root directory of the
   **CanvOS** repository. You can provide as many certificates as you need in the folder.

   If you are using a CanvOS tag that is earlier than `4.5.15`, you need to use the `PROXY_CERT_PATH` build argument to
   provide a path to the certificate. This approach only allows you to specify one certificate. For more information,
   refer to [Earthly Build Arguments](../../../../edge/edgeforge-workflow/palette-canvos/arg.md).

   :::warning

   These proxy settings are only configured for the build process itself, when your builder machine needs to pull
   certain images to build the Edge artifacts. These certificates will not be present on the host after it has been
   deployed. To configure the proxy network settings for a host, refer to
   [Configure HTTP Proxy](../../../../edge/local-ui/host-management/configure-proxy.md) or
   [Configure Proxy in User Data](../../../../edge/edgeforge-workflow/prepare-user-data.md#configure-proxy-settings-optional).

   :::

8. You can install more tools and dependencies and configure the image to meet your needs by using the Dockerfile. Add your
   customizations below the line tagged with the `Add any other image customizations here` comment in the Dockerfile.
   Do not edit or add any lines before this tagged comment.

9. Issue the command below to save your Palette tenant registration token to a local variable. Replace `<registration-token>` with
   your actual registration token.

   ```bash
   export token=<registration-token>
   ```

10. Use the following command to create the **user-data** file containing the tenant registration token.

    ```shell
    cat << EOF > user-data
    #cloud-config
    stylus:
      site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: $token
        projectName: stores
        tags:
          key1: value1
          key2: value2
          key3: value3
        name: edge-randomid
        registrationURL: https://edge-registration-app.vercel.app/

        network:
          httpProxy: http://proxy.example.com
          httpsProxy: https://proxy.example.com
          noProxy: 10.10.128.10,10.0.0.0/8

          nameserver: 1.1.1.1
          interfaces:
              enp0s3:
                  type: static
                  ipAddress: 10.0.10.25/24
                  gateway: 10.0.10.1
                  nameserver: 10.10.128.8
              enp0s4:
                  type: dhcp
        caCerts:
          - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE------
          - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE------
      registryCredentials:
        domain: registry.example.com
        username: bob
        password: ####
        insecure: false
    install:
      poweroff: true
    users:
      - name: kairos
        passwd: kairos
    EOF
    ```

    You can take advantage of the Tech Preview feature to edit user data in Local UI after installation. Refer to
    [Edit User Data](../../../../edge/local-ui/host-management/edit-user-data.md) for more information. However, we still recommend
    you provide user data during EdgeForge for production workloads, because not all user data fields can be updated in
    Local UI.

    :::info

    If you need to pull images from a private image registry, you can supply the credentials for the registry in the
    user data file in the `registryCredentials` field or in the cluster profile. Credentials specified in **user-data**
    overwrites the credentials provided in the cluster profile. To learn how to provide credentials in cluster profiles,
    refer to
    [Deploy Cluster with a Private Registry](../../../../edge/site-deployment/deploy-custom-registries/deploy-private-registry.md).

    :::

    View the newly created user data file to ensure the token is set correctly.

    ```bash
    cat user-data
    ```

    If you want further customization, check the existing **user-data.template** file, and refer to the
    [Edge Configuration Stages](../../../../edge/edge-configuration/cloud-init.md) and
    [User Data Parameters](../../../../edge/edge-configuration/installer-reference.md) documents to learn more.

11. CanvOS utility uses [Earthly](https://earthly.dev/)(https://earthly.dev/) to build the target artifacts. Issue the
    following command to start the build process.

    <Tabs group="earthly">

    <TabItem value="Earthly Installed">

    ```bash
    earthly +build-all-images
    ```

    </TabItem>

    <TabItem value="Earthly Not Installed">

    ```bash
    sudo ./earthly.sh +build-all-images
    ```

    </TabItem>

    </Tabs>

    ```hideClipboard bash {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

    :::info

    If you plan to build the Edge Installer ISO using a content bundle, use the `+build-provider-images` option instead
    of the `+build-all-images` option in the command above. The command `sudo ./earthly.sh +build-provider-images` will
    build the provider images but not the Edge installer ISO. After the provider images are built, follow the steps in
    the [Build Content Bundle](../../../../edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) guide to build the Edge installer ISO using a content bundle.

    :::info

    This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion,
    the command will display the manifest, as shown in the example below, that you will use in your cluster profile
    later in this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what
    you defined earlier in the **.arg** file.

    Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

    ```bash hideClipboard
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      #drain:
        #cordon: true
        #timeout: 60 # The length of time to wait before giving up, zero means infinite
        #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
        #ignoreDaemonSets: true
        #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
        #force: true # Continue even if there are pods that do not declare a controller
        #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
        #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: docker.io/spectrocloud
      system.repo: opensuse-leap
      system.k8sDistribution: k3s
      system.osName: opensuse-leap
      system.peVersion: v4.4.12
      system.customTag: palette-learn
      system.osVersion:
    ```

12. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag
    value you used in the **.arg** file's `CUSTOM_TAG` argument.

    ```shell
    docker images --filter=reference='*/*:*palette-learn'
    ```

    ```hideClipboard bash
    REPOSITORY                   TAG                               IMAGE ID       CREATED          SIZE
    spectrocloud/opensuse-leap   k3s-1.27.2-v4.4.12-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
    spectrocloud/opensuse-leap   k3s-1.26.6-v4.4.12-palette-learn   0f2efd533a33   24 minutes ago   2.22GB
    spectrocloud/opensuse-leap   k3s-1.25.2-v4.4.12-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
    ```

13. To use the provider images in your cluster profile, push them to your image registry mentioned in the **.arg** file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

    ```hideClipboard bash
    Login Succeeded
    ```

14. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[DOCKER-ID]` and version numbers in the command below with your Docker ID and respective Kubernetes versions that
    the utility created.

    ```bash
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.27.2-v4.4.12-palette-learn
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.26.6-v4.4.12-palette-learn
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.25.2-v4.4.12-palette-learn
    ```

15. 

### Validate

Use the following sections to help check that your edge host is ready to be used as an Amazon EKS Hybrid Node.

#### Palette Edge Host Registration

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the table.

#### Network Connectivity

- Verify that you can connect to the edge host through SSH using your private key.

- Verify that the edge host has outbound access to the internet.

- Verify that the edge host has outbound connectivity to Spectro Cloud [services](../../../../../architecture/palette-public-ips.md) and [ports](../../../../../architecture/networking-ports.md#network-ports).

- Verify that the edge host has outbound connectivity to the required [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem)
  - Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster operations** sections for listed guidance.

#### Package Manager Index

- Verify that your edge host package manager has an up-to-date package index. This is to ensure that dependency packages for
[`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully downloaded
and installed when [creating hybrid node pools](../create-hybrid-node-pools.md#create-hybrid-node-pool).

  For example, on Ubuntu, you would issue the following command.

  ```shell
  sudo apt-get update
  ```

  Adjust to your operating system and package manager on your edge host.

## Next Steps

1. Pick the registration mode (Agent or Appliance) best suited to your infrastructure.
2. Complete the setup.
3. Validate connectivity, performance, and security for your edge hosts once registered.
