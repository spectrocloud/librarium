---
sidebar_label: "Install Palette"
title: "Install Palette"
description: "Learn how to install Palette on VMware."
icon: ""
sidebar_position: 30
hide_table_of_contents: false
tags: ["palette", "self-hosted", "vmware"]
keywords: ["self-hosted", "enterprise"]
---

Palette can be installed on VMware vSphere in an airgap environment. When you install Palette, a three-node cluster is
created. You use the interactive Palette CLI to install Palette on VMware vSphere. Refer to
[Access Palette](../../../enterprise-version.md#access-palette) for instructions on requesting the required credentials
and assets.

## Prerequisites

- You have completed the [Environment Setup](./environment-setup/environment-setup.md) steps and deployed the airgap
  support VM.

- You will need to provide the Palette CLI an encryption passphrase to secure sensitive data. The passphrase must be
  between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character.
  Refer to the [Palette CLI Encryption](../../../../automation/palette-cli/palette-cli.md#encryption) section for more
  information.

- Review the required VMware vSphere [permissions](../vmware-system-requirements.md). Ensure you have created the proper
  custom roles and zone tags.

- We recommended the following resources for Palette. Refer to the
  [Palette size guidelines](../../install-palette.md#size-guidelines) for additional sizing information.

  - 8 CPUs per VM.

  - 16 GB Memory per VM.

  - 100 GB Disk Space per VM.

- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound to and outbound from the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed cluster's Kubernetes API server.

- The network IP address range you specify during the installation must not overlap with any existing IP addresses in
  your environment. The IP address range must also have connectivity to the VMware vSphere environment.

- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to
  enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL
  certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format. This file is optional.

- Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require
  persistent storage. Refer to [Zone Tagging](../../install-on-vmware/vmware-system-requirements.md) for information.

- Assigned IP addresses for application workload services, such as Load Balancer services.

- A [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) to manage persistent storage, with the
  annotation `storageclass.kubernetes.io/is-default-class` set to `true`. To override the default StorageClass for a
  workload, modify the `storageClass` parameter. Check out the
  [Change the default StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)
  page to learn more about modifying StorageClasses.

:::info

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not
require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into
remote data centers that do not have a direct incoming connection from the Palette console. To learn how to install a
PCG on VMware, check out the [VMware](../../../../clusters/pcg/deploy-pcg/vmware.md) guide.

:::

## Deployment

The video below demonstrates the installation wizard and the prompts you will encounter. Take a moment to watch the
video before you begin the installation process. Make sure to use values that are appropriate for your environment. Use
the **three-dots Menu** in the lower right corner of the video to expand the video to full screen and to change the
playback speed.

<Video title="palette-cli-install" src="/videos/palette-airgap-install.mp4"></Video>

Use the following steps to install Palette.

1.  In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
    your private SSH key, your username, and the IP or domain of the airgap support VM. The default username is
    `ubuntu`.

    ```shell
    ssh -i </path/to/private/key> ubuntu@<vm-ip-or-domain>
    ```

    Consider the following command example for reference.

    ```shell
    ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
    ```

    :::tip

    Alternatively, you can use any Linux x86-64 system that has the Docker daemon and Palette CLI installed, as well as
    connectivity to the VMware vSphere environment where Palette will be deployed.

    :::

2.  Set your Palette CLI encryption passphrase value in an environment variable. Use the following command to set the
    passphrase. Replace `*************` with your passphrase.

    ```shell
    export PALETTE_ENCRYPTION_PASSWORD=*************
    ```

3.  Invoke the Palette CLI by using the `ec` command to install the enterprise cluster. The interactive CLI prompts you
    for configuration details and then initiates the installation. For more information about the `ec` subcommand, refer
    to [Palette Commands](../../../../automation/palette-cli/commands/commands.md).

    ```bash
    palette ec install
    ```

    :::warning

    If you deployed the airgap support VM using a generic OVA, the Palette CLI may not be in the `usr/bin` path. Ensure
    that you complete step **22** of the [Environment Setup](./environment-setup/vmware-vsphere-airgap-instructions.md)
    guide, which installs the Palette airgap binary and moves the Palette CLI to the correct path.

    :::

4.  At the **Enterprise Cluster Type** prompt, choose **Palette**.

5.  Type `y` if you want to use Ubuntu Pro. Otherwise, type `n`. If you choose to use Ubuntu Pro, you will be prompted
    to enter your Ubuntu Pro token.

6.  Choose `VMware vSphere` as the cloud type. This is the default.

7.  Type an enterprise cluster name, or use the default value. Your VM instances will use this name as a prefix.

8.  When prompted, enter the information listed in each of the following tables.

    #### Environment Configuration

    | **Parameter**                     | **Description**                                                                                                                                                                                                                                                                                               |
    | :-------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **HTTPS Proxy**                   | Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                            |
    | **HTTP Proxy**                    | Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all EC nodes and all of its target cluster nodes. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                              |
    | **No Proxy**                      | You will be prompted to provide a list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: `my.company.com,10.10.0.0/16`     |
    | **Proxy CA Certificate Filepath** | The default is blank. You can provide the filepath of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`. |
    | **Pod CIDR**                      | Enter the CIDR pool IP that will be used to assign IP addresses to pods in the EC cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                                     |
    | **Service IP Range**              | Enter the IP address range that will be used to assign IP addresses to services in the EC cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                         |

9.  Fill out the registry configuration details. If you are using the Palette CLI from inside an airgap support VM, the
    CLI will automatically detect the airgap environment and prompt you to **Use local, air-gapped Pack Registry?** Type
    `y` to use the local resources and skip filling in the OCI registry URL and credentials. Otherwise, you will need to
    provide the OCI registry configuration values for your pack and image registry.

    :::warning

    For self-hosted OCI registries, ensure you have the server Certificate Authority (CA) certificate file available on
    the host where you are using the Palette CLI. You will be prompted to provide the file path to the OCI CA
    certificate. Failure to provide the OCI CA certificate will result in self-linking errors. Refer to the
    [Self-linking Error](../../../../troubleshooting/enterprise-install.md#scenario---self-linking-error)
    troubleshooting guide for more information.

    :::

    The table below provides information in the event you are using another OCI registry for packs, images, and the
    Spectro manifest.

    #### Pack & Image Registry Configuration

    | **Parameter**                                    | **Description**                                                                                                                                  |
    | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Registry Type**                                | Specify the type of registry. Allowed values are `OCI` or `OCI ECR`. Airgap users, select `OCI`.                                                 |
    | **Registry Name**                                | Enter the name of the registry.                                                                                                                  |
    | **Registry Endpoint**                            | Enter the registry endpoint. Airgap users, provide the **Spectro Cloud Repository** URL or hostname shared by the airgap setup script.           |
    | **Registry Base Path**                           | Enter the registry base path.                                                                                                                    |
    | **Allow Insecure Connection**                    | Bypasses x509 verification. Type `n` to specify a certificate authority in the follow-up prompt. Airgap user, ensure you select `n`.             |
    | **Registry CA certificate filepath**             | Specify the file path to the certificate authority. Use absolute paths. Airgap users, provide the filepath displayed by the airgap setup script. |
    | **Registry Username** or **Registry Access Key** | Enter the registry username or the access key if using `OCI ECR`.                                                                                |
    | **Registry Password** or **Registry Secret Key** | Enter the registry password or the secret key if using `OCI ECR`.                                                                                |
    | **Registry Region**                              | Enter the registry region. This option is only available if you are using `OCI ECR`.                                                             |
    | **ECR Registry Private**                         | Type `y` if the registry is private. Otherwise, type `n`.                                                                                        |
    | **Use Public Registry for Images**               | Airgap users, select `n` so that you can specify the values for the OCI registry that contains all the required images.                          |

        	When prompted to **Pull images from public registry**, type `n` and specify the OCI registry configuration values for
        	your image registry. If you are on an airgap support VM, the CLI will automatically detect the airgap environment and prompt you to **Use local, air-gapped Image Registry?** Type `y` to use the local resources and skip filling in the OCI registry URL and credentials.
        Refer to the table above for more information.

10. When prompted to **Pull images from public registry**, type `n`.

11. For the **Use the same OCI Registry for packs & images?** prompt, type `n`.

12. For the **Use local, air-gapped Image Registry?** prompt, type `y`

    :::info

    You will be provided with an opportunity to update the mirror registries values. To exit `vi` press the `Escape` key
    and type `:wq` to save and exit.

    :::

13. The next set of prompts asks for the VMware vSphere account information. Enter the information listed in the table
    below.

    #### VMware vSphere Account Information

    | **Parameter**                 | **Description**                                                                                                                                                                               |
    | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **vSphere Endpoint**          | VMware vSphere endpoint. Must be a fully qualified domain name (FQDN) or IP address without a scheme - that is, without an IP protocol, such as `https://`. Example: `vcenter.mycompany.com`. |
    | **vSphere Username**          | VMware vSphere account username.                                                                                                                                                              |
    | **vSphere Password**          | VMware vSphere account password.                                                                                                                                                              |
    | **Allow Insecure Connection** | Bypasses x509 verification. Type `Y` if using a VMware vSphere instance with self-signed Transport Layer Security (TLS) certificates. Otherwise, type `n`.                                    |

    #### VMware vSphere Cluster Configuration

    This information determines where Palette will be deployed in your VMware vSphere environment. The Palette CLI will
    use the provided VMware credentials to retrieve information from your VMware vSphere environment and present options
    for you to select from.

    | **Parameter**             | **Description**                                                                                                                                                                                                                                                                                                           |
    | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Datacenter**            | The installer retrieves the data center automatically.                                                                                                                                                                                                                                                                    |
    | **Folder**                | Select the folder that contains the VM instance.                                                                                                                                                                                                                                                                          |
    | **Image Template Folder** | Select the folder that contains the CAPI image templates.                                                                                                                                                                                                                                                                 |
    | **Cluster**               | Select the cluster where you want to deploy Palette.                                                                                                                                                                                                                                                                      |
    | **Network**               | Select the network where you want to deploy Palette.                                                                                                                                                                                                                                                                      |
    | **Resource Pool**         | Select the resource pool where you want to deploy Palette.                                                                                                                                                                                                                                                                |
    | **Datastore**             | Select the datastore where you want to deploy Palette.                                                                                                                                                                                                                                                                    |
    | **Fault Domains**         | Configure one or more fault domains by selecting values for these properties: Cluster, Network (with network connectivity), Resource Pool, and Storage Type (Datastore or VM Storage Policy). Note that when configuring the Network, if you are using a distributed switch, choose the network that contains the switch. |
    | **NTP Servers**           | You can provide a list of Network Time Protocol (NTP) servers.                                                                                                                                                                                                                                                            |
    | **SSH Public Keys**       | Provide any public SSH keys to access your Palette VMs. This option opens up your system's default text editor. Vi is the default text editor for most Linux distributions. To review basic vi commands, check out the [vi Commands](https://www.cs.colostate.edu/helpdocs/vi.html) reference.                            |

14. Specify the IP pool configuration. The placement type can be Static or Dynamic Host Configuration Protocol (DHCP).
    Choosing static placement creates an IP pool from which VMs are assigned IP addresses. Choosing DHCP assigns IP
    addresses using DNS.

    #### Static Placement Configuration

    | **Parameter**                   | **Description**                                                                             |
    | ------------------------------- | ------------------------------------------------------------------------------------------- |
    | **IP Start range**              | Enter the first address in the EC IP pool range.                                            |
    | **IP End range**                | Enter the last address in the EC IP pool range.                                             |
    | **Network Prefix**              | Enter the network prefix for the IP pool range. Valid values are in [0, 32]. Example: `18`. |
    | **Gateway IP Address**          | Enter the IP address of the static IP gateway.                                              |
    | **Name servers**                | Comma-separated list of DNS name server IP addresses.                                       |
    | **Name server search suffixes** | An optional comma-separated list of DNS search domains.                                     |

15. The last set of prompts are for the vSphere machine and database configuration. Use the following table for
    guidance.

    #### vSphere Machine Configuration

    | **Parameter** | **Description**                                                                                                                                                             |
    | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Small**     | Deploy VM nodes with 8 CPU, 16 GB memory, 60 GB storage. The database specs are 20 GB database with 2 CPU limit and 4 GB memory limit.                                      |
    | **Medium**    | Deploy VM nodes with 16 CPU, 32 GB memory, 100 GB storage. The database specs are 60 GB database with a 4 CPU limit and 8 GB memory limit.                                  |
    | **Large**     | Deploy VM nodes with 32 CPU, 64 GB memory, 120 GB storage. The database specs are 80 GB database with 8 CPU limit and 16 GB memory limit.                                   |
    | **Custom**    | Deploy VM nodes with custom CPU, memory, storage, database size, CPU limit, and memory limit. If you specify custom, you will be prompted for the CPU, memory, and storage. |

16. The last prompt is for node affinity. Enter `y` to schedule all Palette pods on control plane nodes.

    #### Additional vSphere Machine Configuration

    | **Parameter**     | **Description**                                                                          |
    | ----------------- | ---------------------------------------------------------------------------------------- |
    | **Node Affinity** | Select the node affinity. Enter `y` to schedule all Palette pods on control plane nodes. |

    The installation process stands up a [kind](https://kind.sigs.k8s.io/) cluster locally that will orchestrate the
    remainder of the installation. The installation takes some time to complete.

    The Palette CLI creates a file named `ec.yaml` that contains the information you provided the wizard, and its
    location is displayed in the terminal. Credentials and tokens are encrypted in the YAML file.

    ```bash hideClipboard
    ==== Enterprise Cluster config saved ====
    Location: :/home/spectro/.palette/ec/ec-20230706150945/ec.yaml
    ```

    :::tip

    If an error occurs during the installation, remove the `kind` cluster that was created and restart the process. To
    remove the `kind` cluster, install [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) and issue
    the following command. Replace `spectro-mgmt-cluster` with the name of your cluster if you used a different name.

    ```bash
    kind delete clusters spectro-mgmt-cluster
    ```

    Restart the install process by referencing the `ec.yaml` file that was created during the first installation
    attempt. For example:

    ```bash
    palette ec install --config-file /home/spectro/.palette/ec/ec-20230706150945/ec.yaml
    ```

    :::

    When the installation is complete, Enterprise Cluster Details that include a URL and default credentials are
    displayed in the terminal. You will use these to access the Palette system console.

    ```bash hideClipboard
    ===========================================
    ==== Enterprise Cluster System Console ====
    ===========================================
    Console URL: https://10.10.100.0/system
    Username:    ************
    Password:    ************

    The first of three Enterprise Cluster nodes is online and will now provision nodes two and three.

    It will take another ~30-45 minutes for the installation to complete.

    You can monitor its progress via kubectl/k9s or by viewing the System Console.

    export KUBECONFIG=/ubuntu/.palette/ec/ec-20231012215923/spectro_mgmt.conf
    ```

17. To avoid potential vulnerabilities, once the installation is complete, remove the `kind` images that were installed
    in the environment where you initiated the installation.

    Issue the following command to list all instances of `kind` that exist in the environment.

    ```shell
    docker images
    ```

    ```shell
    REPOSITORY     TAG        IMAGE ID       CREATED        SIZE
    kindest/node   v1.26.13   131ad18222cc   5 months ago   910MB
    ```

    Then, use the following command template to remove all instances of `kind`.

    ```shell
    docker image rm kindest/node:<version>
    ```

    Consider the following example for reference.

    ```shell
    docker image rm kindest/node:v1.26.13
    ```

    ```shell
    Untagged: kindest/node:v1.26.13
    Untagged: kindest/node@sha256:15ae92d507b7d4aec6e8920d358fc63d3b980493db191d7327541fbaaed1f789
    Deleted: sha256:131ad18222ccb05561b73e86bb09ac3cd6475bb6c36a7f14501067cba2eec785
    Deleted: sha256:85a1a4dfc468cfeca99e359b74231e47aedb007a206d0e2cae2f8290e7290cfd
    ```

18. Log in to the system console using the credentials provided in the Enterprise Cluster Details output. After login,
    you will be prompted to create a new password. Enter a new password and save your changes. Refer to the
    [password requirements](../../../system-management/account-management/credentials.md#password-requirements-and-security)
    documentation page to learn more about the password requirements.

    Use the username `admin` and your new password to log in to the system console. You can create additional system
    administrator accounts and assign roles to users in the system console. Refer to the
    [Account Management](../../../system-management/account-management/account-management.md) documentation page for
    more information.

    :::info

    The first time you visit the Palette system console, a warning message about an untrusted SSL certificate may
    appear. This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning
    message and proceed.

    :::

    ![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.webp)

19. Log in to the system console using the credentials provided in the Enterprise Cluster Details output. After login,
    you will be prompted to create a new password. Enter a new password and save your changes. You will be redirected to
    the Palette system console.

20. After login, a Summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a
    different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority
    files to Palette. You can upload the files using the Palette system console. Refer to the
    [Configure HTTPS Encryption](../../../system-management/ssl-certificate-management.md) page for instructions on how
    to upload the SSL certificate files to Palette.

21. The last step is to start setting up a tenant. To learn how to create a tenant, check out the
    [Tenant Management](../../../system-management/tenant-management.md) guide.

    ![Screenshot of the Summary page showing where to click Go to Tenant Management button.](/palette_installation_install-on-vmware_goto-tenant-management.webp)

    :::warning
    
    If Palette has only one tenant and you use local accounts without Single Sign-On (SSO), you can access Palette using the IP address or any domain name that resolves to that IP. However, once you enable SSO, users must log in using the tenant-specific subdomain. For example, if you create a tenant named tenant1 and the domain name you assigned to Palette is `palette.example.com`, the tenant URL will be `tenant1.palette.example.com`. We recommend you create an additional wildcard DNS record to map all tenant URLs to the Palette VerteX load balancer. For example, `*.palette.example.com`.
    
    :::

## Validate

You can verify the installation is successful if you can access the system console using the IP address provided in
Enterprise Cluster Details and if the Summary page displays the **Go to Tenant Management** button.

You can also validate that a three-node Kubernetes cluster is launched and Palette is deployed on it.

1. Log in to the vCenter Server by using vSphere Client.

2. Navigate to your vSphere data center and locate your Palette VM instances. The VMs are prefixed with the name you
   provided during the installation. For example, if you provided `spectro-mgmt-cluster` as the name, the VMs are named
   `spectro-mgmt-cluster-`, followed by a unique set of alphanumeric values. Verify three nodes are available.

3. Open a web browser session, and use the IP address provided in Enterprise Cluster Details at the completion of the
   installation to connect to the Palette system console. Copy the IP address to the address bar and append `/system`.

4. Log in using your credentials.

5. A **Summary** page will be displayed that contains a tile with a **Go to Tenant Management** button. After initial
   installation, the **Summary** page shows there are zero tenants.

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="Palette" version="Palette" />

## Resources

- [Palette CLI](../../../../automation/palette-cli/install-palette-cli.md#download-and-setup)

- [VMware System Requirements](../vmware-system-requirements.md)

- [System Management](../../../system-management/system-management.md)

- [Enterprise Install Troubleshooting](../../../../troubleshooting/enterprise-install.md)
