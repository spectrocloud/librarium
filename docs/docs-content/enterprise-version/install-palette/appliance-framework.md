---
title: "Appliance Framework for Self-Hosted Palette"
sidebar_label: "Appliance Framework"
description: "Learn how to deploy self-hosted Palette to your environment using the Appliance Framework"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["appliance framework", "self-hosted", "enterprise"]
sidebar_position: 0
---

The Appliance Framework is downloadable as an ISO file and is a solution for installing self-hosted Palette on your
infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is used
to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed, you can download pack bundles to create your cluster profiles. You will then be able to
deploy clusters in your environment.

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Security Technical
Implementation Guides (STIG). The following table displays the infrastructure profile for the self-hosted Palette
appliance.

| **Layer**      | **Component**                              |
| -------------- | ------------------------------------------ |
| **OS**         | Ubuntu: Immutable Kairos and STIG-hardened |
| **Kubernetes** | Palette Kubernetes (PXK): STIG-hardened    |
| **CNI**        | Calico                                     |
| **CSI**        | Piraeus                                    |
| **Registry**   | Zot                                        |

## Supported Platforms

The Appliance Framework self-hosted Palette ISO can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Installation Steps

Follow the instructions to install Palette using the Appliance Framework ISO on your infrastructure platform.

### Prerequisites

- Access to the Palette Artifact Studio to download the Palette Enterprise ISO. Refer to the Artifact Studio (link TBC)
  guide for instructions on how to access and download the ISO.

- A minimum of three nodes must be provisioned in advance for the Palette installation. We recommended the following
  resources for each node. Refer to the Palette [Size Guidelines](./install-palette.md#size-guidelines) for additional
  sizing information.

  - 8 CPUs per node.

  - 16 GB Memory per node.

  - 450 GB Disk Space per node.

    - The disk space must be split between at least two disks, with a minimum of 250 GB for the first disk and 200 GB
      for the second disk. The first disk is used for the ISO stack, and the second disk is used for the storage pool.

- The following network ports must be accessible on each node for Palette to operate successfully.

  - TCP/443: Must be open between all Palette nodes and accessible for user connections to the Palette management
    cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed cluster's Kubernetes API server.

- SSH access must be available to the nodes used for Palette installation.

- Relevant permissions to install Palette on the nodes including permission to attach or mount an ISO and set nodes to
  boot from it.

- If you plan to use an external registry instead of the internal Zot registry that comes with Palette, you must provide
  the following external registry credentials during the Palette installation process:

  - The DNS/IP endpoint and port for the external registry.
  - The username for the registry.
  - The password for the registry.
  - The certificate for the registry used for TLS encryption.
  - The private key for the registry certificate used for TLS encryption.
  - (Optional) The Certificate Authority (CA) certificate that was used to sign the registry certificate.

  Ensure the nodes used to host the Palette management cluster have access to the external registry server.

- If you choose to use the internal Zot registry, you will need to provide the following TLS certificates and keys in
  Base64 format during the Palette installation process:

  - A private key for the Zot registry certificate.
  - A certificate for the Zot registry.
  - (Optional) A CA certificate for the Zot registry that was used to sign the registry certificate.

- If you have an [Ubuntu Pro](https://ubuntu.com/pro) subscription, you can provide the Ubuntu Pro token during the
  Palette installation process. This is optional but recommended for security and compliance purposes.

- A virtual IP address (VIP) must be available for the Palette management cluster. This is assigned during the Palette
  installation process and is used for load balancing and high availability. The VIP must be accessible to all nodes in
  the Palette management cluster.

  <details>

  <summary> How to discover free VIPs in your environment </summary>

  You can discover free VIPs in your environment by using a tool like `arping` or `nmap`. For example, you can issue the
  following command to probe a CIDR block for free IP addresses.

  ```bash
  nmap --unprivileged -sT -Pn 10.10.200.0/24
  ```

  This command will scan the CIDR block and output any hosts it finds.

  ```shell hideClipboard title="Example nmap output"
  Nmap scan report for test-worker-pool-cluster2-6655ab7a-tyuio.company.dev (10.10.200.2)
  Host is up.
  All 1000 scanned ports on test-worker-pool-cluster2-6655ab7a-tyuio.company.dev (10.10.200.2) are in ignored states.
  Not shown: 1000 filtered tcp ports (no-response)
  ```

  For any free IP addresses, you can use `arping` to double-check if the IP is available.

  ```bash title="Example arping command"
  arping -D -c 4 10.10.200.101
  ```

  ```shell hideClipboard title="Example arping output"
  ARPING 10.10.200.101 from 0.0.0.0 ens103
  Sent 4 probes (4 broadcast(s))
  Received 0 response(s)
  ```

  If you receive no responses like the example output above, the IP address is likely free.

  </details>

### Install Palette

1. Download the Palette Enterprise ISO from the Artifact Studio. Refer to the Artifact Studio (link TBC) guide for
   instructions on how to access and download the ISO.

2. Upload the ISO to your infrastructure provider. This can be done using the web interface of your infrastructure
   provider or using command-line tools.

   - For VMware vSphere, you can upload the ISO to a datastore using the vSphere Client or the `govc` CLI tool.
   - For Bare Metal, you can use tools like `scp` or `rsync` to transfer the ISO to the nodes, or use a USB drive to
     boot the nodes from the ISO.
   - For Machine as a Service (MAAS), you can use the MAAS web interface to upload the ISO.

   Ensure that the ISO is accessible to all nodes that will be part of the Palette management cluster.

3. Boot each node from the ISO to install the necessary software for Palette. The installation process will
   automatically configure the nodes with the required components, including the operating system, Kubernetes, CNI, and
   CSI.

4. Once the nodes have booted from the ISO, they will automatically start the installation process. The GRand Unified
   Bootloader (GRUB) screen may be displayed with selectable options, this should be ignored as the installation will
   proceed automatically.

   Wait for the installation process to complete. This will take at least 15 minutes, depending on the resources
   available on the nodes. After completion, the nodes will reboot and display the Palette Terminal User Interface
   (TUI).

5. Log in to the nodes using the default credentials for Kairos Ubuntu. The default username is `kairos` and the
   password is `kairos`.

6. In the Palette TUI, configure the nodes as per your environment requirements. Use the Tab key or the up and down
   arrow keys to switch between fields. When you make a change, press **Enter** to apply the change. Use **Esc** to
   back.

7. In **Hostname**, check the existing hostname and, optionally, change it to a new one.

8. In **Host Network Adapters**, select a network adapter you'd like to configure. By default, the network adapters
   request an IP automatically from the Dynamic Host Configuration Protocol (DHCP) server. The CIDR block of an
   adapter's possible IP address is displayed in the **Host Network Adapters** screen without selecting an individual
   adapter.

   In the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you will need to provide a static IP address, subnet mask, as well as the
   address of the default gateway. Specifying a static IP will remove the existing DHCP settings.

   You can also specify the Maximum Transmission Unit (MTU) for your network adapter. The MTU defines the largest size,
   in bytes, of a packet that can be sent over a network interface without needing to be fragmented.

9. In **DNS Configuration**, specify the IP address of the primary and alternate name servers. You can optionally
   specify a search domain.

10. After you are satisfied with the configurations, navigate to **Quit** and press **Enter** to finish the
    configuration. Press **Enter** again on the confirmation prompt.

    After a few seconds, the terminal displays the **Device Info** and prompts you to provision the device through the
    Local UI.

11. Ensure you complete the configuration on each node before proceeding to the next step.

12. Decide on the host that you plan to use as the leader of the group. Refer to
    [Link Hosts](../../clusters/edge/local-ui/cluster-management/link-hosts.md#leader-hosts) for more information about
    leader hosts.

13. Access the Local UI of the leader host. The Local UI is used to manage the Palette nodes and perform administrative
    tasks. It provides a web-based interface for managing the Palette management cluster.

    In your web browser, go to `https://<node-ip>:5080`. Replace `<node-ip>` with the IP address of your node. If you
    have changed the default port of the console, replace `5080` with the Local UI port. The address of Local UI console
    is also displayed on the terminal screen of the node.

    If you are accessing the Local UI for the first time, a security warning may be displayed in your web browser. This
    is because the Local UI uses a self-signed certificate. You can safely ignore this warning and proceed to the Local
    UI.

14. Log in to Local UI using the default credentials. The default username is `kairos` and the password is `kairos`. You
    can change the password after logging in.

15. Click the username drop-down menu in the top right corner and select **Update password**. Provide the **Old
    Password** as `kairos`, and set a new password in the **New Password** field. This will be the password you use to
    log in to Local UI in the future.

16. (Optional) If you need to configure a HTTP proxy server for the node, follow the steps in the
    [Configure HTTP-Proxy in Local UI](../../clusters/edge/local-ui/host-management/configure-proxy.md) guide. When
    done, proceed to the next step.

17. From the left main menu, click **Linked Edge Hosts**.

18. Click **Generate token**. This will make the host start generating tokens you will use to link this host with other
    hosts. The base-64 encoded token contains the IP address of the host, as well as an OTP that will expire in two
    minutes. Once a token expires, the leader generates another token automatically.

19. Click the **Copy** button to copy the token.

20. Log in to Local UI on the host that you want to link to the leader host.

21. From the left main menu, click **Linked Edge Hosts**.

22. Click **Link this device to another**.

23. In the pop-up box that appears, enter the token you copied from the leader host.

24. Click **Confirm**.

25. Repeat steps 20-24 for every host you want to link to the leader host.

26. Confirm that all linked hosts appear in the **Linked Edge Hosts** table. The following columns should show the
    required statuses:

    - **Status** = Ready
    - **Content** = Synced
      - Content synchronization will take at least five minutes to complete dependant on your network resources.
    - **Health** = Healthy

27. On the left main menu, click **Cluster**.

28. Click **Create cluster**.

29. For **Basic Information**, provide a name for the cluster and optional tags in `key:value` format.

30. In **Cluster Profile**, the **Imported Applications preview** section displays the applications that are included
    with the Appliance Framework. These applications are pre-configured and used to deploy your Palette management
    cluster.

    Leave the default options in place and click **Next**.

31. In **Profile Config**, configure the cluster profile settings to your requirements. Review the following tables for
    the available options.

    #### Cluster Profile Options

    | **Option**                        | **Description**                                                                                                                                 | **Type**      | **Default**          |
    | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------- |
    | **Pod CIDR**                      | The CIDR range for the pod network. This is used to allocate IP addresses to pods in the cluster.                                               | CIDR notation | **`192.168.0.0/16`** |
    | **Service CIDR**                  | The CIDR range for the service network. This is used to allocate IP addresses to services in the cluster.                                       | CIDR notation | **`192.169.0.0/16`** |
    | **Ubuntu Pro Token (Optional)**   | The token for your [Ubuntu Pro](https://ubuntu.com/pro) subscription.                                                                           | String        | _No default_         |
    | **Storage Pool Drive (Optional)** | The storage pool device to use for the cluster. As mentioned in the [Prerequisites](#prerequisites), assign this to your second storage device. | String        | **`/dev/sdb`**       |

    #### Registry Options

    | **Option**                                    | **Description**                                                                                                                                                                                                     | **Type**              | **Default**                               |
    | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- |
    | **OCI Registry Base Content Path (Optional)** | The base path for the registry content for the internal or external registry. Palette packs will be stored in this directory.                                                                                       | String                | **`spectro-content`**                     |
    | **Registry Username**                         | If using the internal Zot registry, you leave the default username or adjust to your requirements. If using an external registry, provide the appropriate username.                                                 | String                | **`admin`**                               |
    | **OCI Pack Registry Password**                | If using the internal Zot registry, change the password to your requirements. If using an external registry, provide the appropriate password.                                                                      | String                | **`Spectro@123`**                         |
    | **OCI Pack Registry Ca Cert (Optional)**      | The CA certificate that was used to sign the registry certificate.                                                                                                                                                  | Base64 encoded string | _No default_                              |
    | **Root Domain (Optional)**                    | The root domain for the registry. The default is set for the internal Zot registry, which is a virtual IP address assigned by [kube-vip](https://kube-vip.io/). Adjust if using an external registry.               | String                | **`{{.spectro.system.cluster.kubevip}}`** |
    | **Mongo Replicas (Optional)**                 | The number of MongoDB replicas to create for the cluster. This is used to provide high availability for the MongoDB database. The accepted values are **1** or **3**.                                               | Integer               | **`3`**                                   |
    | **Registry Port**                             | The port for the registry. The default value can be changed for the internal Zot registry. Adjust if using an external registry.                                                                                    | Integer               | **`30003`**                               |
    | **Registry Private Cert Key**                 | The private key for the registry certificate used for TLS encryption.                                                                                                                                               | Base64 encoded string | _No default - must be provided_           |
    | **Registry Cert**                             | The certificate for the registry used for TLS encryption.                                                                                                                                                           | Base64 encoded string | _No default - must be provided_           |
    | **Registry Endpoint**                         | The DNS/IP endpoint for the registry. Leave the default entry if using the internal Zot registry, which is a virtual IP address assigned by [kube-vip](https://kube-vip.io/). Adjust if using an external registry. | String                | **`{{.spectro.system.cluster.kubevip}}`** |
    | **In Cluster Registry (Optional)**            | **True** = use internal Zot registry, **False** = use external registry.                                                                                                                                            | Boolean               | **True**                                  |
    | **Image Replacement Rules (Optional)**        | Set rules for replacing image references when using an external registry. For example, `old-registry.com/new-registry.com`. Leave empty if using the internal Zot registry.                                         | String                | _No default_                              |

32. Click **Next** when you are done.

33. In **Cluster Config**, configure the following options.

    #### Cluster Config Options

    | **Option**                                 | **Description**                                                                                | **Type** | **Default**  |
    | ------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------- | ------------ |
    | **Network Time Protocol (NTP) (Optional)** | The NTP servers to synchronize time within the cluster.                                        | String   | _No default_ |
    | **SSH Keys (Optional)**                    | The public SSH keys to access the cluster nodes. Add additional keys by clicking **Add Item**. | String   | _No default_ |
    | **Virtual IP Address (VIP)**               | The virtual IP address for the cluster. This is used for load balancing and high availability. | String   | _No default_ |

    Click **Next** when you are done.

34. In **Node Config**, configure the following options.

    :::important

    It is recommended to have at least three control plane nodes for high availability. You can remove the worker node
    pool as it is not required for the Palette management cluster. If doing this, ensure that the **Allow worker
    capability** option is enabled for the control plane node pool.

    :::

    #### Node Pool Options

    <Tabs>

    <TabItem value="control-plane-pool-options" label="Control Plane Pool Options">

    | **Option**                                       | **Description**                                                                                                                                                       | **Type**                                             | **Default**              |
    | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------ |
    | **Node pool name**                               | The name of the control plane node pool. This will be used to identify the node pool in Palette.                                                                      | String                                               | **`control-plane-pool`** |
    | **Allow worker capability (Optional)**           | Whether to allow workloads to be scheduled on this control plane node pool. Ensure that this is enabled if no worker pool is assigned to the cluster.                 | Boolean                                              | **True**                 |
    | **Additional Kubernetes Node Labels (Optional)** | Tags for the node pool in `key:value` format. These tags can be used to filter and search for node pools in Palette.                                                  | String                                               | _No default_             |
    | **Taints**                                       | Taints for the node pool in `key=value:effect` format. Taints are used to prevent pods from being scheduled on the nodes in this pool unless they tolerate the taint. | Key = string, Value = string, Effect = string (enum) | _No default_             |

    </TabItem>

    <TabItem value="worker-pool-options" label="Worker Pool Options">

    | **Option**                                       | **Description**                                                                                                                                                       | **Type**                                             | **Default**       |
    | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------- |
    | **Node pool name**                               | The name of the worker node pool. This will be used to identify the node pool in Palette.                                                                             | String                                               | **`worker-pool`** |
    | **Additional Kubernetes Node Labels (Optional)** | Tags for the node pool in `key:value` format. These tags can be used to filter and search for node pools in Palette.                                                  | String                                               | _No default_      |
    | **Taints**                                       | Taints for the node pool in `key=value:effect` format. Taints are used to prevent pods from being scheduled on the nodes in this pool unless they tolerate the taint. | Key = string, Value = string, Effect = string (enum) | _No default_      |

    </TabItem>

    </Tabs>

    ##### Pool Configuration

    The following options are available for both the control plane and worker node pools. You can configure these
    options to your requirements. You can also remove worker pools if not needed.

    | **Option**               | **Description**                                                                                                                                                                           | **Type**      | **Default**                                                                                      |
    | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
    | **Architecture**         | The CPU architecture of the nodes. This is used to ensure compatibility with the applications running on the nodes.                                                                       | String (enum) | **`amd64`**                                                                                      |
    | **Add Edge Hosts**       | Click **Add Item** and select the other hosts that you installed using the Appliance Framework ISO. These hosts will be added to the node pool. Each pool must contain at least one node. | N/A           | - **Control Plane Pool** = _Current host selected_ <br /> - **Worker Pool** = _No host selected_ |
    | **NIC Name**             | The name of the network interface card (NIC) to use for the nodes. Leave on **Auto** to let the system choose the appropriate NIC, or select one manually from the drop-down menu.        | N/A           | **Auto**                                                                                         |
    | **Host Name (Optional)** | The hostname for the nodes. This is used to identify the nodes in the cluster. A generated hostname is provided automatically, and you can adjust to your requirements.                   | String        | **`edge-*`**                                                                                     |

35. Click **Next** when you are done.

36. In **Review**, check that your configuration is correct. If you need to make changes, click on any of the sections
    in the left sidebar to go back and edit the configuration.

    When you are satisfied with your configuration, click **Deploy Cluster**. This will start the cluster creation
    process.

    The cluster creation process will take 20-30 minutes to complete. You can monitor progress from the **Overview** tab
    on the **Cluster** page in the left main menu. The cluster is fully provisioned when the status changes to
    **Running** and the health status is **Healthy**.

37. Once the cluster is provisioned, access the Palette system console using the virtual IP address (VIP) you configured
    earlier. Open your web browser and go to `https://<vip-address>/system`. Replace `<vip-address>` with the VIP you
    configured for the cluster.

    The first time you visit the system console, a warning message about an untrusted TLS certificate may appear. This
    is expected, as you have not yet uploaded your TLS certificate. You can ignore this warning message and proceed.

38. You will be prompted to log in to Palette system console. Use `admin` as the username and `admin` as the password.
    You will change the password after logging in.

39. In the **Account Info** window, provide the following information:

    - **Email address** - This is used for notifications and password recovery as well as logging in to the Palette
      system console.
      - This will not be active until you [configure SMTP settings](../system-management/smtp.md) in Palette system
        console and verify your email address.
    - **Current password** - Use `admin` as the current password.
    - **New password** - Enter a new password for the account.
    - **Confirm new password** - Re-enter the new password for confirmation.

    Refer to
    [Password Requirements and Security](../system-management/account-management/credentials.md#password-requirements-and-security)
    to learn about password requirements.

After login, a summary page is displayed. You now have access to the Palette system console, where you can manage your
Palette environment.

If you are accessing the Palette system console for the first time, a security warning may be displayed in your web
browser. This is because Palette is configured with a self-signed certificate. You can replace the self-signed
certificate with your own SSL certificates as guided later in [Next Steps](#next-steps).

### Validate

1. Log in to the Local UI of the leader host using the URL `https://<node-ip>:5080`. Replace `<node-ip>` with the IP
   address of the leader host. If you have changed the default port of the console, replace `5080` with the Local UI
   port.

2. In the Local UI, click on **Cluster** in the left main menu.

3. Check that the cluster status is **Running** and the health status is **Healthy**. In the **Applications** section on
   this page, the listed applications should be in the **Running** state.

4. Log in to the Palette system console using the virtual IP address (VIP) you configured earlier. Open your web browser
   and go to `https://<vip-address>/system`. Replace `<vip-address>` with the VIP you configured for the cluster.

5. On the login page, use `admin` as the username and the new password you set during the initial login.

6. On the **Summary** page, check that the **On-prem system console is healthy** message is displayed.

## Upload Packs to Palette

Follow the instructions to upload packs to your Palette instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy clusters in your environment.

### Prerequisites

- Access to the Palette Artifact Studio to download the Palette Enterprise pack bundles. Refer to the Artifact Studio
  (link TBC) guide for instructions on how to access and download the bundles.

- Access to the Local UI of the leader node of the Palette management cluster.

  - Ensure your local machine has access to the Local UI of the Palette management cluster as airgapped environments may
    have strict network polices that prevent direct access to the Palette management cluster.

### Upload Packs

1. Navigate to the Artifact Studio through a web browser and click the **Build bundle** option.

2. Ensure to select the **Palette Enterprise Appliance** product on the **Product selection** step and build your pack
   bundles by following the prompts in the Artifact Studio.

   Refer to the Artifact Studio (link TBC) guide for detailed guidance on how to build pack bundles and verify the
   integrity of the downloaded files.

3. Download the pack bundles to your local machine. Each pack is downloaded in `.zst` format.

4. Log in to the Local UI of the leader host of the Palette management cluster. By default, the Local UI is accessible
   at `https://<node-ip>:5080`. Replace `<node-ip>` with the IP address of the leader host.

5. From the left main menu, click **Content**.

6. Click **Actions** in the top right and select **Upload Content** from the drop-down menu.

7. Click the upload icon to open the file selection dialog and select the downloaded pack ZST files from your local
   machine. You can select multiple files at once. Alternatively, you can drag and drop the files into the upload area.

   The upload process will start automatically once the files have been selected. You can monitor the upload progress in
   the **Upload Content** dialog.

   Wait for the **Upload Successful** confirmation message to appear.

### Validate

1. Log in to the Local UI of the leader host of the Palette management cluster.

2. From the left main menu, click **Content**.

3. Enter the filename of the uploaded pack in the **Filter by name** search bar. The pack should appear in the table
   below. You can repeat this step for each pack you uploaded.

## Next Steps

The following actions are recommended after installing Palette to ensure your environment is ready for use:

- Assign your SSL certificates to Palette. Palette is installed with a self-signed SSL certificate. To assign a
  different SSL certificate, upload the certificate, key, and certificate authority files to Palette. You can upload the
  files using the system console. Refer to the
  [Configure HTTPS Encryption](../system-management/ssl-certificate-management.md) page for instructions on how to
  upload the SSL certificate files to Palette.

- Create a tenant in Palette to host your users. Refer to the
  [Create a Tenant](../system-management/tenant-management.md) guide for instructions on how to create a tenant in
  Palette.

- Activate your Palette installation before the trial mode expires. Refer to the
  [Activate Palette](../activate-installation/activate-installation.md) guide for instructions on how to activate your
  installation.

- Create additional system administrator accounts and assign roles to users in the system console. Refer to the
  [Account Management](../system-management/account-management/account-management.md) guide for instructions on how to
  manage user accounts and roles in Palette.

- Configure SMTP settings to enable email notifications and password recovery. Refer to the
  [Configure SMTP Settings](../system-management/smtp.md) guide for instructions on how to configure SMTP settings in
  Palette.

For all system management options in Palette, refer to the
[System Management](../system-management/system-management.md) guide.
